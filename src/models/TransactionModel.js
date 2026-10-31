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

export const INITIAL_TRANSACTIONS = [
    { id: 'TX-701', bookingId: 'BK-1084', customerName: 'DAVID NGUYỄN', type: 'Thanh toán toàn bộ 100%', method: 'Thẻ tín dụng', amount: 36600000, date: '07/10/2026 10:15', staff: 'Phạm Đăng Khoa' },
    { id: 'TX-702', bookingId: 'BK-1082', customerName: 'TRẦN HẢI ĐĂNG', type: 'Đặt cọc giữ phòng 50%', method: 'VietQR', amount: 1950000, date: '09/10/2026 14:30', staff: 'Cổng Online VietQR' },
    { id: 'TX-703', bookingId: 'BK-1083', customerName: 'LÊ MINH KHANG', type: 'Đặt cọc giữ phòng 50%', method: 'VietQR', amount: 4425000, date: '10/10/2026 09:20', staff: 'Cổng Online VietQR' }
];

export function formatVND(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
}

export function generateVietQRUrl(amount, content) {
    const cleanContent = encodeURIComponent(String(content || '').replace(/[^a-zA-Z0-9 ]/g, ''));
    return `https://img.vietqr.io/image/${HOTEL_BANK_CONFIG.bankId}-${HOTEL_BANK_CONFIG.accountNo}-${HOTEL_BANK_CONFIG.template}.png?amount=${amount}&addInfo=${cleanContent}&accountName=${encodeURIComponent(HOTEL_BANK_CONFIG.accountName)}`;
}
