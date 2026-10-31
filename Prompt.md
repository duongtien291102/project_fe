# BẢN QUY CHUẨN KIẾN TRÚC MVC VÀ NGUYÊN TẮC PHÁT TRIỂN DỰ ÁN
> **DÀNH CHO TẤT CẢ CÁC AI VÀ LẬP TRÌNH VIÊN THAM GIA PHÁT TRIỂN HỆ THỐNG**
> **Dự án:** Grand Hotel & Resorts - Hệ Thống Đặt Phòng & Quản Trị Khách Sạn 5 Sao (React MVC)

---

## 1. MỤC ĐÍCH & PHẠM VI ÁP DỤNG

Tài liệu này là **chỉ thị bắt buộc (Mandatory Directive)** dành cho tất cả các mô hình Trí tuệ Nhân tạo (AI Assistants như Antigravity, Claude, ChatGPT, Cursor, GitHub Copilot...) và các nhà phát triển khi chỉnh sửa, mở rộng hoặc bảo trì mã nguồn trong repository này.

**Yêu cầu cốt lõi:**
1. **TUÂN THỦ 100% KIẾN TRÚC MVC (Model - View - Controller).** Không được phá vỡ cấu trúc thư mục hoặc trộn lẫn trách nhiệm giữa các tầng.
2. **KHÔNG CÀI THÊM THƯ VIỆN MỚI.** Tuyệt đối không chạy `npm install` để thêm các gói package bên ngoài. Chỉ sử dụng các tài nguyên đã tích hợp sẵn.
3. **DUY TRÌ TÍNH NHẤT QUÁN GIỮA MODULAR VÀ STANDALONE:** Mọi thay đổi trong thư mục `src/` phải được đồng bộ sang file chạy trực tiếp `react.html` và `index.html` thông qua `build_react_standalone.py`.

---

## 2. NGUYÊN TẮC BẤT DI BẤT DỊCH (NON-NEGOTIABLE CONSTRAINTS)

### 2.1. Cấm cài đặt thêm thư viện npm ("Không tải thêm thư viện mới")
- **Danh sách thư viện DUY NHẤT được phép sử dụng:**
  - `React 18` & `ReactDOM 18` (Core UI engine)
  - `Chart.js 4.4.1` (Biểu đồ doanh thu 3 năm, xu hướng và cơ cấu phòng)
  - `SheetJS (xlsx 0.18.5)` (Xuất báo cáo tài chính & đối soát sang định dạng Excel .xlsx)
  - `FontAwesome 6.5.1` (Hệ thống icon tiêu chuẩn 5 sao)
  - `Google Fonts` (`Cinzel`, `Plus Jakarta Sans`, `Playfair Display`)
  - `VietQR API` (Tạo mã QR thanh toán động ngân hàng MB Bank chuẩn NAPAS 247)
- **Cấm:** Không cài Redux, Zustand, MobX, Tailwind, Bootstrap, Axios, React-Router hay bất kỳ thư viện component ngoài nào.

### 2.2. Chế độ vận hành kép (Dual-Mode Operation)
1. **Chế độ phát triển Module (ES6 Modules):**
   - Đặt trong thư mục `src/`, chạy với máy chủ dev hoặc bundler chuẩn.
2. **Chế độ Zero-Install Standalone:**
   - Hai file `index.html` và `react.html` ở thư mục gốc có thể click đúp mở trực tiếp trên trình duyệt mà không cần cài Node.js, không cần npm, không cần dev server.

---

## 3. QUY HOẠCH CHI TIẾT KIẾN TRÚC THƯ MỤC MVC

Cấu trúc thư mục của dự án bắt buộc phải tuân theo cấu trúc sau:

```
project/
├── index.html                   # Bản build standalone cho trang chính
├── react.html                   # Bản build standalone React
├── de.html                      # Mẫu tham chiếu giao diện gốc
├── Prompt.md                    # Bản chỉ thị kiến trúc MVC dành cho AI (File này)
├── README.md                    # Tài liệu hướng dẫn sử dụng và giới thiệu dự án
├── build_react_standalone.py    # Script Python tự động bundle từ src/ ra standalone HTML
│
└── src/
    ├── main.jsx                 # Điểm khởi tạo ứng dụng React chuẩn Vite/Webpack
    ├── index.css                # Toàn bộ CSS phong cách khách sạn 5 sao cao cấp
    ├── App.jsx                  # Root Application View kết nối Controller với các Views
    │
    ├── models/                  # === TẦNG MODEL (DỮ LIỆU & LOGIC MIỀN NGHIỆP VỤ) ===
    │   ├── StorageService.js    # Dịch vụ quản lý đọc/ghi LocalStorage an toàn
    │   ├── RoomModel.js         # Schema phòng, trạng thái, danh mục phòng mẫu
    │   ├── BookingModel.js      # Schema đơn đặt, tính toán giá/cọc, dữ liệu CCCD
    │   ├── UserModel.js         # Phân quyền RBAC, vai trò chức danh, tài khoản nhân sự
    │   ├── TransactionModel.js  # Cấu hình ngân hàng VietQR, format tiền tệ, sổ thu chi
    │   └── RevenueModel.js      # Dữ liệu doanh thu 3 năm (2024-2026), tính ADR/RevPAR
    │
    ├── controllers/             # === TẦNG CONTROLLER (ĐIỀU PHỐI TRẠNG THÁI & NGHIỆP VỤ) ===
    │   └── useHotelController.js # Custom hook quản lý toàn bộ state, sự kiện, actions
    │
    └── views/                   # === TẦNG VIEW (GIAO DIỆN HIỂN THỊ THUẦN TÚY) ===
        ├── common/
        │   └── ToastView.jsx    # Hộp thông báo phản hồi (Toast notifications)
        ├── landing/
        │   ├── NavbarView.jsx   # Thanh điều hướng trang chủ
        │   ├── HeroView.jsx     # Banner chính và bộ tìm kiếm phòng nhanh
        │   ├── LandingRoomsView.jsx # Bộ sưu tập thẻ phòng và lọc danh mục
        │   └── FooterView.jsx   # Chân trang và cam kết pháp lý
        ├── admin/
        │   ├── AdminSidebarView.jsx   # Menu bên hông khu vực quản trị
        │   ├── AdminTopbarView.jsx    # Thanh tiêu đề, chuyển nhanh vai trò nhân sự
        │   ├── DashboardView.jsx      # Thống kê KPI, biểu đồ Chart.js, xuất Excel
        │   ├── RoomsView.jsx          # Quản lý buồng phòng, Check-in nhanh, Check-out
        │   ├── BookingsView.jsx       # Quản lý đơn đặt, soi ảnh CCCD 2 mặt
        │   ├── LedgerView.jsx         # Sổ quỹ thu chi, dòng tiền VietQR/Tiền mặt
        │   ├── StaffView.jsx          # Danh sách nhân viên và trạng thái tài khoản
        │   └── PermissionsView.jsx    # Ma trận phân quyền chi tiết (RBAC)
        └── modals/
            └── ModalsView.jsx         # Toàn bộ 11 hộp thoại tương tác của hệ thống
```

---

## 4. QUY TẮC PHÂN CHIA TRÁCH NHIỆM GIỮA CÁC TẦNG

### 4.1. Tầng MODEL (`src/models/`)
- **Nhiệm vụ:**
  - Định nghĩa cấu trúc đối tượng (Schemas, Types, Enums).
  - Khởi tạo bộ dữ liệu mẫu ban đầu (Initial Data).
  - Cung cấp các hàm tính toán nghiệp vụ thuần túy (Pure Business Functions): tính tổng tiền phòng, tính số đêm lưu trú, tính tiền cọc, tính số tiền hoàn trả, tính toán các chỉ số quản trị (ADR, RevPAR, tỷ lệ lấp đầy Occupancy, tăng trưởng YoY).
  - Cung cấp dịch vụ lưu trữ bền vững (`StorageService`) để giao tiếp với `localStorage`.
- **ĐIỀU CẤM KỴ TẠI TẦNG MODEL:**
  - ❌ **CẤM** import thư viện React (`import React from 'react'`).
  - ❌ **CẤM** sử dụng bất kỳ React hook nào (`useState`, `useEffect`, `useRef`...).
  - ❌ **CẤM** chứa mã JSX hoặc thẻ HTML.
  - ❌ **CẤM** can thiệp DOM trực tiếp (`document.getElementById`, `window.alert`...).

### 4.2. Tầng VIEW (`src/views/`)
- **Nhiệm vụ:**
  - Là các React Component thuần túy trình bày giao diện (Presentational / Dumb Components).
  - Nhận dữ liệu đầu vào thông qua `props`.
  - Bắt các sự kiện click, nhập liệu, thay đổi của người dùng và gọi các hàm callback (`on...`) được truyền từ Controller.
  - Tối ưu hiển thị, bố cục giao diện, CSS class và khả năng phản hồi responsive.
- **ĐIỀU CẤM KỴ TẠI TẦNG VIEW:**
  - ❌ **CẤM** lưu trữ state dữ liệu dùng chung (toàn bộ state chung phải do Controller quản lý).
  - ❌ **CẤM** gọi trực tiếp `localStorage.getItem()` hay `localStorage.setItem()`.
  - ❌ **CẤM** tự ý thay đổi dữ liệu props hoặc thực hiện logic nghiệp vụ cốt lõi (như tạo giao dịch tài chính, đổi trạng thái phòng). Mọi hành động phải bắn qua callback để Controller xử lý.

### 4.3. Tầng CONTROLLER (`src/controllers/`)
- **Nhiệm vụ:**
  - Đóng vai trò bộ não điều phối duy nhất giữa Model và View.
  - Sử dụng React Hooks (`useState`, `useEffect`, `useCallback`) để quản lý vòng đời dữ liệu.
  - Lắng nghe hành động từ View, gọi Model để tính toán hoặc cập nhật, đồng bộ vào `StorageService`.
  - Kiểm tra quyền hạn của người dùng (RBAC Guard) trước khi cho phép thực thi hành động.
  - Đóng gói toàn bộ state và các hàm xử lý hành động (action handlers) trả về cho component gốc `App.jsx`.
- **ĐIỀU CẤM KỴ TẠI TẦNG CONTROLLER:**
  - ❌ **CẤM** viết mã JSX hoặc render giao diện bên trong Controller.
  - ❌ **CẤM** hardcode dữ liệu thô (phải import từ Model).

### 4.4. Component Gốc (`src/App.jsx`)
- `App.jsx` hoạt động như một bộ khung kết nối (Container View):
  - Khởi tạo controller: `const ctrl = useHotelController();`
  - Truyền dữ liệu và callback từ `ctrl` xuống các Views tương ứng.
  - Giữ cho code của `App.jsx` ngắn gọn, tường minh, không chứa logic nghiệp vụ phức tạp.

---

## 5. BẢN HƯỚNG DẪN ĐỒNG BỘ STANDALONE (BUILD WORKFLOW)

Hệ thống cung cấp sẵn file `build_react_standalone.py`. File này chịu trách nhiệm:
1. Đọc mã CSS từ `src/index.css`.
2. Đọc và làm sạch các tầng Model (`src/models/*.js`).
3. Đọc và làm sạch tầng Controller (`src/controllers/*.js`).
4. Đọc và làm sạch tầng View (`src/views/**/*.jsx`).
5. Đọc `src/App.jsx`.
6. Ghép toàn bộ thành file `react.html` và `index.html` độc lập, có thể chạy trực tiếp bằng trình duyệt.

**YÊU CẦU ĐỐI VỚI AI:**
> Sau khi tạo mới, sửa đổi hoặc thêm tính năng vào bất kỳ file nào trong `src/`, AI **BẮT BUỘC** phải chạy lệnh:
> ```bash
> python build_react_standalone.py
> ```
> để cập nhật đồng bộ cho cả `react.html` và `index.html`.

---

## 6. CHECKLIST KIỂM TRA BẮT BUỘC TRƯỚC KHI BÀN GIAO (AI CHECKLIST)

Mỗi AI trước khi hoàn thành lượt hỗ trợ hoặc commit code lên repository phải tự kiểm tra 6 tiêu chí sau:

- [ ] **1. ĐÚNG THƯ MỤC MVC:** Mã mới đã được đặt đúng vào `src/models/`, `src/views/`, hay `src/controllers/` chưa? Có file nào đặt sai chỗ không?
- [ ] **2. KHÔNG THƯ VIỆN NGOÀI:** Có import thư viện nào ngoài React 18, Chart.js, SheetJS, FontAwesome, VietQR không?
- [ ] **3. PHÂN ĐỊNH TRÁCH NHIỆM:**
  - Model có bị dính JSX hoặc React Hook không? (Nếu có -> chuyển sang View hoặc Controller).
  - View có bị dính `localStorage` hoặc tính toán nặng không? (Nếu có -> chuyển sang Controller hoặc Model).
- [ ] **4. ĐỒNG BỘ STANDALONE:** Đã chạy `python build_react_standalone.py` chưa? Hai file `react.html` và `index.html` có được cập nhật mới nhất không?
- [ ] **5. KHÔNG XUNG ĐỘT TÊN BIẾN:** Đã kiểm tra không có khai báo trùng lặp identifier ở cấp cao nhất trong bản build standalone chưa?
- [ ] **6. TÍNH NĂNG 5 SAO TOÀN VẸN:** Đặt phòng, tính tiền cọc, mã VietQR MB Bank, hiển thị ảnh CCCD 2 mặt, Dashboard doanh thu 3 năm, xuất file Excel, phân quyền nhân sự vẫn hoạt động trơn tru 100%.

---
*Grand Hotel & Resorts Technical Architecture Standards - Luôn tuân thủ tuyệt đối quy chuẩn này!*
