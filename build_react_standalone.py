import os

with open('src/index.css', 'r', encoding='utf-8') as f:
    css_content = f.read()

with open('src/constants/initialData.js', 'r', encoding='utf-8') as f:
    constants_content = f.read()
# Remove export keywords for inline script
constants_inline = constants_content.replace('export const ', 'const ').replace('export function ', 'function ')

def read_comp(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    # Strip imports and export default
    lines = content.split('\n')
    filtered = []
    for line in lines:
        if line.strip().startswith('import '):
            continue
        if line.strip().startswith('export default '):
            line = line.replace('export default ', '')
        filtered.append(line)
    return '\n'.join(filtered)

toast_comp = read_comp('src/components/ToastContainer.jsx')
navbar_comp = read_comp('src/components/Navbar.jsx')
hero_comp = read_comp('src/components/Hero.jsx')
landing_rooms_comp = read_comp('src/components/LandingRooms.jsx')
footer_comp = read_comp('src/components/Footer.jsx')
admin_sidebar_comp = read_comp('src/components/AdminSidebar.jsx')
admin_topbar_comp = read_comp('src/components/AdminTopbar.jsx')
dashboard_tab_comp = read_comp('src/components/DashboardTab.jsx')
rooms_tab_comp = read_comp('src/components/RoomsTab.jsx')
bookings_tab_comp = read_comp('src/components/BookingsTab.jsx')
ledger_tab_comp = read_comp('src/components/LedgerTab.jsx')
staff_tab_comp = read_comp('src/components/StaffTab.jsx')
permissions_tab_comp = read_comp('src/components/PermissionsTab.jsx')
modals_comp = read_comp('src/components/Modals.jsx')
app_comp = read_comp('src/App.jsx')

react_html_template = f"""<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Grand Hotel & Resorts | Quản Lý Khách Sạn & CCCD (React Edition)</title>
    
    <!-- Google Fonts & Font Awesome Icons -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    
    <!-- Chart.js & SheetJS (Excel Export) Thư Viện Chuyên Dụng 5 Sao -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>

    <!-- React 18, ReactDOM & Babel Standalone (Chạy trực tiếp React không cần cài thư viện qua npm) -->
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
        const {{ useState, useEffect, useRef, useMemo, useCallback }} = React;

        {constants_inline}

        {toast_comp}

        {navbar_comp}

        {hero_comp}

        {landing_rooms_comp}

        {footer_comp}

        {admin_sidebar_comp}

        {admin_topbar_comp}

        {dashboard_tab_comp}

        {rooms_tab_comp}

        {bookings_tab_comp}

        {ledger_tab_comp}

        {staff_tab_comp}

        {permissions_tab_comp}

        {modals_comp}

        {app_comp}

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

print("Generated react.html and index.html successfully!")
