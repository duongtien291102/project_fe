/**
 * ============================================================================
 * VIEW: DashboardView
 * ============================================================================
 * Hiển thị Dashboard Doanh Thu 3 Năm, Biểu đồ Chart.js, Bảng ma trận đối soát & Xuất Excel
 */

import React, { useState, useEffect, useRef } from 'react';
import { formatVND } from '../../models/TransactionModel.js';

export default function DashboardView({
    rooms,
    bookings,
    transactions,
    historicalRevenue,
    checkPermission,
    onNavigateTab,
    addToast
}) {
    const [yearFilter, setYearFilter] = useState('2026');
    const [periodFilter, setPeriodFilter] = useState('ALL');
    const [roomTypeFilter, setRoomTypeFilter] = useState('ALL');
    const [donutMode, setDonutMode] = useState('room');

    const chartTrendRef = useRef(null);
    const chartDonutRef = useRef(null);
    const chartTrendInstance = useRef(null);
    const chartDonutInstance = useRef(null);

    const canViewKpi = checkPermission('view_kpi');
    const canViewRev = checkPermission('view_revenue');
    const canManageBookings = checkPermission('manage_bookings');

    // Filter target months
    let targetMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    if (periodFilter === 'Q1') targetMonths = [1, 2, 3];
    else if (periodFilter === 'Q2') targetMonths = [4, 5, 6];
    else if (periodFilter === 'Q3') targetMonths = [7, 8, 9];
    else if (periodFilter === 'Q4') targetMonths = [10, 11, 12];

    const liveBookingAddOnRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const liveDepositAddOn = bookings.reduce((sum, b) => sum + (b.depositAmount || 0), 0);

    let roomTypeMultiplier = 1.0;
    if (roomTypeFilter === 'Deluxe') roomTypeMultiplier = 0.22;
    else if (roomTypeFilter === 'Suite') roomTypeMultiplier = 0.28;
    else if (roomTypeFilter === 'Executive') roomTypeMultiplier = 0.25;
    else if (roomTypeFilter === 'Villa') roomTypeMultiplier = 0.25;

    let totalRev = 0;
    let totalRoomRev = 0;
    let totalServiceRev = 0;
    let totalNights = 0;
    let totalDeposit = 0;
    let totalOccSum = 0;
    const countMonths = targetMonths.length;

    targetMonths.forEach(m => {
        let monthTotal = 0, monthRoom = 0, monthService = 0, monthNights = 0, monthDep = 0, monthOcc = 0;

        if (yearFilter === 'ALL') {
            const d24 = historicalRevenue.monthly.find(x => x.year === 2024 && x.month === m) || { total: 0, roomRevenue: 0, serviceRevenue: 0, nights: 0, depositCollected: 0, occ: 0 };
            const d25 = historicalRevenue.monthly.find(x => x.year === 2025 && x.month === m) || { total: 0, roomRevenue: 0, serviceRevenue: 0, nights: 0, depositCollected: 0, occ: 0 };
            const d26 = historicalRevenue.monthly.find(x => x.year === 2026 && x.month === m) || { total: 0, roomRevenue: 0, serviceRevenue: 0, nights: 0, depositCollected: 0, occ: 0 };

            monthTotal = (d24.total + d25.total + d26.total) * roomTypeMultiplier;
            monthRoom = (d24.roomRevenue + d25.roomRevenue + d26.roomRevenue) * roomTypeMultiplier;
            monthService = (d24.serviceRevenue + d25.serviceRevenue + d26.serviceRevenue) * roomTypeMultiplier;
            monthNights = (d24.nights + d25.nights + d26.nights);
            monthDep = (d24.depositCollected + d25.depositCollected + d26.depositCollected) * roomTypeMultiplier;
            monthOcc = Math.round((d24.occ + d25.occ + d26.occ) / 3);
        } else {
            const y = parseInt(yearFilter, 10);
            const d = historicalRevenue.monthly.find(x => x.year === y && x.month === m) || { total: 0, roomRevenue: 0, serviceRevenue: 0, nights: 0, depositCollected: 0, occ: 0 };
            monthTotal = d.total * roomTypeMultiplier;
            monthRoom = d.roomRevenue * roomTypeMultiplier;
            monthService = d.serviceRevenue * roomTypeMultiplier;
            monthNights = d.nights;
            monthDep = d.depositCollected * roomTypeMultiplier;
            monthOcc = d.occ;

            if (y === 2026 && m === 10) {
                monthTotal += (liveBookingAddOnRevenue * roomTypeMultiplier);
                monthDep += (liveDepositAddOn * roomTypeMultiplier);
            }
        }

        totalRev += monthTotal;
        totalRoomRev += monthRoom;
        totalServiceRev += monthService;
        totalNights += monthNights;
        totalDeposit += monthDep;
        totalOccSum += monthOcc;
    });

    const avgOcc = countMonths > 0 ? Math.round(totalOccSum / countMonths) : 0;
    const adr = totalNights > 0 ? Math.round(totalRev / totalNights) : 0;
    const revPar = Math.round(adr * (avgOcc / 100));
    const settled = Math.max(0, totalRev - totalDeposit);

    // Quick room KPIs
    const totalRooms = rooms.length;
    const availableRooms = rooms.filter(r => r.status === 'Trống').length;
    const occupiedRooms = rooms.filter(r => r.status === 'Đang thuê').length;
    const reservedRooms = rooms.filter(r => r.status === 'Đã đặt').length;
    const totalCollected = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
    const totalDepositHolding = bookings.filter(b => b.status === 'Chờ check-in' || b.status === 'Đã check-in')
                                        .reduce((sum, b) => sum + (b.depositAmount || 0), 0);
    const occRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    // Charts Initialization
    useEffect(() => {
        if (!window.Chart) return;

        const monthNames = targetMonths.map(m => `Tháng ${m}`);
        const data2024 = targetMonths.map(m => {
            const item = historicalRevenue.monthly.find(x => x.year === 2024 && x.month === m);
            return item ? Math.round(item.total / 1000000) : 0;
        });
        const data2025 = targetMonths.map(m => {
            const item = historicalRevenue.monthly.find(x => x.year === 2025 && x.month === m);
            return item ? Math.round(item.total / 1000000) : 0;
        });
        const data2026 = targetMonths.map(m => {
            const item = historicalRevenue.monthly.find(x => x.year === 2026 && x.month === m);
            let val = item ? item.total : 0;
            if (m === 10) val += liveBookingAddOnRevenue;
            return Math.round(val / 1000000);
        });

        // 1. Line Chart
        if (chartTrendRef.current) {
            if (chartTrendInstance.current) {
                chartTrendInstance.current.destroy();
            }

            const datasets = [];
            if (yearFilter === 'ALL' || yearFilter === '2024') {
                datasets.push({
                    label: 'Năm 2024 (Triệu VNĐ)',
                    data: data2024,
                    borderColor: '#94a3b8',
                    backgroundColor: 'rgba(148, 163, 184, 0.15)',
                    borderWidth: 2,
                    tension: 0.35,
                    fill: false
                });
            }
            if (yearFilter === 'ALL' || yearFilter === '2025') {
                datasets.push({
                    label: 'Năm 2025 (Triệu VNĐ)',
                    data: data2025,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.15)',
                    borderWidth: 2.5,
                    tension: 0.35,
                    fill: false
                });
            }
            if (yearFilter === 'ALL' || yearFilter === '2026') {
                datasets.push({
                    label: 'Năm 2026 (Triệu VNĐ)',
                    data: data2026,
                    borderColor: '#d4af37',
                    backgroundColor: 'rgba(212, 175, 55, 0.22)',
                    borderWidth: 3.5,
                    tension: 0.35,
                    fill: true,
                    pointBackgroundColor: '#d4af37',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 5
                });
            }

            chartTrendInstance.current = new window.Chart(chartTrendRef.current, {
                type: 'line',
                data: { labels: monthNames, datasets },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: { intersect: false, mode: 'index' },
                    plugins: {
                        legend: { position: 'top', labels: { font: { family: 'Plus Jakarta Sans', weight: '600' } } },
                        tooltip: {
                            callbacks: {
                                label: ctx => `${ctx.dataset.label}: ${ctx.raw.toLocaleString('vi-VN')} Tr ₫ (${(ctx.raw * 1000000).toLocaleString('vi-VN')} ₫)`
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { callback: v => v + ' Tr ₫', font: { family: 'Plus Jakarta Sans' } },
                            grid: { color: 'rgba(226, 232, 240, 0.6)' }
                        },
                        x: {
                            ticks: { font: { family: 'Plus Jakarta Sans', weight: '600' } },
                            grid: { display: false }
                        }
                    }
                }
            });
        }

        // 2. Donut Chart
        if (chartDonutRef.current) {
            if (chartDonutInstance.current) {
                chartDonutInstance.current.destroy();
            }

            let dLabels, dData, dColors;
            if (donutMode === 'room') {
                dLabels = ['Presidential Villa', 'Executive Suite', 'Premier Family', 'Deluxe Ocean'];
                dData = [36, 28, 22, 14];
                dColors = ['#d4af37', '#0284c7', '#8b5cf6', '#10b981'];
            } else {
                dLabels = ['VietQR (Napas 24/7)', 'Thẻ tín dụng POS', 'Tiền mặt tại quầy'];
                dData = [65, 23, 12];
                dColors = ['#10b981', '#3b82f6', '#f59e0b'];
            }

            chartDonutInstance.current = new window.Chart(chartDonutRef.current, {
                type: 'doughnut',
                data: {
                    labels: dLabels,
                    datasets: [{
                        data: dData,
                        backgroundColor: dColors,
                        borderWidth: 2,
                        borderColor: '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { boxWidth: 12, padding: 12, font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' } }
                        },
                        tooltip: {
                            callbacks: {
                                label: ctx => `${ctx.label}: ${ctx.raw}% doanh thu`
                            }
                        }
                    },
                    cutout: '62%'
                }
            });
        }

        return () => {
            if (chartTrendInstance.current) chartTrendInstance.current.destroy();
            if (chartDonutInstance.current) chartDonutInstance.current.destroy();
        };
    }, [yearFilter, periodFilter, roomTypeFilter, donutMode, historicalRevenue, liveBookingAddOnRevenue, canViewRev]);

    // Export Excel via SheetJS
    const handleExportExcel = mode => {
        if (!canViewRev) {
            addToast('Từ chối quyền hạn', 'Tài khoản không có quyền trích xuất dữ liệu doanh thu.', 'danger');
            return;
        }

        if (typeof window.XLSX !== 'undefined') {
            const XLSX = window.XLSX;
            const wb = XLSX.utils.book_new();

            const summarySheetData = [
                ["THE GRAND HORIZON LUXURY RESORT & HOTEL"],
                ["BÁO CÁO KẾT QUẢ KINH DOANH & TỔNG HỢP DOANH THU 3 NĂM (2024 - 2026)"],
                [`Thời gian xuất: ${new Date().toLocaleString('vi-VN')} | Đơn vị tính: VNĐ | Kiểm toán: Ban Tài Chính Khách Sạn`],
                [],
                [
                    "Tháng / Kỳ Báo Cáo",
                    "Doanh Thu 2024 (VNĐ)",
                    "Doanh Thu 2025 (VNĐ)",
                    "Doanh Thu 2026 (VNĐ)",
                    "Tăng Trưởng 2025 vs 2024",
                    "Tăng Trưởng 2026 vs 2025",
                    "Đêm Phòng (2026)",
                    "Tỷ Lệ Lấp Đầy (2026)",
                    "Giá TB ADR (2026) (VNĐ)"
                ]
            ];

            let tot24 = 0, tot25 = 0, tot26 = 0, totNights26 = 0;
            for (let m = 1; m <= 12; m++) {
                const d24 = historicalRevenue.monthly.find(x => x.year === 2024 && x.month === m) || { total: 0 };
                const d25 = historicalRevenue.monthly.find(x => x.year === 2025 && x.month === m) || { total: 0 };
                const d26 = historicalRevenue.monthly.find(x => x.year === 2026 && x.month === m) || { total: 0, nights: 0, occ: 0, adr: 0 };

                let t24 = d24.total;
                let t25 = d25.total;
                let t26 = d26.total;
                if (m === 10) t26 += liveBookingAddOnRevenue;

                tot24 += t24;
                tot25 += t25;
                tot26 += t26;
                totNights26 += d26.nights;

                const g25_24 = t24 > 0 ? (((t25 - t24) / t24) * 100).toFixed(1) + '%' : 'N/A';
                const g26_25 = t25 > 0 ? (((t26 - t25) / t25) * 100).toFixed(1) + '%' : 'N/A';

                summarySheetData.push([
                    `Tháng ${m < 10 ? '0' + m : m}`,
                    t24, t25, t26, g25_24, g26_25, d26.nights, d26.occ + '%', d26.adr
                ]);
            }

            const grandG25_24 = tot24 > 0 ? (((tot25 - tot24) / tot24) * 100).toFixed(1) + '%' : 'N/A';
            const grandG26_25 = tot25 > 0 ? (((tot26 - tot25) / tot25) * 100).toFixed(1) + '%' : 'N/A';
            const grandADR = totNights26 > 0 ? Math.round(tot26 / totNights26) : 0;

            summarySheetData.push([
                "TỔNG CỘNG CẢ NĂM", tot24, tot25, tot26, grandG25_24, grandG26_25, totNights26, "88.5%", grandADR
            ]);

            const wsSummary = XLSX.utils.aoa_to_sheet(summarySheetData);
            wsSummary['!cols'] = [
                { wch: 18 }, { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 18 }, { wch: 18 }, { wch: 22 }
            ];
            XLSX.utils.book_append_sheet(wb, wsSummary, "BaoCao_TongHop_3Nam");

            // Sheet 2
            const liveTx = bookings.map((b, idx) => ({
                id: `TX-2610${String(idx + 1).padStart(2, '0')}`,
                bookingId: b.id,
                date: (b.createdAt || '2026-10-10') + ' 10:00',
                year: 2026,
                customerName: b.customerName,
                cccd: b.cccd || '---',
                phone: b.phone || '---',
                roomName: b.roomName,
                nights: b.nights || 1,
                roomAmount: (b.totalAmount || 0) - (b.minibar || 0),
                serviceAmount: b.minibar || 0,
                depositAmount: b.depositAmount || 0,
                totalAmount: b.totalAmount || 0,
                method: b.depositMethod || 'VietQR',
                status: b.status === 'Đã hoàn thành' ? 'Đã thanh toán đủ' : (b.status === 'Đã check-in' ? 'Đã cọc - Đang ở' : 'Đã cọc 50%')
            }));

            const allTx = [...(historicalRevenue.sampleTransactions || []), ...liveTx];
            const txSheetData = [
                ["Mã Giao Dịch", "Mã Booking", "Thời Gian", "Năm", "Họ Tên Khách", "Số CCCD", "Số ĐT", "Hạng Phòng", "Đêm", "Tiền Phòng", "Dịch Vụ", "Tiền Cọc", "Tổng Tiền", "Phương Thức", "Trạng Thái"]
            ];
            allTx.forEach(t => {
                txSheetData.push([
                    t.id, t.bookingId, t.date, t.year, t.customerName, t.cccd, t.phone, t.roomName, t.nights, t.roomAmount, t.serviceAmount, t.depositAmount, t.totalAmount, t.method, t.status
                ]);
            });

            const wsTx = XLSX.utils.aoa_to_sheet(txSheetData);
            XLSX.utils.book_append_sheet(wb, wsTx, "ChiTiet_GiaoDich");

            const fileName = mode === 'detailed'
                ? `Grand_Hotel_Chi_Tiet_Giao_Dich_3_Nam_2024_2026.xlsx`
                : `Grand_Hotel_Bao_Cao_Doanh_Thu_3_Nam_2024_2026.xlsx`;

            XLSX.writeFile(wb, fileName);
            addToast('Xuất Excel Thành Công', `Đã tải xuống bảng tính: ${fileName}`, 'success');
        } else {
            addToast('Thông báo', 'Đang nạp thư viện xuất Excel, vui lòng thử lại sau giây lát.', 'info');
        }
    };

    // Matrix rows computation
    let grand24 = 0, grand25 = 0, grand26 = 0, grandNights26 = 0;
    const matrixRows = [];
    for (let m = 1; m <= 12; m++) {
        const d24 = historicalRevenue.monthly.find(x => x.year === 2024 && x.month === m) || { total: 0 };
        const d25 = historicalRevenue.monthly.find(x => x.year === 2025 && x.month === m) || { total: 0 };
        const d26 = historicalRevenue.monthly.find(x => x.year === 2026 && x.month === m) || { total: 0, nights: 0, occ: 0, adr: 0 };

        let t24 = d24.total * roomTypeMultiplier;
        let t25 = d25.total * roomTypeMultiplier;
        let t26 = d26.total * roomTypeMultiplier;
        if (m === 10) t26 += (liveBookingAddOnRevenue * roomTypeMultiplier);

        grand24 += t24;
        grand25 += t25;
        grand26 += t26;
        grandNights26 += d26.nights;

        const growth26_25 = t25 > 0 ? (((t26 - t25) / t25) * 100).toFixed(1) : 0;
        matrixRows.push({
            month: m,
            t24, t25, t26,
            growth: growth26_25,
            nights: d26.nights,
            occ: d26.occ,
            adr: d26.adr,
            isIncluded: targetMonths.includes(m)
        });
    }
    const grandGrowth = grand25 > 0 ? (((grand26 - grand25) / grand25) * 100).toFixed(1) : 0;
    const grandADR = grandNights26 > 0 ? Math.round(grand26 / grandNights26) : 0;

    return (
        <div id="dashboard" className="admin-page-panel active">
            {/* Toolbar Báo cáo doanh thu 3 năm - Chỉ hiển thị khi có quyền view_revenue */}
            {canViewRev && (
                <div className="revenue-toolbar-card">
                    <div className="rev-tool-title">
                        <h3><i className="fa-solid fa-chart-line" style={{ color: 'var(--gold-primary)' }}></i> BÁO CÁO DOANH THU & CHỈ SỐ TÀI CHÍNH 3 NĂM (2024 - 2026)</h3>
                        <p>Hệ thống thống kê lũy kế thời gian thực, đối soát tăng trưởng doanh thu & xuất file Excel phục vụ kiểm toán tài chính (MVC Architecture)</p>
                    </div>
                    <div className="rev-filters-wrap">
                        <select
                            value={yearFilter}
                            onChange={e => setYearFilter(e.target.value)}
                            className="rev-select"
                            title="Chọn năm thống kê"
                        >
                            <option value="ALL">Tất Cả 3 Năm (2024 - 2026)</option>
                            <option value="2026">Năm 2026 (Năm hiện tại)</option>
                            <option value="2025">Năm 2025</option>
                            <option value="2024">Năm 2024</option>
                        </select>
                        <select
                            value={periodFilter}
                            onChange={e => setPeriodFilter(e.target.value)}
                            className="rev-select"
                            title="Chọn kỳ báo cáo"
                        >
                            <option value="ALL">Cả Năm (12 Tháng)</option>
                            <option value="Q1">Quý 1 (Tháng 1 - 3)</option>
                            <option value="Q2">Quý 2 (Tháng 4 - 6)</option>
                            <option value="Q3">Quý 3 (Tháng 7 - 9)</option>
                            <option value="Q4">Quý 4 (Tháng 10 - 12)</option>
                        </select>
                        <select
                            value={roomTypeFilter}
                            onChange={e => setRoomTypeFilter(e.target.value)}
                            className="rev-select"
                            title="Chọn hạng phòng"
                        >
                            <option value="ALL">Tất Cả Hạng Phòng</option>
                            <option value="Deluxe">Deluxe Ocean View</option>
                            <option value="Suite">Premier Family Suite</option>
                            <option value="Executive">Executive Club Suite</option>
                            <option value="Villa">Presidential Ocean Villa</option>
                        </select>
                        <button
                            className="btn-excel"
                            onClick={() => handleExportExcel('summary')}
                            title="Tải xuống bảng tổng hợp doanh thu 3 năm định dạng chuẩn Excel .xlsx"
                        >
                            <i className="fa-solid fa-file-excel"></i> Xuất Excel Báo Cáo 3 Năm (.xlsx)
                        </button>
                        <button
                            className="btn btn-outline-gold"
                            onClick={() => handleExportExcel('detailed')}
                            style={{ fontSize: '0.85rem' }}
                            title="Xuất toàn bộ danh sách giao dịch khách lưu trú"
                        >
                            <i className="fa-solid fa-file-invoice-dollar"></i> Xuất Chi Tiết Giao Dịch
                        </button>
                    </div>
                </div>
            )}

            {/* 5 Financial KPIs - Chỉ hiển thị các thẻ được phân quyền */}
            {(canViewRev || canViewKpi) && (
                <div className="rev-kpi-grid">
                    {canViewRev && (
                        <div className="rev-kpi-card">
                            <div className="rev-kpi-header">
                                <span className="rev-kpi-label">Tổng Doanh Thu Thuần</span>
                                <div className="rev-kpi-icon" style={{ background: 'var(--gold-light)', color: 'var(--gold-dark)' }}>
                                    <i className="fa-solid fa-sack-dollar"></i>
                                </div>
                            </div>
                            <div className="rev-kpi-value" style={{ color: 'var(--gold-dark)' }}>
                                {formatVND(totalRev)}
                            </div>
                            <div>
                                <span className="rev-kpi-badge positive">
                                    <i className="fa-solid fa-arrow-trend-up"></i> {yearFilter === '2026' ? '+22.0% YoY' : yearFilter === '2025' ? '+32.4% vs 2024' : yearFilter === '2024' ? 'Năm Cơ Sở' : '+61.5% Lũy Kế'}
                                </span>
                                <div className="rev-kpi-sub">Lũy kế theo bộ lọc</div>
                            </div>
                        </div>
                    )}

                    {canViewRev && (
                        <div className="rev-kpi-card blue">
                            <div className="rev-kpi-header">
                                <span className="rev-kpi-label">Tiền Phòng vs Dịch Vụ</span>
                                <div className="rev-kpi-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                                    <i className="fa-solid fa-hotel"></i>
                                </div>
                            </div>
                            <div className="rev-kpi-value" style={{ fontSize: '1.35rem' }}>
                                {formatVND(totalRoomRev)}
                            </div>
                            <div className="rev-kpi-sub">
                                Dịch vụ & Minibar: {formatVND(totalServiceRev)} ({Math.round((totalServiceRev / (totalRev || 1)) * 100)}%)
                            </div>
                        </div>
                    )}

                    {canViewKpi && (
                        <div className="rev-kpi-card emerald">
                            <div className="rev-kpi-header">
                                <span className="rev-kpi-label">Số Đêm Phòng & Lấp Đầy</span>
                                <div className="rev-kpi-icon" style={{ background: '#d1fae5', color: '#059669' }}>
                                    <i className="fa-solid fa-bed"></i>
                                </div>
                            </div>
                            <div className="rev-kpi-value" style={{ color: '#059669' }}>
                                {totalNights.toLocaleString('vi-VN')} Đêm
                            </div>
                            <div className="rev-kpi-sub">Tỷ lệ lấp đầy TB: {avgOcc}%</div>
                        </div>
                    )}

                    {canViewRev && (
                        <div className="rev-kpi-card purple">
                            <div className="rev-kpi-header">
                                <span className="rev-kpi-label">Chỉ Số ADR & RevPAR</span>
                                <div className="rev-kpi-icon" style={{ background: '#ede9fe', color: '#7c3aed' }}>
                                    <i className="fa-solid fa-chart-pie"></i>
                                </div>
                            </div>
                            <div className="rev-kpi-value" style={{ color: '#7c3aed', fontSize: '1.35rem' }}>
                                ADR: {formatVND(adr)}
                            </div>
                            <div className="rev-kpi-sub">RevPAR: {formatVND(revPar)} / phòng</div>
                        </div>
                    )}

                    {canViewRev && (
                        <div className="rev-kpi-card amber">
                            <div className="rev-kpi-header">
                                <span className="rev-kpi-label">Dòng Tiền Cọc & Thực Thu</span>
                                <div className="rev-kpi-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
                                    <i className="fa-solid fa-money-bill-transfer"></i>
                                </div>
                            </div>
                            <div className="rev-kpi-value" style={{ fontSize: '1.35rem', color: '#d97706' }}>
                                Cọc: {formatVND(totalDeposit)}
                            </div>
                            <div className="rev-kpi-sub">Thực thu thanh toán: {formatVND(settled)}</div>
                        </div>
                    )}
                </div>
            )}

            {/* Charts Grid - Chỉ hiển thị khi có quyền view_revenue */}
            {canViewRev && (
                <div className="charts-container-grid">
                    <div className="chart-card">
                        <div className="chart-card-header">
                            <h4><i className="fa-solid fa-chart-column" style={{ color: 'var(--gold-primary)' }}></i> Xu Hướng Doanh Thu 12 Tháng & So Sánh Tăng Trưởng 3 Năm</h4>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                <span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#94a3b8', borderRadius: '50%', marginRight: '4px' }}></span> 2024
                                <span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#3b82f6', borderRadius: '50%', marginLeft: '10px', marginRight: '4px' }}></span> 2025
                                <span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#d4af37', borderRadius: '50%', marginLeft: '10px', marginRight: '4px' }}></span> 2026
                            </div>
                        </div>
                        <div className="chart-canvas-box">
                            <canvas ref={chartTrendRef}></canvas>
                        </div>
                    </div>

                    <div className="chart-card">
                        <div className="chart-card-header">
                            <h4><i className="fa-solid fa-pie-chart" style={{ color: '#0284c7' }}></i> Tỷ Trọng Theo Hạng Phòng</h4>
                            <select
                                value={donutMode}
                                onChange={e => setDonutMode(e.target.value)}
                                className="rev-select"
                                style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                            >
                                <option value="room">Theo Hạng Phòng</option>
                                <option value="payment">Theo Kênh Thanh Toán</option>
                            </select>
                        </div>
                        <div className="chart-canvas-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <canvas ref={chartDonutRef}></canvas>
                        </div>
                    </div>
                </div>
            )}

            {/* Matrix Table - Chỉ hiển thị khi có quyền view_revenue */}
            {canViewRev && (
                <div className="table-card" style={{ marginBottom: '25px' }}>
                    <div className="table-header-box">
                        <div>
                            <h3 className="table-title"><i className="fa-solid fa-table-list" style={{ color: 'var(--gold-primary)' }}></i> Bảng Ma Trận Doanh Thu 12 Tháng & Tăng Trưởng Lũy Kế</h3>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                So sánh đối soát chi tiết từng tháng qua các năm 2024, 2025, 2026 và các chỉ số vận hành
                            </p>
                        </div>
                        <button className="btn btn-sm btn-excel" onClick={() => handleExportExcel('summary')}>
                            <i className="fa-solid fa-file-excel"></i> Xuất Bảng Này Sang Excel
                        </button>
                    </div>
                    <div className="matrix-table-wrap">
                        <table className="matrix-table">
                            <thead>
                                <tr>
                                    <th>Tháng</th>
                                    <th>Doanh Thu 2024 (₫)</th>
                                    <th>Doanh Thu 2025 (₫)</th>
                                    <th>Doanh Thu 2026 (₫)</th>
                                    <th>Tăng Trưởng 26 vs 25</th>
                                    <th>Đêm Phòng (2026)</th>
                                    <th>Tỷ Lệ Lấp Đầy</th>
                                    <th>Giá TB ADR (2026)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {matrixRows.map(row => (
                                    <tr key={row.month} style={{ opacity: row.isIncluded ? 1 : 0.45 }}>
                                        <td><strong>Tháng {row.month < 10 ? '0' + row.month : row.month}</strong></td>
                                        <td>{formatVND(row.t24)}</td>
                                        <td>{formatVND(row.t25)}</td>
                                        <td><strong style={{ color: 'var(--gold-dark)' }}>{formatVND(row.t26)}</strong></td>
                                        <td>
                                            {row.growth > 0 ? (
                                                <span className="growth-badge-up"><i className="fa-solid fa-arrow-up"></i> +{row.growth}%</span>
                                            ) : (
                                                <span className="growth-badge-neutral">{row.growth}%</span>
                                            )}
                                        </td>
                                        <td>{row.nights} đêm</td>
                                        <td>{row.occ}%</td>
                                        <td>{formatVND(row.adr)}</td>
                                    </tr>
                                ))}
                                <tr className="row-total">
                                    <td><strong>TỔNG CỘNG CẢ NĂM</strong></td>
                                    <td>{formatVND(grand24)}</td>
                                    <td>{formatVND(grand25)}</td>
                                    <td><strong>{formatVND(grand26)}</strong></td>
                                    <td><span className="growth-badge-up"><i className="fa-solid fa-arrow-up"></i> +{grandGrowth}%</span></td>
                                    <td>{grandNights26.toLocaleString('vi-VN')} đêm</td>
                                    <td>88.5%</td>
                                    <td>{formatVND(grandADR)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Quick Room Status KPIs */}
            {(canViewKpi || canViewRev) && (
                <div className="kpi-grid">
                    {canViewKpi && (
                        <>
                            <div className="kpi-card">
                                <div className="kpi-info">
                                    <h4>Tổng Số Phòng</h4>
                                    <div className="kpi-val">{totalRooms}</div>
                                    <div className="kpi-sub">Hệ thống phòng lưu trú</div>
                                </div>
                                <div className="kpi-icon-box" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                                    <i className="fa-solid fa-building"></i>
                                </div>
                            </div>
                            <div className="kpi-card">
                                <div className="kpi-info">
                                    <h4>Phòng Đang Trống</h4>
                                    <div className="kpi-val" style={{ color: 'var(--success)' }}>{availableRooms}</div>
                                    <div className="kpi-sub">{reservedRooms} phòng đang chờ nhận</div>
                                </div>
                                <div className="kpi-icon-box" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
                                    <i className="fa-solid fa-door-open"></i>
                                </div>
                            </div>
                            <div className="kpi-card">
                                <div className="kpi-info">
                                    <h4>Phòng Đang Thuê</h4>
                                    <div className="kpi-val" style={{ color: 'var(--danger)' }}>{occupiedRooms}</div>
                                    <div className="kpi-sub">Tỷ lệ lấp đầy: {occRate}%</div>
                                </div>
                                <div className="kpi-icon-box" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>
                                    <i className="fa-solid fa-user-check"></i>
                                </div>
                            </div>
                        </>
                    )}
                    {canViewRev && (
                        <div className="kpi-card">
                            <div className="kpi-info">
                                <h4>Thực Thu Tiền Về</h4>
                                <div className="kpi-val" style={{ color: 'var(--gold-dark)' }}>
                                    {formatVND(totalCollected)}
                                </div>
                                <div className="kpi-sub">
                                    Cọc đang giữ: {formatVND(totalDepositHolding)}
                                </div>
                            </div>
                            <div className="kpi-icon-box" style={{ background: 'var(--gold-light)', color: 'var(--gold-dark)' }}>
                                <i className="fa-solid fa-sack-dollar"></i>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Recent Bookings - Chỉ hiển thị khi có quyền manage_bookings */}
            {canManageBookings && (
                <div className="table-card">
                    <div className="table-header-box">
                        <h3 className="table-title">Các Đơn Đặt Phòng Mới Nhất & Đối Soát CCCD</h3>
                        <button className="btn btn-sm btn-blue" onClick={() => onNavigateTab('bookings-management')}>
                            Xem Tất Cả Đơn Đặt
                        </button>
                    </div>
                    <div className="data-table-wrap">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Mã Đơn</th>
                                    <th>Khách Hàng (CCCD)</th>
                                    <th>Phòng</th>
                                    {canViewRev && <th>Tổng Tiền</th>}
                                    {canViewRev && <th>Đã Cọc</th>}
                                    <th>Trạng Thái</th>
                                    <th>Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.slice(0, 5).map(b => {
                                    const badgeClass = b.status === 'Đã check-in' ? 'badge-occupied' : (b.status === 'Đã hoàn thành' ? 'badge-available' : 'badge-reserved');
                                    return (
                                        <tr key={b.id}>
                                            <td><strong>{b.id}</strong></td>
                                            <td>{b.customerName} <br /><small style={{ color: 'var(--text-muted)' }}>CCCD: {b.cccd || '---'}</small></td>
                                            <td>Phòng {b.roomId}</td>
                                            {canViewRev && <td><strong>{formatVND(b.totalAmount)}</strong></td>}
                                            {canViewRev && <td><span className="status-badge badge-deposit">{formatVND(b.depositAmount)}</span></td>}
                                            <td><span className={`status-badge ${badgeClass}`}><span className="status-dot"></span> {b.status}</span></td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-gold" onClick={() => onNavigateTab('bookings-management')}>
                                                    Chi tiết
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
