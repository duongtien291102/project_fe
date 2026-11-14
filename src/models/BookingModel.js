/**
 * ============================================================================
 * MODEL: BookingModel
 * ============================================================================
 * Định nghĩa thực thể đơn đặt phòng, định danh CCCD và logic tính toán chi phí
 */

export const ADDON_PRICES = {
    'Buffet Sáng Michelin': 200000,
    'Buffet Ăn Sáng Hoàng Gia': 450000,
    'Đưa Đón Sân Bay': 450000,
    'Đưa Đón Sân Bay Khứ Hồi': 450000,
    'Lotus Spa': 600000,
    'Lotus Spa VIP': 450000
};

// Zero-Mock: Dữ liệu khởi tạo rỗng, 100% nạp từ MongoDB Atlas
export const INITIAL_BOOKINGS = [];

export function calculateBookingPrice({ roomPrice, checkIn, checkOut, breakfast, pickup, spa, depositPercent }) {
    let nights = 1;
    if (checkIn && checkOut) {
        const diffTime = new Date(checkOut) - new Date(checkIn);
        nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (nights <= 0) nights = 1;
    }

    const roomPriceTotal = (roomPrice || 0) * nights;
    let addonTotal = 0;
    if (breakfast) addonTotal += 200000 * nights;
    if (pickup) addonTotal += 450000;
    if (spa) addonTotal += 600000;

    const grandTotal = roomPriceTotal + addonTotal;
    const depPct = Number(depositPercent) || 0;
    const depositNeeded = Math.round((grandTotal * depPct) / 100);

    return {
        nights,
        roomPriceTotal,
        addonTotal,
        grandTotal,
        depositNeeded
    };
}
