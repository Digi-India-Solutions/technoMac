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
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Routes used:
// POST   /product                              → createProduct
// GET    /product                              → getAllProducts
// GET    /product/by-category/:categoryId      → getProductsByCategory   (category dropdown populate)
// GET    /product/by-subcategory/:subCategoryId → getProductsBySubCategory (subcategory dropdown populate)
// PUT    /product/:id                          → updateProduct
// DELETE /product/:id                          → deleteProduct

export default function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [categoryList, setCategoryList] = useState([]); // unique categories from products
  const [subCategoriesList, setSubCategoriesList] = useState([]); // subcategories for selected category
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filters, setFilters] = useState({ search: '' });
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const emptyForm = {
    name: '',
    category: '', // _id  (used for by-category filter)
    subCategory: '', // _id  (used for by-subcategory filter)
    price: '',
    discountPrice: '',
    stock: '',
    isFeatured: false,
    isActive: true,
    images: [],
  };
  const [formData, setFormData] = useState(emptyForm);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // ── GET /product → getAllProducts ──────────────────────────
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await getData('product');
      if (res?.success) {
        const data = res.data || [];
        setProducts(data);

        // Build unique category list from fetched products (no extra API needed)
        const seen = new Map();
        data.forEach((p) => {
          const id = p.category?._id || p.category;
          const name = p.category?.name;
          if (id && name && !seen.has(id)) seen.set(id, { _id: id, name });
        });
        setCategoryList([...seen.values()]);
      } else {
        toast.error(res?.message || 'Failed to fetch products');
      }
    } catch {
      toast.error('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  // ── GET /product/by-category/:id → populate subCategory dropdown ─
  const fetchSubCategoriesByCategory = async (categoryId) => {
    if (!categoryId) {
      setSubCategoriesList([]);
      return;
    }
    try {
      const res = await getData(`product/by-category/${categoryId}`);
      if (res?.success) {
        // Extract unique subcategories from products of this category
        const seen = new Map();
        (res.data || []).forEach((p) => {
          const id = p.subCategory?._id || p.subCategory;
          const name = p.subCategory?.name;
          if (id && name && !seen.has(id)) seen.set(id, { _id: id, name });
        });
        setSubCategoriesList([...seen.values()]);
      } else {
        toast.error(res?.message || 'Failed to fetch subcategories');
      }
    } catch {
      toast.error('Failed to load subcategories');
    }
  };

  // ── Image handlers ────────────────────────────────────────────
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files).filter((f) =>
      f.type.startsWith('image/'),
    );
    if (!files.length) return;
    const toAdd = files.slice(0, 10 - formData.images.length);
    setUploadedFiles((prev) => [...prev, ...toAdd]);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...toAdd.map((f) => URL.createObjectURL(f))],
    }));
    e.target.value = '';
  };

  const removeImage = (index) => {
    const existingCount = formData.images.length - uploadedFiles.length;
    if (index >= existingCount) {
      const fi = index - existingCount;
      URL.revokeObjectURL(formData.images[index]);
      setUploadedFiles((prev) => prev.filter((_, i) => i !== fi));
    }
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // ── Build FormData (field names match controller) ─────────────
  const buildFD = () => {
    const fd = new FormData();
    fd.append('name', formData.name);
    fd.append('category', formData.category);
    fd.append('subCategory', formData.subCategory);
    fd.append('price', formData.price);
    fd.append('discountPrice', formData.discountPrice || '');
    fd.append('stock', formData.stock || '');
    fd.append('isFeatured', String(formData.isFeatured));
    fd.append('isActive', String(formData.isActive));
    uploadedFiles.forEach((file) => fd.append('images', file)); // multer field: 'images'
    return fd;
  };

  // ── POST /product  OR  PUT /product/:id ───────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const fd = buildFD();
      const res = editingProduct
        ? await patchData(`product/${editingProduct._id}`, fd) // PUT
        : await postData('product', fd); // POST

      if (res?.success) {
        toast.success(
          `Product ${editingProduct ? 'updated' : 'created'} successfully!`,
        );
        fetchProducts();
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

  const resetForm = () => {
    formData.images.forEach((url) => {
      if (url.startsWith('blob:')) URL.revokeObjectURL(url);
    });
    setFormData(emptyForm);
    setUploadedFiles([]);
    setShowAddModal(false);
    setEditingProduct(null);
    setSubCategoriesList([]);
  };

  // ── Open Edit modal ───────────────────────────────────────────
  const handleEdit = (product) => {
    setEditingProduct(product);
    const catId = product.category?._id || product.category || '';
    setFormData({
      name: product.name || '',
      category: catId,
      subCategory: product.subCategory?._id || product.subCategory || '',
      price: product.price?.toString() || '',
      discountPrice: product.discountPrice?.toString() || '',
      stock: product.stock?.toString() || '',
      isFeatured: product.isFeatured || false,
      isActive: product.isActive ?? true,
      images: product.images || [],
    });
    if (catId) fetchSubCategoriesByCategory(catId);
    setShowAddModal(true);
  };

  // ── DELETE /product/:id ───────────────────────────────────
  const handleDelete = async (productId) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });
    if (!confirm.isConfirmed) return;
    try {
      const res = await deleteData(`product/${productId}`);
      if (res?.success) {
        setProducts((prev) => prev.filter((p) => p._id !== productId));
        toast.success('Product deleted successfully!');
      } else {
        toast.error(res?.message || 'Failed to delete product');
      }
    } catch {
      toast.error('Failed to delete product!');
    }
  };

  // ── Toggle isActive → PUT /product/:id ───────────────────
  const toggleStatus = async (product) => {
    try {
      const fd = new FormData();
      fd.append('isActive', String(!product.isActive));
      const res = await patchData(`product/${product._id}`, fd);
      if (res?.success) {
        toast.success(
          `Product ${!product.isActive ? 'activated' : 'deactivated'}`,
        );
        fetchProducts();
      } else {
        toast.error(res?.message || 'Failed to update status');
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  // ── Effects ───────────────────────────────────────────────────
  useEffect(() => {
    fetchProducts();
  }, []);

  // When category changes in form → fetch subcategories via by-category route
  useEffect(() => {
    if (formData.category) fetchSubCategoriesByCategory(formData.category);
    else {
      setSubCategoriesList([]);
      setFormData((prev) => ({ ...prev, subCategory: '' }));
    }
  }, [formData.category]);

  // ── Client-side search filter ─────────────────────────────────
  const displayed = products.filter(
    (p) =>
      !filters.search ||
      p.name?.toLowerCase().includes(filters.search.toLowerCase()),
  );

  // ── JSX ───────────────────────────────────────────────────────
  return (
    <AdminLayout>
      <div className="p-6">
        <ToastContainer />

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Products Management
            </h1>
            <p className="text-gray-600 mt-1">Manage your product catalog</p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
          >
            <i className="ri-add-line"></i>
            <span>Add Product</span>
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
              placeholder="Search by product name..."
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              className="w-full md:w-80 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </Card>

        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {displayed.map((product) => (
                <Card key={product._id} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={
                        product.images?.[0] ||
                        'https://via.placeholder.com/300x200?text=No+Image'
                      }
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <span
                      className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${product.isActive ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}`}
                    >
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {product.isFeatured && (
                      <span className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white">
                        Featured
                      </span>
                    )}
                    {product.images?.length > 1 && (
                      <span className="absolute bottom-3 right-3 px-2 py-1 bg-black bg-opacity-50 rounded-full text-xs text-white">
                        +{product.images.length - 1}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {product.category?.name}
                      {product.subCategory?.name
                        ? ` › ${product.subCategory.name}`
                        : ''}
                    </p>
                    <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs">Price</p>
                        <p className="font-semibold text-green-600">
                          ₹{product.price}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Discount</p>
                        <p className="font-semibold text-red-500">
                          {product.discountPrice
                            ? `₹${product.discountPrice}`
                            : '—'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Stock</p>
                        <p className="font-semibold">{product.stock ?? '—'}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleEdit(product)}
                        className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm"
                      >
                        <i className="ri-edit-line mr-1"></i>Edit
                      </Button>
                      <Button
                        onClick={() => toggleStatus(product)}
                        className={`flex-1 text-sm ${product.isActive ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                      >
                        {product.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        onClick={() => handleDelete(product._id)}
                        className="bg-red-50 text-red-600 hover:bg-red-100 px-3"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Table */}
            <Card className="mt-8">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">
                  All Products Overview
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {[
                          'Product',
                          'Category',
                          'Price',
                          'Discount',
                          'Stock',
                          'Featured',
                          'Status',
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
                      {displayed.map((product) => (
                        <tr key={product._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <img
                                className="h-10 w-10 rounded object-cover"
                                src={
                                  product.images?.[0] ||
                                  'https://via.placeholder.com/100?text=No'
                                }
                                alt={product.name}
                              />
                              <span className="text-sm font-medium text-gray-900">
                                {product.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                            <div>{product.category?.name}</div>
                            {product.subCategory?.name && (
                              <div className="text-xs text-blue-600">
                                {product.subCategory.name}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            ₹{product.price}
                          </td>
                          <td className="px-4 py-3 text-sm text-red-500">
                            {product.discountPrice
                              ? `₹${product.discountPrice}`
                              : '—'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {product.stock ?? '—'}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${product.isFeatured ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}
                            >
                              {product.isFeatured ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}
                            >
                              {product.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleEdit(product)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => toggleStatus(product)}
                                className="text-yellow-600 hover:text-yellow-900"
                              >
                                {product.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                onClick={() => handleDelete(product._id)}
                                className="text-red-600 hover:text-red-900"
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
          </>
        )}

        {displayed.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <i className="ri-shopping-bag-line text-4xl text-gray-400 mb-4 block"></i>
            <p className="text-gray-500">No products found</p>
          </div>
        )}

        {/* Add / Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Category — built from existing products via GET /product */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <div className="relative">
                        <select
                          value={formData.category}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              category: e.target.value,
                              subCategory: '',
                            })
                          }
                          className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none"
                          required
                        >
                          <option value="">Select Category</option>
                          {categoryList.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                        <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      </div>
                    </div>

                    {/* SubCategory — fetched via GET /product/by-category/:id */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sub-Category
                      </label>
                      <div className="relative">
                        <select
                          value={formData.subCategory}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              subCategory: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none"
                          disabled={
                            !formData.category || subCategoriesList.length === 0
                          }
                        >
                          <option value="">Select Sub-Category</option>
                          {subCategoriesList.map((sub) => (
                            <option key={sub._id} value={sub._id}>
                              {sub.name}
                            </option>
                          ))}
                        </select>
                        <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      </div>
                    </div>
                  </div>

                  {/* Price + Discount */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (₹) *
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Discount Price (₹)
                      </label>
                      <input
                        type="number"
                        value={formData.discountPrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            discountPrice: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>

                  {/* isFeatured + isActive */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Featured
                      </label>
                      <div className="relative">
                        <select
                          value={formData.isFeatured.toString()}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isFeatured: e.target.value === 'true',
                            })
                          }
                          className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none"
                        >
                          <option value="false">No</option>
                          <option value="true">Yes</option>
                        </select>
                        <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <div className="relative">
                        <select
                          value={formData.isActive.toString()}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isActive: e.target.value === 'true',
                            })
                          }
                          className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none"
                        >
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </select>
                        <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      </div>
                    </div>
                  </div>

                  {/* Images */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Images (max 10)
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          accept="image/*"
                          multiple
                          className="hidden"
                        />
                        <Button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-blue-600 text-white hover:bg-blue-700 flex items-center space-x-2"
                          disabled={formData.images.length >= 10}
                        >
                          <i className="ri-upload-2-line"></i>
                          <span>Upload Images</span>
                        </Button>
                        <span className="text-sm text-gray-500">
                          {formData.images.length} / 10 selected
                        </span>
                      </div>
                      {formData.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-3">
                          {formData.images.map((img, idx) => (
                            <div key={idx} className="relative">
                              <img
                                src={img}
                                alt={`img-${idx}`}
                                className="w-full h-20 object-cover rounded-lg border border-gray-200"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                              >
                                <i className="ri-close-line"></i>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex space-x-3 pt-4">
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
                        : editingProduct
                          ? 'Update Product'
                          : 'Add Product'}
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
