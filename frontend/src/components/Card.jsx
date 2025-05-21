const Card = ({ title, value, icon, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-amber-500 text-white',
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    red: 'bg-red-500 text-white',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-amber-500 flex items-center">
      <div className={`w-12 h-12 rounded-full ${colorClasses[color]} flex items-center justify-center mr-4`}>
        <i className={`${icon} text-xl`}></i>
      </div>
      <div>
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  );
};

export default Card;
