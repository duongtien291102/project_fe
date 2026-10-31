/**
 * ============================================================================
 * MODEL: BookingModel
 * ============================================================================
 * Định nghĩa thực thể đơn đặt phòng, định danh CCCD và logic tính toán chi phí
 */

export const DEFAULT_CCCD_FRONT = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80';
export const DEFAULT_CCCD_BACK = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80';

export const INITIAL_BOOKINGS = [
    {
        id: 'BK-1082',
        customerName: 'TRẦN HẢI ĐĂNG',
        phone: '0912 345 678',
        cccd: '079093005882',
        cccdDate: '2021-06-15',
        cccdPlace: 'Cục CSQLHC về TTXH',
        dob: '1993-10-12',
        cccdFront: DEFAULT_CCCD_FRONT,
        cccdBack: DEFAULT_CCCD_BACK,
        roomId: '102',
        roomName: 'Superior Twin Balcony',
        checkIn: '2026-10-10',
        checkOut: '2026-10-13',
        nights: 3,
        addons: ['Buffet Ăn Sáng Hoàng Gia'],
        minibar: 150000,
        totalAmount: 3900000,
        depositAmount: 1950000,
        depositMethod: 'VietQR',
        paidAmount: 1950000,
        remainingAmount: 1950000,
        status: 'Đã check-in',
        createdAt: '2026-10-09'
    },
    {
        id: 'BK-1083',
        customerName: 'LÊ MINH KHANG',
        phone: '0988 765 432',
        cccd: '001095018993',
        cccdDate: '2022-04-10',
        cccdPlace: 'Cục CSQLHC về TTXH',
        dob: '1995-02-28',
        cccdFront: DEFAULT_CCCD_FRONT,
        cccdBack: DEFAULT_CCCD_BACK,
        roomId: '202',
        roomName: 'Premier Family Suite',
        checkIn: '2026-10-12',
        checkOut: '2026-10-15',
        nights: 3,
        addons: ['Đưa Đón Sân Bay Khứ Hồi'],
        minibar: 0,
        totalAmount: 8850000,
        depositAmount: 4425000,
        depositMethod: 'VietQR',
        paidAmount: 4425000,
        remainingAmount: 4425000,
        status: 'Chờ check-in',
        createdAt: '2026-10-10'
    },
    {
        id: 'BK-1084',
        customerName: 'DAVID NGUYỄN',
        phone: '0909 999 888',
        cccd: 'P98457210',
        cccdDate: '2020-01-05',
        cccdPlace: 'Bộ Ngoại Giao',
        dob: '1988-11-20',
        cccdFront: DEFAULT_CCCD_FRONT,
        cccdBack: DEFAULT_CCCD_BACK,
        roomId: '301',
        roomName: 'Presidential Ocean Villa',
        checkIn: '2026-10-08',
        checkOut: '2026-10-14',
        nights: 6,
        addons: ['Buffet Ăn Sáng Hoàng Gia', 'Lotus Spa'],
        minibar: 450000,
        totalAmount: 36600000,
        depositAmount: 36600000,
        depositMethod: 'Thẻ tín dụng',
        paidAmount: 36600000,
        remainingAmount: 0,
        status: 'Đã check-in',
        createdAt: '2026-10-07'
    }
];

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
