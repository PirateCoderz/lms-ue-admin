import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import DashboardAppPage from './pages/DashboardAppPage';
import TeacherPage from './pages/TeacherPage';
import MeritListPage from './pages/MeritListPage';
import FeeStructure from './pages/FeeStructure';
import Departments from './pages/Departments';
import Timetable from './pages/Timetable';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'user', element: <UserPage /> },
        { path: 'teacher', element: <TeacherPage /> },
        { path: 'merit-list', element: <MeritListPage /> },
        { path: 'fee-structure', element: <FeeStructure /> },
        { path: 'departments', element: <Departments /> },
        { path: 'time-table', element: <Timetable /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/login" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
