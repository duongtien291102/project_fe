/**
 * ============================================================================
 * VIEW: HeroView
 * ============================================================================
 * Khối giới thiệu 5 sao và thanh công cụ tìm kiếm phòng
 */

import React from 'react';

export default function HeroView({ searchParams, onSearchParamChange, onSearch }) {
    return (
        <section id="home" className="hero">
            <div className="hero-tag">
                <i className="fa-solid fa-gem"></i> Đỉnh Cao Nghỉ Dưỡng Thượng Lưu
            </div>
            <h1>Tuyệt Tác Nghỉ Dưỡng <span>Chuẩn 5 Sao</span> Quốc Tế</h1>
            <p className="hero-sub">
                Khám phá không gian xa hoa, ẩm thực thượng hạng và dịch vụ chuẩn mực hoàng gia ngay giữa lòng thành phố biển.
            </p>

            <div className="booking-card">
                <div className="input-group">
                    <label><i className="fa-regular fa-calendar-check"></i> Ngày nhận phòng</label>
                    <input
                        type="date"
                        value={searchParams.checkIn}
                        onChange={e => onSearchParamChange('checkIn', e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label><i className="fa-regular fa-calendar-xmark"></i> Ngày trả phòng</label>
                    <input
                        type="date"
                        value={searchParams.checkOut}
                        onChange={e => onSearchParamChange('checkOut', e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label><i className="fa-solid fa-bed"></i> Hạng phòng</label>
                    <select
                        value={searchParams.roomType}
                        onChange={e => onSearchParamChange('roomType', e.target.value)}
                    >
                        <option value="ALL">Tất cả hạng phòng</option>
                        <option value="Standard">Standard Deluxe</option>
                        <option value="Superior">Superior Ocean</option>
                        <option value="Suite">Executive Suite</option>
                        <option value="Villa">Presidential Villa</option>
                    </select>
                </div>
                <div className="input-group">
                    <label><i className="fa-solid fa-user-group"></i> Số lượng khách</label>
                    <select
                        value={searchParams.guests}
                        onChange={e => onSearchParamChange('guests', e.target.value)}
                    >
                        <option value="1">1 Khách</option>
                        <option value="2">2 Khách (Cặp đôi)</option>
                        <option value="4">4 Khách (Gia đình)</option>
                        <option value="6">6+ Khách</option>
                    </select>
                </div>
                <button
                    className="btn btn-gold"
                    onClick={onSearch}
                    style={{ height: '52px', alignSelf: 'flex-end' }}
                >
                    <i className="fa-solid fa-magnifying-glass"></i> Tìm Phòng
                </button>
            </div>
        </section>
    );
}
