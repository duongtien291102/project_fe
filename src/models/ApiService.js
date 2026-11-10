/**
 * ============================================================================
 * MODEL: ApiService
 * ============================================================================
 * Cầu nối giao tiếp HTTP giữa Frontend React và Backend Spring Boot + MongoDB Atlas
 */

const getApiBaseUrl = () => {
    if (typeof window !== 'undefined' && window.location && window.location.hostname) {
        return `http://${window.location.hostname}:2402/api`;
    }
    return 'http://localhost:2402/api';
};

export const API_BASE_URL = getApiBaseUrl();

export const ApiService = {
    async getRooms() {
        try {
            const res = await fetch(`${API_BASE_URL}/public/rooms`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            return json.data || [];
        } catch (err) {
            console.warn('[ApiService] Không thể lấy rooms từ BE, dùng cache:', err);
            return null;
        }
    },

    async saveRoom(room) {
        try {
            const res = await fetch(`${API_BASE_URL}/public/rooms`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(room)
            });
            const json = await res.json();
            return json.data;
        } catch (err) {
            console.warn('[ApiService] Lỗi lưu room lên BE:', err);
            return room;
        }
    },

    async getBookings() {
        try {
            const res = await fetch(`${API_BASE_URL}/public/bookings`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            return json.data || [];
        } catch (err) {
            console.warn('[ApiService] Không thể lấy bookings từ BE, dùng cache:', err);
            return null;
        }
    },

    async createBooking(booking) {
        try {
            const res = await fetch(`${API_BASE_URL}/public/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(booking)
            });
            const json = await res.json();
            return json.data;
        } catch (err) {
            console.warn('[ApiService] Lỗi tạo booking lên BE:', err);
            return booking;
        }
    },

    async updateBookingStatus(bookingId, status) {
        try {
            const res = await fetch(`${API_BASE_URL}/public/bookings/${bookingId}/status?status=${encodeURIComponent(status)}`, {
                method: 'PUT'
            });
            const json = await res.json();
            return json.data;
        } catch (err) {
            console.warn('[ApiService] Lỗi cập nhật status booking lên BE:', err);
            return null;
        }
    },

    async getTransactions() {
        try {
            const res = await fetch(`${API_BASE_URL}/public/transactions`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            return json.data || [];
        } catch (err) {
            console.warn('[ApiService] Không thể lấy transactions từ BE, dùng cache:', err);
            return null;
        }
    },

    async createTransaction(tx) {
        try {
            const res = await fetch(`${API_BASE_URL}/public/transactions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tx)
            });
            const json = await res.json();
            return json.data;
        } catch (err) {
            console.warn('[ApiService] Lỗi ghi transaction lên BE:', err);
            return tx;
        }
    },

    async deleteRoom(roomId) {
        try {
            const res = await fetch(`${API_BASE_URL}/public/rooms/${encodeURIComponent(roomId)}`, {
                method: 'DELETE'
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
                method: 'DELETE'
            });
            return res.ok;
        } catch (err) {
            console.warn('[ApiService] Lỗi xóa booking:', err);
            return false;
        }
    },

    async getRoles() {
        try {
            const res = await fetch(`${API_BASE_URL}/public/roles`);
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(role)
            });
            const json = await res.json();
            return json.data;
        } catch (err) {
            console.warn('[ApiService] Lỗi cập nhật role lên BE:', err);
            return role;
        }
    },

    async getStaff() {
        try {
            const res = await fetch(`${API_BASE_URL}/public/staff`);
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(staff)
            });
            const json = await res.json();
            return json.data;
        } catch (err) {
            console.warn('[ApiService] Lỗi lưu nhân sự lên BE:', err);
            return staff;
        }
    },

    async toggleStaffStatus(staffId) {
        try {
            const res = await fetch(`${API_BASE_URL}/public/staff/${encodeURIComponent(staffId)}/toggle-status`, {
                method: 'PATCH'
            });
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
                method: 'DELETE'
            });
            return res.ok;
        } catch (err) {
            console.warn('[ApiService] Lỗi xóa nhân sự lên BE:', err);
            return false;
        }
    }
};
