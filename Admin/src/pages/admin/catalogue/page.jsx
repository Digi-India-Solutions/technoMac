import { useState, useRef, useEffect } from 'react';
import AdminLayout from '../../../components/feature/AdminLayout';
import Card from '../../../components/base/Card';
import Button from '../../../components/base/Button';
import {
  getData,
  postData,
  patchData,
  deleteData,
} from '../../../services/FetchNodeServices';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

// Routes used:
// POST   /api/catalogue/create     → createCatalogue (multipart: title, description, image, pdfFile optional)
// GET    /api/catalogue/all        → getAllCatalogues
// PUT    /api/catalogue/:id        → updateCatalogue (multipart: title?, description?, image?, pdfFile?)
// DELETE /api/catalogue/:id        → deleteCatalogue

export default function CatalogueManagement() {
  const [catalogues, setCatalogues] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCatalogue, setEditingCatalogue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewPdf, setPreviewPdf] = useState(null);
  const fileInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageFile: null,
    imagePreview: '',
    pdfFile: null,
    pdfPreview: '',
  });

  const [filters, setFilters] = useState({
    search: '',
  });

  // ── FETCH ALL ──────────────────────────────────────────────────
  const fetchCatalogues = async () => {
    setIsLoading(true);
    try {
      const res = await getData('catalogue/all');
      if (res?.success) {
        setCatalogues(res.data || []);
      } else {
        toast.error(res?.message || 'Failed to fetch catalogues');
      }
    } catch {
      toast.error('Failed to fetch catalogues');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogues();
  }, []);

  // ── FORM RESET ─────────────────────────────────────────────────
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageFile: null,
      imagePreview: '',
      pdfFile: null,
      pdfPreview: '',
    });
    setEditingCatalogue(null);
    setShowModal(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (pdfInputRef.current) pdfInputRef.current.value = '';
  };

  // ── OPEN ADD ───────────────────────────────────────────────────
  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  // ── OPEN EDIT ──────────────────────────────────────────────────
  const handleEdit = (cat) => {
    setEditingCatalogue(cat);
    setFormData({
      title: cat.title || '',
      description: cat.description || '',
      imageFile: null,
      imagePreview: cat.image || '',
      pdfFile: null,
      pdfPreview: cat.pdfFile || '',
    });
    setShowModal(true);
  };

  // ── IMAGE FILE SELECT ──────────────────────────────────────────
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

  // ── PDF FILE SELECT ────────────────────────────────────────────
  const handlePdfChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Please select a valid PDF file');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      pdfFile: file,
      pdfPreview: URL.createObjectURL(file),
    }));
    e.target.value = '';
  };

  // ── BUILD FORM DATA ────────────────────────────────────────────
  const buildFD = () => {
    const fd = new FormData();
    fd.append('title', formData.title);
    fd.append('description', formData.description);
    if (formData.imageFile) fd.append('image', formData.imageFile);
    if (formData.pdfFile) fd.append('pdfFile', formData.pdfFile);
    return fd;
  };

  // ── SUBMIT (CREATE / UPDATE) ───────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }
    if (!editingCatalogue && !formData.imageFile) {
      toast.error('Cover image is required');
      return;
    }

    setIsLoading(true);
    try {
      const fd = buildFD();
      const res = editingCatalogue
        ? await patchData(`catalogue/${editingCatalogue._id}`, fd)
        : await postData('catalogue/create', fd);

      if (res?.success) {
        toast.success(
          `Catalogue ${editingCatalogue ? 'updated' : 'created'} successfully!`,
        );
        fetchCatalogues();
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
      text: 'This catalogue will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#dc2626',
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await deleteData(`catalogue/${id}`);
      if (res?.success) {
        setCatalogues((prev) => prev.filter((c) => c._id !== id));
        toast.success('Catalogue deleted successfully!');
      } else {
        toast.error(res?.message || 'Failed to delete');
      }
    } catch {
      toast.error('Failed to delete catalogue');
    }
  };

  // ── FILTERED LIST ──────────────────────────────────────────────
  const displayed = catalogues.filter(
    (c) =>
      !filters.search ||
      c.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
      c.description?.toLowerCase().includes(filters.search.toLowerCase()),
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
              Catalogue Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage all catalogues — {catalogues.length} total
            </p>
          </div>
          <Button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
          >
            <i className="ri-add-line"></i>
            <span>Add Catalogue</span>
          </Button>
        </div>

        {/* Search Filter */}
        <Card className="mb-6">
          <div className="p-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Catalogues
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

        {/* Grid */}
        {!isLoading && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayed.map((cat) => (
                <Card key={cat._id} className="overflow-hidden group">
                  {/* Cover Image */}
                  <div
                    className="relative cursor-pointer"
                    onClick={() => setPreviewImage(cat.image)}
                  >
                    <img
                      src={
                        cat.image ||
                        'https://via.placeholder.com/300x200?text=No+Image'
                      }
                      alt={cat.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <i className="ri-zoom-in-line text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                      {cat.title || '—'}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                      {cat.description || 'No description'}
                    </p>
                    <p className="text-xs text-gray-400 mb-3">
                      Added: {formatDate(cat.createdAt)}
                    </p>

                    {/* PDF Button */}
                    {cat.pdfFile && (
                      <a
                        href={cat.pdfFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 mb-3"
                      >
                        <i className="ri-file-pdf-line mr-1"></i> View PDF
                      </a>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 mt-2">
                      <Button
                        onClick={() => handleEdit(cat)}
                        className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm"
                      >
                        <i className="ri-edit-line mr-1"></i> Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(cat._id)}
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
                <i className="ri-book-open-line text-5xl text-gray-300 mb-4 block"></i>
                <p className="text-gray-500 text-lg font-medium">
                  No catalogues found
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {filters.search
                    ? 'Try a different search term'
                    : 'Add your first catalogue'}
                </p>
              </div>
            )}

            {/* Table Overview */}
            {displayed.length > 0 && (
              <Card className="mt-8">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">
                    All Catalogues Overview
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {[
                            '#',
                            'Cover',
                            'Title',
                            'Description',
                            'PDF',
                            'Added On',
                            'Actions',
                          ].map((h) => (
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
                        {displayed.map((cat, idx) => (
                          <tr key={cat._id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {idx + 1}
                            </td>
                            <td className="px-4 py-3">
                              <img
                                src={
                                  cat.image ||
                                  'https://via.placeholder.com/60x40'
                                }
                                alt={cat.title}
                                className="h-10 w-16 object-cover rounded cursor-pointer border border-gray-200"
                                onClick={() => setPreviewImage(cat.image)}
                              />
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {cat.title || '—'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                              {cat.description || '—'}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {cat.pdfFile ? (
                                <a
                                  href={cat.pdfFile}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                >
                                  <i className="ri-file-pdf-line"></i> View
                                </a>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {formatDate(cat.createdAt)}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-3">
                                <button
                                  onClick={() => handleEdit(cat)}
                                  className="text-blue-600 hover:text-blue-900 text-sm"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(cat._id)}
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
                    {editingCatalogue ? 'Edit Catalogue' : 'Add New Catalogue'}
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
                      Catalogue Title *
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
                      placeholder="e.g. Summer Collection 2025"
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
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Describe this catalogue..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                      required
                    />
                  </div>

                  {/* Cover Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cover Image {!editingCatalogue && '*'}
                      {editingCatalogue && (
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
                      <p className="text-sm text-gray-500">
                        Click to upload cover image
                      </p>
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
                                imagePreview: editingCatalogue?.image || '',
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

                  {/* PDF Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PDF Catalogue File{' '}
                      <span className="text-gray-400 font-normal">
                        (optional)
                      </span>
                    </label>
                    <input
                      type="file"
                      ref={pdfInputRef}
                      onChange={handlePdfChange}
                      accept="application/pdf"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => pdfInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <i className="ri-file-pdf-line text-2xl text-gray-400 mb-1 block"></i>
                      <p className="text-sm text-gray-500">
                        Click to upload PDF file
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Only PDF files allowed (max size recommended: 10MB)
                      </p>
                    </button>

                    {/* PDF Preview */}
                    {formData.pdfPreview && (
                      <div className="mt-3 flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <i className="ri-file-pdf-line text-red-500 text-xl"></i>
                        <span className="text-sm text-gray-600 flex-1 truncate">
                          {formData.pdfFile?.name ||
                            (formData.pdfPreview &&
                              'Current PDF file attached')}
                        </span>
                        {formData.pdfFile && (
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                pdfFile: null,
                                pdfPreview: editingCatalogue?.pdfFile || '',
                              }))
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            <i className="ri-close-line"></i>
                          </button>
                        )}
                        {!formData.pdfFile && formData.pdfPreview && (
                          <a
                            href={formData.pdfPreview}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 text-sm"
                          >
                            View Current
                          </a>
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
                        : editingCatalogue
                          ? 'Update Catalogue'
                          : 'Create Catalogue'}
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
                alt="Catalogue Preview"
                className="w-full max-h-[80vh] object-contain rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
