import CostForm from "../features/cost/CostForm";

function CalculateCost() {
  return (
    <div className="max-w-4xl mx-auto">
      <p className="text-sm text-gray-400 mb-4">
        Enter 3-letter IATA code for departure airport (e.g., JFK, LHR). Flight prices are fetched via SerpApi Google Flights and combined with treatment + accommodation to estimate your journey cost.
      </p>
      <CostForm />
    </div>
  );
}

export default CalculateCost;
