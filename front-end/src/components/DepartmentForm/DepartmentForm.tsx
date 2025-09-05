import { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import "./DepartmentForm.css";

interface Department {
    id?: string;
    departmentName?: string;
    head?: string;
    note?: string;
}

interface DepartmentFormProps {
    onCancel: () => void;
    onSave: (values: Department) => void;
    department?: Department | null;
    open: boolean;
    modalTitle?: string;
    cancelText?: string;
    saveText?: string;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({
    onCancel,
    onSave,
    department,
    open,
    modalTitle = "Thêm mới",
    cancelText = "Hủy",
    saveText = "Lưu",
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (department) {
            form.setFieldsValue({
                ...department,
            });
        } else {
            form.resetFields();
        }
    }, [department, form]);

    const onFinish = (values: any) => {
        onSave({
            ...values,
        });
        onCancel();
    };

    return (
        <Modal
            title={modalTitle}
            open={open}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" danger onClick={onCancel}>
                    {cancelText}
                </Button>,
                <Button key="submit" type="primary" onClick={() => form.submit()}>
                    {saveText}
                </Button>,
            ]}
            width={800}
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <div className="form-section">
                    <h3>Thông tin phòng ban</h3>

                    <Form.Item
                        label="Mã phòng ban"
                        name="id"
                        rules={[{ required: true, message: "Vui lòng nhập mã phòng ban!" }]}
                    >
                        <Input placeholder="Nhập mã phòng ban (VD: DP001)" />
                    </Form.Item>

                    <Form.Item
                        label="Tên phòng ban"
                        name="departmentName"
                        rules={[{ required: true, message: "Vui lòng nhập tên phòng ban!" }]}
                    >
                        <Input placeholder="Nhập tên phòng ban" />
                    </Form.Item>

                    <Form.Item
                        label="Trưởng phòng"
                        name="head"
                        rules={[{ required: true, message: "Vui lòng nhập tên trưởng phòng!" }]}
                    >
                        <Input placeholder="Nhập tên trưởng phòng" />
                    </Form.Item>

                    <Form.Item label="Ghi chú" name="note">
                        <Input.TextArea
                            placeholder="Nhập ghi chú"
                            autoSize={{ minRows: 3, maxRows: 5 }}
                        />
                    </Form.Item>
                </div>
            </Form>
        </Modal>
    );
};

export default DepartmentForm;
