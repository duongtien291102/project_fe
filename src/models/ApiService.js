/**
 * ============================================================================
 * MODEL: ApiService
 * ============================================================================
 * Cầu nối giao tiếp HTTP giữa Frontend React và Backend Spring Boot + MongoDB Atlas
 */

export const API_BASE_URL = 'http://localhost:8080/api';

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
    }
};
