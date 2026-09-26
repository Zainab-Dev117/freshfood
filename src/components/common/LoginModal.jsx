import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function LoginModal() {
    const { loginModalOpen, setLoginModalOpen, showToast } = useApp();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    if (!loginModalOpen) return null;

    const handleClose = () => {
        setLoginModalOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        showToast('Login/signup is not part of the current FreshFind implementation.', 'info');
        handleClose();
    };

    return (
        <div
            className="modal fade show freshfind-modal d-block"
            tabIndex="-1"
            role="dialog"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={(e) => {
                if (e.target === e.currentTarget) handleClose();
            }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header border-0 pb-0">
                        <div>
                            <span className="badge-pill-fresh mb-2 d-inline-block">WELCOME BACK</span>
                            <h3 className="modal-title font-playfair">Login to FreshFind</h3>
                        </div>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={handleClose}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body pt-3">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label text-dark fw-semibold">Email Address</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="fa-solid fa-envelope"></i>
                                    </span>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-dark fw-semibold">Password</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="fa-solid fa-lock"></i>
                                    </span>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="d-grid gap-2 mt-4">
                                <button type="submit" className="btn btn-fresh btn-lg">
                                    Login
                                </button>
                            </div>
                        </form>

                        {/* Explicit Non-functional Disclaimer Notice (Requirement 44) */}
                        <div className="alert alert-info border-0 mt-3 d-flex align-items-center gap-2 mb-0" role="alert">
                            <i className="fa-solid fa-circle-info fs-5"></i>
                            <small>
                                Login/signup is not part of the current FreshFind implementation. This platform is currently an open community exploration experience.
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
