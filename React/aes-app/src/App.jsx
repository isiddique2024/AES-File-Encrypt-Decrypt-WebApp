import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SideBar from "./components/SideBar";
import EncryptPage from "./pages/Encryption";
import DecryptPage from "./pages/Decryption";

import "./stylesheets/App.css";

const App = () => {
  return (
    <BrowserRouter>
      <SideBar />
      <Routes>
        <Route path="/encrypt" element={<EncryptPage />} />
        <Route path="/decrypt" element={<DecryptPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
