import { useEffect, useState } from 'react';
import AdminLayout from '../../../../components/feature/AdminLayout';
import Card from '../../../../components/base/Card';
import Button from '../../../../components/base/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

import {
  postData,
  getData,
  patchData,
  deleteData,
  getToken,
} from '../../../../services/FetchNodeServices';

const ITEMS_PER_PAGE = 12;

export default function BannersManagement() {
  const [banners, setBanners] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(banners.length / ITEMS_PER_PAGE);
  const paginatedBanners = banners.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const emptyForm = { title: '', subtitle: '', buttonText: '', image: null };
  const [formData, setFormData] = useState(emptyForm);

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingBanner(null);
  };

  const fetchBanners = async () => {
    try {
      setIsLoading(true);
      const response = await getData('banner/all');
      if (response?.success) {
        setBanners(response.banners || []);
        setCurrentPage(1);
      }
    } catch (error) {
      toast.error('Failed to load banners');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('subtitle', formData.subtitle);
      data.append('buttonText', formData.buttonText);
      if (formData.image instanceof File) data.append('image', formData.image);

      let response;
      if (editingBanner) {
        response = await patchData(`banner/update/${editingBanner._id}`, data);
      } else {
        response = await postData('banner/create', data);
      }

      if (response?.success) {
        toast.success(
          editingBanner
            ? 'Banner Updated Successfully'
            : 'Banner Created Successfully',
        );
        resetForm();
        setShowAddModal(false);
        fetchBanners();
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      buttonText: banner.buttonText || '',
      image: banner.image || '',
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Banner?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
    });
    if (!result.isConfirmed) return;
    try {
      const response = await deleteData(`banner/delete/${id}`);
      if (response?.success) {
        toast.success('Banner Deleted');
        fetchBanners();
      }
    } catch (error) {
      toast.error('Delete Failed');
    }
  };

  // Pagination helper — shows max 5 page buttons with ellipsis
  const getPageNumbers = () => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages];
    if (currentPage >= totalPages - 2)
      return [
        1,
        '...',
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages,
    ];
  };

  return (
    <AdminLayout>
      <ToastContainer />
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Banner Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage promotional banners and advertisements
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
          >
            <i className="ri-add-line"></i>
            <span>Add Banner</span>
          </Button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-500">Loading banners...</p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && banners.length === 0 && (
          <p className="text-gray-500">No banners found.</p>
        )}

        {/* Banner Grid */}
        {!isLoading && banners.length > 0 && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedBanners.map((banner) => (
                <Card key={banner._id} className="overflow-hidden">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-52 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{banner.title}</h3>
                    <p className="text-gray-600 mt-2">{banner.subtitle}</p>
                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={() => handleEdit(banner)}
                        className="flex-1 bg-blue-600 text-white"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(banner._id)}
                        className="flex-1 bg-red-600 text-white"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col items-center gap-3">
                {/* Page info */}
                <p className="text-sm text-gray-500">
                  Showing{' '}
                  <span className="font-medium text-gray-700">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                    {Math.min(currentPage * ITEMS_PER_PAGE, banners.length)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium text-gray-700">
                    {banners.length}
                  </span>{' '}
                  banners
                </p>

                {/* Buttons */}
                <div className="flex items-center gap-1">
                  {/* Prev */}
                  <button
                    onClick={() => setCurrentPage((p) => p - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg border text-sm font-medium hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Prev
                  </button>

                  {/* Page numbers */}
                  {getPageNumbers().map((page, idx) =>
                    page === '...' ? (
                      <span
                        key={`ellipsis-${idx}`}
                        className="px-2 py-1.5 text-gray-400 text-sm"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}

                  {/* Next */}
                  <button
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg border text-sm font-medium hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {editingBanner ? 'Edit Banner' : 'Add New Banner'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600 w-6 h-6 flex items-center justify-center"
                  >
                    <i className="ri-close-line"></i>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label>Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full border rounded-lg p-2"
                      required
                    />
                  </div>

                  <div>
                    <label>Subtitle</label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) =>
                        setFormData({ ...formData, subtitle: e.target.value })
                      }
                      className="w-full border rounded-lg p-2"
                    />
                  </div>

                  <div>
                    <label>Button Text</label>
                    <input
                      type="text"
                      value={formData.buttonText}
                      onChange={(e) =>
                        setFormData({ ...formData, buttonText: e.target.value })
                      }
                      className="w-full border rounded-lg p-2"
                    />
                  </div>

                  <div>
                    <label>Banner Image</label>
                    {formData.image && typeof formData.image === 'string' && (
                      <img
                        src={formData.image}
                        alt=""
                        className="h-32 w-full object-cover rounded mb-2"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          image: e.target.files?.[0] || null,
                        })
                      }
                      className="w-full border rounded-lg p-2"
                      required={!editingBanner}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        resetForm();
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white"
                    >
                      {editingBanner ? 'Update Banner' : 'Create Banner'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
