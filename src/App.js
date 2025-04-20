import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./auth/auth";
import Instructions from "./pages/instructions";
import AISettings from "./pages/mainSettingsAI";
import Navbar from "../src/component/navbar"; // Pastikan lokasi path sesuai
import Conversation from "./pages/conversation";
import Device from "./pages/device";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const isLogin = sessionStorage.getItem("isLogin") === "true";

  return (
    <div className="App">
      <Router>
        {/* Navbar akan muncul di semua halaman */}
        <Navbar />

        <Routes>
          <Route path="/" element={<AISettings />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
