import { useEffect, useState } from 'react';
import AdminLayout from '../../../../components/feature/AdminLayout';
import Card from '../../../../components/base/Card';
import Button from '../../../../components/base/Button';
import {
  getData,
  postData,
  patchData,
  deleteData,
  serverURL,
  getToken,
} from '../../../../services/FetchNodeServices';
import axios from 'axios';

const STATUS_COLORS = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Approved: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
};

const STATUS_OPTIONS = ['Pending', 'Approved', 'Rejected'];

export default function WarrantiesManagement() {
  const [warranties, setWarranties] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({ search: '', status: '' });
  const [selectedWarranty, setSelectedWarranty] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusTarget, setStatusTarget] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const [createForm, setCreateForm] = useState({
    email: '',
    customerName: '',
    customerContact: '',
    clinicName: '',
    clinicAddress: '',
    purchaseDate: '',
    productModel: '',
    serialNumber: '',
    dealerName: '',
    dealerCompany: '',
    dealerContact: '',
    dealerAddress: '',
    productImage: null,
  });

  const [checkSerial, setCheckSerial] = useState('');
  const [checkResult, setCheckResult] = useState(null);
  const [checkLoading, setCheckLoading] = useState(false);

  // ─── Fetch all warranties ───────────────────────────────────────
  const fetchWarranties = async () => {
    setLoading(true);
    try {
      const response = await getData('warranty');
      if (response.success) {
        setWarranties(response.data);
      }
    } catch (error) {
      console.error('Error fetching warranties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarranties();
  }, []);

  // ─── Filter logic ───────────────────────────────────────────────
  const filteredWarranties = warranties.filter((w) => {
    const matchSearch =
      !filters.search ||
      w.customerName?.toLowerCase().includes(filters.search.toLowerCase()) ||
      w.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
      w.serialNumber?.toLowerCase().includes(filters.search.toLowerCase()) ||
      w.productModel?.toLowerCase().includes(filters.search.toLowerCase());

    const matchStatus = !filters.status || w.status === filters.status;

    return matchSearch && matchStatus;
  });

  // ─── View details ───────────────────────────────────────────────
  const handleViewDetails = (warranty) => {
    setSelectedWarranty(warranty);
    setShowDetailsModal(true);
  };

  // ─── Create warranty ────────────────────────────────────────────
  const handleCreateWarranty = async () => {
    try {
      const formData = new FormData();
      Object.entries(createForm).forEach(([key, value]) => {
        if (value !== null && value !== '' && value !== undefined) {
          formData.append(key, value);
        }
      });

      const response = await axios.post(
        `${serverURL}/warranty/register`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      const data = response.data;

      if (data.success) {
        setShowCreateModal(false);
        setCreateForm({
          email: '',
          customerName: '',
          customerContact: '',
          clinicName: '',
          clinicAddress: '',
          purchaseDate: '',
          productModel: '',
          serialNumber: '',
          dealerName: '',
          dealerCompany: '',
          dealerContact: '',
          dealerAddress: '',
          productImage: null,
        });
        fetchWarranties();
      } else {
        alert(data.message || 'Error creating warranty');
      }
    } catch (error) {
      console.error('Error creating warranty:', error);
      alert(`Error: ${error.message}. Check console for details.`);
    }
  };

  // ─── Update status ──────────────────────────────────────────────
  const openStatusModal = (warranty) => {
    setStatusTarget(warranty);
    setNewStatus(warranty.status || 'Pending');
    setShowStatusModal(true);
  };

  const handleUpdateStatus = async () => {
    try {
      const response = await axios.put(
        `${serverURL}/warranty/${statusTarget._id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${getToken()}` } },
      );
      if (response.data.success) {
        setShowStatusModal(false);
        setStatusTarget(null);
        fetchWarranties();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // ─── Delete warranty ────────────────────────────────────────────
  const handleDelete = async (warrantyId) => {
    if (!confirm('Are you sure you want to delete this warranty?')) return;
    try {
      const response = await deleteData(`warranty/${warrantyId}`);
      if (response.success) {
        fetchWarranties();
        if (selectedWarranty?._id === warrantyId) {
          setShowDetailsModal(false);
          setSelectedWarranty(null);
        }
      }
    } catch (error) {
      console.error('Error deleting warranty:', error);
    }
  };

  // ─── Check by serial number ─────────────────────────────────────
  const handleCheckSerial = async () => {
    if (!checkSerial.trim()) return;
    setCheckLoading(true);
    setCheckResult(null);
    try {
      const response = await getData(`warranty/check/${checkSerial.trim()}`);
      if (response && response.success) {
        setCheckResult({ success: true, data: response.data });
      } else {
        setCheckResult({
          success: false,
          message: 'No warranty found for this serial number.',
        });
      }
    } catch (error) {
      setCheckResult({
        success: false,
        message: 'No warranty found for this serial number.',
      });
    } finally {
      setCheckLoading(false);
    }
  };

  // ─── Stats ──────────────────────────────────────────────────────
  const stats = {
    total: warranties.length,
    pending: warranties.filter((w) => w.status === 'Pending').length,
    approved: warranties.filter((w) => w.status === 'Approved').length,
    rejected: warranties.filter((w) => w.status === 'Rejected').length,
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* ── Page Header ── */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Warranty Management
            </h1>
            <p className="text-gray-600 mt-1">
              Register and manage product warranties
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <i className="ri-add-line mr-2"></i>
            Register Warranty
          </Button>
        </div>

        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: 'Total',
              value: stats.total,
              color: 'text-blue-600',
              bg: 'bg-blue-50',
              icon: 'ri-shield-line',
            },
            {
              label: 'Pending',
              value: stats.pending,
              color: 'text-yellow-600',
              bg: 'bg-yellow-50',
              icon: 'ri-time-line',
            },
            {
              label: 'Approved',
              value: stats.approved,
              color: 'text-green-600',
              bg: 'bg-green-50',
              icon: 'ri-checkbox-circle-line',
            },
            {
              label: 'Rejected',
              value: stats.rejected,
              color: 'text-red-600',
              bg: 'bg-red-50',
              icon: 'ri-close-circle-line',
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

        {/* ── Serial Number Check ── */}
        <Card className="mb-6 p-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            <i className="ri-search-eye-line mr-1"></i> Check Warranty by Serial
            Number
          </p>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter serial number..."
              value={checkSerial}
              onChange={(e) => setCheckSerial(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCheckSerial()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <Button
              onClick={handleCheckSerial}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {checkLoading ? (
                <i className="ri-loader-4-line animate-spin"></i>
              ) : (
                'Check'
              )}
            </Button>
          </div>
          {checkResult && (
            <div
              className={`mt-3 p-3 rounded-lg text-sm ${checkResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
            >
              {checkResult.success ? (
                <div>
                  <p className="font-semibold text-green-800">
                    ✓ Warranty Found
                  </p>
                  <p className="text-gray-700 mt-1">
                    Customer: <strong>{checkResult.data.customerName}</strong>{' '}
                    &nbsp;|&nbsp; Model:{' '}
                    <strong>{checkResult.data.productModel}</strong>{' '}
                    &nbsp;|&nbsp; Status:{' '}
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[checkResult.data.status] || 'bg-gray-100 text-gray-700'}`}
                    >
                      {checkResult.data.status}
                    </span>
                  </p>
                </div>
              ) : (
                <p className="text-red-700">✗ {checkResult.message}</p>
              )}
            </div>
          )}
        </Card>

        {/* ── Filters ── */}
        <Card className="mb-6">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Name, email, serial, model..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <div className="relative">
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none"
                  >
                    <option value="">All Statuses</option>
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* ── Warranty Table ── */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">
                    #
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">
                    Customer
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">
                    Product
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">
                    Serial No.
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">
                    Purchase Date
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">
                    Dealer
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-400">
                      <i className="ri-loader-4-line animate-spin text-2xl"></i>
                      <p className="mt-2">Loading warranties...</p>
                    </td>
                  </tr>
                ) : filteredWarranties.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-400">
                      <i className="ri-shield-line text-4xl mb-2 block"></i>
                      No warranties found
                    </td>
                  </tr>
                ) : (
                  filteredWarranties.map((warranty, index) => (
                    <tr
                      key={warranty._id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">
                            {warranty.customerName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {warranty.email}
                          </p>
                          <p className="text-xs text-gray-500">
                            {warranty.customerContact}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          {warranty.productImage && (
                            <img
                              src={warranty.productImage}
                              alt={warranty.productModel}
                              className="w-10 h-10 object-cover rounded"
                            />
                          )}
                          <span className="font-medium text-gray-800">
                            {warranty.productModel}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                          {warranty.serialNumber}
                        </code>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {warranty.purchaseDate
                          ? new Date(warranty.purchaseDate).toLocaleDateString(
                              'en-IN',
                            )
                          : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-800">{warranty.dealerName}</p>
                        <p className="text-xs text-gray-500">
                          {warranty.dealerCompany}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[warranty.status] || 'bg-gray-100 text-gray-700'}`}
                        >
                          {warranty.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewDetails(warranty)}
                            className="p-1.5 rounded text-blue-600 hover:bg-blue-50 transition-colors"
                            title="View Details"
                          >
                            <i className="ri-eye-line"></i>
                          </button>
                          <button
                            onClick={() => openStatusModal(warranty)}
                            className="p-1.5 rounded text-yellow-600 hover:bg-yellow-50 transition-colors"
                            title="Update Status"
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(warranty._id)}
                            className="p-1.5 rounded text-red-500 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* ════════════════════════════════════════════════════
            CREATE WARRANTY MODAL
        ════════════════════════════════════════════════════ */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">
                    Register New Warranty
                  </h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>

                <div className="space-y-5">
                  {/* Customer Info */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3 border-b pb-1">
                      Customer Information
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          label: 'Customer Name',
                          key: 'customerName',
                          placeholder: 'Full name',
                          required: true,
                        },
                        {
                          label: 'Email',
                          key: 'email',
                          placeholder: 'Email address',
                          type: 'email',
                          required: true,
                        },
                        {
                          label: 'Contact Number',
                          key: 'customerContact',
                          placeholder: 'Phone number',
                        },
                        {
                          label: 'Clinic Name',
                          key: 'clinicName',
                          placeholder: 'Clinic / Hospital name',
                        },
                      ].map(
                        ({
                          label,
                          key,
                          placeholder,
                          type = 'text',
                          required,
                        }) => (
                          <div key={key}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {label}{' '}
                              {required && (
                                <span className="text-red-500">*</span>
                              )}
                            </label>
                            <input
                              type={type}
                              placeholder={placeholder}
                              value={createForm[key]}
                              onChange={(e) =>
                                setCreateForm({
                                  ...createForm,
                                  [key]: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                          </div>
                        ),
                      )}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Clinic Address
                        </label>
                        <textarea
                          placeholder="Full clinic address"
                          value={createForm.clinicAddress}
                          onChange={(e) =>
                            setCreateForm({
                              ...createForm,
                              clinicAddress: e.target.value,
                            })
                          }
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3 border-b pb-1">
                      Product Information
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          label: 'Product Model',
                          key: 'productModel',
                          placeholder: 'Model name',
                          required: true,
                        },
                        {
                          label: 'Serial Number',
                          key: 'serialNumber',
                          placeholder: 'Unique serial number',
                          required: true,
                        },
                        {
                          label: 'Purchase Date',
                          key: 'purchaseDate',
                          type: 'date',
                        },
                      ].map(
                        ({
                          label,
                          key,
                          placeholder,
                          type = 'text',
                          required,
                        }) => (
                          <div key={key}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {label}{' '}
                              {required && (
                                <span className="text-red-500">*</span>
                              )}
                            </label>
                            <input
                              type={type}
                              placeholder={placeholder}
                              value={createForm[key]}
                              onChange={(e) =>
                                setCreateForm({
                                  ...createForm,
                                  [key]: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                          </div>
                        ),
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Product Image
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setCreateForm({
                              ...createForm,
                              productImage: e.target.files[0],
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dealer Info */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3 border-b pb-1">
                      Dealer Information
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          label: 'Dealer Name',
                          key: 'dealerName',
                          placeholder: 'Dealer full name',
                        },
                        {
                          label: 'Dealer Company',
                          key: 'dealerCompany',
                          placeholder: 'Company / Shop name',
                        },
                        {
                          label: 'Dealer Contact',
                          key: 'dealerContact',
                          placeholder: 'Phone number',
                        },
                      ].map(({ label, key, placeholder }) => (
                        <div key={key}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {label}
                          </label>
                          <input
                            type="text"
                            placeholder={placeholder}
                            value={createForm[key]}
                            onChange={(e) =>
                              setCreateForm({
                                ...createForm,
                                [key]: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </div>
                      ))}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dealer Address
                        </label>
                        <textarea
                          placeholder="Full dealer address"
                          value={createForm.dealerAddress}
                          onChange={(e) =>
                            setCreateForm({
                              ...createForm,
                              dealerAddress: e.target.value,
                            })
                          }
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <Button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateWarranty}
                    disabled={
                      !createForm.customerName ||
                      !createForm.email ||
                      !createForm.productModel ||
                      !createForm.serialNumber
                    }
                    className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Register Warranty
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            UPDATE STATUS MODAL
        ════════════════════════════════════════════════════ */}
        {showStatusModal && statusTarget && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-sm w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  Update Warranty Status
                </h2>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Customer: <strong>{statusTarget.customerName}</strong>
                <br />
                Serial:{' '}
                <code className="bg-gray-100 px-1 rounded">
                  {statusTarget.serialNumber}
                </code>
              </p>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Status
                </label>
                <div className="flex space-x-2">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setNewStatus(s)}
                      className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        newStatus === s
                          ? s === 'Approved'
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : s === 'Rejected'
                              ? 'border-red-500 bg-red-50 text-red-700'
                              : 'border-yellow-500 bg-yellow-50 text-yellow-700'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateStatus}
                  className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                >
                  Update Status
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            VIEW DETAILS MODAL
        ════════════════════════════════════════════════════ */}
        {showDetailsModal && selectedWarranty && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">Warranty Details</h2>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${STATUS_COLORS[selectedWarranty.status] || 'bg-gray-100 text-gray-700'}`}
                    >
                      {selectedWarranty.status || 'Pending'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedWarranty(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>

                {selectedWarranty.productImage && (
                  <div className="mb-5">
                    <img
                      src={selectedWarranty.productImage}
                      alt="Product"
                      className="w-full max-h-52 object-contain rounded-lg border border-gray-200"
                    />
                  </div>
                )}

                {[
                  {
                    title: 'Customer Information',
                    icon: 'ri-user-line',
                    fields: [
                      { label: 'Name', value: selectedWarranty.customerName },
                      { label: 'Email', value: selectedWarranty.email },
                      {
                        label: 'Contact',
                        value: selectedWarranty.customerContact,
                      },
                      { label: 'Clinic', value: selectedWarranty.clinicName },
                      {
                        label: 'Address',
                        value: selectedWarranty.clinicAddress,
                        full: true,
                      },
                    ],
                  },
                  {
                    title: 'Product Information',
                    icon: 'ri-shield-line',
                    fields: [
                      { label: 'Model', value: selectedWarranty.productModel },
                      {
                        label: 'Serial Number',
                        value: selectedWarranty.serialNumber,
                        mono: true,
                      },
                      {
                        label: 'Purchase Date',
                        value: selectedWarranty.purchaseDate
                          ? new Date(
                              selectedWarranty.purchaseDate,
                            ).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })
                          : '—',
                      },
                      {
                        label: 'Registered On',
                        value: selectedWarranty.createdAt
                          ? new Date(
                              selectedWarranty.createdAt,
                            ).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })
                          : '—',
                      },
                    ],
                  },
                  {
                    title: 'Dealer Information',
                    icon: 'ri-store-line',
                    fields: [
                      { label: 'Name', value: selectedWarranty.dealerName },
                      {
                        label: 'Company',
                        value: selectedWarranty.dealerCompany,
                      },
                      {
                        label: 'Contact',
                        value: selectedWarranty.dealerContact,
                      },
                      {
                        label: 'Address',
                        value: selectedWarranty.dealerAddress,
                        full: true,
                      },
                    ],
                  },
                ].map((section) => (
                  <div key={section.title} className="mb-5">
                    <h3 className="text-sm font-semibold text-gray-700 flex items-center mb-3">
                      <i className={`${section.icon} mr-2 text-blue-500`}></i>
                      {section.title}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {section.fields.map(({ label, value, full, mono }) => (
                        <div
                          key={label}
                          className={`bg-gray-50 p-3 rounded-lg ${full ? 'col-span-2' : ''}`}
                        >
                          <p className="text-xs text-gray-500 mb-0.5">
                            {label}
                          </p>
                          <p
                            className={`text-sm font-medium text-gray-800 ${mono ? 'font-mono' : ''}`}
                          >
                            {value || '—'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex space-x-3 mt-4">
                  {/* <Button
                    onClick={() => openStatusModal(selectedWarranty)}
                    className="flex-1 bg-yellow-500 text-white hover:bg-yellow-600"
                  >
                    <i className="ri-edit-line mr-2"></i>
                    Update Status
                  </Button> */}
                  <Button
                    onClick={() => handleDelete(selectedWarranty._id)}
                    className="bg-red-100 text-red-600 hover:bg-red-200 px-4"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </Button>
                  <Button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedWarranty(null);
                    }}
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
