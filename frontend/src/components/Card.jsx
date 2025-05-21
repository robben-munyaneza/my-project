const Card = ({ title, value, icon, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-amber-500 text-white',
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    red: 'bg-red-500 text-white',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow border-l-4 border-amber-500 flex items-center">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${colorClasses[color]} flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0`}>
        <i className={`${icon} text-base sm:text-xl`}></i>
      </div>
      <div className="overflow-hidden">
        <h3 className="text-gray-500 text-xs sm:text-sm truncate">{title}</h3>
        <p className="text-lg sm:text-2xl font-semibold truncate">{value}</p>
      </div>
    </div>
  );
};

export default Card;
