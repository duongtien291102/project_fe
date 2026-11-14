/**
 * ============================================================================
 * ROOT APPLICATION VIEW: App.jsx
 * ============================================================================
 * Tuân thủ nghiêm ngặt mô hình kiến trúc MVC (Model - View - Controller).
 * App.jsx đóng vai trò kết nối bộ điều khiển useHotelController với các View hiển thị:
 * - Landing Page Views: Navbar, Hero, LandingRooms, Footer
 * - Admin Panel Views: Sidebar, Topbar, Dashboard, Rooms, Bookings, Ledger, Staff, Permissions
 * - Interactive Dialogs: ModalsView
 * - Feedback View: ToastView
 */

import React from 'react';
import { useHotelController, ADMIN_TAB_TITLES } from './controllers/useHotelController.js';
import { PERMISSION_GROUPS } from './models/UserModel.js';

// Views
import ToastView from './views/common/ToastView.jsx';
import NavbarView from './views/landing/NavbarView.jsx';
import HeroView from './views/landing/HeroView.jsx';
import LandingRoomsView from './views/landing/LandingRoomsView.jsx';
import FooterView from './views/landing/FooterView.jsx';

import AdminSidebarView from './views/admin/AdminSidebarView.jsx';
import AdminTopbarView from './views/admin/AdminTopbarView.jsx';
import DashboardView from './views/admin/DashboardView.jsx';
import RoomsView from './views/admin/RoomsView.jsx';
import BookingsView from './views/admin/BookingsView.jsx';
import LedgerView from './views/admin/LedgerView.jsx';
import StaffView from './views/admin/StaffView.jsx';
import PermissionsView from './views/admin/PermissionsView.jsx';
import ModalsView from './views/modals/ModalsView.jsx';

export default function App() {
    const ctrl = useHotelController();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    return (
        <div className="grand-hotel-react-app">
            <ToastView toasts={ctrl.toasts} />

            {ctrl.viewMode === 'landing' ? (
                <div id="landing-view">
                    <NavbarView
                        currentUser={ctrl.currentUser}
                        onOpenAuthModal={() => ctrl.openModal('auth')}
                        onOpenCustomerProfile={() => ctrl.openModal('customerProfile')}
                        onOpenMyBookings={() => ctrl.openModal('myBookings')}
                        onEnterAdmin={() => ctrl.handleSetViewMode('admin')}
                        onLogout={ctrl.handleLogout}
                    />

                    <HeroView
                        searchParams={ctrl.searchParams}
                        setSearchParams={ctrl.setSearchParams}
                        onSearch={ctrl.handleSearch}
                    />

                    <LandingRoomsView
                        rooms={ctrl.rooms}
                        currentFilter={ctrl.currentFilter}
                        onFilterChange={ctrl.setCurrentFilter}
                        onBookRoom={ctrl.handleBookRoomClick}
                    />

                    <FooterView />
                </div>
            ) : (
                <div id="admin-view" style={{ display: 'block' }}>
                    <div className="admin-layout">
                        <div
                            className={`admin-sidebar-backdrop ${isSidebarOpen ? 'active' : ''}`}
                            onClick={() => setIsSidebarOpen(false)}
                        />

                        <AdminSidebarView
                            adminTab={ctrl.adminTab}
                            isSidebarOpen={isSidebarOpen}
                            onCloseSidebar={() => setIsSidebarOpen(false)}
                            onTabChange={ctrl.handleTabChange}
                            onViewCustomerLanding={() => ctrl.setViewMode('landing')}
                            onResetDemoData={ctrl.handleResetDemoData}
                            checkPermission={ctrl.checkPermission}
                            onLogout={ctrl.handleLogout}
                        />

                        <main className="admin-content">
                            <AdminTopbarView
                                title={ADMIN_TAB_TITLES[ctrl.adminTab] || 'Quản Trị'}
                                staffUsers={ctrl.staffUsers}
                                rolesConfig={ctrl.rolesConfig}
                                activeStaffId={ctrl.activeStaffId}
                                currentUser={ctrl.currentUser}
                                isSysAdminUser={ctrl.isSysAdminUser}
                                onNavigateTab={ctrl.handleTabChange}
                                onSwitchActiveStaff={id => {
                                    if (!ctrl.isSysAdminUser) return;
                                    ctrl.setActiveStaffId(id);
                                    ctrl.addToast(
                                        'Chuyển vai trò thành công',
                                        `Đang thao tác với tư cách: ${ctrl.staffUsers.find(s => s.id === id)?.name}`,
                                        'info'
                                    );
                                }}
                                onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
                            />

                            <div className="admin-body">
                                {ctrl.adminTab === 'dashboard' && (
                                    <DashboardView
                                        rooms={ctrl.rooms}
                                        bookings={ctrl.bookings}
                                        transactions={ctrl.transactions}
                                        historicalRevenue={ctrl.historicalRevenue}
                                        checkPermission={ctrl.checkPermission}
                                        onNavigateTab={tab => ctrl.setAdminTab(tab)}
                                        addToast={ctrl.addToast}
                                    />
                                )}

                                {ctrl.adminTab === 'rooms-management' && (
                                    <RoomsView
                                        rooms={ctrl.rooms}
                                        checkPermission={ctrl.checkPermission}
                                        onOpenNewRoomModal={() => ctrl.openModal('newRoom')}
                                        onQuickCheckIn={ctrl.handleQuickCheckIn}
                                        onConfirmCheckIn={ctrl.handleConfirmCheckIn}
                                        onOpenCheckoutModal={ctrl.handleOpenCheckoutModal}
                                        onCompleteCleaning={ctrl.handleCompleteCleaning}
                                    />
                                )}

                                {ctrl.adminTab === 'bookings-management' && (
                                    <BookingsView
                                        bookings={ctrl.bookings}
                                        checkPermission={ctrl.checkPermission}
                                        onQuickWalkInBooking={() => ctrl.handleQuickCheckIn()}
                                        onOpenCccdView={b => ctrl.openModal('adminCccdView', b)}
                                        onConfirmCheckIn={ctrl.handleConfirmCheckIn}
                                        onOpenCheckoutModal={ctrl.handleOpenCheckoutModal}
                                        onCancelBooking={ctrl.handleCancelBooking}
                                    />
                                )}

                                {ctrl.adminTab === 'financial-ledger' && (
                                    <LedgerView
                                        transactions={ctrl.transactions}
                                        bookings={ctrl.bookings}
                                        checkPermission={ctrl.checkPermission}
                                        onOpenManualTxModal={() => ctrl.openModal('manualTx')}
                                    />
                                )}

                                {ctrl.adminTab === 'users-management' && (
                                    <StaffView
                                        staffUsers={ctrl.staffUsers}
                                        rolesConfig={ctrl.rolesConfig}
                                        checkPermission={ctrl.checkPermission}
                                        onOpenAddStaffModal={() => ctrl.openModal('staff')}
                                        onOpenEditStaffModal={s => ctrl.openModal('staff', { staff: s })}
                                        onToggleStaffStatus={ctrl.handleToggleStaffStatus}
                                        onDeleteStaffUser={ctrl.handleDeleteStaffUser}
                                    />
                                )}

                                {ctrl.adminTab === 'permissions-config' && (
                                    <PermissionsView
                                        rolesConfig={ctrl.rolesConfig}
                                        permissionGroups={PERMISSION_GROUPS}
                                        onPermissionToggle={ctrl.handlePermissionToggle}
                                        onOpenNewRoleModal={() => ctrl.openModal('newRole')}
                                        onResetRolesMatrix={ctrl.handleResetRolesMatrix}
                                        onSavePermissions={ctrl.handleSavePermissions}
                                    />
                                )}
                            </div>
                        </main>
                    </div>
                </div>
            )}

            <ModalsView
                activeModal={ctrl.activeModal}
                modalData={ctrl.modalData}
                onCloseModal={ctrl.closeModal}
                currentUser={ctrl.currentUser}
                onLoginSuccess={ctrl.handleLoginSuccess}
                onRegisterSuccess={ctrl.handleRegisterSuccess}
                onUpdateProfileSuccess={ctrl.handleUpdateProfileSuccess}
                onSubmitBooking={ctrl.handleSubmitBooking}
                onConfirmQrPaid={ctrl.handleConfirmQrPaid}
                onFinalizeCheckout={ctrl.handleFinalizeCheckout}
                onCreateManualTx={ctrl.handleCreateManualTx}
                onCreateRoom={ctrl.handleCreateRoom}
                onSaveStaff={ctrl.handleSaveStaff}
                onCreateRole={ctrl.handleCreateRole}
                bookings={ctrl.bookings}
                rooms={ctrl.rooms}
                rolesConfig={ctrl.rolesConfig}
            />
        </div>
    );
}
