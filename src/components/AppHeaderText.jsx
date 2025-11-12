function AppHeaderText({title, subtitle}) {
  return (
    <div className="text-center">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4">
        {title}
      </h1>
      <span className="text-sm sm:text-base text-gray-400">{subtitle}</span>
    </div>
  );
}

export default AppHeaderText;
