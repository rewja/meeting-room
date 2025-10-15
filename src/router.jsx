import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import TimeSlotBooking from './pages/TimeSlotBooking';
import BookingForm from './pages/Booking/BookingForm';
import Schedule from './pages/Schedule';
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
        path: 'home',
        element: <Home />
      },
      {
        path: 'time-slot-booking',
        element: <TimeSlotBooking />
      },
      {
        path: 'booking',
        element: <BookingForm />
      },
      {
        path: 'schedule',
        element: <Schedule />
      },
      {
        path: 'summary',
        element: <BookingSummary />
      }
    ]
  }
]);

export default router;

