import React, { useState, useEffect } from 'react';
import {
    STORAGE_KEYS,
    INITIAL_ROOMS,
    INITIAL_BOOKINGS,
    INITIAL_STAFF_USERS,
    INITIAL_ROLES,
    INITIAL_TRANSACTIONS,
    PERMISSION_GROUPS,
    DEFAULT_CCCD_FRONT,
    DEFAULT_CCCD_BACK,
    generateDefaultHistoricalRevenue,
    formatVND
} from './constants/initialData.js';

import ToastContainer from './components/ToastContainer.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import LandingRooms from './components/LandingRooms.jsx';
import Footer from './components/Footer.jsx';
import AdminSidebar from './components/AdminSidebar.jsx';
import AdminTopbar from './components/AdminTopbar.jsx';
import DashboardTab from './components/DashboardTab.jsx';
import RoomsTab from './components/RoomsTab.jsx';
import BookingsTab from './components/BookingsTab.jsx';
import LedgerTab from './components/LedgerTab.jsx';
import StaffTab from './components/StaffTab.jsx';
import PermissionsTab from './components/PermissionsTab.jsx';
import Modals from './components/Modals.jsx';

export default function App() {
    // LocalStorage Loaders
    const loadState = (key, fallback) => {
        try {
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : fallback;
        } catch {
            return fallback;
        }
    };

    // Global States
    const [rooms, setRooms] = useState(() => loadState(STORAGE_KEYS.ROOMS, INITIAL_ROOMS));
    const [bookings, setBookings] = useState(() => loadState(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS));
    const [staffUsers, setStaffUsers] = useState(() => loadState(STORAGE_KEYS.STAFF_USERS, INITIAL_STAFF_USERS));
    const [rolesConfig, setRolesConfig] = useState(() => loadState(STORAGE_KEYS.ROLES_CONFIG, INITIAL_ROLES));
    const [activeStaffId, setActiveStaffId] = useState(() => localStorage.getItem(STORAGE_KEYS.ACTIVE_STAFF_ID) || 'NV-001');
    const [transactions, setTransactions] = useState(() => loadState(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS));
    const [historicalRevenue, setHistoricalRevenue] = useState(() => loadState(STORAGE_KEYS.HISTORICAL_REVENUE, generateDefaultHistoricalRevenue()));
    const [currentUser, setCurrentUser] = useState(() => loadState(STORAGE_KEYS.USER, null));

    // UI View States
    const [viewMode, setViewMode] = useState('landing'); // 'landing' | 'admin'
    const [adminTab, setAdminTab] = useState('dashboard');
    const [currentFilter, setCurrentFilter] = useState('ALL');
    const [toasts, setToasts] = useState([]);

    // Modals
    const [activeModal, setActiveModal] = useState(null);
    const [modalData, setModalData] = useState(null);
    const [pendingBookingPayment, setPendingBookingPayment] = useState(null);

    // Search Parameters for Hero
    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const [searchParams, setSearchParams] = useState({
        checkIn: todayStr,
        checkOut: tomorrowStr,
        roomType: 'ALL',
        guests: '2'
    });

    // Auto-save to LocalStorage
    useEffect(() => { localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms)); }, [rooms]);
    useEffect(() => { localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings)); }, [bookings]);
    useEffect(() => { localStorage.setItem(STORAGE_KEYS.STAFF_USERS, JSON.stringify(staffUsers)); }, [staffUsers]);
    useEffect(() => { localStorage.setItem(STORAGE_KEYS.ROLES_CONFIG, JSON.stringify(rolesConfig)); }, [rolesConfig]);
    useEffect(() => { localStorage.setItem(STORAGE_KEYS.ACTIVE_STAFF_ID, activeStaffId); }, [activeStaffId]);
    useEffect(() => { localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions)); }, [transactions]);
    useEffect(() => { localStorage.setItem(STORAGE_KEYS.HISTORICAL_REVENUE, JSON.stringify(historicalRevenue)); }, [historicalRevenue]);
    useEffect(() => {
        if (currentUser) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
        else localStorage.removeItem(STORAGE_KEYS.USER);
    }, [currentUser]);

    // Toast Helper
    const addToast = (title, message, type = 'success') => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, title, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3600);
    };

    // Permission Checker
    const checkPermission = permKey => {
        const activeStaff = staffUsers.find(s => s.id === activeStaffId) || staffUsers[0];
        if (!activeStaff) return false;
        const role = rolesConfig.find(r => r.id === activeStaff.roleId);
        return !!(role && role.permissions && role.permissions[permKey]);
    };

    // Modal Control
    const openModal = (name, data = null) => {
        setActiveModal(name);
        setModalData(data);
    };
    const closeModal = () => {
        setActiveModal(null);
        setModalData(null);
    };

    // Search Functionality
    const handleSearch = () => {
        if (searchParams.checkIn && searchParams.checkOut && searchParams.checkIn >= searchParams.checkOut) {
            addToast('Ngày không hợp lệ', 'Ngày trả phòng phải sau ngày nhận phòng.', 'danger');
            return;
        }

        if (searchParams.roomType !== 'ALL') {
            setCurrentFilter(searchParams.roomType);
        } else {
            setCurrentFilter('ALL');
        }

        const roomSection = document.getElementById('rooms');
        if (roomSection) roomSection.scrollIntoView({ behavior: 'smooth' });
        addToast('Tìm kiếm thành công', 'Đã cập nhật danh sách các phòng khả dụng.', 'info');
    };

    // Authentication Handlers
    const handleLoginSuccess = ({ role, username }) => {
        let userObj = currentUser;
        if (role === 'customer') {
            if (!userObj || userObj.username !== username) {
                userObj = {
                    username,
                    name: username.toUpperCase(),
                    phone: '0901234567',
                    email: username.includes('@') ? username : `${username.toLowerCase()}@email.com`,
                    dob: '1995-05-15',
                    gender: 'Nam',
                    address: 'TP. Hồ Chí Minh',
                    cccd: '079095001234',
                    cccdDate: '2021-08-20',
                    cccdPlace: 'Cục CSQLHC về TTXH',
                    cccdFront: DEFAULT_CCCD_FRONT,
                    cccdBack: DEFAULT_CCCD_BACK,
                    role: 'customer',
                    avatar: username.charAt(0).toUpperCase()
                };
            }
        } else {
            userObj = {
                username,
                name: username,
                role: 'staff',
                avatar: username.charAt(0).toUpperCase()
            };
        }

        setCurrentUser(userObj);
        closeModal();

        if (role === 'staff') {
            setViewMode('admin');
            addToast('Đăng nhập thành công', `Chào mừng quản lý ${userObj.name} đến với Dashboard.`);
        } else {
            addToast('Đăng nhập thành công', `Chào mừng quý khách ${userObj.name} trở lại Grand Hotel.`);
        }
    };

    const handleRegisterSuccess = newUser => {
        setCurrentUser(newUser);
        closeModal();
        addToast('Đăng ký & Định danh CCCD hoàn tất!', `Hồ sơ căn cước của ${newUser.name} đã được kích hoạt.`, 'success');
    };

    const handleUpdateProfileSuccess = updatedUser => {
        setCurrentUser(updatedUser);
        closeModal();
        addToast('Cập nhật hồ sơ thành công', 'Thông tin cá nhân và ảnh CCCD đã được lưu trữ an toàn.', 'success');
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setViewMode('landing');
        addToast('Đã đăng xuất', 'Quý khách đã đăng xuất an toàn khỏi hệ thống.', 'info');
    };

    // Booking Handlers
    const handleBookRoomClick = room => {
        if (!currentUser) {
            addToast('Yêu cầu đăng nhập', 'Vui lòng đăng nhập hoặc đăng ký kèm CCCD để đặt phòng.', 'info');
            openModal('auth', { defaultRole: 'customer' });
            return;
        }

        if (room.status !== 'Trống') {
            addToast('Thông báo', 'Phòng này hiện không còn khả dụng.', 'danger');
            return;
        }

        openModal('booking', { room });
    };

    const handleSubmitBooking = bookingPayload => {
        const { room, customerName, phone, cccd, dob, checkIn, checkOut, nights, addons, grandTotal, depositNeeded, paymentMethod } = bookingPayload;
        const bookingId = 'BK-' + Math.floor(1000 + Math.random() * 9000);

        const newBooking = {
            id: bookingId,
            customerName,
            phone,
            cccd,
            cccdDate: currentUser?.cccdDate || '2021-08-20',
            cccdPlace: currentUser?.cccdPlace || 'Cục CSQLHC về TTXH',
            dob,
            cccdFront: currentUser?.cccdFront || DEFAULT_CCCD_FRONT,
            cccdBack: currentUser?.cccdBack || DEFAULT_CCCD_BACK,
            roomId: room.id,
            roomName: room.name,
            checkIn,
            checkOut,
            nights,
            addons,
            minibar: 0,
            totalAmount: grandTotal,
            depositAmount: depositNeeded,
            depositMethod: paymentMethod,
            paidAmount: paymentMethod === 'Tiền mặt' ? 0 : depositNeeded,
            remainingAmount: grandTotal - (paymentMethod === 'Tiền mặt' ? 0 : depositNeeded),
            status: 'Chờ check-in',
            createdAt: new Date().toISOString().split('T')[0]
        };

        if (paymentMethod === 'VietQR' && depositNeeded > 0) {
            setPendingBookingPayment(newBooking);
            closeModal();
            openModal('qrPayment', {
                amount: depositNeeded,
                bookingId,
                customerName
            });
        } else {
            finalizeBooking(newBooking);
            closeModal();
        }
    };

    const handleConfirmQrPaid = () => {
        if (!pendingBookingPayment) return;

        const newTx = {
            id: 'TX-' + Math.floor(100 + Math.random() * 900),
            bookingId: pendingBookingPayment.id,
            customerName: pendingBookingPayment.customerName,
            type: `Đặt cọc phòng (${formatVND(pendingBookingPayment.depositAmount)})`,
            method: 'VietQR',
            amount: pendingBookingPayment.depositAmount,
            date: new Date().toLocaleString('vi-VN'),
            staff: 'Cổng Online VietQR'
        };

        setTransactions(prev => [newTx, ...prev]);
        finalizeBooking(pendingBookingPayment);
        setPendingBookingPayment(null);
        closeModal();
        addToast('Xác nhận thành công!', `Đã nhận tiền cọc ${formatVND(pendingBookingPayment.depositAmount)} qua VietQR!`, 'success');
    };

    const finalizeBooking = booking => {
        setBookings(prev => [booking, ...prev]);
        setRooms(prev =>
            prev.map(r => (r.id === booking.roomId ? { ...r, status: 'Đã đặt', currentGuest: booking.customerName } : r))
        );
        addToast('Đặt phòng thành công!', `Mã đơn: ${booking.id}. Định danh CCCD đã hoàn tất.`, 'success');
    };

    // Admin Room Operations
    const handleQuickCheckIn = roomId => {
        const guestName = prompt('Nhập họ tên khách nhận phòng:', 'NGUYỄN VĂN HẢI');
        if (!guestName) return;

        const guestPhone = prompt('Nhập số điện thoại khách:', '0901234567') || '0901234567';
        const guestCccd = prompt('Nhập số CCCD khách:', '079095009988') || '079095009988';

        const room = rooms.find(r => r.id === roomId);
        if (!room) return;

        const bookingId = 'BK-' + Math.floor(1000 + Math.random() * 9000);
        const deposit = 500000;

        const newBooking = {
            id: bookingId,
            customerName: guestName.toUpperCase(),
            phone: guestPhone,
            cccd: guestCccd,
            cccdDate: '2021-08-20',
            cccdPlace: 'Cục CSQLHC về TTXH',
            dob: '1992-06-18',
            cccdFront: DEFAULT_CCCD_FRONT,
            cccdBack: DEFAULT_CCCD_BACK,
            roomId,
            roomName: room.name,
            checkIn: todayStr,
            checkOut: tomorrowStr,
            nights: 1,
            addons: [],
            minibar: 0,
            totalAmount: room.price,
            depositAmount: deposit,
            depositMethod: 'Tiền mặt',
            paidAmount: deposit,
            remainingAmount: room.price - deposit,
            status: 'Đã check-in',
            createdAt: todayStr
        };

        const newTx = {
            id: 'TX-' + Math.floor(100 + Math.random() * 900),
            bookingId,
            customerName: guestName.toUpperCase(),
            type: `Cọc trực tiếp phòng ${roomId}`,
            method: 'Tiền mặt',
            amount: deposit,
            date: new Date().toLocaleString('vi-VN'),
            staff: staffUsers.find(s => s.id === activeStaffId)?.name || 'Nhân viên lễ tân'
        };

        setRooms(prev =>
            prev.map(r => (r.id === roomId ? { ...r, status: 'Đang thuê', currentGuest: guestName.toUpperCase() } : r))
        );
        setBookings(prev => [newBooking, ...prev]);
        setTransactions(prev => [newTx, ...prev]);

        addToast('Check-in hoàn tất', `Phòng ${roomId} đã giao cho khách. Đã thu cọc ${formatVND(deposit)}.`, 'success');
    };

    const handleConfirmCheckIn = roomId => {
        setRooms(prev =>
            prev.map(r => (r.id === roomId ? { ...r, status: 'Đang thuê' } : r))
        );
        setBookings(prev =>
            prev.map(b => (b.roomId === roomId && b.status === 'Chờ check-in' ? { ...b, status: 'Đã check-in' } : b))
        );
        addToast('Check-in thành công', `Đã giao chìa khóa phòng ${roomId} cho khách.`, 'success');
    };

    const handleCompleteCleaning = roomId => {
        setRooms(prev =>
            prev.map(r => (r.id === roomId ? { ...r, status: 'Trống', currentGuest: null } : r))
        );
        addToast('Hoàn tất dọn phòng', `Phòng ${roomId} đã sạch sẽ và sẵn sàng đón khách mới!`, 'info');
    };

    const handleCancelBooking = bookingId => {
        if (!confirm(`Quý quản lý có chắc chắn muốn hủy đơn đặt ${bookingId}?`)) return;

        const b = bookings.find(item => item.id === bookingId);
        if (!b) return;

        setBookings(prev =>
            prev.map(item => (item.id === bookingId ? { ...item, status: 'Đã hủy' } : item))
        );
        setRooms(prev =>
            prev.map(r => (r.id === b.roomId && r.status === 'Đã đặt' ? { ...r, status: 'Trống', currentGuest: null } : r))
        );
        addToast('Đã hủy đơn', `Đơn ${bookingId} đã được hủy bỏ và mở lại phòng trống.`, 'info');
    };

    const handleOpenCheckoutModal = roomId => {
        const room = rooms.find(r => r.id === roomId);
        if (!room) return;
        const booking = bookings.find(b => b.roomId === roomId && b.status === 'Đã check-in') ||
                        bookings.find(b => b.roomId === roomId);
        openModal('checkout', { room, booking });
    };

    const handleFinalizeCheckout = ({ room, booking, remaining, method }) => {
        setRooms(prev =>
            prev.map(r => (r.id === room.id ? { ...r, status: 'Đang dọn', currentGuest: null } : r))
        );

        if (booking) {
            setBookings(prev =>
                prev.map(b =>
                    b.id === booking.id
                        ? { ...b, status: 'Đã hoàn thành', paidAmount: b.totalAmount, remainingAmount: 0 }
                        : b
                )
            );
        }

        if (remaining > 0) {
            const newTx = {
                id: 'TX-' + Math.floor(100 + Math.random() * 900),
                bookingId: booking ? booking.id : `P-${room.id}`,
                customerName: booking ? booking.customerName : 'Khách Lưu Trú',
                type: `Quyết toán trả phòng ${room.id}`,
                method,
                amount: remaining,
                date: new Date().toLocaleString('vi-VN'),
                staff: staffUsers.find(s => s.id === activeStaffId)?.name || 'Lễ tân'
            };
            setTransactions(prev => [newTx, ...prev]);
        }

        closeModal();
        addToast('Quyết toán hoàn tất!', `Phòng ${room.id} đã thu đủ tiền qua ${method} và chuyển sang buồng phòng dọn dẹp.`, 'success');
    };

    // Manual Transaction
    const handleCreateManualTx = txPayload => {
        const newTx = {
            id: 'TX-' + Math.floor(100 + Math.random() * 900),
            bookingId: 'THU-LE',
            customerName: txPayload.customerName,
            type: txPayload.reason,
            method: txPayload.method,
            amount: txPayload.amount,
            date: new Date().toLocaleString('vi-VN'),
            staff: staffUsers.find(s => s.id === activeStaffId)?.name || 'Thủ quỹ'
        };
        setTransactions(prev => [newTx, ...prev]);
        closeModal();
        addToast('Thu tiền thành công', `Đã ghi nhận +${formatVND(txPayload.amount)} từ ${txPayload.customerName} vào sổ quỹ.`, 'success');
    };

    // Room Creation
    const handleCreateRoom = roomPayload => {
        if (rooms.some(r => r.id === roomPayload.id)) {
            addToast('Lỗi số phòng', `Phòng số ${roomPayload.id} đã tồn tại trong hệ thống.`, 'danger');
            return;
        }

        const newRoom = {
            id: roomPayload.id,
            name: roomPayload.name,
            type: roomPayload.type,
            price: roomPayload.price,
            status: 'Trống',
            image: roomPayload.image,
            beds: 'Giường King Tiêu Chuẩn',
            view: 'Hướng biển & Thành phố',
            size: '50m²',
            maxGuests: 2,
            currentGuest: null
        };

        setRooms(prev => [...prev, newRoom]);
        closeModal();
        addToast('Thêm phòng thành công', `Đã kích hoạt phòng ${roomPayload.id} trên toàn hệ thống.`, 'success');
    };

    // Staff Management
    const handleSaveStaff = staffPayload => {
        if (staffPayload.editId) {
            setStaffUsers(prev =>
                prev.map(s =>
                    s.id === staffPayload.editId
                        ? {
                              ...s,
                              name: staffPayload.name,
                              email: staffPayload.email,
                              phone: staffPayload.phone,
                              roleId: staffPayload.roleId,
                              status: staffPayload.status
                          }
                        : s
                )
            );
            addToast('Cập nhật nhân sự', `Đã cập nhật thông tin cho ${staffPayload.name}.`, 'success');
        } else {
            const newId = 'NV-' + String(staffUsers.length + 1).padStart(3, '0');
            const newStaff = {
                id: newId,
                name: staffPayload.name,
                email: staffPayload.email,
                phone: staffPayload.phone,
                roleId: staffPayload.roleId,
                status: staffPayload.status,
                lastLogin: 'Vừa tạo'
            };
            setStaffUsers(prev => [...prev, newStaff]);
            addToast('Thêm nhân sự thành công', `Đã cấp tài khoản cho ${staffPayload.name} (${newId}).`, 'success');
        }
        closeModal();
    };

    const handleToggleStaffStatus = staffId => {
        setStaffUsers(prev =>
            prev.map(s => (s.id === staffId ? { ...s, status: s.status === 'active' ? 'locked' : 'active' } : s))
        );
        addToast('Đổi trạng thái tài khoản', 'Trạng thái nhân sự đã được cập nhật.', 'info');
    };

    const handleDeleteStaffUser = staffId => {
        if (!confirm(`Bạn có chắc muốn xóa tài khoản nhân viên ${staffId} khỏi hệ thống?`)) return;
        setStaffUsers(prev => prev.filter(s => s.id !== staffId));
        addToast('Đã xóa nhân sự', `Đã gỡ bỏ tài khoản ${staffId}.`, 'info');
    };

    // Role Matrix
    const handleCreateRole = rolePayload => {
        if (rolesConfig.some(r => r.id === rolePayload.id)) {
            addToast('Lỗi mã vai trò', `Mã vai trò '${rolePayload.id}' đã tồn tại trong hệ thống.`, 'danger');
            return;
        }

        const newRole = {
            id: rolePayload.id,
            name: rolePayload.name,
            badgeColor: rolePayload.badgeColor,
            description: rolePayload.description,
            permissions: { view_kpi: true, manage_rooms: false, manage_bookings: true }
        };

        setRolesConfig(prev => [...prev, newRole]);
        closeModal();
        addToast('Tạo vai trò mới', `Đã thêm vai trò '${rolePayload.name}' vào ma trận quyền hạn.`, 'success');
    };

    const handleResetRolesMatrix = () => {
        if (confirm('Khôi phục ma trận phân quyền về mặc định chuẩn 5 sao?')) {
            setRolesConfig(INITIAL_ROLES);
            addToast('Đã khôi phục', 'Ma trận quyền đã về trạng thái tiêu chuẩn ban đầu.', 'info');
        }
    };

    const handleSavePermissions = () => {
        localStorage.setItem(STORAGE_KEYS.ROLES_CONFIG, JSON.stringify(rolesConfig));
        addToast('Cấu hình thành công', 'Ma trận quyền hạn đã lưu an toàn vào LocalStorage.', 'success');
    };

    const handleResetDemoData = () => {
        if (confirm('Khôi phục toàn bộ danh sách phòng, đơn đặt phòng, sổ quỹ giao dịch, dữ liệu doanh thu 3 năm, nhân viên và phân quyền về ban đầu?')) {
            localStorage.clear();
            setRooms(INITIAL_ROOMS);
            setBookings(INITIAL_BOOKINGS);
            setStaffUsers(INITIAL_STAFF_USERS);
            setRolesConfig(INITIAL_ROLES);
            setActiveStaffId('NV-001');
            setTransactions(INITIAL_TRANSACTIONS);
            setHistoricalRevenue(generateDefaultHistoricalRevenue());
            addToast('Đã khôi phục toàn diện', 'Dữ liệu khách sạn, doanh thu 3 năm, thu chi và phân quyền đã được làm mới nguyên bản.', 'info');
        }
    };

    const handleTabChange = (tabId, requiredPerm) => {
        if (requiredPerm && !checkPermission(requiredPerm)) {
            addToast('Từ chối truy cập', 'Vai trò hiện tại không có quyền truy cập trang này.', 'danger');
            return;
        }
        setAdminTab(tabId);
    };

    const adminTabTitles = {
        'dashboard': 'Bảng Điều Khiển Tổng Quan',
        'rooms-management': 'Quản Lý Danh Sách & Trạng Thái Phòng',
        'bookings-management': 'Quản Lý Đơn Đặt Phòng & Định Danh CCCD Khách Lưu Trú',
        'financial-ledger': 'Sổ Quỹ Thu Chi & Giao Dịch Tiền Tệ (VietQR, Tiền Mặt, Thẻ)',
        'users-management': 'Quản Lý Phân Quyền & Nhân Sự Nội Bộ',
        'permissions-config': 'Cấu Hình Ma Trận Phân Quyền Vai Trò'
    };

    return (
        <div className="grand-hotel-react-app">
            <ToastContainer toasts={toasts} />

            {viewMode === 'landing' ? (
                <div id="landing-view">
                    <Navbar
                        currentUser={currentUser}
                        onOpenAuthModal={role => openModal('auth', { defaultRole: role })}
                        onOpenCustomerProfile={() => openModal('customerProfile')}
                        onOpenMyBookings={() => openModal('myBookings')}
                        onEnterAdmin={() => setViewMode('admin')}
                        onLogout={handleLogout}
                    />

                    <Hero
                        searchParams={searchParams}
                        setSearchParams={setSearchParams}
                        onSearch={handleSearch}
                    />

                    <LandingRooms
                        rooms={rooms}
                        currentFilter={currentFilter}
                        setCurrentFilter={setCurrentFilter}
                        onBookRoom={handleBookRoomClick}
                    />

                    <Footer />
                </div>
            ) : (
                <div id="admin-view" style={{ display: 'block' }}>
                    <div className="admin-layout">
                        <AdminSidebar
                            adminTab={adminTab}
                            onTabChange={handleTabChange}
                            onViewCustomerLanding={() => setViewMode('landing')}
                            onResetDemoData={handleResetDemoData}
                            checkPermission={checkPermission}
                        />

                        <main className="admin-content">
                            <AdminTopbar
                                title={adminTabTitles[adminTab] || 'Quản Trị'}
                                staffUsers={staffUsers}
                                rolesConfig={rolesConfig}
                                activeStaffId={activeStaffId}
                                onSwitchActiveStaff={id => {
                                    setActiveStaffId(id);
                                    addToast('Chuyển vai trò thành công', `Đang thao tác với tư cách nhân sự: ${staffUsers.find(s => s.id === id)?.name}`, 'info');
                                }}
                                onLogout={handleLogout}
                            />

                            <div className="admin-body">
                                {adminTab === 'dashboard' && (
                                    <DashboardTab
                                        rooms={rooms}
                                        bookings={bookings}
                                        transactions={transactions}
                                        historicalRevenue={historicalRevenue}
                                        checkPermission={checkPermission}
                                        onNavigateTab={tab => setAdminTab(tab)}
                                        addToast={addToast}
                                    />
                                )}

                                {adminTab === 'rooms-management' && (
                                    <RoomsTab
                                        rooms={rooms}
                                        checkPermission={checkPermission}
                                        onOpenNewRoomModal={() => openModal('newRoom')}
                                        onQuickCheckIn={handleQuickCheckIn}
                                        onConfirmCheckIn={handleConfirmCheckIn}
                                        onOpenCheckoutModal={handleOpenCheckoutModal}
                                        onCompleteCleaning={handleCompleteCleaning}
                                    />
                                )}

                                {adminTab === 'bookings-management' && (
                                    <BookingsTab
                                        bookings={bookings}
                                        checkPermission={checkPermission}
                                        onQuickWalkInBooking={() => handleQuickCheckIn('101')}
                                        onOpenCccdView={b => openModal('adminCccdView', b)}
                                        onConfirmCheckIn={handleConfirmCheckIn}
                                        onOpenCheckoutModal={handleOpenCheckoutModal}
                                        onCancelBooking={handleCancelBooking}
                                    />
                                )}

                                {adminTab === 'financial-ledger' && (
                                    <LedgerTab
                                        transactions={transactions}
                                        bookings={bookings}
                                        checkPermission={checkPermission}
                                        onOpenManualTxModal={() => openModal('manualTx')}
                                    />
                                )}

                                {adminTab === 'users-management' && (
                                    <StaffTab
                                        staffUsers={staffUsers}
                                        rolesConfig={rolesConfig}
                                        checkPermission={checkPermission}
                                        onOpenAddStaffModal={() => openModal('staff')}
                                        onOpenEditStaffModal={s => openModal('staff', { staff: s })}
                                        onToggleStaffStatus={handleToggleStaffStatus}
                                        onDeleteStaffUser={handleDeleteStaffUser}
                                    />
                                )}

                                {adminTab === 'permissions-config' && (
                                    <PermissionsTab
                                        rolesConfig={rolesConfig}
                                        setRolesConfig={setRolesConfig}
                                        permissionGroups={PERMISSION_GROUPS}
                                        onOpenNewRoleModal={() => openModal('newRole')}
                                        onResetRolesMatrix={handleResetRolesMatrix}
                                        onSavePermissions={handleSavePermissions}
                                    />
                                )}
                            </div>
                        </main>
                    </div>
                </div>
            )}

            <Modals
                activeModal={activeModal}
                modalData={modalData}
                onCloseModal={closeModal}
                currentUser={currentUser}
                onLoginSuccess={handleLoginSuccess}
                onRegisterSuccess={handleRegisterSuccess}
                onUpdateProfileSuccess={handleUpdateProfileSuccess}
                onSubmitBooking={handleSubmitBooking}
                onConfirmQrPaid={handleConfirmQrPaid}
                onFinalizeCheckout={handleFinalizeCheckout}
                onCreateManualTx={handleCreateManualTx}
                onCreateRoom={handleCreateRoom}
                onSaveStaff={handleSaveStaff}
                onCreateRole={handleCreateRole}
                bookings={bookings}
                rooms={rooms}
                rolesConfig={rolesConfig}
            />
        </div>
    );
}
