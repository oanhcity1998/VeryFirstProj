import { Menu } from "antd";
import { HomeOutlined, UserOutlined, UploadOutlined, SolutionOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import "./SidebarMenu-HRM.css";

const SidebarMenuHRM = ({ collapsed }) => {
    const location = useLocation();

    // Map paths to keys
    let selectedKey = "1"; // default Trang chủ

    if (location.pathname === "/") {
        selectedKey = "1";
    } else if (location.pathname.startsWith("/hrm/employee-list")) {
        selectedKey = "2";
    } else if (location.pathname.startsWith("/hrm/uploadlist")) {
        selectedKey = "3";
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
      label: <Link to="/hrm/employee-list">Khách hàng</Link>,
    },
    {
      key: "3",
      icon: <UploadOutlined />,
      label: <Link to="/hrm/uploadlist">Tải lên</Link>,
    },
  ];

  return (
    <div className="sidebar-container">
      <div className="sidebar-logo">
        {collapsed ? "L" : "Logo"}
      </div>

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

export default SidebarMenuHRM;