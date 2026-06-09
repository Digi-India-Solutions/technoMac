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
} from '../../../../services/FetchNodeServices';

const ITEMS_PER_PAGE = 12;

const emptyForm = {
  name: '',
  description: '',
  order: '',
  image: null,
};

export default function ClientsManagement() {
  const [clients, setClients] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const totalPages = Math.ceil(clients.length / ITEMS_PER_PAGE);
  const paginatedClients = clients.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingClient(null);
  };

  // ─── Fetch all clients (admin) ────────────────────────────────────────────
  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const response = await getData('client/admin/all');
      if (response?.success) {
        setClients(response.data || []);
        setCurrentPage(1);
      } else {
        toast.error(response?.message || 'Failed to load clients');
      }
    } catch (error) {
      toast.error('Failed to load clients');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // ─── Create / Update ──────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      toast.error('Please enter a client name');
      return;
    }
    if (!formData.description?.trim()) {
      toast.error('Please enter a client description');
      return;
    }
    if (!editingClient && !formData.image) {
      toast.error('Please select an image');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('order', formData.order || 0);
      if (formData.image instanceof File) {
        data.append('image', formData.image);
      }

      let response;
      if (editingClient) {
        response = await patchData(`client/update/${editingClient._id}`, data);
      } else {
        response = await postData('client/create', data);
      }

      if (response?.success) {
        toast.success(
          editingClient
            ? 'Client updated successfully!'
            : 'Client created successfully!',
        );
        resetForm();
        setShowAddModal(false);
        fetchClients();
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

  // ─── Edit client ──────────────────────────────────────────────────────────
  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name || '',
      description: client.description || '',
      order: client.order ?? '',
      image: client.image || null,
    });
    setShowAddModal(true);
  };

  // ─── Delete client ────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Client?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it',
    });
    if (!result.isConfirmed) return;

    try {
      const response = await deleteData(`client/delete/${id}`);
      if (response?.success) {
        toast.success('Client deleted');
        fetchClients();
      } else {
        toast.error(response?.message || 'Delete failed');
      }
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  // ─── Toggle active status ─────────────────────────────────────────────────
  const handleToggle = async (id) => {
    setTogglingId(id);
    try {
      const response = await patchData(`client/toggle/${id}`, {});
      if (response?.success) {
        toast.success(response.message || 'Status updated');
        fetchClients();
      } else {
        toast.error(response?.message || 'Toggle failed');
      }
    } catch (error) {
      toast.error('Toggle failed');
    } finally {
      setTogglingId(null);
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

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="p-6">
        {/* ── Header ── */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Client Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your client logos and details
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
          >
            <i className="ri-add-line mr-1"></i>
            Add Client
          </Button>
        </div>

        {/* ── Loading ── */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <i className="ri-loader-4-line animate-spin text-3xl text-blue-600"></i>
            <p className="text-gray-500 ml-3">Loading clients...</p>
          </div>
        )}

        {/* ── Empty state ── */}
        {!isLoading && clients.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <i className="ri-building-line text-5xl mb-3 block"></i>
            <p className="text-lg">No clients found</p>
            <p className="text-sm mt-1">
              Click "Add Client" to add your first client
            </p>
          </div>
        )}

        {/* ── Client Grid ── */}
        {!isLoading && clients.length > 0 && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedClients.map((client) => (
                <Card key={client._id} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={client.image}
                      alt={client.name}
                      className="w-full h-48 object-cover"
                    />
                    {/* Active / Inactive badge */}
                    <span
                      className={`absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
                        client.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {client.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {/* Order badge */}
                    {client.order !== undefined && (
                      <span className="absolute top-2 left-2 text-xs bg-gray-800 bg-opacity-70 text-white px-2 py-0.5 rounded-full">
                        #{client.order}
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 truncate">
                      {client.name}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                      {client.description}
                    </p>

                    <div className="flex gap-2 mt-4">
                      {/* Toggle Active */}
                      <Button
                        onClick={() => handleToggle(client._id)}
                        disabled={togglingId === client._id}
                        className={`flex-1 text-white ${
                          client.isActive
                            ? 'bg-amber-500 hover:bg-amber-600'
                            : 'bg-green-600 hover:bg-green-700'
                        } disabled:opacity-50`}
                      >
                        {togglingId === client._id ? (
                          <i className="ri-loader-4-line animate-spin"></i>
                        ) : client.isActive ? (
                          <>
                            <i className="ri-eye-off-line mr-1"></i> Hide
                          </>
                        ) : (
                          <>
                            <i className="ri-eye-line mr-1"></i> Show
                          </>
                        )}
                      </Button>

                      {/* Edit */}
                      <Button
                        onClick={() => handleEdit(client)}
                        className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                      >
                        <i className="ri-edit-line mr-1"></i> Edit
                      </Button>

                      {/* Delete */}
                      <Button
                        onClick={() => handleDelete(client._id)}
                        className="flex-1 bg-red-600 text-white hover:bg-red-700"
                      >
                        <i className="ri-delete-bin-line mr-1"></i> Delete
                      </Button>
                    </div>
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
                    {Math.min(currentPage * ITEMS_PER_PAGE, clients.length)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium text-gray-700">
                    {clients.length}
                  </span>{' '}
                  clients
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
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {editingClient ? 'Edit Client' : 'Add New Client'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
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
                      Client Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter client name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      placeholder="Enter client description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                      required
                    />
                  </div>

                  {/* Order */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Display Order
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      min="0"
                      value={formData.order}
                      onChange={(e) =>
                        setFormData({ ...formData, order: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Lower numbers appear first. Default is 0.
                    </p>
                  </div>

                  {/* Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Logo / Image{' '}
                      {!editingClient && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>

                    {/* Existing image preview when editing */}
                    {formData.image && typeof formData.image === 'string' && (
                      <img
                        src={formData.image}
                        alt="Current client"
                        className="h-32 w-full object-cover rounded-lg mb-2 border border-gray-200"
                      />
                    )}
                    {/* New file preview */}
                    {formData.image instanceof File && (
                      <img
                        src={URL.createObjectURL(formData.image)}
                        alt="New client preview"
                        className="h-32 w-full object-cover rounded-lg mb-2 border border-gray-200"
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
                      required={!editingClient}
                    />
                    {editingClient && (
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
                        setShowAddModal(false);
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
                          {editingClient ? 'Updating...' : 'Creating...'}
                        </>
                      ) : editingClient ? (
                        'Update Client'
                      ) : (
                        'Create Client'
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
