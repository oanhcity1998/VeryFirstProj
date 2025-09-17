import { use, useEffect, useState } from "react";
import { Button, Space, Modal, message, Upload, Select, DatePicker } from "antd";
import { PlusOutlined, DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import Search from "antd/es/input/Search";
import ProposalTemplateForm from "@/components/HRM/ProposalTemplateForm/ProposalTemplateForm";
import TableProposalTemplate from "@/components/HRM/TableProposalTemplate/TableProposalTemplate";

const { RangePicker } = DatePicker;

// Kiểu dữ liệu mẫu đề xuất
export interface FieldMeta {
  id: number;
  fieldName: string;
  dataType: string;
  required: boolean;
  example?: string;
  note?: string;
}
export interface ProposalTemplate {
  key: string; // ID hoặc khóa định danh
  name: string; // Tên mẫu đề xuất
  creator: string; // Người tạo
  createdDate: string; // Ngày tạo, có thể là ISO string
  quantity: number; // Số lượng đề xuất
  approvalRequired: "Có" | "Không"; // Bắt buộc phê duyệt
  status: "Hoạt động" | "Không hoạt động"; // Trạng thái phê duyệt
  fields: FieldMeta[];
}

export const statusProposalTemplateOptions: ProposalTemplate["status"][] = [
  "Hoạt động",
  "Không hoạt động",
];
export const approvalRequiredProposalTemplateOptions: ProposalTemplate["approvalRequired"][] = [
  "Có",
  "Không",
];

export const proposalTemplateMocks: ProposalTemplate[] = [
  {
    key: "PT001",
    name: "Mẫu đề xuất mua sắm văn phòng phẩm",
    creator: "Nguyễn Văn A",
    createdDate: "2025-09-10",
    quantity: 10,
    approvalRequired: "Có",
    status: "Hoạt động",
    fields: [
      {
        id: 1,
        fieldName: "Tên vật phẩm",
        dataType: "string",
        required: true,
        example: "Bút bi Thiên Long",
        note: "Tên văn phòng phẩm cần mua",
      },
      {
        id: 2,
        fieldName: "Số lượng",
        dataType: "number",
        required: true,
        example: "100",
        note: "Số lượng cụ thể",
      },
    ],
  },
  {
    key: "PT002",
    name: "Mẫu đề xuất nâng cấp máy chủ",
    creator: "Trần Thị B",
    createdDate: "2025-08-25",
    quantity: 3,
    approvalRequired: "Có",
    status: "Hoạt động",
    fields: [
      {
        id: 1,
        fieldName: "Cấu hình hiện tại",
        dataType: "string",
        required: true,
        example: "Xeon E5, RAM 64GB",
        note: "Thông tin cấu hình máy chủ hiện tại",
      },
      {
        id: 2,
        fieldName: "Cấu hình đề xuất",
        dataType: "string",
        required: true,
        example: "Xeon Gold, RAM 128GB",
        note: "Cấu hình mong muốn sau nâng cấp",
      },
    ],
  },
  {
    key: "PT003",
    name: "Mẫu đề xuất tổ chức sự kiện nội bộ",
    creator: "Lê Văn C",
    createdDate: "2025-09-01",
    quantity: 5,
    approvalRequired: "Không",
    status: "Không hoạt động",
    fields: [
      {
        id: 1,
        fieldName: "Tên sự kiện",
        dataType: "string",
        required: true,
        example: "Team Building 2025",
        note: "Tên gọi của sự kiện",
      },
      {
        id: 2,
        fieldName: "Ngày tổ chức",
        dataType: "date",
        required: true,
        example: "2025-10-15",
        note: "Ngày dự kiến diễn ra sự kiện",
      },
    ],
  },
  {
    key: "PT004",
    name: "Mẫu đề xuất mua phần mềm bản quyền",
    creator: "Phạm Thị D",
    createdDate: "2025-09-05",
    quantity: 2,
    approvalRequired: "Có",
    status: "Hoạt động",
    fields: [
      {
        id: 1,
        fieldName: "Tên phần mềm",
        dataType: "string",
        required: true,
        example: "Microsoft Office 365",
        note: "Tên phần mềm cần mua",
      },
      {
        id: 2,
        fieldName: "Số lượng license",
        dataType: "number",
        required: true,
        example: "50",
        note: "Số lượng giấy phép cần mua",
      },
    ],
  },
  {
    key: "PT005",
    name: "Mẫu đề xuất đào tạo nhân viên",
    creator: "Ngô Văn E",
    createdDate: "2025-08-30",
    quantity: 8,
    approvalRequired: "Không",
    status: "Không hoạt động",
    fields: [
      {
        id: 1,
        fieldName: "Tên khóa đào tạo",
        dataType: "string",
        required: true,
        example: "Kỹ năng thuyết trình",
        note: "Tên khóa học hoặc chương trình",
      },
      {
        id: 2,
        fieldName: "Ngày bắt đầu",
        dataType: "date",
        required: true,
        example: "2025-09-20",
        note: "Thời gian khai giảng dự kiến",
      },
    ],
  },
];

const ProposalTemplateList: React.FC = () => {
  const [data, setData] = useState<ProposalTemplate[]>(proposalTemplateMocks);

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [importOpen, setImportOpen] = useState<boolean>(false);
  const [importing, setImporting] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ProposalTemplate | null>(null);
  const [filteredData, setFilteredData] = useState<ProposalTemplate[]>(data);

  // Filter states
  const [filterName, setFilterName] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<ProposalTemplate["status"] | null>(null);
  const [filterApprovalRequired, setFilterApprovalRequired] = useState<
    ProposalTemplate["approvalRequired"] | null
  >(null);

  // Apply all filters together
  useEffect(() => {
    let filtered = [...data];

    if (filterName) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(filterName.toLowerCase())
      );
    }

    if (filterStatus) {
      filtered = filtered.filter((item) => item.status === filterStatus);
    }

    if (filterApprovalRequired) {
      filtered = filtered.filter((item) => item.approvalRequired === filterApprovalRequired);
    }

    setFilteredData(filtered);
  }, [data, filterName, filterStatus, filterApprovalRequired]);

  // Delete
  const handleDelete = async () => {
    try {
      setDeleting(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const newData = data.filter((item) => !selectedRowKeys.includes(item.key));
      setData(newData);
      setFilteredData(newData);
      message.success("Đã xóa mẫu đề xuất");
    } catch {
      message.error("Không thể xóa mẫu đề xuất");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
      setSelectedRowKeys([]);
    }
  };

  // Upload (import)
  const handleUpload = async (file: File) => {
    const fileType = file.name.split(".").pop()?.toLowerCase();
    if (fileType !== "xlsx" && fileType !== "csv") {
      message.error("File không hợp lệ. Chỉ chấp nhận .xlsx hoặc .csv");
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
      const requiredFields = [
        "name",
        "creator",
        "createdDate",
        "quantity",
        "approvalRequired",
        "status",
      ];
      const headerRow = (json[0] as string[]) || [];
      const newTemplates: ProposalTemplate[] = [];
      const errors: string[] = [];

      const missingHeaders = requiredFields.filter((f) => !headerRow.includes(f));
      if (missingHeaders.length > 0) {
        message.error(`File thiếu cột: ${missingHeaders.join(", ")}`);
        setImporting(false);
        setImportOpen(false);
        return;
      }

      for (let i = 1; i < json.length; i++) {
        const row = json[i] as any[];
        const newTemplate: Partial<ProposalTemplate> = {};
        let rowHasError = false;

        for (let j = 0; j < headerRow.length; j++) {
          const key = headerRow[j] as keyof ProposalTemplate;
          const value = row[j];

          if (!value && requiredFields.includes(key)) {
            errors.push(`Hàng ${i + 1}, cột "${key}" trống`);
            rowHasError = true;
          } else if (key === "quantity" && (isNaN(Number(value)) || Number(value) < 0)) {
            errors.push(`Hàng ${i + 1}, cột "${key}" phải >=0`);
            rowHasError = true;
          } else if (key === "createdDate") {
            const d = dayjs(value, "DD/MM/YYYY", true);
            if (!d.isValid()) {
              errors.push(`Hàng ${i + 1}, cột "${key}" không hợp lệ`);
              rowHasError = true;
            } else newTemplate[key] = d.format("DD/MM/YYYY");
          } else {
            newTemplate[key] = value;
          }
        }
        if (!rowHasError) newTemplate.key = `PT-imported-${Date.now()}-${i}`;
        if (!rowHasError) newTemplates.push(newTemplate as ProposalTemplate);
      }

      if (errors.length > 0) {
        message.error(
          <div style={{ maxHeight: 200, overflowY: "auto" }}>{errors.join(", ")}</div>,
          5
        );
        setImporting(false);
      } else {
        setData((prev) => [...prev, ...newTemplates]);
        setFilteredData((prev) => [...prev, ...newTemplates]);
        message.success(`${newTemplates.length} mẫu đề xuất import thành công`);
        setImportOpen(false);
        setImporting(false);
      }
    };

    reader.readAsBinaryString(file);
    return false;
  };

  // Save
  const handleSave = (values: ProposalTemplate) => {
    if (selectedTemplate) {
      const updatedData = data.map((item) =>
        item.key === selectedTemplate.key ? { ...item, ...values } : item
      );
      setData(updatedData);
      setFilteredData(updatedData);
      message.success("Cập nhật mẫu đề xuất thành công");
    } else {
      const { key, ...rest } = values;
      const newTemplate: ProposalTemplate = { key: `PT${Date.now()}`, ...rest };
      setData([...data, newTemplate]);
      setFilteredData([...filteredData, newTemplate]);
      message.success("Thêm mẫu đề xuất thành công");
    }
  };

  // Edit
  const handleEdit = (record: ProposalTemplate) => {
    setSelectedTemplate(record);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="list-header">
        <h2>Danh sách mẫu đề xuất</h2>
        <div className="list-actions">
          <Space wrap>
            <Search
              className="search-bar"
              placeholder="Tìm kiếm theo tên mẫu đề xuất"
              allowClear
              onChange={(e) => {
                setFilterName(e.target.value);
              }}
            />

            <Select
              className="filter-bar"
              placeholder="Lọc theo bắt buộc phê duyệt"
              allowClear
              options={approvalRequiredProposalTemplateOptions.map((s) => ({ value: s, label: s }))}
              onChange={(val) => {
                setFilterApprovalRequired(val);
              }}
            />

            <Select
              className="filter-bar"
              placeholder="Lọc theo trạng thái"
              allowClear
              options={statusProposalTemplateOptions.map((s) => ({ value: s, label: s }))}
              onChange={(val) => {
                setFilterStatus(val);
              }}
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
                <p className="ant-upload-text">Click hoặc kéo thả file để import</p>
                <p className="ant-upload-hint">Chỉ 1 file mỗi lần</p>
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
              <p>Bạn có chắc muốn xóa mẫu đề xuất này?</p>
            </Modal>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setSelectedTemplate(null);
                setIsModalOpen(true);
              }}
            >
              Tạo
            </Button>
          </Space>
        </div>
      </div>

      <TableProposalTemplate
        data={filteredData}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        onEdit={handleEdit}
      />

      <ProposalTemplateForm
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedTemplate(null);
        }}
        onSave={handleSave as any}
        template={selectedTemplate}
        modalTitle={selectedTemplate ? "Cập nhật mẫu đề xuất" : "Thêm mẫu đề xuất"}
        cancelText="Hủy"
        saveText="Xác nhận"
      />
    </>
  );
};

export default ProposalTemplateList;
