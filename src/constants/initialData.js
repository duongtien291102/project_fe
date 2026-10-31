export const STORAGE_KEYS = {
    ROOMS: 'grand_hotel_rooms_v2',
    BOOKINGS: 'grand_hotel_bookings_v2',
    USER: 'grand_hotel_current_user_v2',
    STAFF_USERS: 'grand_hotel_staff_users_v2',
    ROLES_CONFIG: 'grand_hotel_roles_config_v2',
    ACTIVE_STAFF_ID: 'grand_hotel_active_staff_id_v2',
    TRANSACTIONS: 'grand_hotel_financial_transactions_v2',
    HISTORICAL_REVENUE: 'grand_hotel_historical_revenue_v3'
};

export const HOTEL_BANK_CONFIG = {
    bankId: 'MB',
    accountNo: '098888899',
    accountName: 'GRAND HOTEL AND RESORTS',
    template: 'compact2'
};

export const DEFAULT_CCCD_FRONT = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80';
export const DEFAULT_CCCD_BACK = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80';

export const PERMISSION_GROUPS = [
    {
        groupName: '1. Thống Kê & Báo Cáo',
        permissions: [
            { key: 'view_kpi', label: 'Xem bảng tổng quan KPI khách sạn', desc: 'Xem số phòng trống, đang thuê, tỷ lệ lấp đầy' },
            { key: 'view_revenue', label: 'Xem báo cáo doanh thu & sổ quỹ tiền tệ', desc: 'Xem tổng tiền tích lũy và dòng tiền thu chi' }
        ]
    },
    {
        groupName: '2. Quản Lý Phòng Nghỉ',
        permissions: [
            { key: 'manage_rooms', label: 'Thêm / Sửa thông tin danh mục phòng', desc: 'Tạo phòng mới, đổi giá phòng' },
            { key: 'room_checkin_checkout', label: 'Thực hiện Check-in & Trả phòng (Bill)', desc: 'Giao nhận chìa khóa và xuất hóa đơn' },
            { key: 'room_cleaning', label: 'Cập nhật trạng thái buồng phòng dọn dẹp', desc: 'Đổi trạng thái phòng đang dọn sang sẵn sàng' }
        ]
    },
    {
        groupName: '3. Quản Lý Đặt Phòng & Tiền Cọc',
        permissions: [
            { key: 'manage_bookings', label: 'Xem danh sách tất cả đơn đặt phòng & CCCD', desc: 'Xem thông tin khách, tiền cọc và kiểm tra ảnh CCCD' },
            { key: 'create_booking', label: 'Tạo đơn đặt phòng trực tiếp (Walk-in)', desc: 'Lập đơn đặt mới cho khách đến nhận phòng ngay' },
            { key: 'cancel_booking', label: 'Hủy bỏ đơn đặt phòng của khách', desc: 'Hủy đơn và hoàn cọc/hủy phòng' }
        ]
    },
    {
        groupName: '4. Thu Ngân & Sổ Quỹ Tiền Tệ',
        permissions: [
            { key: 'manage_finances', label: 'Quản lý thu ngân & ghi nhận giao dịch', desc: 'Xem nhật ký thu tiền, thu tiền cọc và tiền mặt' }
        ]
    },
    {
        groupName: '5. Quản Lý Nhân Sự & Phân Quyền',
        permissions: [
            { key: 'view_staff', label: 'Xem danh sách tài khoản nhân sự', desc: 'Xem danh sách nhân viên nội bộ' },
            { key: 'manage_staff', label: 'Thêm, sửa, khóa tài khoản nhân viên', desc: 'Gán vai trò và quản lý tài khoản nhân viên' },
            { key: 'config_permissions', label: 'Cấu hình chi tiết ma trận quyền hạn', desc: 'Bật/tắt các quyền của từng vai trò' }
        ]
    },
    {
        groupName: '6. Quản Trị Hệ Thống',
        permissions: [
            { key: 'system_reset', label: 'Khôi phục dữ liệu gốc hệ thống', desc: 'Reset dữ liệu mẫu của khách sạn' }
        ]
    }
];

export const INITIAL_ROLES = [
    {
        id: 'admin',
        name: 'Giám Đốc / Tổng Quản Lý',
        badgeColor: '#dc2626',
        description: 'Toàn quyền truy cập và cấu hình toàn bộ hệ thống khách sạn',
        permissions: {
            'view_kpi': true, 'view_revenue': true, 'manage_rooms': true, 'room_checkin_checkout': true,
            'room_cleaning': true, 'manage_bookings': true, 'create_booking': true, 'cancel_booking': true,
            'manage_finances': true, 'view_staff': true, 'manage_staff': true, 'config_permissions': true, 'system_reset': true
        }
    },
    {
        id: 'manager',
        name: 'Quản Lý Lễ Tân',
        badgeColor: '#d97706',
        description: 'Quản lý toàn bộ hoạt động tiền sảnh, buồng phòng và lễ tân',
        permissions: {
            'view_kpi': true, 'view_revenue': true, 'manage_rooms': true, 'room_checkin_checkout': true,
            'room_cleaning': true, 'manage_bookings': true, 'create_booking': true, 'cancel_booking': true,
            'manage_finances': true, 'view_staff': true, 'manage_staff': false, 'config_permissions': false, 'system_reset': false
        }
    },
    {
        id: 'receptionist',
        name: 'Nhân Viên Lễ Tân',
        badgeColor: '#2563eb',
        description: 'Thực hiện đặt phòng, check-in, check-out và thu tiền',
        permissions: {
            'view_kpi': true, 'view_revenue': false, 'manage_rooms': false, 'room_checkin_checkout': true,
            'room_cleaning': false, 'manage_bookings': true, 'create_booking': true, 'cancel_booking': false,
            'manage_finances': true, 'view_staff': false, 'manage_staff': false, 'config_permissions': false, 'system_reset': false
        }
    },
    {
        id: 'cashier',
        name: 'Kế Toán / Thủ Quỹ',
        badgeColor: '#7c3aed',
        description: 'Kiểm soát doanh thu, xuất hóa đơn quyết toán và dòng tiền',
        permissions: {
            'view_kpi': true, 'view_revenue': true, 'manage_rooms': false, 'room_checkin_checkout': true,
            'room_cleaning': false, 'manage_bookings': true, 'create_booking': false, 'cancel_booking': false,
            'manage_finances': true, 'view_staff': false, 'manage_staff': false, 'config_permissions': false, 'system_reset': false
        }
    },
    {
        id: 'housekeeping',
        name: 'Quản Lý Buồng Phòng',
        badgeColor: '#059669',
        description: 'Kiểm tra trạng thái dọn dẹp phòng sẵn sàng đón khách',
        permissions: {
            'view_kpi': false, 'view_revenue': false, 'manage_rooms': false, 'room_checkin_checkout': false,
            'room_cleaning': true, 'manage_bookings': false, 'create_booking': false, 'cancel_booking': false,
            'manage_finances': false, 'view_staff': false, 'manage_staff': false, 'config_permissions': false, 'system_reset': false
        }
    }
];

export const INITIAL_STAFF_USERS = [
    { id: 'NV-001', name: 'Hoàng Minh Quân', email: 'quan.hoang@grandhotel.vn', phone: '0903 111 222', roleId: 'admin', status: 'active', lastLogin: 'Hôm nay, 16:30' },
    { id: 'NV-002', name: 'Nguyễn Thu Thảo', email: 'thao.nguyen@grandhotel.vn', phone: '0918 333 444', roleId: 'manager', status: 'active', lastLogin: 'Hôm nay, 15:45' },
    { id: 'NV-003', name: 'Lê Hoàng Nam', email: 'nam.le@grandhotel.vn', phone: '0982 555 666', roleId: 'receptionist', status: 'active', lastLogin: 'Hôm nay, 14:10' },
    { id: 'NV-004', name: 'Phạm Đăng Khoa', email: 'khoa.pham@grandhotel.vn', phone: '0945 888 999', roleId: 'cashier', status: 'active', lastLogin: 'Hôm nay, 11:00' },
    { id: 'NV-005', name: 'Trần Thị Lan', email: 'lan.tran@grandhotel.vn', phone: '0937 777 888', roleId: 'housekeeping', status: 'active', lastLogin: 'Hôm qua, 18:20' }
];

export const INITIAL_ROOMS = [
    { id: '101', name: 'Deluxe King Elegance', type: 'Standard', price: 750000, status: 'Trống', image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=700&q=80', beds: '1 Giường King lớn', view: 'Hướng hoa viên nội khu', size: '38m²', maxGuests: 2, currentGuest: null },
    { id: '102', name: 'Superior Twin Balcony', type: 'Superior', price: 1100000, status: 'Đang thuê', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=700&q=80', beds: '2 Giường Twin êm ái', view: 'Ban công hướng biển', size: '45m²', maxGuests: 2, currentGuest: 'Trần Hải Đăng' },
    { id: '201', name: 'Executive Suite Hoàng Gia', type: 'Suite', price: 2200000, status: 'Trống', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=700&q=80', beds: 'Giường King Hoàng gia', view: 'View đại dương toàn cảnh', size: '68m²', maxGuests: 3, currentGuest: null },
    { id: '202', name: 'Premier Family Suite', type: 'Suite', price: 2800000, status: 'Đã đặt', image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=700&q=80', beds: '1 King + 2 Single Bed', view: 'Tầng cao hướng vịnh', size: '75m²', maxGuests: 4, currentGuest: 'Lê Minh Khang' },
    { id: '301', name: 'Presidential Ocean Villa', type: 'Villa', price: 5800000, status: 'Đang thuê', image: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?auto=format&fit=crop&w=700&q=80', beds: 'Hồ bơi riêng & 2 King Beds', view: 'Trực diện bãi biển riêng', size: '140m²', maxGuests: 6, currentGuest: 'David Nguyễn' },
    { id: '302', name: 'Royal Penthouse Skyview', type: 'Villa', price: 8500000, status: 'Trống', image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=700&q=80', beds: 'Jacuzzi riêng & Phòng rượu VIP', view: 'Tầng 25 ngắm 360 độ thành phố', size: '210m²', maxGuests: 4, currentGuest: null }
];

export const INITIAL_BOOKINGS = [
    {
        id: 'BK-1082',
        customerName: 'TRẦN HẢI ĐĂNG',
        phone: '0912 345 678',
        cccd: '079093005882',
        cccdDate: '2021-06-15',
        cccdPlace: 'Cục CSQLHC về TTXH',
        dob: '1993-10-12',
        cccdFront: DEFAULT_CCCD_FRONT,
        cccdBack: DEFAULT_CCCD_BACK,
        roomId: '102',
        roomName: 'Superior Twin Balcony',
        checkIn: '2026-10-10',
        checkOut: '2026-10-13',
        nights: 3,
        addons: ['Buffet Ăn Sáng Hoàng Gia'],
        minibar: 150000,
        totalAmount: 3900000,
        depositAmount: 1950000,
        depositMethod: 'VietQR',
        paidAmount: 1950000,
        remainingAmount: 1950000,
        status: 'Đã check-in',
        createdAt: '2026-10-09'
    },
    {
        id: 'BK-1083',
        customerName: 'LÊ MINH KHANG',
        phone: '0988 765 432',
        cccd: '001095018993',
        cccdDate: '2022-04-10',
        cccdPlace: 'Cục CSQLHC về TTXH',
        dob: '1995-02-28',
        cccdFront: DEFAULT_CCCD_FRONT,
        cccdBack: DEFAULT_CCCD_BACK,
        roomId: '202',
        roomName: 'Premier Family Suite',
        checkIn: '2026-10-12',
        checkOut: '2026-10-15',
        nights: 3,
        addons: ['Đưa Đón Sân Bay Khứ Hồi'],
        minibar: 0,
        totalAmount: 8850000,
        depositAmount: 4425000,
        depositMethod: 'VietQR',
        paidAmount: 4425000,
        remainingAmount: 4425000,
        status: 'Chờ check-in',
        createdAt: '2026-10-10'
    },
    {
        id: 'BK-1084',
        customerName: 'DAVID NGUYỄN',
        phone: '0909 999 888',
        cccd: 'P98457210',
        cccdDate: '2020-01-05',
        cccdPlace: 'Bộ Ngoại Giao',
        dob: '1988-11-20',
        cccdFront: DEFAULT_CCCD_FRONT,
        cccdBack: DEFAULT_CCCD_BACK,
        roomId: '301',
        roomName: 'Presidential Ocean Villa',
        checkIn: '2026-10-08',
        checkOut: '2026-10-14',
        nights: 6,
        addons: ['Buffet Ăn Sáng Hoàng Gia', 'Lotus Spa'],
        minibar: 450000,
        totalAmount: 36600000,
        depositAmount: 36600000,
        depositMethod: 'Thẻ tín dụng',
        paidAmount: 36600000,
        remainingAmount: 0,
        status: 'Đã check-in',
        createdAt: '2026-10-07'
    }
];

export const INITIAL_TRANSACTIONS = [
    { id: 'TX-701', bookingId: 'BK-1084', customerName: 'DAVID NGUYỄN', type: 'Thanh toán toàn bộ 100%', method: 'Thẻ tín dụng', amount: 36600000, date: '07/10/2026 10:15', staff: 'Phạm Đăng Khoa' },
    { id: 'TX-702', bookingId: 'BK-1082', customerName: 'TRẦN HẢI ĐĂNG', type: 'Đặt cọc giữ phòng 50%', method: 'VietQR', amount: 1950000, date: '09/10/2026 14:30', staff: 'Cổng Online VietQR' },
    { id: 'TX-703', bookingId: 'BK-1083', customerName: 'LÊ MINH KHANG', type: 'Đặt cọc giữ phòng 50%', method: 'VietQR', amount: 4425000, date: '10/10/2026 09:20', staff: 'Cổng Online VietQR' }
];

export function generateDefaultHistoricalRevenue() {
    const monthly = [
        // 2024
        { year: 2024, month: 1, roomRevenue: 280000000, serviceRevenue: 45000000, depositCollected: 110000000, total: 325000000, nights: 145, occ: 68, bookings: 52, adr: 2241000 },
        { year: 2024, month: 2, roomRevenue: 320000000, serviceRevenue: 55000000, depositCollected: 130000000, total: 375000000, nights: 165, occ: 75, bookings: 58, adr: 2272000 },
        { year: 2024, month: 3, roomRevenue: 250000000, serviceRevenue: 35000000, depositCollected: 95000000, total: 285000000, nights: 130, occ: 62, bookings: 46, adr: 2192000 },
        { year: 2024, month: 4, roomRevenue: 310000000, serviceRevenue: 48000000, depositCollected: 120000000, total: 358000000, nights: 155, occ: 73, bookings: 54, adr: 2309000 },
        { year: 2024, month: 5, roomRevenue: 380000000, serviceRevenue: 62000000, depositCollected: 150000000, total: 442000000, nights: 180, occ: 81, bookings: 65, adr: 2455000 },
        { year: 2024, month: 6, roomRevenue: 440000000, serviceRevenue: 75000000, depositCollected: 175000000, total: 515000000, nights: 205, occ: 88, bookings: 72, adr: 2512000 },
        { year: 2024, month: 7, roomRevenue: 470000000, serviceRevenue: 82000000, depositCollected: 190000000, total: 552000000, nights: 220, occ: 92, bookings: 78, adr: 2509000 },
        { year: 2024, month: 8, roomRevenue: 410000000, serviceRevenue: 70000000, depositCollected: 165000000, total: 480000000, nights: 195, occ: 85, bookings: 68, adr: 2461000 },
        { year: 2024, month: 9, roomRevenue: 240000000, serviceRevenue: 35000000, depositCollected: 90000000, total: 275000000, nights: 125, occ: 60, bookings: 44, adr: 2200000 },
        { year: 2024, month: 10, roomRevenue: 260000000, serviceRevenue: 38000000, depositCollected: 100000000, total: 298000000, nights: 135, occ: 64, bookings: 48, adr: 2207000 },
        { year: 2024, month: 11, roomRevenue: 230000000, serviceRevenue: 32000000, depositCollected: 85000000, total: 262000000, nights: 120, occ: 58, bookings: 42, adr: 2183000 },
        { year: 2024, month: 12, roomRevenue: 390000000, serviceRevenue: 65000000, depositCollected: 155000000, total: 455000000, nights: 185, occ: 82, bookings: 66, adr: 2459000 },

        // 2025
        { year: 2025, month: 1, roomRevenue: 370000000, serviceRevenue: 58000000, depositCollected: 145000000, total: 428000000, nights: 180, occ: 78, bookings: 64, adr: 2377000 },
        { year: 2025, month: 2, roomRevenue: 430000000, serviceRevenue: 72000000, depositCollected: 170000000, total: 502000000, nights: 205, occ: 86, bookings: 74, adr: 2448000 },
        { year: 2025, month: 3, roomRevenue: 340000000, serviceRevenue: 50000000, depositCollected: 130000000, total: 390000000, nights: 165, occ: 72, bookings: 58, adr: 2363000 },
        { year: 2025, month: 4, roomRevenue: 400000000, serviceRevenue: 65000000, depositCollected: 155000000, total: 465000000, nights: 190, occ: 82, bookings: 68, adr: 2447000 },
        { year: 2025, month: 5, roomRevenue: 510000000, serviceRevenue: 85000000, depositCollected: 200000000, total: 595000000, nights: 230, occ: 91, bookings: 82, adr: 2586000 },
        { year: 2025, month: 6, roomRevenue: 580000000, serviceRevenue: 98000000, depositCollected: 235000000, total: 678000000, nights: 255, occ: 96, bookings: 92, adr: 2658000 },
        { year: 2025, month: 7, roomRevenue: 620000000, serviceRevenue: 105000000, depositCollected: 250000000, total: 725000000, nights: 270, occ: 98, bookings: 98, adr: 2685000 },
        { year: 2025, month: 8, roomRevenue: 540000000, serviceRevenue: 90000000, depositCollected: 215000000, total: 630000000, nights: 240, occ: 93, bookings: 86, adr: 2625000 },
        { year: 2025, month: 9, roomRevenue: 310000000, serviceRevenue: 45000000, depositCollected: 120000000, total: 355000000, nights: 150, occ: 68, bookings: 54, adr: 2366000 },
        { year: 2025, month: 10, roomRevenue: 340000000, serviceRevenue: 52000000, depositCollected: 135000000, total: 392000000, nights: 165, occ: 73, bookings: 60, adr: 2375000 },
        { year: 2025, month: 11, roomRevenue: 300000000, serviceRevenue: 42000000, depositCollected: 115000000, total: 342000000, nights: 145, occ: 65, bookings: 52, adr: 2358000 },
        { year: 2025, month: 12, roomRevenue: 530000000, serviceRevenue: 88000000, depositCollected: 210000000, total: 618000000, nights: 235, occ: 92, bookings: 84, adr: 2629000 },

        // 2026
        { year: 2026, month: 1, roomRevenue: 460000000, serviceRevenue: 75000000, depositCollected: 185000000, total: 535000000, nights: 215, occ: 85, bookings: 78, adr: 2488000 },
        { year: 2026, month: 2, roomRevenue: 530000000, serviceRevenue: 88000000, depositCollected: 210000000, total: 618000000, nights: 240, occ: 92, bookings: 88, adr: 2575000 },
        { year: 2026, month: 3, roomRevenue: 420000000, serviceRevenue: 65000000, depositCollected: 165000000, total: 485000000, nights: 195, occ: 79, bookings: 70, adr: 2487000 },
        { year: 2026, month: 4, roomRevenue: 490000000, serviceRevenue: 78000000, depositCollected: 190000000, total: 568000000, nights: 225, occ: 88, bookings: 80, adr: 2524000 },
        { year: 2026, month: 5, roomRevenue: 620000000, serviceRevenue: 105000000, depositCollected: 245000000, total: 725000000, nights: 265, occ: 95, bookings: 96, adr: 2735000 },
        { year: 2026, month: 6, roomRevenue: 710000000, serviceRevenue: 120000000, depositCollected: 280000000, total: 830000000, nights: 295, occ: 99, bookings: 108, adr: 2813000 },
        { year: 2026, month: 7, roomRevenue: 750000000, serviceRevenue: 130000000, depositCollected: 300000000, total: 880000000, nights: 310, occ: 100, bookings: 115, adr: 2838000 },
        { year: 2026, month: 8, roomRevenue: 650000000, serviceRevenue: 110000000, depositCollected: 260000000, total: 760000000, nights: 280, occ: 96, bookings: 100, adr: 2714000 },
        { year: 2026, month: 9, roomRevenue: 380000000, serviceRevenue: 60000000, depositCollected: 150000000, total: 440000000, nights: 180, occ: 75, bookings: 66, adr: 2444000 },
        { year: 2026, month: 10, roomRevenue: 410000000, serviceRevenue: 68000000, depositCollected: 165000000, total: 478000000, nights: 195, occ: 80, bookings: 72, adr: 2451000 },
        { year: 2026, month: 11, roomRevenue: 360000000, serviceRevenue: 55000000, depositCollected: 140000000, total: 415000000, nights: 175, occ: 72, bookings: 62, adr: 2371000 },
        { year: 2026, month: 12, roomRevenue: 640000000, serviceRevenue: 112000000, depositCollected: 255000000, total: 752000000, nights: 275, occ: 96, bookings: 98, adr: 2734000 }
    ];

    const sampleTransactions = [
        { id: 'TX-240108', bookingId: 'BK-2401', date: '08/01/2024 10:15', year: 2024, month: 1, customerName: 'NGUYỄN VĂN THẮNG', cccd: '001088019283', phone: '0912 345 678', roomName: 'Deluxe Ocean View', nights: 3, roomAmount: 5400000, serviceAmount: 450000, depositAmount: 2700000, totalAmount: 5850000, method: 'VietQR', status: 'Đã hoàn tất' },
        { id: 'TX-240214', bookingId: 'BK-2409', date: '14/02/2024 15:30', year: 2024, month: 2, customerName: 'VŨ HOÀNG LONG', cccd: '079093012847', phone: '0988 123 456', roomName: 'Presidential Ocean Villa', nights: 2, roomAmount: 12200000, serviceAmount: 1500000, depositAmount: 6850000, totalAmount: 13700000, method: 'Thẻ tín dụng', status: 'Đã hoàn tất' },
        { id: 'TX-240502', bookingId: 'BK-2422', date: '02/05/2024 11:20', year: 2024, month: 5, customerName: 'LÊ THỊ HỒNG NHUNG', cccd: '001192008374', phone: '0903 555 777', roomName: 'Premier Family Suite', nights: 4, roomAmount: 11800000, serviceAmount: 900000, depositAmount: 6350000, totalAmount: 12700000, method: 'VietQR', status: 'Đã hoàn tất' },
        { id: 'TX-240715', bookingId: 'BK-2445', date: '15/07/2024 09:40', year: 2024, month: 7, customerName: 'ĐẶNG TUẤN KIỆT', cccd: '036089019284', phone: '0977 888 999', roomName: 'Executive Club Suite', nights: 5, roomAmount: 17500000, serviceAmount: 2100000, depositAmount: 9800000, totalAmount: 19600000, method: 'Thẻ tín dụng', status: 'Đã hoàn tất' },
        { id: 'TX-241224', bookingId: 'BK-2488', date: '24/12/2024 18:25', year: 2024, month: 12, customerName: 'MICHAEL TRẦN', cccd: 'P89201948', phone: '0909 333 444', roomName: 'Presidential Ocean Villa', nights: 6, roomAmount: 36600000, serviceAmount: 4500000, depositAmount: 20550000, totalAmount: 41100000, method: 'VietQR', status: 'Đã hoàn tất' },
        { id: 'TX-250120', bookingId: 'BK-2503', date: '20/01/2025 14:10', year: 2025, month: 1, customerName: 'PHAN MINH CHÂU', cccd: '001095018273', phone: '0918 222 333', roomName: 'Deluxe Ocean View', nights: 3, roomAmount: 5850000, serviceAmount: 600000, depositAmount: 3225000, totalAmount: 6450000, method: 'VietQR', status: 'Đã hoàn tất' },
        { id: 'TX-250430', bookingId: 'BK-2519', date: '30/04/2025 10:45', year: 2025, month: 4, customerName: 'TRẦN QUỐC TOÀN', cccd: '079088019382', phone: '0933 444 888', roomName: 'Executive Club Suite', nights: 4, roomAmount: 14400000, serviceAmount: 1800000, depositAmount: 8100000, totalAmount: 16200000, method: 'Tiền mặt', status: 'Đã hoàn tất' },
        { id: 'TX-250618', bookingId: 'BK-2538', date: '18/06/2025 16:30', year: 2025, month: 6, customerName: 'HOÀNG THÙY DƯƠNG', cccd: '001194002938', phone: '0966 777 111', roomName: 'Presidential Ocean Villa', nights: 5, roomAmount: 30500000, serviceAmount: 3200000, depositAmount: 16850000, totalAmount: 33700000, method: 'VietQR', status: 'Đã hoàn tất' },
        { id: 'TX-250722', bookingId: 'BK-2550', date: '22/07/2025 11:15', year: 2025, month: 7, customerName: 'NGÔ BẢO CHÂU', cccd: '025091008472', phone: '0944 666 999', roomName: 'Premier Family Suite', nights: 3, roomAmount: 9300000, serviceAmount: 1100000, depositAmount: 5200000, totalAmount: 10400000, method: 'Thẻ tín dụng', status: 'Đã hoàn tất' },
        { id: 'TX-251010', bookingId: 'BK-2572', date: '10/10/2025 13:50', year: 2025, month: 10, customerName: 'ĐỖ MỸ LINH', cccd: '001196007462', phone: '0989 333 777', roomName: 'Deluxe Ocean View', nights: 2, roomAmount: 3900000, serviceAmount: 400000, depositAmount: 2150000, totalAmount: 4300000, method: 'VietQR', status: 'Đã hoàn tất' },
        { id: 'TX-251231', bookingId: 'BK-2599', date: '31/12/2025 20:00', year: 2025, month: 12, customerName: 'JONATHAN ĐẶNG', cccd: 'P90283741', phone: '0901 888 222', roomName: 'Presidential Ocean Villa', nights: 4, roomAmount: 24400000, serviceAmount: 3600000, depositAmount: 14000000, totalAmount: 28000000, method: 'VietQR', status: 'Đã hoàn tất' },
        { id: 'TX-260115', bookingId: 'BK-2602', date: '15/01/2026 10:20', year: 2026, month: 1, customerName: 'LÝ THÁI TỔ', cccd: '001090019284', phone: '0912 888 999', roomName: 'Presidential Ocean Villa', nights: 3, roomAmount: 18300000, serviceAmount: 2200000, depositAmount: 10250000, totalAmount: 20500000, method: 'Thẻ tín dụng', status: 'Đã hoàn tất' },
        { id: 'TX-260428', bookingId: 'BK-2615', date: '28/04/2026 14:15', year: 2026, month: 4, customerName: 'NGUYỄN PHƯƠNG HẰNG', cccd: '079171008273', phone: '0988 555 333', roomName: 'Executive Club Suite', nights: 4, roomAmount: 14800000, serviceAmount: 1600000, depositAmount: 8200000, totalAmount: 16400000, method: 'VietQR', status: 'Đã hoàn tất' },
        { id: 'TX-260610', bookingId: 'BK-2632', date: '10/06/2026 09:30', year: 2026, month: 6, customerName: 'BÙI TIẾN DŨNG', cccd: '038097018374', phone: '0977 444 666', roomName: 'Premier Family Suite', nights: 5, roomAmount: 15500000, serviceAmount: 1800000, depositAmount: 8650000, totalAmount: 17300000, method: 'VietQR', status: 'Đã hoàn tất' },
        { id: 'TX-260718', bookingId: 'BK-2648', date: '18/07/2026 17:00', year: 2026, month: 7, customerName: 'VƯƠNG ĐÌNH HUỆ', cccd: '001065009182', phone: '0903 999 111', roomName: 'Presidential Ocean Villa', nights: 5, roomAmount: 30500000, serviceAmount: 3800000, depositAmount: 17150000, totalAmount: 34300000, method: 'Thẻ tín dụng', status: 'Đã hoàn tất' },
        { id: 'TX-260902', bookingId: 'BK-2661', date: '02/09/2026 12:10', year: 2026, month: 9, customerName: 'TRỊNH KIM CHI', cccd: '079175002938', phone: '0919 777 555', roomName: 'Deluxe Ocean View', nights: 3, roomAmount: 5850000, serviceAmount: 750000, depositAmount: 3300000, totalAmount: 6600000, method: 'VietQR', status: 'Đã hoàn tất' }
    ];

    return { monthly, sampleTransactions };
}

export function formatVND(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
}

export function generateVietQRUrl(amount, content) {
    const cleanContent = encodeURIComponent(String(content || '').replace(/[^a-zA-Z0-9 ]/g, ''));
    return `https://img.vietqr.io/image/${HOTEL_BANK_CONFIG.bankId}-${HOTEL_BANK_CONFIG.accountNo}-${HOTEL_BANK_CONFIG.template}.png?amount=${amount}&addInfo=${cleanContent}&accountName=${encodeURIComponent(HOTEL_BANK_CONFIG.accountName)}`;
}
