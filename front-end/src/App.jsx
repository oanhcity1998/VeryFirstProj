// src/App.jsx
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout/mainLayout";
import Home from "./views/Home";
import Profile from "./views/Profile";
import Login from "./views/Login";
import CustomerList from "./views/CRM/CustomerList/CustomerList";
import CustomerDetail from "./views/CRM/CustomerDetail/CustomerDetail";
import ProductPage from "./views/CRM/ProductPage/ProductPage";
import ContactList from "./views/CRM/ContactList/ContactList";
import QuotationList from "./views/CRM/QuotationList/QuotationList";
import EmployeeList from "./views/HRM/EmployeeList/EmployeeList";
import EmployeeDetail from "./views/HRM/EmployeeDetail/EmployeeDetail";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<MainLayout />}>
          <Route path="/crm" element={<Home />} />
          <Route path="/hrm/profile" element={<Profile />} />

          {/* khách hàng */}
          <Route path="/crm/customerlist" element={<CustomerList />} />
          <Route path="crm/customerlist/:id" element={<CustomerDetail />} />

          {/* sản phẩm */}
          <Route path="/crm/productlist" element={<ProductPage />} />

          {/* liên hệ */}
          <Route path="/crm/contactlist" element={<ContactList />} />

          <Route path="/crm/quotationlist" element={<QuotationList />} />
        </Route>
        <Route element={<MainLayout />}>
          {/* khách hàng */}
          <Route path="/hrm" element={<Home />} />
          <Route path="/hrm/profile" element={<Profile />} />

          <Route path="/hrm/employee-list" element={<EmployeeList />} />
          <Route path="/hrm/employee-list/:id" element={<EmployeeDetail />} />

          {/* tải lên */}
        </Route>
      </Routes>
    </HashRouter>
  );
}
