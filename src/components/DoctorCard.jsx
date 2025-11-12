function DoctorCard({doctor, onDetailsClick}) {
  return (
    <div className="overflow-hidden cursor-pointer">
      <div className="relative overflow-hidden rounded-3xl">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="w-full h-96 object-cover transition-all 
            duration-300 filter grayscale hover:grayscale-0 rounded-3xl"
        />
      </div>

      <div className="py-4">
        <h3 className="text-lg font-medium text-white mb-2">{doctor.name}</h3>
        <p className="text-gray-300 text-xs mb-1">{doctor.specialty}</p>
        <p className="text-gray-400 text-xs mb-4">{doctor.experience}</p>

        <button
          onClick={onDetailsClick}
          className="text-white text-sm underline 
            underline-offset-4 hover:no-underline transition-all duration-200">
          More details
        </button>
      </div>
    </div>
  );
}

export default DoctorCard;
