/**
 * ============================================================================
 * VIEW: ModalsView
 * ============================================================================
 * Toàn bộ 11 hộp thoại tương tác của hệ thống (Auth, Profile, CCCD, Booking...)
 */

import React, { useState } from 'react';
import { ADDON_PRICES } from '../../models/BookingModel.js';
import { HOTEL_BANK_CONFIG, formatVND, generateVietQRUrl } from '../../models/TransactionModel.js';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_CCCD_FILE_BYTES = 2 * 1024 * 1024; // 2MB

function handleValidatedImageUpload(e, setter) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        alert('Định dạng ảnh không hợp lệ. Vui lòng chọn file ảnh JPG, PNG hoặc WEBP.');
        e.target.value = '';
        return;
    }
    if (file.size > MAX_CCCD_FILE_BYTES) {
        alert('Dung lượng ảnh vượt quá 2MB. Vui lòng chọn ảnh nhẹ hơn.');
        e.target.value = '';
        return;
    }
    const reader = new FileReader();
    reader.onload = ev => setter(ev.target.result);
    reader.readAsDataURL(file);
}

export default function ModalsView({
    activeModal,
    modalData,
    onCloseModal,
    currentUser,
    onLoginSuccess,
    onRegisterSuccess,
    onUpdateProfileSuccess,
    onSubmitBooking,
    onConfirmQrPaid,
    onFinalizeCheckout,
    onCreateManualTx,
    onCreateRoom,
    onSaveStaff,
    onCreateRole,
    bookings,
    rooms,
    rolesConfig
}) {
    if (!activeModal) return null;

    return (
        <>
            {activeModal === 'auth' && (
                <AuthModal
                    onClose={onCloseModal}
                    onLoginSuccess={onLoginSuccess}
                    onRegisterSuccess={onRegisterSuccess}
                />
            )}

            {activeModal === 'customerProfile' && (
                <CustomerProfileModal
                    currentUser={currentUser}
                    onClose={onCloseModal}
                    onUpdateProfileSuccess={onUpdateProfileSuccess}
                />
            )}

            {activeModal === 'adminCccdView' && (
                <AdminCccdViewModal
                    booking={modalData}
                    onClose={onCloseModal}
                />
            )}

            {activeModal === 'booking' && (
                <BookingModal
                    room={modalData?.room}
                    rooms={rooms}
                    isWalkIn={modalData?.isWalkIn}
                    currentUser={currentUser}
                    onClose={onCloseModal}
                    onSubmitBooking={onSubmitBooking}
                />
            )}

            {activeModal === 'qrPayment' && (
                <QrPaymentModal
                    paymentData={modalData}
                    onClose={onCloseModal}
                    onConfirmQrPaid={onConfirmQrPaid}
                />
            )}

            {activeModal === 'checkout' && (
                <CheckoutModal
                    room={modalData?.room}
                    booking={modalData?.booking}
                    onClose={onCloseModal}
                    onFinalizeCheckout={onFinalizeCheckout}
                />
            )}

            {activeModal === 'manualTx' && (
                <ManualTxModal
                    onClose={onCloseModal}
                    onCreateManualTx={onCreateManualTx}
                />
            )}

            {activeModal === 'myBookings' && (
                <MyBookingsModal
                    currentUser={currentUser}
                    bookings={bookings}
                    onClose={onCloseModal}
                />
            )}

            {activeModal === 'newRoom' && (
                <NewRoomModal
                    onClose={onCloseModal}
                    onCreateRoom={onCreateRoom}
                />
            )}

            {activeModal === 'staff' && (
                <StaffModal
                    staffToEdit={modalData?.staff}
                    rolesConfig={rolesConfig}
                    onClose={onCloseModal}
                    onSaveStaff={onSaveStaff}
                />
            )}

            {activeModal === 'newRole' && (
                <NewRoleModal
                    onClose={onCloseModal}
                    onCreateRole={onCreateRole}
                />
            )}
        </>
    );
}

// 1. AUTH MODAL
function AuthModal({ onClose, onLoginSuccess, onRegisterSuccess }) {
    const [authTab, setAuthTab] = useState('login');
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Register State
    const [regFullName, setRegFullName] = useState('');
    const [regPhone, setRegPhone] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regDob, setRegDob] = useState('');
    const [regGender, setRegGender] = useState('Nam');
    const [regNationality, setRegNationality] = useState('Việt Nam');
    const [regAddress, setRegAddress] = useState('');
    const [regCccdNumber, setRegCccdNumber] = useState('');
    const [regCccdDate, setRegCccdDate] = useState('');
    const [regCccdPlace, setRegCccdPlace] = useState('');
    const [regFrontImg, setRegFrontImg] = useState('');
    const [regBackImg, setRegBackImg] = useState('');
    const [regPassword, setRegPassword] = useState('');

    const handleFileUpload = (e, setter) => {
        handleValidatedImageUpload(e, setter);
    };

    const handleLoginSubmit = e => {
        e.preventDefault();
        onLoginSuccess({
            username: loginUsername,
            password: loginPassword
        });
    };

    const handleRegisterSubmit = e => {
        e.preventDefault();
        onRegisterSuccess({
            username: regEmail,
            name: regFullName.toUpperCase(),
            fullName: regFullName.toUpperCase(),
            phone: regPhone,
            email: regEmail,
            password: regPassword,
            dob: regDob,
            gender: regGender,
            nationality: regNationality,
            address: regAddress,
            cccd: regCccdNumber,
            cccdDate: regCccdDate,
            cccdPlace: regCccdPlace,
            cccdFront: regFrontImg,
            cccdBack: regBackImg,
            role: 'customer',
            avatar: regFullName.charAt(0).toUpperCase()
        });
    };

    return (
        <div className="modal-overlay" style={{ display: 'flex' }}>
            <div className="modal-card modal-lg">
                <div className="modal-header">
                    <h3>{authTab === 'login' ? 'Đăng Nhập Grand Hotel' : 'Đăng Ký Thành Viên VIP (Định Danh CCCD)'}</h3>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <div className="auth-tab-buttons">
                        <button
                            className={`auth-tab-btn ${authTab === 'login' ? 'active' : ''}`}
                            onClick={() => setAuthTab('login')}
                        >
                            Đăng Nhập
                        </button>
                        <button
                            className={`auth-tab-btn ${authTab === 'register' ? 'active' : ''}`}
                            onClick={() => setAuthTab('register')}
                        >
                            Đăng Ký Khách Mới (Kèm CCCD)
                        </button>
                    </div>

                    {authTab === 'login' ? (
                        <form onSubmit={handleLoginSubmit}>
                            <div className="form-group">
                                <label>Tên Đăng Nhập / Email / Số CCCD</label>
                                <input
                                    type="text"
                                    placeholder="Nhập tên đăng nhập, email hoặc số CCCD"
                                    required
                                    value={loginUsername}
                                    onChange={e => setLoginUsername(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Mật Khẩu</label>
                                <input
                                    type="password"
                                    placeholder="Nhập mật khẩu"
                                    required
                                    value={loginPassword}
                                    onChange={e => setLoginPassword(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="btn btn-gold" style={{ width: '100%', marginTop: '10px' }}>
                                <i className="fa-solid fa-right-to-bracket"></i> Đăng Nhập Vào Hệ Thống
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleRegisterSubmit}>
                            <div className="form-section-title">
                                <i className="fa-solid fa-user-check"></i> 1. Thông Tin Cá Nhân Cơ Bản
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Họ và Tên (In hoa như trên CCCD) *</label>
                                    <input
                                        type="text"
                                        placeholder="NGUYỄN VĂN AN"
                                        required
                                        style={{ textTransform: 'uppercase' }}
                                        value={regFullName}
                                        onChange={e => setRegFullName(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Số Điện Thoại *</label>
                                    <input
                                        type="tel"
                                        placeholder="0901234567"
                                        required
                                        value={regPhone}
                                        onChange={e => setRegPhone(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-row-3">
                                <div className="form-group">
                                    <label>Email Liên Hệ *</label>
                                    <input
                                        type="email"
                                        placeholder="an.nguyen@email.com"
                                        required
                                        value={regEmail}
                                        onChange={e => setRegEmail(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Ngày Sinh *</label>
                                    <input
                                        type="date"
                                        required
                                        value={regDob}
                                        onChange={e => setRegDob(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Giới Tính *</label>
                                    <select value={regGender} onChange={e => setRegGender(e.target.value)}>
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                        <option value="Khác">Khác</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Quốc Tịch</label>
                                    <input
                                        type="text"
                                        required
                                        value={regNationality}
                                        onChange={e => setRegNationality(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Địa Chỉ Thường Trú (Tỉnh / TP) *</label>
                                    <input
                                        type="text"
                                        placeholder="Quận 1, TP. Hồ Chí Minh"
                                        required
                                        value={regAddress}
                                        onChange={e => setRegAddress(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-section-title">
                                <i className="fa-solid fa-id-card"></i> 2. Định Danh Căn Cước Công Dân (CCCD / Passport)
                            </div>
                            <div className="form-row-3">
                                <div className="form-group">
                                    <label>Số CCCD / CMND (12 số) *</label>
                                    <input
                                        type="text"
                                        placeholder="Nhập số CCCD / Hộ chiếu"
                                        maxLength="15"
                                        required
                                        style={{ fontWeight: 700, letterSpacing: '1px' }}
                                        value={regCccdNumber}
                                        onChange={e => setRegCccdNumber(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Ngày Cấp *</label>
                                    <input
                                        type="date"
                                        required
                                        value={regCccdDate}
                                        onChange={e => setRegCccdDate(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Nơi Cấp *</label>
                                    <input
                                        type="text"
                                        required
                                        value={regCccdPlace}
                                        onChange={e => setRegCccdPlace(e.target.value)}
                                    />
                                </div>
                            </div>

                            <label style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '5px' }}>
                                Đính Kèm Ảnh Chụp CCCD (Mặt Trước & Mặt Sau) *
                            </label>
                            <div className="cccd-upload-container">
                                <div className="cccd-upload-box" onClick={() => document.getElementById('regFrontFileInput').click()}>
                                    <i className="fa-solid fa-camera"></i>
                                    <span>Tải ảnh CCCD Mặt Trước</span>
                                    <small>Định dạng JPG, PNG (rõ nét)</small>
                                    <input
                                        type="file"
                                        id="regFrontFileInput"
                                        accept="image/jpeg,image/png,image/webp"
                                        style={{ display: 'none' }}
                                        onChange={e => handleFileUpload(e, setRegFrontImg)}
                                    />
                                    {regFrontImg && (
                                        <img src={regFrontImg} className="cccd-preview-img" style={{ display: 'block' }} alt="CCCD Mặt Trước" />
                                    )}
                                </div>

                                <div className="cccd-upload-box" onClick={() => document.getElementById('regBackFileInput').click()}>
                                    <i className="fa-solid fa-camera"></i>
                                    <span>Tải ảnh CCCD Mặt Sau</span>
                                    <small>Định dạng JPG, PNG (rõ nét)</small>
                                    <input
                                        type="file"
                                        id="regBackFileInput"
                                        accept="image/jpeg,image/png,image/webp"
                                        style={{ display: 'none' }}
                                        onChange={e => handleFileUpload(e, setRegBackImg)}
                                    />
                                    {regBackImg && (
                                        <img src={regBackImg} className="cccd-preview-img" style={{ display: 'block' }} alt="CCCD Mặt Sau" />
                                    )}
                                </div>
                            </div>

                            <div className="form-section-title">
                                <i className="fa-solid fa-lock"></i> 3. Mật Khẩu Đăng Nhập
                            </div>
                            <div className="form-group">
                                <label>Mật Khẩu Khởi Tạo *</label>
                                <input
                                    type="password"
                                    placeholder="Nhập mật khẩu an toàn (tối thiểu 6 ký tự)"
                                    required
                                    minLength="6"
                                    value={regPassword}
                                    onChange={e => setRegPassword(e.target.value)}
                                />
                            </div>

                            <button type="submit" className="btn btn-gold" style={{ width: '100%', marginTop: '15px', padding: '14px' }}>
                                <i className="fa-solid fa-shield-halved"></i> Hoàn Tất Đăng Ký & Xác Thực CCCD
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

// 2. CUSTOMER PROFILE MODAL
function CustomerProfileModal({ currentUser, onClose, onUpdateProfileSuccess }) {
    const [name, setName] = useState(currentUser?.name || '');
    const [phone, setPhone] = useState(currentUser?.phone || '');
    const [email] = useState(currentUser?.email || currentUser?.username || '');
    const [dob, setDob] = useState(currentUser?.dob || '');
    const [gender, setGender] = useState(currentUser?.gender || 'Nam');
    const [address, setAddress] = useState(currentUser?.address || '');
    const [cccd, setCccd] = useState(currentUser?.cccd || '');
    const [cccdDate, setCccdDate] = useState(currentUser?.cccdDate || '');
    const [cccdPlace, setCccdPlace] = useState(currentUser?.cccdPlace || '');
    const [frontImg, setFrontImg] = useState(currentUser?.cccdFront || '');
    const [backImg, setBackImg] = useState(currentUser?.cccdBack || '');

    const handleFileUpload = (e, setter) => {
        handleValidatedImageUpload(e, setter);
    };

    const handleSubmit = e => {
        e.preventDefault();
        onUpdateProfileSuccess({
            ...currentUser,
            name: name.toUpperCase(),
            phone,
            dob,
            gender,
            address,
            cccd,
            cccdDate,
            cccdPlace,
            cccdFront: frontImg,
            cccdBack: backImg,
            avatar: name.charAt(0).toUpperCase()
        });
    };

    return (
        <div className="modal-overlay" style={{ display: 'flex' }}>
            <div className="modal-card modal-lg">
                <div className="modal-header">
                    <h3>Hồ Sơ Cá Nhân & Định Danh CCCD</h3>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '15px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <div className="user-avatar" style={{ width: '48px', height: '48px', fontSize: '1.2rem' }}>
                                    {currentUser?.avatar || name.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1.15rem', color: 'var(--navy-dark)' }}>{name}</h4>
                                    {cccd ? (
                                        <span className="status-badge badge-verified">
                                            <i className="fa-solid fa-circle-check"></i> Đã Xác Minh CCCD
                                        </span>
                                    ) : (
                                        <span className="status-badge" style={{ background: '#fef3c7', color: '#92400e' }}>
                                            <i className="fa-solid fa-circle-exclamation"></i> Chưa cập nhật CCCD
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="form-section-title"><i className="fa-solid fa-user-pen"></i> 1. Cập Nhật Thông Tin Liên Hệ</div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Họ và Tên</label>
                                <input type="text" required style={{ textTransform: 'uppercase' }} value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Số Điện Thoại</label>
                                <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} />
                            </div>
                        </div>
                        <div className="form-row-3">
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" readOnly style={{ background: '#e2e8f0' }} value={email} />
                            </div>
                            <div className="form-group">
                                <label>Ngày Sinh</label>
                                <input type="date" value={dob} onChange={e => setDob(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Giới Tính</label>
                                <select value={gender} onChange={e => setGender(e.target.value)}>
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Địa Chỉ Thường Trú</label>
                            <input type="text" value={address} onChange={e => setAddress(e.target.value)} />
                        </div>

                        <div className="form-section-title"><i className="fa-solid fa-id-card"></i> 2. Cập Nhật Căn Cước Công Dân & Ảnh Chụp</div>
                        <div className="form-row-3">
                            <div className="form-group">
                                <label>Số CCCD / Hộ Chiếu</label>
                                <input type="text" required style={{ fontWeight: 700 }} value={cccd} onChange={e => setCccd(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Ngày Cấp</label>
                                <input type="date" required value={cccdDate} onChange={e => setCccdDate(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Nơi Cấp</label>
                                <input type="text" required value={cccdPlace} onChange={e => setCccdPlace(e.target.value)} />
                            </div>
                        </div>

                        <div className="cccd-upload-container">
                            <div className="cccd-upload-box" onClick={() => document.getElementById('profFrontInput').click()}>
                                <i className="fa-solid fa-camera-rotate"></i>
                                <span>Đổi Ảnh CCCD Mặt Trước</span>
                                <input type="file" id="profFrontInput" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={e => handleFileUpload(e, setFrontImg)} />
                                {frontImg && <img src={frontImg} className="cccd-preview-img" style={{ display: 'block' }} alt="CCCD Mặt Trước" />}
                            </div>
                            <div className="cccd-upload-box" onClick={() => document.getElementById('profBackInput').click()}>
                                <i className="fa-solid fa-camera-rotate"></i>
                                <span>Đổi Ảnh CCCD Mặt Sau</span>
                                <input type="file" id="profBackInput" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={e => handleFileUpload(e, setBackImg)} />
                                {backImg && <img src={backImg} className="cccd-preview-img" style={{ display: 'block' }} alt="CCCD Mặt Sau" />}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                            <button type="button" className="btn btn-dark" onClick={onClose}>Đóng</button>
                            <button type="submit" className="btn btn-gold">
                                <i className="fa-solid fa-floppy-disk"></i> Lưu Thay Đổi Hồ Sơ & CCCD
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// 3. ADMIN CCCD VIEWER MODAL
function AdminCccdViewModal({ booking, onClose }) {
    if (!booking) return null;

    return (
        <div className="modal-overlay" style={{ display: 'flex' }}>
            <div className="modal-card modal-lg">
                <div className="modal-header">
                    <h3>Chi Tiết Định Danh CCCD Khách Lưu Trú</h3>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '20px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                        <div className="form-row" style={{ marginBottom: '10px' }}>
                            <div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>HỌ TÊN KHÁCH:</span>
                                <strong style={{ fontSize: '1.15rem', color: 'var(--navy-dark)', display: 'block' }}>{booking.customerName}</strong>
                            </div>
                            <div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>SỐ CCCD / PASSPORT:</span>
                                <strong style={{ fontSize: '1.25rem', color: 'var(--gold-dark)', display: 'block' }}>{booking.cccd || 'CHƯA CẬP NHẬT'}</strong>
                            </div>
                        </div>
                        <div className="form-row-3" style={{ marginBottom: 0 }}>
                            <div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>NGÀY SINH:</span>
                                <div><strong>{booking.dob || '---'}</strong></div>
                            </div>
                            <div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>NGÀY CẤP:</span>
                                <div><strong>{booking.cccdDate || '---'}</strong></div>
                            </div>
                            <div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>NƠI CẤP:</span>
                                <div><strong>{booking.cccdPlace || '---'}</strong></div>
                            </div>
                        </div>
                    </div>

                    <h4 style={{ marginBottom: '12px', color: 'var(--navy-dark)' }}>
                        <i className="fa-solid fa-images" style={{ color: 'var(--gold-dark)' }}></i> Ảnh Chụp Căn Cước Công Dân Đối Chiếu:
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <strong style={{ fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Mặt trước:</strong>
                            {booking.cccdFront ? (
                                <img src={booking.cccdFront} alt="CCCD Mặt Trước" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                            ) : (
                                <div style={{ width: '100%', height: '200px', borderRadius: '8px', border: '1px dashed #cbd5e1', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '0.88rem' }}>
                                    Chưa cập nhật ảnh CCCD
                                </div>
                            )}
                        </div>
                        <div>
                            <strong style={{ fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Mặt sau:</strong>
                            {booking.cccdBack ? (
                                <img src={booking.cccdBack} alt="CCCD Mặt Sau" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                            ) : (
                                <div style={{ width: '100%', height: '200px', borderRadius: '8px', border: '1px dashed #cbd5e1', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '0.88rem' }}>
                                    Chưa cập nhật ảnh CCCD
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                        <button className="btn btn-gold" onClick={onClose}>
                            <i className="fa-solid fa-check"></i> Đã Kiểm Tra & Khớp Thông Tin
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// 4. CLIENT BOOKING MODAL
function BookingModal({ room, rooms = [], isWalkIn = false, currentUser, onClose, onSubmitBooking }) {
    const availableRooms = rooms.filter(r => r.status === 'Trống');
    const initialRoom = room || availableRooms[0] || rooms[0] || null;
    const [selectedRoomId, setSelectedRoomId] = useState(initialRoom?.id || '');
    const activeRoom = isWalkIn
        ? (rooms.find(r => r.id === selectedRoomId) || initialRoom)
        : initialRoom;

    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const [customerName, setCustomerName] = useState(isWalkIn ? '' : (currentUser?.name || ''));
    const [phone, setPhone] = useState(isWalkIn ? '' : (currentUser?.phone || ''));
    const [cccd, setCccd] = useState(isWalkIn ? '' : (currentUser?.cccd || ''));
    const [dob, setDob] = useState(isWalkIn ? '' : (currentUser?.dob || ''));
    const [checkIn, setCheckIn] = useState(todayStr);
    const [checkOut, setCheckOut] = useState(tomorrowStr);
    const [breakfast, setBreakfast] = useState(true);
    const [pickup, setPickup] = useState(false);
    const [spa, setSpa] = useState(false);
    const [depositPercent, setDepositPercent] = useState('50');
    const [paymentMethod, setPaymentMethod] = useState('VietQR');

    if (!activeRoom) return null;

    let nights = 1;
    if (checkIn && checkOut) {
        const diff = new Date(checkOut) - new Date(checkIn);
        nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
        if (nights <= 0) nights = 1;
    }

    const roomPriceTotal = activeRoom.price * nights;
    let addonTotal = 0;
    if (breakfast) addonTotal += ADDON_PRICES['Buffet Sáng Michelin'] * nights;
    if (pickup) addonTotal += ADDON_PRICES['Đưa Đón Sân Bay'];
    if (spa) addonTotal += ADDON_PRICES['Lotus Spa'];
    const grandTotal = roomPriceTotal + addonTotal;

    const depPct = parseInt(depositPercent, 10);
    const depositNeeded = Math.round((grandTotal * depPct) / 100);

    const handleSubmit = e => {
        e.preventDefault();
        const selectedAddons = [];
        if (breakfast) selectedAddons.push('Buffet Sáng Michelin');
        if (pickup) selectedAddons.push('Đưa Đón Sân Bay');
        if (spa) selectedAddons.push('Lotus Spa');

        onSubmitBooking({
            room: activeRoom,
            isWalkIn: !!isWalkIn,
            customerName: customerName.toUpperCase(),
            phone,
            cccd,
            dob,
            checkIn,
            checkOut,
            nights,
            addons: selectedAddons,
            grandTotal,
            depositNeeded,
            paymentMethod
        });
    };

    return (
        <div className="modal-overlay" style={{ display: 'flex' }}>
            <div className="modal-card modal-lg">
                <div className="modal-header">
                    <h3>{isWalkIn ? 'Đặt Phòng Nhanh Cho Khách Vãng Lai (Walk-in)' : 'Xác Nhận Đặt Phòng & Đặt Cọc'}</h3>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        {isWalkIn && (
                            <div className="form-group">
                                <label><i className="fa-solid fa-door-open"></i> Chọn Phòng Trống Cho Khách</label>
                                <select value={activeRoom.id} onChange={e => setSelectedRoomId(e.target.value)}>
                                    {(availableRooms.length > 0 ? availableRooms : rooms).map(r => (
                                        <option key={r.id} value={r.id}>
                                            Phòng {r.id} - {r.name} ({formatVND(r.price)}/đêm){r.status !== 'Trống' ? ` [${r.status}]` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px', paddingBottom: '18px', borderBottom: '1px solid var(--border-color)' }}>
                            {activeRoom.image ? (
                                <img src={activeRoom.image} alt={activeRoom.name} style={{ width: '120px', height: '85px', borderRadius: '10px', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '120px', height: '85px', borderRadius: '10px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '0.78rem', flexShrink: 0 }}>
                                    Chưa có ảnh
                                </div>
                            )}
                            <div>
                                <span className="room-type">{(activeRoom.type || '').toUpperCase()}</span>
                                <h4 style={{ fontSize: '1.3rem', color: 'var(--navy-dark)' }}>{activeRoom.name} (Phòng {activeRoom.id})</h4>
                                <div style={{ fontSize: '0.9rem', color: 'var(--gold-dark)', fontWeight: 700 }}>
                                    {formatVND(activeRoom.price)} / đêm
                                </div>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label><i className="fa-regular fa-user"></i> Tên Quý Khách</label>
                                <input type="text" required value={customerName} onChange={e => setCustomerName(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label><i className="fa-solid fa-phone"></i> Số Điện Thoại</label>
                                <input type="tel" required placeholder="09xxxxxxxxx" value={phone} onChange={e => setPhone(e.target.value)} />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label><i className="fa-regular fa-id-card"></i> Số CCCD / Hộ Chiếu (Để đăng ký tạm trú)</label>
                                <input type="text" required placeholder="0790xxxxxxx" value={cccd} onChange={e => setCccd(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label><i className="fa-regular fa-calendar"></i> Ngày Sinh</label>
                                <input type="date" required value={dob} onChange={e => setDob(e.target.value)} />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label><i className="fa-regular fa-calendar-check"></i> Ngày Nhận Phòng (Check-in)</label>
                                <input type="date" required value={checkIn} onChange={e => setCheckIn(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label><i className="fa-regular fa-calendar-xmark"></i> Ngày Trả Phòng (Check-out)</label>
                                <input type="date" required value={checkOut} onChange={e => setCheckOut(e.target.value)} />
                            </div>
                        </div>

                        <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>
                            <i className="fa-solid fa-bell-concierge"></i> Dịch Vụ Gia Tăng 5 Sao:
                        </label>
                        <div className="addon-options">
                            <div className="addon-item">
                                <label>
                                    <input type="checkbox" checked={breakfast} onChange={e => setBreakfast(e.target.checked)} />
                                    <span>Buffet Ăn Sáng Hoàng Gia (Chuẩn Michelin)</span>
                                </label>
                                <strong style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>+ 200.000 ₫ / ngày</strong>
                            </div>
                            <div className="addon-item">
                                <label>
                                    <input type="checkbox" checked={pickup} onChange={e => setPickup(e.target.checked)} />
                                    <span>Đưa Đón Sân Bay Khứ Hồi Bằng Xe Sang</span>
                                </label>
                                <strong style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>+ 450.000 ₫</strong>
                            </div>
                            <div className="addon-item">
                                <label>
                                    <input type="checkbox" checked={spa} onChange={e => setSpa(e.target.checked)} />
                                    <span>Gói Thư Giãn Trị Liệu Lotus Spa Toàn Thân</span>
                                </label>
                                <strong style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>+ 600.000 ₫</strong>
                            </div>
                        </div>

                        <div style={{ background: 'rgba(212,175,55,0.06)', border: '1.5px solid var(--gold-primary)', borderRadius: 'var(--radius-md)', padding: '18px', margin: '20px 0' }}>
                            <h4 style={{ color: 'var(--navy-dark)', fontSize: '1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <i className="fa-solid fa-coins" style={{ color: 'var(--gold-dark)' }}></i> Lựa Chọn Đặt Cọc & Phương Thức Thanh Toán:
                            </h4>
                            <div className="form-row" style={{ marginBottom: '14px' }}>
                                <div>
                                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>MỨC ĐẶT CỌC:</label>
                                    <select value={depositPercent} onChange={e => setDepositPercent(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%', fontWeight: 600 }}>
                                        <option value="50">Đặt Cọc 50% (Đảm bảo giữ phòng 5 sao)</option>
                                        <option value="100">Thanh Toán Toàn Bộ 100%</option>
                                        <option value="0">Thanh Toán Toàn Bộ Khi Nhận Phòng (0% cọc)</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>PHƯƠNG THỨC THANH TOÁN CỌC:</label>
                                    <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%', fontWeight: 600 }}>
                                        <option value="VietQR">📱 Chuyển Khoản Ngân Hàng VietQR (Quét mã)</option>
                                        <option value="Thẻ tín dụng">💳 Thẻ Quốc Tế (Visa / Mastercard)</option>
                                        <option value="Tiền mặt">💵 Tiền Mặt Khi Check-in</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="booking-summary-box">
                            <div className="summary-row"><span>Thời gian lưu trú:</span><strong>{nights} đêm</strong></div>
                            <div className="summary-row"><span>Tiền phòng gốc:</span><span>{formatVND(roomPriceTotal)}</span></div>
                            <div className="summary-row"><span>Phí dịch vụ gia tăng:</span><span>{formatVND(addonTotal)}</span></div>
                            <div className="summary-row" style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '8px', marginTop: '8px' }}>
                                <span>Tổng giá trị đơn phòng:</span>
                                <strong style={{ color: 'var(--navy-dark)', fontSize: '1.05rem' }}>{formatVND(grandTotal)}</strong>
                            </div>
                            <div className="summary-total" style={{ background: '#fef3c7', padding: '12px', borderRadius: '8px', border: 'none', marginTop: '8px' }}>
                                <span style={{ color: '#92400e', fontSize: '1rem' }}>Số Tiền Cần Đặt Cọc Ngay:</span>
                                <span style={{ color: '#b45309', fontSize: '1.25rem' }}>{formatVND(depositNeeded)}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '14px', justifyContent: 'flex-end' }}>
                            <button type="button" className="btn btn-dark" onClick={onClose}>Hủy Bỏ</button>
                            <button type="submit" className="btn btn-gold">
                                <i className="fa-solid fa-qrcode"></i> Tiến Hành Đặt Phòng & Nhận Mã QR
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// 5. VIETQR PAYMENT MODAL
function QrPaymentModal({ paymentData, onClose, onConfirmQrPaid }) {
    if (!paymentData) return null;
    const { amount, bookingId, customerName } = paymentData;
    const qrUrl = generateVietQRUrl(amount, `DAT COC ${bookingId}`);

    const handleCopy = () => {
        navigator.clipboard.writeText(HOTEL_BANK_CONFIG.accountNo);
    };

    return (
        <div className="modal-overlay" style={{ display: 'flex' }}>
            <div className="modal-card">
                <div className="modal-header">
                    <h3>Thanh Toán Chuyển Khoản VietQR</h3>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body" style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                        Vui lòng mở ứng dụng ngân hàng bất kỳ để quét mã thanh toán tức thì:
                    </p>

                    <div className="vietqr-box">
                        <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--gold-light)' }}>
                            <i className="fa-solid fa-shield-halved"></i> CỔNG THANH TOÁN CHUẨN NAPAS 24/7
                        </div>
                        <div className="vietqr-img-wrap">
                            <img src={qrUrl} alt="Mã VietQR" className="vietqr-img" />
                        </div>
                        <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--gold-light)' }}>
                            {formatVND(amount)}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                            Nội dung: DAT COC {bookingId} ({customerName})
                        </div>
                        <div className="bank-info-grid">
                            <div>
                                <span>Ngân Hàng Thụ Hưởng:</span>
                                <strong>MB BANK (Quân Đội)</strong>
                            </div>
                            <div>
                                <span>Số Tài Khoản Khách Sạn:</span>
                                <strong style={{ color: 'var(--gold-light)' }}>{HOTEL_BANK_CONFIG.accountNo}</strong>
                            </div>
                            <div>
                                <span>Tên Người Thụ Hưởng:</span>
                                <strong>{HOTEL_BANK_CONFIG.accountName}</strong>
                            </div>
                            <div>
                                <span>Cú Pháp Chuyển Khoản:</span>
                                <strong>DAT COC {bookingId}</strong>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '15px' }}>
                        <button className="btn btn-dark btn-sm" onClick={handleCopy}>
                            <i className="fa-regular fa-copy"></i> Sao Chép Số TK
                        </button>
                        <button className="btn btn-gold" onClick={onConfirmQrPaid}>
                            <i className="fa-solid fa-circle-check"></i> Tôi Đã Chuyển Khoản Xong
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// 6. CHECKOUT BILLING MODAL
function CheckoutModal({ room, booking, onClose, onFinalizeCheckout }) {
    if (!room) return null;

    const [method, setMethod] = useState('VietQR');
    const [cashGiven, setCashGiven] = useState('');

    const nights = booking?.nights || 1;
    const roomTotal = room.price * nights;
    const minibar = Number(booking?.minibar) || 0;
    const grandTotal = (booking?.totalAmount ? booking.totalAmount : roomTotal) + minibar;
    const depositPaid = booking?.depositAmount || 0;
    const remaining = Math.max(0, grandTotal - depositPaid);

    const change = Math.max(0, (parseFloat(cashGiven) || 0) - remaining);

    const handleConfirm = () => {
        onFinalizeCheckout({
            room,
            booking,
            remaining,
            method
        });
    };

    return (
        <div className="modal-overlay" style={{ display: 'flex' }}>
            <div className="modal-card modal-lg">
                <div className="modal-header">
                    <h3>Phiếu Quyết Toán Trả Phòng & Thu Ngân</h3>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <div className="invoice-card" id="printableInvoice">
                        <div className="invoice-header">
                            <div>
                                <h2 style={{ fontFamily: 'Cinzel, serif', color: 'var(--navy-dark)', fontSize: '1.4rem' }}>GRAND HOTEL & RESORTS</h2>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Phiếu thanh toán kiêm bàn giao chìa khóa & quyết toán tiền cọc</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div className="invoice-id">{booking ? booking.id : 'HD-BILL'}</div>
                                <small>{new Date().toLocaleDateString('vi-VN')}</small>
                            </div>
                        </div>

                        <div className="form-row" style={{ marginBottom: '20px' }}>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Khách Hàng (CCCD):</div>
                                <strong style={{ fontSize: '1.1rem', color: 'var(--navy-dark)' }}>{booking?.customerName || room.currentGuest || 'Khách Lưu Trú'}</strong>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    {booking?.phone || '---'} | CCCD: {booking?.cccd || '---'}
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Phòng Lưu Trú:</div>
                                <strong style={{ fontSize: '1.2rem', color: 'var(--gold-dark)' }}>Phòng {room.id}</strong>
                                <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{room.name} ({room.type})</div>
                            </div>
                        </div>

                        <table className="data-table" style={{ marginBottom: '20px' }}>
                            <thead>
                                <tr>
                                    <th>Khoản Mục</th>
                                    <th>Chi Tiết</th>
                                    <th style={{ textAlign: 'right' }}>Thành Tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Tiền phòng ({room.name})</strong></td>
                                    <td>{nights} đêm x {formatVND(room.price)}</td>
                                    <td style={{ textAlign: 'right' }}><strong>{formatVND(roomTotal)}</strong></td>
                                </tr>
                                {booking?.addons?.map((addon, i) => {
                                    const unitPrice = ADDON_PRICES[addon] || 0;
                                    const isPerNight = addon === 'Buffet Sáng Michelin';
                                    const lineTotal = isPerNight ? unitPrice * nights : unitPrice;
                                    return (
                                        <tr key={i}>
                                            <td>Dịch vụ: {addon}</td>
                                            <td>{isPerNight ? `${nights} ngày x ${formatVND(unitPrice)}` : 'Gói dịch vụ theo đơn'}</td>
                                            <td style={{ textAlign: 'right' }}>{lineTotal > 0 ? formatVND(lineTotal) : 'Đã bao gồm'}</td>
                                        </tr>
                                    );
                                })}
                                {minibar > 0 && (
                                    <tr>
                                        <td>Sử dụng Mini-bar & Dịch vụ phát sinh</td>
                                        <td>Phụ thu dịch vụ phòng</td>
                                        <td style={{ textAlign: 'right' }}>{formatVND(minibar)}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <div style={{ background: '#f8fafc', borderRadius: 'var(--radius-md)', padding: '16px', marginTop: '15px' }}>
                            <div className="summary-row">
                                <span>Tổng Chi Phí Kỳ Nghỉ:</span>
                                <strong>{formatVND(grandTotal)}</strong>
                            </div>
                            <div className="summary-row" style={{ color: 'var(--purple)' }}>
                                <span><i className="fa-solid fa-hand-holding-dollar"></i> Đã Đặt Cọc Trước Đó:</span>
                                <strong>- {formatVND(depositPaid)} ({booking?.depositMethod || 'Đã cọc'})</strong>
                            </div>
                            <div className="summary-total" style={{ fontSize: '1.3rem', borderTop: '2px solid var(--gold-primary)', paddingTop: '12px', marginTop: '10px' }}>
                                <span>SỐ TIỀN CÒN PHẢI THU:</span>
                                <span style={{ color: 'var(--danger)' }}>{formatVND(remaining)}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ background: '#ffffff', border: '1.5px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: '20px' }}>
                        <label style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--navy-dark)', display: 'block', marginBottom: '10px' }}>
                            <i className="fa-solid fa-cash-register" style={{ color: 'var(--gold-dark)' }}></i> Phương Thức Khách Thanh Toán Số Tiền Còn Lại:
                        </label>
                        <div className="payment-methods-grid">
                            <div
                                className={`payment-method-card ${method === 'VietQR' ? 'selected' : ''}`}
                                onClick={() => setMethod('VietQR')}
                            >
                                <i className="fa-solid fa-qrcode"></i>
                                <strong>VietQR</strong>
                                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Chuyển khoản</small>
                            </div>
                            <div
                                className={`payment-method-card ${method === 'Tiền mặt' ? 'selected' : ''}`}
                                onClick={() => {
                                    setMethod('Tiền mặt');
                                    setCashGiven(remaining);
                                }}
                            >
                                <i className="fa-solid fa-money-bill-1-wave"></i>
                                <strong>Tiền Mặt</strong>
                                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Tại quầy thu ngân</small>
                            </div>
                            <div
                                className={`payment-method-card ${method === 'Thẻ tín dụng' ? 'selected' : ''}`}
                                onClick={() => setMethod('Thẻ tín dụng')}
                            >
                                <i className="fa-regular fa-credit-card"></i>
                                <strong>Quẹt Thẻ POS</strong>
                                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Visa / Master</small>
                            </div>
                        </div>

                        {method === 'Tiền mặt' && (
                            <div style={{ background: '#f1f5f9', padding: '14px', borderRadius: '8px', marginTop: '10px' }}>
                                <div className="form-row" style={{ marginBottom: 0 }}>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>TIỀN KHÁCH ĐƯA (VNĐ):</label>
                                        <input
                                            type="number"
                                            value={cashGiven}
                                            onChange={e => setCashGiven(e.target.value)}
                                            style={{ fontWeight: 700, color: 'var(--success)' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>TIỀN THỐI LẠI CHO KHÁCH:</label>
                                        <input
                                            type="text"
                                            readOnly
                                            style={{ background: '#e2e8f0', fontWeight: 800, color: 'var(--navy-dark)' }}
                                            value={formatVND(change)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {method === 'VietQR' && (
                            <div style={{ marginTop: '15px', textAlign: 'center' }}>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                    Khách quét mã bên dưới để thanh toán đúng số tiền còn lại:
                                </p>
                                <img
                                    src={generateVietQRUrl(remaining, `QUYET TOAN ${booking?.id || 'BILL'}`)}
                                    alt="VietQR Checkout"
                                    style={{ width: '160px', height: '160px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '6px', background: '#fff' }}
                                />
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button className="btn btn-dark" onClick={onClose}>Đóng</button>
                        <button className="btn btn-outline-gold" onClick={() => window.print()}>
                            <i className="fa-solid fa-print"></i> In Hóa Đơn
                        </button>
                        <button className="btn btn-gold" onClick={handleConfirm}>
                            <i className="fa-solid fa-check-double"></i> Xác Nhận Đã Thu Đủ Tiền & Hoàn Tất Trả Phòng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// 7. MANUAL TRANSACTION MODAL
function ManualTxModal({ onClose, onCreateManualTx }) {
    const [customer, setCustomer] = useState('');
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('VietQR');
    const [reason, setReason] = useState('');

    const handleSubmit = e => {
        e.preventDefault();
        onCreateManualTx({
            customerName: customer.toUpperCase(),
            amount: parseInt(amount, 10),
            method,
            reason
        });
    };

    return (
        <div className="modal-overlay" style={{ display: 'flex' }}>
            <div className="modal-card">
                <div className="modal-header">
                    <h3>Ghi Nhận Thu Tiền / Đặt Cọc Trực Tiếp</h3>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Tên Khách Hàng</label>
                            <input
                                type="text"
                                placeholder="VD: Khách VIP Trịnh Thăng Bình"
                                required
                                value={customer}
                                onChange={e => setCustomer(e.target.value)}
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Số Tiền Thu (VNĐ)</label>
                                <input
                                    type="number"
                                    placeholder="VD: 1500000"
                                    required
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Hình Thức Thanh Toán</label>
                                <select value={method} onChange={e => setMethod(e.target.value)}>
                                    <option value="VietQR">Chuyển khoản VietQR</option>
                                    <option value="Tiền mặt">Tiền mặt tại quầy</option>
                                    <option value="Thẻ tín dụng">Thẻ tín dụng / POS</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Lý Do / Nội Dung Thu</label>
                            <input
                                type="text"
                                placeholder="VD: Đặt cọc phòng 301 / Phụ thu buffet"
                                required
                                value={reason}
                                onChange={e => setReason(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-gold" style={{ width: '100%', marginTop: '10px' }}>
                            <i className="fa-solid fa-file-invoice-dollar"></i> Lưu Giao Dịch Vào Sổ Quỹ
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

// 8. MY BOOKINGS MODAL
function MyBookingsModal({ currentUser, bookings, onClose }) {
    const myBookings = bookings.filter(b => {
        if (!currentUser) return false;
        if (b.userId && currentUser.id && b.userId === currentUser.id) return true;
        if (b.username && currentUser.username && b.username.toLowerCase() === currentUser.username.toLowerCase()) return true;
        if (currentUser.cccd && b.cccd && b.cccd === currentUser.cccd) return true;
        return false;
    });

    return (
        <div className="modal-overlay" style={{ display: 'flex' }}>
            <div className="modal-card modal-lg">
                <div className="modal-header">
                    <h3>Đơn Đặt Phòng Của Quý Khách</h3>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <div className="data-table-wrap">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Mã Đơn</th>
                                    <th>Phòng</th>
                                    <th>Tổng Tiền</th>
                                    <th>Đã Cọc</th>
                                    <th>Còn Lại</th>
                                    <th>Trạng Thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                                            Quý khách chưa có đơn đặt phòng nào. Hãy chọn phòng ngay!
                                        </td>
                                    </tr>
                                ) : (
                                    myBookings.map(b => {
                                        const badgeClass = b.status === 'Đã check-in' ? 'badge-occupied' : (b.status === 'Đã hoàn thành' ? 'badge-available' : 'badge-reserved');
                                        return (
                                            <tr key={b.id}>
                                                <td><strong>{b.id}</strong></td>
                                                <td>Phòng {b.roomId} - {b.roomName}</td>
                                                <td><strong>{formatVND(b.totalAmount)}</strong></td>
                                                <td><span className="status-badge badge-deposit">{formatVND(b.depositAmount)}</span></td>
                                                <td><strong style={{ color: 'var(--danger)' }}>{formatVND(b.remainingAmount)}</strong></td>
                                                <td><span className={`status-badge ${badgeClass}`}><span className="status-dot"></span> {b.status}</span></td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

// 9. NEW ROOM MODAL
function NewRoomModal({ onClose, onCreateRoom }) {
    const [num, setNum] = useState('');
    const [type, setType] = useState('Standard');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [img, setImg] = useState('');

    const handleSubmit = e => {
        e.preventDefault();
        onCreateRoom({
            id: num,
            name,
            type,
            price: parseInt(price, 10),
            image: img
        });
    };

    return (
        <div className="modal-overlay" style={{ display: 'flex' }}>
            <div className="modal-card">
                <div className="modal-header">
                    <h3>Thêm Phòng Khách Sạn Mới</h3>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Số Phòng</label>
                                <input type="text" placeholder="VD: 501" required value={num} onChange={e => setNum(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Hạng Phòng</label>
                                <select value={type} onChange={e => setType(e.target.value)}>
                                    <option value="Standard">Standard Deluxe</option>
                                    <option value="Superior">Superior Ocean</option>
                                    <option value="Suite">Executive Suite</option>
                                    <option value="Villa">Presidential Villa</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Tên Phòng Hiển Thị</label>
                                <input type="text" placeholder="VD: Horizon Sunset Suite" required value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Giá Mỗi Đêm (VNĐ)</label>
                                <input type="number" placeholder="VD: 2500000" required value={price} onChange={e => setPrice(e.target.value)} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Đường Dẫn Ảnh (URL)</label>
                            <input type="url" placeholder="https://... (không bắt buộc)" value={img} onChange={e => setImg(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-gold" style={{ width: '100%', marginTop: '10px' }}>
                            <i className="fa-solid fa-plus"></i> Thêm Phòng Vào Hệ Thống
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

// 10. STAFF MODAL
function StaffModal({ staffToEdit, rolesConfig, onClose, onSaveStaff }) {
    const initialRoleId = staffToEdit?.roleId || (Array.isArray(staffToEdit?.roles) && staffToEdit.roles[0]) || rolesConfig[0]?.id || 'receptionist';
    const [name, setName] = useState(staffToEdit?.name || staffToEdit?.fullName || '');
    const [username, setUsername] = useState(staffToEdit?.username || '');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState(staffToEdit?.email || '');
    const [phone, setPhone] = useState(staffToEdit?.phone || '');
    const [roleId, setRoleId] = useState(initialRoleId);
    const [status, setStatus] = useState(staffToEdit?.status || 'active');

    const handleSubmit = e => {
        e.preventDefault();
        onSaveStaff({
            editId: staffToEdit?.id,
            username: username || email,
            password,
            name,
            email,
            phone,
            roleId,
            status
        });
    };

    return (
        <div className="modal-overlay" style={{ display: 'flex' }}>
            <div className="modal-card">
                <div className="modal-header">
                    <h3>{staffToEdit ? `Chỉnh Sửa Nhân Sự (${staffToEdit.id})` : 'Thêm Nhân Sự Mới'}</h3>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Họ và Tên Nhân Viên</label>
                            <input type="text" placeholder="VD: Vũ Hoàng Long" required value={name} onChange={e => setName(e.target.value)} />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Tên Đăng Nhập</label>
                                <input type="text" placeholder="VD: long.vu" required value={username} onChange={e => setUsername(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Mật Khẩu {staffToEdit ? '(Để trống nếu không đổi)' : '*'}</label>
                                <input
                                    type="password"
                                    placeholder={staffToEdit ? 'Nhập mật khẩu mới nếu muốn đổi' : 'Tối thiểu 6 ký tự'}
                                    required={!staffToEdit}
                                    minLength={password ? 6 : undefined}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Email Nội Bộ</label>
                                <input type="email" placeholder="long.vu@grandhotel.vn" required value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Số Điện Thoại</label>
                                <input type="tel" placeholder="0912 345 678" required value={phone} onChange={e => setPhone(e.target.value)} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Phân Gán Vai Trò (Role)</label>
                                <select value={roleId} onChange={e => setRoleId(e.target.value)}>
                                    {rolesConfig.map(r => (
                                        <option key={r.id} value={r.id}>{r.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Trạng Thái Tài Khoản</label>
                                <select value={status} onChange={e => setStatus(e.target.value)}>
                                    <option value="active">Đang hoạt động</option>
                                    <option value="locked">Tạm khóa</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-gold" style={{ width: '100%', marginTop: '10px' }}>
                            <i className="fa-solid fa-user-check"></i> Lưu Thông Tin Nhân Sự
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

// 11. NEW ROLE MODAL
function NewRoleModal({ onClose, onCreateRole }) {
    const [name, setName] = useState('');
    const [id, setId] = useState('');
    const [color, setColor] = useState('#0284c7');
    const [desc, setDesc] = useState('');

    const handleSubmit = e => {
        e.preventDefault();
        onCreateRole({
            id: id.toLowerCase().replace(/\s+/g, '_'),
            name,
            badgeColor: color,
            description: desc || name
        });
    };

    return (
        <div className="modal-overlay" style={{ display: 'flex' }}>
            <div className="modal-card">
                <div className="modal-header">
                    <h3>Tạo Vai Trò Chức Danh Mới</h3>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Tên Vai Trò (Chức Danh)</label>
                            <input type="text" placeholder="VD: Quản Lý F&B Nhà Hàng" required value={name} onChange={e => setName(e.target.value)} />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Mã Vai Trò (ID không dấu)</label>
                                <input type="text" placeholder="VD: fnb_manager" required value={id} onChange={e => setId(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Màu Sắc Nhận Diện</label>
                                <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ height: '48px', padding: '4px' }} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Mô Tả Nhiệm Vụ</label>
                            <textarea rows="2" placeholder="Mô tả phạm vi trách nhiệm của vai trò..." value={desc} onChange={e => setDesc(e.target.value)}></textarea>
                        </div>
                        <button type="submit" className="btn btn-gold" style={{ width: '100%', marginTop: '10px' }}>
                            <i className="fa-solid fa-plus"></i> Khởi Tạo Vai Trò Mới
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
