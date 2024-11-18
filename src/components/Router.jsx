import { Routes, Route } from "react-router-dom";
import Root from "../pages/Root";
import Weather from "../pages/Weather";
import ErrorPage from "../pages/ErrorPage";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Root />} errorElement={<ErrorPage />} />
      <Route path="/weather" element={<Weather />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  )
}