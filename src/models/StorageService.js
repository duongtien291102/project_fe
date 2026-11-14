/**
 * ============================================================================
 * MODEL: StorageService
 * ============================================================================
 * Lớp dịch vụ quản lý đọc/ghi dữ liệu vào LocalStorage an toàn
 */

export const STORAGE_KEYS = {
    ROOMS: 'grand_hotel_rooms_db_v1',
    BOOKINGS: 'grand_hotel_bookings_db_v1',
    USER: 'grand_hotel_current_user_db_v1',
    AUTH_TOKEN: 'grand_hotel_auth_token_v1',
    STAFF_USERS: 'grand_hotel_staff_users_db_v1',
    ROLES_CONFIG: 'grand_hotel_roles_config_db_v1',
    ACTIVE_STAFF_ID: 'grand_hotel_active_staff_id_db_v1',
    TRANSACTIONS: 'grand_hotel_financial_transactions_db_v1',
    HISTORICAL_REVENUE: 'grand_hotel_historical_revenue_db_v1'
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
