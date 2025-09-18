import { useState } from "react";
import { Button, Space, Modal, message, Upload, Select, Form, Input, DatePicker } from "antd";
import {
  PlusOutlined,
  DeleteFilled,
  InboxOutlined,
  FilterOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import dayjs from "dayjs";

import Search from "antd/es/input/Search";
import FilterDrawerAsset from "@/components/HRM/FilterAsset/FilterDrawerAsset";
import TableAsset from "@/components/HRM/TableAsset/TableAsset";
import AssetForm from "@/components/HRM/AssetForm/AssetForm";

interface Asset {
  key: string;
  id: string; // Mã tài sản
  name: string; // Tên tài sản
  purchaseDate: string; // Ngày mua
  value: number; // Giá trị ban đầu
  status: string; // Tình trạng (Mới/Cũ/Bảo trì)
  owner: string; // Nhân viên sở hữu
  warranty: string; // Hạn bảo hành
}

const { RangePicker } = DatePicker;

const AssetList: React.FC = () => {
  const [data, setData] = useState<Asset[]>([
    {
      key: "TL82334",
      id: "TL82334",
      name: "iPhone 13",
      purchaseDate: "15/01/2025",
      value: 16700000,
      status: "Mới",
      owner: "Nguyễn Nhật Huy",
      warranty: "15/01/2027",
    },
    {
      key: "TL80938",
      id: "TL80938",
      name: "Lenovo ThinkPro 13",
      purchaseDate: "10/03/2024",
      value: 18900000,
      status: "Cũ",
      owner: "Hoàng Nhật Quang",
      warranty: "10/03/2026",
    },
    {
      key: "TL82278",
      id: "TL82278",
      name: "HP Pav Pro",
      purchaseDate: "20/06/2025",
      value: 15900000,
      status: "Mới",
      owner: "Nguyễn Tâm Minh",
      warranty: "20/06/2027",
    },
    {
      key: "TL88645",
      id: "TL88645",
      name: "Asus XD",
      purchaseDate: "05/11/2023",
      value: 14500000,
      status: "Cũ",
      owner: "Trần Nguyễn Minh Khôi",
      warranty: "05/11/2025",
    },
    {
      key: "TL87123",
      id: "TL87123",
      name: "Samsung Galaxy Fold Z 3",
      purchaseDate: "12/04/2025",
      value: 35940000,
      status: "Mới",
      owner: "Trần Hải Nam",
      warranty: "12/04/2027",
    },
    {
      key: "TL80044",
      id: "TL80044",
      name: "Huawei GT 3",
      purchaseDate: "30/08/2024",
      value: 8500000,
      status: "Cũ",
      owner: "Nguyễn Bảo Long",
      warranty: "30/08/2026",
    },
    {
      key: "TL89369",
      id: "TL89369",
      name: "Huawei GT 3",
      purchaseDate: "01/09/2025",
      value: 9000000,
      status: "Mới",
      owner: "Đỗ Lan Chi",
      warranty: "01/09/2027",
    },
    {
      key: "TL82295",
      id: "TL82295",
      name: "HP Pav Pro",
      purchaseDate: "15/05/2024",
      value: 14900000,
      status: "Cũ",
      owner: "Lê Khánh An",
      warranty: "15/05/2026",
    },
    {
      key: "TL86110",
      id: "TL86110",
      name: "Macbook Pro 13",
      purchaseDate: "10/07/2025",
      value: 27900000,
      status: "Mới",
      owner: "Lương Nhật Trường",
      warranty: "10/07/2027",
    },
    {
      key: "TL84497",
      id: "TL84497",
      name: "Samsung Galaxy Fold Z 3",
      purchaseDate: "28/02/2024",
      value: 34900000,
      status: "Cũ",
      owner: "Bùi Linh Chi",
      warranty: "28/02/2026",
    },
  ]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [importOpen, setImportOpen] = useState<boolean>(false);
  const [importing, setImporting] = useState<boolean>(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [filteredData, setFilteredData] = useState<Asset[]>(data);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState<boolean>(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const newData = data.filter((item) => !selectedRowKeys.includes(item.key));
      setData(newData);
      setFilteredData(newData);
      message.success("Đã xóa tài sản");
    } catch (err) {
      message.error("Không thể xóa tài sản");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
      setSelectedRowKeys([]);
    }
  };

  const handleUpload = async (file: File) => {
    const fileType = file.name.split(".").pop()?.toLowerCase();
    if (fileType !== "xlsx" && fileType !== "csv") {
      message.error("File không hợp lệ. Vui lòng tải lên file .xlsx hoặc .csv.");
      return Upload.LIST_IGNORE;
    }

    setImporting(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const bstr = e.target?.result as string;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const requiredFields = ["id", "name", "purchaseDate", "value", "status", "owner", "warranty"];
      const headerRow = (json[0] as string[]) || [];
      const newAssets: Asset[] = [];
      const errors: string[] = [];

      const missingHeaders = requiredFields.filter((field) => !headerRow.includes(field));
      if (missingHeaders.length > 0) {
        message.error(`File thiếu các cột bắt buộc: ${missingHeaders.join(", ")}`);
        setImporting(false);
        setImportOpen(false);
        return;
      }

      for (let i = 1; i < json.length; i++) {
        const row = json[i] as any[];
        const newAsset: Partial<Asset> = {};
        let rowHasError = false;

        for (let j = 0; j < headerRow.length; j++) {
          const key = headerRow[j] as keyof Asset;
          const value = row[j];
          if (!value && requiredFields.includes(key)) {
            errors.push(`Lỗi tại hàng ${i + 1}, cột "${key}": Dữ liệu bị trống.`);
            rowHasError = true;
          } else if (key === "value" && (isNaN(Number(value)) || Number(value) <= 0)) {
            errors.push(`Lỗi tại hàng ${i + 1}, cột "${key}": Giá trị phải là số dương.`);
            rowHasError = true;
          } else if (key === "purchaseDate" || key === "warranty") {
            const dateValue = dayjs(value, "DD/MM/YYYY", true);
            if (!dateValue.isValid()) {
              errors.push(
                `Lỗi tại hàng ${i + 1}, cột "${key}": Ngày không hợp lệ (định dạng DD/MM/YYYY).`
              );
              rowHasError = true;
            } else {
              newAsset[key] = dateValue.format("DD/MM/YYYY");
            }
          } else {
            newAsset[key] = value;
          }
        }

        if (rowHasError) {
          continue;
        }

        newAsset.key = `AS-imported-${Date.now()}-${i}`;
        newAssets.push(newAsset as Asset);
      }

      if (errors.length > 0) {
        const errorMessages = errors.join("\n");
        message.error(
          <div>
            <p>Có lỗi trong file của bạn:</p>
            <pre>{errorMessages}</pre>
          </div>,
          5
        );
        setImporting(false);
      } else {
        setData((prevData) => [...prevData, ...newAssets]);
        setFilteredData((prevData) => [...prevData, ...newAssets]);
        const timestamp = dayjs().format("HH:mm:ss DD/MM/YYYY");
        const currentUser = "admin";
        console.log(
          `[Import Log] Tải lên thành công ${newAssets.length} tài sản lúc ${timestamp} bởi ${currentUser}`
        );
        message.success(`${newAssets.length} tài sản đã được import thành công.`);
        setImportOpen(false);
        setImporting(false);
      }
    };

    reader.readAsBinaryString(file);
    return false;
  };

  const handleSave = (values: Asset) => {
    if (selectedAsset) {
      const updatedData = data.map((item) =>
        item.key === selectedAsset.key ? { ...item, ...values } : item
      );
      setData(updatedData);
      setFilteredData(updatedData);
      message.success("Cập nhật tài sản thành công");
    } else {
      const newAsset: Asset = {
        key: `AS${Date.now()}`,
        id: values.id || "",
        name: values.name || "",
        purchaseDate: values.purchaseDate || "",
        value: values.value || 0,
        status: values.status || "",
        owner: values.owner || "",
        warranty: values.warranty || "",
      };
      setData([...data, newAsset]);
      setFilteredData([...filteredData, newAsset]);
      message.success("Thêm tài sản thành công");
    }
  };

  const handleEdit = (record: Asset) => {
    setSelectedAsset(record);
    setIsModalOpen(true);
  };

  const handleSearch = (value: string) => {
    const filtered = data.filter((item) => item.name.toLowerCase().includes(value.toLowerCase()));
    setFilteredData(filtered);
    message.info(`Đang tìm kiếm tài sản: ${value}`);
  };

  const handleFilter = (values: any) => {
    let filtered = [...data];

    if (values.id) {
      filtered = filtered.filter((item) => item.id === values.id);
    }
    if (values.status) {
      filtered = filtered.filter((item) => item.status === values.status);
    }
    if (values.owner) {
      filtered = filtered.filter((item) => item.owner === values.owner);
    }
    if (values.valueRange) {
      const { from, to } = values.valueRange;
      if (from !== undefined || to !== undefined) {
        filtered = filtered.filter((item) => {
          const itemValue = item.value;
          const fromValue = from ? Number(from) : Number.NEGATIVE_INFINITY;
          const toValue = to ? Number(to) : Number.POSITIVE_INFINITY;
          return itemValue >= fromValue && itemValue <= toValue;
        });
      }
    }

    setFilteredData(filtered);
    message.info("Đã áp dụng bộ lọc");
  };

  const idOptions = [...new Set(data.map((item) => item.id))];
  const typeOptions = [...new Set(data.map((item: any) => item.type || ""))].filter(Boolean);
  const statusOptions = [...new Set(data.map((item) => item.status))];
  const ownerOptions = [...new Set(data.map((item) => item.owner))];

  return (
    <>
      <div className="list-header">
        <h2>Danh sách tài sản</h2>
        <div className="list-actions">
          <Space direction="vertical">
            <Search
              className="search-bar"
              placeholder="Tìm kiếm theo tên tài sản"
              allowClear
              onSearch={handleSearch}
            />
          </Space>
          <Button icon={<FilterOutlined />} onClick={() => setFilterDrawerOpen(true)}>
            Bộ lọc
          </Button>
          <FilterDrawerAsset
            open={filterDrawerOpen}
            onClose={() => setFilterDrawerOpen(false)}
            onConfirm={handleFilter}
            typeOptions={typeOptions}
            statusOptions={statusOptions}
            idOptions={idOptions}
            ownerOptions={ownerOptions}
          />
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
          <Button
            danger
            icon={<DeleteOutlined />}
            disabled={selectedRowKeys.length === 0}
            onClick={() => setDeleteOpen(true)}
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
            <p>Bạn có chắc muốn xóa tài sản này? Hành động này không thể hoàn tác.</p>
          </Modal>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedAsset(null);
              setIsModalOpen(true);
            }}
          >
            Tạo
          </Button>
        </div>
      </div>

      <TableAsset
        data={filteredData}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        onEdit={handleEdit}
      />

      <AssetForm
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedAsset(null);
        }}
        onSave={handleSave as any}
        asset={selectedAsset}
        modalTitle={selectedAsset ? "Cập nhật tài sản" : "Thêm tài sản"}
        cancelText="Hủy"
        saveText="Xác nhận"
      />
    </>
  );
};

export default AssetList;
