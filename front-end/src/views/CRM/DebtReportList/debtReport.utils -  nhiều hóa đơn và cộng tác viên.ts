// import { DebtReport } from "./DebtReportList";

// export const normalizeDebtReport = (report: DebtReport): DebtReport => {
//   const invoices = report.invoices || [];
//   const payments = report.payments || [];

//   // 👉 Tổng giá trị hóa đơn (đã VAT)
//   const totalInvoices = invoices.reduce((sum, inv) => sum + (inv.totalAmount ?? 0), 0);

//   // 👉 Tổng thanh toán
//   const totalPayments = payments.reduce((sum, pay) => sum + (pay.amount ?? 0), 0);

//   // 👉 Công nợ còn lại
//   const remaining = totalInvoices - totalPayments;

//   // 👉 Xác định trạng thái công nợ
//   let debtStatus: DebtReport["debtStatus"] = "Chưa thanh toán";
//   if (remaining <= 0 && totalInvoices > 0) {
//     debtStatus = "Đã thanh toán";
//   } else if (remaining > 0 && totalPayments > 0) {
//     debtStatus = "Thanh toán một phần";
//   }
//   if (report.badDebt && report.badDebt > 0) {
//     debtStatus = "Khó đòi";
//   }

//   return {
//     ...report,
//     totalDebt: totalInvoices,
//     remainingDebt: remaining,
//     totalDebtRemaining: remaining,
//     debtWithVAT: totalInvoices,
//     debtNoVAT: invoices.reduce((s, inv) => s + (inv.amountNoVAT ?? 0), 0),
//     debtStatus,
//   };
// };
