import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export default function NoteModal() {
    const { noteModal, setNoteModal, getNote, saveNote, deleteNote, showToast } = useApp();
    const [noteText, setNoteText] = useState('');

    useEffect(() => {
        if (noteModal.isOpen && noteModal.key) {
            setNoteText(getNote(noteModal.key));
        }
    }, [noteModal.isOpen, noteModal.key, getNote]);

    if (!noteModal.isOpen) return null;

    const handleClose = () => {
        setNoteModal({ isOpen: false, key: '', title: '' });
    };

    const handleSave = () => {
        saveNote(noteModal.key, noteText);
        showToast(noteText.trim() ? 'Note saved for this active session!' : 'Note removed.', 'success');
        handleClose();
    };

    const handleDelete = () => {
        deleteNote(noteModal.key);
        showToast('Note deleted.', 'info');
        handleClose();
    };

    const hasExistingNote = Boolean(getNote(noteModal.key));

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
                            <span className="badge-pill-fresh mb-2 d-inline-block">SESSION NOTE</span>
                            <h4 className="modal-title font-playfair">Add Personal Note</h4>
                        </div>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={handleClose}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body pt-3">
                        <div className="mb-3">
                            <label className="form-label text-dark fw-semibold">
                                Note for: {noteModal.title}
                            </label>
                            <textarea
                                className="form-control"
                                rows="4"
                                placeholder="e.g., Visit Saturday morning early to get fresh strawberries and artisan cheese."
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                            ></textarea>
                            <small className="text-muted mt-1 d-block">
                                <i className="fa-regular fa-clock me-1"></i> Notes are preserved during your active browser session.
                            </small>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-4">
                            {hasExistingNote ? (
                                <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={handleDelete}
                                >
                                    <i className="fa-solid fa-trash-can me-1"></i> Delete Note
                                </button>
                            ) : <div></div>}
                            <div className="ms-auto d-flex gap-2">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={handleClose}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-fresh"
                                    onClick={handleSave}
                                >
                                    Save Note
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
