import { DebtReport } from "./DebtReportList";

export const normalizeDebtReport = (report: DebtReport): DebtReport => {
  const invoice = report.invoice;
  const payments = report.payments || [];

  // 👉 Tổng giá trị hóa đơn (đã VAT)
  const totalInvoice = invoice?.totalAmount ?? 0;

  // 👉 Tổng thanh toán
  const totalPayments = payments.reduce((sum, pay) => sum + (pay.amount ?? 0), 0);

  // 👉 Công nợ còn lại
  const remaining = totalInvoice - totalPayments;

  // 👉 Xác định trạng thái công nợ
  let debtStatus: DebtReport["debtStatus"] = "Chưa thanh toán";
  if (report.badDebt && report.badDebt > 0) {
    debtStatus = "Khó đòi";
  } else if (remaining <= 0 && totalInvoice > 0) {
    debtStatus = "Đã thanh toán";
  } else if (remaining > 0 && totalPayments > 0) {
    debtStatus = "Thanh toán một phần";
  }

  return {
    ...report,
    totalDebt: totalInvoice,
    remainingDebt: remaining,
    totalDebtRemaining: remaining,
    debtWithVAT: totalInvoice,
    debtNoVAT: invoice?.amountNoVAT ?? 0,
    debtStatus,
  };
};
