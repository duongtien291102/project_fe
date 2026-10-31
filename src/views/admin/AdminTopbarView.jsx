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
    onSwitchActiveStaff,
    onLogout
}) {
    return (
        <header className="admin-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <h2 className="topbar-title" id="adminHeaderTitle">{title}</h2>
            </div>

            <div className="topbar-actions">
                <div className="quick-role-switcher" title="Chuyển nhanh tài khoản để kiểm tra phân quyền thực tế">
                    <i className="fa-solid fa-user-shield" style={{ color: 'var(--gold-dark)' }}></i>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Vai trò:</span>
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
