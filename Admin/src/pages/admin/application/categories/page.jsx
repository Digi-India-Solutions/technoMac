import { useState, useRef, useEffect, useCallback } from 'react';
import AdminLayout from '../../../../components/feature/AdminLayout';
import Card from '../../../../components/base/Card';
import Button from '../../../../components/base/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// ✅ FIX: removed axios, categoryAPI, getToken — use FetchNodeServices instead
import { getData, postData, patchData, deleteData } from '../../../../services/FetchNodeServices';
import Swal from 'sweetalert2';

const PLACEHOLDER_IMG = 'https://via.placeholder.com/400x200?text=No+Image';
const ITEMS_PER_PAGE = 12;

const DEFAULT_FORM = {
  name: '',
  parentCategoryId: '',
  image: null,
  imagePreview: null,
  isActive: true, // ✅ FIX: 'status' → 'isActive'
};

export default function CategoriesManagement() {
  const [categories, setCategories] = useState([]);
  const [parentCategoryList, setParentCategoryList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingList, setFetchingList] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [currentPage, setCurrentPage] = useState(1);

  const fileInputRef = useRef(null);

  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
  const paginatedItems = categories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // ─── Reset form ────────────────────────────────────────────────────────────
  const resetForm = useCallback(() => {
    setFormData(DEFAULT_FORM);
    setEditingCategory(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowAddModal(false);
    resetForm();
  }, [resetForm]);

  // ─── Fetch categories ─────────────────────────────────────────────────────
  const fetchCategories = useCallback(async () => {
    setFetchingList(true);
    try {
      // ✅ FIX: getData returns response directly (not res.data)
      const res = await getData('category/all');
      if (res?.success) {
        setCategories(res.data || []);
        setCurrentPage(1);
      } else {
        toast.error(res?.message || 'Failed to load categories');
      }
    } catch (error) {
      toast.error('Failed to load categories');
      console.error('fetchCategories:', error);
    } finally {
      setFetchingList(false);
    }
  }, []);

  // ─── Fetch parent categories ──────────────────────────────────────────────
  const fetchParentCategory = useCallback(async () => {
    try {
      const res = await getData('parentCategory/all');
      if (res?.success) {
        setParentCategoryList(res.data || []);
      } else {
        toast.error(res?.message || 'Failed to load Parent Categories');
      }
    } catch (error) {
      toast.error('Failed to load Parent Categories');
      console.error('fetchParentCategory:', error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchParentCategory();
  }, [fetchCategories, fetchParentCategory]);

  // ─── Image upload ──────────────────────────────────────────────────────────
  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  }, []);

  // ─── Submit (Create / Update) ──────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error('Category name is required');
    if (!formData?.parentCategoryId) return toast.error('Please select a Parent Category');

    setIsLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name.trim());
      data.append('parentCategoryId', formData.parentCategoryId);
      data.append('isActive', formData.isActive); // ✅ FIX: 'status' → 'isActive'
      if (formData.image instanceof File) {
        data.append('image', formData.image);
      }

      let res;
      if (editingCategory) {
        // ✅ FIX: patchData instead of categoryAPI.update (axios)
        res = await patchData(`category/${editingCategory._id}`, data);
      } else {
        // ✅ FIX: postData instead of categoryAPI.create (axios)
        res = await postData('category/create', data);
      }

      // ✅ FIX: res?.success (not res.data?.success)
      if (res?.success) {
        toast.success(editingCategory ? 'Category updated successfully' : 'Category created successfully');
        handleCloseModal();
        fetchCategories();
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('handleSubmit:', error);
      toast.error(error?.response?.data?.message || 'Error saving category');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Edit ──────────────────────────────────────────────────────────────────
  const handleEdit = useCallback((category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      parentCategoryId: category.parentCategoryId?._id || category.parentCategoryId || '',
      image: category.image || null,
      imagePreview: category.image || null,
      isActive: category.isActive ?? true, // ✅ FIX: 'status' → 'isActive'
    });
    setShowAddModal(true);
  }, []);

  // ─── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = useCallback(async (id) => {
    const result = await Swal.fire({
      title: 'Delete Category?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
    });
    if (!result.isConfirmed) return;

    try {
      // ✅ FIX: deleteData instead of categoryAPI.delete (axios)
      const res = await deleteData(`category/${id}`);
      if (res?.success) {
        toast.success('Category deleted');
        fetchCategories();
      } else {
        toast.error(res?.message || 'Failed to delete');
      }
    } catch (error) {
      console.error('handleDelete:', error);
      toast.error('Failed to delete category');
    }
  }, [fetchCategories]);

  // ─── Toggle isActive ───────────────────────────────────────────────────────
  const toggleStatus = useCallback(async (category) => {
    // Optimistic update
    setCategories((prev) =>
      prev.map((c) => c._id === category._id ? { ...c, isActive: !category.isActive } : c)
    );

    try {
      const data = new FormData();
      data.append('isActive', !category.isActive); // ✅ FIX: 'status' → 'isActive'
      // ✅ FIX: patchData instead of categoryAPI.update (axios)
      const res = await patchData(`category/${category._id}`, data);

      if (res?.success) {
        toast.success(`Category ${!category.isActive ? 'activated' : 'deactivated'}`);
      } else {
        // Revert
        setCategories((prev) =>
          prev.map((c) => c._id === category._id ? { ...c, isActive: category.isActive } : c)
        );
        toast.error(res?.message || 'Status update failed');
      }
    } catch (error) {
      // Revert
      setCategories((prev) =>
        prev.map((c) => c._id === category._id ? { ...c, isActive: category.isActive } : c)
      );
      console.error('toggleStatus:', error);
      toast.error('Error updating status');
    }
  }, []);

  // ─── Pagination ────────────────────────────────────────────────────────────
  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages];
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
            <p className="text-gray-600 mt-1">Manage product categories</p>
          </div>
          <Button
            onClick={() => { resetForm(); setShowAddModal(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <i className="ri-add-line"></i>
            <span>Add Category</span>
          </Button>
        </div>

        {/* Loading skeleton */}
        {fetchingList && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-lg border border-gray-200 overflow-hidden animate-pulse">
                <div className="bg-gray-200 h-48 w-full" />
                <div className="p-4 space-y-3">
                  <div className="bg-gray-200 h-4 rounded w-3/4" />
                  <div className="flex gap-2 mt-4">
                    <div className="bg-gray-200 h-8 rounded flex-1" />
                    <div className="bg-gray-200 h-8 rounded flex-1" />
                    <div className="bg-gray-200 h-8 rounded w-10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!fetchingList && categories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <i className="ri-folder-3-line text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-500">No categories found</h3>
            <p className="text-gray-400 text-sm mt-1">Add your first category to get started.</p>
            <Button onClick={() => { resetForm(); setShowAddModal(true); }} className="mt-4 bg-blue-600 text-white">
              <i className="ri-add-line mr-1"></i>Add Category
            </Button>
          </div>
        )}

        {/* Category Grid */}
        {!fetchingList && categories.length > 0 && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedItems.map((category) => (
                <Card key={category._id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <div className="relative">
                    <img
                      src={category.image || PLACEHOLDER_IMG}
                      alt={category.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMG; }}
                    />
                    {/* ✅ FIX: category.status → category.isActive */}
                    <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                      category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>

                  <div className="p-4">
                    {/* Parent category badge */}
                    {category.parentCategoryId?.name && (
                      <span className="inline-block text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full mb-2">
                        {category.parentCategoryId.name}
                      </span>
                    )}
                    <h3 className="font-semibold text-gray-900 mb-3">{category.name}</h3>

                    <div className="flex space-x-2 pt-2 border-t border-gray-100">
                      <Button
                        onClick={() => handleEdit(category)}
                        className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm border border-blue-100"
                      >
                        <i className="ri-edit-line mr-1"></i>Edit
                      </Button>

                      {/* ✅ FIX: category.status → category.isActive */}
                      <Button
                        onClick={() => toggleStatus(category)}
                        className={`flex-1 text-sm border ${
                          category.isActive
                            ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-100'
                            : 'bg-green-50 text-green-700 hover:bg-green-100 border-green-100'
                        }`}
                      >
                        <i className={`mr-1 ${category.isActive ? 'ri-pause-circle-line' : 'ri-play-circle-line'}`}></i>
                        {category.isActive ? 'Deactivate' : 'Activate'}
                      </Button>

                      <Button
                        onClick={() => handleDelete(category._id)}
                        className="bg-red-50 text-red-600 hover:bg-red-100 px-3 border border-red-100"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col items-center gap-3">
                <p className="text-sm text-gray-500">
                  Showing{' '}
                  <span className="font-medium text-gray-700">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                    {Math.min(currentPage * ITEMS_PER_PAGE, categories.length)}
                  </span>{' '}
                  of <span className="font-medium text-gray-700">{categories.length}</span> categories
                </p>
                <div className="flex items-center gap-1">
                  <button onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg border text-sm font-medium hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    ← Prev
                  </button>
                  {getPageNumbers().map((page, idx) =>
                    page === '...' ? (
                      <span key={`e-${idx}`} className="px-2 text-gray-400 text-sm">...</span>
                    ) : (
                      <button key={page} onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                          currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-100'
                        }`}>
                        {page}
                      </button>
                    )
                  )}
                  <button onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg border text-sm font-medium hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Add / Edit Modal ───────────────────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h2>
                <button onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
                  <i className="ri-close-line text-lg"></i>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Parent Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.parentCategoryId}
                      onChange={(e) => setFormData({ ...formData, parentCategoryId: e.target.value })}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none text-sm"
                      required
                    >
                      <option value="">Select Parent Category</option>
                      {parentCategoryList.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                    <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. X-Ray Machines"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    required
                  />
                </div>

                {/* Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category Image</label>
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                  <Button type="button" onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 text-sm">
                    <i className="ri-upload-2-line"></i>
                    {formData.imagePreview ? 'Change Image' : 'Upload Image'}
                  </Button>
                  {formData.imagePreview && (
                    <div className="relative mt-3">
                      <img src={formData.imagePreview} alt="Preview"
                        className="w-full h-36 object-cover rounded-lg border border-gray-200"
                        onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMG; }} />
                      <button type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, image: null, imagePreview: null }))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600">
                        <i className="ri-close-line"></i>
                      </button>
                    </div>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <div className="relative">
                    {/* ✅ FIX: formData.status → formData.isActive */}
                    <select
                      value={formData.isActive ? 'Active' : 'Inactive'}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'Active' })}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none text-sm"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4 border-t border-gray-100">
                  <Button type="button" onClick={handleCloseModal}
                    className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200" disabled={isLoading}>
                    Cancel
                  </Button>
                  <Button type="submit"
                    className="flex-1 bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-2"
                    disabled={isLoading}>
                    {isLoading ? (
                      <><i className="ri-loader-4-line animate-spin"></i>{editingCategory ? 'Updating...' : 'Adding...'}</>
                    ) : editingCategory ? 'Update Category' : 'Add Category'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}