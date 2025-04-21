import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import CurrentStatusPage from "./pages/CurrentStatus";
import CompletedElectionsList from "./pages/Result";
import ElectionListingPage from "./pages/ElectionListingPage";
import VoterProfilePage from "./pages/VoterPorfile";
import CandidateProfilePage from "./pages/CandidateProfilePage";
import ElectionDetailPage from './pages/ElectionDetailsPage';
import ElectionResultPage from './pages/ElectionResult';
import AboutUs from "./pages/AboutUs";

const App = () => {
  const isLogedin = localStorage.getItem("user") ? true : false;
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/election" element={<CurrentStatusPage />} />
        <Route path="/results" element = {<CompletedElectionsList/>}/>
        <Route path="/results/:id" element={<ElectionResultPage/>} />
        <Route path="/elections" element={<ElectionListingPage isLoggedIn={isLogedin}  />} />
        <Route path="/profile" element={<VoterProfilePage/>} />
        <Route path="/candidate-profile" element={<CandidateProfilePage />} />
        <Route path="/elections/:id" element={<ElectionDetailPage />} />
        <Route path="/current-status" element={<CurrentStatusPage />} />
        <Route path = "/about" element = {<AboutUs/>} />
        
      </Routes>
  );
};

export default App;
