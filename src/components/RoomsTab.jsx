import React, { useState } from 'react';
import { formatVND } from '../constants/initialData.js';

export default function RoomsTab({
    rooms,
    checkPermission,
    onOpenNewRoomModal,
    onQuickCheckIn,
    onConfirmCheckIn,
    onOpenCheckoutModal,
    onCompleteCleaning
}) {
    const [searchVal, setSearchVal] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const canCheckInOut = checkPermission('room_checkin_checkout');
    const canClean = checkPermission('room_cleaning');
    const canManageRooms = checkPermission('manage_rooms');

    const filteredRooms = rooms.filter(room => {
        const matchSearch = room.id.includes(searchVal) ||
                            room.name.toLowerCase().includes(searchVal.toLowerCase()) ||
                            room.type.toLowerCase().includes(searchVal.toLowerCase());
        const matchStatus = statusFilter === 'ALL' || room.status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <div id="rooms-management" className="admin-page-panel active">
            <div className="table-card">
                <div className="table-header-box">
                    <div>
                        <h3 className="table-title">Danh Sách Quản Lý Trạng Thái Phòng</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Thực hiện Check-in / Trả phòng ngay tại danh sách (React State)
                        </p>
                    </div>
                    <div className="room-filter-bar">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Tìm số phòng / loại phòng..."
                            value={searchVal}
                            onChange={e => setSearchVal(e.target.value)}
                        />
                        <select
                            className="search-input"
                            style={{ width: '170px' }}
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                        >
                            <option value="ALL">Tất cả trạng thái</option>
                            <option value="Trống">Trống (Sẵn sàng)</option>
                            <option value="Đang thuê">Đang thuê</option>
                            <option value="Đã đặt">Đã đặt</option>
                            <option value="Đang dọn">Đang dọn</option>
                        </select>
                        {canManageRooms && (
                            <button className="btn btn-sm btn-gold" onClick={onOpenNewRoomModal}>
                                <i className="fa-solid fa-plus"></i> Thêm Phòng Mới
                            </button>
                        )}
                    </div>
                </div>

                <div className="data-table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Mã Phòng</th>
                                <th>Hạng Phòng</th>
                                <th>Giá / Đêm</th>
                                <th>Khách Đang Ở</th>
                                <th>Trạng Thái</th>
                                <th>Hành Động Trực Tiếp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRooms.map(room => {
                                let badgeClass = 'badge-available';
                                if (room.status === 'Đang thuê') badgeClass = 'badge-occupied';
                                if (room.status === 'Đã đặt') badgeClass = 'badge-reserved';
                                if (room.status === 'Đang dọn') badgeClass = 'badge-cleaning';

                                let actionNode;
                                if (room.status === 'Trống') {
                                    actionNode = canCheckInOut ? (
                                        <button className="btn btn-sm btn-emerald" onClick={() => onQuickCheckIn(room.id)}>
                                            <i className="fa-solid fa-user-plus"></i> Check-in
                                        </button>
                                    ) : (
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sẵn sàng</span>
                                    );
                                } else if (room.status === 'Đã đặt') {
                                    actionNode = canCheckInOut ? (
                                        <button className="btn btn-sm btn-blue" onClick={() => onConfirmCheckIn(room.id)}>
                                            <i className="fa-solid fa-key"></i> Giao Chìa Khóa
                                        </button>
                                    ) : (
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Chờ khách</span>
                                    );
                                } else if (room.status === 'Đang thuê') {
                                    actionNode = canCheckInOut ? (
                                        <button className="btn btn-sm btn-gold" onClick={() => onOpenCheckoutModal(room.id)}>
                                            <i className="fa-solid fa-receipt"></i> Trả Phòng & Bill
                                        </button>
                                    ) : (
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Đang lưu trú</span>
                                    );
                                } else if (room.status === 'Đang dọn') {
                                    actionNode = canClean ? (
                                        <button className="btn btn-sm btn-dark" onClick={() => onCompleteCleaning(room.id)}>
                                            <i className="fa-solid fa-sparkles"></i> Đã Dọn Xong
                                        </button>
                                    ) : (
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Đang dọn phòng</span>
                                    );
                                }

                                return (
                                    <tr key={room.id}>
                                        <td>
                                            <strong style={{ fontSize: '1.05rem' }}>
                                                <i className="fa-solid fa-key" style={{ color: 'var(--gold-dark)', marginRight: '5px' }}></i>
                                                {room.id}
                                            </strong>
                                        </td>
                                        <td>
                                            {room.name} <br /><small style={{ color: 'var(--text-muted)' }}>{room.type}</small>
                                        </td>
                                        <td>{formatVND(room.price)}</td>
                                        <td>
                                            {room.currentGuest ? (
                                                <strong>{room.currentGuest}</strong>
                                            ) : (
                                                <span style={{ color: 'var(--text-muted)' }}>---</span>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`status-badge ${badgeClass}`}>
                                                <span className="status-dot"></span> {room.status}
                                            </span>
                                        </td>
                                        <td>{actionNode}</td>
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
