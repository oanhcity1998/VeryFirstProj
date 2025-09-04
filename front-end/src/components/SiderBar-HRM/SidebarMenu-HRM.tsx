import { Menu } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import "./SidebarMenu-HRM.css";
import { ROUTES_APP } from "../../routes";

interface SidebarMenuHRMProps {
  collapsed: boolean;
}

const SidebarMenuHRM: React.FC<SidebarMenuHRMProps> = ({ collapsed }) => {
  const location = useLocation();

  // Map paths to keys
  let selectedKey: string = "1"; // default Trang chủ

  if (location.pathname === "/") {
    selectedKey = "1";
  } else if (location.pathname.startsWith("/hrm/employee-list")) {
    selectedKey = "2";
  } else if (location.pathname.startsWith("/hrm/position")) {
    selectedKey = "3";
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
      label: <Link to={ROUTES_APP.hrm.employeeList}>Nhân sự</Link>,
    },
    {
      key: "3",
      icon: <SolutionOutlined />,
      label: <Link to={ROUTES_APP.hrm.positionList}>Chức vụ</Link>,
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

export default SidebarMenuHRM;