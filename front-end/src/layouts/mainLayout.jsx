import React, { useState } from "react";
import { Layout, Button, Input, Avatar, Badge, Drawer, Form, Select } from "antd";
import {
  SettingOutlined,
  FilterOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellOutlined,
} from "@ant-design/icons";
import SidebarMenu from "../components/SidebarMenu";
import { Outlet } from "react-router-dom";
import "./mainLayout.css";
import FilterDrawer from "../components/FilterDrawer";

const { Header, Sider, Content } = Layout;
const { Search } = Input;
const { Option } = Select;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <Layout className="main-layout">
      <Sider theme="dark" collapsible collapsed={collapsed} trigger={null} width={200}>
        <SidebarMenu collapsed={collapsed} />
      </Sider>

      <Layout>
        <Header className="main-header">
          {/* Left: trigger + search */}
          <div className="header-left">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="trigger-btn"
            />
            <Search placeholder="Search..." allowClear className="header-search" />
          </div>

          {/* Right: actions */}
          <div className="header-actions">
            {/* ✅ Filter button opens drawer */}
            <Button icon={<FilterOutlined />} onClick={() => setFilterOpen(true)}>
              Bộ lọc
            </Button>

            <Button icon={<SettingOutlined />}>Cài đặt</Button>

            <Badge count={3} offset={[0, 5]}>
              <BellOutlined className="bell-icon" />
            </Badge>

            <Avatar>U</Avatar>
          </div>
        </Header>

        <Content className="main-content">
          <Outlet />
        </Content>
      </Layout>

      {/* ✅ Drawer for filters */}
       <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onConfirm={(values) => console.log("Apply filter:", values)}
      />
    </Layout>
  );
};

export default MainLayout;
