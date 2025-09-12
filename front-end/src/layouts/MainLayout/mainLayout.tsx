import React, { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import {
  Layout,
  Button,
  Input,
  Avatar,
  Badge,
  message,
  Dropdown,
  Menu,
} from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  AppstoreOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "./mainLayout.css";
import { ROUTES_APP } from "../../app/routes";
import SidebarMenuHRM from "@/components/HRM/SiderBar-HRM/SidebarMenu-HRM";
import SidebarMenu from "@/components/CRM/SideBar/SidebarMenu";

const { Header, Sider, Content } = Layout;
const { Search } = Input;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isHRM, setIsHRM] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsHRM(location.pathname.startsWith("/hrm"));
  }, [location.pathname]);

  const appsMenu = {
    items: [
      {
        key: "crm",
        label: (
          <div className="apps-item">
            <img src="/images/crm.png" alt="CRM" className="apps-icon" />
            <span className="apps-label">CRM</span>
          </div>
        ),
        onClick: () => {
          setIsHRM(false);
          navigate(ROUTES_APP.crm.homeCRM);
          console.log("CRM clicked");
        },
      },
      {
        key: "hrm",
        label: (
          <div className="apps-item">
            <img src="/images/hrm.png" alt="HRM" className="apps-icon" />
            <span className="apps-label">HRM</span>
          </div>
        ),
        onClick: () => {
          setIsHRM(true);
          navigate(ROUTES_APP.hrm.homeHRM);
          console.log("HRM clicked");
        },
      },
    ],
  };

  const avatarMenu = {
    items: [
      {
        key: "profile",
        label: "Hồ sơ",
        icon: <UserOutlined />,
        onClick: () => navigate(ROUTES_APP.profile),
      },
      {
        key: "logout",
        label: "Đăng xuất",
        icon: <LogoutOutlined />,
        onClick: () => {
          message.success("Đã đăng xuất");
          navigate(ROUTES_APP.login);
        },
      },
    ],
  };

  return (
    <Layout className="main-layout" style={{ minHeight: "100vh" }}>
      <Sider
        theme="dark"
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={200}
      >
        {isHRM ? (
          <SidebarMenuHRM collapsed={collapsed} />
        ) : (
          <SidebarMenu collapsed={collapsed} />
        )}
      </Sider>

      <Layout>
        <Header className="main-header">
          <div className="header-left">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="trigger-btn"
            />
          </div>

          <div className="header-actions">
            <Dropdown
              menu={appsMenu}
              placement="bottomRight"
              trigger={["click"]}
            >
              <Button
                type="text"
                icon={<AppstoreOutlined style={{ fontSize: "18px" }} />}
              />
            </Dropdown>

            <Badge count={3} offset={[0, 5]}>
              <BellOutlined className="bell-icon" />
            </Badge>

            <Dropdown
              menu={avatarMenu}
              placement="bottomRight"
              trigger={["click"]}
              overlayClassName="avatar-dropdown"
            >
              <Avatar style={{ cursor: "pointer" }} icon={<UserOutlined />} />
            </Dropdown>
          </div>
        </Header>

        <Content className="main-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;