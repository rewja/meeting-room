import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import BookingForm from './pages/Booking/BookingForm';
import BookingSummary from './pages/BookingSummary';
import ErrorPage from './pages/ErrorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'booking',
        element: <BookingForm />
      },
      {
        path: 'summary',
        element: <BookingSummary />
      }
    ]
  }
]);

export default router;

