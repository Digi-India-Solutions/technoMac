import { useState, useRef, useEffect, useCallback } from 'react';
import AdminLayout from '../../../../components/feature/AdminLayout';
import Card from '../../../../components/base/Card';
import Button from '../../../../components/base/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// ✅ FIX: removed axios, subCategoryAPI, categoryAPI, getToken
import { getData, postData, patchData, deleteData } from '../../../../services/FetchNodeServices';
import Swal from 'sweetalert2';

const PLACEHOLDER_IMG = 'https://via.placeholder.com/400x200?text=No+Image';
const ITEMS_PER_PAGE = 50;

const DEFAULT_FORM = {
  name: '',
  categoryId: '',
  parentCategoryId: '',   // ✅ NEW
  description: '',
  image: null,
  imagePreview: null,
  isActive: true,
};

export default function SubCategoriesManagement() {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);           // for dropdown
  const [parentCategories, setParentCategories] = useState([]); // ✅ NEW
  const [filteredCategories, setFilteredCategories] = useState([]); // ✅ filtered by parentCategory
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingList, setFetchingList] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [currentPage, setCurrentPage] = useState(1);

  const fileInputRef = useRef(null);

  const totalPages = Math.ceil(subCategories.length / ITEMS_PER_PAGE);
  const paginatedItems = subCategories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // ── Reset form ─────────────────────────────────────────────────────────────
  const resetForm = useCallback(() => {
    setFormData(DEFAULT_FORM);
    setEditingSubCategory(null);
    setFilteredCategories([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowAddModal(false);
    resetForm();
  }, [resetForm]);

  // ── Fetch sub-categories ───────────────────────────────────────────────────
  const fetchSubCategories = useCallback(async () => {
    setFetchingList(true);
    try {
      // ✅ FIX: getData returns directly, not res.data
      const res = await getData('sub-category/');
      if (res?.success) {
        setSubCategories(res.data || []);
        setCurrentPage(1);
      } else {
        toast.error(res?.message || 'Failed to load sub-categories');
      }
    } catch (error) {
      toast.error('Failed to load sub-categories');
      console.error('fetchSubCategories:', error);
    } finally {
      setFetchingList(false);
    }
  }, []);

  // ── Fetch categories for dropdown ─────────────────────────────────────────
  const fetchCategories = useCallback(async () => {
    try {
      const res = await getData('category/all');
      if (res?.success) setCategories(res.data || []);
    } catch (error) {
      console.error('fetchCategories:', error);
    }
  }, []);

  // ── Fetch parent categories ✅ NEW ────────────────────────────────────────
  const fetchParentCategories = useCallback(async () => {
    try {
      const res = await getData('parentCategory/all');
      if (res?.success) setParentCategories(res.data || []);
    } catch (error) {
      console.error('fetchParentCategories:', error);
    }
  }, []);

  useEffect(() => {
    fetchSubCategories();
    fetchCategories();
    fetchParentCategories();
  }, [fetchSubCategories, fetchCategories, fetchParentCategories]);

  // ── When parentCategory changes in form, filter categories ✅ NEW ─────────
  useEffect(() => {
    if (formData.parentCategoryId) {
      const filtered = categories.filter(
        (cat) =>
          (cat.parentCategoryId?._id || cat.parentCategoryId) === formData.parentCategoryId
      );
      setFilteredCategories(filtered);
      // Reset categoryId if it doesn't belong to new parent
      if (formData.categoryId) {
        const stillValid = filtered.some((c) => c._id === formData.categoryId);
        if (!stillValid) setFormData((prev) => ({ ...prev, categoryId: '' }));
      }
    } else {
      setFilteredCategories(categories); // show all if no parent selected
    }
  }, [formData.parentCategoryId, categories]);

  // ── Image upload ───────────────────────────────────────────────────────────
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

  // ── Submit (Create / Update) ───────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error('Sub-Category name is required');
    if (!formData.categoryId) return toast.error('Category is required');

    setIsLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name.trim());
      data.append('category', formData.categoryId);
      data.append('description', formData.description || '');
      data.append('isActive', formData.isActive);
      if (formData.image instanceof File) data.append('image', formData.image);
      // Note: parentCategoryId is auto-set by backend from category

      let res;
      if (editingSubCategory) {
        // ✅ FIX: patchData instead of axios
        res = await patchData(`sub-category/${editingSubCategory._id}`, data);
      } else {
        // ✅ FIX: postData instead of axios
        res = await postData('sub-category/', data);
      }

      // ✅ FIX: res?.success not res.data?.success
      if (res?.success) {
        toast.success(editingSubCategory ? 'Sub-Category updated successfully' : 'Sub-Category created successfully');
        handleCloseModal();
        fetchSubCategories();
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('handleSubmit:', error);
      toast.error(error?.response?.data?.message || 'Error saving sub-category');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Edit ───────────────────────────────────────────────────────────────────
  const handleEdit = useCallback((subCategory) => {
    setEditingSubCategory(subCategory);
    setFormData({
      name: subCategory.name || '',
      categoryId: subCategory.category?._id || subCategory.category || '',
      parentCategoryId: subCategory.parentCategoryId?._id || subCategory.parentCategoryId || '',
      description: subCategory.description || '',
      image: null,
      imagePreview: subCategory.image || null,
      isActive: subCategory.isActive ?? true,
    });
    setShowAddModal(true);
  }, []);

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = useCallback(async (id) => {
    const result = await Swal.fire({
      title: 'Delete Sub-Category?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
    });
    if (!result.isConfirmed) return;

    try {
      // ✅ FIX: deleteData instead of axios
      const res = await deleteData(`sub-category/${id}`);
      if (res?.success) {
        toast.success('Sub-Category deleted');
        fetchSubCategories();
      } else {
        toast.error(res?.message || 'Failed to delete');
      }
    } catch (error) {
      console.error('handleDelete:', error);
      toast.error('Failed to delete sub-category');
    }
  }, [fetchSubCategories]);

  // ── Toggle isActive ────────────────────────────────────────────────────────
  const toggleStatus = useCallback(async (subCategory) => {
    setSubCategories((prev) =>
      prev.map((sc) => sc._id === subCategory._id ? { ...sc, isActive: !subCategory.isActive } : sc)
    );
    try {
      const data = new FormData();
      data.append('isActive', !subCategory.isActive);
      // ✅ FIX: patchData instead of axios
      const res = await patchData(`sub-category/${subCategory._id}`, data);

      if (res?.success) {
        toast.success(`Sub-Category ${!subCategory.isActive ? 'activated' : 'deactivated'}`);
      } else {
        setSubCategories((prev) =>
          prev.map((sc) => sc._id === subCategory._id ? { ...sc, isActive: subCategory.isActive } : sc)
        );
        toast.error(res?.message || 'Status update failed');
      }
    } catch (error) {
      setSubCategories((prev) =>
        prev.map((sc) => sc._id === subCategory._id ? { ...sc, isActive: subCategory.isActive } : sc)
      );
      console.error('toggleStatus:', error);
      toast.error('Error updating status');
    }
  }, []);

  // ── Pagination ─────────────────────────────────────────────────────────────
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
            <h1 className="text-2xl font-bold text-gray-900">Sub-Categories Management</h1>
            <p className="text-gray-600 mt-1">Manage product sub-categories</p>
          </div>
          <Button onClick={() => { resetForm(); setShowAddModal(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
            <i className="ri-add-line"></i>
            <span>Add Sub-Category</span>
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
        {!fetchingList && subCategories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <i className="ri-folder-3-line text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-500">No sub-categories found</h3>
            <p className="text-gray-400 text-sm mt-1">Add your first sub-category to get started.</p>
            <Button onClick={() => { resetForm(); setShowAddModal(true); }} className="mt-4 bg-blue-600 text-white">
              <i className="ri-add-line mr-1"></i>Add Sub-Category
            </Button>
          </div>
        )}

        {/* Grid */}
        {!fetchingList && subCategories.length > 0 && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedItems.map((subCategory) => (
                <Card key={subCategory._id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <div className="relative">
                    <img
                      src={subCategory.image || PLACEHOLDER_IMG}
                      alt={subCategory.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMG; }}
                    />
                    <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                      subCategory.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {subCategory.isActive ? 'Active' : 'Inactive'}
                    </div>
                    {/* ✅ Parent category badge */}
                    {subCategory.parentCategoryId?.name && (
                      <div className="absolute top-3 left-3 px-2 py-1 bg-purple-600 text-white rounded-full text-xs font-medium">
                        {subCategory.parentCategoryId.name}
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    {/* Category badge */}
                    {subCategory.category?.name && (
                      <span className="inline-block text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full mb-2">
                        {subCategory.category.name}
                      </span>
                    )}
                    <h3 className="font-semibold text-gray-900 mb-3">{subCategory.name}</h3>

                    <div className="flex space-x-2 pt-2 border-t border-gray-100">
                      <Button onClick={() => handleEdit(subCategory)}
                        className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm border border-blue-100">
                        <i className="ri-edit-line mr-1"></i>Edit
                      </Button>
                      <Button onClick={() => toggleStatus(subCategory)}
                        className={`flex-1 text-sm border ${
                          subCategory.isActive
                            ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-100'
                            : 'bg-green-50 text-green-700 hover:bg-green-100 border-green-100'
                        }`}>
                        <i className={`mr-1 ${subCategory.isActive ? 'ri-pause-circle-line' : 'ri-play-circle-line'}`}></i>
                        {subCategory.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button onClick={() => handleDelete(subCategory._id)}
                        className="bg-red-50 text-red-600 hover:bg-red-100 px-3 border border-red-100">
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
                    {Math.min(currentPage * ITEMS_PER_PAGE, subCategories.length)}
                  </span>{' '}
                  of <span className="font-medium text-gray-700">{subCategories.length}</span> sub-categories
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

      {/* ── Add / Edit Modal ────────────────────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingSubCategory ? 'Edit Sub-Category' : 'Add New Sub-Category'}
                </h2>
                <button onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
                  <i className="ri-close-line text-lg"></i>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* ✅ NEW: Parent Category dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent Category
                  </label>
                  <div className="relative">
                    <select
                      value={formData.parentCategoryId}
                      onChange={(e) => setFormData({ ...formData, parentCategoryId: e.target.value, categoryId: '' })}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none text-sm"
                    >
                      <option value="">All Parent Categories</option>
                      {parentCategories.map((pc) => (
                        <option key={pc._id} value={pc._id}>{pc.name}</option>
                      ))}
                    </select>
                    <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                  </div>
                </div>

                {/* Category dropdown (filtered by parent) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none text-sm"
                      required
                    >
                      <option value="">Select Category</option>
                      {filteredCategories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                    <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sub-Category Name <span className="text-red-500">*</span>
                  </label>
                  <input type="text" value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. X-Ray Equipment"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    required />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3" placeholder="Optional description..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                    maxLength="500" />
                </div>

                {/* Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
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
                    <select value={formData.isActive ? 'Active' : 'Inactive'}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'Active' })}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none text-sm">
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
                      <><i className="ri-loader-4-line animate-spin"></i>{editingSubCategory ? 'Updating...' : 'Adding...'}</>
                    ) : editingSubCategory ? 'Update Sub-Category' : 'Add Sub-Category'}
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