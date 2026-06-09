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
  deleteData,
} from '../../../../services/FetchNodeServices';
import axios from 'axios';

const ITEMS_PER_PAGE = 12;

const serverURL = 'http://localhost:8000/api';

const getToken = () => {
  const admin = JSON.parse(sessionStorage.getItem('Admin'));
  return admin?.token;
};

const putFormData = async (url, body) => {
  try {
    const response = await axios.put(`${serverURL}/${url}`, body, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

const emptyForm = {
  name: '',
  description: '',
  designation: '',
  review: '',
  rating: 5,
  order: 0,
  isActive: true,
  image: null,
};

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filterActive, setFilterActive] = useState('all');

  // ─── Filtered list ────────────────────────────────────────────────────────
  const filtered = reviews.filter((r) => {
    const matchSearch =
      !search ||
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.designation?.toLowerCase().includes(search.toLowerCase()) ||
      r.review?.toLowerCase().includes(search.toLowerCase());

    const matchActive =
      filterActive === 'all' ||
      (filterActive === 'active' && r.isActive) ||
      (filterActive === 'inactive' && !r.isActive);

    return matchSearch && matchActive;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingReview(null);
  };

  // ─── Fetch reviews (admin — all) ──────────────────────────────────────────
  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const response = await getData('testimonial/admin/all');
      if (response?.success) {
        setReviews(response.data || []);
        setCurrentPage(1);
      } else {
        toast.error(response?.message || 'Failed to load reviews');
      }
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // ─── Create / Update ──────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      toast.error('Please enter customer name');
      return;
    }
    if (!formData.review?.trim()) {
      toast.error('Please enter review text');
      return;
    }
    if (!editingReview && !formData.image) {
      toast.error('Please select a profile image');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('designation', formData.designation || '');
      data.append('review', formData.review);
      data.append('rating', formData.rating);
      data.append('order', formData.order);
      data.append('isActive', formData.isActive);
      if (formData.image instanceof File) {
        data.append('image', formData.image);
      }

      let response;
      if (editingReview) {
        response = await putFormData(`testimonial/${editingReview._id}`, data);
      } else {
        response = await postData('testimonial', data);
      }

      if (response?.success) {
        toast.success(
          editingReview
            ? 'Review updated successfully!'
            : 'Review created successfully!',
        );
        resetForm();
        setShowModal(false);
        fetchReviews();
      } else {
        toast.error(response?.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('handleSubmit error:', error);
      toast.error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Edit ─────────────────────────────────────────────────────────────────
  const handleEdit = (review) => {
    setEditingReview(review);
    setFormData({
      name: review.name || '',
      description: review.description || '',
      designation: review.designation || '',
      review: review.review || '',
      rating: review.rating || 5,
      order: review.order || 0,
      isActive: review.isActive ?? true,
      image: review.image || null,
    });
    setShowModal(true);
  };

  // ─── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Delete Review?',
      text: `Review by "${name}" will be permanently deleted.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it',
    });
    if (!result.isConfirmed) return;

    try {
      const response = await deleteData(`testimonial/${id}`);
      if (response?.success) {
        toast.success('Review deleted');
        fetchReviews();
      } else {
        toast.error(response?.message || 'Delete failed');
      }
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  // ─── Pagination helper ────────────────────────────────────────────────────
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

  // ─── Stats ────────────────────────────────────────────────────────────────
  const stats = {
    total: reviews.length,
    active: reviews.filter((r) => r.isActive).length,
    avgRating:
      reviews.length > 0
        ? (
            reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
            reviews.length
          ).toFixed(1)
        : '0.0',
  };

  // ─── Star renderer ────────────────────────────────────────────────────────
  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={`${i < rating ? 'ri-star-fill text-yellow-400' : 'ri-star-line text-gray-300'} text-sm`}
      ></i>
    ));

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="p-6">
        {/* ── Header ── */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Reviews Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage customer testimonials and reviews
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
          >
            <i className="ri-add-line mr-1"></i>
            Add Review
          </Button>
        </div>

        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            {
              label: 'Total Reviews',
              value: stats.total,
              color: 'text-blue-600',
              bg: 'bg-blue-50',
              icon: 'ri-chat-quote-line',
            },
            {
              label: 'Active Reviews',
              value: stats.active,
              color: 'text-green-600',
              bg: 'bg-green-50',
              icon: 'ri-checkbox-circle-line',
            },
            {
              label: 'Average Rating',
              value: stats.avgRating,
              color: 'text-yellow-600',
              bg: 'bg-yellow-50',
              icon: 'ri-star-fill',
            },
          ].map((stat) => (
            <Card key={stat.label} className={`p-4 ${stat.bg}`}>
              <div className="flex items-center space-x-3">
                <i className={`${stat.icon} text-2xl ${stat.color}`}></i>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* ── Filters ── */}
        <Card className="mb-6">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Name, designation, review..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <div className="relative">
                  <select
                    value={filterActive}
                    onChange={(e) => {
                      setFilterActive(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none"
                  >
                    <option value="all">All Reviews</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </select>
                  <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quick Actions
                </label>
                <Button
                  onClick={() => {
                    setSearch('');
                    setFilterActive('all');
                    setCurrentPage(1);
                  }}
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 w-full"
                >
                  <i className="ri-refresh-line mr-2"></i>
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* ── Loading ── */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <i className="ri-loader-4-line animate-spin text-3xl text-blue-600"></i>
            <p className="text-gray-500 ml-3">Loading reviews...</p>
          </div>
        )}

        {/* ── Empty state ── */}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <i className="ri-chat-quote-line text-5xl mb-3 block"></i>
            <p className="text-lg">
              {search || filterActive !== 'all'
                ? 'No reviews match your filters'
                : 'No reviews yet'}
            </p>
            {!search && filterActive === 'all' && (
              <p className="text-sm mt-1">
                Click "Add Review" to create your first review
              </p>
            )}
          </div>
        )}

        {/* ── Reviews Grid ── */}
        {!isLoading && filtered.length > 0 && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginated.map((review) => (
                <Card
                  key={review._id}
                  className="overflow-hidden flex flex-col"
                >
                  {/* Card Top */}
                  <div className="p-5 flex-1">
                    {/* Avatar + Name */}
                    <div className="flex items-center space-x-3 mb-4">
                      {review.image ? (
                        <img
                          src={review.image}
                          alt={review.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <i className="ri-user-line text-blue-600 text-xl"></i>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {review.name}
                          </h3>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                              review.isActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-600'
                            }`}
                          >
                            {review.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        {review.designation && (
                          <p className="text-xs text-gray-500 truncate">
                            {review.designation}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-0.5 mb-3">
                      {renderStars(review.rating)}
                      <span className="text-xs text-gray-500 ml-1">
                        ({review.rating}/5)
                      </span>
                    </div>

                    {/* Review text */}
                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                      "{review.review}"
                    </p>

                    {/* Order badge */}
                    {review.order > 0 && (
                      <div className="mt-3">
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                          Order: {review.order}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="px-5 pb-5 flex gap-2 border-t border-gray-100 pt-4">
                    <Button
                      onClick={() => handleEdit(review)}
                      className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <i className="ri-edit-line mr-1"></i> Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(review._id, review.name)}
                      className="flex-1 bg-red-600 text-white hover:bg-red-700"
                    >
                      <i className="ri-delete-bin-line mr-1"></i> Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col items-center gap-3">
                <p className="text-sm text-gray-500">
                  Showing{' '}
                  <span className="font-medium text-gray-700">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                    {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium text-gray-700">
                    {filtered.length}
                  </span>{' '}
                  reviews
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => p - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg border text-sm font-medium hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Prev
                  </button>
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

        {/* ════════════════════════════════════════════════════
            ADD / EDIT MODAL
        ════════════════════════════════════════════════════ */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {editingReview ? 'Edit Review' : 'Add New Review'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter customer full name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      required
                    />
                  </div>

                  {/* Designation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Designation
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dental Surgeon, Clinic Owner"
                      value={formData.designation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          designation: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      placeholder="Enter short description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      required
                    />
                  </div>

                  {/* Review */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Review <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      placeholder="Enter customer review..."
                      value={formData.review}
                      onChange={(e) =>
                        setFormData({ ...formData, review: e.target.value })
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                      required
                    />
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rating
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, rating: star })
                          }
                          className="focus:outline-none"
                        >
                          <i
                            className={`text-2xl transition-colors ${
                              star <= formData.rating
                                ? 'ri-star-fill text-yellow-400'
                                : 'ri-star-line text-gray-300 hover:text-yellow-300'
                            }`}
                          ></i>
                        </button>
                      ))}
                      <span className="text-sm text-gray-500 ml-1">
                        {formData.rating}/5
                      </span>
                    </div>
                  </div>

                  {/* Order */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Display Order
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      min={0}
                      value={formData.order}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          order: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Lower number = shown first
                    </p>
                  </div>

                  {/* isActive toggle */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Active Status
                      </p>
                      <p className="text-xs text-gray-500">
                        Show this review on website
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          isActive: !formData.isActive,
                        })
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        formData.isActive ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                          formData.isActive ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profile Image{' '}
                      {!editingReview && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    {/* Existing image */}
                    {formData.image && typeof formData.image === 'string' && (
                      <img
                        src={formData.image}
                        alt="Current"
                        className="w-16 h-16 rounded-full object-cover mb-2 border-2 border-gray-200"
                      />
                    )}
                    {/* New file preview */}
                    {formData.image instanceof File && (
                      <img
                        src={URL.createObjectURL(formData.image)}
                        alt="Preview"
                        className="w-16 h-16 rounded-full object-cover mb-2 border-2 border-blue-200"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      required={!editingReview}
                    />
                    {editingReview && (
                      <p className="text-xs text-gray-500 mt-1">
                        Leave empty to keep the current image
                      </p>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                      className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <i className="ri-loader-4-line animate-spin mr-2"></i>
                          {editingReview ? 'Updating...' : 'Creating...'}
                        </>
                      ) : editingReview ? (
                        'Update Review'
                      ) : (
                        'Create Review'
                      )}
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
