import { Menu } from "antd";
import { HomeOutlined, UserOutlined, UploadOutlined, InboxOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./SidebarMenu.css";

const SidebarMenu = ({ collapsed }) => {
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
        defaultSelectedKeys={["1"]}
        items={items}  
      />
    </div>
  );
};

export default SidebarMenu;
