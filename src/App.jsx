import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Report from "./pages/Report";
import MyReports from "./pages/MyReports";
import AdminReportList from "./pages/AdminReportList";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/report" element={<Report />} />
        <Route path="/my-reports" element={<MyReports />} />
        <Route path="/admin/reports" element={<AdminReportList />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
