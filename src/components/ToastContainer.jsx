import React from 'react';

export default function ToastContainer({ toasts }) {
    const iconMap = {
        success: 'fa-circle-check',
        danger: 'fa-triangle-exclamation',
        info: 'fa-circle-info'
    };

    return (
        <div className="toast-container" id="toastContainer">
            {toasts.map(toast => (
                <div key={toast.id} className={`toast toast-${toast.type || 'success'}`}>
                    <div className="toast-icon">
                        <i className={`fa-solid ${iconMap[toast.type] || 'fa-bell'}`}></i>
                    </div>
                    <div className="toast-text">
                        <h5>{toast.title}</h5>
                        <p>{toast.message}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
