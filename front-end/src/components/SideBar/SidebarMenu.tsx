import { Menu } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  ContactsOutlined,
  InboxOutlined,
  SolutionOutlined,
  DollarOutlined,
  UserSwitchOutlined,
  FileTextOutlined,
  AccountBookOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import "./SidebarMenu.css";
import { ROUTES_APP } from "@/routes";

const SidebarMenu = ({ collapsed }: { collapsed: boolean }) => {
  const location = useLocation();

  // Map paths to keys
  let selectedKey = "1"; // default Trang chủ

  if (location.pathname === ROUTES_APP.home) {
    selectedKey = "1";
  } else if (location.pathname.startsWith(ROUTES_APP.crm.customerList)) {
    selectedKey = "2";
  } else if (location.pathname.startsWith(ROUTES_APP.crm.productPage)) {
    selectedKey = "3";
  } else if (location.pathname.startsWith(ROUTES_APP.crm.contactList)) {
    selectedKey = "4";
  } else if (location.pathname.startsWith(ROUTES_APP.crm.quotationList)) {
    selectedKey = "5";
  } else if (location.pathname.startsWith(ROUTES_APP.crm.leadList)) {
    selectedKey = "6";
  } else if (location.pathname.startsWith(ROUTES_APP.crm.opportunityList)) {
    selectedKey = "7";
  } else if (location.pathname.startsWith(ROUTES_APP.crm.contractList)) {
    selectedKey = "8";
  } else if (location.pathname.startsWith(ROUTES_APP.crm.debtReportList)) {
    selectedKey = "9";
  }

  const items = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: <Link to={ROUTES_APP.crm.homeCRM}>Trang chủ</Link>,
    },
    {
      key: "2",
      icon: <UserOutlined />,
      label: <Link to={ROUTES_APP.crm.customerList}>Khách hàng</Link>,
    },
    {
      key: "3",
      icon: <InboxOutlined />,
      label: <Link to={ROUTES_APP.crm.productPage}>Sản phẩm</Link>,
    },
    {
      key: "4",
      icon: <ContactsOutlined />,
      label: <Link to={ROUTES_APP.crm.contactList}>Liên hệ</Link>,
    },
    {
      key: "5",
      icon: <SolutionOutlined />,
      label: <Link to={ROUTES_APP.crm.quotationList}>Mẫu báo giá</Link>,
    },
    {
      key: "6",
      icon: <UserSwitchOutlined />,
      label: <Link to={ROUTES_APP.crm.leadList}>Khách tiềm năng</Link>,
    },
    {
      key: "7",
      icon: <DollarOutlined />,
      label: <Link to={ROUTES_APP.crm.opportunityList}>Cơ hội</Link>,
    },
    {
      key: "8",
      icon: <FileTextOutlined />,
      label: <Link to={ROUTES_APP.crm.contractList}>Hợp đồng</Link>,
    },
    {
      key: "9",
      icon: <AccountBookOutlined />,
      label: <Link to={ROUTES_APP.crm.debtReportList}>Báo cáo công nợ</Link>,
    },
  ];

  return (
    <div className="sidebar-container">
      <div className="sidebar-logo">{collapsed ? "L" : "Logo"}</div>

      <Menu
        theme="dark"
        mode="inline"
        inlineCollapsed={collapsed}
        defaultSelectedKeys={[selectedKey]}
        items={items}
      />
    </div>
  );
};

export default SidebarMenu;
