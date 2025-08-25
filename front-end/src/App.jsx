// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout/mainLayout";
import Home from "./views/Home";
import Profile from "./views/Profile";
import Login from "./views/Login";
import CustomerList from "./views/CRM/CustomerList/CustomerList";
import CustomerDetail from "./views/CRM/CustomerDetail/CustomerDetail";
import ProductPage from "./views/CRM/ProductPage/ProductPage";
import ContactList from "./views/CRM/ContactList/ContactList";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />

          {/* khách hàng */}
          <Route path="/customerlist" element={<CustomerList/>} />
          <Route path="customerlist/:id" element={<CustomerDetail />} />

          {/* sản phẩm */}
          <Route path="/productlist" element={<ProductPage />} />

          {/* liên hệ */}
          <Route path="/contactlist" element={<ContactList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
