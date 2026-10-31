import React from 'react';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-grid">
                <div className="footer-col">
                    <a href="#home" className="brand-logo" style={{ marginBottom: '20px' }}>
                        <i className="fa-solid fa-crown"></i>
                        <div className="brand-text">
                            <span className="brand-name">GRAND HOTEL</span>
                            <span className="brand-sub">LUXURY RESORT & SPA</span>
                        </div>
                    </a>
                    <p style={{ lineHeight: 1.8 }}>
                        Biểu tượng của sự sang trọng, lòng hiếu khách chuẩn 5 sao và thủ tục đăng ký tạm trú CCCD bảo mật tuyệt đối.
                    </p>
                </div>
                <div className="footer-col">
                    <h4>Liên Kết Nhanh</h4>
                    <ul className="footer-links">
                        <li><a href="#home">Trang chủ</a></li>
                        <li><a href="#rooms">Bộ sưu tập phòng</a></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>Quy Định & Pháp Lý</h4>
                    <ul className="footer-links">
                        <li><a href="#home"><i className="fa-solid fa-id-card" style={{ color: 'var(--gold-primary)', marginRight: '6px' }}></i> Khai báo CCCD / Tạm trú</a></li>
                        <li><a href="#home"><i className="fa-solid fa-qrcode" style={{ color: 'var(--gold-primary)', marginRight: '6px' }}></i> Thanh toán VietQR Napas</a></li>
                        <li><a href="#home"><i className="fa-solid fa-shield-halved" style={{ color: 'var(--gold-primary)', marginRight: '6px' }}></i> Bảo mật thông tin cá nhân</a></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>Liên Hệ Trực Tiếp</h4>
                    <p style={{ marginBottom: '10px' }}>
                        <i className="fa-solid fa-location-dot" style={{ color: 'var(--gold-primary)', marginRight: '8px' }}></i> 01 Đại lộ Hoàng Gia, TP. Biển
                    </p>
                    <p style={{ marginBottom: '10px' }}>
                        <i className="fa-solid fa-phone" style={{ color: 'var(--gold-primary)', marginRight: '8px' }}></i> (+84) 1900 8888 99
                    </p>
                    <p>
                        <i className="fa-solid fa-envelope" style={{ color: 'var(--gold-primary)', marginRight: '8px' }}></i> concierge@grandhotel.vn
                    </p>
                </div>
            </div>
            <div className="footer-bottom">
                &copy; 2026 Grand Hotel & Resorts. Bản quyền thuộc về hệ thống quản lý khách sạn và định danh CCCD toàn diện (React Edition).
            </div>
        </footer>
    );
}
