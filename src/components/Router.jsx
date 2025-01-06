import { Routes, Route } from "react-router-dom";
import Root from "../pages/Root";
import Weather from "../pages/Weather";
import History from "../pages/History";
import Auth from "../pages/Auth";
import ErrorPage from "../pages/ErrorPage";
import PrivateRoute from '../components/PrivateRoute';
import Profile from '../pages/Profile';

export default function Router() {
  return (
    <Routes>
       <Route path="/login" element={<Auth />} />
      <Route 
        path="/" 
        element={
          <PrivateRoute>
            <Root />
          </PrivateRoute>
        } 
        errorElement={<ErrorPage />}
      />
      <Route 
        path="/profile" 
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } 
      />
      <Route path="/weather" element={<Weather />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/history" element={<History />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  )
}