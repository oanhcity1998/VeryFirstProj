import { useState } from "react";
import { Button, Space, Modal, message, Upload, Select } from "antd";
import { PlusOutlined, DeleteFilled, InboxOutlined, DeleteOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import "./DepartmentList.css";
import Search from "antd/es/input/Search";
import TableDepartment from "../../../components/TableDepartment/TableDepartment";
import DepartmentForm from "../../../components/DepartmentForm/DepartmentForm";

interface Department {
    key: string;
    id: string;
    departmentName: string;
    head: string;
    note?: string;
}

const DepartmentList: React.FC = () => {
    const [data, setData] = useState<Department[]>([
        {
            key: "DP001",
            id: "DP001",
            departmentName: "Phòng Nhân sự",
            head: "Nguyễn Văn A",
            note: "Quản lý tuyển dụng và đào tạo",
        },
        {
            key: "DP002",
            id: "DP002",
            departmentName: "Phòng Kế toán",
            head: "Trần Thị B",
            note: "Quản lý tài chính doanh nghiệp",
        },
        {
            key: "DP003",
            id: "DP003",
            departmentName: "Phòng Kỹ thuật",
            head: "Lê Văn C",
            note: "Phát triển sản phẩm công nghệ",
        },
        {
            key: "DP004",
            id: "DP004",
            departmentName: "Phòng Marketing",
            head: "Phạm Thị D",
            note: "Quản lý chiến dịch quảng cáo",
        },
        {
            key: "DP005",
            id: "DP005",
            departmentName: "Phòng Kinh doanh",
            head: "Hoàng Văn E",
            note: "Phát triển thị trường",
        },
        {
            key: "DP006",
            id: "DP006",
            departmentName: "Phòng Hành chính",
            head: "Nguyễn Thị F",
            note: "Quản lý văn phòng",
        },
        {
            key: "DP007",
            id: "DP007",
            departmentName: "Phòng Pháp chế",
            head: "Trần Văn G",
            note: "Xử lý các vấn đề pháp lý",
        },
        {
            key: "DP008",
            id: "DP008",
            departmentName: "Phòng IT",
            head: "Lê Thị H",
            note: "Hỗ trợ kỹ thuật CNTT",
        },
        {
            key: "DP009",
            id: "DP009",
            departmentName: "Phòng Sản xuất",
            head: "Phạm Văn I",
            note: "Quản lý dây chuyền sản xuất",
        },
        {
            key: "DP010",
            id: "DP010",
            departmentName: "Phòng Chăm sóc khách hàng",
            head: "Hoàng Thị K",
            note: "Hỗ trợ khách hàng",
        },
    ]);

    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [importOpen, setImportOpen] = useState<boolean>(false);
    const [importing, setImporting] = useState<boolean>(false);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
    const [filteredData, setFilteredData] = useState<Department[]>(data);

    const handleDelete = async () => {
        try {
            setDeleting(true);
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const newData = data.filter((item) => !selectedRowKeys.includes(item.key));
            setData(newData);
            setFilteredData(newData);
            message.success("Đã xóa phòng ban");
        } catch (err) {
            message.error("Không thể xóa phòng ban");
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

            const requiredFields = ["id", "departmentName", "head", "note"];
            const headerRow = json[0] as string[] || [];
            const newDepartments: Department[] = [];
            const errors: string[] = [];

            const missingHeaders = requiredFields.filter(
                (field) => !headerRow.includes(field)
            );
            if (missingHeaders.length > 0) {
                message.error(`File thiếu các cột bắt buộc: ${missingHeaders.join(", ")}`);
                setImporting(false);
                setImportOpen(false);
                return;
            }

            for (let i = 1; i < json.length; i++) {
                const row = json[i] as any[];
                const newDepartment: Partial<Department> = {};
                let rowHasError = false;

                for (let j = 0; j < headerRow.length; j++) {
                    const key = headerRow[j];
                    const value = row[j];
                    if (!value && requiredFields.includes(key)) {
                        errors.push(`Lỗi tại hàng ${i + 1}, cột "${key}": Dữ liệu bị trống.`);
                        rowHasError = true;
                    }
                    newDepartment[key] = value;
                }

                if (rowHasError) {
                    continue;
                }

                newDepartment.key = `DP-imported-${Date.now()}-${i}`;
                newDepartments.push(newDepartment as Department);
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
                setData((prevData) => [...prevData, ...newDepartments]);
                setFilteredData((prevData) => [...prevData, ...newDepartments]);
                const timestamp = dayjs().format("HH:mm:ss DD/MM/YYYY");
                const currentUser = "admin";
                console.log(
                    `[Import Log] Tải lên thành công ${newDepartments.length} phòng ban lúc ${timestamp} bởi ${currentUser}`
                );
                message.success(
                    `${newDepartments.length} phòng ban đã được import thành công.`
                );
                setImportOpen(false);
                setImporting(false);
            }
        };

        reader.readAsBinaryString(file);
        return false;
    };

    const handleSave = (values: Department) => {
        if (selectedDepartment) {
            const updatedData = data.map((item) =>
                item.key === selectedDepartment.key ? { ...item, ...values } : item
            );
            setData(updatedData);
            setFilteredData(updatedData);
            message.success("Cập nhật phòng ban thành công");
        } else {
            const newDepartment: Department = {
                key: `DP${Date.now()}`,
                id: values.id,
                departmentName: values.departmentName,
                head: values.head,
                note: values.note,
            };
            setData([...data, newDepartment]);
            setFilteredData([...filteredData, newDepartment]);
            message.success("Thêm phòng ban thành công");
        }
    };

    const handleEdit = (record: Department) => {
        setSelectedDepartment(record);
        setIsModalOpen(true);
    };

    const handleFilterByHead = (head: string) => {
        const filtered = data.filter((item) => item.head === head);
        setFilteredData(filtered);
        message.info(`Đang hiển thị phòng ban với trưởng phòng: ${head}`);
    };

    const handleFilterByDepartmentName = (departmentName: string) => {
        const filtered = data.filter((item) => item.departmentName === departmentName);
        setFilteredData(filtered);
        message.info(`Đang hiển thị phòng ban: ${departmentName}`);
    };

    const headOptions = [...new Set(data.map((item) => item.head))];
    const departmentNameOptions = [...new Set(data.map((item) => item.departmentName))];

    return (
        <>
            <div className="department-list-header">
                <h2>Danh sách phòng ban</h2>
                <div className="department-list-actions">
                    <Search
                        className="department-search-bar"
                        placeholder="Tìm kiếm theo tên phòng ban"
                        allowClear
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
                    />
                    <Select
                        placeholder="Lọc theo trưởng phòng"
                        style={{ width: 250 }}
                        onChange={handleFilterByHead}
                        options={headOptions.map((head) => ({
                            value: head,
                            label: head,
                        }))}
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
                            <p className="ant-upload-text">
                                Click hoặc kéo thả file vào đây để Import
                            </p>
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
                        <p>
                            Bạn có chắc muốn xóa phòng ban này? Hành động này không thể hoàn tác.
                        </p>
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
                data={filteredData}
                selectedRowKeys={selectedRowKeys}
                setSelectedRowKeys={setSelectedRowKeys}
                onEdit={handleEdit}
            />

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
            />
        </>
    );
};

export default DepartmentList;