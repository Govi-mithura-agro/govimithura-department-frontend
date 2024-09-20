// App.js
import React, { useEffect, useState } from "react";
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


function MainLayout({ setIsAuthenticated }) {
  return (
    <div className="App w-screen h-screen overflow-x-hidden">
      <div className="flex flex-1 justify-start items-start bg-[#f5faff]">
        <div className="fixed">
          <ImportedSideMenu />
        </div>
        <div className="flex-1 h-full overflow-x-hidden overflow-y-auto ml-[270px] w-[calc(100%-271px)]">
          <NavBar setIsAuthenticated={setIsAuthenticated} />
          <Routes>
            <Route path="/" element={<DashBoard />} />
            <Route path="/farmers" element={<Farmers />} />
            <Route path="/managers" element={<Managers />} />
            <Route path="/insights" element={<Insight />} />
            <Route path="/warehouseslist" element={<WarehousesList />} />
            <Route path="/fertilizerrequests" element={<FertilizerRequests />} />
            <Route path="/allappointment" element={<AllAppoinemnts />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("currentUser")
  );

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("currentUser");
      setIsAuthenticated(!!user);
    };

    window.addEventListener('storage', checkAuth);
    checkAuth();

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            <Route path="/*" element={<MainLayout setIsAuthenticated={setIsAuthenticated} />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;