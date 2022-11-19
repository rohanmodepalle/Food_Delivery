import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "./App.css";

import React from "react";
import ReactDOM from "react-dom";
import UsersList from "./components/users/UsersList";
import Home from "./components/common/Home";
import Login from "./components/common/Login";
import Register from "./components/common/Register";
import Navbar from "./components/templates/Navbar";
import BuyerNavbar from "./components/buyers/buyerNavbar";
import VendorNavbar from "./components/vendors/vendorNavbar";
import BuyerProfile from "./components/buyers/buyerProfile";
import VendorProfile from "./components/vendors/vendorProfile";
import BuyerDashboard from "./components/buyers/buyerDashboard";
import VendorsList from "./components/vendors/Menu";
import BuyerOrders from "./components/buyers/buyerOrders";
import VendorOrders from "./components/vendors/vendorOrders";
import Stats from "./components/vendors/Stats";

const Layout = () => {
  return (
    <div>
      <Navbar />
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
};

const BuyerLayout = () => {
  return (
    <div>
      <BuyerNavbar />
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
};

const VendorLayout = () => {
  return (
    <div>
      <VendorNavbar />
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          {<Route path="register" element={<Register />} />}
        </Route>
        <Route path="buyer" element={<BuyerLayout />} >
          <Route path="/buyer" element={<BuyerDashboard />} />
          <Route path="/buyer/orders" element={<BuyerOrders />} />
          <Route path="/buyer/profile" element={<BuyerProfile />} />
        </Route>
        <Route path="vendor" element={<VendorLayout />} >
          <Route path="/vendor/profile" element={<VendorProfile />} />
          <Route path="/vendor/menu" element={<VendorsList />} />
          <Route path="/vendor/orders" element={<VendorOrders />} />
          <Route path="/vendor/statistics" element={<Stats />} />          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
