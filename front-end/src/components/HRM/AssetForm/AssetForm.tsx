import { useEffect } from "react";
import { Modal, Form, Input, Button, Select, DatePicker, InputNumber, Upload, Card } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

interface Asset {
  key?: string;
  id?: string;
  name?: string;
  description?: string;
  purchaseDate?: string;
  value?: number;
  status?: string;
  owner?: string;
  department?: string;
  position?: string;
  warranty?: string;
  image?: string;
}

interface AssetFormProps {
  onCancel: () => void;
  onSave: (values: Asset) => void;
  asset?: Asset | null;
  open: boolean;
  modalTitle?: string;
  cancelText?: string;
  saveText?: string;
}

const AssetForm: React.FC<AssetFormProps> = ({
  onCancel,
  onSave,
  asset,
  open,
  modalTitle = "Thêm mới",
  cancelText = "Hủy",
  saveText = "Xác nhận",
}) => {
  const [form] = Form.useForm();

  // ✅ Prefill khi mở modal (edit asset)
  useEffect(() => {
    if (asset) {
      form.setFieldsValue({
        ...asset,
        purchaseDate: asset.purchaseDate ? dayjs(asset.purchaseDate, "DD/MM/YYYY") : null,
        warranty: asset.warranty ? dayjs(asset.warranty, "DD/MM/YYYY") : null,
      });
    } else {
      form.resetFields();
    }
  }, [asset, form, open]);

  const onFinish = (values: any) => {
    const formattedValues = {
      ...values,
      purchaseDate: values.purchaseDate ? values.purchaseDate.format("DD/MM/YYYY") : undefined,
      warranty: values.warranty ? values.warranty.format("DD/MM/YYYY") : undefined,
    };
    onSave(formattedValues);
    onCancel();
  };

  return (
    <Modal
      title={null}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={900}
      centered
    >
      <h2 style={{ fontWeight: 600, marginBottom: 16 }}>{modalTitle}</h2>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Card title="Thông tin tài sản" className="card-section">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Cột trái */}
            <div>
              <Form.Item
                label="Mã tài sản"
                name="id"
                rules={[{ required: true, message: "Vui lòng nhập mã tài sản!" }]}
              >
                <Input placeholder="Nhập mã tài sản" />
              </Form.Item>

              <Form.Item
                label="Loại sản phẩm"
                name="type"
                rules={[{ required: true, message: "Vui lòng nhập loại sản phẩm!" }]}
              >
                <Input placeholder="Nhập loại sản phẩm" />
              </Form.Item>

              <Form.Item
                label="Ngày mua"
                name="purchaseDate"
                rules={[{ required: true, message: "Vui lòng chọn ngày mua!" }]}
              >
                <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} placeholder="Chọn ngày" />
              </Form.Item>

              <Form.Item
                label="Phòng ban sở hữu"
                name="department"
                rules={[{ required: true, message: "Vui lòng nhập phòng ban!" }]}
              >
                <Input placeholder="Nhập phòng ban sở hữu" />
              </Form.Item>

              <Form.Item
                label="Vị trí"
                name="position"
                rules={[{ required: true, message: "Vui lòng nhập vị trí!" }]}
              >
                <Input placeholder="Nhập vị trí" />
              </Form.Item>

              <Form.Item
                label="Hạn bảo hành"
                name="warranty"
                rules={[{ required: true, message: "Vui lòng chọn hạn bảo hành!" }]}
              >
                <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} placeholder="Chọn ngày" />
              </Form.Item>
            </div>

            {/* Cột phải */}
            <div>
              <Form.Item
                label="Tên tài sản"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên tài sản!" }]}
              >
                <Input placeholder="Nhập tên tài sản" />
              </Form.Item>

              <Form.Item
                label="Mô tả"
                name="description"
                rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
              >
                <Input.TextArea placeholder="Nhập mô tả" rows={2} />
              </Form.Item>

              <Form.Item
                label="Giá trị ban đầu"
                name="value"
                rules={[{ required: true, message: "Vui lòng nhập giá trị!" }]}
              >
                <InputNumber<number>
                  style={{ width: "100%" }}
                  min={0}
                  placeholder="Nhập giá trị"
                  formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(val) => (val ? parseFloat(val.replace(/,/g, "")) : 0)}
                />
              </Form.Item>

              <Form.Item
                label="Nhân viên sở hữu"
                name="owner"
                rules={[{ required: true, message: "Vui lòng chọn nhân viên!" }]}
              >
                <Select placeholder="Chọn nhân viên">
                  <Select.Option value="Nguyễn Nhật Huy">Nguyễn Nhật Huy</Select.Option>
                  <Select.Option value="Hoàng Nhật Quang">Hoàng Nhật Quang</Select.Option>
                  <Select.Option value="Nguyễn Tâm Minh">Nguyễn Tâm Minh</Select.Option>
                  <Select.Option value="Trần Nguyễn Minh Khôi">Trần Nguyễn Minh Khôi</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Trạng thái"
                name="status"
                rules={[{ required: true, message: "Vui lòng chọn tình trạng!" }]}
              >
                <Select placeholder="Chọn tình trạng">
                  <Select.Option value="Mới">Mới</Select.Option>
                  <Select.Option value="Cũ">Cũ</Select.Option>
                  <Select.Option value="Bảo trì">Bảo trì</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Ảnh sản phẩm"
                name="image"
                rules={[{ required: true, message: "Vui lòng upload ảnh!" }]}
              >
                <Upload.Dragger name="files" beforeUpload={() => false}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click hoặc kéo thả ảnh để upload</p>
                </Upload.Dragger>
              </Form.Item>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 24 }}>
          <Button danger onClick={onCancel}>
            {cancelText}
          </Button>
          <Button type="primary" htmlType="submit">
            {saveText}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AssetForm;
