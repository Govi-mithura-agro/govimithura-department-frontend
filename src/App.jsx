import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import { NavBar, SideMenu as ImportedSideMenu } from "./components";
import Farmers from "./components/Farmers";
import Insight from "./components/Insight";
import WarehousesList from "./components/WarehousesList";
import FertilizerRequests from "./components/FertilizerRequests";
import AllAppoinemnts from "./components/AllAppoinemnts";
import DashBoard from "./components/DashBoard";
import Managers from "./components/Managers";

function App() {
  return (
    <BrowserRouter>
      <div className="App w-screen h-screen overflow-x-hidden">
        <div className="flex flex-1 justify-start items-start bg-[#f5faff]">
          <div className="fixed">
            <ImportedSideMenu />
          </div>
          <div className="flex-1 h-full overflow-x-hidden overflow-y-auto ml-[270px] w-[calc(100%-271px)]">
            <NavBar />
            <Routes>
              <Route path="/" element={<DashBoard />} />
              <Route path="/farmers" element={<Farmers />} />
              <Route path="/managers" element={<Managers />} />
              <Route path="/insights" element={<Insight />} />
              <Route path="/warehouseslist" element={<WarehousesList />} />
              <Route path="/fertilizerrequests" element={<FertilizerRequests />} />
              <Route path="/allappointment" element={<AllAppoinemnts />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
