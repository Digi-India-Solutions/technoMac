import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/feature/AdminLayout';
import Card from '../../../components/base/Card';
import Button from '../../../components/base/Button';
import { deleteData, getData } from '../../../services/FetchNodeServices';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

// ── APIs used (exactly as defined in backend) ──────────────────
// GET    /contact/all          → getAllContacts  (adminAuth)
// DELETE /contact/delete/:id   → deleteContact   (adminAuth)

export default function EnquiryManagement() {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [filters, setFilters] = useState({ search: '', product: '' });

  // ── GET /contact/all ───────────────────────────────────────
  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const res = await getData('contact/all');
      if (res?.success) {
        setContacts(res.contacts || []);
      } else {
        toast.error(res?.message || 'Failed to fetch enquiries');
      }
    } catch {
      toast.error('Failed to fetch enquiries');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // ── DELETE /contact/delete/:id ─────────────────────────────
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Delete Enquiry?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#dc2626',
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await deleteData(`contact/delete/${id}`, 'DELETE');
      if (res?.success) {
        setContacts((prev) => prev.filter((c) => c._id !== id));
        if (selectedContact?._id === id) setSelectedContact(null);
        toast.success('Enquiry deleted successfully!');
      } else {
        toast.error(res?.message || 'Failed to delete');
      }
    } catch {
      toast.error('Failed to delete enquiry');
    }
  };

  // ── Unique product interests for filter dropdown ───────────────
  const productOptions = [
    ...new Set(contacts.map((c) => c.productInterest).filter(Boolean)),
  ];

  // ── Client-side filter (no extra API call) ─────────────────────
  const displayed = contacts.filter((c) => {
    const q = filters.search.toLowerCase();
    const matchSearch =
      !q ||
      c.fullName?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phoneNumber?.includes(q);
    const matchProduct =
      !filters.product || c.productInterest === filters.product;
    return matchSearch && matchProduct;
  });

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const formatTime = (d) =>
    new Date(d).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
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
              Enquiry Management
            </h1>
            <p className="text-gray-600 mt-1">
              All customer enquiries — {contacts.length} total
            </p>
          </div>
          <Button
            onClick={fetchContacts}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
          >
            <i className="ri-refresh-line"></i>
            <span>Refresh</span>
          </Button>
        </div>

        {/* Stats — purely client-side, no API */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: 'Total Enquiries',
              value: contacts.length,
              icon: 'ri-mail-line',
              color: 'bg-blue-50 text-blue-600',
            },
            {
              label: 'Today',
              value: contacts.filter(
                (c) =>
                  new Date(c.createdAt).toDateString() ===
                  new Date().toDateString(),
              ).length,
              icon: 'ri-calendar-today-line',
              color: 'bg-green-50 text-green-600',
            },
            {
              label: 'This Week',
              value: contacts.filter(
                (c) => Date.now() - new Date(c.createdAt) < 7 * 86400000,
              ).length,
              icon: 'ri-calendar-line',
              color: 'bg-purple-50 text-purple-600',
            },
            {
              label: 'Products Queried',
              value: productOptions.length,
              icon: 'ri-shopping-bag-line',
              color: 'bg-orange-50 text-orange-600',
            },
          ].map((stat) => (
            <Card key={stat.label} className="p-4 flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${stat.color}`}
              >
                <i className={stat.icon}></i>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Filters — client-side only */}
        <Card className="mb-6">
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by name, email or phone..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, search: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Interest
              </label>
              <select
                value={filters.product}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, product: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">All Products</option>
                {productOptions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Table */}
        {!isLoading && (
          <>
            {displayed.length === 0 ? (
              <div className="text-center py-16">
                <i className="ri-mail-open-line text-5xl text-gray-300 mb-4 block"></i>
                <p className="text-gray-500 text-lg font-medium">
                  No enquiries found
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {filters.search || filters.product
                    ? 'Try different filters'
                    : 'No enquiries submitted yet'}
                </p>
              </div>
            ) : (
              <Card>
                <div className="p-4 pb-2">
                  <p className="text-sm text-gray-500">
                    Showing {displayed.length} of {contacts.length} enquiries
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {[
                          '#',
                          'Name',
                          'Phone',
                          'Email',
                          'Product Interest',
                          'Message',
                          'Date',
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
                      {displayed.map((contact, idx) => (
                        <tr
                          key={contact._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          {/* # */}
                          <td className="px-4 py-3 text-sm text-gray-400">
                            {idx + 1}
                          </td>

                          {/* Name */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                                {contact.fullName?.charAt(0)?.toUpperCase() ||
                                  '?'}
                              </div>
                              <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                                {contact.fullName}
                              </span>
                            </div>
                          </td>

                          {/* Phone */}
                          <td className="px-4 py-3">
                            <a
                              href={`tel:${contact.phoneNumber}`}
                              className="text-sm text-gray-700 hover:text-blue-600 flex items-center gap-1 whitespace-nowrap"
                            >
                              <i className="ri-phone-line text-xs"></i>
                              {contact.phoneNumber || '—'}
                            </a>
                          </td>

                          {/* Email */}
                          <td className="px-4 py-3">
                            <a
                              href={`mailto:${contact.email}`}
                              className="text-sm text-gray-700 hover:text-blue-600 flex items-center gap-1"
                            >
                              <i className="ri-mail-line text-xs"></i>
                              {contact.email || '—'}
                            </a>
                          </td>

                          {/* Product Interest */}
                          <td className="px-4 py-3">
                            {contact.productInterest ? (
                              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium whitespace-nowrap">
                                {contact.productInterest}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </td>

                          {/* Message preview */}
                          <td className="px-4 py-3 max-w-[180px]">
                            <p className="text-sm text-gray-500 truncate">
                              {contact.message || '—'}
                            </p>
                          </td>

                          {/* Date */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <p className="text-sm text-gray-700">
                              {formatDate(contact.createdAt)}
                            </p>
                            <p className="text-xs text-gray-400">
                              {formatTime(contact.createdAt)}
                            </p>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setSelectedContact(contact)}
                                className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-medium transition-colors"
                              >
                                <i className="ri-eye-line mr-1"></i>View
                              </button>
                              <button
                                onClick={() => handleDelete(contact._id)}
                                className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-medium transition-colors"
                              >
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </>
        )}

        {/* ── DETAIL MODAL ── */}
        {selectedContact && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedContact(null)}
          >
            <div
              className="bg-white rounded-xl w-full max-w-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                    {selectedContact.fullName?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {selectedContact.fullName}
                    </h2>
                    <p className="text-xs text-gray-400">
                      {formatDate(selectedContact.createdAt)} at{' '}
                      {formatTime(selectedContact.createdAt)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                      <i className="ri-phone-line"></i> Phone
                    </p>
                    <a
                      href={`tel:${selectedContact.phoneNumber}`}
                      className="text-sm font-semibold text-gray-900 hover:text-blue-600"
                    >
                      {selectedContact.phoneNumber || '—'}
                    </a>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                      <i className="ri-mail-line"></i> Email
                    </p>
                    <a
                      href={`mailto:${selectedContact.email}`}
                      className="text-sm font-semibold text-gray-900 hover:text-blue-600 break-all"
                    >
                      {selectedContact.email || '—'}
                    </a>
                  </div>
                </div>

                {selectedContact.productInterest && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-blue-400 mb-1 flex items-center gap-1">
                      <i className="ri-shopping-bag-line"></i> Product Interest
                    </p>
                    <p className="text-sm font-semibold text-blue-800">
                      {selectedContact.productInterest}
                    </p>
                  </div>
                )}

                {selectedContact.message && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                      <i className="ri-message-2-line"></i> Message
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedContact.message}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 pt-0 flex gap-3">
                <a
                  href={`mailto:${selectedContact.email}`}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <i className="ri-mail-send-line"></i> Reply via Email
                </a>
                <a
                  href={`tel:${selectedContact.phoneNumber}`}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <i className="ri-phone-line"></i> Call Now
                </a>
                <button
                  onClick={() => handleDelete(selectedContact._id)}
                  className="px-4 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
