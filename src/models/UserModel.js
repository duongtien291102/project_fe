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

// Zero-Mock: Dữ liệu vai trò và nhân sự khởi tạo rỗng, 100% nạp từ MongoDB Atlas
export const INITIAL_ROLES = [];

export const INITIAL_STAFF_USERS = [];

export function hasPermission(staffUser, rolesConfig, permKey) {
    if (!staffUser) return false;
    const role = rolesConfig.find(r => r.id === staffUser.roleId)
        || rolesConfig.find(r => Array.isArray(staffUser.roles) && staffUser.roles.includes(r.id));
    if (role && role.permissions && role.permissions[permKey] !== undefined) {
        return !!role.permissions[permKey];
    }
    if (staffUser.effectivePermissions && staffUser.effectivePermissions[permKey] !== undefined) {
        return !!staffUser.effectivePermissions[permKey];
    }
    return false;
}

export function hasAdminAccess(user, staffUsers, rolesConfig) {
    if (!user) return false;
    if (user.role === 'customer' && !user.hasAdminAccess) return false;
    const staff = staffUsers.find(s =>
        (s.id === user.id || s.id === user.staffId || s.email === user.email) &&
        s.status === 'active'
    );
    if (!staff) return false;
    const role = rolesConfig.find(r => r.id === staff.roleId)
        || rolesConfig.find(r => Array.isArray(staff.roles) && staff.roles.includes(r.id));
    return !!(role && role.permissions && Object.values(role.permissions).some(Boolean));
}
