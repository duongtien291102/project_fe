# Grand Hotel & Resorts | Quản Lý Khách Sạn, Thu Chi & Hồ Sơ CCCD Khách Hàng (React Edition)

Dự án được chuyển đổi từ mẫu `de.html` sang mã nguồn **React 18** hoàn chỉnh với kiến trúc **Component & Hooks thuần (useState, useEffect, useMemo, useRef)**, tuân thủ nghiêm ngặt nguyên tắc **không cài đặt thêm bất kỳ thư viện ngoài nào** (không dùng Ant Design, Material-UI, Tailwind, Redux, Axios...).

🔗 **Repository:** [https://github.com/duongtien291102/project_fe.git](https://github.com/duongtien291102/project_fe.git)

---

## 🌟 2 Cách Sử Dụng Linh Hoạt

### Cách 1: Chạy trực tiếp tức thì (Zero-install Standalone - Khuyên dùng)
- Mở trực tiếp tệp **[`index.html`](index.html)** hoặc **[`react.html`](react.html)** bằng bất kỳ trình duyệt nào (Chrome, Edge, Firefox, Cốc Cốc).
- **Không cần chạy `npm install`**, không cần cài đặt Node.js hay build tool.
- Ứng dụng React 18 được nạp trực tiếp qua CDN chính thức và biên dịch JSX thời gian thực qua Babel Standalone.

### Cách 2: Sử dụng mã nguồn mô-đun hóa React (Trong thư mục `src/`)
- Cấu trúc các Component chuẩn React 18 trong thư mục `src/`:
  - `src/App.jsx`: Quản lý toàn bộ State, Điều hướng Landing Page & Admin Dashboard, Quản lý Modal & Toasts.
  - `src/components/Navbar.jsx`: Thanh điều hướng và nhận diện tài khoản khách/nhân viên.
  - `src/components/Hero.jsx`: Khối banner hoàng gia & bộ tìm kiếm đặt phòng.
  - `src/components/LandingRooms.jsx`: Bộ lọc danh mục phòng nghỉ và thẻ phòng 5 sao.
  - `src/components/Footer.jsx`: Chân trang chính sách pháp lý & CCCD.
  - `src/components/AdminSidebar.jsx` & `AdminTopbar.jsx`: Thanh điều hướng và chuyển đổi vai trò nhân sự.
  - `src/components/DashboardTab.jsx`: Báo cáo doanh thu 3 năm (2024 - 2026), biểu đồ Chart.js, xuất Excel qua SheetJS.
  - `src/components/RoomsTab.jsx`: Quản lý phòng, nhận phòng nhanh, trả phòng, dọn dẹp buồng phòng.
  - `src/components/BookingsTab.jsx`: Quản lý đặt phòng và xem ảnh CCCD 2 mặt của khách lưu trú.
  - `src/components/LedgerTab.jsx`: Sổ quỹ thu chi, dòng tiền VietQR / Tiền mặt / Thẻ POS.
  - `src/components/StaffTab.jsx`: Quản lý danh sách nhân sự nội bộ.
  - `src/components/PermissionsTab.jsx`: Cấu hình ma trận phân quyền chi tiết (RBAC).
  - `src/components/Modals.jsx`: 11 hộp thoại tương tác (Đăng ký CCCD, Đặt cọc VietQR, Phiếu quyết toán...).
  - `src/components/ToastContainer.jsx`: Hệ thống thông báo toast tự động.
  - `src/constants/initialData.js`: CSDL mặc định và các hàm tiện ích (`formatVND`, `generateVietQRUrl`...).

---

## 💎 Tính Năng Trọng Tâm Được Chuyển Đổi Sang React

1. **Reactive State Management:**
   - Dữ liệu phòng, đơn đặt, sổ quỹ, nhân sự, ma trận quyền hạn và doanh thu 3 năm được quản lý hoàn toàn bằng React State (`useState`) và đồng bộ hai chiều với `LocalStorage`.
2. **Khai Báo & Định Danh CCCD Khách Lưu Trú:**
   - Form đăng ký kèm tải ảnh CCCD mặt trước & mặt sau với preview ảnh tức thì qua FileReader Base64.
   - Modal xem hồ sơ CCCD dành riêng cho lễ tân để kiểm tra, đối soát thông tin lưu trú.
3. **Thanh Toán & Đặt Cọc VietQR Tự Động:**
   - Tự động sinh mã VietQR chuẩn Napas 24/7 theo số tiền cọc (50%, 100%) hoặc số tiền quyết toán còn lại khi trả phòng.
4. **Báo Cáo Doanh Thu 3 Năm & Xuất Excel:**
   - Tích hợp vòng đời `useEffect` và `useRef` để quản lý biểu đồ Chart.js (Line Chart xu hướng 12 tháng & Donut Chart cơ cấu).
   - Xuất file Excel `.xlsx` hai bảng biểu (Tổng hợp 3 năm & Chi tiết giao dịch) qua thư viện SheetJS có sẵn.
5. **Ma Trận Phân Quyền (RBAC):**
   - Checkbox ma trận quyền phản ứng tức thì theo trạng thái React, có thể chuyển đổi nhanh giữa các tài khoản nhân sự để kiểm tra quyền hạn thực tế.

---

## 📂 Cấu Trúc Thư Mục

```
project_fe/
├── index.html                  # Bản chạy React trực tiếp (không cần npm)
├── react.html                  # Bản sao lưu React Standalone
├── de.html                     # Bản gốc thuần HTML/JS để đối chiếu
├── package.json                # Cấu hình dự án (chỉ chứa react & react-dom)
├── build_react_standalone.py   # Script đóng gói tự động
├── README.md                   # Hướng dẫn chi tiết
└── src/
    ├── App.jsx                 # Component React gốc
    ├── main.jsx                # Điểm khởi chạy React
    ├── index.css               # Hệ thống Style 5 sao toàn diện
    ├── constants/
    │   └── initialData.js      # CSDL & hàm hỗ trợ
    └── components/
        ├── ToastContainer.jsx
        ├── Navbar.jsx
        ├── Hero.jsx
        ├── LandingRooms.jsx
        ├── Footer.jsx
        ├── AdminSidebar.jsx
        ├── AdminTopbar.jsx
        ├── DashboardTab.jsx
        ├── RoomsTab.jsx
        ├── BookingsTab.jsx
        ├── LedgerTab.jsx
        ├── StaffTab.jsx
        ├── PermissionsTab.jsx
        └── Modals.jsx
```

---

## 👤 Tác Giả
- **GitHub:** [@duongtien291102](https://github.com/duongtien291102)
- **Email:** duongtien291102@gmail.com
