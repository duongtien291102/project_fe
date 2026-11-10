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
    onTabChange,
    onViewCustomerLanding,
    onResetDemoData,
    checkPermission
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
        { id: 'dashboard', label: 'Dashboard Doanh Thu (3 Năm)', icon: 'fa-chart-line', perm: 'view_kpi' },
        { id: 'rooms-management', label: 'Quản Lý Phòng', icon: 'fa-door-open', perm: null },
        { id: 'bookings-management', label: 'Quản Lý Đặt Phòng & CCCD', icon: 'fa-book-bookmark', perm: 'manage_bookings' },
        { id: 'financial-ledger', label: 'Sổ Quỹ & Thu Chi', icon: 'fa-money-check-dollar', perm: 'manage_finances' },
        { id: 'users-management', label: 'Quản Trị Viên & Nhân Sự', icon: 'fa-user-shield', perm: 'view_staff' },
        { id: 'permissions-config', label: 'Cấu Hình Phân Quyền', icon: 'fa-shield-halved', perm: 'config_permissions' }
    ];

    const visibleNavItems = navItems.filter(canAccessTab);
    const canResetSystem = checkPermission ? checkPermission('system_reset') : true;

    return (
        <aside className="admin-sidebar" id="adminSidebar">
            <div className="admin-brand">
                <i className="fa-solid fa-crown"></i>
                <div className="admin-brand-info">
                    <h3>GRAND HOTEL</h3>
                    <span>Quản Trị Khách Sạn</span>
                </div>
            </div>

            <ul className="admin-nav">
                {visibleNavItems.map(item => {
                    const isActive = adminTab === item.id;
                    return (
                        <li
                            key={item.id}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                            onClick={() => onTabChange(item.id)}
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
                    style={{ width: '100%', fontSize: '0.85rem', marginBottom: canResetSystem ? '10px' : '0' }}
                    onClick={onViewCustomerLanding}
                >
                    <i className="fa-solid fa-arrow-left"></i> Xem Trang Khách
                </button>
                {canResetSystem && (
                    <button
                        className="btn btn-dark"
                        style={{ width: '100%', fontSize: '0.85rem', border: '1px solid rgba(255,255,255,0.15)' }}
                        onClick={onResetDemoData}
                    >
                        <i className="fa-solid fa-rotate"></i> Reset Dữ Liệu Gốc
                    </button>
                )}
            </div>
        </aside>
    );
}
