import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function ShareModal() {
    const { shareModal, setShareModal, showToast } = useApp();
    const [copied, setCopied] = useState(false);

    if (!shareModal.isOpen) return null;

    const handleClose = () => {
        setShareModal({ isOpen: false, title: '', text: '', url: '' });
        setCopied(false);
    };

    const url = shareModal.url || window.location.href;
    const text = shareModal.text || shareModal.title || 'Check this out on FreshFind!';

    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;

    const handleCopy = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                setCopied(true);
                showToast('Link copied to clipboard!', 'success');
                setTimeout(() => setCopied(false), 2000);
            });
        } else {
            showToast('Link copied!', 'success');
        }
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
                            <span className="badge-pill-fresh mb-2 d-inline-block">SPREAD THE WORD</span>
                            <h4 className="modal-title font-playfair">Share This Fresh Find</h4>
                        </div>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={handleClose}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body pt-3">
                        <p className="text-muted mb-3">
                            Share this recommendation with friends, family, and neighbours:
                        </p>
                        <div className="share-buttons-grid mb-4">
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="share-btn share-whatsapp"
                            >
                                <i className="fa-brands fa-whatsapp"></i> WhatsApp
                            </a>
                            <a
                                href={facebookUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="share-btn share-facebook"
                            >
                                <i className="fa-brands fa-facebook"></i> Facebook
                            </a>
                            <a
                                href={twitterUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="share-btn share-twitter"
                            >
                                <i className="fa-brands fa-x-twitter"></i> X / Twitter
                            </a>
                        </div>
                        <label className="form-label text-dark fw-semibold">Or Copy Page Link:</label>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                value={url}
                                readOnly
                            />
                            <button
                                className="btn btn-fresh"
                                type="button"
                                onClick={handleCopy}
                            >
                                <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'} me-1`}></i>{' '}
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
