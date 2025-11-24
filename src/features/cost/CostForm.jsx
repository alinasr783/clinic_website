import { useState, useEffect } from "react";
import Button from "../../components/Button";

const SERPAPI_KEY = import.meta.env.VITE_SERPAPI_KEY;

// Basic city -> IATA mapping (English & Arabic) for common inputs
const CITY_TO_IATA = {
  // Egypt
  "CAIRO": "CAI", "القاهرة": "CAI",
  // USA / Canada
  "NEW YORK": "JFK", "نيويورك": "JFK",
  "TORONTO": "YYZ", "تورنتو": "YYZ",
  "LOS ANGELES": "LAX", "لوس انجلوس": "LAX",
  "CHICAGO": "ORD", "شيكاغو": "ORD",
  // Europe
  "LONDON": "LHR", "لندن": "LHR",
  "PARIS": "CDG", "باريس": "CDG",
  "FRANKFURT": "FRA", "فرانكفورت": "FRA",
  "MUNICH": "MUC", "ميونخ": "MUC",
  "AMSTERDAM": "AMS", "أمستردام": "AMS",
  "ROME": "FCO", "روما": "FCO",
  "MILAN": "MXP", "ميلانو": "MXP",
  "MADRID": "MAD", "مدريد": "MAD",
  "BARCELONA": "BCN", "برشلونة": "BCN",
  "ZURICH": "ZRH", "زيورخ": "ZRH",
  "GENEVA": "GVA", "جنيف": "GVA",
  "VIENNA": "VIE", "فيينا": "VIE",
  "ATHENS": "ATH", "أثينا": "ATH",
  // Middle East
  "DUBAI": "DXB", "دبي": "DXB",
  "ABU DHABI": "AUH", "أبوظبي": "AUH",
  "DOHA": "DOH", "الدوحة": "DOH",
  "RIYADH": "RUH", "الرياض": "RUH",
  "JEDDAH": "JED", "جدة": "JED",
  "KUWAIT": "KWI", "الكويت": "KWI",
  "MANAMA": "BAH", "المنامة": "BAH",
  "MUSCAT": "MCT", "مسقط": "MCT",
  // Turkey
  "ISTANBUL": "IST", "اسطنبول": "IST", "إسطنبول": "IST",
  // Asia
  "TOKYO": "HND", "طوكيو": "HND",
  "BEIJING": "PEK", "بكين": "PEK",
  "SHANGHAI": "PVG", "شنغهاي": "PVG",
  // Australia
  "SYDNEY": "SYD", "سيدني": "SYD",
  "MELBOURNE": "MEL", "ملبورن": "MEL",
};

function CostForm() {
  const [formData, setFormData] = useState({
    departureAirport: "",
    destination: "Cairo",
    departureDate: "",
    returnDate: "",
    treatmentType: "",
    accommodationLevel: "Budget",
  });

  const [totalCost, setTotalCost] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [flightError, setFlightError] = useState(null);
  const [cheapestFlight, setCheapestFlight] = useState(null);
  const [flightOptions, setFlightOptions] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [hotelError, setHotelError] = useState(null);
  const [hotelCandidates, setHotelCandidates] = useState([]);
  const [hotelPicks, setHotelPicks] = useState({ cheapest: null, topRated: null, bestValue: null });
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [isFetchingHotels, setIsFetchingHotels] = useState(false);

  const treatmentOptions = [
    {value: "single-implant", label: "Single Implant", price: 800},
    {
      value: "multiple-implants",
      label: "Multiple Implants (2-6)",
      price: 800,
    },
    {value: "all-on-4", label: "All-on-4", price: 5500},
    {value: "all-on-6", label: "All-on-6", price: 6500},
    {
      value: "full-mouth-upper",
      label: "Full Mouth Implants (Upper)",
      price: 12000,
    },
    {
      value: "full-mouth-lower",
      label: "Full Mouth Implants (Lower)",
      price: 12000,
    },
    {
      value: "full-mouth-rehab",
      label: "Full Mouth Rehabilitation",
      price: 15000,
    },
  ];

  const accommodationLevels = [
  {
    value: "Budget",
    label: "Budget",
    price: 60,
    description: "Typically under $70/night",
    details: "2–3 star hotels or guesthouses — clean rooms, basic amenities, often outside city center.",
  },
  {
    value: "Standard",
    label: "Standard",
    price: 120,
    description: "$80–150/night on average",
    details: "3–4 star hotels — comfortable rooms, good location, breakfast included, modern facilities.",
  },
  {
    value: "Luxury",
    label: "Luxury",
    price: 220,
    description: "$180–350+/night",
    details: "5-star or boutique hotels — premium amenities, sea or city views, fine dining, spa & concierge services.",
  },
  ];


  // Normalize Arabic-Indic digits to ASCII
  function normalizeDigits(input) {
    if (!input) return "";
    const arabicIndicMap = {
      "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4",
      "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
    };
    let out = input.replace(/[٠-٩]/g, (d) => arabicIndicMap[d] || d);
    out = out.replace(/٬/g, "").replace(/٫/g, ".").replace(/،/g, ",");
    return out;
  }

  // Resolve any user input (city name in EN/AR, full string, etc.) into a 3-letter IATA code
  async function resolveDepartureCode(rawInput) {
    const cleaned = normalizeDigits(String(rawInput || "")).trim();
    if (!cleaned) throw new Error("Please enter your departure city or airport.");

    // If there's a 3-letter token anywhere, prefer it
    const directMatch = cleaned.toUpperCase().match(/\b[A-Z]{3}\b/);
    if (directMatch) return directMatch[0];

    // Try simple dictionary (supports English/Arabic city names)
    const upper = cleaned.toUpperCase();
    if (CITY_TO_IATA[upper]) return CITY_TO_IATA[upper];

    // Fallback disabled for production: require explicit IATA code input
    throw new Error("Unable to resolve departure airport. Please enter a 3-letter IATA code like JFK or LHR.");
  }

async function fetchFlightPrice(departureAirportCode, arrivalAirportCode, departDate, returnDate) {
  // Removed direct requirement of SERPAPI_KEY on client; in production, the serverless function injects the key.
  const codeRegex = /^[A-Za-z]{3}$/;
  if (!codeRegex.test(departureAirportCode)) {
    throw new Error("Invalid departure airport code. Use 3-letter IATA (e.g., JFK, LHR)");
  }
  if (!codeRegex.test(arrivalAirportCode)) {
    throw new Error("Invalid arrival airport code");
  }
  if (!departDate || !returnDate) {
    throw new Error("Missing travel dates");
  }

  // Build query params
  const params = new URLSearchParams({
    engine: "google_flights",
    departure_id: departureAirportCode.toUpperCase(),
    arrival_id: arrivalAirportCode.toUpperCase(),
    outbound_date: departDate,
    return_date: returnDate,
    currency: "USD",
    hl: "en",
  });
  // In local development, append api_key if available to use Vite proxy directly
  if (import.meta.env.DEV && SERPAPI_KEY) {
    params.set("api_key", SERPAPI_KEY);
  }

  const url = `/api/serp/search.json?${params.toString()}`;

  // Verbose logging (without exposing API key in logs)
  console.log("[SerpApi] Request params:", {
    departure_id: departureAirportCode.toUpperCase(),
    arrival_id: arrivalAirportCode.toUpperCase(),
    outbound_date: departDate,
    return_date: returnDate,
    currency: "USD",
    hl: "en",
    api_key_added_in_dev: Boolean(import.meta.env.DEV && SERPAPI_KEY),
  });

  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    const errText = await res.text();
    console.error("[SerpApi] Error response status:", res.status);
    console.error("[SerpApi] Error raw response:", errText);
    throw new Error(`SerpApi request failed: ${res.status} ${errText}`);
  }

  // Log raw response text and parsed JSON for full visibility
  const rawText = await res.clone().text();
  console.log("[SerpApi] Raw response text:", rawText);

  const data = await res.json();
  console.log("[SerpApi] Full response JSON (object):", data);
  console.log("[SerpApi] Full response JSON (stringified):", JSON.stringify(data, null, 2));

  // Prefer structured arrays (best_flights, other_flights) to pick the cheapest valid price
  const structuredCandidates = [];
  const collectFromFlights = (arr, source) => {
    if (!Array.isArray(arr)) return;
    arr.forEach((f) => {
      const p = typeof f?.price === "number" ? f.price : null;
      if (typeof p === "number" && Number.isFinite(p) && p >= 20 && p <= 20000) {
        structuredCandidates.push({ price: p, source, flight: f });
      }
    });
  };
  collectFromFlights(data?.best_flights, "best_flights");
  collectFromFlights(data?.other_flights, "other_flights");
  if (structuredCandidates.length > 0) {
    structuredCandidates.sort((a, b) => a.price - b.price);
    console.log("[SerpApi] Cheapest (structured) candidate:", structuredCandidates[0]);
    return { price: structuredCandidates[0].price, selected: structuredCandidates[0], options: structuredCandidates };
  }

  // Fallback: traverse whole response and collect any "price" fields within a sane range
  const prices = [];
  const pushIfValid = (val) => {
    if (val == null) return;
    if (typeof val === "number" && Number.isFinite(val)) {
      if (val >= 20 && val <= 20000) prices.push(val);
    } else if (typeof val === "string") {
      const match = val.match(/\$?\s*(\d{2,}(?:[.,]\d{3})*(?:[.,]\d+)?)/);
      if (match) {
        const num = parseFloat(match[1].replace(/,/g, ""));
        if (Number.isFinite(num) && num >= 20 && num <= 20000) prices.push(num);
      }
    } else if (Array.isArray(val)) {
      val.forEach(pushIfValid);
    } else if (typeof val === "object") {
      Object.values(val).forEach(pushIfValid);
    }
  };
  const traverse = (obj) => {
    if (!obj) return;
    if (Array.isArray(obj)) {
      obj.forEach(traverse);
      return;
    }
    if (typeof obj === "object") {
      for (const [k, v] of Object.entries(obj)) {
        if (/price/i.test(k)) pushIfValid(v);
        traverse(v);
      }
    }
  };
  traverse(data);
  let value = 0;
  if (prices.length > 0) {
    value = Math.min(...prices);
  }
  if (!Number.isFinite(value) || value <= 0) {
    console.warn("SerpApi returned no valid price candidates. Falling back to 0.");
    value = 0;
  }
  return { price: value, selected: null, options: [] };
}

async function fetchHotelsCairo(checkInDate, checkOutDate) {
  if (!checkInDate || !checkOutDate) {
    throw new Error("Missing hotel dates");
  }
  const params = new URLSearchParams({
    engine: "google_hotels",
    q: "Cairo",
    check_in_date: checkInDate,
    check_out_date: checkOutDate,
    adults: "2",
    currency: "USD",
    gl: "us",
    hl: "en",
  });
  if (import.meta.env.DEV && SERPAPI_KEY) {
    params.set("api_key", SERPAPI_KEY);
  }
  const url = `/api/serp/search.json?${params.toString()}`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`SerpApi hotels failed: ${res.status} ${t}`);
  }
  const data = await res.json();
  const props = Array.isArray(data?.properties) ? data.properties : [];
  const parsePrice = (p) => {
    if (p == null) return null;
    if (typeof p === "number" && Number.isFinite(p)) return p;
    if (typeof p === "string") {
      const m = p.match(/\$?\s*(\d{2,}(?:[.,]\d{3})*(?:[.,]\d+)?)/);
      if (m) {
        const n = parseFloat(m[1].replace(/,/g, ""));
        if (Number.isFinite(n)) return n;
      }
    }
    if (typeof p === "object") {
      if (typeof p.extracted_lowest === "number") return p.extracted_lowest;
      if (typeof p.extracted_before_taxes_fees === "number") return p.extracted_before_taxes_fees;
      if (typeof p.lowest === "string") return parsePrice(p.lowest);
      if (typeof p.before_taxes_fees === "string") return parsePrice(p.before_taxes_fees);
    }
    return null;
  };
  const candidates = [];
  const nightsCalc = (() => {
    const d1 = new Date(checkInDate);
    const d2 = new Date(checkOutDate);
    const n = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
    return Number.isFinite(n) && n > 0 ? n : 1;
  })();

  props.forEach((h) => {
    const name = h?.name || h?.title || "Hotel";
    const nightly = parsePrice(h?.rate_per_night) ?? parsePrice(h?.price) ?? parsePrice(h?.rate_per_room) ?? parsePrice(h?.rates?.[0]?.rate_per_night) ?? parsePrice(h?.prices?.[0]?.rate_per_night);
    const total = parsePrice(h?.total_rate ?? h?.total_price);
    const rating = typeof h?.overall_rating === "number" ? h.overall_rating : (typeof h?.rating === "number" ? h.rating : null);
    const reviews = typeof h?.reviews === "number" ? h.reviews : (typeof h?.reviews_count === "number" ? h.reviews_count : null);
    const location = h?.location || h?.neighborhood || h?.vicinity || null;
    const link = h?.link || h?.serpapi_property_url || h?.google_maps_url || null;
    const pricePerNight = nightly ?? (total ? total / nightsCalc : null);
    if (pricePerNight && pricePerNight > 5 && pricePerNight < 2000) {
      candidates.push({ name, pricePerNight, rating: rating ?? null, reviews: reviews ?? null, location, link });
    }
  });
  if (candidates.length === 0) return { candidates: [], picks: { cheapest: null, topRated: null, bestValue: null } };
  const cheapest = [...candidates].sort((a, b) => a.pricePerNight - b.pricePerNight)[0];
  const withReviews = candidates.filter((c) => (c.reviews ?? 0) >= 20);
  const topRated = (withReviews.length > 0 ? [...withReviews] : [...candidates]).sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))[0];
  const score = (c) => {
    const r = c.rating ?? 0;
    const p = c.pricePerNight;
    return (r * r) / (p || 1);
  };
  const bestValue = [...candidates].sort((a, b) => score(b) - score(a))[0];
  return { candidates, picks: { cheapest, topRated, bestValue } };
}

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateTotalCost = async (e) => {
    e.preventDefault();
    setIsCalculating(true);

    if (
      !formData.departureAirport ||
      !formData.treatmentType ||
      !formData.departureDate ||
      !formData.returnDate
    ) {
      alert("Please fill in all required fields");
      setIsCalculating(false);
      return;
    }

    const selectedTreatment = treatmentOptions.find(
      (t) => t.value === formData.treatmentType
    );
    const selectedAccommodation = accommodationLevels.find(
      (a) => a.value === formData.accommodationLevel
    );

    // Calculate number of nights
    const departure = new Date(formData.departureDate);
    const returnDate = new Date(formData.returnDate);
    const nights = Math.ceil((returnDate - departure) / (1000 * 60 * 60 * 24));

    const treatmentCost = selectedTreatment ? selectedTreatment.price : 0;
    let accommodationCost = selectedAccommodation ? selectedAccommodation.price * nights : 0;

    let estimatedFlightCost = 0;
    setFlightError(null);
    setHotelError(null);
    try {
      const departureCode = await resolveDepartureCode(formData.departureAirport);
      const flightResult = await fetchFlightPrice(
        departureCode,
        "CAI",
        formData.departureDate,
        formData.returnDate
      );
      estimatedFlightCost = flightResult.price;
      setCheapestFlight(flightResult.selected);
      setFlightOptions(flightResult.options || []);
      setSelectedFlight(flightResult.selected || null);
      const hotelsResult = await fetchHotelsCairo(formData.departureDate, formData.returnDate);
      setHotelCandidates(hotelsResult.candidates);
      setHotelPicks(hotelsResult.picks);
      setSelectedHotel(hotelsResult.picks.cheapest || null);
      if (hotelsResult.picks.cheapest?.pricePerNight) {
        accommodationCost = Math.round(hotelsResult.picks.cheapest.pricePerNight) * nights;
      }
    } catch (err) {
      console.error(err);
      setFlightError(
        err?.message || "Unable to fetch flight price. We used 0 for flight cost."
      );
      setHotelError(err?.message || "Unable to fetch hotels. Using accommodation level prices.");
      setCheapestFlight(null);
      setFlightOptions([]);
      setSelectedFlight(null);
      setHotelCandidates([]);
      setHotelPicks({ cheapest: null, topRated: null, bestValue: null });
      setSelectedHotel(null);
    }
    const total = treatmentCost + accommodationCost + estimatedFlightCost;
    setTotalCost({
      treatment: treatmentCost,
      accommodation: accommodationCost,
      flight: estimatedFlightCost,
      nights: nights,
      total: total,
    });

    setIsCalculating(false);
  };

  // When user selects a flight option, update selectedFlight and recalc totals
  const handleSelectFlight = (opt) => {
    setSelectedFlight(opt);
    setFlightError(null);
    setTotalCost((prev) => {
      const prevObj = prev || {};
      const newFlight = typeof opt?.price === "number" ? opt.price : prevObj.flight || 0;
      return {
        ...prevObj,
        flight: newFlight,
        total: (prevObj.treatment || 0) + (prevObj.accommodation || 0) + newFlight,
      };
    });
  };

  const handleSelectHotel = (opt) => {
    setSelectedHotel(opt);
    setHotelError(null);
    setTotalCost((prev) => {
      const prevObj = prev || {};
      const pricePerNight = typeof opt?.pricePerNight === "number" ? Math.round(opt.pricePerNight) : null;
      const nights = prevObj.nights || 0;
      const newHotel = pricePerNight != null ? pricePerNight * nights : prevObj.accommodation || 0;
      return {
        ...prevObj,
        accommodation: newHotel,
        total: (prevObj.treatment || 0) + (prevObj.flight || 0) + newHotel,
      };
    });
  };

  useEffect(() => {
    if (!formData.departureDate || !formData.returnDate) {
      setHotelCandidates([]);
      setHotelPicks({ cheapest: null, topRated: null, bestValue: null });
      setSelectedHotel(null);
      return;
    }
    setIsFetchingHotels(true);
    setHotelError(null);
    fetchHotelsCairo(formData.departureDate, formData.returnDate)
      .then((hotelsResult) => {
        setHotelCandidates(hotelsResult.candidates);
        setHotelPicks(hotelsResult.picks);
        setSelectedHotel(hotelsResult.picks.cheapest || null);
      })
      .catch((err) => {
        console.error(err);
        setHotelError(err?.message || "Unable to fetch hotels");
        setHotelCandidates([]);
        setHotelPicks({ cheapest: null, topRated: null, bestValue: null });
        setSelectedHotel(null);
      })
      .finally(() => setIsFetchingHotels(false));
  }, [formData.departureDate, formData.returnDate]);

  // Live recompute totals when selection or inputs change
  useEffect(() => {
    // Require dates to compute nights
    if (!formData.departureDate || !formData.returnDate) return;

    const selectedTreatment = treatmentOptions.find((t) => t.value === formData.treatmentType);
    const selectedAccommodation = accommodationLevels.find((a) => a.value === formData.accommodationLevel);

    const departure = new Date(formData.departureDate);
    const returnDate = new Date(formData.returnDate);
    const nights = Math.ceil((returnDate - departure) / (1000 * 60 * 60 * 24));

    const treatmentCost = selectedTreatment ? selectedTreatment.price : 0;
    let accommodationCost = selectedAccommodation ? selectedAccommodation.price * nights : 0;
    if (selectedHotel?.pricePerNight != null) {
      accommodationCost = Math.round(selectedHotel.pricePerNight) * nights;
    } else if (hotelPicks.cheapest?.pricePerNight != null) {
      accommodationCost = Math.round(hotelPicks.cheapest.pricePerNight) * nights;
    }

    const flightPrice =
      typeof selectedFlight?.price === "number"
        ? selectedFlight.price
        : typeof cheapestFlight?.price === "number"
        ? cheapestFlight.price
        : totalCost?.flight || 0;

    setTotalCost({
      treatment: treatmentCost,
      accommodation: accommodationCost,
      flight: flightPrice,
      nights,
      total: treatmentCost + accommodationCost + flightPrice,
    });
  }, [selectedFlight, selectedHotel, hotelPicks, formData.accommodationLevel, formData.treatmentType, formData.departureDate, formData.returnDate]);

  return (
    <div className="bg-dark-2 rounded-lg p-6 w-full max-w-4xl">
      <form className="space-y-6">
        {/* Departure Airport and Destination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Departure Airport
            </label>
            <input
              type="text"
              name="departureAirport"
              value={formData.departureAirport}
              onChange={handleInputChange}
              placeholder="e.g., JFK, LHR or city name (New York, لندن)"
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Destination
            </label>
            <input
              type="text"
              name="destination"
              disabled
              value={formData.destination}
              className="input"
              readOnly
            />
          </div>
        </div>

        {/* Departure and Return Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Departure Date
            </label>
            <input
              type="date"
              name="departureDate"
              value={formData.departureDate}
              onChange={handleInputChange}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Return Date
            </label>
            <input
              type="date"
              name="returnDate"
              value={formData.returnDate}
              onChange={handleInputChange}
              className="input"
            />
          </div>
        </div>

        {/* Treatment Type */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Treatment Type
          </label>
          <select
            name="treatmentType"
            value={formData.treatmentType}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-dark-3 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500">
            <option value="">Select a treatment</option>
            {treatmentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Hotels in Cairo (Cheapest / Top Rated / Best Value) */}
        <div>
          <label className="block text-sm font-medium mb-4 text-gray-300">
            Hotels in Cairo
          </label>
          {!formData.departureDate || !formData.returnDate ? (
            <p className="text-xs text-gray-400">Select travel dates to see hotel picks.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[{ k: "cheapest", label: "Cheapest" }, { k: "topRated", label: "Top Rated" }, { k: "bestValue", label: "Best Value" }].map(({ k, label }) => {
                const opt = hotelPicks[k];
                if (isFetchingHotels && !opt) {
                  return (
                    <div key={k} className="p-4 border-2 rounded-lg bg-dark-3 border-gray-600 animate-pulse">
                      <div className="h-5 w-24 bg-gray-700 rounded mb-2" />
                      <div className="h-4 w-32 bg-gray-700 rounded mb-1" />
                      <div className="h-3 w-48 bg-gray-700 rounded" />
                    </div>
                  );
                }
                if (!opt) {
                  return (
                    <div key={k} className="p-4 border-2 rounded-lg bg-dark-3 border-gray-600">
                      <div className="text-sm text-gray-400">No data</div>
                    </div>
                  );
                }
                const isSelected = selectedHotel?.name === opt.name && selectedHotel?.pricePerNight === opt.pricePerNight;
                return (
                  <div
                    key={`${k}-${opt.name}-${opt.pricePerNight}`}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${isSelected ? "border-gray-100 bg-blue-500/10" : "border-gray-600 bg-dark-3"}`}
                    onClick={() => handleSelectHotel(opt)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-lg font-semibold">${Math.round(opt.pricePerNight).toLocaleString()} <span className="text-sm text-gray-400">USD/night</span></div>
                        <div className="text-xs text-gray-400">{label}</div>
                      </div>
                      <span className="px-2 py-1 text-xs rounded bg-blue-600 text-white">{opt.rating != null ? `${opt.rating.toFixed(1)}★` : "N/A"}{opt.reviews != null ? ` • ${opt.reviews}` : ""}</span>
                    </div>
                    <div className="text-sm text-gray-300 space-y-1">
                      <div className="font-semibold">{opt.name}</div>
                      {opt.location && <div className="text-xs text-gray-400">{opt.location}</div>}
                      {opt.link && <a href={opt.link} target="_blank" rel="noreferrer" className="inline-block mt-2 px-3 py-1 text-xs rounded border border-blue-500 text-blue-400 hover:bg-blue-500/10">View Details</a>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {hotelError && (
            <p className="text-xs text-red-400 mt-2">{hotelError}</p>
          )}
        </div>

        <div className="text-center mt-8">
          <Button type="button" onClick={calculateTotalCost} disabled={isCalculating}>
            {isCalculating ? "Calculating..." : "Calculate Total Cost"}
          </Button>
        </div>

        {/* Flight Options (from SerpApi) */}
        {Array.isArray(flightOptions) && flightOptions.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-semibold mb-4 text-center">Flight Options</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {flightOptions.map((opt) => {
                const isSelected = selectedFlight?.flight?.departure_token === opt?.flight?.departure_token;
                const isCheapest = cheapestFlight?.flight?.departure_token === opt?.flight?.departure_token;
                const segs = opt?.flight?.flights || [];
                const airlines = Array.from(new Set(segs.map((s) => s.airline))).join(", ");
                const classes = Array.from(new Set(segs.map((s) => s.travel_class))).join(" / ");
                const flightNos = segs.map((s) => s.flight_number).filter(Boolean).join(", ");
                const legrooms = Array.from(new Set(segs.map((s) => s.legroom).filter(Boolean))).join(", ");
                const routeParts = [];
                if (segs[0]) routeParts.push(segs[0]?.departure_airport?.id || segs[0]?.departure_airport?.name || "");
                segs.forEach((seg) => routeParts.push(seg.arrival_airport?.id || seg.arrival_airport?.name || ""));
                const route = routeParts.filter(Boolean).join(" → ");
                const depTime = segs[0]?.departure_airport?.time;
                const arrTime = segs[segs.length - 1]?.arrival_airport?.time;
                const mins = opt?.flight?.total_duration;
                const durationStr = (mins != null) ? `${Math.floor(mins / 60)}h ${mins % 60}m` : "N/A";
                const layovers = (opt?.flight?.layovers || []).map((l) => `${l.name || l.id} (${l.duration}m)`).join(", ");
                const extensions = Array.isArray(segs[0]?.extensions) ? segs[0].extensions.join(" • ") : null;
                const emissions = opt?.flight?.carbon_emissions;
                const emissionsStr = emissions ? `This flight: ${(emissions.this_flight/1000)|0} kg • Typical: ${(emissions.typical_for_this_route/1000)|0} kg • Δ ${emissions.difference_percent}%` : null;

                return (
                  <div
                    key={opt?.flight?.departure_token || `${opt.source}-${opt.price}-${flightNos}`}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      isSelected ? "border-gray-100 bg-blue-500/10" : "border-gray-600 bg-dark-3"
                    }`}
                    onClick={() => handleSelectFlight(opt)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {opt?.flight?.airline_logo && (
                          <img src={opt.flight.airline_logo} alt="Airline logo" className="h-8 w-auto" />
                        )}
                        <div>
                          <div className="text-lg font-semibold">${opt.price.toLocaleString()} <span className="text-sm text-gray-400">USD</span></div>
                          <div className="text-xs text-gray-400">{opt?.source || ""} • {classes || ""}</div>
                        </div>
                      </div>
                      {isCheapest && (
                        <span className="px-2 py-1 text-xs rounded bg-green-600 text-white">Cheapest</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-300 space-y-1">
                      <div><span className="font-medium">Airlines:</span> {airlines || "N/A"}</div>
                      <div><span className="font-medium">Route:</span> {route || "N/A"}</div>
                      <div><span className="font-medium">Times:</span> {`${depTime || "?"} → ${arrTime || "?"}`}</div>
                      <div><span className="font-medium">Total duration:</span> {durationStr}</div>
                      {layovers && <div><span className="font-medium">Layover(s):</span> {layovers}</div>}
                      {flightNos && <div><span className="font-medium">Flight No(s):</span> {flightNos}</div>}
                      {legrooms && <div><span className="font-medium">Legroom:</span> {legrooms}</div>}
                      {extensions && <div><span className="font-medium">Amenities:</span> {extensions}</div>}
                      {emissionsStr && <div className="text-xs text-gray-400">{emissionsStr}</div>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cost Summary */}
            {totalCost && (
              <div className="mt-8 p-6 bg-dark-3 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-center">Cost Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Treatment Cost:</span>
                    <span>${totalCost.treatment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accommodation ({totalCost.nights} nights):</span>
                    <span>${totalCost.accommodation.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Flight Cost (Selected):</span>
                    <span>${totalCost.flight.toLocaleString()}</span>
                  </div>
                  {flightError && (
                    <p className="text-red-400 text-xs text-center">{flightError}</p>
                  )}
                  {hotelError && (
                    <p className="text-red-400 text-xs text-center">{hotelError}</p>
                  )}
                  <hr className="border-gray-600" />
                  <div className="flex justify-between text-xl font-semibold">
                    <span>Total Estimated Cost:</span>
                    <span>${totalCost.total.toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-4 text-center">
                  *This is an estimate. Actual costs may vary based on specific requirements and current rates.
                </p>
              </div>
            )}
          </div>
        )}

      </form>
    </div>
  );
}

export default CostForm;


// Recompute totals immediately when flight selection or accommodation level (or inputs) change
// Need required fields to compute nights and treatment cost
// If there is no selected flight but we have flight options, default to cheapest
// const flightPrice = typeof selectedFlight?.price === "number"
//   ? selectedFlight.price
//   : (typeof cheapestFlight?.price === "number" ? cheapestFlight.price : (totalCost?.flight || 0));
//
// const selectedTreatment = treatmentOptions.find((t) => t.value === formData.treatmentType);
// const selectedAccommodation = accommodationLevels.find((a) => a.value === formData.accommodationLevel);
// const departure = new Date(formData.departureDate);
// const returnDt = new Date(formData.returnDate);
// const nights = Math.ceil((returnDt - departure) / (1000 * 60 * 60 * 24));
// const treatmentCost = selectedTreatment ? selectedTreatment.price : 0;
// const accommodationCost = selectedAccommodation ? selectedAccommodation.price * (nights > 0 ? nights : 0) : 0;
//
// setTotalCost({
//   treatment: treatmentCost,
//   accommodation: accommodationCost,
//   flight: flightPrice || 0,
//   nights: nights > 0 ? nights : 0,
//   total: (treatmentCost + accommodationCost + (flightPrice || 0)),
// });
// }, [selectedFlight, cheapestFlight, formData.accommodationLevel, formData.treatmentType, formData.departureDate, formData.returnDate]);
