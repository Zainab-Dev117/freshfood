import React from 'react';
import { useApp } from '../../context/AppContext';

export default function Toast() {
    const { toast } = useApp();

    if (!toast.show) return null;

    const icons = {
        success: 'fa-solid fa-circle-check text-success',
        info: 'fa-solid fa-circle-info text-primary',
        warning: 'fa-solid fa-triangle-exclamation text-warning',
        danger: 'fa-solid fa-circle-xmark text-danger'
    };

    return (
        <div
            className="toast-container position-fixed bottom-0 end-0 p-3"
            style={{ zIndex: 1100 }}
        >
            <div
                className="toast show align-items-center border-0 shadow-lg text-dark bg-white custom-toast"
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
            >
                <div className="d-flex">
                    <div className="toast-body d-flex align-items-center gap-2">
                        <i className={`${icons[toast.type] || icons.info} fs-5`}></i>
                        <div>{toast.message}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
