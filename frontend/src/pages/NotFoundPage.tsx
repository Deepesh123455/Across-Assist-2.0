import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="mt-4 text-xl text-gray-500">Page not found</p>
      <Link
        to={ROUTES.HOME}
        className="mt-6 rounded-md bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
