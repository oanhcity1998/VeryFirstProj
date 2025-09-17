import { Drawer, Form, Select, DatePicker, Button, Input } from "antd";
import dayjs from "dayjs";
import { customerOptions } from "../DebtReportForm/DebtReportForm";

interface FilterDebtReportDrawerProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (values: React.MouseEvent<HTMLButtonElement>) => void;

  // filter states
  filterStatus: string | null;
  setFilterStatus: (v: string | null) => void;

  filterDate: [string, string] | null;
  setFilterDate: (v: [string, string] | null) => void;

  filterContract: string | null;
  setFilterContract: (v: string | null) => void;

  filterCustomer: string | null;
  setFilterCustomer: (v: string | null) => void;

  filterDebtStatus: string | null;
  setFilterDebtStatus: (v: string | null) => void;
}

const { RangePicker } = DatePicker;

export const FilterDebtReportDrawer = ({
  open,
  onClose,
  onConfirm,
  filterStatus,
  setFilterStatus,
  filterDate,
  setFilterDate,
  filterContract,
  setFilterContract,
  filterCustomer,
  setFilterCustomer,
  filterDebtStatus,
  setFilterDebtStatus,
}: FilterDebtReportDrawerProps) => {
  return (
    <Drawer
      title="Bộ lọc báo cáo công nợ"
      placement="right"
      onClose={onClose}
      open={open}
      width={320}
    >
      <Form layout="vertical">
        {/* Ngày báo cáo */}
        {/* <Form.Item label="Ngày báo cáo">
          <RangePicker
            style={{ width: "100%" }}
            format="YYYY-MM-DD"
            value={filterDate ? [dayjs(filterDate[0]), dayjs(filterDate[1])] : undefined}
            onChange={(dates) =>
              setFilterDate(
                dates ? [dates[0]!.format("YYYY-MM-DD"), dates[1]!.format("YYYY-MM-DD")] : null
              )
            }
          />
        </Form.Item> */}

        {/* Hợp đồng */}
        <Form.Item label="Hợp đồng">
          <Input
            placeholder="Nhập số hợp đồng"
            value={filterContract ?? ""}
            onChange={(e) => setFilterContract(e.target.value || null)}
          />
        </Form.Item>

        {/* Khách hàng */}
        <Form.Item label="Khách hàng">
          <Select
            allowClear
            placeholder="Chọn khách hàng"
            onChange={(e) => setFilterCustomer(e || null)}
            value={filterCustomer || ""}
          >
            {customerOptions.map((c) => (
              <Select.Option key={c.id} value={c.name}>
                {c.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Trạng thái công nợ */}
        <Form.Item label="Trạng thái công nợ">
          <Select
            allowClear
            value={filterDebtStatus ?? undefined}
            onChange={(val) => setFilterDebtStatus(val || null)}
          >
            <Select.Option value="Chưa thanh toán">Chưa thanh toán</Select.Option>
            <Select.Option value="Thanh toán một phần">Thanh toán một phần</Select.Option>
            <Select.Option value="Đã thanh toán">Đã thanh toán</Select.Option>
            <Select.Option value="Khó đòi">Khó đòi</Select.Option>
          </Select>
        </Form.Item>

        {/* Trạng thái báo cáo */}
        <Form.Item label="Trạng thái báo cáo">
          <Select
            allowClear
            value={filterStatus ?? undefined}
            onChange={(val) => setFilterStatus(val || null)}
          >
            <Select.Option value="Khởi tạo">Khởi tạo</Select.Option>
            <Select.Option value="Chờ kế toán">Chờ kế toán</Select.Option>
            <Select.Option value="Xác nhận">Xác nhận</Select.Option>
            <Select.Option value="Hủy">Hủy</Select.Option>
          </Select>
        </Form.Item>

        <Button type="primary" onClick={onConfirm} block>
          Lọc
        </Button>
      </Form>
    </Drawer>
  );
};

export default FilterDebtReportDrawer;
