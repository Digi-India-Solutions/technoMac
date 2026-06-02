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
  getToken,
} from '../../../../services/FetchNodeServices';

export default function BannersManagement() {
  const [banners, setBanners] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const emptyForm = {
    title: '',
    subtitle: '',
    buttonText: '',
    image: null,
  };

  const [formData, setFormData] = useState(emptyForm);
  /** Reset Form */
  const resetForm = () => {
    setFormData(emptyForm);
    setEditingBanner(null);
  };

  /** Fetch All Banners */
 const fetchBanners = async () => {
   try {
     setIsLoading(true);
      console.log('TOKEN =>', getToken());

     const response = await getData('banner/all');

     if (response?.success) {
       setBanners(response.banners || []);
     }
   } catch (error) {
     toast.error('Failed to load banners');
   } finally {
     setIsLoading(false);
   }
 };

 useEffect(() => {
   fetchBanners();
 }, []);

  useEffect(() => {
    fetchBanners();
  }, []);

  /** Submit Form (Add / Edit) */
 const handleSubmit = async (e) => {
   e.preventDefault();

   try {
     const data = new FormData();

     data.append('title', formData.title);
     data.append('subtitle', formData.subtitle);
     data.append('buttonText', formData.buttonText);

     if (formData.image instanceof File) {
       data.append('image', formData.image);
     }

     let response;

     if (editingBanner) {
       response = await patchData(`banner/update/${editingBanner._id}`, data);
     } else {
       response = await postData('banner/create', data);
     }

     if (response?.success) {
       toast.success(
         editingBanner
           ? 'Banner Updated Successfully'
           : 'Banner Created Successfully',
       );

       setFormData(emptyForm);
       setEditingBanner(null);
       setShowAddModal(false);

       fetchBanners();
     }
   } catch (error) {
     toast.error('Something went wrong');
   }
 };

  /** Edit Banner */
const handleEdit = (banner) => {
  setEditingBanner(banner);

  setFormData({
    title: banner.title || '',
    subtitle: banner.subtitle || '',
    buttonText: banner.buttonText || '',
    image: banner.image || '',
  });

  setShowAddModal(true);
};

  /** Delete Banner (local only, you can add API call here) */
const handleDelete = async (id) => {
   console.log('TOKEN =>', getToken());
  const result = await Swal.fire({
    title: 'Delete Banner?',
    text: 'This action cannot be undone',
    icon: 'warning',
    showCancelButton: true,
  });

  if (!result.isConfirmed) return;

  try {
    
    const response = await deleteData(`banner/delete/${id}`);

    if (response?.success) {
      toast.success('Banner Deleted');
      fetchBanners();
    }
  } catch (error) {
    toast.error('Delete Failed');
  }
};

  /** Toggle Status */
  const toggleStatus = async (bannerId, banner) => {
    const updatedStatus = !banner.isActive;

    try {
      const response = await postData('api/banner/change-status', {
        bannerId: bannerId,
        isActive: updatedStatus,
      });

      if (response.success === true) {
        const updatedProducts = banners.map((banner) => {
          if (banner._id === bannerId) {
            return { ...banner, isActive: updatedStatus };
          }
          return banner;
        });
        setBanners(updatedProducts);
        toast.success('Banner status updated successfully');
      }
    } catch (error) {
      toast.error('Error updating Banner status');
      console.error('Error updating Banner status:', error);
    }
  };
  const dateFormat = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(date).toLocaleDateString('en-US', options);
    return formattedDate;
  };

  // const fetchRoles = async () => {
  //   try {
  //     const response = await postData('api/adminRole/get-single-role-by-role', {
  //       role: user?.role,
  //     });
  //     console.log(
  //       'response.data:==>response.data:==>',
  //       response?.data[0]?.permissions,
  //     );
  //     setPermiton(response?.data[0]?.permissions?.banners);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   fetchRoles();
  // }, [user?.role]);
  // console.log('hhhbanners:==>', banners);

  return (
    <AdminLayout>
      <ToastContainer />
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Banner Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage promotional banners and advertisements
            </p>
          </div>
          {/* {permiton?.write && (
            <Button
              onClick={() => {
                if (permiton?.write) {
                  resetForm();
                  setShowAddModal(true);
                } else {
                  toast.error('You do not have permission to add banner');
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
            >
              <i className="ri-add-line"></i>
              <span>Add Banner</span>
            </Button>
          )} */}
        </div>

        {/* Banner Grid */}
        {banners.length === 0 ? (
          <p className="text-gray-500">No banners found.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {banners.map((banner) => (
              <Card key={banner._id} className="overflow-hidden">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-52 object-cover"
                />

                <div className="p-4">
                  <h3 className="font-bold text-lg">{banner.title}</h3>

                  <p className="text-gray-600 mt-2">{banner.subtitle}</p>

                  <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded">
                    {banner.buttonText}
                  </button>

                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => handleEdit(banner)}
                      className="flex-1 bg-blue-600 text-white"
                    >
                      Edit
                    </Button>

                    <Button
                      onClick={() => handleDelete(banner._id)}
                      className="flex-1 bg-red-600 text-white"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {editingBanner ? 'Edit Banner' : 'Add New Banner'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600 w-6 h-6 flex items-center justify-center"
                  >
                    <i className="ri-close-line"></i>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label>Title</label>

                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          title: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg p-2"
                      required
                    />
                  </div>

                  <div>
                    <label>Subtitle</label>

                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          subtitle: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg p-2"
                    />
                  </div>

                  <div>
                    <label>Button Text</label>

                    <input
                      type="text"
                      value={formData.buttonText}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          buttonText: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg p-2"
                    />
                  </div>

                  <div>
                    <label>Banner Image</label>

                    {formData.image && typeof formData.image === 'string' && (
                      <img
                        src={formData.image}
                        alt=""
                        className="h-32 w-full object-cover rounded mb-2"
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
                      className="w-full border rounded-lg p-2"
                      required={!editingBanner}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        setEditingBanner(null);
                        setFormData(emptyForm);
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white"
                    >
                      {editingBanner ? 'Update Banner' : 'Create Banner'}
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
