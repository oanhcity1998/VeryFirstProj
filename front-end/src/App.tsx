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
import LeadList from "./views/CRM/LeadList/LeadList";
import LeadDetail from "./views/CRM/LeadDetail/LeadDetail";
import OpportunityList from "./views/CRM/OpportunityList/OpportunityList";
import { ROUTES_APP } from "./routes";
import EmployeeList from "./views/HRM/EmployeeList/EmployeeList";
import EmployeeDetail from "./views/HRM/EmployeeDetail/EmployeeDetail";
import PositionList from "./views/HRM/PositionList/PositionList";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES_APP.login} element={<Login />} />

        <Route element={<MainLayout />}>
          <Route path={ROUTES_APP.home} element={<Home />} />
          <Route path={ROUTES_APP.profile} element={<Profile />} />

          {/* khách hàng */}
          <Route path={ROUTES_APP.crm.customerList} element={<CustomerList />} />
          <Route path={ROUTES_APP.crm.customerDetail} element={<CustomerDetail />} />

          {/* sản phẩm */}
          <Route path={ROUTES_APP.crm.productPage} element={<ProductPage />} />

          {/* liên hệ */}
          <Route path={ROUTES_APP.crm.contactList} element={<ContactList />} />

          {/* Mẫu báo giá  */}
          <Route path={ROUTES_APP.crm.quotationList} element={<QuotationList />} />
          <Route path={ROUTES_APP.crm.opportunityList} element={<OpportunityList />} />

          {/* Lead  */}
          <Route path={ROUTES_APP.crm.leadList} element={<LeadList />} />
          <Route path={ROUTES_APP.crm.leadDetail} element={<LeadDetail />} />


          {/* HRM */}
          <Route path={ROUTES_APP.hrm.employeeDetail} element={<EmployeeDetail />} />
          <Route path={ROUTES_APP.hrm.employeeList} element={<EmployeeList />} />
          <Route path={ROUTES_APP.hrm.positionList} element={<PositionList />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
