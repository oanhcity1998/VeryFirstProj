import { useState } from "react";
import { Button, Space, Modal, message, Dropdown, Menu, Upload } from "antd";
import {
  PlusOutlined,
  DeleteFilled,
  InboxOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import "./PositionList.css";
import TablePosition from "../../../components/TablePosition/TablePosition";
import PositionForm from "../../../components/PositionForm/PositionForm";
import Search from "antd/es/input/Search";

const PositionList = () => {
  const [data, setData] = useState([
    {
      key: "GD82334",
      id: "GD82334",
      positionName: "Head of Content Operations",
      priority: 0,
      note: "Expires on 03 Jun, 2023",
    },
    {
      key: "GD80938",
      id: "GD80938",
      positionName: "Design Lead",
      priority: 0,
      note: "Expires on 14 Mar, 2023",
    },
    {
      key: "GD82278",
      id: "GD82278",
      positionName: "Senior Interaction Designer",
      priority: 2,
      note: "Enrol (Expired on 30 Dec, 2021)",
    },
    {
      key: "GD88645",
      id: "GD88645",
      positionName: "Full Stack Software Engineer",
      priority: 1,
      note: "Expires on 01 Jun, 2023",
    },
    {
      key: "GD87123",
      id: "GD87123",
      positionName: "Interaction Designer",
      priority: 2,
      note: "Enrol (Expired on 26 Aug, 2022)",
    },
    {
      key: "GD80044",
      id: "GD80044",
      positionName: "Engineering Lead (Backend)",
      priority: 0,
      note: "Enrol (Expired on 11 Apr, 2022)",
    },
    {
      key: "GD89369",
      id: "GD89369",
      positionName: "Data Analyst Lead",
      priority: 5,
      note: "Expires on 01 Jun, 2023",
    },
    {
      key: "GD82295",
      id: "GD82295",
      positionName: "Product Analyst",
      priority: 2,
      note: "Expires on 03 Jun, 2023",
    },
    {
      key: "GD86110",
      id: "GD86110",
      positionName: "Product Executive",
      priority: 4,
      note: "Expired on 26 Aug, 2022",
    },
    {
      key: "GD84497",
      id: "GD84497",
      positionName: "Senior Product Manager",
      priority: 3,
      note: "Expires on 03 Jun, 2023",
    },
  ]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [filteredData, setFilteredData] = useState(data);

  // Handle delete
  const handleDelete = async () => {
    try {
      setDeleting(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const newData = data.filter((item) => !selectedRowKeys.includes(item.key));
      setData(newData);
      setFilteredData(newData); // Update filtered data after deletion
      message.success("Đã xóa chức vụ");
    } catch (err) {
      message.error("Không thể xóa chức vụ");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
      setSelectedRowKeys([]);
    }
  };

  // Handle upload for positions
  const handleUpload = async (file) => {
    const fileType = file.name.split(".").pop().toLowerCase();
    if (fileType !== "xlsx" && fileType !== "csv") {
      message.error("File không hợp lệ. Vui lòng tải lên file .xlsx hoặc .csv.");
      return Upload.LIST_IGNORE;
    }

    setImporting(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const bstr = e.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const requiredFields = ["id", "positionName", "priority", "note"];
      const headerRow = json[0] || [];
      const newPositions = [];
      const errors = [];

      const missingHeaders = requiredFields.filter(
        (field) => !headerRow.includes(field)
      );
      if (missingHeaders.length > 0) {
        message.error(
          `File thiếu các cột bắt buộc: ${missingHeaders.join(", ")}`
        );
        setImporting(false);
        setImportOpen(false);
        return;
      }

      for (let i = 1; i < json.length; i++) {
        const row = json[i];
        const newPosition = {};
        let rowHasError = false;

        for (let j = 0; j < headerRow.length; j++) {
          const key = headerRow[j];
          const value = row[j];
          if (!value && requiredFields.includes(key)) {
            errors.push(
              `Lỗi tại hàng ${i + 1}, cột "${key}": Dữ liệu bị trống.`
            );
            rowHasError = true;
          }
          newPosition[key] = value;
        }

        if (rowHasError) {
          continue;
        }

        newPosition.key = `GD-imported-${Date.now()}-${i}`;
        newPositions.push(newPosition);
      }

      if (errors.length > 0) {
        const errorMessages = errors.join("\n");
        message.error(
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            <p>Có lỗi trong file của bạn:</p>
            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
              {errorMessages}
            </pre>
          </div>,
          5
        );
        setImporting(false);
      } else {
        setData((prevData) => [...prevData, ...newPositions]);
        setFilteredData((prevData) => [...prevData, ...newPositions]); // Update filtered data after import
        const timestamp = dayjs().format("HH:mm:ss DD/MM/YYYY");
        const currentUser = "admin";
        console.log(
          `[Import Log] Tải lên thành công ${newPositions.length} chức vụ lúc ${timestamp} bởi ${currentUser}`
        );
        message.success(
          `${newPositions.length} chức vụ đã được import thành công.`
        );
        setImportOpen(false);
        setImporting(false);
      }
    };

    reader.readAsBinaryString(file);
    return false;
  };

  // Handle form save
  const handleSave = (values) => {
    if (selectedPosition) {
      // Update existing position
      const updatedData = data.map((item) =>
        item.key === selectedPosition.key ? { ...item, ...values } : item
      );
      setData(updatedData);
      setFilteredData(updatedData); // Update filtered data after update
      message.success("Cập nhật chức vụ thành công");
    } else {
      // Create new position
      const newPosition = {
        key: `GD${Date.now()}`,
        id: values.id,
        positionName: values.positionName,
        priority: values.priority,
        note: values.note,
      };
      setData([...data, newPosition]);
      setFilteredData([...filteredData, newPosition]); // Update filtered data after creation
      message.success("Thêm chức vụ thành công");
    }
  };

  // Handle edit
  const handleEdit = (record) => {
    setSelectedPosition(record);
    setIsModalOpen(true);
  };

  // Handle dropdown filter by ID
  const handleFilterById = (id) => {
    if (id === "all") {
      setFilteredData(data);
      message.info("Đang hiển thị tất cả chức vụ.");
    } else {
      const filtered = data.filter((item) => item.id === id);
      setFilteredData(filtered);
      message.info(`Đang hiển thị chức vụ với mã: ${id}`);
    }
  };

  // Generate dropdown menu items from unique IDs
  const idOptions = ["all", ...new Set(data.map((item) => item.id))];
  const menu = (
    <Menu
      onClick={(e) => handleFilterById(e.key)}
      items={idOptions.map((id) => ({
        key: id,
        label: id === "all" ? "Tất cả" : `Mã: ${id}`,
      }))}
    />
  );

  return (
    <>
      <div className="customer-list-header">
        <h2>Danh sách chức vụ</h2>
        <div className="customer-list-actions">
          <Space direction="vertical">
            <Search
              className="position-search-bar"
              placeholder="Tìm kiếm theo tên chức vụ"
              style={{ width: 250 }}
            />
          </Space>
          <Dropdown overlay={menu} placement="bottomLeft">
            <Button>Lọc theo mã chức vụ</Button>
          </Dropdown>
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
              <p className="ant-upload-text">
                Click hoặc kéo thả file vào đây để Import
              </p>
              <p className="ant-upload-hint">Chỉ chấp nhận 1 file mỗi lần</p>
            </Upload.Dragger>
          </Modal>
          <Button
            danger
            style={
              selectedRowKeys.length === 0
                ? {}
                : { backgroundColor: "red", color: "white" }
            }
            disabled={selectedRowKeys.length === 0}
            onClick={() => setDeleteOpen(true)}
            icon={<DeleteFilled />}
          >
            Xóa
          </Button>
          <Modal
            open={deleteOpen}
            title="Xác nhận xóa"
            onOk={handleDelete}
            onCancel={() => setDeleteOpen(false)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true, loading: deleting }}
            centered
          >
            <p>Bạn có chắc muốn xóa chức vụ này? Hành động này không thể hoàn tác.</p>
          </Modal>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedPosition(null);
              setIsModalOpen(true);
            }}
          >
            Tạo
          </Button>
        </div>
      </div>

      <TablePosition
        data={filteredData} // Use filtered data for the table
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        onEdit={handleEdit}
      />

      <PositionForm
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedPosition(null);
        }}
        onSave={handleSave}
        position={selectedPosition}
        modalTitle={selectedPosition ? "Cập nhật chức vụ" : "Thêm chức vụ"}
        infoTitle="Thông tin chức vụ"
        extraInfoTitle="Thông tin bổ sung"
        cancelText="Hủy"
        saveText="Lưu"
      />
    </>
  );
};

export default PositionList;
