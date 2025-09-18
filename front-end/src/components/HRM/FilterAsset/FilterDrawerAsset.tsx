import { Drawer, Form, Button, Select, InputNumber } from "antd";

const { Option } = Select;

interface FilterDrawerAssetProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (values: any) => void;
  typeOptions: string[];
  statusOptions: string[];
  idOptions: string[];
  ownerOptions: string[];
}

const FilterDrawerAsset: React.FC<FilterDrawerAssetProps> = ({
  open,
  onClose,
  onConfirm,
  typeOptions,
  statusOptions,
  idOptions,
  ownerOptions,
}) => {
  const [form] = Form.useForm();

  const handleConfirm = () => {
    form
      .validateFields()
      .then((values) => {
        onConfirm(values);
        onClose();
      })
      .catch((error) => {
        console.log("Validation failed:", error);
      });
  };

  return (
    <Drawer
      title="Thông tin tài sản"
      placement="right"
      open={open}
      onClose={onClose}
      className="width-350"
      footer={
        <div className="filter-footer">
          <Button danger onClick={onClose}>
            Huỷ
          </Button>
          <Button type="primary" onClick={handleConfirm}>
            Lọc
          </Button>
        </div>
      }
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Mã tài sản"
          name="id"
          rules={[{ required: true, message: "Vui lòng chọn mã tài sản!" }]}
        >
          <Select placeholder="Chọn mã tài sản" allowClear>
            {idOptions.map((id) => (
              <Option key={id} value={id}>
                {id}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Tình trạng"
          name="status"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
        >
          <Select placeholder="Chọn trạng thái" allowClear>
            {statusOptions.map((s) => (
              <Option key={s} value={s}>
                {s}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Nhân viên sở hữu" name="owner">
          <Select placeholder="Chọn nhân viên" allowClear>
            {ownerOptions.map((owner) => (
              <Option key={owner} value={owner}>
                {owner}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Giá trị ban đầu">
          <div className="range-inputs">
            <Form.Item
              name={["valueRange", "from"]}
              noStyle
              rules={[{ type: "number", min: 0, message: "Giá trị phải lớn hơn hoặc bằng 0!" }]}
            >
              <InputNumber
                placeholder="Từ"
                className="full-width"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
            <Form.Item
              name={["valueRange", "to"]}
              noStyle
              rules={[{ type: "number", min: 0, message: "Giá trị phải lớn hơn hoặc bằng 0!" }]}
            >
              <InputNumber
                placeholder="Đến"
                className="full-width"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
          </div>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default FilterDrawerAsset;
