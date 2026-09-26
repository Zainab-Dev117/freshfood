import React from 'react';
import { Link } from 'react-router-dom';

export default function Breadcrumb({ items = [] }) {
    return (
        <div className="breadcrumb-container-fresh">
            <div className="container">
                <ul className="breadcrumb-fresh">
                    <li>
                        <Link to="/">
                            <i className="fa-solid fa-house me-1"></i> Home
                        </Link>
                    </li>
                    {items.map((item, idx) => (
                        <React.Fragment key={idx}>
                            <li className="separator">/</li>
                            {item.active ? (
                                <li className="active">{item.label}</li>
                            ) : (
                                <li>
                                    <Link to={item.path}>{item.label}</Link>
                                </li>
                            )}
                        </React.Fragment>
                    ))}
                </ul>
            </div>
        </div>
    );
}
