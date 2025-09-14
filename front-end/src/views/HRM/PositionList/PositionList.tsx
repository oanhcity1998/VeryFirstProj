import { useState, useEffect } from "react";
import { Button, Modal, Upload, Select, Pagination } from "antd";
import { PlusOutlined, InboxOutlined, DeleteOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import "./PositionList.css";
import Search from "antd/es/input/Search";
import TablePosition from "@/components/HRM/TablePosition/TablePosition";
import PositionForm from "@/components/HRM/PositionForm/PositionForm";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { setJobs, addJob, updateJob, deleteJobs, setError } from "@/redux/HRM/slices/jobSlice";
import {
  useGetJobsQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
} from "@/services/HRM/job.service";
import { Job } from "@/models/HRM/job.model";

const { Dragger } = Upload;

const PositionList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { jobs, meta, error } = useAppSelector((state) => state.job);
  const [queryParams, setQueryParams] = useState({
    q: "",
    page: 1,
    limit: 10,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [importOpen, setImportOpen] = useState<boolean>(false);
  const [importing, setImporting] = useState<boolean>(false);
  const [selectedPosition, setSelectedPosition] = useState<Job | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Prevent double submissions

  const { data, isLoading, isError } = useGetJobsQuery(queryParams);
  const [createJob, { isLoading: isCreating }] = useCreateJobMutation();
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();
  const [deleteJob, { isLoading: isDeleting }] = useDeleteJobMutation();

  useEffect(() => {
    if (data) {
      dispatch(setJobs(data));
    }
    if (isError) {
      dispatch(setError("Failed to fetch jobs"));
      toast.error("Không thể tải danh sách chức vụ");
    }
  }, [data, isError, dispatch]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const ids = selectedRowKeys.map((key) => parseInt(key));
      const promises = ids.map((id) => deleteJob(id).unwrap());
      const results = await Promise.allSettled(promises);

      const errors = results
        .map((result, index) => {
          if (result.status === "rejected") {
            return `Không thể xóa chức vụ ID ${ids[index]}: ${result.reason.error || "Lỗi không xác định"}`;
          }
          return null;
        })
        .filter((error) => error !== null);

      if (errors.length > 0) {
        toast.error(
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            <p>Có lỗi khi xóa chức vụ:</p>
            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
              {errors.join("\n")}
            </pre>
          </div>,
          { autoClose: 5000 }
        );
      } else {
        dispatch(deleteJobs(ids));
        toast.success("Đã xóa chức vụ thành công");
      }
    } catch (err) {
      toast.error("Không thể xóa chức vụ");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
      setSelectedRowKeys([]);
    }
  };

  const handleUpload = async (file: File) => {
    const fileType = file.name.split(".").pop()?.toLowerCase();
    if (fileType !== "xlsx" && fileType !== "csv") {
      toast.error("File không hợp lệ. Vui lòng tải lên file .xlsx hoặc .csv.");
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

      const requiredFields = ["name", "code", "priority_level", "note"];
      const headerRow = (json[0] as string[]) || [];
      const newJobs: Job[] = [];
      const errors: string[] = [];

      const missingHeaders = requiredFields.filter((field) => !headerRow.includes(field));
      if (missingHeaders.length > 0) {
        toast.error(`File thiếu các cột bắt buộc: ${missingHeaders.join(", ")}`);
        setImporting(false);
        setImportOpen(false);
        return;
      }

      for (let i = 1; i < json.length; i++) {
        const row = json[i] as any[];
        const newJob: Partial<Job> = {};
        let rowHasError = false;

        for (let j = 0; j < headerRow.length; j++) {
          const key = headerRow[j] as keyof Job;
          const value = row[j];
          if (!value && key === "name") {
            errors.push(`Lỗi tại hàng ${i + 1}, cột "name": Dữ liệu bị trống.`);
            rowHasError = true;
          }
          if (key === "priority_level") {
            newJob[key] = value ? parseInt(value) : null;
          } else {
            newJob[key] = value ?? null;
          }
        }

        if (rowHasError) continue;

        newJob.id = Date.now() + i; // Temporary ID for local state
        newJobs.push(newJob as Job);
      }

      if (errors.length > 0) {
        toast.error(
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            <p>Có lỗi trong file của bạn:</p>
            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{errors.join("\n")}</pre>
          </div>,
          { autoClose: 5000 }
        );
        setImporting(false);
      } else {
        newJobs.forEach(async (job) => {
          try {
            const response = await createJob({
              name: job.name,
              code: job.code,
              priority_level: job.priority_level,
              note: job.note,
            }).unwrap();
            dispatch(addJob(response.data!));
            toast.success(`Đã thêm chức vụ ${job.name} thành công`);
          } catch (err) {
            toast.error(`Không thể import chức vụ: ${job.name}`);
          }
        });
        toast.success(`${newJobs.length} chức vụ đã được import thành công.`);
        setImportOpen(false);
        setImporting(false);
      }
    };

    reader.readAsBinaryString(file);
    return false;
  };

  const handleSave = async (values: Job) => {
    if (isSubmitting) return; // Prevent double submission
    setIsSubmitting(true);
    try {
      if (selectedPosition) {
        const response = await updateJob({
          id: selectedPosition.id,
          data: {
            name: values.name,
            code: values.code,
            priority_level: values.priority_level,
            note: values.note,
          },
        }).unwrap();
        dispatch(updateJob(response.data!));
        toast.success("Cập nhật chức vụ thành công");
      } else {
        const response = await createJob({
          name: values.name,
          code: values.code,
          priority_level: values.priority_level,
          note: values.note,
        }).unwrap();
        dispatch(addJob(response.data!));
        toast.success("Thêm chức vụ thành công");
      }
      setIsModalOpen(false);
      setSelectedPosition(null);
    } catch (err: any) {
      console.error("Update/Create error:", err); // Log error for debugging
      toast.error(`Không thể ${selectedPosition ? "cập nhật" : "thêm"} chức vụ: ${err.data?.error || "Lỗi không xác định"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (record: Job) => {
    setSelectedPosition(record);
    setIsModalOpen(true);
  };

  const handleSearch = (value: string) => {
    setQueryParams({ ...queryParams, q: value, page: 1 });
  };

  const handleFilterById = (id: string) => {
    const filtered = jobs.filter((item) => item.id.toString() === id);
    dispatch(setJobs({ data: filtered, meta: { page: 1, limit: filtered.length, total: filtered.length, pages: 1 } }));
    toast.info(`Đang hiển thị chức vụ với mã: ${id}`);
  };

  const idOptions = [...new Set(jobs.map((item) => item.id.toString()))];

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
            name="search"
          />
          <Select
            placeholder="Lọc theo mã chức vụ"
            style={{ width: 250 }}
            onChange={handleFilterById}
            options={idOptions.map((id) => ({
              value: id,
              label: id,
            }))}
            allowClear
          />
          <Modal
            open={importOpen}
            title="Import dữ liệu"
            onCancel={() => setImportOpen(false)}
            footer={null}
            centered
          >
            <Dragger
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
            okButtonProps={{ danger: true, loading: deleting || isDeleting }}
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
        data={jobs}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        onEdit={handleEdit}
        loading={isLoading || isCreating || isUpdating || isDeleting}
      />

      {meta && jobs.length > 0 && (
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
        loading={isSubmitting || isCreating || isUpdating}
      />
    </>
  );
};

export default PositionList;