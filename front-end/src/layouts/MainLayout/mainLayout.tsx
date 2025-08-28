import React, { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import {
  Layout,
  Button,
  Input,
  Avatar,
  Badge,
  Drawer,
  Popover,
  Space,
  Modal,
  message,
  Upload,
  Dropdown,
} from "antd";
import {
  SettingOutlined,
  FilterOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  AppstoreOutlined,
  BellOutlined,
  UploadOutlined,
  DownloadOutlined,
  InboxOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import SidebarMenu from "../../components/SideBar/SidebarMenu";
import "./mainLayout.css";
// import FilterDrawer from "../components/FilterDrawer";
import { ROUTES_APP } from "../../routes";

const { Header, Sider, Content } = Layout;
const { Search } = Input;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  // const [filterOpen, setFilterOpen] = useState(false);
  // const [importOpen, setImportOpen] = useState(false);
  // const [importing, setImporting] = useState(false);

  const navigate = useNavigate();

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
        onClick: () => console.log("CRM clicked"),
      },
      {
        key: "hrm",
        label: (
          <div className="apps-item">
            <img src="/images/hrm.png" alt="HRM" className="apps-icon" />
            <span className="apps-label">HRM</span>
          </div>
        ),
        onClick: () => console.log("HRM clicked"),
      },
    ],
  };

  // popover for settings
  // const settingsContent = (
  //   <Space direction="vertical">
  //     <Button type="text" icon={<UploadOutlined />} onClick={() => setImportOpen(true)}>
  //       Import
  //     </Button>
  //     <Button type="text" icon={<DownloadOutlined />} onClick={() => console.log("Export clicked")}>
  //       Export
  //     </Button>
  //   </Space>
  // );

  // // upload handler
  // const handleUpload = async (file) => {
  //   setImporting(true);
  //   try {
  //     await new Promise((resolve) => setTimeout(resolve, 1500)); // fake API call
  //     message.success(`${file.name} đã được import thành công`);
  //     setImportOpen(false);
  //   } catch (err) {
  //     message.error("Import thất bại");
  //   } finally {
  //     setImporting(false);
  //   }
  //   return false;
  // };

  // ✅ Dropdown menu for Avatar
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
    <Layout className="main-layout">
      <Sider theme="dark" collapsible collapsed={collapsed} trigger={null} width={200}>
        <SidebarMenu collapsed={collapsed} />
      </Sider>

      <Layout>
        <Header className="main-header">
          {/* Left */}
          <div className="header-left">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="trigger-btn"
            />
            {/* <Search placeholder="Search..." allowClear className="header-search" /> */}
          </div>

          {/* Right */}
          <div className="header-actions">
            {/* <Button icon={<FilterOutlined />} onClick={() => setFilterOpen(true)}>
              Bộ lọc
            </Button> */}

            {/* <Popover content={settingsContent} trigger="click" placement="bottom">
              <Button icon={<SettingOutlined />}>Cài đặt</Button>
            </Popover>

            <Modal
              open={importOpen}
              title="Import dữ liệu"
              onCancel={() => setImportOpen(false)}
              footer={null}
              centered
            >
              <Upload.Dragger
                name="file"
                multiple={false}
                beforeUpload={handleUpload}
                showUploadList={false}
                disabled={importing}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click hoặc kéo thả file vào đây để Import</p>
                <p className="ant-upload-hint">Chỉ chấp nhận 1 file mỗi lần</p>
              </Upload.Dragger>
            </Modal> */}
            {/* Apps button */}
            {/* ✅ Apps button with Dropdown (new API) */}
            <Dropdown menu={appsMenu} placement="bottomRight" trigger={["click"]}>
              <Button type="text" icon={<AppstoreOutlined style={{ fontSize: "18px" }} />} />
            </Dropdown>

            {/* Notification button  */}
            <Badge count={3} offset={[0, 5]}>
              <BellOutlined className="bell-icon" />
            </Badge>

            {/* ✅ Avatar dropdown */}
            <Dropdown menu={avatarMenu} placement="bottomRight" trigger={["click"]}>
              <Avatar style={{ cursor: "pointer" }}>U</Avatar>
            </Dropdown>
          </div>
        </Header>

        <Content className="main-content">
          <Outlet />
        </Content>
      </Layout>

      {/* Drawer
      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onConfirm={(values) => console.log("Apply filter:", values)}
      /> */}
    </Layout>
  );
};

export default MainLayout;
