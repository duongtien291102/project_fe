/**
 * ============================================================================
 * VIEW: NavbarView
 * ============================================================================
 * Thanh điều hướng chính của website, nhận diện tài khoản khách/nhân sự
 */

import React from 'react';

export default function NavbarView({
    currentUser,
    onOpenAuthModal,
    onOpenCustomerProfile,
    onOpenMyBookings,
    onEnterAdmin,
    onLogout
}) {
    return (
        <header className="navbar" id="mainNavbar">
            <a href="#home" className="brand-logo">
                <i className="fa-solid fa-crown"></i>
                <div className="brand-text">
                    <span className="brand-name">GRAND HOTEL</span>
                    <span className="brand-sub">LUXURY RESORT & SPA</span>
                </div>
            </a>

            <ul className="nav-menu" id="navLinks">
                <li><a href="#home" className="nav-link">Trang Chủ</a></li>
                <li><a href="#rooms" className="nav-link">Phòng Nghỉ</a></li>
                <li><a href="#amenities" className="nav-link">Tiện Ích 5 Sao</a></li>
            </ul>

            <div className="nav-actions" id="navUserArea">
                {currentUser && currentUser.role === 'customer' ? (
                    <>
                        <div
                            className="user-pill"
                            style={{ cursor: 'pointer' }}
                            onClick={onOpenCustomerProfile}
                            title="Xem và cập nhật CCCD"
                        >
                            <div className="user-avatar">{currentUser.avatar || currentUser.name?.charAt(0) || 'U'}</div>
                            <span>{currentUser.name}</span>
                            <i className="fa-solid fa-id-card" style={{ color: 'var(--gold-primary)', fontSize: '0.9rem' }} title="Đã định danh CCCD"></i>
                        </div>
                        <button className="btn btn-sm btn-outline-gold" onClick={onOpenCustomerProfile}>
                            <i className="fa-solid fa-address-card"></i> Hồ sơ CCCD
                        </button>
                        <button className="btn btn-sm btn-outline-gold" onClick={onOpenMyBookings}>
                            <i className="fa-solid fa-list-check"></i> Đơn của tôi
                        </button>
                        <button className="btn btn-sm btn-dark" onClick={onLogout} title="Đăng xuất">
                            <i className="fa-solid fa-arrow-right-from-bracket"></i>
                        </button>
                    </>
                ) : currentUser && currentUser.role === 'staff' ? (
                    <>
                        <button className="btn btn-sm btn-gold" onClick={onEnterAdmin}>
                            <i className="fa-solid fa-gauge-high"></i> Vào Admin Dashboard
                        </button>
                        <button className="btn btn-sm btn-dark" onClick={onLogout} title="Đăng xuất">
                            <i className="fa-solid fa-arrow-right-from-bracket"></i>
                        </button>
                    </>
                ) : (
                    <>
                        <button className="btn btn-outline-gold btn-sm" onClick={() => onOpenAuthModal('customer')}>
                            <i className="fa-solid fa-user"></i> Đăng Nhập / CCCD
                        </button>
                        <button className="btn btn-gold btn-sm" onClick={() => onOpenAuthModal('staff')}>
                            <i className="fa-solid fa-shield-halved"></i> Quản Trị
                        </button>
                    </>
                )}
            </div>
        </header>
    );
}
