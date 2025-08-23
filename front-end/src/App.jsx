// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/mainLayout";
import Home from "./views/Home";
import Profile from "./views/Profile";
import Login from "./views/Login";
import CustomerList from "./views/CustomerList";
import CustomerDetail from "./views/CustomerDetail";
import ContactList from "./views/ContactList";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/customerlist" element={<CustomerList />} />
          <Route path="customerlist/:id" element={<CustomerDetail />} />

          <Route path="/contact-list" element={<ContactList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
