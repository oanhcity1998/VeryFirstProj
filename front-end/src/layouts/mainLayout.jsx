import React, { useState } from "react";
import { Layout, Button, Input, Avatar, Badge, Drawer, Form, Select, Popover, Space, Modal, message, Upload } from "antd";
import {
  SettingOutlined,
  FilterOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellOutlined,
  UploadOutlined, 
  DownloadOutlined,
  InboxOutlined,
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
  const [importOpen, setImportOpen] = useState(false);
  const [importing, setImporting] = useState(false);

  // popover
  const settingsContent = (
  <Space direction="vertical">
    <Button type="text" icon={<UploadOutlined />} onClick={() => setImportOpen(true)}>
      Import
    </Button>
    <Button type="text" icon={<DownloadOutlined />} onClick={() => console.log("Export clicked")}>
      Export
    </Button>
  </Space>
);

  //import
  const handleUpload = async (file) => {
    setImporting(true);
    try {
      // 👉 simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      message.success(`${file.name} đã được import thành công`);
      setImportOpen(false);
    } catch (err) {
      message.error("Import thất bại");
    } finally {
      setImporting(false);
    }
    return false; // prevent auto-upload by antd
  };

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
            {/* Filter button opens drawer */}
            <Button icon={<FilterOutlined />} onClick={() => setFilterOpen(true)}>
              Bộ lọc
            </Button>

            {/* setting button */}
            <Popover
              content={settingsContent}
              trigger="click"
              placement="bottom"
            >
              <Button icon={<SettingOutlined />}>Cài đặt</Button>
            </Popover>
            {/* Import confirmation modal */}
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
            </Modal>        
            
            {/* notification button */}
            <Badge count={3} offset={[0, 5]}>
              <BellOutlined className="bell-icon" />
            </Badge>
            
            {/* avatat button */}
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
