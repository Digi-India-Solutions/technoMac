// import React, { useState, useEffect, useRef } from 'react';
// import AdminLayout from '../../../components/feature/AdminLayout';

// const API_BASE = '/api/newupdate';

// // ── Toast ────────────────────────────────────────────────────────
// function Toast({ msg, type, onClose }) {
//     useEffect(() => {
//         const t = setTimeout(onClose, 3000);
//         return () => clearTimeout(t);
//     }, [onClose]);

//     const bg = type === 'success' ? '#16a34a' : type === 'error' ? '#dc2626' : '#2563eb';
//     return (
//         <div style={{
//             position: 'fixed', top: 20, right: 20, zIndex: 9999,
//             background: bg, color: '#fff', padding: '12px 20px',
//             borderRadius: 8, fontSize: 14, fontWeight: 500,
//             boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
//             display: 'flex', alignItems: 'center', gap: 10,
//             maxWidth: 320, animation: 'slideIn 0.2s ease',
//         }}>
//             <span>{type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
//             <span>{msg}</span>
//             <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 16 }}>×</button>
//         </div>
//     );
// }

// // ── Confirm Dialog ───────────────────────────────────────────────
// function ConfirmDialog({ msg, onConfirm, onCancel }) {
//     return (
//         <div style={{
//             position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
//             zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center',
//         }}>
//             <div style={{
//                 background: '#fff', borderRadius: 12, padding: '28px 32px',
//                 width: 360, boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
//             }}>
//                 <h3 style={{ margin: '0 0 10px', fontSize: 16, color: '#111' }}>Confirm Delete</h3>
//                 <p style={{ margin: '0 0 24px', fontSize: 14, color: '#555' }}>{msg}</p>
//                 <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
//                     <button onClick={onCancel} style={btnStyle('#f3f4f6', '#374151')}>Cancel</button>
//                     <button onClick={onConfirm} style={btnStyle('#dc2626', '#fff')}>Delete</button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// const btnStyle = (bg, color) => ({
//     background: bg, color, border: 'none', borderRadius: 7,
//     padding: '9px 20px', fontSize: 13, fontWeight: 600,
//     cursor: 'pointer', transition: 'opacity 0.15s',
// });

// // ── Modal Form ───────────────────────────────────────────────────
// function UpdateModal({ mode, initial, onClose, onSaved }) {
//     const [form, setForm] = useState({
//         title: initial?.title || '',
//         description: initial?.description || '',
//         points: initial?.points?.join('\n') || '',
//     });
//     const [imageFile, setImageFile] = useState(null);
//     const [imagePreview, setImagePreview] = useState(initial?.image || '');
//     const [loading, setLoading] = useState(false);
//     const [errors, setErrors] = useState({});
//     const fileRef = useRef();

//     const validate = () => {
//         const e = {};
//         if (!form.title.trim()) e.title = 'Title is required';
//         if (!form.description.trim()) e.description = 'Description is required';
//         if (mode === 'create' && !imageFile) e.image = 'Cover image is required';
//         return e;
//     };

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (!file) return;
//         setImageFile(file);
//         setImagePreview(URL.createObjectURL(file));
//         setErrors((prev) => ({ ...prev, image: undefined }));
//     };

//     const handleSubmit = async () => {
//         const e = validate();
//         if (Object.keys(e).length) { setErrors(e); return; }

//         setLoading(true);
//         try {
//             const fd = new FormData();
//             fd.append('title', form.title.trim());
//             fd.append('description', form.description.trim());

//             // Convert textarea lines → JSON array
//             const pointsArr = form.points
//                 .split('\n')
//                 .map((p) => p.trim())
//                 .filter(Boolean);
//             fd.append('points', JSON.stringify(pointsArr));

//             if (imageFile) fd.append('image', imageFile);

//             const url = mode === 'create'
//                 ? `${API_BASE}/create`
//                 : `${API_BASE}/${initial._id}`;
//             const method = mode === 'create' ? 'POST' : 'PUT';

//             const res = await fetch(url, { method, body: fd });
//             const data = await res.json();

//             if (!data.success) throw new Error(data.message);
//             onSaved(data.data, mode);
//         } catch (err) {
//             setErrors({ submit: err.message });
//         } finally {
//             setLoading(false);
//         }
//     };

//     const inputStyle = (hasErr) => ({
//         width: '100%', padding: '9px 12px', border: `1px solid ${hasErr ? '#dc2626' : '#d1d5db'}`,
//         borderRadius: 7, fontSize: 14, outline: 'none', boxSizing: 'border-box',
//         fontFamily: 'inherit', transition: 'border-color 0.15s',
//     });

//     return (
//         <div style={{
//             position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
//             zIndex: 9997, display: 'flex', alignItems: 'center', justifyContent: 'center',
//             padding: 16,
//         }}>
//             <div style={{
//                 background: '#fff', borderRadius: 14, width: '100%', maxWidth: 560,
//                 maxHeight: '90vh', overflowY: 'auto',
//                 boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
//             }}>
//                 {/* Header */}
//                 <div style={{
//                     padding: '20px 24px 16px', borderBottom: '1px solid #f0f0f0',
//                     display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//                     position: 'sticky', top: 0, background: '#fff', zIndex: 1,
//                 }}>
//                     <h2 style={{ margin: 0, fontSize: 17, color: '#111', fontWeight: 700 }}>
//                         {mode === 'create' ? '+ Add New Update' : 'Edit Update'}
//                     </h2>
//                     <button onClick={onClose} style={{
//                         background: '#f3f4f6', border: 'none', borderRadius: 6,
//                         width: 30, height: 30, cursor: 'pointer', fontSize: 18, color: '#555',
//                         display: 'flex', alignItems: 'center', justifyContent: 'center',
//                     }}>×</button>
//                 </div>

//                 {/* Body */}
//                 <div style={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

//                     {/* Image Upload */}
//                     <div>
//                         <label style={labelStyle}>Cover Image {mode === 'create' && <span style={{ color: '#dc2626' }}>*</span>}</label>
//                         <div
//                             onClick={() => fileRef.current.click()}
//                             style={{
//                                 border: `2px dashed ${errors.image ? '#dc2626' : '#d1d5db'}`,
//                                 borderRadius: 10, cursor: 'pointer', overflow: 'hidden',
//                                 background: '#fafafa', transition: 'border-color 0.15s',
//                                 minHeight: 140, display: 'flex', alignItems: 'center', justifyContent: 'center',
//                             }}
//                         >
//                             {imagePreview ? (
//                                 <img src={imagePreview} alt="preview" style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
//                             ) : (
//                                 <div style={{ textAlign: 'center', padding: 20, color: '#9ca3af' }}>
//                                     <div style={{ fontSize: 32, marginBottom: 6 }}>🖼</div>
//                                     <div style={{ fontSize: 13 }}>Click to upload image</div>
//                                     <div style={{ fontSize: 11, marginTop: 4 }}>JPG, PNG, WEBP</div>
//                                 </div>
//                             )}
//                         </div>
//                         <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
//                         {imageFile && (
//                             <p style={{ fontSize: 12, color: '#16a34a', margin: '4px 0 0' }}>✓ {imageFile.name}</p>
//                         )}
//                         {errors.image && <p style={errStyle}>{errors.image}</p>}
//                     </div>

//                     {/* Title */}
//                     <div>
//                         <label style={labelStyle}>Title <span style={{ color: '#dc2626' }}>*</span></label>
//                         <input
//                             type="text"
//                             value={form.title}
//                             onChange={(e) => { setForm((p) => ({ ...p, title: e.target.value })); setErrors((p) => ({ ...p, title: undefined })); }}
//                             placeholder="e.g. Advanced Dental Chair Technology"
//                             style={inputStyle(errors.title)}
//                         />
//                         {errors.title && <p style={errStyle}>{errors.title}</p>}
//                     </div>

//                     {/* Description */}
//                     <div>
//                         <label style={labelStyle}>Description <span style={{ color: '#dc2626' }}>*</span></label>
//                         <textarea
//                             value={form.description}
//                             onChange={(e) => { setForm((p) => ({ ...p, description: e.target.value })); setErrors((p) => ({ ...p, description: undefined })); }}
//                             placeholder="Enter description..."
//                             rows={3}
//                             style={{ ...inputStyle(errors.description), resize: 'vertical' }}
//                         />
//                         {errors.description && <p style={errStyle}>{errors.description}</p>}
//                     </div>

//                     {/* Points */}
//                     <div>
//                         <label style={labelStyle}>
//                             Bullet Points
//                             <span style={{ color: '#9ca3af', fontWeight: 400, marginLeft: 6 }}>(one per line)</span>
//                         </label>
//                         <textarea
//                             value={form.points}
//                             onChange={(e) => setForm((p) => ({ ...p, points: e.target.value }))}
//                             placeholder={`Premium patient comfort\nModern ergonomic design\nLED operating light`}
//                             rows={4}
//                             style={{ ...inputStyle(false), resize: 'vertical', fontFamily: 'monospace', fontSize: 13 }}
//                         />
//                         <p style={{ fontSize: 11, color: '#9ca3af', margin: '4px 0 0' }}>
//                             {form.points.split('\n').filter((p) => p.trim()).length} point(s) added
//                         </p>
//                     </div>

//                     {errors.submit && (
//                         <div style={{
//                             background: '#fef2f2', border: '1px solid #fecaca',
//                             borderRadius: 7, padding: '10px 14px', fontSize: 13, color: '#dc2626',
//                         }}>
//                             {errors.submit}
//                         </div>
//                     )}

//                     {/* Actions */}
//                     <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4 }}>
//                         <button onClick={onClose} style={btnStyle('#f3f4f6', '#374151')}>Cancel</button>
//                         <button
//                             onClick={handleSubmit}
//                             disabled={loading}
//                             style={{ ...btnStyle('#111', '#fff'), opacity: loading ? 0.7 : 1, minWidth: 100 }}
//                         >
//                             {loading ? 'Saving…' : mode === 'create' ? 'Create' : 'Update'}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// const labelStyle = {
//     display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6,
// };
// const errStyle = { fontSize: 12, color: '#dc2626', margin: '4px 0 0' };

// // ── Main Page ────────────────────────────────────────────────────
// export default function NewUpdatePage() {
//     const [updates, setUpdates] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [modal, setModal] = useState(null); // { mode: 'create' | 'edit', item?: {} }
//     const [deleteTarget, setDeleteTarget] = useState(null); // item to delete
//     const [toast, setToast] = useState(null); // { msg, type }

//     const showToast = (msg, type = 'success') => setToast({ msg, type });

//     // ── Fetch all ──
//     const fetchAll = async () => {
//         setLoading(true);
//         try {
//             const res = await fetch(`${API_BASE}/all`);
//             const data = await res.json();
//             if (data.success) setUpdates(data.data);
//         } catch {
//             showToast('Failed to load updates', 'error');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => { fetchAll(); }, []);

//     // ── On saved (create/edit) ──
//     const handleSaved = (item, mode) => {
//         if (mode === 'create') {
//             setUpdates((prev) => [item, ...prev]);
//             showToast('Update created successfully!');
//         } else {
//             setUpdates((prev) => prev.map((u) => (u._id === item._id ? item : u)));
//             showToast('Update saved successfully!');
//         }
//         setModal(null);
//     };

//     // ── Delete ──
//     const handleDelete = async () => {
//         if (!deleteTarget) return;
//         try {
//             const res = await fetch(`${API_BASE}/${deleteTarget._id}`, { method: 'DELETE' });
//             const data = await res.json();
//             if (!data.success) throw new Error(data.message);
//             setUpdates((prev) => prev.filter((u) => u._id !== deleteTarget._id));
//             showToast('Deleted successfully!');
//         } catch (err) {
//             showToast(err.message, 'error');
//         } finally {
//             setDeleteTarget(null);
//         }
//     };

//     return (
//         <AdminLayout>
//             <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: '100vh', background: '#f9fafb' }}>
//                 <style>{`
//         @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
//         .card-row:hover { background: #f9fafb !important; }
//         .action-btn:hover { opacity: 0.75; }
//       `}</style>

//                 {/* Header */}
//                 <div style={{
//                     background: '#fff', borderBottom: '1px solid #e5e7eb',
//                     padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//                 }}>
//                     <div>
//                         <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#111' }}>New Updates</h1>
//                         <p style={{ margin: '2px 0 0', fontSize: 13, color: '#6b7280' }}>
//                             {updates.length} update{updates.length !== 1 ? 's' : ''} total
//                         </p>
//                     </div>
//                     <button
//                         onClick={() => setModal({ mode: 'create' })}
//                         style={{
//                             background: '#111', color: '#fff', border: 'none', borderRadius: 8,
//                             padding: '10px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
//                             display: 'flex', alignItems: 'center', gap: 7,
//                         }}
//                     >
//                         <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Add Update
//                     </button>
//                 </div>

//                 {/* Content */}
//                 <div style={{ padding: '24px 28px' }}>
//                     {loading ? (
//                         <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af', fontSize: 15 }}>
//                             Loading…
//                         </div>
//                     ) : updates.length === 0 ? (
//                         <div style={{
//                             textAlign: 'center', padding: '80px 0',
//                             background: '#fff', borderRadius: 12, border: '1px dashed #d1d5db',
//                         }}>
//                             <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
//                             <p style={{ fontSize: 15, color: '#374151', fontWeight: 600, margin: '0 0 6px' }}>No updates yet</p>
//                             <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 20px' }}>Create your first update to get started</p>
//                             <button
//                                 onClick={() => setModal({ mode: 'create' })}
//                                 style={{ ...btnStyle('#111', '#fff'), padding: '10px 22px', fontSize: 13 }}
//                             >
//                                 + Add Update
//                             </button>
//                         </div>
//                     ) : (
//                         <div style={{
//                             background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden',
//                         }}>
//                             {/* Table Header */}
//                             <div style={{
//                                 display: 'grid',
//                                 gridTemplateColumns: '80px 1fr 2fr 120px 100px',
//                                 gap: 12, padding: '12px 20px',
//                                 background: '#f9fafb', borderBottom: '1px solid #e5e7eb',
//                                 fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em',
//                             }}>
//                                 <span>Image</span>
//                                 <span>Title</span>
//                                 <span>Description</span>
//                                 <span>Points</span>
//                                 <span style={{ textAlign: 'right' }}>Actions</span>
//                             </div>

//                             {/* Rows */}
//                             {updates.map((item, idx) => (
//                                 <div
//                                     key={item._id}
//                                     className="card-row"
//                                     style={{
//                                         display: 'grid',
//                                         gridTemplateColumns: '80px 1fr 2fr 120px 100px',
//                                         gap: 12, padding: '14px 20px', alignItems: 'center',
//                                         borderBottom: idx < updates.length - 1 ? '1px solid #f0f0f0' : 'none',
//                                         background: '#fff', transition: 'background 0.15s',
//                                     }}
//                                 >
//                                     {/* Image */}
//                                     <img
//                                         src={item.image}
//                                         alt={item.title}
//                                         style={{ width: 70, height: 50, objectFit: 'cover', borderRadius: 7, border: '1px solid #e5e7eb' }}
//                                     />

//                                     {/* Title */}
//                                     <div>
//                                         <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#111', lineHeight: 1.4 }}>{item.title}</p>
//                                         <p style={{ margin: '2px 0 0', fontSize: 11, color: '#9ca3af' }}>
//                                             {new Date(item.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
//                                         </p>
//                                     </div>

//                                     {/* Description */}
//                                     <p style={{
//                                         margin: 0, fontSize: 13, color: '#555', lineHeight: 1.5,
//                                         display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
//                                     }}>
//                                         {item.description}
//                                     </p>

//                                     {/* Points */}
//                                     <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//                                         {item.points?.slice(0, 3).map((pt, i) => (
//                                             <span key={i} style={{
//                                                 fontSize: 11, background: '#f0fdf4', color: '#16a34a',
//                                                 border: '1px solid #bbf7d0', borderRadius: 4, padding: '2px 7px',
//                                                 whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
//                                             }}>
//                                                 {pt}
//                                             </span>
//                                         ))}
//                                         {item.points?.length > 3 && (
//                                             <span style={{ fontSize: 11, color: '#9ca3af' }}>+{item.points.length - 3} more</span>
//                                         )}
//                                         {(!item.points || item.points.length === 0) && (
//                                             <span style={{ fontSize: 11, color: '#d1d5db' }}>—</span>
//                                         )}
//                                     </div>

//                                     {/* Actions */}
//                                     <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
//                                         <button
//                                             className="action-btn"
//                                             onClick={() => setModal({ mode: 'edit', item })}
//                                             title="Edit"
//                                             style={{
//                                                 background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe',
//                                                 borderRadius: 7, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
//                                             }}
//                                         >
//                                             Edit
//                                         </button>
//                                         <button
//                                             className="action-btn"
//                                             onClick={() => setDeleteTarget(item)}
//                                             title="Delete"
//                                             style={{
//                                                 background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca',
//                                                 borderRadius: 7, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
//                                             }}
//                                         >
//                                             Del
//                                         </button>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>

//                 {/* Modals */}
//                 {modal && (
//                     <UpdateModal
//                         mode={modal.mode}
//                         initial={modal.item}
//                         onClose={() => setModal(null)}
//                         onSaved={handleSaved}
//                     />
//                 )}

//                 {deleteTarget && (
//                     <ConfirmDialog
//                         msg={`Are you sure you want to delete "${deleteTarget.title}"? This cannot be undone.`}
//                         onConfirm={handleDelete}
//                         onCancel={() => setDeleteTarget(null)}
//                     />
//                 )}

//                 {toast && (
//                     <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />
//                 )}
//             </div>
//         </AdminLayout>
//     );
// }

import { useState, useRef, useEffect } from 'react';
import AdminLayout from '../../../components/feature/AdminLayout';
import Card from '../../../components/base/Card';
import Button from '../../../components/base/Button';
import {
    getData,
    postData,
    patchData,
    deleteData,
} from '../../../services/FetchNodeServices.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

// Routes used:
// POST   /api/newupdate/create   → createNewUpdate  (multipart: title, description, image, points JSON)
// GET    /api/newupdate/all      → getAllNewUpdates
// PUT    /api/newupdate/:id      → updateNewUpdate   (multipart: title?, description?, image?, points?)
// DELETE /api/newupdate/:id      → deleteNewUpdate

export default function NewUpdateManagement() {
    const [updates, setUpdates] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingUpdate, setEditingUpdate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        title: '',
        subTitle: '',
        description: '',
        pointsText: '',   // textarea — one point per line
        imageFile: null,
        imagePreview: '',
    });

    const [filters, setFilters] = useState({ search: '' });

    // ── FETCH ALL ──────────────────────────────────────────────────
    const fetchUpdates = async () => {
        setIsLoading(true);
        try {
            const res = await getData('newupdate/all');
            if (res?.success) {
                setUpdates(res.data || []);
            } else {
                toast.error(res?.message || 'Failed to fetch updates');
            }
        } catch {
            toast.error('Failed to fetch updates');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchUpdates(); }, []);

    // ── FORM RESET ─────────────────────────────────────────────────
    const resetForm = () => {
        setFormData({
            title: '',
            subTitle: '',
            description: '',
            pointsText: '',
            imageFile: null,
            imagePreview: '',
        });
        setEditingUpdate(null);
        setShowModal(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // ── OPEN ADD ───────────────────────────────────────────────────
    const handleAdd = () => {
        resetForm();
        setShowModal(true);
    };

    // ── OPEN EDIT ──────────────────────────────────────────────────
    const handleEdit = (item) => {
        setEditingUpdate(item);
        setFormData({
            title: item.title || '',
            subTitle: item.subTitle || '',
            description: item.description || '',
            pointsText: (item.points || []).join('\n'),
            imageFile: null,
            imagePreview: item.image || '',
        });
        setShowModal(true);
    };

    // ── IMAGE SELECT ───────────────────────────────────────────────
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file');
            return;
        }
        setFormData((prev) => ({
            ...prev,
            imageFile: file,
            imagePreview: URL.createObjectURL(file),
        }));
        e.target.value = '';
    };

    // ── BUILD FORM DATA ────────────────────────────────────────────
    const buildFD = () => {
        const fd = new FormData();
        fd.append('title', formData.title.trim());
        fd.append("subTitle",formData.subTitle.trim())
        fd.append('description', formData.description.trim());

        // Convert textarea lines → JSON array
        const pointsArr = formData.pointsText
            .split('\n')
            .map((p) => p.trim())
            .filter(Boolean);
        fd.append('points', JSON.stringify(pointsArr));

        if (formData.imageFile) fd.append('image', formData.imageFile);
        return fd;
    };

    // ── SUBMIT (CREATE / UPDATE) ───────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) { toast.error('Title is required'); return; }
        if (!formData.subTitle.trim()) { toast.error('Sub Title is required'); return; }
        if (!formData.description.trim()) { toast.error('Description is required'); return; }
        if (!editingUpdate && !formData.imageFile) { toast.error('Cover image is required'); return; }

        setIsLoading(true);
        try {
            const fd = buildFD();
            const res = editingUpdate
                ? await patchData(`newupdate/${editingUpdate._id}`, fd)
                : await postData('newupdate/create', fd);

            if (res?.success) {
                toast.success(`Update ${editingUpdate ? 'updated' : 'created'} successfully!`);
                fetchUpdates();
                resetForm();
            } else {
                toast.error(res?.message || 'Operation failed');
            }
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong!');
        } finally {
            setIsLoading(false);
        }
    };

    // ── DELETE ─────────────────────────────────────────────────────
    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: 'This update will be permanently deleted!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            confirmButtonColor: '#dc2626',
        });
        if (!confirm.isConfirmed) return;

        try {
            const res = await deleteData(`newupdate/${id}`);
            if (res?.success) {
                setUpdates((prev) => prev.filter((u) => u._id !== id));
                toast.success('Update deleted successfully!');
            } else {
                toast.error(res?.message || 'Failed to delete');
            }
        } catch {
            toast.error('Failed to delete update');
        }
    };

    // ── FILTERED LIST ──────────────────────────────────────────────
    const displayed = updates.filter(
        (u) =>
            !filters.search ||
            u.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
            u.subTitle?.toLowerCase().includes(filters.search.toLowerCase()) ||
            u.description?.toLowerCase().includes(filters.search.toLowerCase()),
    );

    const formatDate = (d) =>
        new Date(d).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });

    const pointCount = formData.pointsText
        .split('\n')
        .filter((p) => p.trim()).length;

    // ── JSX ────────────────────────────────────────────────────────
    return (
        <AdminLayout>
            <ToastContainer />
            <div className="p-6">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">New Updates Management</h1>
                        <p className="text-gray-600 mt-1">
                            Manage all updates — {updates.length} total
                        </p>
                    </div>
                    <Button
                        onClick={handleAdd}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
                    >
                        <i className="ri-add-line"></i>
                        <span>Add Update</span>
                    </Button>
                </div>

                {/* Search Filter */}
                <Card className="mb-6">
                    <div className="p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Search Updates
                        </label>
                        <input
                            type="text"
                            placeholder="Search by title or description..."
                            value={filters.search}
                            onChange={(e) => setFilters({ search: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>
                </Card>

                {/* Loading */}
                {isLoading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {/* Grid Cards */}
                {!isLoading && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {displayed.map((item) => (
                                <Card key={item._id} className="overflow-hidden group">
                                    {/* Cover Image */}
                                    <div
                                        className="relative cursor-pointer"
                                        onClick={() => setPreviewImage(item.image)}
                                    >
                                        <img
                                            src={item.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                                            alt={item.title}
                                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                            <i className="ri-zoom-in-line text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                                            {item.title || '—'}
                                        </h3>
                                        <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                                            {item.subTitle || 'No subTitle'}
                                        </p>
                                        <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                                            {item.description || 'No description'}
                                        </p>
                                        
                                    
                                        {/* Points Preview */}
                                        {item.points?.length > 0 && (
                                            <ul className="mb-3 space-y-1">
                                                {item.points.slice(0, 3).map((pt, i) => (
                                                    <li key={i} className="flex items-center gap-1 text-xs text-gray-600">
                                                        <i className="ri-check-line text-green-500 text-xs flex-shrink-0"></i>
                                                        <span className="truncate">{pt}</span>
                                                    </li>
                                                ))}
                                                {item.points.length > 3 && (
                                                    <li className="text-xs text-gray-400 pl-4">
                                                        +{item.points.length - 3} more
                                                    </li>
                                                )}
                                            </ul>
                                        )}

                                        <p className="text-xs text-gray-400 mb-3">
                                            Added: {formatDate(item.createdAt)}
                                        </p>

                                        {/* Actions */}
                                        <div className="flex gap-2 mt-2">
                                            <Button
                                                onClick={() => handleEdit(item)}
                                                className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm"
                                            >
                                                <i className="ri-edit-line mr-1"></i> Edit
                                            </Button>
                                            <Button
                                                onClick={() => handleDelete(item._id)}
                                                className="bg-red-50 text-red-600 hover:bg-red-100 px-3"
                                            >
                                                <i className="ri-delete-bin-line"></i>
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Empty State */}
                        {displayed.length === 0 && (
                            <div className="text-center py-16">
                                <i className="ri-newspaper-line text-5xl text-gray-300 mb-4 block"></i>
                                <p className="text-gray-500 text-lg font-medium">No updates found</p>
                                <p className="text-gray-400 text-sm mt-1">
                                    {filters.search ? 'Try a different search term' : 'Add your first update'}
                                </p>
                            </div>
                        )}

                        {/* Table Overview */}
                        {displayed.length > 0 && (
                            <Card className="mt-8">
                                <div className="p-6">
                                    <h2 className="text-lg font-semibold mb-4">All Updates Overview</h2>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    {['#', 'Cover', 'Title','Sub Title', 'Description', 'Points', 'Added On', 'Actions'].map((h) => (
                                                        <th
                                                            key={h}
                                                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        >
                                                            {h}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {displayed.map((item, idx) => (
                                                    <tr key={item._id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-sm text-gray-500">{idx + 1}</td>
                                                        <td className="px-4 py-3">
                                                            <img
                                                                src={item.image || 'https://via.placeholder.com/60x40'}
                                                                alt={item.title}
                                                                className="h-10 w-16 object-cover rounded cursor-pointer border border-gray-200"
                                                                onClick={() => setPreviewImage(item.image)}
                                                            />
                                                        </td>
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                            {item.title || '—'}
                                                        </td>
                                                         <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                                                            {item.subTitle || '—'}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                                                            {item.description || '—'}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-500">
                                                            {item.points?.length > 0 ? (
                                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                                                    {item.points.length} point{item.points.length !== 1 ? 's' : ''}
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-400">—</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-500">
                                                            {formatDate(item.createdAt)}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex gap-3">
                                                                <button
                                                                    onClick={() => handleEdit(item)}
                                                                    className="text-blue-600 hover:text-blue-900 text-sm"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(item._id)}
                                                                    className="text-red-600 hover:text-red-900 text-sm"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </>
                )}

                {/* ── ADD / EDIT MODAL ── */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6">

                                {/* Modal Header */}
                                <div className="flex justify-between items-center mb-5">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {editingUpdate ? 'Edit Update' : 'Add New Update'}
                                    </h2>
                                    <button
                                        onClick={resetForm}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <i className="ri-close-line text-xl"></i>
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">

                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Title *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                                            placeholder="e.g. Advanced Dental Chair Technology"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Sub Title *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.subTitle}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, subTitle: e.target.value }))}
                                            placeholder="e.g. Advanced Dental Chair Technology"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            required
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Description *
                                        </label>
                                        <textarea
                                            rows="3"
                                            value={formData.description}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                                            placeholder="Describe this update..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                                            required
                                        />
                                    </div>

                                    {/* Bullet Points */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Bullet Points
                                            <span className="text-gray-400 font-normal ml-1">(one per line, optional)</span>
                                        </label>
                                        <textarea
                                            rows="4"
                                            value={formData.pointsText}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, pointsText: e.target.value }))}
                                            placeholder={`Premium patient comfort\nModern ergonomic design\nLED operating light\nAdvanced control panel`}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none font-mono text-sm"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">
                                            {pointCount} point{pointCount !== 1 ? 's' : ''} added
                                        </p>
                                    </div>

                                    {/* Cover Image Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Cover Image {!editingUpdate && '*'}
                                            {editingUpdate && (
                                                <span className="text-gray-400 font-normal ml-1">
                                                    (leave empty to keep existing)
                                                </span>
                                            )}
                                        </label>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
                                        >
                                            <i className="ri-image-add-line text-2xl text-gray-400 mb-1 block"></i>
                                            <p className="text-sm text-gray-500">Click to upload cover image</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                PNG, JPG, WEBP supported (recommended: 16:9 ratio)
                                            </p>
                                        </button>

                                        {/* Image Preview */}
                                        {formData.imagePreview && (
                                            <div className="mt-3 relative inline-block">
                                                <img
                                                    src={formData.imagePreview}
                                                    alt="Preview"
                                                    className="h-32 w-auto rounded-lg border border-gray-200 object-cover"
                                                />
                                                {formData.imageFile && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                imageFile: null,
                                                                imagePreview: editingUpdate?.image || '',
                                                            }))
                                                        }
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                                    >
                                                        <i className="ri-close-line"></i>
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex gap-3 pt-2">
                                        <Button
                                            type="button"
                                            onClick={resetForm}
                                            className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex-1 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            {isLoading
                                                ? 'Processing...'
                                                : editingUpdate
                                                    ? 'Update'
                                                    : 'Create Update'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── IMAGE LIGHTBOX ── */}
                {previewImage && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
                        onClick={() => setPreviewImage(null)}
                    >
                        <div
                            className="relative max-w-4xl w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setPreviewImage(null)}
                                className="absolute -top-10 right-0 text-white hover:text-gray-300 text-3xl"
                            >
                                <i className="ri-close-line"></i>
                            </button>
                            <img
                                src={previewImage}
                                alt="Update Preview"
                                className="w-full max-h-[80vh] object-contain rounded-lg"
                            />
                        </div>
                    </div>
                )}

            </div>
        </AdminLayout>
    );
}