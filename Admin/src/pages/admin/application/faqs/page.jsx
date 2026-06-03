import { useState, useEffect } from 'react';
import AdminLayout from '../../../../components/feature/AdminLayout';
import Card from '../../../../components/base/Card';
import Button from '../../../../components/base/Button';
import { deleteData, getData, patchData, postData, updateFaq } from '../../../../services/FetchNodeServices';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

export default function FAQsManagement() {
  const [faqs, setFaqs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    isActive: true,
  });
  const [filters, setFilters] = useState({
    isActive: '',
    search: '',
  });

  // ── FETCH ALL FAQs (Admin) ──────────────────────────────────
  const fetchFaqs = async () => {
    setIsLoading(true);
    try {
      const res = await getData('faq/admin/all'); // ✅ Fixed: admin wala endpoint
      if (res.success) {
        setFaqs(res.data || []); // ✅ Fixed: res.faqs → res.data
      } else {
        toast.error(res.message || 'Failed to fetch FAQs');
      }
    } catch (error) {
      toast.error('Failed to fetch FAQs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  // ── ADD ────────────────────────────────────────────────────
  const handleAdd = () => {
    setEditingFaq(null);
    setFormData({ question: '', answer: '', isActive: true });
    setShowModal(true);
  };

  // ── EDIT ───────────────────────────────────────────────────
  const handleEdit = (faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question || '',
      answer: faq.answer || '',
      isActive: faq.isActive ?? true,
    });
    setShowModal(true);
  };

  // ── SAVE (Create / Update) ─────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.question || !formData.answer) {
      toast.error('Please fill all required fields');
      return;
    }
    setIsLoading(true);
    try {
      let res;
      if (editingFaq) {
        res = await updateFaq(`faq/${editingFaq._id}`, {
          ...formData,
          isActive:
            formData.isActive === 'false' ? false : Boolean(formData.isActive),
          // ✅ select se string aata hai, convert karo
        });
      } else {
        res = await postData('faq', formData);
      }

      if (res.success) {
        toast.success(
          editingFaq ? 'FAQ updated successfully' : 'FAQ created successfully',
        );
        setShowModal(false);
        fetchFaqs();
      } else {
        toast.error(res.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // ── TOGGLE STATUS ──────────────────────────────────────────
  const toggleStatus = async (id, currentStatus) => {
    try {
      const res = await postData(`faq/faq-status/${id}`, {
        isActive: !currentStatus,
      });
      if (res.success) {
        toast.success(`Marked as ${!currentStatus ? 'Active' : 'Inactive'}`);
        fetchFaqs();
      } else {
        toast.error(res.message || 'Failed to update status');
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  // ── DELETE ─────────────────────────────────────────────────
  const deleteFaq = async (id) => {
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
        const res = await deleteData(`faq/${id}`);
        if (res.success) {
          toast.success('FAQ deleted successfully');
          fetchFaqs();
        } else {
          toast.error(res.message || 'Failed to delete FAQ');
        }
      } catch (error) {
        Swal.fire('Error!', 'Something went wrong.', 'error');
      }
    }
  };

  // ── HELPERS ────────────────────────────────────────────────
  const getStatusColor = (status) =>
    status ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredFaqs = faqs.filter((faq) => {
    return (
      (filters.isActive === '' ||
        faq.isActive === (filters.isActive === 'true')) &&
      (!filters.search ||
        faq.question.toLowerCase().includes(filters.search.toLowerCase()) ||
        (faq.answer &&
          faq.answer.toLowerCase().includes(filters.search.toLowerCase())))
    );
  });

  // ── RENDER ─────────────────────────────────────────────────
  return (
    <AdminLayout>
      <ToastContainer />
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">FAQ Management</h1>
            <p className="text-gray-600 mt-1">
              Manage frequently asked questions
            </p>
          </div>
          <Button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <i className="ri-add-line mr-2"></i>Add FAQ
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <i className="ri-question-line text-xl text-blue-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total FAQs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {faqs.length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <i className="ri-check-line text-xl text-green-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {faqs.filter((f) => f.isActive === true).length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <i className="ri-close-line text-xl text-yellow-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-gray-900">
                  {faqs.filter((f) => f.isActive === false).length}
                  {/* ✅ Fixed: !f.isActive === true → f.isActive === false */}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search FAQs..."
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
                    value={filters.isActive}
                    onChange={(e) =>
                      setFilters({ ...filters, isActive: e.target.value })
                    }
                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none"
                  >
                    <option value="">All Status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                  <i className="ri-arrow-down-s-line absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* FAQ List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <Card key={faq._id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm font-medium text-gray-500">
                          #{index + 1}
                        </span>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(faq.isActive)}`}
                        >
                          {faq.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600 text-sm">{faq.answer}</p>
                      <div className="mt-3 text-xs text-gray-500">
                        <span>Updated: {formatDate(faq.updatedAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        onClick={() => handleEdit(faq)}
                        className="bg-blue-100 text-blue-600 hover:bg-blue-200 px-2 py-1 text-xs"
                      >
                        <i className="ri-edit-line"></i>
                      </Button>
                      <Button
                        onClick={() => toggleStatus(faq._id, faq.isActive)}
                        className={`px-2 py-1 text-xs ${faq.isActive ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                      >
                        <i
                          className={
                            faq.isActive ? 'ri-eye-off-line' : 'ri-eye-line'
                          }
                        ></i>
                      </Button>
                      <Button
                        onClick={() => deleteFaq(faq._id)}
                        className="bg-red-100 text-red-600 hover:bg-red-200 px-2 py-1 text-xs"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredFaqs.length === 0 && (
              <div className="text-center py-12">
                <i className="ri-question-line text-4xl text-gray-400 mb-4"></i>
                <p className="text-gray-500">
                  No FAQs found matching your criteria
                </p>
              </div>
            )}
          </>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingFaq(null);
                    }}
                    className="text-gray-800 hover:text-gray-600 w-6 h-6 flex items-center justify-center"
                  >
                    <i className="ri-close-line"></i>
                  </button>
                </div>

                <form onSubmit={handleSave}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Question *
                      </label>
                      <input
                        type="text"
                        value={formData.question}
                        onChange={(e) =>
                          setFormData({ ...formData, question: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter the frequently asked question..."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Answer *
                      </label>
                      <textarea
                        value={formData.answer}
                        onChange={(e) =>
                          setFormData({ ...formData, answer: e.target.value })
                        }
                        rows="6"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Provide a detailed answer..."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <div className="relative">
                        <select
                          value={formData.isActive}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isActive: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                        >
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </select>
                        <i className="ri-arrow-down-s-line absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                      </div>
                    </div>
                    <div className="flex space-x-3 pt-4">
                      <Button
                        type="button"
                        onClick={() => {
                          setShowModal(false);
                          setEditingFaq(null);
                        }}
                        className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                        disabled={isLoading}
                      >
                        {isLoading
                          ? 'Saving...'
                          : editingFaq
                            ? 'Update FAQ'
                            : 'Add FAQ'}
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
