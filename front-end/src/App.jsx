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
import QuotationList from "./views/CRM/QuotationList/QuotationList";
import LeadList from "./views/CRM/LeadList/LeadList";
import LeadDetail from "./views/CRM/LeadDetail/LeadDetail";
import OpportunityList from "./views/CRM/OpportunityList/OpportunityList";
import { ROUTES_APP } from "./routes";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES_APP.login} element={<Login />} />

        <Route element={<MainLayout />}>
          <Route path={ROUTES_APP.home} element={<Home />} />
          <Route path={ROUTES_APP.profile} element={<Profile />} />

          {/* khách hàng */}
          <Route path={ROUTES_APP.customerList} element={<CustomerList />} />
          <Route path={ROUTES_APP.customerDetail} element={<CustomerDetail />} />

          {/* sản phẩm */}
          <Route path={ROUTES_APP.productPage} element={<ProductPage />} />

          {/* liên hệ */}
          <Route path={ROUTES_APP.contactList} element={<ContactList />} />

          {/* Mẫu báo giá  */}
          <Route path={ROUTES_APP.quotationList} element={<QuotationList />} />
          <Route path={ROUTES_APP.opportunityList} element={<OpportunityList />} />

          {/* Lead  */}
          <Route path={ROUTES_APP.leadList} element={<LeadList />} />
          <Route path={ROUTES_APP.leadDetail} element={<LeadDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
