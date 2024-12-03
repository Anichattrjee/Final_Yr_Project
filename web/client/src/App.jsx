import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import CastVotePage from "./pages/CastVote";
import CurrentStatusPage from "./pages/CurrentStatus";

const App = () => {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/cast-vote" element={<CastVotePage isLoggedIn={true} />} />
        <Route path="/current-status" element={<CurrentStatusPage />} />
      </Routes>
  );
};

export default App;
