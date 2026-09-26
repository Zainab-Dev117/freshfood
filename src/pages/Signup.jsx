import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Breadcrumb from '../components/common/Breadcrumb';

export default function Signup() {
    const { showToast } = useApp();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Sign Up — FreshFind';
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        showToast('Login/signup is not part of the current FreshFind implementation.', 'info');
        navigate('/');
    };

    return (
        <main>
            <Breadcrumb items={[{ label: 'Sign Up', active: true }]} />
            <section className="py-5 bg-light">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6 col-lg-5">
                            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
                                <div className="text-center mb-4">
                                    <span className="badge-pill-fresh mb-2 d-inline-block">JOIN OUR COMMUNITY</span>
                                    <h2 className="font-playfair text-fresh">Create Account</h2>
                                    <p className="text-muted small">Explore local farmers markets and fresh produce</p>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label text-dark fw-semibold">Full Name</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><i className="fa-solid fa-user"></i></span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Zainab Khan"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

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
                                        <label className="form-label text-dark fw-semibold">Create Password</label>
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
                                        Create Free Account
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
                                        Already have an account?{' '}
                                        <Link to="/login" className="text-fresh fw-semibold text-decoration-none">
                                            Login
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
