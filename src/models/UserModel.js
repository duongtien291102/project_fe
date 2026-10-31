/**
 * ============================================================================
 * MODEL: UserModel
 * ============================================================================
 * Định nghĩa thực thể người dùng, nhân sự, nhóm quyền và ma trận phân quyền (RBAC)
 */

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

export function hasPermission(staffUser, rolesConfig, permKey) {
    if (!staffUser) return false;
    const role = rolesConfig.find(r => r.id === staffUser.roleId);
    return !!(role && role.permissions && role.permissions[permKey]);
}
