/**
 * ============================================================================
 * MODEL: ApiService
 * ============================================================================
 * Cầu nối giao tiếp HTTP giữa Frontend React và Backend Spring Boot + MongoDB Atlas
 */

import { StorageService, STORAGE_KEYS } from './StorageService.js';

const getApiBaseUrl = () => {
    if (typeof window !== 'undefined' && window.location && window.location.hostname) {
        return `http://${window.location.hostname}:2402/api`;
    }
    return 'http://localhost:2402/api';
};

export const API_BASE_URL = getApiBaseUrl();

function getAuthHeaders(extraHeaders = {}) {
    const token = typeof StorageService !== 'undefined'
        ? StorageService.get(STORAGE_KEYS.AUTH_TOKEN, null)
        : null;
    return {
        ...extraHeaders,
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
}

export const ApiService = {
    async login(usernameOrEmail, password) {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usernameOrEmail, password })
            });
            const json = await res.json().catch(() => ({}));
            return {
                ok: res.ok && json.success !== false,
                data: json.data || null,
                message: json.message || (res.ok ? 'Thành công' : `HTTP ${res.status}`)
            };
        } catch (err) {
            return {
                ok: false,
                data: null,
                message: 'Không thể kết nối tới máy chủ Backend.'
            };
        }
    },

    async register(payload) {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const json = await res.json().catch(() => ({}));
            return {
                ok: res.ok && json.success !== false,
                data: json.data || null,
                message: json.message || (res.ok ? 'Thành công' : `HTTP ${res.status}`)
            };
        } catch (err) {
            return {
                ok: false,
                data: null,
                message: 'Không thể kết nối tới máy chủ Backend.'
            };
        }
    },

    async getMe(token) {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const json = await res.json().catch(() => ({}));
            return {
                ok: res.ok && json.success !== false,
                status: res.status,
                data: json.data || null,
                message: json.message || ''
            };
        } catch (err) {
            return { ok: false, status: 0, data: null, message: err.message };
        }
    },

    async updateProfile(token, payload) {
        try {
            const authHeader = token
                ? { Authorization: `Bearer ${token}` }
                : getAuthHeaders();
            const res = await fetch(`${API_BASE_URL}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeader
                },
                body: JSON.stringify(payload)
            });
            const json = await res.json().catch(() => ({}));
            return {
                ok: res.ok && json.success !== false,
                data: json.data || null,
                message: json.message || (res.ok ? 'Thành công' : `HTTP ${res.status}`)
            };
        } catch (err) {
            return {
                ok: false,
                data: null,
                message: 'Không thể kết nối tới máy chủ Backend.'
            };
        }
    },

    async getRooms() {
        try {
            const res = await fetch(`${API_BASE_URL}/public/rooms`, {
                headers: getAuthHeaders()
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            return json.data || [];
        } catch (err) {
            console.warn('[ApiService] Không thể lấy rooms từ BE:', err);
            return null;
        }
    },

    async saveRoom(room) {
        try {
            const res = await fetch(`${API_BASE_URL}/public/rooms`, {
                method: 'POST',
                headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify(room)
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            return json.data;
        } catch (err) {
            console.warn('[ApiService] Lỗi lưu room lên BE:', err);
            return null;
        }
    },

    async getBookings() {
        try {
            const res = await fetch(`${API_BASE_URL}/public/bookings`, {
                headers: getAuthHeaders()
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            return json.data || [];
        } catch (err) {
            console.warn('[ApiService] Không thể lấy bookings từ BE:', err);
            return null;
        }
    },

    async createBooking(booking) {
        try {
            const res = await fetch(`${API_BASE_URL}/public/bookings`, {
                method: 'POST',
                headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify(booking)
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            return json.data;
        } catch (err) {
            console.warn('[ApiService] Lỗi tạo booking lên BE:', err);
            return null;
        }
    },

    async updateBookingStatus(bookingId, status, paidAmount, remainingAmount) {
        try {
            const params = new URLSearchParams({ status });
            if (paidAmount !== undefined && paidAmount !== null) {
                params.append('paidAmount', String(paidAmount));
            }
            if (remainingAmount !== undefined && remainingAmount !== null) {
                params.append('remainingAmount', String(remainingAmount));
            }
            const res = await fetch(`${API_BASE_URL}/public/bookings/${encodeURIComponent(bookingId)}/status?${params.toString()}`, {
                method: 'PUT',
                headers: getAuthHeaders()
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            return json.data;
        } catch (err) {
            console.warn('[ApiService] Lỗi cập nhật status booking lên BE:', err);
            return null;
        }
    },

    async getTransactions() {
        try {
            const res = await fetch(`${API_BASE_URL}/public/transactions`, {
                headers: getAuthHeaders()
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            return json.data || [];
        } catch (err) {
            console.warn('[ApiService] Không thể lấy transactions từ BE:', err);
            return null;
        }
    },

    async createTransaction(tx) {
        try {
            const res = await fetch(`${API_BASE_URL}/public/transactions`, {
                method: 'POST',
                headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify(tx)
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            return json.data;
        } catch (err) {
            console.warn('[ApiService] Lỗi ghi transaction lên BE:', err);
            return null;
        }
    },

    async deleteRoom(roomId) {
        try {
            const res = await fetch(`${API_BASE_URL}/public/rooms/${encodeURIComponent(roomId)}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            return res.ok;
        } catch (err) {
            console.warn('[ApiService] Lỗi xóa room:', err);
            return false;
        }
    },

    async deleteBooking(bookingId) {
        try {
            const res = await fetch(`${API_BASE_URL}/public/bookings/${encodeURIComponent(bookingId)}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            return res.ok;
        } catch (err) {
            console.warn('[ApiService] Lỗi xóa booking:', err);
            return false;
        }
    },

    async getRoles() {
        try {
            const res = await fetch(`${API_BASE_URL}/public/roles`, {
                headers: getAuthHeaders()
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            return json.data || [];
        } catch (err) {
            console.warn('[ApiService] Không thể lấy roles từ BE:', err);
            return null;
        }
    },

    async updateRole(roleId, role) {
        try {
            const res = await fetch(`${API_BASE_URL}/public/roles/${encodeURIComponent(roleId)}`, {
                method: 'PUT',
                headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify(role)
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            return json.data;
        } catch (err) {
            console.warn('[ApiService] Lỗi cập nhật role lên BE:', err);
            return null;
        }
    },

    async getStaff() {
        try {
            const res = await fetch(`${API_BASE_URL}/public/staff`, {
                headers: getAuthHeaders()
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            return json.data || [];
        } catch (err) {
            console.warn('[ApiService] Không thể lấy danh sách nhân viên từ BE:', err);
            return null;
        }
    },

    async saveStaff(staff) {
        try {
            const res = await fetch(`${API_BASE_URL}/public/staff`, {
                method: 'POST',
                headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify(staff)
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            return json.data;
        } catch (err) {
            console.warn('[ApiService] Lỗi lưu nhân sự lên BE:', err);
            return null;
        }
    },

    async toggleStaffStatus(staffId) {
        try {
            const res = await fetch(`${API_BASE_URL}/public/staff/${encodeURIComponent(staffId)}/toggle-status`, {
                method: 'PATCH',
                headers: getAuthHeaders()
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            return json.data;
        } catch (err) {
            console.warn('[ApiService] Lỗi toggle status nhân sự:', err);
            return null;
        }
    },

    async deleteStaff(staffId) {
        try {
            const res = await fetch(`${API_BASE_URL}/public/staff/${encodeURIComponent(staffId)}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            return res.ok;
        } catch (err) {
            console.warn('[ApiService] Lỗi xóa nhân sự lên BE:', err);
            return false;
        }
    }
};
