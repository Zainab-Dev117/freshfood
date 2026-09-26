import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Breadcrumb from '../components/common/Breadcrumb';

export default function Login() {
    const { showToast } = useApp();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Login — FreshFind';
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        showToast('Login/signup is not part of the current FreshFind implementation.', 'info');
        navigate('/');
    };

    return (
        <main>
            <Breadcrumb items={[{ label: 'Login', active: true }]} />
            <section className="py-5 bg-light">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6 col-lg-5">
                            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
                                <div className="text-center mb-4">
                                    <span className="badge-pill-fresh mb-2 d-inline-block">WELCOME BACK</span>
                                    <h2 className="font-playfair text-fresh">Login to FreshFind</h2>
                                    <p className="text-muted small">Connect with your local community</p>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label text-dark fw-semibold">Email Address</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><i className="fa-solid fa-envelope"></i></span>
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
                                            <span className="input-group-text"><i className="fa-solid fa-lock"></i></span>
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

                                    <button type="submit" className="btn btn-fresh btn-lg w-100 mt-3">
                                        Login
                                    </button>
                                </form>

                                <div className="alert alert-info border-0 mt-4 d-flex align-items-center gap-2 mb-0" role="alert">
                                    <i className="fa-solid fa-circle-info fs-5"></i>
                                    <small>
                                        Login/signup is not part of the current FreshFind implementation. All discovery, bookmarking, and notes features are available freely without an account.
                                    </small>
                                </div>

                                <div className="text-center mt-4">
                                    <small className="text-muted">
                                        Don't have an account?{' '}
                                        <Link to="/signup" className="text-fresh fw-semibold text-decoration-none">
                                            Sign Up
                                        </Link>
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
