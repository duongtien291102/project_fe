/**
 * ============================================================================
 * ZERO-DEPENDENCY DEV SERVER & BUILDER (Pure Node.js ESM)
 * ============================================================================
 * Chạy trực tiếp bằng lệnh `npm run dev` mà KHÔNG cần cài thêm thư viện ngoài (vite/webpack).
 * Tự động đóng gói kiến trúc MVC từ `src/` sang `index.html` & `react.html`,
 * theo dõi thay đổi file (File Watcher) và khởi chạy máy chủ tại http://localhost:5555
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function cleanSource(filePath) {
    const fullPath = path.join(__dirname, filePath);
    const content = fs.readFileSync(fullPath, 'utf-8').replace(/^\uFEFF/, '');
    const lines = content.split('\n');
    const filtered = [];

    for (let line of lines) {
        const stripped = line.trim();
        if (stripped.startsWith('import ') || (stripped.startsWith('from ') && stripped.includes('import '))) {
            continue;
        }
        if (stripped.startsWith('} from ')) {
            continue;
        }
        if (stripped.startsWith('export default function ')) {
            line = line.replace('export default function ', 'function ');
        } else if (stripped.startsWith('export default ')) {
            line = line.replace('export default ', '');
        }
        if (line.startsWith('export const ')) {
            line = line.replace('export const ', 'const ');
        } else if (line.startsWith('export function ')) {
            line = line.replace('export function ', 'function ');
        }
        filtered.push(line);
    }
    return filtered.join('\n');
}

export function buildStandalone() {
    const cssContent = fs.readFileSync(path.join(__dirname, 'src/index.css'), 'utf-8')
        .replace(/^\uFEFF/, '')
        .replace(/<\/?style>/gi, '');

    const modelsCode = [
        cleanSource('src/models/ApiService.js'),
        cleanSource('src/models/StorageService.js'),
        cleanSource('src/models/RoomModel.js'),
        cleanSource('src/models/BookingModel.js'),
        cleanSource('src/models/UserModel.js'),
        cleanSource('src/models/TransactionModel.js'),
        cleanSource('src/models/RevenueModel.js')
    ].join('\n\n');

    const controllerCode = cleanSource('src/controllers/useHotelController.js');

    const viewsCode = [
        cleanSource('src/views/common/ToastView.jsx'),
        cleanSource('src/views/landing/NavbarView.jsx'),
        cleanSource('src/views/landing/HeroView.jsx'),
        cleanSource('src/views/landing/LandingRoomsView.jsx'),
        cleanSource('src/views/landing/FooterView.jsx'),
        cleanSource('src/views/admin/AdminSidebarView.jsx'),
        cleanSource('src/views/admin/AdminTopbarView.jsx'),
        cleanSource('src/views/admin/DashboardView.jsx'),
        cleanSource('src/views/admin/RoomsView.jsx'),
        cleanSource('src/views/admin/BookingsView.jsx'),
        cleanSource('src/views/admin/LedgerView.jsx'),
        cleanSource('src/views/admin/StaffView.jsx'),
        cleanSource('src/views/admin/PermissionsView.jsx'),
        cleanSource('src/views/modals/ModalsView.jsx')
    ].join('\n\n');

    const appCode = cleanSource('src/App.jsx');

    const html = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Grand Hotel & Resorts | Quản Lý Khách Sạn & CCCD (React MVC Architecture)</title>
    
    <!-- Google Fonts & Font Awesome Icons -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    
    <!-- Chart.js & SheetJS (Excel Export) Thư Viện Chuyên Dụng 5 Sao -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>

    <!-- React 18, ReactDOM & Babel Standalone (Zero-Install: Chạy trực tiếp React MVC không cần cài thư viện npm) -->
    <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

    <style>
${cssContent}
    </style>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel">
        // React Core Hooks
        const { useState, useEffect, useRef, useMemo, useCallback } = React;

        // ====================================================================
        // MODEL LAYER (Dữ liệu, Thực thể & Dịch vụ lưu trữ)
        // ====================================================================
        ${modelsCode}

        // ====================================================================
        // CONTROLLER LAYER (Bộ điều khiển nghiệp vụ & Điều phối trạng thái)
        // ====================================================================
        ${controllerCode}

        // ====================================================================
        // VIEW LAYER (Giao diện hiển thị người dùng & Quản trị)
        // ====================================================================
        ${viewsCode}

        // ====================================================================
        // ROOT COMPONENT & MOUNT
        // ====================================================================
        ${appCode}

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>
`;

    fs.writeFileSync(path.join(__dirname, 'react.html'), html, 'utf-8');
    fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf-8');
}

// Nếu chỉ chạy build: `node dev-server.js --build`
if (process.argv.includes('--build')) {
    buildStandalone();
    console.log('✅ Đã đóng gói thành công src/ (MVC) -> index.html & react.html!');
    process.exit(0);
}

// Build lần đầu khi khởi động dev server
try {
    buildStandalone();
} catch (err) {
    console.error('❌ Lỗi khi build từ src/:', err.message);
}

// Theo dõi thay đổi trong thư mục src/ để tự động cập nhật index.html
const srcDir = path.join(__dirname, 'src');
if (fs.existsSync(srcDir)) {
    let debounceTimer = null;
    fs.watch(srcDir, { recursive: true }, (eventType, filename) => {
        if (!filename) return;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            try {
                buildStandalone();
                console.log(`🔄 [MVC Hot-Rebuild] Đã cập nhật từ thay đổi: src/${filename}`);
            } catch (err) {
                console.error(`❌ Lỗi build khi sửa ${filename}:`, err.message);
            }
        }, 120);
    });
}

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.jsx': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    const cleanUrl = (req.url || '/').split('?')[0];
    let filePath = path.join(__dirname, cleanUrl === '/' ? 'index.html' : cleanUrl);

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(__dirname, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('500 Internal Server Error');
            return;
        }
        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'no-cache'
        });
        res.end(content);
    });
});

function startServer(port) {
    server.once('error', err => {
        if (err.code === 'EADDRINUSE') {
            startServer(port + 1);
        } else {
            console.error('Server error:', err);
        }
    });

    server.listen(port, '0.0.0.0', () => {
        console.log('\n  \x1b[32m\x1b[1mGRAND HOTEL & RESORTS - REACT MVC DEV SERVER\x1b[0m');
        console.log('  \x1b[90mChế độ Zero-Dependency (Không cần tải thêm thư viện ngoài)\x1b[0m\n');
        console.log(`  \x1b[32m➜\x1b[0m  \x1b[1mLocal:\x1b[0m   \x1b[36mhttp://localhost:${port}/\x1b[0m`);
        console.log(`  \x1b[32m➜\x1b[0m  \x1b[1mNetwork:\x1b[0m \x1b[36mhttp://0.0.0.0:${port}/\x1b[0m`);
        console.log(`  \x1b[32m➜\x1b[0m  \x1b[1mWatch:\x1b[0m   Đang tự động theo dõi thay đổi trong \x1b[33msrc/models\x1b[0m, \x1b[33msrc/views\x1b[0m, \x1b[33msrc/controllers\x1b[0m\n`);
    });
}

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 2902;
startServer(DEFAULT_PORT);
