import { Menu } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  ContactsOutlined,
  InboxOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import "./SidebarMenu.css";

const SidebarMenu = ({ collapsed }) => {
  const location = useLocation();

  // Map paths to keys
  let selectedKey = "1"; // default Trang chủ

  if (location.pathname === "/") {
    selectedKey = "1";
  } else if (location.pathname.startsWith("/customerlist")) {
    selectedKey = "2";
  } else if (location.pathname.startsWith("/productlist")) {
    selectedKey = "3";
  } else if (location.pathname.startsWith("/contactlist")) {
    selectedKey = "4";
  } else if (location.pathname.startsWith("/quotationlist")) {
    selectedKey = "5";
  }

  const items = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: <Link to="/">Trang chủ</Link>,
    },
    {
      key: "2",
      icon: <UserOutlined />,
      label: <Link to="/customerlist">Khách hàng</Link>,
    },
    {
      key: "3",
      icon: <InboxOutlined />,
      label: <Link to="/productlist">Sản phẩm</Link>,
    },
    {
      key: "4",
      icon: <ContactsOutlined />,
      label: <Link to="/contactlist">Liên hệ</Link>,
    },
    {
      key: "5",
      icon: <SolutionOutlined />,
      label: <Link to="/quotationlist">Quotation</Link>,
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
