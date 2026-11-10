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
    onNavigateTab,
    onSwitchActiveStaff,
    onLogout
}) {
    const activeStaff = staffUsers.find(s => s.id === activeStaffId) || staffUsers[0];
    const activeRole = rolesConfig.find(role => role.id === activeStaff?.roleId);

    return (
        <header className="admin-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
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
                        {currentUser?.name?.charAt(0) || activeStaff?.name?.charAt(0) || 'S'}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy-dark)' }}>
                            {currentUser?.name || activeStaff?.name || 'SYSADMIN'}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: activeRole?.badgeColor || 'var(--gold-dark)', fontWeight: 600 }}>
                            {activeRole?.name || currentUser?.roleName || 'Quản Trị Viên'}
                        </span>
                    </div>
                </div>

                <div className="quick-role-switcher" title="Chuyển nhanh vai trò nhân sự để kiểm tra ma trận phân quyền thực tế">
                    <i className="fa-solid fa-user-shield" style={{ color: 'var(--gold-dark)' }}></i>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Chuyển vai trò:</span>
                    <select
                        id="activeRoleSelector"
                        value={activeStaffId}
                        onChange={e => onSwitchActiveStaff(e.target.value)}
                    >
                        {staffUsers.map(s => {
                            const r = rolesConfig.find(role => role.id === s.roleId);
                            return (
                                <option key={s.id} value={s.id}>
                                    {s.name} ({r ? r.name : s.roleId})
                                </option>
                            );
                        })}
                    </select>
                </div>

                <button className="btn btn-sm btn-dark" onClick={onLogout} title="Đăng xuất khỏi hệ thống">
                    <i className="fa-solid fa-arrow-right-from-bracket"></i> Đăng xuất
                </button>
            </div>
        </header>
    );
}
