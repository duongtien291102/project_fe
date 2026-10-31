# Grand Hotel & Resorts | Quản Lý Khách Sạn & CCCD (Kiến Trúc React MVC)

Dự án được xây dựng và chuyển đổi hoàn chỉnh từ mẫu `de.html` sang **React 18** theo mô hình kiến trúc chuẩn **MVC (Model - View - Controller)**. Dự án tuân thủ nghiêm ngặt nguyên tắc **không cài đặt thêm bất kỳ thư viện ngoài nào** (chỉ sử dụng React 18, React-DOM, Chart.js, SheetJS, FontAwesome, Google Fonts và VietQR API).

🔗 **Repository:** [https://github.com/duongtien291102/project_fe.git](https://github.com/duongtien291102/project_fe.git)  
📜 **Quy chuẩn dành cho AI:** [Prompt.md](Prompt.md)

---

## 🌟 2 Cách Vận Hành Linh Hoạt

### Cách 1: Chạy trực tiếp tức thì (Zero-install Standalone - Khuyên dùng)
- Mở trực tiếp tệp **[`index.html`](index.html)** hoặc **[`react.html`](react.html)** bằng bất kỳ trình duyệt nào (Chrome, Edge, Firefox, Cốc Cốc...).
- **Không cần chạy `npm install`**, không cần cài đặt Node.js hay bundler.
- Toàn bộ Model, View, Controller được nạp và biên dịch JSX thời gian thực qua Babel Standalone.

### Cách 2: Phát triển theo mô-đun chuẩn React MVC (Thư mục `src/`)
- Dự án được tổ chức tách bạch hoàn toàn 3 lớp **Model - View - Controller**:
  - **Model (`src/models/`):** Định nghĩa Schema, dữ liệu mẫu, tính toán nghiệp vụ thuần túy và dịch vụ LocalStorage.
  - **Controller (`src/controllers/`):** Điều phối trạng thái, lắng nghe tương tác người dùng, kiểm soát phân quyền RBAC và giao tiếp với Model.
  - **View (`src/views/`):** Các thành phần giao diện thuần túy (Presentational Components), nhận props và kích hoạt callback.
  - **Root View (`src/App.jsx`):** Kết nối Controller với các Views.

---

## 🏛️ Kiến Trúc Thư Mục Chuẩn MVC

```
project_fe/
├── index.html                   # Bản build standalone React MVC (chạy ngay)
├── react.html                   # Bản standalone dự phòng
├── de.html                      # Bản mẫu HTML/JS gốc để đối chiếu
├── Prompt.md                    # Bản chỉ thị quy chuẩn MVC bắt buộc cho AI
├── build_react_standalone.py    # Script Python tự động đóng gói src/ ra HTML standalone
├── README.md                    # Hướng dẫn chi tiết dự án
│
└── src/
    ├── main.jsx                 # Điểm khởi chạy React chuẩn Vite/Webpack
    ├── index.css                # Toàn bộ CSS phong cách khách sạn 5 sao cao cấp
    ├── App.jsx                  # Root Application View kết nối Controller với Views
    │
    ├── models/                  # === MODEL LAYER: DỮ LIỆU & NGHIỆP VỤ ===
    │   ├── StorageService.js    # Quản lý đọc/ghi LocalStorage an toàn
    │   ├── RoomModel.js         # Quản lý thực thể phòng, trạng thái phòng
    │   ├── BookingModel.js      # Quản lý đơn đặt, logic tính tiền cọc, CCCD
    │   ├── UserModel.js         # Quản lý người dùng, nhân sự, ma trận quyền RBAC
    │   ├── TransactionModel.js  # Quản lý giao dịch sổ quỹ, ngân hàng VietQR
    │   └── RevenueModel.js      # Bộ dữ liệu 3 năm (2024-2026), tính ADR/RevPAR
    │
    ├── controllers/             # === CONTROLLER LAYER: ĐIỀU PHỐI NGHIỆP VỤ ===
    │   └── useHotelController.js # Custom hook quản lý state toàn cục và mọi action handlers
    │
    └── views/                   # === VIEW LAYER: GIAO DIỆN HIỂN THỊ ===
        ├── common/
        │   └── ToastView.jsx    # Hộp thông báo phản hồi (Toasts)
        ├── landing/
        │   ├── NavbarView.jsx   # Thanh điều hướng chính
        │   ├── HeroView.jsx     # Banner tìm kiếm phòng nhanh
        │   ├── LandingRoomsView.jsx # Danh sách và bộ lọc phòng khách sạn
        │   └── FooterView.jsx   # Chân trang và điều khoản bảo mật
        ├── admin/
        │   ├── AdminSidebarView.jsx   # Menu điều hướng quản trị
        │   ├── AdminTopbarView.jsx    # Thanh tiêu đề và đổi nhanh vai trò nhân sự
        │   ├── DashboardView.jsx      # Thống kê KPI, biểu đồ Chart.js, xuất Excel
        │   ├── RoomsView.jsx          # Quản lý buồng phòng, Check-in, Check-out
        │   ├── BookingsView.jsx       # Quản lý đơn đặt, soi ảnh CCCD 2 mặt
        │   ├── LedgerView.jsx         # Sổ quỹ thu chi, dòng tiền VietQR/Tiền mặt
        │   ├── StaffView.jsx          # Danh sách nhân viên và trạng thái tài khoản
        │   └── PermissionsView.jsx    # Ma trận phân quyền chi tiết (RBAC)
        └── modals/
            └── ModalsView.jsx         # Toàn bộ 11 hộp thoại tương tác của hệ thống
```

---

## 💎 Các Tính Năng 5 Sao Nổi Bật

1. **Mô Hình MVC Chuẩn Mực:**
   - Dữ liệu và logic nghiệp vụ độc lập hoàn toàn khỏi giao diện, dễ bảo trì, dễ mở rộng và kiểm thử.
2. **Khai Báo & Định Danh CCCD Khách Lưu Trú:**
   - Tải và xem ảnh CCCD 2 mặt (mặt trước & mặt sau) bằng FileReader Base64.
   - Hộp thoại dành riêng cho bộ phận Lễ tân kiểm tra thông tin căn cước đối chiếu với quy định cư trú.
3. **Thanh Toán & Đặt Cọc VietQR Tự Động:**
   - Tự động sinh mã VietQR động theo chuẩn Napas 24/7 (Ngân hàng MB Bank) cho tiền cọc (50%, 100%) hoặc tiền quyết toán khi trả phòng.
4. **Báo Cáo Doanh Thu 3 Năm & Xuất Excel:**
   - Quản lý biểu đồ Chart.js (Line Chart doanh thu 12 tháng & Donut Chart cơ cấu phòng).
   - Xuất file Excel `.xlsx` hai bảng biểu (Doanh thu tổng hợp & Danh sách giao dịch) qua thư viện SheetJS.
5. **Ma Trận Phân Quyền Vai Trò (RBAC):**
   - Bật/tắt linh hoạt các quyền của từng vai trò chức danh trong khách sạn, kiểm soát quyền truy cập trang quản trị tức thì.

---

## 🤖 Bản Quy Chuẩn Dành Cho AI (`Prompt.md`)

Mọi công cụ AI khi tham gia đọc hoặc sửa mã nguồn trong repository này **bắt buộc phải tuân theo** các điều khoản đã được quy định trong tệp [`Prompt.md`](Prompt.md):
- Không cài đặt thêm bất kỳ thư viện npm bên ngoài nào.
- Giữ nguyên ranh giới trách nhiệm giữa Model, View và Controller.
- Sau khi chỉnh sửa mã nguồn trong `src/`, luôn chạy `python build_react_standalone.py` để đồng bộ bản `index.html` và `react.html`.

---

## 👤 Tác Giả & Bản Quyền
- **GitHub:** [@duongtien291102](https://github.com/duongtien291102)
- **Email:** duongtien291102@gmail.com
