import os
import re

with open('src/index.css', 'r', encoding='utf-8') as f:
    css_content = f.read()

def clean_source(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    lines = content.split('\n')
    filtered = []
    for line in lines:
        stripped = line.strip()
        # Skip import lines
        if stripped.startswith('import ') or (stripped.startswith('from ') and 'import ' in stripped):
            continue
        # Handle multi-line imports if any
        if stripped.startswith('} from '):
            continue
        # Replace export default function / export default
        if stripped.startswith('export default function '):
            line = line.replace('export default function ', 'function ')
        elif stripped.startswith('export default '):
            line = line.replace('export default ', '')
        # Replace export const / export function
        if line.startswith('export const '):
            line = line.replace('export const ', 'const ')
        elif line.startswith('export function '):
            line = line.replace('export function ', 'function ')
        filtered.append(line)
    return '\n'.join(filtered)

# Read Model layer
models_code = '\n\n'.join([
    clean_source('src/models/StorageService.js'),
    clean_source('src/models/RoomModel.js'),
    clean_source('src/models/BookingModel.js'),
    clean_source('src/models/UserModel.js'),
    clean_source('src/models/TransactionModel.js'),
    clean_source('src/models/RevenueModel.js')
])

# Read Controller layer
controller_code = clean_source('src/controllers/useHotelController.js')

# Read View layer
views_code = '\n\n'.join([
    clean_source('src/views/common/ToastView.jsx'),
    clean_source('src/views/landing/NavbarView.jsx'),
    clean_source('src/views/landing/HeroView.jsx'),
    clean_source('src/views/landing/LandingRoomsView.jsx'),
    clean_source('src/views/landing/FooterView.jsx'),
    clean_source('src/views/admin/AdminSidebarView.jsx'),
    clean_source('src/views/admin/AdminTopbarView.jsx'),
    clean_source('src/views/admin/DashboardView.jsx'),
    clean_source('src/views/admin/RoomsView.jsx'),
    clean_source('src/views/admin/BookingsView.jsx'),
    clean_source('src/views/admin/LedgerView.jsx'),
    clean_source('src/views/admin/StaffView.jsx'),
    clean_source('src/views/admin/PermissionsView.jsx'),
    clean_source('src/views/modals/ModalsView.jsx')
])

# Read Root App View
app_code = clean_source('src/App.jsx')

react_html_template = f"""<!DOCTYPE html>
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
{css_content}
    </style>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel">
        // React Core Hooks
        const {{ useState, useEffect, useRef, useMemo, useCallback }} = React;

        // ====================================================================
        // MODEL LAYER (Dữ liệu, Thực thể & Dịch vụ lưu trữ)
        // ====================================================================
        {models_code}

        // ====================================================================
        // CONTROLLER LAYER (Bộ điều khiển nghiệp vụ & Điều phối trạng thái)
        // ====================================================================
        {controller_code}

        // ====================================================================
        // VIEW LAYER (Giao diện hiển thị người dùng & Quản trị)
        // ====================================================================
        {views_code}

        // ====================================================================
        // ROOT COMPONENT & MOUNT
        // ====================================================================
        {app_code}

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>
"""

with open('react.html', 'w', encoding='utf-8') as f:
    f.write(react_html_template)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(react_html_template)

print("Generated react.html and index.html successfully with MVC Architecture!")
