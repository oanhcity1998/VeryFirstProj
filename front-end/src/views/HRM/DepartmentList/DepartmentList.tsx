import { useState, useEffect } from "react";
import { Button, Modal, Upload, Select, Pagination } from "antd";
import { PlusOutlined, InboxOutlined, DeleteOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import "./DepartmentList.css";
import Search from "antd/es/input/Search";
import TableDepartment from "@/components/HRM/TableDepartment/TableDepartment";
import DepartmentForm from "@/components/HRM/DepartmentForm/DepartmentForm";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { setDepartments, addDepartment, updateDepartment, deleteDepartments, setError } from "@/redux/HRM/slices/departmentSlice";
import {
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} from "@/services/HRM/department.service";
import { Department } from "@/models/HRM/department.model";

const { Dragger } = Upload;

const DepartmentList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { departments, meta, error } = useAppSelector((state) => state.department);
  const [queryParams, setQueryParams] = useState({
    q: "",
    page: 1,
    limit: 5,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [importOpen, setImportOpen] = useState<boolean>(false);
  const [importing, setImporting] = useState<boolean>(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { data, isLoading, isError } = useGetDepartmentsQuery(queryParams);
  const [createDepartment, { isLoading: isCreating }] = useCreateDepartmentMutation();
  const [updateDepartment, { isLoading: isUpdating }] = useUpdateDepartmentMutation();
  const [deleteDepartment, { isLoading: isDeleting }] = useDeleteDepartmentMutation();

  useEffect(() => {
    if (data) {
      dispatch(setDepartments(data));
    }
    if (isError) {
      dispatch(setError("Failed to fetch departments"));
      toast.error("Không thể tải danh sách phòng ban");
    }
  }, [data, isError, dispatch]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const ids = selectedRowKeys.map((key) => parseInt(key));
      const promises = ids.map((id) => deleteDepartment(id).unwrap());
      const results = await Promise.allSettled(promises);

      const errors = results
        .map((result, index) => {
          if (result.status === "rejected") {
            return `Không thể xóa phòng ban ID ${ids[index]}: ${result.reason.error || "Lỗi không xác định"}`;
          }
          return null;
        })
        .filter((error) => error !== null);

      if (errors.length > 0) {
        toast.error(
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            <p>Có lỗi khi xóa phòng ban:</p>
            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
              {errors.join("\n")}
            </pre>
          </div>,
          { autoClose: 5000 }
        );
      } else {
        dispatch(deleteDepartments(ids));
        toast.success("Đã xóa phòng ban thành công");
      }
    } catch (err) {
      toast.error("Không thể xóa phòng ban");
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

      const requiredFields = ["name", "code", "manager_id", "note"];
      const headerRow = (json[0] as string[]) || [];
      const newDepartments: Department[] = [];
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
        const newDepartment: Partial<Department> = {};
        let rowHasError = false;

        for (let j = 0; j < headerRow.length; j++) {
          const key = headerRow[j] as keyof Department;
          const value = row[j];
          if (!value && key === "name") {
            errors.push(`Lỗi tại hàng ${i + 1}, cột "name": Dữ liệu bị trống.`);
            rowHasError = true;
          }
          if (key === "manager_id") {
            newDepartment[key] = value ? parseInt(value) : null;
          } else {
            newDepartment[key] = value ?? null;
          }
        }

        if (rowHasError) continue;

        newDepartment.id = Date.now() + i; // Temporary ID for local state
        newDepartments.push(newDepartment as Department);
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
        newDepartments.forEach(async (dept) => {
          try {
            const response = await createDepartment({
              name: dept.name,
              code: dept.code,
              manager_id: dept.manager_id,
              note: dept.note,
            }).unwrap();
            dispatch(addDepartment(response.data!));
            toast.success(`Đã thêm phòng ban ${dept.name} thành công`);
          } catch (err) {
            toast.error(`Không thể import phòng ban: ${dept.name}`);
          }
        });
        toast.success(`${newDepartments.length} phòng ban đã được import thành công.`);
        setImportOpen(false);
        setImporting(false);
      }
    };

    reader.readAsBinaryString(file);
    return false;
  };

  const handleSave = async (values: Department) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (selectedDepartment) {
        console.log("Update payload:", {
          id: selectedDepartment.id,
          data: {
            name: values.name,
            code: values.code,
            manager_id: values.manager_id,
            note: values.note,
          },
        });
        const response = await updateDepartment({
          id: selectedDepartment.id,
          data: {
            name: values.name,
            code: values.code,
            manager_id: values.manager_id,
            note: values.note,
          },
        }).unwrap();
        dispatch(updateDepartment(response.data!));
        toast.success("Cập nhật phòng ban thành công");
      } else {
        const response = await createDepartment({
          name: values.name,
          code: values.code,
          manager_id: values.manager_id,
          note: values.note,
        }).unwrap();
        dispatch(addDepartment(response.data!));
        toast.success("Thêm phòng ban thành công");
      }
      setIsModalOpen(false);
      setSelectedDepartment(null);
    } catch (err: any) {
      console.error("Update/Create error:", err);
      toast.error(`Không thể ${selectedDepartment ? "cập nhật" : "thêm"} phòng ban: ${err.data?.error || "Lỗi không xác định"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (record: Department) => {
    console.log("Selected department for edit:", record); // Debug selected department
    setSelectedDepartment(record);
    setIsModalOpen(true);
  };

  const handleSearch = (value: string) => {
    setQueryParams({ ...queryParams, q: value, page: 1 });
  };

  const handleFilterByHead = (manager_name: string) => {
    const filtered = departments.filter((item) => item.manager_name === manager_name);
    dispatch(setDepartments({ data: filtered, meta: { page: 1, limit: filtered.length, total: filtered.length, pages: 1 } }));
    toast.info(`Đang hiển thị phòng ban với trưởng phòng: ${manager_name}`);
  };

  const handleFilterByDepartmentName = (name: string) => {
    const filtered = departments.filter((item) => item.name === name);
    dispatch(setDepartments({ data: filtered, meta: { page: 1, limit: filtered.length, total: filtered.length, pages: 1 } }));
    toast.info(`Đang hiển thị phòng ban: ${name}`);
  };

  const headOptions = [...new Set(departments.map((item) => item.manager_name).filter((name): name is string => name !== null))];
  const departmentNameOptions = [...new Set(departments.map((item) => item.name))];

  return (
    <>
      <div className="department-list-header">
        <h2>Danh sách phòng ban</h2>
        <div className="department-list-actions">
          <Search
            className="department-search-bar"
            placeholder="Tìm kiếm theo tên phòng ban"
            allowClear
            onSearch={handleSearch}
            name="search"
          />
          <Select
            placeholder="Lọc theo tên phòng ban"
            style={{ width: 250 }}
            onChange={handleFilterByDepartmentName}
            options={departmentNameOptions.map((name) => ({
              value: name,
              label: name,
            }))}
            allowClear
          />
          <Select
            placeholder="Lọc theo trưởng phòng"
            style={{ width: 250 }}
            onChange={handleFilterByHead}
            options={headOptions.map((head) => ({
              value: head,
              label: head,
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
            <p>Bạn có chắc muốn xóa phòng ban này? Hành động này không thể hoàn tác.</p>
          </Modal>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedDepartment(null);
              setIsModalOpen(true);
            }}
          >
            Tạo
          </Button>
        </div>
      </div>

      <TableDepartment
        data={departments}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        onEdit={handleEdit}
        loading={isLoading || isCreating || isUpdating || isDeleting}
      />

      {meta && departments.length > 0 && (
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

      <DepartmentForm
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedDepartment(null);
        }}
        onSave={handleSave}
        department={selectedDepartment}
        modalTitle={selectedDepartment ? "Cập nhật phòng ban" : "Thêm phòng ban"}
        cancelText="Hủy"
        saveText="Lưu"
        loading={isSubmitting || isCreating || isUpdating}
      />
    </>
  );
};

export default DepartmentList;