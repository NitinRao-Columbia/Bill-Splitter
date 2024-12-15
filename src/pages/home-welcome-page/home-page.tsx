import './home-page.css';

const HomePage = () => {
  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <div className="centered-content">
        <h1 className="text-4xl font-bold text-gray-900">Welcome to Bill Splitter!</h1>
        <p className="mt-4 text-gray-600">Simplify your bill-splitting experience.</p>
      </div>
    </div>
  );
};

export default HomePage;
