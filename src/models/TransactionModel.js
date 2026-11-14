/**
 * ============================================================================
 * MODEL: TransactionModel
 * ============================================================================
 * Định nghĩa thực thể giao dịch thu chi, ngân hàng MB Bank và định dạng tiền tệ
 */

export const HOTEL_BANK_CONFIG = {
    bankId: 'MB',
    accountNo: '098888899',
    accountName: 'GRAND HOTEL AND RESORTS',
    template: 'compact2'
};

// Zero-Mock: Dữ liệu khởi tạo rỗng, 100% nạp từ MongoDB Atlas
export const INITIAL_TRANSACTIONS = [];

export function formatVND(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
}

export function generateVietQRUrl(amount, content) {
    const cleanContent = encodeURIComponent(String(content || '').replace(/[^a-zA-Z0-9 ]/g, ''));
    return `https://img.vietqr.io/image/${HOTEL_BANK_CONFIG.bankId}-${HOTEL_BANK_CONFIG.accountNo}-${HOTEL_BANK_CONFIG.template}.png?amount=${amount}&addInfo=${cleanContent}&accountName=${encodeURIComponent(HOTEL_BANK_CONFIG.accountName)}`;
}
