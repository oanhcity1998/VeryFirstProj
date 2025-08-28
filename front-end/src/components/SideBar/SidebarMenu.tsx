import { Menu } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  ContactsOutlined,
  InboxOutlined,
  SolutionOutlined,
  TeamOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import "./SidebarMenu.css";
import { ROUTES_APP } from "../../routes";

const SidebarMenu = ({ collapsed }) => {
  const location = useLocation();

  // Map paths to keys
  let selectedKey = "1"; // default Trang chủ

  if (location.pathname === ROUTES_APP.home) {
    selectedKey = "1";
  } else if (location.pathname.startsWith(ROUTES_APP.customerList)) {
    selectedKey = "2";
  } else if (location.pathname.startsWith(ROUTES_APP.productPage)) {
    selectedKey = "3";
  } else if (location.pathname.startsWith(ROUTES_APP.contactList)) {
    selectedKey = "4";
  } else if (location.pathname.startsWith(ROUTES_APP.quotationList)) {
    selectedKey = "5";
  } else if (location.pathname.startsWith(ROUTES_APP.leadList)) {
    selectedKey = "6";
  } else if (location.pathname.startsWith(ROUTES_APP.opportunityList)) {
    selectedKey = "7";
  }

  const items = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: <Link to={ROUTES_APP.home}>Trang chủ</Link>,
    },
    {
      key: "2",
      icon: <UserOutlined />,
      label: <Link to={ROUTES_APP.contactList}>Khách hàng</Link>,
    },
    {
      key: "3",
      icon: <InboxOutlined />,
      label: <Link to={ROUTES_APP.productPage}>Sản phẩm</Link>,
    },
    {
      key: "4",
      icon: <ContactsOutlined />,
      label: <Link to={ROUTES_APP.contactList}>Liên hệ</Link>,
    },
    {
      key: "5",
      icon: <SolutionOutlined />,
      label: <Link to={ROUTES_APP.quotationList}>Mẫu báo giá</Link>,
    },
    {
      key: "6",
      icon: <TeamOutlined />,
      label: <Link to={ROUTES_APP.leadList}>Lead</Link>,
    },
    {
      key: "7",
      icon: <DollarOutlined />,
      label: <Link to={ROUTES_APP.opportunityList}>Opportunity</Link>,
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
