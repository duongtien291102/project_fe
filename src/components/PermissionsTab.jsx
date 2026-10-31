import React from 'react';

export default function PermissionsTab({
    rolesConfig,
    setRolesConfig,
    permissionGroups,
    onOpenNewRoleModal,
    onResetRolesMatrix,
    onSavePermissions
}) {
    const handleCheckboxChange = (roleId, permKey) => {
        setRolesConfig(prev =>
            prev.map(role => {
                if (role.id === roleId) {
                    const currentPerms = role.permissions || {};
                    return {
                        ...role,
                        permissions: {
                            ...currentPerms,
                            [permKey]: !currentPerms[permKey]
                        }
                    };
                }
                return role;
            })
        );
    };

    return (
        <div id="permissions-config" className="admin-page-panel active">
            <div className="table-card">
                <div className="table-header-box">
                    <div>
                        <h3 className="table-title">Ma Trận Cấu Hình Phân Quyền Hệ Thống</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Tùy chỉnh phân quyền chi tiết cho từng vai trò chức danh (React State Driven)
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button className="btn btn-sm btn-outline-gold" onClick={onOpenNewRoleModal}>
                            <i className="fa-solid fa-plus"></i> Tạo Vai Trò Mới
                        </button>
                        <button className="btn btn-sm btn-dark" onClick={onResetRolesMatrix}>
                            <i className="fa-solid fa-arrow-rotate-left"></i> Khôi Phục Gốc
                        </button>
                        <button className="btn btn-sm btn-gold" onClick={onSavePermissions}>
                            <i className="fa-solid fa-floppy-disk"></i> Lưu Cấu Hình
                        </button>
                    </div>
                </div>

                <div className="data-table-wrap">
                    <table className="matrix-table" id="permissionsMatrixTable">
                        <thead>
                            <tr>
                                <th>Nhóm Chức Năng & Quyền Hạn</th>
                                {rolesConfig.map(r => (
                                    <th key={r.id} style={{ minWidth: '140px', textAlign: 'center' }}>
                                        <span className="role-pill" style={{ background: r.badgeColor, marginBottom: '4px' }}>
                                            {r.name}
                                        </span>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'none', fontWeight: 'normal' }}>
                                            {r.id}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {permissionGroups.map((group, gIdx) => (
                                <React.Fragment key={gIdx}>
                                    <tr className="matrix-group-row">
                                        <td colSpan={rolesConfig.length + 1}>
                                            <i className="fa-solid fa-folder-tree" style={{ marginRight: '8px', color: 'var(--gold-dark)' }}></i>
                                            {group.groupName}
                                        </td>
                                    </tr>
                                    {group.permissions.map(perm => (
                                        <tr key={perm.key}>
                                            <td>
                                                <span className="perm-title">{perm.label}</span>
                                                <span className="perm-desc">{perm.desc}</span>
                                            </td>
                                            {rolesConfig.map(r => {
                                                const isChecked = !!(r.permissions && r.permissions[perm.key]);
                                                return (
                                                    <td key={r.id} style={{ textAlign: 'center' }}>
                                                        <input
                                                            type="checkbox"
                                                            className="perm-checkbox"
                                                            checked={isChecked}
                                                            onChange={() => handleCheckboxChange(r.id, perm.key)}
                                                        />
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
