import React, { useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./index.css";
import { NavBar, SideMenu as ImportedSideMenu } from "./components";
import Farmers from "./components/Farmers";
import Insight from "./components/Insight";
import WarehousesList from "./components/WarehousesList";
import FertilizerRequests from "./components/FertilizerRequests";
import AllAppoinemnts from "./components/AllAppoinemnts";
import DashBoard from "./components/DashBoard";
import Managers from "./components/Managers";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/Signup";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <div className="App w-screen h-screen overflow-x-hidden">
        {isAuthenticated ? (
          <div className="flex flex-1 justify-start items-start bg-[#f5faff]">
            <div className="fixed">
              <ImportedSideMenu />
            </div>
            <div className="flex-1 h-full overflow-x-hidden overflow-y-auto ml-[270px] w-[calc(100%-271px)]">
              <NavBar />
              <Routes>
                <Route path="/main-dashboard" element={<DashBoard />} />
                <Route path="/farmers" element={<Farmers />} />
                <Route path="/managers" element={<Managers />} />
                <Route path="/insights" element={<Insight />} />
                <Route path="/warehouseslist" element={<WarehousesList />} />
                <Route path="/fertilizerrequests" element={<FertilizerRequests />} />
                <Route path="/allappointment" element={<AllAppoinemnts />} />
                <Route path="*" element={<Navigate to="/main-dashboard" />} />
              </Routes>
            </div>
          </div>
        ) : (
          <Routes>
            {/* Authentication Routes */}
            <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<Navigate to="/main-dashboard" />} />
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
