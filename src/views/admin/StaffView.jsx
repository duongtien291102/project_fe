/**
 * ============================================================================
 * VIEW: StaffView
 * ============================================================================
 * Danh sách nhân sự, phân gán vai trò và quản lý tài khoản nội bộ.
 * Chỉ hiển thị nút thêm và cột thao tác khi có quyền manage_staff.
 */

import React, { useState } from 'react';

export default function StaffView({
    staffUsers,
    rolesConfig,
    checkPermission,
    onOpenAddStaffModal,
    onOpenEditStaffModal,
    onToggleStaffStatus,
    onDeleteStaffUser
}) {
    const [searchVal, setSearchVal] = useState('');
    const [filterRoleId, setFilterRoleId] = useState('ALL');

    const canManageStaff = checkPermission('manage_staff');

    const filteredStaff = staffUsers.filter(s => {
        const sName = (s.name || s.fullName || s.username || '').toLowerCase();
        const sEmail = (s.email || '').toLowerCase();
        const sId = (s.id || '').toLowerCase();
        const sRoleId = s.roleId || (Array.isArray(s.roles) && s.roles[0]) || '';
        const matchSearch = sName.includes(searchVal.toLowerCase()) ||
                            sEmail.includes(searchVal.toLowerCase()) ||
                            sId.includes(searchVal.toLowerCase());
        const matchRole = filterRoleId === 'ALL' || sRoleId === filterRoleId;
        return matchSearch && matchRole;
    });

    return (
        <div id="users-management" className="admin-page-panel active">
            <div className="table-card">
                <div className="table-header-box">
                    <div>
                        <h3 className="table-title">Danh Sách Quản Trị Viên & Nhân Sự Nội Bộ</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Quản lý tài khoản quản trị viên, nhân sự và phân gán vai trò quyền hạn (MVC Architecture)
                        </p>
                    </div>
                    <div className="room-filter-bar">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Tìm tên nhân viên..."
                            value={searchVal}
                            onChange={e => setSearchVal(e.target.value)}
                        />
                        <select
                            className="search-input"
                            style={{ width: '190px' }}
                            value={filterRoleId}
                            onChange={e => setFilterRoleId(e.target.value)}
                        >
                            <option value="ALL">Tất cả vai trò</option>
                            {rolesConfig.map(r => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                        {canManageStaff && (
                            <button className="btn btn-sm btn-gold" onClick={onOpenAddStaffModal}>
                                <i className="fa-solid fa-user-plus"></i> Thêm Nhân Viên Mới
                            </button>
                        )}
                    </div>
                </div>

                <div className="data-table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Mã NV / Họ Tên</th>
                                <th>Email & Số Điện Thoại</th>
                                <th>Vai Trò (Role)</th>
                                <th>Đăng Nhập Cuối</th>
                                <th>Trạng Thái</th>
                                {canManageStaff && <th>Thao Tác</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStaff.map(s => {
                                const sName = s.name || s.fullName || s.username || s.id || 'Nhân sự';
                                const sRoleId = s.roleId || (Array.isArray(s.roles) && s.roles[0]) || '';
                                const role = rolesConfig.find(r => r.id === sRoleId || (Array.isArray(s.roles) && s.roles.includes(r.id))) || { name: sRoleId || 'Nhân sự', badgeColor: '#64748b' };
                                const isLocked = s.status === 'locked';

                                return (
                                    <tr key={s.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div
                                                    className="user-avatar"
                                                    style={{ background: role.badgeColor, color: '#fff', width: '34px', height: '34px' }}
                                                >
                                                    {sName.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <strong style={{ color: 'var(--navy-dark)' }}>{sName}</strong>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                                                        {s.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <i className="fa-regular fa-envelope" style={{ color: 'var(--text-muted)', marginRight: '5px' }}></i>
                                                {s.email || '---'}
                                            </div>
                                            <small style={{ color: 'var(--text-muted)' }}>
                                                <i className="fa-solid fa-phone" style={{ marginRight: '5px' }}></i>
                                                {s.phone || '---'}
                                            </small>
                                        </td>
                                        <td>
                                            <span className="role-pill" style={{ backgroundColor: role.badgeColor }}>
                                                <i className="fa-solid fa-shield-cat"></i> {role.name}
                                            </span>
                                        </td>
                                        <td><small style={{ color: 'var(--text-secondary)' }}>{s.lastLogin || 'Chưa đăng nhập'}</small></td>
                                        <td>
                                            <span className={`status-badge ${isLocked ? 'badge-locked' : 'badge-active'}`}>
                                                <span className="status-dot"></span> {isLocked ? 'Đã khóa' : 'Hoạt động'}
                                            </span>
                                        </td>
                                        {canManageStaff && (
                                            <td>
                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                    <button
                                                        className="btn btn-sm btn-outline-gold"
                                                        onClick={() => onOpenEditStaffModal(s)}
                                                        title="Sửa"
                                                    >
                                                        <i className="fa-solid fa-pen"></i>
                                                    </button>
                                                    <button
                                                        className={`btn btn-sm ${isLocked ? 'btn-emerald' : 'btn-dark'}`}
                                                        onClick={() => onToggleStaffStatus(s.id)}
                                                        title={isLocked ? 'Mở khóa' : 'Khóa'}
                                                    >
                                                        <i className={`fa-solid ${isLocked ? 'fa-lock-open' : 'fa-lock'}`}></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => onDeleteStaffUser(s.id)}
                                                        title="Xóa"
                                                    >
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
