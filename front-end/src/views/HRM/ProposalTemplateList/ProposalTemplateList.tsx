import { useState } from "react";
import { Button, Space, Modal, message, Upload, Select, DatePicker } from "antd";
import { PlusOutlined, DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import Search from "antd/es/input/Search";
import ProposalTemplateForm from "@/components/HRM/ProposalTemplateForm/ProposalTemplateForm";
import TableProposalTemplate from "@/components/HRM/TableProposalTemplate/TableProposalTemplate";

const { RangePicker } = DatePicker;

export interface ProposalTemplate {
  key: string;
  name: string;
  type: string;
  creator: string;
  createdDate: string;
  quantity: number;
  approvalRequired: string;
  status: "Mới" | "Cũ";
}

const ProposalTemplateList: React.FC = () => {
  const [data, setData] = useState<ProposalTemplate[]>([
    {
      key: "PT001",
      name: "Mẫu đề xuất IT",
      type: "Thiết bị",
      creator: "Nguyễn Văn A",
      createdDate: "01/09/2025",
      quantity: 10,
      approvalRequired: "05/09/2025",
      status: "Mới",
    },
    {
      key: "PT002",
      name: "Mẫu đề xuất văn phòng phẩm",
      type: "Văn phòng phẩm",
      creator: "Trần Thị B",
      createdDate: "28/08/2025",
      quantity: 50,
      approvalRequired: "30/08/2025",
      status: "Cũ",
    },
  ]);

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
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterCreator, setFilterCreator] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"Mới" | "Cũ" | null>(null);
  const [filterDateRange, setFilterDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  // Apply all filters together
  const applyFilters = () => {
    let filtered = [...data];

    // if (filterName) {
    //   filtered = filtered.filter((item) =>
    //     item.name.toLowerCase().includes(filterName.toLowerCase())
    //   );
    // }
    // if (filterType) filtered = filtered.filter((item) => item.type === filterType);
    // if (filterCreator) filtered = filtered.filter((item) => item.creator === filterCreator);
    if (filterStatus) filtered = filtered.filter((item) => item.status === filterStatus);
    if (filterDateRange) {
      const [start, end] = filterDateRange;
      filtered = filtered.filter((item) => {
        const d = dayjs(item.approvalRequired, "DD/MM/YYYY");
        return d.isSameOrAfter(start, "day") && d.isSameOrBefore(end, "day");
      });
    }

    setFilteredData(filtered);
  };

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
        "type",
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
          } else if (key === "createdDate" || key === "approvalRequired") {
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

  const creatorOptions = [...new Set(data.map((d) => d.creator))];
  const typeOptions = [...new Set(data.map((d) => d.type))];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <h2>Danh sách mẫu đề xuất</h2>

        <Space wrap>
          <Search
            placeholder="Tên mẫu đề xuất"
            allowClear
            style={{ width: 150 }}
            onChange={(e) => {
              setFilterName(e.target.value);
              applyFilters();
            }}
          />
          {/*   <Select
            placeholder="Loại mẫu"
            style={{ width: 150 }}
            allowClear
            options={typeOptions.map((t) => ({ value: t, label: t }))}
            onChange={(val) => {
              setFilterType(val);
              applyFilters();
            }}
          />
          <Select
            placeholder="Người tạo"
            style={{ width: 150 }}
            allowClear
            options={creatorOptions.map((c) => ({ value: c, label: c }))}
            onChange={(val) => {
              setFilterCreator(val);
              applyFilters();
            }}
          /> */}
          <RangePicker
            style={{ width: 250, height: 32 }}
            format="DD/MM/YYYY"
            placeholder={["Bắt buộc phê duyệt ngày", "Đến ngày"]}
            onChange={(dates) => {
              setFilterDateRange(dates as any);
              applyFilters();
            }}
          />
          <Select
            placeholder="Trạng thái"
            style={{ width: 120 }}
            allowClear
            options={[
              { value: "Mới", label: "Mới" },
              { value: "Cũ", label: "Cũ" },
            ]}
            onChange={(val) => {
              setFilterStatus(val as "Mới" | "Cũ");
              applyFilters();
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
        saveText="Lưu"
      />
    </>
  );
};

export default ProposalTemplateList;
