/**
 * ============================================================================
 * VIEW: AdminSidebarView
 * ============================================================================
 * Thanh sidebar điều hướng cho khu vực quản trị Admin.
 * Chỉ hiển thị các chức năng/menu mà vai trò hiện tại được cấp quyền (RBAC).
 */

import React from 'react';

export default function AdminSidebarView({
    adminTab,
    isSidebarOpen,
    onCloseSidebar,
    onTabChange,
    onViewCustomerLanding,
    onResetDemoData,
    checkPermission,
    onLogout
}) {
    const canAccessTab = item => {
        if (!checkPermission) return true;
        switch (item.id) {
            case 'dashboard':
                return checkPermission('view_kpi') || checkPermission('view_revenue');
            case 'rooms-management':
                return checkPermission('manage_rooms') || checkPermission('room_checkin_checkout') || checkPermission('room_cleaning');
            case 'bookings-management':
                return checkPermission('manage_bookings');
            case 'financial-ledger':
                return checkPermission('manage_finances');
            case 'users-management':
                return checkPermission('view_staff') || checkPermission('manage_staff');
            case 'permissions-config':
                return checkPermission('config_permissions');
            default:
                return !item.perm || checkPermission(item.perm);
        }
    };

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line', perm: 'view_kpi' },
        { id: 'rooms-management', label: 'Quản Lý Phòng', icon: 'fa-door-open', perm: null },
        { id: 'bookings-management', label: 'Quản Lý Đặt Phòng & CCCD', icon: 'fa-book-bookmark', perm: 'manage_bookings' },
        { id: 'financial-ledger', label: 'Sổ Quỹ & Thu Chi', icon: 'fa-money-check-dollar', perm: 'manage_finances' },
        { id: 'users-management', label: 'Quản Trị Viên & Nhân Sự', icon: 'fa-user-shield', perm: 'view_staff' },
        { id: 'permissions-config', label: 'Cấu Hình Phân Quyền', icon: 'fa-shield-halved', perm: 'config_permissions' }
    ];

    const visibleNavItems = navItems.filter(canAccessTab);
    const canResetSystem = checkPermission ? checkPermission('system_reset') : true;

    return (
        <aside className={`admin-sidebar ${isSidebarOpen ? 'show-mobile' : ''}`} id="adminSidebar">
            <div className="admin-brand">
                <i className="fa-solid fa-crown"></i>
                <div className="admin-brand-info">
                    <h3>GRAND HOTEL</h3>
                    <span>Quản Trị Khách Sạn</span>
                </div>
                <button
                    className="admin-sidebar-close"
                    onClick={onCloseSidebar}
                    title="Đóng thanh điều hướng"
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>

            <ul className="admin-nav">
                {visibleNavItems.map(item => {
                    const isActive = adminTab === item.id;
                    return (
                        <li
                            key={item.id}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                            onClick={() => {
                                onTabChange(item.id);
                                if (onCloseSidebar) onCloseSidebar();
                            }}
                        >
                            <i className={`fa-solid ${item.icon}`}></i>
                            <span>{item.label}</span>
                        </li>
                    );
                })}
            </ul>

            <div className="sidebar-bottom">
                <button
                    className="btn btn-outline-gold"
                    style={{ width: '100%', fontSize: '0.85rem', marginBottom: '8px' }}
                    onClick={onViewCustomerLanding}
                >
                    <i className="fa-solid fa-arrow-left"></i> Xem Trang Khách
                </button>
                {canResetSystem && (
                    <button
                        className="btn btn-dark"
                        style={{ width: '100%', fontSize: '0.85rem', marginBottom: '8px', border: '1px solid rgba(255,255,255,0.15)' }}
                        onClick={onResetDemoData}
                    >
                        <i className="fa-solid fa-rotate"></i> Reset Dữ Liệu Gốc
                    </button>
                )}
                <button
                    className="btn"
                    style={{
                        width: '100%',
                        fontSize: '0.85rem',
                        background: 'rgba(239, 68, 68, 0.12)',
                        color: '#f87171',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontWeight: 600,
                        padding: '9px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = '#dc2626';
                        e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)';
                        e.currentTarget.style.color = '#f87171';
                    }}
                    onClick={onLogout}
                    title="Đăng xuất khỏi hệ thống"
                >
                    <i className="fa-solid fa-arrow-right-from-bracket"></i> Đăng Xuất
                </button>
            </div>
        </aside>
    );
}
