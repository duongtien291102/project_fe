import React from 'react';
import { formatVND } from '../constants/initialData.js';

export default function BookingsTab({
    bookings,
    checkPermission,
    onQuickWalkInBooking,
    onOpenCccdView,
    onConfirmCheckIn,
    onOpenCheckoutModal,
    onCancelBooking
}) {
    const canCheckInOut = checkPermission('room_checkin_checkout');
    const canCancel = checkPermission('cancel_booking');
    const canViewRev = checkPermission('view_revenue');
    const canCreateBooking = checkPermission('create_booking');

    return (
        <div id="bookings-management" className="admin-page-panel active">
            <div className="table-card">
                <div className="table-header-box">
                    <div>
                        <h3 className="table-title">Quản Lý Toàn Bộ Đơn Đặt Phòng & Định Danh CCCD</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Theo dõi tiền cọc, xem chi tiết CCCD & ảnh mặt trước/sau để khai báo tạm trú
                        </p>
                    </div>
                    {canCreateBooking && (
                        <button className="btn btn-gold btn-sm" onClick={onQuickWalkInBooking}>
                            <i className="fa-solid fa-plus"></i> Tạo Đơn Đặt Trực Tiếp (Walk-in)
                        </button>
                    )}
                </div>

                <div className="data-table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Mã Đơn</th>
                                <th>Khách Hàng</th>
                                <th>Số CCCD / Hộ Chiếu</th>
                                <th>Hồ Sơ CCCD</th>
                                <th>Phòng</th>
                                <th>Tổng Tiền</th>
                                <th>Đã Cọc</th>
                                <th>Còn Lại</th>
                                <th>Trạng Thái</th>
                                <th>Xử Lý</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(b => {
                                let badgeClass = 'badge-reserved';
                                if (b.status === 'Đã check-in') badgeClass = 'badge-occupied';
                                if (b.status === 'Đã hoàn thành') badgeClass = 'badge-available';
                                if (b.status === 'Đã hủy') badgeClass = 'badge-cleaning';

                                let actionNode;
                                if (b.status === 'Chờ check-in') {
                                    actionNode = (
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            {canCheckInOut && (
                                                <button className="btn btn-sm btn-blue" onClick={() => onConfirmCheckIn(b.roomId)}>
                                                    <i className="fa-solid fa-check"></i> Check-in
                                                </button>
                                            )}
                                            {canCancel && (
                                                <button className="btn btn-sm btn-dark" onClick={() => onCancelBooking(b.id)} title="Hủy đơn">
                                                    <i className="fa-solid fa-xmark"></i>
                                                </button>
                                            )}
                                        </div>
                                    );
                                } else if (b.status === 'Đã check-in') {
                                    actionNode = canCheckInOut ? (
                                        <button className="btn btn-sm btn-gold" onClick={() => onOpenCheckoutModal(b.roomId)}>
                                            <i className="fa-solid fa-receipt"></i> Trả Phòng & Thu Tiền
                                        </button>
                                    ) : (
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Đang ở</span>
                                    );
                                } else {
                                    actionNode = (
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                            <i className="fa-solid fa-check-double"></i> Đã hoàn tất
                                        </span>
                                    );
                                }

                                return (
                                    <tr key={b.id}>
                                        <td><strong>{b.id}</strong></td>
                                        <td>
                                            <strong>{b.customerName}</strong><br />
                                            <small style={{ color: 'var(--text-muted)' }}>{b.phone}</small>
                                        </td>
                                        <td>
                                            <strong style={{ color: 'var(--navy-dark)', letterSpacing: '0.5px' }}>
                                                {b.cccd || '---'}
                                            </strong>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-gold"
                                                onClick={() => onOpenCccdView(b)}
                                                title="Xem CCCD và ảnh 2 mặt"
                                            >
                                                <i className="fa-solid fa-id-card"></i> Xem CCCD
                                            </button>
                                        </td>
                                        <td>Phòng {b.roomId}</td>
                                        <td>
                                            <strong style={{ color: 'var(--gold-dark)' }}>
                                                {canViewRev ? formatVND(b.totalAmount) : '***'}
                                            </strong>
                                        </td>
                                        <td>
                                            <span className="status-badge badge-deposit">
                                                {canViewRev ? formatVND(b.depositAmount) : '***'}
                                            </span>
                                        </td>
                                        <td>
                                            <strong style={{ color: 'var(--danger)' }}>
                                                {canViewRev ? formatVND(b.remainingAmount) : '***'}
                                            </strong>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${badgeClass}`}>
                                                <span className="status-dot"></span> {b.status}
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
