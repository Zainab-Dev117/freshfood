import React, { useEffect } from 'react';
import Breadcrumb from '../components/common/Breadcrumb';

export default function About() {
    useEffect(() => {
        document.title = 'About Us — FreshFind';
        window.scrollTo(0, 0);

        if (window.location.hash === '#team') {
            const el = document.getElementById('team');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    const team = [
        {
            name: 'Zainab Ali Khan',
            role: 'Team Leader & Developer',
            image: '/images/team-img/team1.jpeg',
            desc: 'Leader of the team. Works on website architecture, content organization, JavaScript logic, and JSON relational datasets.'
        },
        {
            name: 'Fatima Haroon',
            role: 'Documentation & Developer',
            image: '/images/team-img/team2.jpeg',
            desc: 'Contributes to project development and manages comprehensive produce guides and market directory information.'
        },
        {
            name: 'Tasbiha Ali Khan',
            role: 'Developer',
            image: '/images/team-img/team3.jpeg',
            desc: 'Focuses on user experience design, modular interfaces, and intuitive navigation flows across all views.'
        },
        {
            name: 'Muhammad Usman Khan',
            role: 'Responsive UI',
            image: '/images/team-img/team4.jpeg',
            desc: 'Specializes in responsive layout adaptations, cross-device testing, and touch-friendly mobile navigation.'
        }
    ];

    return (
        <main>
            {/* Breadcrumb */}
            <Breadcrumb items={[{ label: 'About Us', active: true }]} />

            {/* About Hero */}
            <section className="py-5 bg-white border-bottom">
                <div className="container">
                    <div className="max-w-800">
                        <span className="badge-pill-fresh mb-2 d-inline-block">ABOUT FRESHFIND</span>
                        <h1 className="font-playfair text-fresh mb-2 display-6 fw-bold">Fresh All Along</h1>
                        <p className="text-muted lead mb-0">
                            Connecting residents with wholesome local markets, fresh seasonal produce, and the hardworking growers behind them.
                        </p>
                    </div>
                </div>
            </section>

            {/* About Story & Mission */}
            <section className="py-5 bg-light border-bottom">
                <div className="container">
                    <div className="row gy-5 align-items-center">
                        <div className="col-lg-6">
                            <span className="badge-pill-fresh mb-2 d-inline-block">OUR STORY & VISION</span>
                            <h2 className="font-playfair text-fresh mb-3">Bringing Local Markets Closer to Every Neighborhood</h2>
                            <p className="text-muted">
                                FreshFind is a community-focused web platform designed to help residents discover local farmers markets and fresh seasonal produce across their city.
                            </p>
                            <p className="text-muted">
                                Our platform unites vital market information in one accessible location — including operating schedules, verified addresses, real-time open/closed status, and typical produce availability. We make it effortless for users to plan their visits around peak harvest times and support local organic farmers.
                            </p>
                            <div className="p-3 bg-white rounded-3 border-start border-4 border-success shadow-sm mt-3">
                                <h6 className="fw-bold mb-1 text-fresh">Our Mission</h6>
                                <p className="text-muted small mb-0">
                                    Local farmers markets ko discover karna easy banana aur community ko fresh, nutritious, and sustainable choices provide karna.
                                </p>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="row g-3">
                                <div className="col-sm-6">
                                    <div className="card border-0 shadow-sm p-4 rounded-4 h-100 bg-white">
                                        <div className="text-fresh fs-2 mb-2"><i className="fa-solid fa-leaf"></i></div>
                                        <h5 className="fw-bold">Fresh Harvests</h5>
                                        <p className="text-muted small mb-0">Direct access to seasonal fruits, crisp greens, and pesticide-free produce.</p>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="card border-0 shadow-sm p-4 rounded-4 h-100 bg-white">
                                        <div className="text-fresh fs-2 mb-2"><i className="fa-solid fa-handshake-angle"></i></div>
                                        <h5 className="fw-bold">Local Community</h5>
                                        <p className="text-muted small mb-0">Strengthening local food systems and supporting small-scale growers.</p>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="card border-0 shadow-sm p-4 rounded-4 h-100 bg-white">
                                        <div className="text-fresh fs-2 mb-2"><i className="fa-solid fa-compass"></i></div>
                                        <h5 className="fw-bold">Easy Discovery</h5>
                                        <p className="text-muted small mb-0">Multi-criteria filtering by area, day of the week, and product type.</p>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="card border-0 shadow-sm p-4 rounded-4 h-100 bg-white">
                                        <div className="text-fresh fs-2 mb-2"><i className="fa-solid fa-heart"></i></div>
                                        <h5 className="fw-bold">Save & Visit</h5>
                                        <p className="text-muted small mb-0">Bookmarks, custom session visit notes, and interactive map directions.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How Platform Works Flow */}
            <section className="py-5 bg-white border-bottom">
                <div className="container">
                    <div className="text-center max-w-700 mx-auto mb-5">
                        <span className="badge-pill-fresh mb-2 d-inline-block">WORKFLOW ARCHITECTURE</span>
                        <h2 className="font-playfair text-fresh mb-2">How the Platform Works</h2>
                        <p className="text-muted">A clear, six-step journey from discovery to market visit.</p>
                    </div>

                    <div className="row g-4 text-center">
                        <div className="col-lg-2 col-md-4 col-6">
                            <div className="card border-0 p-3 h-100 bg-light rounded-4">
                                <div className="text-fresh fs-3 mb-2"><i className="fa-solid fa-magnifying-glass"></i></div>
                                <h6 className="fw-bold mb-1">01. Discover</h6>
                                <small className="text-muted">Browse nearby markets</small>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-4 col-6">
                            <div className="card border-0 p-3 h-100 bg-light rounded-4">
                                <div className="text-fresh fs-3 mb-2"><i className="fa-solid fa-sliders"></i></div>
                                <h6 className="fw-bold mb-1">02. Search</h6>
                                <small className="text-muted">Keyword & area match</small>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-4 col-6">
                            <div className="card border-0 p-3 h-100 bg-light rounded-4">
                                <div className="text-fresh fs-3 mb-2"><i className="fa-solid fa-filter"></i></div>
                                <h6 className="fw-bold mb-1">03. Filter</h6>
                                <small className="text-muted">By day & produce</small>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-4 col-6">
                            <div className="card border-0 p-3 h-100 bg-light rounded-4">
                                <div className="text-fresh fs-3 mb-2"><i className="fa-regular fa-calendar-check"></i></div>
                                <h6 className="fw-bold mb-1">04. Explore</h6>
                                <small className="text-muted">View 7-day schedules</small>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-4 col-6">
                            <div className="card border-0 p-3 h-100 bg-light rounded-4">
                                <div className="text-fresh fs-3 mb-2"><i className="fa-regular fa-bookmark"></i></div>
                                <h6 className="fw-bold mb-1">05. Save</h6>
                                <small className="text-muted">Bookmark & add notes</small>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-4 col-6">
                            <div className="card border-0 p-3 h-100 bg-light rounded-4">
                                <div className="text-fresh fs-3 mb-2"><i className="fa-solid fa-map-pin"></i></div>
                                <h6 className="fw-bold mb-1">06. Visit</h6>
                                <small className="text-muted">Map & directions</small>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Project Information */}
            <section className="py-5 bg-light border-bottom">
                <div className="container">
                    <div className="card border-0 shadow-sm p-4 p-md-5 rounded-4 bg-white">
                        <span className="badge-pill-fresh mb-2 d-inline-block">TECHNICAL SPECIFICATIONS</span>
                        <h3 className="font-playfair text-fresh mb-3">Project Information</h3>

                        <div className="row g-4">
                            <div className="col-md-3 col-sm-6">
                                <h6 className="fw-bold text-muted small text-uppercase">Project Name</h6>
                                <p className="fs-5 fw-bold text-dark mb-0">FreshFind</p>
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <h6 className="fw-bold text-muted small text-uppercase">Brand Theme</h6>
                                <p className="fs-5 fw-bold text-dark mb-0">Fresh All Along</p>
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <h6 className="fw-bold text-muted small text-uppercase">Technologies</h6>
                                <p className="small text-dark mb-0">React 18 (JSX), Vanilla CSS3, Leaflet OpenStreetMap, React Router</p>
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <h6 className="fw-bold text-muted small text-uppercase">Architecture</h6>
                                <p className="small text-dark mb-0">Frontend-Only Client Storage (localStorage & sessionStorage)</p>
                            </div>
                        </div>

                        <div className="alert alert-success border-0 mt-4 mb-0 d-flex align-items-center gap-3">
                            <i className="fa-solid fa-circle-check fs-4"></i>
                            <div>
                                <strong>Notice:</strong> This web project is an independent frontend-only demonstration. All visitor counts and simulated statistics are clearly marked as educational demonstrations.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-5 bg-white" id="team">
                <div className="container">
                    <div className="text-center max-w-700 mx-auto mb-5">
                        <span className="badge-pill-fresh mb-2 d-inline-block">DEVELOPMENT TEAM</span>
                        <h2 className="font-playfair text-fresh mb-2">The People Behind FreshFind</h2>
                        <p className="text-muted">A collaborative development team dedicated to creating an intuitive and responsive local discovery experience.</p>
                    </div>

                    <div className="row g-4">
                        {team.map((member, idx) => (
                            <div key={idx} className="col-lg-3 col-md-6">
                                <div className="team-card card border-0 shadow-sm p-4 rounded-4 text-center h-100">
                                    <div className="rounded-circle overflow-hidden mx-auto mb-3" style={{ width: '120px', height: '120px' }}>
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-100 h-100 object-fit-cover"
                                        />
                                    </div>
                                    <h5 className="fw-bold mb-1">{member.name}</h5>
                                    <p className="text-fresh small fw-semibold mb-2">{member.role}</p>
                                    <p className="text-muted small mb-0">{member.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
