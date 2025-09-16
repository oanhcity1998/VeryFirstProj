import React, { useRef } from "react";
import html2pdf from "html2pdf.js";
import "./QuotePDF.css";

type QuotePDFProps = {
  companyName: string;
  auditYear: number;
  serviceFee: number;
};

const QuoteDocument = React.forwardRef<HTMLDivElement, QuotePDFProps>(
  ({ companyName, auditYear, serviceFee }, ref) => (
    <div ref={ref} className="quote-content">
      {/* Header */}
      <div className="header">
        <div className="logo">KHANG VIET</div>
        <div className="company-info">
          <strong>CÔNG TY TNHH KIỂM TOÁN & ĐỊNH GIÁ KHANG VIỆT</strong>
          <p>Tầng 03 Tòa nhà Indochina, Số 04 Nguyễn Đình Chiểu, P.Đa Kao, Quận 1, Tp.HCM</p>
          <p>VPĐD: 21 Đường số 2, KDC Jamona City, Phường Phú Thuận, Quận 7, Tp.HCM</p>
          <p>Web: kvac.com.vn | Email: kiemtoankhangviet@gmail.com</p>
          <p>Điện thoại: 028 2291 8361 | Hotline: 0937 79 36 79</p>
        </div>
      </div>

      {/* Ref + Date */}
      <div className="ref-date">
        <div>
          <p><em>Số:</em> 0911-05/2024/BGKiT</p>
          <p><em>No:</em> 0911-05/2024/BGKiT</p>
        </div>
        <div>
          <p>Thành phố Hồ Chí Minh, ngày 11 tháng 09 năm {auditYear}</p>
          <p>Ho Chi Minh City, September 11<sup>th</sup>, {auditYear}</p>
        </div>
      </div>

      {/* Title */}
      <div className="title">
        <h2>THƯ BÁO GIÁ DỊCH VỤ KIỂM TOÁN</h2>
        <h3>AUDITING QUOTATION LETTER</h3>
      </div>

      {/* Recipient */}
      <p><strong><em>Kính gửi:</em></strong> Ban Giám Đốc {companyName}</p>
      <p><strong><em>To:</em></strong> Board of Directors of {companyName}</p>
      <p><strong><em>Về việc:</em></strong> Kiểm toán Báo cáo tài chính năm {auditYear} của {companyName}</p>
      <p><strong><em>Subject:</em></strong> Auditing financial statements for year {auditYear} of {companyName}</p>

      {/* Body */}
      <p><strong>Thưa Quý Công ty/ Dear,</strong></p>
      <p>
        Công Ty TNHH Kiểm Toán & Định Giá Khang Việt (KVAC) xin gửi tới Quý Công ty chào trân trọng
        và lời cảm ơn về sự tin nhiệm của Quý Công Ty đối với những dịch vụ chuyên ngành của chúng tôi
        trong thời gian qua.
      </p>
      <p>
        Khang Viet Auditing & Valuation Co., Ltd (KVAC) would like to send our greetings and appreciation
        to the Company’s trust in our specialized services over the past time.
      </p>
      <p>
        Chúng tôi hân hạnh được gửi tới Quý vị thư báo giá về dịch vụ Kiểm toán Báo cáo tài chính năm {auditYear}.
      </p>
      <p>
        We would like to send you the quotation of Auditing Financial Statements in {auditYear} for the Company.
      </p>

      <h4>1. Các dịch vụ và công việc Quý Công ty yêu cầu công ty chúng tôi thực hiện</h4>
      <h5>Services and Tasks required by the Company</h5>
      <p>- Kiểm toán Báo cáo tài chính năm {auditYear}.</p>
      <p>- Auditing Financial Statements in {auditYear}.</p>

      <h4>2. Nội dung công việc công ty chúng tôi sẽ thực hiện</h4>
      <h5>Services and Tasks performed by our Company</h5>
      <p>
        Công ty chúng tôi đồng ý cung cấp cho Quý Công ty dịch vụ Kiểm toán Báo cáo tài chính năm {auditYear}
        bao gồm: Bảng cân đối kế toán tại ngày 31 tháng 12, Báo cáo kết quả hoạt động kinh doanh, Báo cáo
        thay đổi vốn chủ sở hữu (nếu có), Báo cáo lưu chuyển tiền tệ và Bản thuyết minh báo cáo tài chính.
      </p>
      <p>
        We agree to provide you with the financial statement auditing service in {auditYear}, including the
        Balance Sheet, the Income Statement, the Owner Capital Change report (if any), the Statement of Cash Flows,
        and the Notes to the Financial Statements.
      </p>

      <h4>3. Phí dịch vụ và phương thức thanh toán</h4>
      <h5>Service fee and payment method</h5>
      <p>
        Dựa vào kinh nghiệm kiểm toán đối với các khách hàng tương tự và sự hiểu biết của chúng tôi về tính chất
        và phạm vi công việc, phí dịch vụ của chúng tôi được ước tính dựa trên thời gian cần thiết thực hiện dịch vụ
        và nhân sự thực hiện dịch vụ cũng như cấp bậc năng lực, kinh nghiệm và kỹ năng hoàn thành công việc.
      </p>
      <p>
        Based on our audit experience with similar clients and our understanding of the nature and scope of our work,
        our service charges are estimated based on the time required to perform the service and the personnel performing
        the service as well as the level of competence, experience, and skills needed to get the job done.
      </p>
      <p><strong>a. Phí dịch vụ / Service Fee</strong></p>
      <p>b. Phí dịch vụ cho các dịch vụ nêu trên chưa bao gồm thuế GTGT là: {serviceFee.toLocaleString()} VND</p>
      <p>Service fee for the above services excluding VAT is: {serviceFee.toLocaleString()} VND</p>
      <p>
        Phí dịch vụ đã bao gồm chi phí đi lại, ăn ở, phụ phí khác và chưa bao gồm thuế GTGT
        (Thuế GTGT sẽ theo quy định tại thời điểm xuất hoá đơn).
      </p>
      <p>
        Service fee includes travel costs, accommodation, other fees and not include VAT
        (VAT will be according to regulations at the time of invoice issuance).
      </p>
      <p><strong>Điều khoản thanh toán</strong></p>
      <p><strong>Term of payment</strong></p>
      <ul>
        <li>Thanh toán lần 1: 50% khi bắt đầu kiểm toán.</li>
        <li>1st payment: 50% when starting the audit.</li>
        <li>Thanh toán lần 2: 50% còn lại ngay sau khi Báo cáo Kiểm toán được bàn giao.</li>
        <li>2nd payment: 50% after delivery of the Auditing Report.</li>
      </ul>
      <p>Phí kiểm toán sẽ được thanh toán bằng cách chuyển khoản trực tiếp vào tài khoản Công Ty chúng tôi.</p>
      <p>Audit fees will be paid by direct deposit to our Company bank account.</p>
      <p>
        Công Ty chúng tôi sẽ phát hành hoá đơn GTGT cho Quý Công Ty khi hoàn thành việc cung cấp dịch vụ,
        phù hợp với quy định của pháp luật thuế hiện hành.
      </p>
      <p>
        Our Company will issue VAT invoices to your Company upon completion of the provision of services,
        in accordance with the provisions of the current tax laws.
      </p>

      <h4>4. Nhóm thực hiện dịch vụ kiểm toán</h4>
      <h5>The group performs the audit</h5>
      <ul>
        <li>01 Thành viên Ban Tổng Giám đốc phụ trách chung / 01 Board Member in charge</li>
        <li>01 Kiểm toán viên Trưởng đoàn kiểm toán / 01 Audit team leader</li>
        <li>03 Trợ lý kiểm toán thực hiện kiểm toán / 03 Audit assistants</li>
      </ul>

      <h4>5. Các vấn đề khác</h4>
      <h5>Other issues</h5>
      <p>
        Nếu Quý Công ty chưa hài lòng về bất cứ khía cạnh nào trong dịch vụ của chúng tôi,
        xin vui lòng thông báo ngay cho chúng tôi.
      </p>
      <p>If you are not satisfied with any aspect of our service, please notify us immediately.</p>

      <div className="signature">
        <p>Rất mong được hợp tác với Quý Công Ty.</p>
        <p>Looking forward to cooperating with you.</p>
        <p>Kính chào/ Best regards,</p>
      </div>
    </div>
  )
);

QuoteDocument.displayName = "QuoteDocument";

const QuotePDF: React.FC<QuotePDFProps> = (props) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (componentRef.current) {
      const opt = {
        margin:       0.5,
        filename:     `baogia-${props.auditYear}.pdf`,
        image:        { type: "jpeg", quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: "in", format: "a4", orientation: "portrait" }
      };

      html2pdf().set(opt).from(componentRef.current).save();
    }
  };

  return (
    <div className="quote-wrapper">
      <QuoteDocument ref={componentRef} {...props} />
      <div className="download-bar">
        <button className="download-btn" onClick={handleDownload}>
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default QuotePDF;
