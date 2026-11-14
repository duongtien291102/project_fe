/**
 * ============================================================================
 * CONTROLLER: useHotelController
 * ============================================================================
 * Điều phối toàn bộ trạng thái dữ liệu (Models), logic nghiệp vụ khách sạn 5 sao,
 * và cung cấp dữ liệu + hành động cho các tầng hiển thị (Views).
 */

import { useState, useEffect } from 'react';
import { StorageService, STORAGE_KEYS } from '../models/StorageService.js';
import { createRoomInstance } from '../models/RoomModel.js';
import { hasPermission } from '../models/UserModel.js';
import { formatVND } from '../models/TransactionModel.js';
import { generateDefaultHistoricalRevenue, buildDynamicHistoricalRevenue } from '../models/RevenueModel.js';
import { ApiService } from '../models/ApiService.js';

function checkIsSysAdmin(user) {
    return Boolean(
        user && (
            user.roleId === 'ROLE_SYSADMIN' ||
            (Array.isArray(user.roles) && user.roles.includes('ROLE_SYSADMIN'))
        )
    );
}

function generateUniqueId(prefix) {
    if (typeof window !== 'undefined' && window.crypto && typeof window.crypto.randomUUID === 'function') {
        return `${prefix}-${window.crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()}`;
    }
    const rand = Math.floor(Math.random() * 0xFFFFFFFF).toString(16).toUpperCase().padStart(8, '0');
    return `${prefix}-${Date.now().toString(36).toUpperCase()}${rand.slice(0, 4)}`;
}

function normalizeAuthUser(authData) {
    if (!authData) return null;
    const roles = Array.isArray(authData.roles) ? authData.roles : [];
    const isStaffOrAdmin = roles.some(r => r && r !== 'ROLE_USER');
    const resolvedRoleId = authData.roleId || (roles.includes('ROLE_SYSADMIN') ? 'ROLE_SYSADMIN' : (roles[0] || 'ROLE_USER'));
    const displayName = authData.name || authData.fullName || authData.username || '';
    return {
        id: authData.id,
        staffId: isStaffOrAdmin ? authData.id : null,
        username: authData.username,
        name: displayName,
        fullName: authData.fullName || displayName,
        email: authData.email || '',
        phone: authData.phone || '',
        dob: authData.dob || '',
        gender: authData.gender || 'Nam',
        nationality: authData.nationality || 'Việt Nam',
        address: authData.address || '',
        cccd: authData.cccd || '',
        cccdDate: authData.cccdDate || '',
        cccdPlace: authData.cccdPlace || '',
        cccdFront: authData.cccdFront || '',
        cccdBack: authData.cccdBack || '',
        avatar: authData.avatar || (displayName ? displayName.charAt(0).toUpperCase() : 'U'),
        role: isStaffOrAdmin ? 'staff' : 'customer',
        roleId: resolvedRoleId,
        roleName: authData.roleName || (isStaffOrAdmin ? resolvedRoleId : 'Khách Hàng'),
        roles,
        effectivePermissions: authData.effectivePermissions || {},
        hasAdminAccess: isStaffOrAdmin
    };
}

export const ADMIN_TAB_TITLES = {
    'dashboard': 'Dashboard',
    'rooms-management': 'Quản Lý Danh Sách & Trạng Thái Phòng',
    'bookings-management': 'Quản Lý Đơn Đặt Phòng & Định Danh CCCD Khách Lưu Trú',
    'financial-ledger': 'Sổ Quỹ Thu Chi & Giao Dịch Tiền Tệ (VietQR, Tiền Mặt, Thẻ)',
    'users-management': 'Quản Trị Viên & Danh Sách Nhân Sự Nội Bộ',
    'permissions-config': 'Cấu Hình Ma Trận Phân Quyền Vai Trò'
};

export function useHotelController() {
    // -------------------------------------------------------------
    // Global Models State (100% Real Data from Backend & MongoDB Atlas)
    // -------------------------------------------------------------
    const [rooms, setRooms] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [staffUsers, setStaffUsers] = useState([]);
    const [rolesConfig, setRolesConfig] = useState([]);
    const [activeStaffId, setActiveStaffId] = useState(() => StorageService.get(STORAGE_KEYS.ACTIVE_STAFF_ID, ''));
    const [transactions, setTransactions] = useState([]);
    const [historicalRevenue, setHistoricalRevenue] = useState(() => generateDefaultHistoricalRevenue());
    const [authToken, setAuthToken] = useState(() => StorageService.get(STORAGE_KEYS.AUTH_TOKEN, null));
    const [currentUser, setCurrentUser] = useState(() => {
        const token = StorageService.get(STORAGE_KEYS.AUTH_TOKEN, null);
        if (!token) return null;
        const u = StorageService.get(STORAGE_KEYS.USER, null);
        if (u) {
            if (u.role === 'customer' || u.role === 'user') {
                return {
                    ...u,
                    role: 'customer',
                    hasAdminAccess: false
                };
            }
            if (u.role === 'staff' || u.role === 'admin' || u.hasAdminAccess === true) {
                return {
                    ...u,
                    role: 'staff',
                    hasAdminAccess: true
                };
            }
        }
        return u;
    });
    const [isBackendConnected, setIsBackendConnected] = useState(false);
    const isSysAdminUser = checkIsSysAdmin(currentUser);

    // -------------------------------------------------------------
    // Live Sync with Backend Spring Boot & MongoDB Atlas (Auth-Aware)
    // -------------------------------------------------------------
    async function syncAtlasData(knownUser = null, tokenOverride = null) {
        try {
            const token = tokenOverride || StorageService.get(STORAGE_KEYS.AUTH_TOKEN, null);
            const dbRoomsPromise = ApiService.getRooms();

            if (!token) {
                const dbRooms = await dbRoomsPromise;
                if (Array.isArray(dbRooms)) {
                    setRooms(dbRooms);
                    setIsBackendConnected(true);
                }
                setBookings([]);
                setTransactions([]);
                setStaffUsers([]);
                setRolesConfig([]);
                return;
            }

            let effectiveUser = knownUser;
            if (!effectiveUser) {
                const meRes = await ApiService.getMe(token);
                if (meRes) {
                    if (meRes.ok && meRes.data) {
                        effectiveUser = normalizeAuthUser(meRes.data);
                        setCurrentUser(effectiveUser);
                        if (effectiveUser?.hasAdminAccess && effectiveUser.id) {
                            setActiveStaffId(prev => (checkIsSysAdmin(effectiveUser) && prev) ? prev : effectiveUser.id);
                        }
                    } else if (meRes.status === 401 || meRes.status === 403) {
                        setAuthToken(null);
                        StorageService.set(STORAGE_KEYS.AUTH_TOKEN, null);
                        setCurrentUser(null);
                        setBookings([]);
                        setTransactions([]);
                        setStaffUsers([]);
                        setRolesConfig([]);
                        setViewMode('landing');
                        const dbRooms = await dbRoomsPromise;
                        if (Array.isArray(dbRooms)) setRooms(dbRooms);
                        return;
                    }
                }
            }

            const hasStaffAccess = Boolean(effectiveUser?.hasAdminAccess);
            const [dbRooms, dbBookings, dbRoles, dbTransactions, dbStaff] = await Promise.all([
                dbRoomsPromise,
                ApiService.getBookings().catch(() => null),
                ApiService.getRoles().catch(() => null),
                hasStaffAccess ? ApiService.getTransactions().catch(() => null) : Promise.resolve([]),
                hasStaffAccess ? ApiService.getStaff().catch(() => null) : Promise.resolve([])
            ]);

            if (Array.isArray(dbRooms)) setRooms(dbRooms);
            if (Array.isArray(dbBookings)) setBookings(dbBookings);
            if (Array.isArray(dbRoles)) setRolesConfig(dbRoles);
            if (Array.isArray(dbTransactions)) {
                setTransactions(dbTransactions);
                setHistoricalRevenue(buildDynamicHistoricalRevenue(dbTransactions, dbBookings || [], dbRooms || []));
            }
            if (Array.isArray(dbStaff)) {
                setStaffUsers(dbStaff);
                if (effectiveUser?.id) {
                    setActiveStaffId(prev => (checkIsSysAdmin(effectiveUser) && prev) ? prev : effectiveUser.id);
                }
            }

            if (dbRooms || dbBookings || dbTransactions || dbStaff || dbRoles) {
                setIsBackendConnected(true);
            }
        } catch (err) {
            console.warn('[useHotelController] Lỗi nạp dữ liệu từ Atlas:', err);
        }
    }

    useEffect(() => {
        syncAtlasData();
    }, []);

    // Tự động tính toán lại dữ liệu doanh thu từ các giao dịch thực tế
    useEffect(() => {
        if (transactions && transactions.length > 0) {
            const dynamicRev = buildDynamicHistoricalRevenue(transactions, bookings, rooms);
            setHistoricalRevenue(dynamicRev);
        } else {
            setHistoricalRevenue(generateDefaultHistoricalRevenue());
        }
    }, [transactions, bookings, rooms]);

    // -------------------------------------------------------------
    // UI View Navigation State: Không phải quyền user -> Vào thẳng trang quản trị
    // -------------------------------------------------------------
    const [viewMode, setViewMode] = useState(() => {
        const token = StorageService.get(STORAGE_KEYS.AUTH_TOKEN, null);
        const u = token ? StorageService.get(STORAGE_KEYS.USER, null) : null;
        if (u) {
            const isCustomer = u.role === 'customer' || u.role === 'user';
            if (!isCustomer && (u.role === 'staff' || u.role === 'admin' || u.hasAdminAccess === true)) {
                return 'admin';
            }
        }
        return 'landing';
    });
    const [adminTab, setAdminTab] = useState('dashboard');
    const [currentFilter, setCurrentFilter] = useState('ALL');
    const [toasts, setToasts] = useState([]);

    // -------------------------------------------------------------
    // Modal Interaction State
    // -------------------------------------------------------------
    const [activeModal, setActiveModal] = useState(null);
    const [modalData, setModalData] = useState(null);
    const [pendingBookingPayment, setPendingBookingPayment] = useState(null);

    // -------------------------------------------------------------
    // Search Filter State (Landing Hero)
    // -------------------------------------------------------------
    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const [searchParams, setSearchParams] = useState({
        checkIn: todayStr,
        checkOut: tomorrowStr,
        roomType: 'ALL',
        guests: '2'
    });

    // -------------------------------------------------------------
    // Sync auth session & active role with LocalStorage via StorageService
    // -------------------------------------------------------------
    useEffect(() => { StorageService.set(STORAGE_KEYS.ACTIVE_STAFF_ID, activeStaffId); }, [activeStaffId]);
    useEffect(() => { StorageService.set(STORAGE_KEYS.USER, currentUser); }, [currentUser]);
    useEffect(() => { StorageService.set(STORAGE_KEYS.AUTH_TOKEN, authToken); }, [authToken]);

    // -------------------------------------------------------------
    // Notification Service (Toast)
    // -------------------------------------------------------------
    const addToast = (title, message, type = 'success') => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, title, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3600);
    };

    // -------------------------------------------------------------
    // Permission Verification Service (RBAC)
    // -------------------------------------------------------------
    const handleSetActiveStaffId = newStaffId => {
        if (!isSysAdminUser) {
            setActiveStaffId(currentUser?.id || '');
            return;
        }
        setActiveStaffId(newStaffId);
    };

    const checkPermission = permKey => {
        if (!currentUser || (currentUser.role === 'customer' && !currentUser.hasAdminAccess)) {
            return false;
        }
        if (isSysAdminUser) {
            const simulatedStaff = staffUsers.find(s => s.id === activeStaffId);
            if (simulatedStaff) {
                return hasPermission(simulatedStaff, rolesConfig, permKey);
            }
        }
        if (currentUser.effectivePermissions && currentUser.effectivePermissions[permKey] !== undefined) {
            return !!currentUser.effectivePermissions[permKey];
        }
        return hasPermission(currentUser, rolesConfig, permKey);
    };

    // -------------------------------------------------------------
    // Modal Helpers
    // -------------------------------------------------------------
    const openModal = (name, data = null) => {
        setActiveModal(name);
        setModalData(data);
    };

    const closeModal = () => {
        setActiveModal(null);
        setModalData(null);
    };

    // -------------------------------------------------------------
    // Business Logic: Search
    // -------------------------------------------------------------
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

    // -------------------------------------------------------------
    // Business Logic: Authentication & Profile (100% Backend JWT Auth)
    // -------------------------------------------------------------
    const handleLoginSuccess = async ({ username, password }) => {
        if (!username || !username.trim() || !password) {
            addToast('Lỗi đăng nhập', 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.', 'danger');
            return;
        }

        const res = await ApiService.login(username.trim(), password);
        if (!res.ok || !res.data || !res.data.token) {
            addToast('Đăng nhập thất bại', res.message || 'Tài khoản hoặc mật khẩu không chính xác.', 'danger');
            return;
        }

        const userObj = normalizeAuthUser(res.data);
        setAuthToken(res.data.token);
        StorageService.set(STORAGE_KEYS.AUTH_TOKEN, res.data.token);
        setCurrentUser(userObj);
        closeModal();

        if (userObj.hasAdminAccess) {
            setActiveStaffId(userObj.id);
            setViewMode('admin');
            addToast('Đăng nhập Quản Trị thành công', `Chào mừng ${userObj.roleName || 'Quản lý'} ${userObj.name} vào hệ thống quản trị.`);
        } else {
            setActiveStaffId('');
            setViewMode('landing');
            addToast('Đăng nhập thành công', `Chào mừng quý khách ${userObj.name} đến với Grand Hotel.`);
        }
        await syncAtlasData(userObj, res.data.token);
    };

    const handleRegisterSuccess = async newUser => {
        const payload = {
            username: newUser.username || newUser.email,
            password: newUser.password,
            fullName: newUser.fullName || newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            dob: newUser.dob,
            gender: newUser.gender,
            nationality: newUser.nationality,
            address: newUser.address,
            cccd: newUser.cccd,
            cccdDate: newUser.cccdDate,
            cccdPlace: newUser.cccdPlace,
            cccdFront: newUser.cccdFront,
            cccdBack: newUser.cccdBack,
            avatar: newUser.avatar
        };

        const res = await ApiService.register(payload);
        if (!res.ok || !res.data || !res.data.token) {
            addToast('Đăng ký thất bại', res.message || 'Không thể đăng ký tài khoản trên máy chủ.', 'danger');
            return;
        }

        const userObj = normalizeAuthUser(res.data);
        setAuthToken(res.data.token);
        StorageService.set(STORAGE_KEYS.AUTH_TOKEN, res.data.token);
        setCurrentUser(userObj);
        setActiveStaffId('');
        closeModal();
        setViewMode('landing');
        addToast('Đăng ký & Định danh CCCD hoàn tất!', `Hồ sơ căn cước của ${userObj.name} đã được kích hoạt trên hệ thống.`, 'success');
        await syncAtlasData(userObj, res.data.token);
    };

    const handleUpdateProfileSuccess = async updatedUser => {
        const res = await ApiService.updateProfile(authToken, {
            fullName: updatedUser.name,
            name: updatedUser.name,
            phone: updatedUser.phone,
            dob: updatedUser.dob,
            gender: updatedUser.gender,
            nationality: updatedUser.nationality,
            address: updatedUser.address,
            cccd: updatedUser.cccd,
            cccdDate: updatedUser.cccdDate,
            cccdPlace: updatedUser.cccdPlace,
            cccdFront: updatedUser.cccdFront,
            cccdBack: updatedUser.cccdBack,
            avatar: updatedUser.avatar
        });

        if (!res.ok || !res.data) {
            addToast('Cập nhật thất bại', res.message || 'Không thể lưu thay đổi hồ sơ lên cơ sở dữ liệu.', 'danger');
            return;
        }

        const userObj = normalizeAuthUser(res.data);
        setCurrentUser(userObj);
        closeModal();
        addToast('Cập nhật hồ sơ thành công', 'Thông tin cá nhân và ảnh CCCD đã được lưu trữ lên cơ sở dữ liệu.', 'success');
    };

    const handleLogout = () => {
        setAuthToken(null);
        StorageService.set(STORAGE_KEYS.AUTH_TOKEN, null);
        StorageService.set(STORAGE_KEYS.ACTIVE_STAFF_ID, '');
        setCurrentUser(null);
        setActiveStaffId('');
        setBookings([]);
        setTransactions([]);
        setStaffUsers([]);
        setRolesConfig([]);
        setPendingBookingPayment(null);
        setViewMode('landing');
        addToast('Đã đăng xuất', 'Quý khách đã đăng xuất an toàn khỏi hệ thống.', 'info');
    };

    // -------------------------------------------------------------
    // Business Logic: Booking & Payments
    // -------------------------------------------------------------
    const handleBookRoomClick = room => {
        if (!currentUser) {
            addToast('Yêu cầu đăng nhập', 'Vui lòng đăng nhập hoặc đăng ký kèm CCCD để đặt phòng.', 'info');
            openModal('auth');
            return;
        }

        if (room.status !== 'Trống') {
            addToast('Thông báo', 'Phòng này hiện không còn khả dụng.', 'danger');
            return;
        }

        openModal('booking', { room });
    };

    const handleSubmitBooking = async bookingPayload => {
        const {
            room, customerName, phone, cccd, dob,
            cccdDate, cccdPlace, cccdFront, cccdBack,
            checkIn, checkOut, nights, addons,
            grandTotal, depositNeeded, paymentMethod, isWalkIn
        } = bookingPayload;
        const bookingId = generateUniqueId('BK');
        const bookingStatus = isWalkIn ? 'Đã check-in' : 'Chờ check-in';
        const isPendingOnlineVietQR = paymentMethod === 'VietQR' && !isWalkIn && !currentUser?.hasAdminAccess;
        const paidAmount = ((paymentMethod === 'Tiền mặt' && !isWalkIn) || isPendingOnlineVietQR) ? 0 : depositNeeded;

        const newBooking = {
            id: bookingId,
            userId: !isWalkIn ? (currentUser?.id || null) : null,
            username: !isWalkIn ? (currentUser?.username || null) : null,
            customerName,
            phone,
            cccd,
            cccdDate: cccdDate || (!isWalkIn ? (currentUser?.cccdDate || '') : ''),
            cccdPlace: cccdPlace || (!isWalkIn ? (currentUser?.cccdPlace || '') : ''),
            dob,
            cccdFront: cccdFront || (!isWalkIn ? (currentUser?.cccdFront || '') : ''),
            cccdBack: cccdBack || (!isWalkIn ? (currentUser?.cccdBack || '') : ''),
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
            paidAmount,
            remainingAmount: grandTotal - paidAmount,
            status: bookingStatus,
            createdAt: new Date().toISOString().split('T')[0]
        };

        if (paymentMethod === 'VietQR' && depositNeeded > 0 && !isWalkIn) {
            setPendingBookingPayment(newBooking);
            closeModal();
            openModal('qrPayment', {
                amount: depositNeeded,
                bookingId,
                customerName
            });
        } else {
            await finalizeBooking(newBooking);
            if (isWalkIn && depositNeeded > 0) {
                const newTx = {
                    id: generateUniqueId('TX'),
                    bookingId,
                    customerName,
                    type: `Thu cọc trực tiếp phòng ${room.id}`,
                    method: paymentMethod,
                    amount: depositNeeded,
                    date: new Date().toLocaleString('vi-VN'),
                    staff: staffUsers.find(s => s.id === activeStaffId)?.name || currentUser?.name || 'Nhân viên lễ tân',
                    year: new Date().getFullYear(),
                    month: new Date().getMonth() + 1,
                    status: 'Đã hoàn tất'
                };
                setTransactions(prev => [newTx, ...prev]);
                try {
                    await ApiService.createTransaction(newTx);
                } catch (err) {
                    console.warn('[useHotelController] Lỗi ghi tx walk-in lên Atlas:', err);
                }
            }
            closeModal();
        }
    };

    const handleConfirmQrPaid = async () => {
        if (!pendingBookingPayment) return;

        const savedBooking = await finalizeBooking(pendingBookingPayment);
        const targetBookingId = savedBooking?.id || pendingBookingPayment.id;
        const newTx = {
            id: generateUniqueId('TX'),
            bookingId: targetBookingId,
            customerName: pendingBookingPayment.customerName,
            type: `Đặt cọc phòng (${formatVND(pendingBookingPayment.depositAmount)})`,
            method: 'VietQR',
            amount: pendingBookingPayment.depositAmount,
            date: new Date().toLocaleString('vi-VN'),
            staff: 'Cổng Online VietQR',
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            status: 'Chờ xác nhận'
        };

        setTransactions(prev => [newTx, ...prev]);
        setPendingBookingPayment(null);
        closeModal();
        addToast(
            'Đặt phòng thành công!',
            `Đã ghi nhận thông báo chuyển khoản ${formatVND(pendingBookingPayment.depositAmount)} qua VietQR (đang chờ lễ tân xác nhận).`,
            'info'
        );

        try {
            await ApiService.createTransaction(newTx);
        } catch (err) {
            console.warn('[useHotelController] Lỗi ghi tx lên Atlas:', err);
        }
    };

    const finalizeBooking = async booking => {
        const nextRoomStatus = booking.status === 'Đã check-in' ? 'Đang thuê' : 'Đã đặt';
        setBookings(prev => [booking, ...prev]);
        setRooms(prev =>
            prev.map(r => (r.id === booking.roomId ? { ...r, status: nextRoomStatus, currentGuest: booking.customerName } : r))
        );

        let persisted = booking;
        try {
            const saved = await ApiService.createBooking(booking);
            if (saved && saved.id) {
                persisted = saved;
                setBookings(prev => [saved, ...prev.filter(b => b.id !== booking.id && b.id !== saved.id)]);
            }
        } catch (err) {
            console.warn('[useHotelController] Lỗi ghi booking lên Atlas:', err);
        }

        addToast(
            persisted.status === 'Đã check-in' ? 'Check-in hoàn tất!' : 'Đặt phòng thành công!',
            `Mã đơn: ${persisted.id}. Định danh CCCD đã hoàn tất.`,
            'success'
        );
        return persisted;
    };

    // -------------------------------------------------------------
    // Business Logic: Admin Front-Desk & Room Operations
    // -------------------------------------------------------------
    const handleQuickCheckIn = roomId => {
        const targetRoom = roomId
            ? rooms.find(r => r.id === roomId)
            : (rooms.find(r => r.status === 'Trống') || rooms[0]);
        if (!targetRoom) {
            addToast('Không có phòng khả dụng', 'Hiện không có phòng trống để nhận khách trực tiếp.', 'danger');
            return;
        }
        openModal('booking', { room: targetRoom, isWalkIn: true });
    };

    const handleConfirmCheckIn = async roomId => {
        setRooms(prev =>
            prev.map(r => (r.id === roomId ? { ...r, status: 'Đang thuê' } : r))
        );
        const targetBooking = bookings.find(b => b.roomId === roomId && b.status === 'Chờ check-in');
        setBookings(prev =>
            prev.map(b => (b.roomId === roomId && b.status === 'Chờ check-in' ? { ...b, status: 'Đã check-in' } : b))
        );
        addToast('Check-in thành công', `Đã giao chìa khóa phòng ${roomId} cho khách.`, 'success');

        if (targetBooking) {
            try {
                await ApiService.updateBookingStatus(targetBooking.id, 'Đã check-in');
            } catch (err) {
                console.warn('[useHotelController] Lỗi cập nhật check-in:', err);
            }
        }
    };

    const handleCompleteCleaning = async roomId => {
        setRooms(prev =>
            prev.map(r => (r.id === roomId ? { ...r, status: 'Trống', currentGuest: null } : r))
        );
        addToast('Hoàn tất dọn phòng', `Phòng ${roomId} đã sạch sẽ và sẵn sàng đón khách mới!`, 'info');
        const targetRoom = rooms.find(r => r.id === roomId);
        if (targetRoom) {
            try {
                await ApiService.saveRoom({ ...targetRoom, status: 'Trống', currentGuest: null });
            } catch (err) {
                console.warn('[useHotelController] Lỗi cập nhật trạng thái phòng:', err);
            }
        }
    };

    const handleCancelBooking = async bookingId => {
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

        try {
            await ApiService.updateBookingStatus(bookingId, 'Đã hủy');
        } catch (err) {
            console.warn('[useHotelController] Lỗi hủy đơn trên Atlas:', err);
        }
    };

    const handleOpenCheckoutModal = roomId => {
        const room = rooms.find(r => r.id === roomId);
        if (!room) return;
        const booking = bookings.find(b => b.roomId === roomId && b.status === 'Đã check-in') ||
                        bookings.find(b => b.roomId === roomId);
        openModal('checkout', { room, booking });
    };

    const handleFinalizeCheckout = async ({ room, booking, remaining, method }) => {
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

        let newTx = null;
        if (remaining > 0) {
            newTx = {
                id: generateUniqueId('TX'),
                bookingId: booking ? booking.id : `P-${room.id}`,
                customerName: booking ? booking.customerName : 'Khách Lưu Trú',
                type: `Quyết toán trả phòng ${room.id}`,
                method,
                amount: remaining,
                date: new Date().toLocaleString('vi-VN'),
                staff: staffUsers.find(s => s.id === activeStaffId)?.name || currentUser?.name || 'Lễ tân',
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1,
                status: 'Đã hoàn tất'
            };
            setTransactions(prev => [newTx, ...prev]);
        }

        closeModal();
        addToast('Quyết toán hoàn tất!', `Phòng ${room.id} đã thu đủ tiền qua ${method} và chuyển sang buồng phòng dọn dẹp.`, 'success');

        try {
            if (booking) {
                await ApiService.updateBookingStatus(booking.id, 'Đã hoàn thành', booking.totalAmount, 0);
            }
            await ApiService.saveRoom({ ...room, status: 'Đang dọn', currentGuest: null });
            if (newTx) {
                await ApiService.createTransaction(newTx);
            }
        } catch (err) {
            console.warn('[useHotelController] Lỗi cập nhật checkout lên Atlas:', err);
        }
    };

    // -------------------------------------------------------------
    // Business Logic: Financial Ledger & Manual Transactions
    // -------------------------------------------------------------
    const handleCreateManualTx = async txPayload => {
        const newTx = {
            id: generateUniqueId('TX'),
            bookingId: 'THU-LE',
            customerName: txPayload.customerName,
            type: txPayload.reason,
            method: txPayload.method,
            amount: txPayload.amount,
            date: new Date().toLocaleString('vi-VN'),
            staff: staffUsers.find(s => s.id === activeStaffId)?.name || currentUser?.name || 'Thủ quỹ',
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            status: 'Đã hoàn tất'
        };
        setTransactions(prev => [newTx, ...prev]);
        closeModal();
        addToast('Thu tiền thành công', `Đã ghi nhận +${formatVND(txPayload.amount)} từ ${txPayload.customerName} vào sổ quỹ.`, 'success');

        try {
            await ApiService.createTransaction(newTx);
        } catch (err) {
            console.warn('[useHotelController] Lỗi ghi manual tx lên Atlas:', err);
        }
    };

    // -------------------------------------------------------------
    // Business Logic: Room Creation
    // -------------------------------------------------------------
    const handleCreateRoom = async roomPayload => {
        if (rooms.some(r => r.id === roomPayload.id)) {
            addToast('Lỗi số phòng', `Phòng số ${roomPayload.id} đã tồn tại trong hệ thống.`, 'danger');
            return;
        }

        const newRoom = createRoomInstance(roomPayload);
        setRooms(prev => [...prev, newRoom]);
        closeModal();
        addToast('Thêm phòng thành công', `Đã kích hoạt phòng ${roomPayload.id} trên toàn hệ thống.`, 'success');

        try {
            await ApiService.saveRoom(newRoom);
        } catch (err) {
            console.warn('[useHotelController] Lỗi lưu room lên Atlas:', err);
        }
    };

    // -------------------------------------------------------------
    // Business Logic: Staff Management
    // -------------------------------------------------------------
    const handleSaveStaff = async staffPayload => {
        const matchedRole = rolesConfig.find(role => role.id === staffPayload.roleId);
        const resolvedRoleName = matchedRole ? matchedRole.name : staffPayload.roleId;

        if (staffPayload.editId) {
            setStaffUsers(prev =>
                prev.map(s =>
                    s.id === staffPayload.editId
                        ? {
                              ...s,
                              username: staffPayload.username || s.username,
                              name: staffPayload.name,
                              fullName: staffPayload.name,
                              email: staffPayload.email,
                              phone: staffPayload.phone,
                              roleId: staffPayload.roleId,
                              roleName: resolvedRoleName,
                              status: staffPayload.status,
                              active: staffPayload.status === 'active'
                          }
                        : s
                )
            );
            if (currentUser && (currentUser.staffId === staffPayload.editId || currentUser.id === staffPayload.editId || currentUser.email === staffPayload.email)) {
                if (staffPayload.status === 'locked') {
                    setAuthToken(null);
                    StorageService.set(STORAGE_KEYS.AUTH_TOKEN, null);
                    setCurrentUser(null);
                    setViewMode('landing');
                    addToast('Tài khoản bị khóa', 'Tài khoản của bạn đã bị Sysadmin tạm khóa.', 'danger');
                } else {
                    setCurrentUser(prev => ({
                        ...prev,
                        name: staffPayload.name,
                        fullName: staffPayload.name,
                        email: staffPayload.email,
                        phone: staffPayload.phone,
                        roleId: staffPayload.roleId,
                        roleName: resolvedRoleName
                    }));
                }
            }
            const updatedStaff = {
                id: staffPayload.editId,
                username: staffPayload.username,
                name: staffPayload.name,
                fullName: staffPayload.name,
                email: staffPayload.email,
                phone: staffPayload.phone,
                roleId: staffPayload.roleId,
                roleName: resolvedRoleName,
                status: staffPayload.status,
                active: staffPayload.status === 'active',
                ...(staffPayload.password ? { password: staffPayload.password } : {})
            };
            const saved = await ApiService.saveStaff(updatedStaff);
            if (saved && saved.id) {
                setStaffUsers(prev => prev.map(s => (s.id === saved.id ? saved : s)));
            }
            addToast('Cập nhật nhân sự', `Đã cập nhật thông tin cho ${staffPayload.name}.`, 'success');
        } else {
            const newId = generateUniqueId('NV');
            const newStaffPayload = {
                id: newId,
                username: staffPayload.username || staffPayload.email,
                password: staffPayload.password,
                name: staffPayload.name,
                fullName: staffPayload.name,
                email: staffPayload.email,
                phone: staffPayload.phone,
                roleId: staffPayload.roleId,
                roleName: resolvedRoleName,
                status: staffPayload.status,
                active: staffPayload.status === 'active',
                lastLogin: 'Chưa đăng nhập'
            };
            const saved = await ApiService.saveStaff(newStaffPayload);
            if (saved) {
                setStaffUsers(prev => [...prev, saved]);
                addToast('Thêm nhân sự thành công', `Đã cấp tài khoản cho ${staffPayload.name} (${saved.id || newId}).`, 'success');
            } else {
                addToast('Lỗi lưu nhân sự', 'Không thể lưu thông tin nhân sự mới lên máy chủ.', 'danger');
            }
        }
        closeModal();
    };

    const handleToggleStaffStatus = async staffId => {
        const updated = await ApiService.toggleStaffStatus(staffId);
        if (!updated) {
            addToast('Thao tác bị từ chối', 'Không thể thay đổi trạng thái tài khoản này (tài khoản SysAdmin được bảo vệ hoặc thiếu quyền).', 'danger');
            return;
        }
        setStaffUsers(prev =>
            prev.map(s => {
                if (s.id === staffId) {
                    const newStatus = updated.status || (s.status === 'active' ? 'locked' : 'active');
                    if (currentUser && (currentUser.staffId === staffId || currentUser.id === staffId) && newStatus === 'locked') {
                        setCurrentUser(null);
                        setViewMode('landing');
                        addToast('Tài khoản bị khóa', 'Tài khoản của bạn đã bị Sysadmin tạm khóa.', 'danger');
                    }
                    return { ...s, ...updated, status: newStatus, active: newStatus === 'active' };
                }
                return s;
            })
        );
        addToast('Đổi trạng thái tài khoản', 'Trạng thái nhân sự đã được cập nhật.', 'info');
    };

    const handleDeleteStaffUser = async staffId => {
        if (!confirm(`Bạn có chắc muốn xóa tài khoản nhân viên ${staffId} khỏi hệ thống?`)) return;
        const ok = await ApiService.deleteStaff(staffId);
        if (!ok) {
            addToast('Thao tác bị từ chối', 'Không thể xóa tài khoản nhân sự này (tài khoản SysAdmin được bảo vệ hoặc thiếu quyền).', 'danger');
            return;
        }
        setStaffUsers(prev => prev.filter(s => s.id !== staffId));
        if (currentUser && (currentUser.staffId === staffId || currentUser.id === staffId)) {
            setCurrentUser(prev => ({ ...prev, role: 'customer', hasAdminAccess: false, staffId: null }));
            setViewMode('landing');
            addToast('Quyền hạn thay đổi', 'Tài khoản của bạn đã bị Sysadmin thu hồi quyền quản trị.', 'warning');
        }
        addToast('Đã xóa nhân sự', `Đã gỡ bỏ tài khoản ${staffId}.`, 'info');
    };

    const handleSetViewMode = mode => {
        if (mode === 'admin') {
            const hasAccess = Boolean(
                currentUser && (
                    currentUser.hasAdminAccess ||
                    currentUser.role === 'staff'
                )
            );
            if (!hasAccess) {
                addToast('Từ chối truy cập', 'Bạn không được Sysadmin cấp quyền vào trang quản trị.', 'danger');
                return;
            }
        }
        setViewMode(mode);
    };

    // -------------------------------------------------------------
    // Business Logic: Roles & Permissions Matrix
    // -------------------------------------------------------------
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
        ApiService.updateRole(newRole.id, newRole);
        closeModal();
        addToast('Tạo vai trò mới', `Đã thêm vai trò '${rolePayload.name}' vào ma trận quyền hạn.`, 'success');
    };

    const handlePermissionToggle = (roleId, permKey) => {
        setRolesConfig(prev => prev.map(r => {
            if (r.id === roleId) {
                return {
                    ...r,
                    permissions: {
                        ...r.permissions,
                        [permKey]: !r.permissions?.[permKey]
                    }
                };
            }
            return r;
        }));
    };

    const handleResetRolesMatrix = async () => {
        if (confirm('Tải lại ma trận phân quyền từ cơ sở dữ liệu MongoDB Atlas?')) {
            try {
                const dbRoles = await ApiService.getRoles();
                if (Array.isArray(dbRoles)) {
                    setRolesConfig(dbRoles);
                    addToast('Đã đồng bộ', 'Ma trận quyền đã được tải mới nhất từ MongoDB Atlas.', 'info');
                }
            } catch (err) {
                console.error('Lỗi tải roles:', err);
            }
        }
    };

    const handleSavePermissions = () => {
        rolesConfig.forEach(r => {
            ApiService.updateRole(r.id, r);
        });
        addToast('Cấu hình thành công', 'Ma trận quyền hạn đã lưu an toàn vào cơ sở dữ liệu MongoDB Atlas.', 'success');
    };

    // -------------------------------------------------------------
    // Business Logic: System Reset / Sync
    // -------------------------------------------------------------
    const handleResetDemoData = async () => {
        if (confirm('Tải lại và đồng bộ toàn bộ dữ liệu mới nhất trực tiếp từ cơ sở dữ liệu MongoDB Atlas?')) {
            await syncAtlasData(currentUser, authToken);
            addToast('Đồng bộ thành công', 'Đã tải toàn bộ dữ liệu thời gian thực từ MongoDB Atlas!', 'success');
        }
    };

    // -------------------------------------------------------------
    // Admin Navigation Guard (RBAC Auto-Redirect & Hide)
    // -------------------------------------------------------------
    const canAccessAdminTab = tabId => {
        switch (tabId) {
            case 'dashboard':
                return checkPermission('view_kpi') || checkPermission('view_revenue');
            case 'rooms-management':
                return checkPermission('manage_rooms') || checkPermission('room_checkin_checkout') || checkPermission('room_cleaning');
            case 'bookings-management':
                return checkPermission('manage_bookings');
            case 'financial-ledger':
                return checkPermission('manage_finances');
            case 'users-management':
                return checkPermission('view_staff') || checkPermission('manage_staff');
            case 'permissions-config':
                return checkPermission('config_permissions');
            default:
                return true;
        }
    };

    useEffect(() => {
        if (!canAccessAdminTab(adminTab)) {
            const tabOrder = [
                'dashboard',
                'rooms-management',
                'bookings-management',
                'financial-ledger',
                'users-management',
                'permissions-config'
            ];
            const firstAllowed = tabOrder.find(t => canAccessAdminTab(t));
            if (firstAllowed) {
                setAdminTab(firstAllowed);
            }
        }
    }, [activeStaffId, rolesConfig, adminTab, currentUser]);

    const handleTabChange = tabId => {
        if (!canAccessAdminTab(tabId)) return;
        setAdminTab(tabId);
    };

    return {
        // State
        rooms,
        bookings,
        staffUsers,
        rolesConfig,
        activeStaffId,
        transactions,
        historicalRevenue,
        currentUser,
        isSysAdminUser,
        isBackendConnected,
        viewMode,
        adminTab,
        currentFilter,
        toasts,
        activeModal,
        modalData,
        searchParams,

        // Setters / Navigators
        setViewMode: handleSetViewMode,
        rawSetViewMode: setViewMode,
        setAdminTab,
        setCurrentFilter,
        setSearchParams,
        setActiveStaffId: handleSetActiveStaffId,

        // Actions
        addToast,
        checkPermission,
        openModal,
        closeModal,
        handleSearch,
        handleLoginSuccess,
        handleRegisterSuccess,
        handleUpdateProfileSuccess,
        handleLogout,
        handleBookRoomClick,
        handleSubmitBooking,
        handleConfirmQrPaid,
        handleQuickCheckIn,
        handleConfirmCheckIn,
        handleCompleteCleaning,
        handleCancelBooking,
        handleOpenCheckoutModal,
        handleFinalizeCheckout,
        handleCreateManualTx,
        handleCreateRoom,
        handleSaveStaff,
        handleToggleStaffStatus,
        handleDeleteStaffUser,
        handleCreateRole,
        handlePermissionToggle,
        handleResetRolesMatrix,
        handleSavePermissions,
        handleResetDemoData,
        handleTabChange,
        handleSetViewMode
    };
}
