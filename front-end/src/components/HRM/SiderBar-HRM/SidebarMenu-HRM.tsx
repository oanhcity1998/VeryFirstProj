import { Menu } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  SolutionOutlined,
  TeamOutlined,
  AppstoreOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import "./SidebarMenu-HRM.css";
import { ROUTES_APP } from "@/app/routes";

interface SidebarMenuHRMProps {
  collapsed: boolean;
}

const SidebarMenuHRM: React.FC<SidebarMenuHRMProps> = ({ collapsed }) => {
  const location = useLocation();

  // Map paths to keys
  let selectedKey: string = "1"; // default Trang chủ

  if (location.pathname === "/") {
    selectedKey = "1";
  } else if (location.pathname.startsWith(ROUTES_APP.hrm.employeeList)) {
    selectedKey = "2";
  } else if (location.pathname.startsWith(ROUTES_APP.hrm.positionList)) {
    selectedKey = "3";
  } else if (location.pathname.startsWith(ROUTES_APP.hrm.departmentList)) {
    selectedKey = "4";
  } else if (location.pathname.startsWith(ROUTES_APP.hrm.assetList)) {
    selectedKey = "5";
  } else if (location.pathname.startsWith(ROUTES_APP.hrm.proposalTemplateList)) {
    selectedKey = "6";
  } else if (location.pathname.startsWith(ROUTES_APP.hrm.proposalList)) {
    selectedKey = "7";
  }

  const items = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: <Link to={ROUTES_APP.hrm.homeHRM}>Trang chủ</Link>,
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
    {
      key: "4",
      icon: <TeamOutlined />,
      label: <Link to={ROUTES_APP.hrm.departmentList}>Phòng ban</Link>,
    },
    {
      key: "5",
      icon: <AppstoreOutlined />,
      label: <Link to={ROUTES_APP.hrm.assetList}>Tài sản</Link>,
    },
    {
      key: "6",
      icon: <NotificationOutlined />,
      label: <Link to={ROUTES_APP.hrm.proposalTemplateList}>Mẫu đề xuất</Link>,
    },
    {
      key: "7",
      icon: <NotificationOutlined />,
      label: <Link to={ROUTES_APP.hrm.proposalList}>Đề xuất</Link>,
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
