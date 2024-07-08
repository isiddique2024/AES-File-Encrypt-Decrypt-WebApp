import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SideBar from "./components/SideBar";
import EncryptPage from './pages/Encryption'; // Import your component
import DecryptPage from './pages/Decryption'; // Import your component

import "./stylesheets/App.css"

const App = () => {

  return (
    <Router>
      <SideBar />
      <Routes>
        <Route path="/encrypt" element={<EncryptPage />} />
        <Route path="/decrypt" element={<DecryptPage />} />
      </Routes>
    </Router>
  );
};

export default App;