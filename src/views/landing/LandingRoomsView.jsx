/**
 * ============================================================================
 * VIEW: LandingRoomsView
 * ============================================================================
 * Bộ lọc danh mục phòng nghỉ và danh sách thẻ phòng khách sạn 5 sao
 */

import React from 'react';
import { formatVND } from '../../models/TransactionModel.js';

export default function LandingRoomsView({
    rooms,
    currentFilter,
    onFilterChange,
    onBookRoom
}) {
    const filterOptions = [
        { label: 'Tất Cả Phòng', value: 'ALL' },
        { label: 'Standard', value: 'Standard' },
        { label: 'Superior Ocean', value: 'Superior' },
        { label: 'Executive Suite', value: 'Suite' },
        { label: 'Presidential Villa', value: 'Villa' }
    ];

    const filteredRooms = currentFilter === 'ALL'
        ? rooms
        : rooms.filter(r => r.type === currentFilter);

    return (
        <section id="rooms" className="section">
            <div className="section-header">
                <span className="section-tag">Bộ Sưu Tập Phòng Nghỉ</span>
                <h2 className="section-title">Không Gian Nghỉ Dưỡng Hoàn Mỹ</h2>
                <p className="section-desc">
                    Mỗi căn phòng tại Grand Hotel là một tuyệt tác kiến trúc kết hợp giữa nét cổ điển quý phái và tiện nghi hiện đại bậc nhất thế giới.
                </p>
            </div>

            <div className="filter-tabs">
                {filterOptions.map(opt => (
                    <button
                        key={opt.value}
                        className={`filter-btn ${currentFilter === opt.value ? 'active' : ''}`}
                        onClick={() => onFilterChange(opt.value)}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            <div className="room-grid" id="landingRoomGrid">
                {filteredRooms.map(room => {
                    const isAvailable = room.status === 'Trống';

                    let badgeNode;
                    if (room.status === 'Trống') {
                        badgeNode = <span className="status-badge badge-available"><span className="status-dot"></span> Còn trống</span>;
                    } else if (room.status === 'Đang thuê') {
                        badgeNode = <span className="status-badge badge-occupied"><span className="status-dot"></span> Đang thuê</span>;
                    } else if (room.status === 'Đã đặt') {
                        badgeNode = <span className="status-badge badge-reserved"><span className="status-dot"></span> Đã đặt</span>;
                    } else {
                        badgeNode = <span className="status-badge badge-cleaning"><span className="status-dot"></span> Đang dọn</span>;
                    }

                    return (
                        <div key={room.id} className="room-card">
                            <div className="room-status-top">{badgeNode}</div>
                            <div className="room-img-wrap">
                                <img src={room.image} alt={room.name} className="room-img" />
                                <div className="room-overlay">
                                    <span className="room-num">
                                        <i className="fa-solid fa-key" style={{ color: 'var(--gold-primary)' }}></i> PHÒNG {room.id}
                                    </span>
                                </div>
                            </div>
                            <div className="room-content">
                                <span className="room-type">{room.type}</span>
                                <h3 className="room-name">{room.name}</h3>
                                <div className="room-amenities">
                                    <div className="amenity-item"><i className="fa-solid fa-bed"></i> {room.beds}</div>
                                    <div className="amenity-item"><i className="fa-solid fa-maximize"></i> {room.size}</div>
                                    <div className="amenity-item"><i className="fa-solid fa-user-group"></i> Tối đa {room.maxGuests} khách</div>
                                    <div className="amenity-item"><i className="fa-solid fa-mountain-sun"></i> {room.view}</div>
                                </div>
                                <div className="room-footer">
                                    <div className="price-box">
                                        <span className="price-val">{formatVND(room.price)}</span>
                                        <span className="price-unit">mỗi đêm (chưa VAT)</span>
                                    </div>
                                    {isAvailable ? (
                                        <button className="btn btn-gold btn-sm" onClick={() => onBookRoom(room)}>
                                            <i className="fa-solid fa-calendar-plus"></i> Đặt Ngay
                                        </button>
                                    ) : (
                                        <button className="btn btn-dark btn-sm" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                                            <i className="fa-solid fa-lock"></i> Hết phòng
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
