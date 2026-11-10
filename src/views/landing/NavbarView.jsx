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
    // Chỉ tài khoản nhân sự / quản trị viên nội bộ mới được coi là Admin
    // Quyền user / customer TUYỆT ĐỐI KHÔNG phải là admin và không bao giờ thấy nút vào trang quản trị
    const isCustomer = !currentUser || currentUser.role === 'customer' || currentUser.role === 'user';
    const isAdmin = !isCustomer && (
        currentUser.hasAdminAccess === true ||
        currentUser.role === 'staff' ||
        currentUser.role === 'admin'
    );

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
                {isAdmin ? (
                    <>
                        <button className="btn btn-sm btn-gold" onClick={onEnterAdmin} title="Vào Bảng Điều Khiển Quản Trị" style={{ fontWeight: 700 }}>
                            <i className="fa-solid fa-gauge-high"></i> Vào Trang Quản Trị
                        </button>
                        <button className="btn btn-sm btn-dark" onClick={onLogout} title="Đăng xuất khỏi hệ thống">
                            <i className="fa-solid fa-arrow-right-from-bracket"></i> Đăng xuất
                        </button>
                    </>
                ) : currentUser ? (
                    <>
                        <div
                            className="user-pill"
                            onClick={onOpenCustomerProfile}
                            title="Bấm để xem và cập nhật hồ sơ CCCD"
                        >
                            <div className="user-avatar">{currentUser.avatar || currentUser.name?.charAt(0) || 'U'}</div>
                            <span>{currentUser.name}</span>
                            <i className="fa-solid fa-id-card user-pill-badge" title="Khách Hàng (Đã định danh CCCD)"></i>
                        </div>
                        <button className="btn btn-sm btn-outline-gold" onClick={onOpenMyBookings} title="Xem lịch sử đặt phòng của tôi">
                            <i className="fa-solid fa-list-check"></i> Lịch sử đặt phòng
                        </button>
                        <button className="btn btn-sm btn-dark btn-icon-round" onClick={onLogout} title="Đăng xuất khỏi tài khoản">
                            <i className="fa-solid fa-arrow-right-from-bracket"></i>
                        </button>
                    </>
                ) : (
                    <button className="btn btn-gold btn-sm" onClick={() => onOpenAuthModal()}>
                        <i className="fa-solid fa-right-to-bracket"></i> Đăng Nhập / Đăng Ký
                    </button>
                )}
            </div>
        </header>
    );
}
