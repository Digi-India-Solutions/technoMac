import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/feature/AdminLayout';
import Card from '../../../components/base/Card';
import Button from '../../../components/base/Button';
import {
  getData,
  postData,
  deleteData,
  serverURL,
} from '../../../services/FetchNodeServices';

export default function CatalogueDownloadsManagement() {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ search: '', catalogueFilter: '' });
  const [selectedDownload, setSelectedDownload] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [catalogues, setCatalogues] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Create form state
  const [createForm, setCreateForm] = useState({
    catalogueId: '',
    customerName: '',
    email: '',
    phoneNumber: '',
    companyName: '',
  });

  // ─── Fetch all catalogues for dropdown ─────────────────────────
  const fetchCatalogues = async () => {
    try {
      const response = await getData('catalogueDownload');
      console.log('Catalogues response:', response);
      if (response && response.success) {
        setCatalogues(response.data || []);
        console.log('response', response);
        console.log('downloads', response.data);
        console.log('filteredDownloads', filteredDownloads);
      } else {
        console.log('Failed to fetch catalogues:', response?.message);
        setCatalogues([]);
      }
    } catch (error) {
      console.error('Error fetching catalogues:', error);
      setCatalogues([]);
    }
  };

  // ─── Fetch all downloads ─────────────────────────────────────────
  const fetchDownloads = async () => {
    setLoading(true);
    try {
      const response = await getData('catalogueDownload');
      console.log('Downloads response:', response);
      if (response && response.success) {
        setDownloads(response.data || []);
      } else {
        console.log('Failed to fetch downloads:', response?.message);
        setDownloads([]);
      }
    } catch (error) {
      console.error('Error fetching downloads:', error);
      setDownloads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDownloads();
    fetchCatalogues();
  }, []);

  // ─── Create new download entry ────────────────────────────────────
  const handleCreateDownload = async () => {
    // Validate required fields
    if (!createForm.catalogueId) {
      alert('Please select a catalogue');
      return;
    }
    if (!createForm.customerName?.trim()) {
      alert('Please enter customer name');
      return;
    }
    if (!createForm.email?.trim()) {
      alert('Please enter email address');
      return;
    }

    setSubmitting(true);
    try {
      const response = await postData('catalogue-download', createForm);
      console.log('Create response:', response);

      if (response && response.success) {
        setShowCreateModal(false);
        setCreateForm({
          catalogueId: '',
          customerName: '',
          email: '',
          phoneNumber: '',
          companyName: '',
        });
        fetchDownloads();
        alert('Download entry created successfully!');
      } else {
        alert(response?.message || 'Error creating download entry');
      }
    } catch (error) {
      console.error('Error creating download:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Filter logic ───────────────────────────────────────────────
  const filteredDownloads = downloads.filter((d) => {
    const matchSearch =
      !filters.search ||
      d.customerName?.toLowerCase().includes(filters.search.toLowerCase()) ||
      d.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
      d.companyName?.toLowerCase().includes(filters.search.toLowerCase()) ||
      d.phoneNumber?.includes(filters.search);

    const matchCatalogue =
      !filters.catalogueFilter ||
      d.catalogueId?._id === filters.catalogueFilter;

    return matchSearch && matchCatalogue;
  });

  // ─── View details ───────────────────────────────────────────────
  const handleViewDetails = (download) => {
    setSelectedDownload(download);
    setShowDetailsModal(true);
  };

  // ─── Delete download ────────────────────────────────────────────
  const handleDelete = async (downloadId) => {
    try {
      const response = await deleteData(`catalogue-download/${downloadId}`);
      if (response && response.success) {
        fetchDownloads();
        if (selectedDownload?._id === downloadId) {
          setShowDetailsModal(false);
          setSelectedDownload(null);
        }
        alert('Download entry deleted successfully!');
      } else {
        alert(response?.message || 'Error deleting download entry');
      }
    } catch (error) {
      console.error('Error deleting download:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    }
  };

  // ─── Download PDF ───────────────────────────────────────────────
  const handleDownloadPDF = (pdfUrl, catalogueName) => {
    if (pdfUrl) {
      const fullUrl = pdfUrl.startsWith('http')
        ? pdfUrl
        : `${serverURL}/${pdfUrl.replace(/^\//, '')}`;
      window.open(fullUrl, '_blank');
    }
  };

  // ─── Stats ──────────────────────────────────────────────────────
  const stats = {
    total: downloads.length,
    today: downloads.filter((d) => {
      const today = new Date().toDateString();
      return new Date(d.createdAt).toDateString() === today;
    }).length,
    thisWeek: downloads.filter((d) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(d.createdAt) >= weekAgo;
    }).length,
  };

  // Get unique catalogues for filter
  const uniqueCatalogues = downloads.reduce((acc, curr) => {
    if (curr.catalogueId && !acc.some((c) => c._id === curr.catalogueId._id)) {
      acc.push(curr.catalogueId);
    }
    return acc;
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        {/* ── Page Header ── */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Catalogue Downloads Management
            </h1>
            <p className="text-gray-600 mt-1">
              Track and manage all catalogue download requests
            </p>
          </div>
          {/* <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <i className="ri-add-line mr-2"></i>
            Add Download Entry
          </Button> */}
        </div>

        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            {
              label: 'Total Downloads',
              value: stats.total,
              color: 'text-blue-600',
              bg: 'bg-blue-50',
              icon: 'ri-download-line',
            },
            {
              label: "Today's Downloads",
              value: stats.today,
              color: 'text-green-600',
              bg: 'bg-green-50',
              icon: 'ri-calendar-todo-line',
            },
            {
              label: 'This Week',
              value: stats.thisWeek,
              color: 'text-purple-600',
              bg: 'bg-purple-50',
              icon: 'ri-calendar-week-line',
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Name, email, company, phone..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catalogue
                </label>
                <div className="relative">
                  <select
                    value={filters.catalogueFilter}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        catalogueFilter: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none"
                  >
                    <option value="">All Catalogues</option>
                    {uniqueCatalogues.map((catalogue) => (
                      <option key={catalogue._id} value={catalogue._id}>
                        {catalogue.title ||
                          catalogue.name ||
                          'Unnamed Catalogue'}
                      </option>
                    ))}
                  </select>
                  <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quick Actions
                </label>
                <Button
                  onClick={() => {
                    setFilters({ search: '', catalogueFilter: '' });
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

        {/* ── Downloads Table ── */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">
                    #
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">
                    Customer Details
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">
                    Catalogue
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">
                    Contact
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">
                    Downloaded On
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400">
                      <i className="ri-loader-4-line animate-spin text-2xl"></i>
                      <p className="mt-2">Loading downloads...</p>
                    </td>
                  </tr>
                ) : filteredDownloads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400">
                      <i className="ri-download-line text-4xl mb-2 block"></i>
                      No download requests found
                    </td>
                  </tr>
                ) : (
                  filteredDownloads.map((download, index) => (
                    <tr
                      key={download._id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">
                            {download.customerName || '—'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {download.email || 'No email'}
                          </p>
                          {download.companyName && (
                            <p className="text-xs text-gray-500">
                              {download.companyName}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          {download.catalogueId?.pdfFile && (
                            <i className="ri-file-pdf-line text-red-500 text-lg"></i>
                          )}
                          <span className="text-gray-800">
                            {download.catalogueId?.title ||
                              download.catalogueId?.name ||
                              'Unknown Catalogue'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-gray-800">
                            {download.phoneNumber || '—'}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        <div>
                          <p className="text-sm">
                            {download.createdAt
                              ? new Date(download.createdAt).toLocaleDateString(
                                  'en-IN',
                                  {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  },
                                )
                              : '—'}
                          </p>
                          <p className="text-xs text-gray-400">
                            {download.createdAt
                              ? new Date(download.createdAt).toLocaleTimeString(
                                  'en-IN',
                                  {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  },
                                )
                              : ''}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewDetails(download)}
                            className="p-1.5 rounded text-blue-600 hover:bg-blue-50 transition-colors"
                            title="View Details"
                          >
                            <i className="ri-eye-line"></i>
                          </button>
                          {download.catalogueId?.pdfFile && (
                            <button
                              onClick={() =>
                                handleDownloadPDF(
                                  download.catalogueId.pdfFile,
                                  download.catalogueId?.title || 'Catalogue',
                                )
                              }
                              className="p-1.5 rounded text-green-600 hover:bg-green-50 transition-colors"
                              title="Download PDF"
                            >
                              <i className="ri-file-pdf-line"></i>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setDeleteTarget(download);
                              setShowDeleteConfirm(true);
                            }}
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
            CREATE DOWNLOAD MODAL
        ════════════════════════════════════════════════════ */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Add Download Entry</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Catalogue Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Catalogue <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={createForm.catalogueId}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            catalogueId: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none"
                      >
                        <option value="">Select a catalogue</option>
                        {catalogues.map((catalogue) => (
                          <option key={catalogue._id} value={catalogue._id}>
                            {catalogue.title ||
                              catalogue.name ||
                              'Unnamed Catalogue'}
                          </option>
                        ))}
                      </select>
                      <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    </div>
                    {catalogues.length === 0 && (
                      <p className="text-xs text-amber-600 mt-1">
                        No catalogues found. Please create catalogues first.
                      </p>
                    )}
                  </div>

                  {/* Customer Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter customer full name"
                      value={createForm.customerName}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          customerName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="customer@example.com"
                      value={createForm.email}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 1234567890"
                      value={createForm.phoneNumber}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          phoneNumber: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Company Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      placeholder="Company name (optional)"
                      value={createForm.companyName}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          companyName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
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
                    onClick={handleCreateDownload}
                    disabled={
                      !createForm.catalogueId ||
                      !createForm.customerName ||
                      !createForm.email ||
                      submitting
                    }
                    className="flex-1 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <i className="ri-loader-4-line animate-spin mr-2"></i>
                        Creating...
                      </>
                    ) : (
                      'Create Entry'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            VIEW DETAILS MODAL
        ════════════════════════════════════════════════════ */}
        {showDetailsModal && selectedDownload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Download Request Details
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                      ID: {selectedDownload._id}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedDownload(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>

                {/* Customer Information */}
                <div className="mb-5">
                  <h3 className="text-sm font-semibold text-gray-700 flex items-center mb-3">
                    <i className="ri-user-line mr-2 text-blue-500"></i>
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-0.5">Full Name</p>
                      <p className="text-sm font-medium text-gray-800">
                        {selectedDownload.customerName || '—'}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-0.5">
                        Email Address
                      </p>
                      <p className="text-sm font-medium text-gray-800">
                        {selectedDownload.email || '—'}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-0.5">
                        Phone Number
                      </p>
                      <p className="text-sm font-medium text-gray-800">
                        {selectedDownload.phoneNumber || '—'}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-0.5">
                        Company Name
                      </p>
                      <p className="text-sm font-medium text-gray-800">
                        {selectedDownload.companyName || '—'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Catalogue Information */}
                <div className="mb-5">
                  <h3 className="text-sm font-semibold text-gray-700 flex items-center mb-3">
                    <i className="ri-file-copy-line mr-2 text-blue-500"></i>
                    Catalogue Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-0.5">
                        Catalogue Title
                      </p>
                      <p className="text-sm font-medium text-gray-800">
                        {selectedDownload.catalogueId?.title ||
                          selectedDownload.catalogueId?.name ||
                          'Unknown Catalogue'}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-0.5">
                        Catalogue ID
                      </p>
                      <p className="text-sm font-mono text-gray-800">
                        {selectedDownload.catalogueId?._id || '—'}
                      </p>
                    </div>
                    {selectedDownload.catalogueId?.description && (
                      <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                        <p className="text-xs text-gray-500 mb-0.5">
                          Description
                        </p>
                        <p className="text-sm text-gray-800">
                          {selectedDownload.catalogueId.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Download Information */}
                <div className="mb-5">
                  <h3 className="text-sm font-semibold text-gray-700 flex items-center mb-3">
                    <i className="ri-download-line mr-2 text-blue-500"></i>
                    Download Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-0.5">
                        Date & Time
                      </p>
                      <p className="text-sm font-medium text-gray-800">
                        {selectedDownload.createdAt
                          ? new Date(selectedDownload.createdAt).toLocaleString(
                              'en-IN',
                              {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              },
                            )
                          : '—'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 mt-4 pt-4 border-t border-gray-200">
                  {selectedDownload.catalogueId?.pdfFile && (
                    <Button
                      onClick={() =>
                        handleDownloadPDF(
                          selectedDownload.catalogueId.pdfFile,
                          selectedDownload.catalogueId?.title || 'Catalogue',
                        )
                      }
                      className="flex-1 bg-green-600 text-white hover:bg-green-700"
                    >
                      <i className="ri-file-pdf-line mr-2"></i>
                      Download PDF Again
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      setDeleteTarget(selectedDownload);
                      setShowDetailsModal(false);
                      setShowDeleteConfirm(true);
                    }}
                    className="bg-red-100 text-red-600 hover:bg-red-200 px-4"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </Button>
                  <Button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedDownload(null);
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

        {/* ════════════════════════════════════════════════════
            DELETE CONFIRMATION MODAL
        ════════════════════════════════════════════════════ */}
        {showDeleteConfirm && deleteTarget && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-sm w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Confirm Delete</h2>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteTarget(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <div className="text-center py-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-delete-bin-line text-2xl text-red-600"></i>
                </div>
                <p className="text-gray-700 mb-2">
                  Are you sure you want to delete this download request?
                </p>
                <p className="text-sm text-gray-500">
                  Customer:{' '}
                  <strong>{deleteTarget.customerName || 'Unknown'}</strong>
                  <br />
                  Catalogue:{' '}
                  <strong>
                    {deleteTarget.catalogueId?.title ||
                      deleteTarget.catalogueId?.name ||
                      'Unknown'}
                  </strong>
                </p>
                <p className="text-xs text-red-500 mt-3">
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteTarget(null);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleDelete(deleteTarget._id)}
                  className="flex-1 bg-red-600 text-white hover:bg-red-700"
                >
                  <i className="ri-delete-bin-line mr-2"></i>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
