import { useEffect, useState } from 'react';
import AdminLayout from '../../../../components/feature/AdminLayout';
import Card from '../../../../components/base/Card';
import Button from '../../../../components/base/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { getData, deleteData } from '../../../../services/FetchNodeServices';

const ITEMS_PER_PAGE = 12;

export default function SubscribersManagement() {
  const [subscribers, setSubscribers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');

  // ─── Filtered list ────────────────────────────────────────────────────────
  const filtered = subscribers.filter((s) =>
    s.email?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // ─── Fetch subscribers ────────────────────────────────────────────────────
  const fetchSubscribers = async () => {
    try {
      setIsLoading(true);
      const response = await getData('subscribe');
      if (response?.success) {
        setSubscribers(response.data || []);
        setCurrentPage(1);
      } else {
        toast.error(response?.message || 'Failed to load subscribers');
      }
    } catch (error) {
      toast.error('Failed to load subscribers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  // ─── Delete subscriber ────────────────────────────────────────────────────
  const handleDelete = async (id, email) => {
    const result = await Swal.fire({
      title: 'Remove Subscriber?',
      text: `"${email}" will be removed from the newsletter list.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, remove it',
    });
    if (!result.isConfirmed) return;

    try {
      const response = await deleteData(`subscribe/${id}`);
      if (response?.success) {
        toast.success('Subscriber removed');
        fetchSubscribers();
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
    total: subscribers.length,
    today: subscribers.filter((s) => {
      return new Date(s.createdAt).toDateString() === new Date().toDateString();
    }).length,
    thisWeek: subscribers.filter((s) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(s.createdAt) >= weekAgo;
    }).length,
  };

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="p-6">
        {/* ── Header ── */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Subscriber Management
            </h1>
            <p className="text-gray-600 mt-1">
              View and manage newsletter subscribers
            </p>
          </div>
          <Button
            onClick={fetchSubscribers}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
          >
            <i className="ri-refresh-line mr-1"></i>
            Refresh
          </Button>
        </div>

        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            {
              label: 'Total Subscribers',
              value: stats.total,
              color: 'text-blue-600',
              bg: 'bg-blue-50',
              icon: 'ri-mail-line',
            },
            {
              label: "Today's Subscribers",
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

        {/* ── Search Filter ── */}
        <Card className="mb-6">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search by email..."
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
                  Quick Actions
                </label>
                <Button
                  onClick={() => {
                    setSearch('');
                    setCurrentPage(1);
                  }}
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 w-full"
                >
                  <i className="ri-refresh-line mr-2"></i>
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* ── Loading ── */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <i className="ri-loader-4-line animate-spin text-3xl text-blue-600"></i>
            <p className="text-gray-500 ml-3">Loading subscribers...</p>
          </div>
        )}

        {/* ── Empty state ── */}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <i className="ri-mail-line text-5xl mb-3 block"></i>
            <p className="text-lg">
              {search
                ? 'No subscribers match your search'
                : 'No subscribers yet'}
            </p>
          </div>
        )}

        {/* ── Table ── */}
        {!isLoading && filtered.length > 0 && (
          <>
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">
                        #
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">
                        Email Address
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">
                        Subscribed On
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((subscriber, index) => (
                      <tr
                        key={subscriber._id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-gray-500">
                          {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <i className="ri-mail-line text-blue-600 text-sm"></i>
                            </div>
                            <span className="font-medium text-gray-900">
                              {subscriber.email}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          <div>
                            <p className="text-sm">
                              {subscriber.createdAt
                                ? new Date(
                                    subscriber.createdAt,
                                  ).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })
                                : '—'}
                            </p>
                            <p className="text-xs text-gray-400">
                              {subscriber.createdAt
                                ? new Date(
                                    subscriber.createdAt,
                                  ).toLocaleTimeString('en-IN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                : ''}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() =>
                              handleDelete(subscriber._id, subscriber.email)
                            }
                            className="p-1.5 rounded text-red-500 hover:bg-red-50 transition-colors"
                            title="Remove Subscriber"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div className="mt-6 flex flex-col items-center gap-3">
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
                  subscribers
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
      </div>
    </AdminLayout>
  );
}


