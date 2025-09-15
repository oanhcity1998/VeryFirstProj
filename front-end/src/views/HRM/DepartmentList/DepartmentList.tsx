import { useState, useEffect } from "react";
import { Button, Modal, Upload, Select, Pagination, Empty, Spin } from "antd";
import { PlusOutlined, InboxOutlined, DeleteOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import "./DepartmentList.css";
import Search from "antd/es/input/Search";
import TableDepartment from "@/components/HRM/TableDepartment/TableDepartment";
import DepartmentForm from "@/components/HRM/DepartmentForm/DepartmentForm";
import {
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} from "@/services/HRM/department.service";
import { Department } from "@/models/HRM/department.model";

const { Dragger } = Upload;

const DepartmentList: React.FC = () => {
  const [queryParams, setQueryParams] = useState({
    q: "",
    page: 1,
    limit: 5,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [importOpen, setImportOpen] = useState<boolean>(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [departments, setDepartments] = useState<Department[] | null>(null); // Add state for departments
  const [meta, setMeta] = useState<{ page: number; limit: number; total: number; pages: number } | null>(null);

  const { data, isLoading, isError, refetch } = useGetDepartmentsQuery(queryParams);
  const [createDepartment, { isLoading: isCreating }] = useCreateDepartmentMutation();
  const [updateDepartment, { isLoading: isUpdating }] = useUpdateDepartmentMutation();
  const [deleteDepartment, { isLoading: isDeleting }] = useDeleteDepartmentMutation();

  // Handle data fetching and state updates
  useEffect(() => {
    if (data) {
      const cleanList = Array.isArray(data.data)
        ? data.data.filter((item) => item && item.id !== undefined && item.id !== null)
        : [];
      setDepartments(cleanList);
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

  // Reset meta but not departments when queryParams change
  useEffect(() => {
    setMeta(null);
  }, [queryParams]);

  // Error handling
  useEffect(() => {
    if (isError) {
      toast.error("Không thể tải danh sách phòng ban");
    }
  }, [isError]);

  const handleDelete = async () => {
    try {
      const ids = selectedRowKeys.map((key) => parseInt(key));
      await Promise.all(ids.map((id) => deleteDepartment(id).unwrap()));
      toast.success("Đã xóa phòng ban thành công");
      setSelectedRowKeys([]);
      setDeleteOpen(false);
      refetch();
    } catch (err) {
      toast.error("Không thể xóa phòng ban");
    }
  };

  const handleSave = async (values: Department) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (selectedDepartment) {
        await updateDepartment({
          id: selectedDepartment.id,
          data: {
            name: values.name,
            code: values.code,
            manager_id: values.manager_id,
            note: values.note,
          },
        }).unwrap();
        toast.success("Cập nhật phòng ban thành công");
      } else {
        await createDepartment({
          name: values.name,
          code: values.code,
          manager_id: values.manager_id,
          note: values.note,
        }).unwrap();
        toast.success("Thêm phòng ban thành công");
      }
      refetch();
      setIsModalOpen(false);
      setSelectedDepartment(null);
    } catch (err: any) {
      toast.error(`Không thể ${selectedDepartment ? "cập nhật" : "thêm"} phòng ban`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (record: Department) => {
    setSelectedDepartment(record);
    setIsModalOpen(true);
  };

  const handleSearch = (value: string) => {
    setQueryParams({ ...queryParams, q: value, page: 1 });
  };

  const showLoading = isLoading || departments === null;

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
          />
          <Select
            placeholder="Lọc theo tên phòng ban"
            style={{ width: 250 }}
            onChange={(name) => setQueryParams({ ...queryParams, q: name, page: 1 })}
            options={(departments || []).map((item) => ({ value: item.name, label: item.name }))}
            allowClear
          />
          <Select
            placeholder="Lọc theo trưởng phòng"
            style={{ width: 250 }}
            onChange={(head) => setQueryParams({ ...queryParams, q: head, page: 1 })}
            options={(departments || [])
              .filter((item) => item.manager_name)
              .map((item) => ({ value: item.manager_name, label: item.manager_name }))}
            allowClear
          />
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

      {showLoading ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" />
        </div>
      ) : departments && departments.length > 0 ? (
        <>
          <TableDepartment
            data={departments}
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
          <Empty description="Không có phòng ban nào để hiển thị" />
          <p>Hiện tại không có dữ liệu phòng ban. Vui lòng thêm phòng ban mới!</p>
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