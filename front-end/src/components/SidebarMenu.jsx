import { Menu } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  UploadOutlined,
  ContactsOutlined,
  FileTextOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./SidebarMenu.css";

const SidebarMenu = ({ collapsed }) => {
  const items = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: <Link to="/">Home</Link>,
    },
    {
      key: "2",
      icon: <UserOutlined />,
      label: <Link to="/customerlist">Customer</Link>,
    },
    {
      key: "3",
      icon: <ContactsOutlined />,
      label: <Link to="/contact-list">Contact</Link>,
    },
    {
      key: "4",
      icon: <SolutionOutlined />,
      label: <Link to="/quotation-list">Quotation</Link>,
    },
    {
      key: "10",
      icon: <UploadOutlined />,
      label: "Upload",
    },
  ];

  return (
    <div className="sidebar-container">
      <div className="sidebar-logo">{collapsed ? "L" : "Logo"}</div>

      <Menu
        theme="dark"
        mode="inline"
        inlineCollapsed={collapsed}
        defaultSelectedKeys={["1"]}
        items={items}
      />
    </div>
  );
};

export default SidebarMenu;
