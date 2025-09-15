import { useState, useEffect } from "react";
import { Button, Modal, Upload, Select, Pagination, Popover, Space, Empty, Spin } from "antd";
import {
  PlusOutlined,
  InboxOutlined,
  DeleteOutlined,
  SettingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import "./PositionList.css";
import Search from "antd/es/input/Search";
import TablePosition from "@/components/HRM/TablePosition/TablePosition";
import PositionForm from "@/components/HRM/PositionForm/PositionForm";
import {
  useCreateJobMutation,
  useDeleteJobMutation,
  useGetJobsQuery,
  useUpdateJobMutation,
} from "@/services/HRM/position.service";
import { Position } from "@/models/HRM/position.model";

const { Dragger } = Upload;

const PositionList: React.FC = () => {
  const [queryParams, setQueryParams] = useState({
    q: "",
    page: 1,
    limit: 10,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [importOpen, setImportOpen] = useState<boolean>(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [jobs, setJobs] = useState<Position[] | null>(null); // Add state for jobs
  const [meta, setMeta] = useState<{ page: number; limit: number; total: number; pages: number } | null>(null);

  const { data, isLoading, isError, refetch } = useGetJobsQuery(queryParams);
  const [createJob, { isLoading: isCreating }] = useCreateJobMutation();
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();
  const [deleteJob, { isLoading: isDeleting }] = useDeleteJobMutation();

  // Handle data fetching and state updates
  useEffect(() => {
    if (data) {
      const cleanList = Array.isArray(data.data)
        ? data.data.filter((item) => item && item.id !== undefined && item.id !== null)
        : [];
      setJobs(cleanList);
      if (data.meta) {
        setMeta({
          page: data.meta.page,
          limit: data.meta.limit,
          total: data.meta.total,
          pages: data.meta.page !== undefined ? data.meta.page : 1,
        });
      } else {
        setMeta(null);
      }
    }
  }, [data, isError]);

  // Reset meta but not jobs when queryParams change
  useEffect(() => {
    setMeta(null);
  }, [queryParams]);

  // Handle delete
  const handleDelete = async () => {
    try {
      const ids = selectedRowKeys.map((key) => parseInt(key));
      await Promise.all(ids.map((id) => deleteJob(id).unwrap()));
      toast.success("Đã xóa chức vụ thành công");
      setSelectedRowKeys([]);
      refetch();
    } catch {
      toast.error("Không thể xóa chức vụ");
    } finally {
      setDeleteOpen(false);
    }
  };

  // Handle import file excel/csv
  const handleUpload = async (file: File) => {
    const fileType = file.name.split(".").pop()?.toLowerCase();
    if (fileType !== "xlsx" && fileType !== "csv") {
      toast.error("File không hợp lệ. Vui lòng tải lên file .xlsx hoặc .csv.");
      return Upload.LIST_IGNORE;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const bstr = e.target?.result as string;
        const workbook = XLSX.read(bstr, { type: "binary" });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const headerRow = (json[0] as string[]) || [];
        const requiredFields = ["name", "code", "priority_level", "note"];
        const missingHeaders = requiredFields.filter((f) => !headerRow.includes(f));
        if (missingHeaders.length > 0) {
          toast.error(`File thiếu các cột: ${missingHeaders.join(", ")}`);
          return;
        }

        const newJobs: Position[] = [];
        for (let i = 1; i < json.length; i++) {
          const row = json[i] as any[];
          const newJob: Partial<Position> = {};
          headerRow.forEach((key, j) => {
            newJob[key as keyof Position] = row[j] ?? null;
          });
          newJobs.push(newJob as Position);
        }

        for (const job of newJobs) {
          await createJob(job).unwrap();
        }
        toast.success(`${newJobs.length} chức vụ đã được import thành công.`);
        refetch();
        setImportOpen(false);
      } catch (err: any) {
        toast.error(`Không thể import file: ${err.message}`);
      }
    };
    reader.readAsBinaryString(file);
    return false;
  };

  // Handle create/update
  const handleSave = async (values: Position) => {
    try {
      if (selectedPosition) {
        await updateJob({ id: selectedPosition.id, data: values }).unwrap();
        toast.success("Cập nhật chức vụ thành công");
      } else {
        await createJob(values).unwrap();
        toast.success("Thêm chức vụ thành công");
      }
      refetch();
      setIsModalOpen(false);
      setSelectedPosition(null);
    } catch (err: any) {
      toast.error(`Không thể lưu chức vụ: ${err.message || "Lỗi không xác định"}`);
    }
  };

  const handleEdit = (record: Position) => {
    setSelectedPosition(record);
    setIsModalOpen(true);
  };

  const handleSearch = (value: string) => {
    setQueryParams({ ...queryParams, q: value, page: 1 });
  };

  const showLoading = isLoading || jobs === null;

  return (
    <>
      <div className="position-list-header">
        <h2>Danh sách chức vụ</h2>
        <div className="position-list-actions">
          <Search
            className="position-search-bar"
            placeholder="Tìm kiếm theo tên chức vụ"
            allowClear
            onSearch={handleSearch}
          />
          <Select
            placeholder="Lọc theo mã chức vụ"
            style={{ width: 250 }}
            onChange={(code) => setQueryParams({ ...queryParams, q: code })}
            options={(jobs || []).map((item) => ({
              value: item.code,
              label: item.code,
            }))}
            allowClear
          />
          <Popover
            content={
              <Space direction="vertical" style={{ width: "100%" }}>
                <Button
                  type="text"
                  onClick={() => setImportOpen(true)}
                  disabled={isCreating}
                  icon={<UploadOutlined />}
                  block
                >
                  Nhập chức vụ
                </Button>
              </Space>
            }
            trigger="click"
            placement="bottom"
          >
            <Button icon={<SettingOutlined />}>Cài đặt</Button>
          </Popover>
          <Modal
            open={importOpen}
            title="Import dữ liệu chức vụ"
            onCancel={() => setImportOpen(false)}
            footer={null}
            centered
            width={600}
            bodyStyle={{ padding: "24px" }}
          >
            <Dragger
              name="file"
              multiple={false}
              beforeUpload={handleUpload}
              showUploadList={false}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ color: "#1890ff", fontSize: "48px" }} />
              </p>
              <p className="ant-upload-text">Kéo thả file hoặc click để tải lên</p>
              <p className="ant-upload-hint">Chỉ chấp nhận file .xlsx hoặc .csv</p>
            </Dragger>
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
            okButtonProps={{ danger: true, loading: isDeleting }}
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

      {showLoading ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" />
        </div>
      ) : jobs && jobs.length > 0 ? (
        <>
          <TablePosition
            data={jobs}
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
            onEdit={handleEdit}
            loading={isCreating || isUpdating || isDeleting}
          />
          {meta && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
              <Pagination
                current={meta.page}
                pageSize={meta.limit}
                total={meta.total}
                onChange={(page) => setQueryParams({ ...queryParams, page })}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "50px 0", color: "#888" }}>
          <Empty description="Không có chức vụ nào để hiển thị" />
          <p>Hiện tại không có dữ liệu chức vụ. Vui lòng thêm chức vụ mới!</p>
        </div>
      )}

      <PositionForm
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedPosition(null);
        }}
        onSave={handleSave}
        position={selectedPosition}
        modalTitle={selectedPosition ? "Cập nhật chức vụ" : "Thêm chức vụ"}
        cancelText="Hủy"
        saveText="Lưu"
        loading={isCreating || isUpdating}
      />
    </>
  );
};

export default PositionList