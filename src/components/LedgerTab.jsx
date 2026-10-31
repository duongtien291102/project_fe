import React, { useState } from 'react';
import { formatVND } from '../constants/initialData.js';

export default function LedgerTab({
    transactions,
    bookings,
    checkPermission,
    onOpenManualTxModal
}) {
    const [searchVal, setSearchVal] = useState('');
    const [methodFilter, setMethodFilter] = useState('ALL');

    const totalCollected = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
    const vietQrTxs = transactions.filter(t => t.method === 'VietQR');
    const cashTxs = transactions.filter(t => t.method === 'Tiền mặt');
    const totalDepositHolding = bookings.filter(b => b.status === 'Chờ check-in' || b.status === 'Đã check-in')
                                        .reduce((sum, b) => sum + (b.depositAmount || 0), 0);

    const filtered = transactions.filter(t => {
        const matchSearch = t.id.toLowerCase().includes(searchVal.toLowerCase()) ||
                            t.bookingId.toLowerCase().includes(searchVal.toLowerCase()) ||
                            t.customerName.toLowerCase().includes(searchVal.toLowerCase());
        const matchMethod = methodFilter === 'ALL' || t.method === methodFilter;
        return matchSearch && matchMethod;
    });

    return (
        <div id="financial-ledger" className="admin-page-panel active">
            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-info">
                        <h4>Tổng Thực Thu Đã Vào Két</h4>
                        <div className="kpi-val" style={{ color: 'var(--success)' }}>
                            {formatVND(totalCollected)}
                        </div>
                        <div className="kpi-sub">Bao gồm cọc & quyết toán</div>
                    </div>
                    <div className="kpi-icon-box" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
                        <i className="fa-solid fa-vault"></i>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-info">
                        <h4>Chuyển Khoản Qua VietQR</h4>
                        <div className="kpi-val" style={{ color: '#0284c7' }}>
                            {formatVND(vietQrTxs.reduce((s, t) => s + t.amount, 0))}
                        </div>
                        <div className="kpi-sub">{vietQrTxs.length} giao dịch QR thành công</div>
                    </div>
                    <div className="kpi-icon-box" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                        <i className="fa-solid fa-qrcode"></i>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-info">
                        <h4>Tiền Mặt Thu Tại Quầy</h4>
                        <div className="kpi-val" style={{ color: 'var(--gold-dark)' }}>
                            {formatVND(cashTxs.reduce((s, t) => s + t.amount, 0))}
                        </div>
                        <div className="kpi-sub">{cashTxs.length} lần thu tiền mặt</div>
                    </div>
                    <div className="kpi-icon-box" style={{ background: 'var(--gold-light)', color: 'var(--gold-dark)' }}>
                        <i className="fa-solid fa-money-bill-wave"></i>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-info">
                        <h4>Tiền Cọc Đang Giữ Chờ Check-in</h4>
                        <div className="kpi-val" style={{ color: 'var(--purple)' }}>
                            {formatVND(totalDepositHolding)}
                        </div>
                        <div className="kpi-sub">Sẽ trừ khi khách trả phòng</div>
                    </div>
                    <div className="kpi-icon-box" style={{ background: 'var(--purple-light)', color: 'var(--purple)' }}>
                        <i className="fa-solid fa-hand-holding-dollar"></i>
                    </div>
                </div>
            </div>

            <div className="table-card">
                <div className="table-header-box">
                    <div>
                        <h3 className="table-title">Nhật Ký Giao Dịch Tiền Tệ Chi Tiết</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Ghi nhận tự động tất cả các dòng tiền thu cọc, VietQR và tiền mặt
                        </p>
                    </div>
                    <div className="room-filter-bar">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Tìm mã đơn, tên khách..."
                            value={searchVal}
                            onChange={e => setSearchVal(e.target.value)}
                        />
                        <select
                            className="search-input"
                            style={{ width: '190px' }}
                            value={methodFilter}
                            onChange={e => setMethodFilter(e.target.value)}
                        >
                            <option value="ALL">Tất cả phương thức</option>
                            <option value="VietQR">Chuyển khoản VietQR</option>
                            <option value="Tiền mặt">Tiền mặt tại quầy</option>
                            <option value="Thẻ tín dụng">Thẻ tín dụng / POS</option>
                        </select>
                        <button className="btn btn-sm btn-gold" onClick={onOpenManualTxModal}>
                            <i className="fa-solid fa-plus"></i> Thu Tiền Trực Tiếp
                        </button>
                    </div>
                </div>

                <div className="data-table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Mã Giao Dịch</th>
                                <th>Mã Đơn / Khách Hàng</th>
                                <th>Nội Dung Thu Tiền</th>
                                <th>Phương Thức</th>
                                <th>Số Tiền Thu</th>
                                <th>Thời Gian Ghi Nhận</th>
                                <th>Nhân Viên Thu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(t => {
                                let methodBadge = (
                                    <span className="status-badge" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                                        <i className="fa-solid fa-qrcode"></i> VietQR
                                    </span>
                                );
                                if (t.method === 'Tiền mặt') {
                                    methodBadge = (
                                        <span className="status-badge" style={{ background: 'var(--gold-light)', color: 'var(--gold-dark)' }}>
                                            <i className="fa-solid fa-money-bill-wave"></i> Tiền mặt
                                        </span>
                                    );
                                } else if (t.method === 'Thẻ tín dụng') {
                                    methodBadge = (
                                        <span className="status-badge" style={{ background: 'var(--purple-light)', color: 'var(--purple)' }}>
                                            <i className="fa-regular fa-credit-card"></i> Thẻ POS
                                        </span>
                                    );
                                }

                                return (
                                    <tr key={t.id}>
                                        <td><strong>{t.id}</strong></td>
                                        <td>
                                            <strong>{t.customerName}</strong><br />
                                            <small style={{ color: 'var(--text-muted)' }}>{t.bookingId}</small>
                                        </td>
                                        <td>{t.type}</td>
                                        <td>{methodBadge}</td>
                                        <td>
                                            <strong style={{ color: 'var(--success)', fontSize: '1rem' }}>
                                                + {formatVND(t.amount)}
                                            </strong>
                                        </td>
                                        <td><small style={{ color: 'var(--text-secondary)' }}>{t.date}</small></td>
                                        <td><small style={{ fontWeight: 600, color: 'var(--navy-dark)' }}>{t.staff}</small></td>
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
