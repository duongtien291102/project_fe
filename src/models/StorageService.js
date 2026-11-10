/**
 * ============================================================================
 * MODEL: StorageService
 * ============================================================================
 * Lớp dịch vụ quản lý đọc/ghi dữ liệu vào LocalStorage an toàn
 */

export const STORAGE_KEYS = {
    ROOMS: 'grand_hotel_rooms_v2',
    BOOKINGS: 'grand_hotel_bookings_v2',
    USER: 'grand_hotel_current_user_v2',
    STAFF_USERS: 'grand_hotel_staff_users_v2',
    ROLES_CONFIG: 'grand_hotel_roles_config_v2',
    ACTIVE_STAFF_ID: 'grand_hotel_active_staff_id_v2',
    TRANSACTIONS: 'grand_hotel_financial_transactions_v2',
    HISTORICAL_REVENUE: 'grand_hotel_historical_revenue_v3',
    CUSTOMERS: 'grand_hotel_registered_customers_v2'
};

export const StorageService = {
    get(key, defaultValue) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : defaultValue;
        } catch (err) {
            console.error(`[StorageService] Lỗi đọc key '${key}':`, err);
            return defaultValue;
        }
    },

    set(key, value) {
        try {
            if (value === null || value === undefined) {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, JSON.stringify(value));
            }
        } catch (err) {
            console.error(`[StorageService] Lỗi ghi key '${key}':`, err);
        }
    },

    clearAll() {
        try {
            localStorage.clear();
        } catch (err) {
            console.error('[StorageService] Lỗi xóa toàn bộ dữ liệu:', err);
        }
    }
};
