import React from "react";
import { Menu } from "antd";
import { HomeOutlined, UserOutlined, UploadOutlined } from "@ant-design/icons";
import "./SidebarMenu.css"; // 
import { Link } from "react-router-dom";  

const SidebarMenu = ({ collapsed }) => {
  return (
    <div className="sidebar-container">
      {/* Logo / Box at top */}
      <div className="sidebar-logo">
        {collapsed ? "L" : "Logo"}
      </div>

      {/* Menu */}
      <Menu
        theme="dark"
        mode="inline"
        inlineCollapsed={collapsed}
        defaultSelectedKeys={["1"]}
      >
        <Menu.Item key="1" icon={<HomeOutlined />}>
          Home
        </Menu.Item>
        <Menu.Item key="2" icon={<UserOutlined />}>
          <Link to="/customerlist">Customer</Link> 
        </Menu.Item>
        <Menu.Item key="3" icon={<UploadOutlined />}>
          Upload
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default SidebarMenu;
