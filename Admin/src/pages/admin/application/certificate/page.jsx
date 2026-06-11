import { useState, useRef, useEffect } from 'react';
import AdminLayout from '../../../../components/feature/AdminLayout';
import Card from '../../../../components/base/Card';
import Button from '../../../../components/base/Button';
import {
  getData,
  postData,
  patchData,
  deleteData,
} from '../../../../services/FetchNodeServices';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

// Routes used:
// POST   /certificate/create     → createCertificate  (multipart: title, image)
// GET    /certificate/all        → getAllCertificates
// PUT    /certificate/:id        → updateCertificate  (multipart: title, image?)
// DELETE /certificate/:id        → deleteCertificate

export default function CertificateManagement() {
  const [certificates, setCertificates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null); // lightbox
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    imageFile: null,
    imagePreview: '',
  });

  const [filters, setFilters] = useState({
    search: '',
  });

  // ── FETCH ALL ──────────────────────────────────────────────────
  const fetchCertificates = async () => {
    setIsLoading(true);
    try {
      const res = await getData('certificate/all');
      if (res?.success) {
        setCertificates(res.data || []);
      } else {
        toast.error(res?.message || 'Failed to fetch certificates');
      }
    } catch {
      toast.error('Failed to fetch certificates');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  // ── FORM RESET ─────────────────────────────────────────────────
  const resetForm = () => {
    setFormData({ title: '', imageFile: null, imagePreview: '' });
    setEditingCertificate(null);
    setShowModal(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── OPEN ADD ───────────────────────────────────────────────────
  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  // ── OPEN EDIT ──────────────────────────────────────────────────
  const handleEdit = (cert) => {
    setEditingCertificate(cert);
    setFormData({
      title: cert.title || '',
      imageFile: null,
      imagePreview: cert.image || '',
    });
    setShowModal(true);
  };

  // ── FILE SELECT ────────────────────────────────────────────────
  const handleFileChange = (e) => {
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
    fd.append('title', formData.title);
    if (formData.imageFile) fd.append('image', formData.imageFile);
    return fd;
  };

  // ── SUBMIT (CREATE / UPDATE) ───────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingCertificate && !formData.imageFile) {
      toast.error('Image is required');
      return;
    }

    setIsLoading(true);
    try {
      const fd = buildFD();
      const res = editingCertificate
        ? await patchData(`certificate/${editingCertificate._id}`, fd)
        : await postData('certificate/create', fd);

      if (res?.success) {
        toast.success(
          `Certificate ${editingCertificate ? 'updated' : 'created'} successfully!`,
        );
        fetchCertificates();
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
      text: 'This certificate will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#dc2626',
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await deleteData(`certificate/${id}`);
      if (res?.success) {
        setCertificates((prev) => prev.filter((c) => c._id !== id));
        toast.success('Certificate deleted successfully!');
      } else {
        toast.error(res?.message || 'Failed to delete');
      }
    } catch {
      toast.error('Failed to delete certificate');
    }
  };

  // ── FILTERED LIST ──────────────────────────────────────────────
  const displayed = certificates.filter(
    (c) =>
      !filters.search ||
      c.title?.toLowerCase().includes(filters.search.toLowerCase()),
  );

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  // ── JSX ────────────────────────────────────────────────────────
  return (
    <AdminLayout>
      <ToastContainer />
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Certificate Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage all certificates — {certificates.length} total
            </p>
          </div>
          <Button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
          >
            <i className="ri-add-line"></i>
            <span>Add Certificate</span>
          </Button>
        </div>

        {/* Search Filter */}
        <Card className="mb-6">
          <div className="p-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by certificate title..."
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

        {/* Grid */}
        {!isLoading && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayed.map((cert) => (
                <Card key={cert._id} className="overflow-hidden group">
                  {/* Image */}
                  <div
                    className="relative cursor-pointer"
                    onClick={() => setPreviewImage(cert.image)}
                  >
                    <img
                      src={
                        cert.image ||
                        'https://via.placeholder.com/300x200?text=No+Image'
                      }
                      alt={cert.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <i className="ri-zoom-in-line text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                      {cert.title || '—'}
                    </h3>
                    <p className="text-xs text-gray-400 mb-4">
                      Added: {formatDate(cert.createdAt)}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(cert)}
                        className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm"
                      >
                        <i className="ri-edit-line mr-1"></i> Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(cert._id)}
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
                <i className="ri-award-line text-5xl text-gray-300 mb-4 block"></i>
                <p className="text-gray-500 text-lg font-medium">
                  No certificates found
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {filters.search
                    ? 'Try a different search term'
                    : 'Add your first certificate'}
                </p>
              </div>
            )}

            {/* Table Overview */}
            {/* {displayed.length > 0 && (
              <Card className="mt-8">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">
                    All Certificates Overview
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {['#', 'Image', 'Title', 'Added On', 'Actions'].map(
                            (h) => (
                              <th
                                key={h}
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {h}
                              </th>
                            ),
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {displayed.map((cert, idx) => (
                          <tr key={cert._id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {idx + 1}
                            </td>
                            <td className="px-4 py-3">
                              <img
                                src={
                                  cert.image ||
                                  'https://via.placeholder.com/60x40'
                                }
                                alt={cert.title}
                                className="h-10 w-16 object-cover rounded cursor-pointer border border-gray-200"
                                onClick={() => setPreviewImage(cert.image)}
                              />
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {cert.title || '—'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {formatDate(cert.createdAt)}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-3">
                                <button
                                  onClick={() => handleEdit(cert)}
                                  className="text-blue-600 hover:text-blue-900 text-sm"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(cert._id)}
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
            )} */}
          </>
        )}

        {/* ── ADD / EDIT MODAL ── */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md">
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingCertificate
                      ? 'Edit Certificate'
                      : 'Add Certificate'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Certificate Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="e.g. ISO 9001:2015 Certified"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Certificate Image {!editingCertificate && '*'}
                      {editingCertificate && (
                        <span className="text-gray-400 font-normal ml-1">
                          (leave empty to keep existing)
                        </span>
                      )}
                    </label>

                    {/* Upload Button */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <i className="ri-upload-cloud-2-line text-3xl text-gray-400 mb-2 block"></i>
                      <p className="text-sm text-gray-500">
                        Click to upload image
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG, WEBP supported
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
                                imagePreview: editingCertificate?.image || '',
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
                        : editingCertificate
                          ? 'Update Certificate'
                          : 'Add Certificate'}
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
              className="relative max-w-3xl w-full"
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
                alt="Certificate Preview"
                className="w-full max-h-[80vh] object-contain rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
