# Grand Hotel & Resorts | Quản Lý Khách Sạn, Thu Chi & Hồ Sơ CCCD Khách Hàng

Dự án Frontend được xây dựng hoàn toàn bằng **HTML5, CSS3 và JavaScript thuần (Vanilla JS)**, tích hợp giao diện nghỉ dưỡng 5 sao sang trọng cùng hệ thống bảng điều khiển quản trị (Admin Dashboard) chuyên sâu.

🔗 **Repository:** [https://github.com/duongtien291102/project_fe.git](https://github.com/duongtien291102/project_fe.git)

---

## 🌟 Tính Năng Nổi Bật

### 1. Phân Hệ Khách Hàng (Client Landing Page & Booking)
- **Giao diện 5 Sao Sang Trọng:** Tông màu Navy & Hoàng Kim (Gold Luxury) với hiệu ứng thị giác mượt mà.
- **Bộ Lọc & Tìm Kiếm Phòng Nghỉ:** Tìm kiếm theo ngày nhận/trả phòng, hạng phòng (Standard, Superior, Executive Suite, Presidential Villa) và số lượng khách.
- **Quy Trình Đặt Phòng Chuẩn:**
  - Chọn dịch vụ gia tăng 5 sao (Buffet sáng Michelin, xe đưa đón sân bay, liệu trình Lotus Spa).
  - Tùy chọn đặt cọc giữ phòng (50%, 100% hoặc thanh toán khi nhận phòng).
- **Định Danh Căn Cước Công Dân (CCCD / Passport):**
  - Khai báo đầy đủ họ tên, ngày sinh, số CCCD, ngày cấp, nơi cấp.
  - Tải và xem trước ảnh chụp CCCD 2 mặt (mặt trước & mặt sau) phục vụ khai báo tạm trú theo quy định.
- **Cổng Thanh Toán VietQR Tự Động:**
  - Tạo mã QR động chuẩn Napas 24/7 theo từng mã đơn đặt phòng.
  - Tự động điền số tiền và nội dung chuyển khoản.

### 2. Phân Hệ Quản Trị (Admin Dashboard Chuyên Sâu)
- **Báo Cáo Doanh Thu 3 Năm (2024 - 2026):**
  - Biểu đồ đường xu hướng 12 tháng so sánh tăng trưởng giữa các năm (Chart.js).
  - Biểu đồ cơ cấu doanh thu theo hạng phòng và kênh thanh toán (VietQR, Tiền mặt, Thẻ POS).
  - Các chỉ số tài chính quản trị khách sạn: ADR (Average Daily Rate), RevPAR (Revenue Per Available Room), Tỷ lệ lấp đầy (Occupancy Rate).
  - **Xuất Báo Cáo Excel (.xlsx):** Xuất bảng ma trận 3 năm và danh sách chi tiết giao dịch khách lưu trú phục vụ kiểm toán tài chính bằng SheetJS.
- **Quản Lý Phòng & Buồng Phòng:**
  - Theo dõi trạng thái phòng thời gian thực (Trống, Đang thuê, Đã đặt, Đang dọn).
  - Thao tác nhanh Check-in khách trực tiếp (Walk-in), bàn giao chìa khóa, cập nhật dọn phòng.
- **Quản Lý Đơn Đặt Phòng & Đối Soát CCCD:**
  - Xem danh sách toàn bộ booking, tra cứu hồ sơ CCCD và ảnh chụp 2 mặt của từng khách lưu trú.
- **Quyết Toán Trả Phòng (Check-out & Cashier):**
  - Tự động khấu trừ tiền cọc đã thu trước đó, tính toán chi phí minibar & dịch vụ.
  - Hỗ trợ thanh toán phần còn lại bằng VietQR, thẻ tín dụng hoặc tính tiền thối lại khi nhận tiền mặt.
- **Sổ Quỹ Thu Chi & Dòng Tiền:**
  - Ghi nhận lịch sử từng giao dịch, phân loại theo phương thức thanh toán.
  - Cho phép thủ quỹ ghi nhận thu tiền / đặt cọc thủ công.
- **Phân Quyền Nhân Sự (RBAC - Role-Based Access Control):**
  - Các vai trò mặc định: Giám Đốc / Tổng Quản Lý, Quản Lý Lễ Tân, Nhân Viên Lễ Tân, Kế Toán / Thủ Quỹ, Quản Lý Buồng Phòng.
  - Chuyển đổi nhanh vai trò để kiểm tra quyền hạn thực tế.
  - **Ma Trận Phân Quyền Chi Tiết:** Bật / tắt từng quyền hạn theo nhóm chức năng và lưu cấu hình vào LocalStorage.

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend Core:** HTML5, CSS3 (Modern Flexbox & Grid, CSS Variables), Vanilla JavaScript (ES6+).
- **Typography & Icons:** Google Fonts (`Plus Jakarta Sans`, `Playfair Display`, `Cinzel`), Font Awesome 6.5.
- **Thư Viện Đồ Họa & Báo Cáo:**
  - [Chart.js 4.4.1](https://www.chartjs.org/) - Biểu đồ phân tích tài chính & doanh thu.
  - [SheetJS (xlsx 0.18.5)](https://sheetjs.com/) - Xuất dữ liệu báo cáo sang định dạng Microsoft Excel (.xlsx).
- **Cổng Thanh Toán:** VietQR Image API (chuẩn Napas 24/7).
- **Lưu Trữ Dữ Liệu:** Client-side LocalStorage (hỗ trợ lưu trạng thái, khôi phục dữ liệu gốc).

---

## 🚀 Hướng Dẫn Cài Đặt & Sử Dụng

1. **Clone repository:**
   ```bash
   git clone https://github.com/duongtien291102/project_fe.git
   cd project_fe
   ```

2. **Chạy ứng dụng:**
   - Không cần cài đặt `node_modules` hay bất kỳ build tool phức tạp nào.
   - Nhấp đúp chuột mở trực tiếp file `index.html` bằng trình duyệt web bất kỳ (Chrome, Edge, Firefox, Safari).
   - Hoặc sử dụng extension **Live Server** trên VS Code.

---

## 📂 Cấu Trúc Dự Án

```
project_fe/
├── index.html        # Trang giao diện chính (Landing Page & Admin Dashboard)
├── de.html           # Bản sao lưu cấu hình giao diện
├── README.md         # Tài liệu hướng dẫn dự án
└── .gitignore        # Cấu hình bỏ qua tệp tin rác
```

---

## 👤 Tác Giả
- **GitHub:** [@duongtien291102](https://github.com/duongtien291102)
- **Email:** duongtien291102@gmail.com
