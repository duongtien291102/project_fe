/**
 * ============================================================================
 * MODEL: RevenueModel
 * ============================================================================
 * Thống kê dữ liệu doanh thu lũy kế 3 năm (2024 - 2026), tính toán các chỉ số
 * tài chính quản trị khách sạn: ADR, RevPAR, tỷ lệ lấp đầy Occupancy, tăng trưởng YoY.
 * Tích hợp tự động với cơ sở dữ liệu MongoDB Atlas (transactions & bookings).
 */

export function generateDefaultHistoricalRevenue() {
    const monthly = [
        // 2024
        { year: 2024, month: 1, roomRevenue: 280000000, serviceRevenue: 45000000, depositCollected: 110000000, total: 325000000, nights: 145, occ: 68, bookings: 52, adr: 2241000 },
        { year: 2024, month: 2, roomRevenue: 320000000, serviceRevenue: 55000000, depositCollected: 130000000, total: 375000000, nights: 165, occ: 75, bookings: 58, adr: 2272000 },
        { year: 2024, month: 3, roomRevenue: 250000000, serviceRevenue: 35000000, depositCollected: 95000000, total: 285000000, nights: 130, occ: 62, bookings: 46, adr: 2192000 },
        { year: 2024, month: 4, roomRevenue: 310000000, serviceRevenue: 48000000, depositCollected: 120000000, total: 358000000, nights: 155, occ: 73, bookings: 54, adr: 2309000 },
        { year: 2024, month: 5, roomRevenue: 380000000, serviceRevenue: 62000000, depositCollected: 150000000, total: 442000000, nights: 180, occ: 81, bookings: 65, adr: 2455000 },
        { year: 2024, month: 6, roomRevenue: 440000000, serviceRevenue: 75000000, depositCollected: 175000000, total: 515000000, nights: 205, occ: 88, bookings: 72, adr: 2512000 },
        { year: 2024, month: 7, roomRevenue: 470000000, serviceRevenue: 82000000, depositCollected: 190000000, total: 552000000, nights: 220, occ: 92, bookings: 78, adr: 2509000 },
        { year: 2024, month: 8, roomRevenue: 410000000, serviceRevenue: 70000000, depositCollected: 165000000, total: 480000000, nights: 195, occ: 85, bookings: 68, adr: 2461000 },
        { year: 2024, month: 9, roomRevenue: 240000000, serviceRevenue: 35000000, depositCollected: 90000000, total: 275000000, nights: 125, occ: 60, bookings: 44, adr: 2200000 },
        { year: 2024, month: 10, roomRevenue: 260000000, serviceRevenue: 38000000, depositCollected: 100000000, total: 298000000, nights: 135, occ: 64, bookings: 48, adr: 2207000 },
        { year: 2024, month: 11, roomRevenue: 230000000, serviceRevenue: 32000000, depositCollected: 85000000, total: 262000000, nights: 120, occ: 58, bookings: 42, adr: 2183000 },
        { year: 2024, month: 12, roomRevenue: 390000000, serviceRevenue: 65000000, depositCollected: 155000000, total: 455000000, nights: 185, occ: 82, bookings: 66, adr: 2459000 },

        // 2025
        { year: 2025, month: 1, roomRevenue: 370000000, serviceRevenue: 58000000, depositCollected: 145000000, total: 428000000, nights: 180, occ: 78, bookings: 64, adr: 2377000 },
        { year: 2025, month: 2, roomRevenue: 430000000, serviceRevenue: 72000000, depositCollected: 170000000, total: 502000000, nights: 205, occ: 86, bookings: 74, adr: 2448000 },
        { year: 2025, month: 3, roomRevenue: 340000000, serviceRevenue: 50000000, depositCollected: 130000000, total: 390000000, nights: 165, occ: 72, bookings: 58, adr: 2363000 },
        { year: 2025, month: 4, roomRevenue: 400000000, serviceRevenue: 65000000, depositCollected: 155000000, total: 465000000, nights: 190, occ: 82, bookings: 68, adr: 2447000 },
        { year: 2025, month: 5, roomRevenue: 510000000, serviceRevenue: 85000000, depositCollected: 200000000, total: 595000000, nights: 230, occ: 91, bookings: 82, adr: 2586000 },
        { year: 2025, month: 6, roomRevenue: 580000000, serviceRevenue: 98000000, depositCollected: 235000000, total: 678000000, nights: 255, occ: 96, bookings: 92, adr: 2658000 },
        { year: 2025, month: 7, roomRevenue: 620000000, serviceRevenue: 105000000, depositCollected: 250000000, total: 725000000, nights: 270, occ: 98, bookings: 98, adr: 2685000 },
        { year: 2025, month: 8, roomRevenue: 540000000, serviceRevenue: 90000000, depositCollected: 215000000, total: 630000000, nights: 240, occ: 93, bookings: 86, adr: 2625000 },
        { year: 2025, month: 9, roomRevenue: 310000000, serviceRevenue: 45000000, depositCollected: 120000000, total: 355000000, nights: 150, occ: 68, bookings: 54, adr: 2366000 },
        { year: 2025, month: 10, roomRevenue: 340000000, serviceRevenue: 52000000, depositCollected: 135000000, total: 392000000, nights: 165, occ: 73, bookings: 60, adr: 2375000 },
        { year: 2025, month: 11, roomRevenue: 300000000, serviceRevenue: 42000000, depositCollected: 115000000, total: 342000000, nights: 145, occ: 65, bookings: 52, adr: 2358000 },
        { year: 2025, month: 12, roomRevenue: 530000000, serviceRevenue: 88000000, depositCollected: 210000000, total: 618000000, nights: 235, occ: 92, bookings: 84, adr: 2629000 },

        // 2026 (Mặc định trước khi đồng bộ MongoDB)
        { year: 2026, month: 1, roomRevenue: 460000000, serviceRevenue: 75000000, depositCollected: 185000000, total: 535000000, nights: 215, occ: 85, bookings: 78, adr: 2488000 },
        { year: 2026, month: 2, roomRevenue: 530000000, serviceRevenue: 88000000, depositCollected: 210000000, total: 618000000, nights: 240, occ: 92, bookings: 88, adr: 2575000 },
        { year: 2026, month: 3, roomRevenue: 420000000, serviceRevenue: 65000000, depositCollected: 165000000, total: 485000000, nights: 195, occ: 79, bookings: 70, adr: 2487000 },
        { year: 2026, month: 4, roomRevenue: 490000000, serviceRevenue: 78000000, depositCollected: 190000000, total: 568000000, nights: 225, occ: 88, bookings: 80, adr: 2524000 },
        { year: 2026, month: 5, roomRevenue: 620000000, serviceRevenue: 105000000, depositCollected: 245000000, total: 725000000, nights: 265, occ: 95, bookings: 96, adr: 2735000 },
        { year: 2026, month: 6, roomRevenue: 710000000, serviceRevenue: 120000000, depositCollected: 280000000, total: 830000000, nights: 295, occ: 99, bookings: 108, adr: 2813000 },
        { year: 2026, month: 7, roomRevenue: 750000000, serviceRevenue: 130000000, depositCollected: 300000000, total: 880000000, nights: 310, occ: 100, bookings: 115, adr: 2838000 },
        { year: 2026, month: 8, roomRevenue: 650000000, serviceRevenue: 110000000, depositCollected: 260000000, total: 760000000, nights: 280, occ: 96, bookings: 100, adr: 2714000 },
        { year: 2026, month: 9, roomRevenue: 380000000, serviceRevenue: 60000000, depositCollected: 150000000, total: 440000000, nights: 180, occ: 75, bookings: 66, adr: 2444000 },
        { year: 2026, month: 10, roomRevenue: 410000000, serviceRevenue: 68000000, depositCollected: 165000000, total: 478000000, nights: 195, occ: 80, bookings: 72, adr: 2451000 },
        { year: 2026, month: 11, roomRevenue: 360000000, serviceRevenue: 55000000, depositCollected: 140000000, total: 415000000, nights: 175, occ: 72, bookings: 62, adr: 2371000 },
        { year: 2026, month: 12, roomRevenue: 640000000, serviceRevenue: 112000000, depositCollected: 255000000, total: 752000000, nights: 275, occ: 96, bookings: 98, adr: 2734000 }
    ];

    return { monthly, sampleTransactions: [] };
}

/**
 * Tính toán số liệu doanh thu năm 2026 trực tiếp từ 110 giao dịch thực tế
 * đã nạp trong MongoDB Atlas thay vì số liệu mock.
 */
export function buildDynamicHistoricalRevenue(transactions = [], bookings = [], rooms = []) {
    const base = generateDefaultHistoricalRevenue();
    if (!transactions || transactions.length === 0) {
        return base;
    }

    const txs2026 = transactions.filter(t => {
        if (t.year === 2026) return true;
        if (t.date && t.date.includes('/2026')) return true;
        if (t.createdAtInstant && t.createdAtInstant.startsWith('2026')) return true;
        return false;
    });

    const updatedMonthly = base.monthly.map(mItem => {
        if (mItem.year !== 2026) return mItem;

        const m = mItem.month;
        const monthTxs = txs2026.filter(t => {
            if (t.month === m) return true;
            if (t.date && (t.date.includes(`/${String(m).padStart(2, '0')}/2026`) || t.date.includes(`/${m}/2026`))) return true;
            if (t.createdAtInstant && t.createdAtInstant.startsWith(`2026-${String(m).padStart(2, '0')}`)) return true;
            return false;
        });

        if (monthTxs.length === 0) return mItem;

        const totalMonthAmount = monthTxs.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
        const depositCollected = monthTxs
            .filter(t => (t.type && (t.type.toLowerCase().includes('cọc') || t.type.includes('50%'))))
            .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

        const roomRevenue = Math.round(totalMonthAmount * 0.82);
        const serviceRevenue = totalMonthAmount - roomRevenue;

        const monthBookings = (bookings || []).filter(b => {
            if (b.checkIn && (b.checkIn.startsWith(`2026-${String(m).padStart(2, '0')}`) || b.checkIn.includes(`/${m}/2026`))) return true;
            return false;
        });

        const bookingsCount = monthBookings.length > 0 ? monthBookings.length : monthTxs.length;
        const nightsCount = monthBookings.reduce((sum, b) => sum + (Number(b.nights) || 1), 0) || Math.max(1, bookingsCount * 2);
        const totalPossibleRoomNights = (rooms?.length || 12) * 30;
        const occ = Math.min(100, Math.round((nightsCount / totalPossibleRoomNights) * 100)) || mItem.occ;
        const adr = nightsCount > 0 ? Math.round(roomRevenue / nightsCount) : mItem.adr;

        return {
            year: 2026,
            month: m,
            roomRevenue,
            serviceRevenue,
            depositCollected,
            total: totalMonthAmount,
            nights: nightsCount,
            occ,
            bookings: bookingsCount,
            adr
        };
    });

    return {
        monthly: updatedMonthly,
        sampleTransactions: transactions
    };
}
