/**
 * ============================================================================
 * VIEW: AdminTopbarView
 * ============================================================================
 * Thanh công cụ phía trên của trang quản trị: Tiêu đề, chọn nhanh vai trò & đăng xuất
 */

import React from 'react';

export default function AdminTopbarView({
    title,
    staffUsers,
    rolesConfig,
    activeStaffId,
    currentUser,
    isSysAdminUser,
    onNavigateTab,
    onSwitchActiveStaff,
    onToggleSidebar
}) {
    const canSwitchRoles = Boolean(
        isSysAdminUser ||
        currentUser?.roleId === 'ROLE_SYSADMIN' ||
        (Array.isArray(currentUser?.roles) && currentUser.roles.includes('ROLE_SYSADMIN'))
    );
    const activeStaff = (canSwitchRoles && staffUsers.find(s => s.id === activeStaffId)) || currentUser || staffUsers[0];
    const activeStaffName = activeStaff?.name || activeStaff?.fullName || activeStaff?.username || '';
    const activeStaffRoleId = activeStaff?.roleId || (Array.isArray(activeStaff?.roles) && activeStaff.roles[0]) || '';
    const activeRole = rolesConfig.find(role => role.id === activeStaffRoleId || (Array.isArray(activeStaff?.roles) && activeStaff.roles.includes(role.id)));

    return (
        <header className="admin-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                <button
                    className="admin-menu-toggle"
                    onClick={onToggleSidebar}
                    title="Mở menu quản trị"
                    aria-label="Toggle menu"
                >
                    <i className="fa-solid fa-bars"></i>
                </button>
                <h2 className="topbar-title" id="adminHeaderTitle">{title}</h2>
            </div>

            <div className="topbar-actions">
                {/* Thẻ định danh tài khoản Quản trị / Sysadmin */}
                <div
                    className="admin-user-pill"
                    onClick={() => onNavigateTab && onNavigateTab('users-management')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '6px 14px',
                        background: '#f8fafc',
                        border: '1.5px solid var(--gold-primary)',
                        borderRadius: '30px',
                        boxShadow: '0 2px 8px rgba(212, 175, 55, 0.15)',
                        cursor: 'pointer'
                    }}
                    title="Bấm để mở trang Danh sách Quản Trị Viên & Nhân Sự"
                >
                    <div
                        className="user-avatar"
                        style={{
                            width: '32px',
                            height: '32px',
                            background: activeRole?.badgeColor || 'var(--gold-primary)',
                            color: '#ffffff',
                            fontWeight: 700,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.85rem'
                        }}
                    >
                        {(currentUser?.name || currentUser?.fullName || activeStaffName || 'Q').charAt(0).toUpperCase()}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy-dark)' }}>
                            {currentUser?.name || currentUser?.fullName || currentUser?.username || activeStaffName || 'Quản Trị Viên'}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: activeRole?.badgeColor || 'var(--gold-dark)', fontWeight: 600 }}>
                            {activeRole?.name || currentUser?.roleName || activeStaffRoleId || 'Quản Trị Viên'}
                        </span>
                    </div>
                </div>

                {canSwitchRoles ? (
                    <div className="quick-role-switcher" title="Chuyển vai trò nhân sự để kiểm tra ma trận phân quyền thực tế">
                        <i className="fa-solid fa-user-shield" style={{ color: 'var(--gold-dark)' }}></i>
                        <select
                            id="activeRoleSelector"
                            value={activeStaffId}
                            onChange={e => onSwitchActiveStaff(e.target.value)}
                        >
                            {staffUsers.map(s => {
                                const sRoleId = s.roleId || (Array.isArray(s.roles) && s.roles[0]) || '';
                                const r = rolesConfig.find(role => role.id === sRoleId || (Array.isArray(s.roles) && s.roles.includes(role.id)));
                                const sName = s.name || s.fullName || s.username || s.id;
                                return (
                                    <option key={s.id} value={s.id}>
                                        {sName} ({r ? r.name : (sRoleId || 'Nhân sự')})
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                ) : (
                    <div className="quick-role-switcher" style={{ cursor: 'default' }} title="Vai trò làm việc hiện tại">
                        <i className="fa-solid fa-user-shield" style={{ color: 'var(--gold-dark)' }}></i>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy-dark)' }}>
                            {activeRole?.name || currentUser?.roleName || activeStaffRoleId || 'Nhân sự'}
                        </span>
                    </div>
                )}
            </div>
        </header>
    );
}
