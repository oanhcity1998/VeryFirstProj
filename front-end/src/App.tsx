// src/App.jsx
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout/mainLayout";
import Home from "./views/Home";
import Login from "./views/Login";
import CustomerList from "./views/CRM/CustomerList/CustomerList";
import CustomerDetail from "./views/CRM/CustomerDetail/CustomerDetail";
import ProductPage from "./views/CRM/ProductPage/ProductPage";
import ContactList from "./views/CRM/ContactList/ContactList";
import QuotationList from "./views/CRM/QuotationList/QuotationList";
import LeadList from "./views/CRM/LeadList/LeadList";
import LeadDetail from "./views/CRM/LeadDetail/LeadDetail";
import OpportunityList from "./views/CRM/OpportunityList/OpportunityList";
import ContractList from "./views/CRM/ContractList/ContractList";
import ContractDetailWrapper from "./views/CRM/ContractDetail/ContractDetailWrapper";
import { ROUTES_APP } from "./routes";
import EmployeeList from "./views/HRM/EmployeeList/EmployeeList";
import EmployeeDetail from "./views/HRM/EmployeeDetail/EmployeeDetail";
import PositionList from "./views/HRM/PositionList/PositionList";

import "./App.css";
import ContactDetail from "./views/CRM/ContactDetail/ContactDetail";
import QuotationDetail from "./views/CRM/QuotationDetail/QuotationDetail";
import OpportunityDetail from "./views/CRM/OpportunityDetail/OpportunityDetail";
import DepartmentList from "./views/HRM/DepartmentList/DepartmentList";
import Profile from "./views/Profile";
import HomeCRM from "./views/CRM/HomeCRM/HomeCRM";
import HomeHRM from "./views/HRM/HomeHRM/HomeHRM";
import DebtReportList from "./views/CRM/DebtReportList/DebtReportList";
import DebtReportDetail from "./views/CRM/DebtReportDetail/DebtReportDetail";
import AssetList from "./views/HRM/AssetList/AssetList";
import AssetDetail from "./views/HRM/AssetDetail/AssetDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES_APP.login} element={<Login />} />
        <Route path={ROUTES_APP.home} element={<Home />} />

        <Route element={<MainLayout />}>
          <Route path={ROUTES_APP.profile} element={<Profile />} />

          {/* home crm */}
          <Route path={ROUTES_APP.crm.homeCRM} element={<HomeCRM />} />

          {/* khách hàng */}
          <Route path={ROUTES_APP.crm.customerList} element={<CustomerList />} />
          <Route path={ROUTES_APP.crm.customerDetail} element={<CustomerDetail />} />

          {/* sản phẩm */}
          <Route path={ROUTES_APP.crm.productPage} element={<ProductPage />} />

          {/* liên hệ */}
          <Route path={ROUTES_APP.crm.contactList} element={<ContactList />} />
          <Route path={ROUTES_APP.crm.contactDetail} element={<ContactDetail />} />

          {/* Mẫu báo giá  */}
          <Route path={ROUTES_APP.crm.quotationList} element={<QuotationList />} />
          <Route path={ROUTES_APP.crm.quotationDetail} element={<QuotationDetail />} />

          {/* Cơ hội */}
          <Route path={ROUTES_APP.crm.opportunityList} element={<OpportunityList />} />
          <Route path={ROUTES_APP.crm.opportunityDetail} element={<OpportunityDetail />} />

          {/* Khách tiềm năng  */}
          <Route path={ROUTES_APP.crm.leadList} element={<LeadList />} />
          <Route path={ROUTES_APP.crm.leadDetail} element={<LeadDetail />} />

          {/* Hợp đồng  */}
          <Route path={ROUTES_APP.crm.contractList} element={<ContractList />} />
          <Route path={ROUTES_APP.crm.contractDetail} element={<ContractDetailWrapper />} />

          {/* Báo cáo công nợ */}
          <Route path={ROUTES_APP.crm.debtReportList} element={<DebtReportList />} />
          <Route path={ROUTES_APP.crm.debtReportDetail} element={<DebtReportDetail />} />

          {/* +++++++++++++++++++++++++++++++++++++++++++ HRM +++++++++++++++++++++++++++++++++++++++++++ */}
          {/* home hrm */}
          <Route path={ROUTES_APP.hrm.homeHRM} element={<HomeHRM />} />

          {/* Nhân sự */}
          <Route path={ROUTES_APP.hrm.employeeDetail} element={<EmployeeDetail />} />
          <Route path={ROUTES_APP.hrm.employeeList} element={<EmployeeList />} />

          {/* Chức vụ */}
          <Route path={ROUTES_APP.hrm.positionList} element={<PositionList />} />

          {/* Phòng ban */}
          <Route path={ROUTES_APP.hrm.departmentList} element={<DepartmentList />} />

          {/* Tài sản */}
          <Route path={ROUTES_APP.hrm.assetList} element={<AssetList />} />
          <Route path={ROUTES_APP.hrm.assetDetail} element={<AssetDetail />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
