import { useState, useEffect } from 'react';
import AdminLayout from '../../../../components/feature/AdminLayout';
import Card from '../../../../components/base/Card';
import Button from '../../../../components/base/Button';
import { deleteData, getData, postData } from '../../../../services/FetchNodeServices';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import { serverURL, getToken } from '../../../../services/FetchNodeServices';

const ITEMS_PER_PAGE = 10;

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Chandigarh", "Puducherry",
];

const TIME_SLOTS = [
  "09:00 AM – 10:00 AM", "10:00 AM – 11:00 AM", "11:00 AM – 12:00 PM",
  "12:00 PM – 01:00 PM", "02:00 PM – 03:00 PM", "03:00 PM – 04:00 PM",
  "04:00 PM – 05:00 PM", "05:00 PM – 06:00 PM",
];

export default function CallbackManagement() {
  const [callbacks, setCallbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCallback, setEditingCallback] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCallback, setSelectedCallback] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    country: 'IN - India',
    state: '',
    mobileNumber: '',
    email: '',
    date: '',
    time: '',
    description: '',
    status: 'pending',
  });

  const [filters, setFilters] = useState({
    status: '',
    search: '',
  });

  const [currentPage, setCurrentPage] = useState(1);

  // ── Custom GET Axios Helper ──
  const getJsonData = async (url) => {
    try {
      const response = await axios.get(`${serverURL}/${url}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  // ── Custom PUT Axios Helper ──
  const putJsonData = async (url, body) => {
    try {
      const response = await axios.put(`${serverURL}/${url}`, body, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  // ── Custom PATCH Axios Helper ──
  const patchJsonData = async (url, body) => {
    try {
      const response = await axios.patch(`${serverURL}/${url}`, body, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  // ── Fetch Callbacks ──
  const fetchCallbacks = async () => {
    setIsLoading(true);
    try {
      const res = await getJsonData('callback');
      if (res && res.success) {
        setCallbacks(res.data || []);
      } else {
        toast.error(res?.message || 'Failed to fetch callbacks');
      }
    } catch (error) {
      toast.error('Failed to fetch callbacks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCallbacks();
  }, []);

  // ── Handlers ──
  const handleAdd = () => {
    setEditingCallback(null);
    setFormData({
      name: '',
      country: 'IN - India',
      state: '',
      mobileNumber: '',
      email: '',
      date: '',
      time: '',
      description: '',
      status: 'pending',
    });
    setShowModal(true);
  };

  const handleEdit = (callback) => {
    setEditingCallback(callback);
    setFormData({
      name: callback.name || '',
      country: callback.country || 'IN - India',
      state: callback.state || '',
      mobileNumber: callback.mobileNumber || '',
      email: callback.email || '',
      date: callback.date || '',
      time: callback.time || '',
      description: callback.description || '',
      status: callback.status || 'pending',
    });
    setShowModal(true);
  };

  const handleView = (callback) => {
    setSelectedCallback(callback);
    setShowViewModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.state || !formData.mobileNumber || !formData.email || !formData.date || !formData.time) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsLoading(true);
    try {
      let res;
      if (editingCallback) {
        res = await putJsonData(`callback/${editingCallback._id}`, formData);
      } else {
        res = await postData('callback', formData);
      }

      if (res && res.success) {
        toast.success(
          editingCallback ? 'Callback request updated successfully' : 'Callback request created successfully'
        );
        setShowModal(false);
        fetchCallbacks();
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await patchJsonData(`callback/${id}/status`, { status: newStatus });
      if (res && res.success) {
        toast.success(`Status updated to ${newStatus}`);
        fetchCallbacks();
      } else {
        toast.error(res?.message || 'Failed to update status');
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        const res = await deleteData(`callback/${id}`);
        if (res && res.success) {
          toast.success('Callback request deleted successfully');
          fetchCallbacks();
        } else {
          toast.error(res?.message || 'Failed to delete callback request');
        }
      } catch (error) {
        Swal.fire('Error!', 'Something went wrong.', 'error');
      }
    }
  };

  // ── Filtering & Pagination ──
  const filteredCallbacks = callbacks.filter((item) => {
    const matchesSearch =
      item.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.mobileNumber?.includes(filters.search) ||
      item.state?.toLowerCase().includes(filters.search.toLowerCase());

    const matchesStatus = filters.status === '' || item.status === filters.status;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCallbacks.length / ITEMS_PER_PAGE);
  const paginatedCallbacks = filteredCallbacks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'contacted':
        return 'bg-blue-100 text-blue-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: callbacks.length,
    pending: callbacks.filter((c) => c.status === 'pending').length,
    contacted: callbacks.filter((c) => c.status === 'contacted').length,
    closed: callbacks.filter((c) => c.status === 'closed').length,
  };

  return (
    <AdminLayout>
      <ToastContainer />
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Callback List</h1>
            <p className="text-gray-600 mt-1">Manage user callback schedule requests and track follow-ups</p>
          </div>
          <Button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
          >
            <i className="ri-add-line"></i> Add Callback
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="p-6 bg-white border border-gray-100 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-50">
                <i className="ri-phone-line text-xl text-indigo-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-950">{stats.total}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-white border border-gray-100 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-50">
                <i className="ri-time-line text-xl text-yellow-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-white border border-gray-100 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-50">
                <i className="ri-user-follow-line text-xl text-blue-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Contacted</p>
                <p className="text-2xl font-bold text-blue-600">{stats.contacted}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-white border border-gray-100 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-50">
                <i className="ri-checkbox-circle-line text-xl text-green-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Closed</p>
                <p className="text-2xl font-bold text-green-600">{stats.closed}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 bg-white border border-gray-100 shadow-sm">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <input
                  type="text"
                  placeholder="Search by Name, Email, Mobile or State..."
                  value={filters.search}
                  onChange={(e) => {
                    setFilters({ ...filters, search: e.target.value });
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div className="relative">
                  <select
                    value={filters.status}
                    onChange={(e) => {
                      setFilters({ ...filters, status: e.target.value });
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none"
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                  </select>
                  <i className="ri-arrow-down-s-line absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Table / List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <Card className="bg-white border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">#</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">User Details</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Schedule Date/Time</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Location</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCallbacks.map((item, index) => (
                      <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-gray-500">
                          {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">{item.name}</span>
                            <span className="text-xs text-gray-500">{item.email}</span>
                            <span className="text-xs text-gray-500 font-mono">{item.mobileNumber}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-800">{item.date}</span>
                            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded mt-0.5 w-max font-semibold">{item.time}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{item.state}</span>
                            <span className="text-xs text-gray-400">{item.country}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="relative inline-block w-32">
                            <select
                              value={item.status}
                              onChange={(e) => handleStatusChange(item._id, e.target.value)}
                              className={`w-full px-2.5 py-1 text-xs font-semibold rounded-full border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none ${getStatusColor(item.status)}`}
                            >
                              <option value="pending" className="bg-white text-gray-950">Pending</option>
                              <option value="contacted" className="bg-white text-gray-950">Contacted</option>
                              <option value="closed" className="bg-white text-gray-950">Closed</option>
                            </select>
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-xs">
                              <i className="ri-arrow-down-s-line"></i>
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => handleView(item)}
                              className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-2 py-1 text-xs"
                              title="View Details"
                            >
                              <i className="ri-eye-line text-sm"></i>
                            </Button>
                            <Button
                              onClick={() => handleEdit(item)}
                              className="bg-blue-100 text-blue-600 hover:bg-blue-200 px-2 py-1 text-xs"
                              title="Edit Callback"
                            >
                              <i className="ri-edit-line text-sm"></i>
                            </Button>
                            <Button
                              onClick={() => handleDelete(item._id)}
                              className="bg-red-100 text-red-600 hover:bg-red-200 px-2 py-1 text-xs"
                              title="Delete Request"
                            >
                              <i className="ri-delete-bin-line text-sm"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {filteredCallbacks.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-100 mt-4">
                <i className="ri-phone-line text-4xl text-gray-300 mb-4 block"></i>
                <p className="text-gray-500">No callbacks found matching your criteria</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex flex-col items-center gap-3">
                <p className="text-sm text-gray-500">
                  Showing{' '}
                  <span className="font-medium text-gray-700">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredCallbacks.length)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium text-gray-700">{filteredCallbacks.length}</span> callbacks
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => p - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg border text-sm font-medium hover:bg-gray-150 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'hover:bg-gray-150'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg border text-sm font-medium hover:bg-gray-150 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* View Modal */}
        {showViewModal && selectedCallback && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full overflow-hidden shadow-xl border border-gray-100">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-bold text-lg text-gray-900">Callback Details</h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block uppercase">Client Name</label>
                    <span className="text-sm font-medium text-gray-900 block mt-0.5">{selectedCallback.name}</span>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block uppercase">Status</label>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold mt-1 uppercase ${getStatusColor(selectedCallback.status)}`}>
                      {selectedCallback.status}
                    </span>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block uppercase">Mobile Number</label>
                    <span className="text-sm font-medium text-gray-900 block mt-0.5 font-mono">{selectedCallback.mobileNumber}</span>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block uppercase">Email Address</label>
                    <span className="text-sm font-medium text-gray-900 block mt-0.5">{selectedCallback.email}</span>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block uppercase">Date Scheduled</label>
                    <span className="text-sm font-medium text-gray-900 block mt-0.5">{selectedCallback.date}</span>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block uppercase">Time Slot</label>
                    <span className="text-sm font-medium text-gray-900 block mt-0.5">{selectedCallback.time}</span>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-gray-500 block uppercase">State / Country</label>
                    <span className="text-sm font-medium text-gray-900 block mt-0.5">{selectedCallback.state}, {selectedCallback.country}</span>
                  </div>
                  <div className="col-span-2 border-t pt-3">
                    <label className="text-xs font-semibold text-gray-500 block uppercase">Description / Message</label>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border mt-1 whitespace-pre-wrap min-h-24">
                      {selectedCallback.description || 'No message provided.'}
                    </p>
                  </div>
                  <div className="col-span-2 text-xs text-gray-400">
                    Created at: {new Date(selectedCallback.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-end">
                <Button
                  onClick={() => setShowViewModal(false)}
                  className="bg-blue-600 text-white hover:bg-blue-700 text-xs px-4"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Create / Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingCallback ? 'Edit Callback Request' : 'Add Callback Request'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingCallback(null);
                    }}
                    className="text-gray-500 hover:text-gray-800 w-6 h-6 flex items-center justify-center"
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>

                <form onSubmit={handleSave}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Client Name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Email Address"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                        <input
                          type="text"
                          value={formData.mobileNumber}
                          onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="10-digit number"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                        <input
                          type="text"
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Country"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                        <div className="relative">
                          <select
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none"
                            required
                          >
                            <option value="">Select State</option>
                            {INDIAN_STATES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <i className="ri-arrow-down-s-line absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <div className="relative">
                          <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="contacted">Contacted</option>
                            <option value="closed">Closed</option>
                          </select>
                          <i className="ri-arrow-down-s-line absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot *</label>
                        <div className="relative">
                          <select
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none"
                            required
                          >
                            <option value="">Select Time Slot</option>
                            {TIME_SLOTS.map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                          <i className="ri-arrow-down-s-line absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description / Notes</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                        placeholder="Additional details..."
                      />
                    </div>
                    <div className="flex space-x-3 pt-4 border-t mt-4">
                      <Button
                        type="button"
                        onClick={() => {
                          setShowModal(false);
                          setEditingCallback(null);
                        }}
                        className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white hover:bg-blue-700 animate-pulse-once"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Saving...' : editingCallback ? 'Update Callback' : 'Add Callback'}
                      </Button>
                    </div>
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
