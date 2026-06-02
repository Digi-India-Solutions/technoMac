
// import React, { useEffect, useState, useMemo } from "react";
// import Button from "../../../components/base/Button";
// import { postData } from "../../../services/FetchNodeServices";
// import { toast } from "react-toastify";

// function CreateChallanModal({
//   setShowCreateChallanModal,
//   setChallanForm,
//   setSelectedCustomerOrders,
//   challanForm,
//   customers,
//   selectedCustomerOrders,
//   vendors,
//   handleCustomerChange,
//   handleOrderChange,
//   setSubProductsStock,
//   subProductsStock,
//   challans,
//   setChallans,
//   fetchChallan,
//   orders,
// }) {
//   const [previewOrder, setPreviewOrder] = useState([]); // previous challans of same order

//   // 🧠 Get filtered orders (excluding Cancelled, Returned, Delivered)
//   const filteredOrders = useMemo(
//     () =>
//       selectedCustomerOrders.filter(
//         (o) => !["Cancelled", "Returned", "Dispatched"].includes(o?.status) && o?.recycleBin === false
//       ),
//     [selectedCustomerOrders]
//   );

//   console.log("selectedCustomerOrders=>", selectedCustomerOrders, filteredOrders)
//   // 🧩 Update dispatch qty for an item
//   const updateChallanItemQuantity = (index, dispatchQty, alreadyDispatched) => {
//     const updatedItems = challanForm.items.map((item, i) =>
//       i === index
//         ? {
//           ...item,
//           dispatchQty: Math.min(
//             Math.max(0, dispatchQty),
//             item?.quantity - (item?.alreadyDispatched || 0)
//           ),
//           alreadyDispatched: alreadyDispatched
//         }
//         : item
//     );

//     setChallanForm({ ...challanForm, items: updatedItems });
//   };

//   // 📦 Create Challan
//   const createChallan = async () => {
//     const customer = customers.find((c) => c._id === challanForm?.customerId);
//     const itemsToDispatch = challanForm.items.filter(
//       (item) => item.dispatchQty > 0
//     );

//     if (!customer || itemsToDispatch.length === 0) {
//       toast.warning("Please select customer, order and dispatch quantities");
//       return;
//     }

//     // Validate stock
//     for (const item of itemsToDispatch) {
//       const dispatchedPcs = item.dispatchQty * item?.productId?.pcsInSet;
//       const stockItem = subProductsStock.find((s) => s.name === item.name);
//       if (stockItem && stockItem.stock < dispatchedPcs) {
//         toast.error(
//           `Insufficient stock for ${item.name}. Available: ${stockItem.stock} pcs, Required: ${dispatchedPcs} pcs`
//         );
//         return;
//       }
//     }

//     const totalValue = itemsToDispatch.reduce(
//       (sum, i) => sum + i.dispatchQty * i?.pcsInSet * i?.singlePicPrice,
//       0
//     );

//     const payload = {
//       customerId: customer._id,
//       customer: customer.name,
//       orderId: challanForm?.orderId,
//       orderNumber: challanForm?.orderNumber,
//       items: itemsToDispatch.map((item) => ({
//         color: item?.color,
//         availableSizes: item?.availableSizes,
//         dispatchedQty: item?.dispatchQty,
//         price: item?.singlePicPrice,
//         pcsInSet: item?.pcsInSet,
//         selectedSizes: item?.availableSizes,
//         alreadyDispatched: item?.alreadyDispatched,
//       })),
//       totalValue,
//       date: new Date().toISOString().split("T")[0],
//       status: "Dispatched",
//       vendor: challanForm?.deliveryVendor,
//       notes: challanForm?.notes,
//     };
//     console.log("SSSSSSSS::=>", payload)
//     try {
//       const response = await postData("api/challan/create-challan", payload);

//       if (response?.success) {
//         toast.success("Challan created successfully!");
//         fetchChallan();
//         resetForm();
//         setShowCreateChallanModal(false);
//       } else {
//         toast.error("Failed to create challan");
//       }
//     } catch (err) {
//       toast.error("Server error, please try again");
//       console.error(err);
//     }
//   };

//   // 🧹 Reset
//   const resetForm = () => {
//     setChallanForm({
//       customerId: "",
//       orderId: "",
//       items: [],
//       deliveryVendor: "BlueDart",
//       notes: "",
//     });
//     setSelectedCustomerOrders([]);
//   };

//   // 🔍 Fetch existing challans for same customer & order
//   const fetchChallanByCustomerAndOrder = async () => {
//     if (!challanForm?.customerId || !challanForm?.orderId) return;
//     try {
//       const data = {
//         customerId: challanForm.customerId,
//         orderId: challanForm.orderId,
//       };
//       const response = await postData(
//         "api/challan/get-all-challans-by-customer-and-order",
//         data
//       );
//       // console.log("XXXXXXXXXXpreviewOrder=>",response?.data)
//       if (response?.status === true) {
//         setPreviewOrder(response?.data);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchChallanByCustomerAndOrder();
//   }, [challanForm?.customerId, challanForm?.orderId]);

//   // 🧾 Calculate already dispatched per product
//   const mergedItems = useMemo(() => {
//     if (!challanForm?.items?.length) return [];

//     return challanForm.items.map((item) => {
//       const dispatchedCount = previewOrder
//         ?.flatMap((ch) => ch.items)
//         .filter((i) => i.name === item.name)
//         .reduce((sum, i) => sum + (i.dispatchedQty || 0), 0);

//       const remaining = Math.max(item.quantity - dispatchedCount, 0);

//       return {
//         ...item,
//         alreadyDispatched: dispatchedCount,
//         remainingQty: remaining,
//       };
//     });
//   }, [challanForm?.items, previewOrder]);


//   useEffect(() => {
//     if (orders && customers) {
//       const matchedCustomer = customers.find((c) =>
//         c?.email?.trim().toLowerCase() === orders?.customer?.email?.trim().toLowerCase()
//       );

//       console.log("mergedItems==XXX>", challanForm, customers, matchedCustomer)
//       handleOrderChange(orders?._id, "challan")
//       setSelectedCustomerOrders([orders]);
//       setChallanForm((prev) => ({
//         ...prev,
//         customerId: matchedCustomer?._id || "",
//         orderId: orders?._id || "",
//         orderNumber: orders?.orderNumber || "",
//         deliveryVendor: orders?.transportName || "BlueDart",
//         notes: orders?.orderNote || "",

//       }));
//     }
//   }, [orders, customers]);

//   const handleSelectAll = () => {
//     const allItems = mergedItems.map((item) => ({
//       ...item,
//       dispatchQty: item.remainingQty,
//     }));
//     setChallanForm((prev) => ({ ...prev, items: allItems }));
//   }
//   // console.log("mergedItems==XXX>", challanForm, customers)
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
//         <div className="p-6 space-y-6">
//           {/* Header */}
//           <div className="flex justify-between items-center">
//             <h2 className="text-xl font-semibold text-gray-800">
//               Create Delivery Challan
//             </h2>
//             <button
//               onClick={() => {
//                 setShowCreateChallanModal(false);
//                 resetForm();
//               }}
//               className="text-gray-400 hover:text-gray-600"
//             >
//               <i className="ri-close-line text-lg"></i>
//             </button>
//           </div>

//           {/* Customer & Order Selection */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Select Customer
//               </label>
//               <select
//                 value={challanForm?.customerId}
//                 onChange={(e) => handleCustomerChange(e.target.value, "challan")}
//                 className="w-full px-3 py-2 border rounded-lg text-sm"
//               >
//                 <option value="">Choose Customer</option>
//                 {customers.map((c) => (
//                   <option key={c._id} value={c._id}>
//                     {c.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Select Order
//               </label>
//               <select
//                 value={challanForm?.orderId}
//                 onChange={(e) => handleOrderChange(e.target.value, "challan")}
//                 className="w-full px-3 py-2 border rounded-lg text-sm"
//                 disabled={!challanForm?.customerId}
//               >
//                 <option value="">Choose Order</option>
//                 {filteredOrders.map((o) => (
//                   <option key={o._id} value={o._id}>
//                     {o.orderNumber} - ₹{o.subtotal?.toLocaleString()} (
//                     {o?.status})
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Order Items */}
//           {mergedItems.length > 0 && (
//             <div className="space-y-3">
//               <div className="flex justify-between items-center">
//                 <h3 className="font-medium text-gray-700">
//                   Dispatch Quantities per Item
//                 </h3>
//                 <Button onClick={handleSelectAll} >
//                   All QUANTITY
//                 </Button>
//               </div>
//               {mergedItems.map((item, index) => (
//                 <div
//                   key={index}
//                   className="bg-gray-50 border border-gray-200 p-4 rounded-lg"
//                 >
//                   <div className="grid grid-cols-5 gap-4 items-center">
//                     <div className="col-span-2">
//                       <div className="font-medium text-gray-800">{item?.color}</div>
//                       <div className="text-xs text-gray-500">
//                         Sizes: {item.availableSizes.join(", ")}
//                       </div>
//                     </div>

//                     <div className="text-center text-sm">
//                       <div className="text-gray-500">Ordered Qty</div>
//                       <div className="font-semibold">{item?.quantity}</div>
//                     </div>

//                     <div className="text-center text-sm">
//                       <div className="text-gray-500">Already Dispatched</div>
//                       <div className="text-green-600 font-semibold">
//                         {item.alreadyDispatched}
//                       </div>
//                     </div>

//                     <div className="text-center text-sm">
//                       <div className="text-gray-500 mb-1">New Dispatch</div>
//                       <input
//                         type="number"
//                         value={item.dispatchQty || 0}
//                         onChange={(e) =>
//                           updateChallanItemQuantity(index, +e.target.value, item.alreadyDispatched)
//                         }
//                         min="0"
//                         max={item.remainingQty}
//                         className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-sm"
//                       />
//                     </div>
//                   </div>

//                   {item?.dispatchQty > 0 && (
//                     <div className="mt-2 text-right text-xs text-blue-600">
//                       Value: ₹
//                       {(
//                         item.dispatchQty *
//                         item?.productId?.singlePicPrice *
//                         item?.productId?.pcsInSet
//                       ).toLocaleString()}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Total */}
//           {mergedItems.length > 0 && (
//             <div className="p-4 bg-blue-50 rounded-lg flex justify-between items-center font-medium">
//               <span>Total Dispatch Value:</span>
//               <span className="text-xl text-blue-600 font-bold">
//                 ₹
//                 {mergedItems
//                   .reduce(
//                     (sum, item) =>
//                       sum +
//                       item.dispatchQty *
//                       item?.productId?.singlePicPrice *
//                       item?.productId?.pcsInSet,
//                     0
//                   )
//                   .toLocaleString()}
//               </span>
//             </div>
//           )}

//           {/* Additional Info */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Delivery Vendor
//               </label>
//               <select
//                 value={challanForm?.deliveryVendor}
//                 onChange={(e) =>
//                   setChallanForm({ ...challanForm, deliveryVendor: e.target.value })
//                 }
//                 className="w-full px-3 py-2 border rounded-lg text-sm"
//               >
//                 {vendors.map((v) => (
//                   <option key={v} value={v}>
//                     {v}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Notes / Tracking ID
//               </label>
//               <input
//                 type="text"
//                 value={challanForm.notes}
//                 onChange={(e) =>
//                   setChallanForm({ ...challanForm, notes: e.target.value })
//                 }
//                 placeholder="Special instructions or tracking number..."
//                 className="w-full px-3 py-2 border rounded-lg text-sm"
//               />
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="flex space-x-3 pt-4">
//             <Button
//               onClick={() => {
//                 setShowCreateChallanModal(false);
//                 resetForm();
//               }}
//               className="flex-1 bg-gray-700 text-white hover:bg-gray-900"
//             >
//               Cancel
//             </Button>

//             <Button
//               onClick={createChallan}
//               className="flex-1 bg-blue-900 text-white hover:bg-blue-700"
//               disabled={
//                 !challanForm.customerId ||
//                 !challanForm.orderId ||
//                 mergedItems.every((i) => i.dispatchQty === 0)
//               }
//             >
//               Create Challan
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CreateChallanModal;




import React, { useEffect, useState, useMemo, useCallback } from "react";
import Button from "../../../components/base/Button";
import { postData } from "../../../services/FetchNodeServices";
import { toast } from "react-toastify";

function CreateChallanModal({
  setShowCreateChallanModal,
  setChallanForm,
  setSelectedCustomerOrders,
  challanForm,
  customers,
  selectedCustomerOrders,
  vendors,
  handleCustomerChange,
  handleOrderChange,
  setSubProductsStock,
  subProductsStock,
  challans,
  setChallans,
  fetchChallan,
  orders,
  customerSearch,
  setCustomerSearch,
  customerLoading,
  customerPage,
  customerTotalPages,
  fetchCustomers,
}) {
  const [previewOrder, setPreviewOrder] = useState([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  // ✅ FIX: Store selected customer locally so it survives list refresh
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filteredOrders = useMemo(
    () =>
      selectedCustomerOrders.filter(
        (o) =>
          !["Cancelled", "Returned", "Dispatched"].includes(o?.status) &&
          o?.recycleBin === false
      ),
    [selectedCustomerOrders]
  );

  const updateChallanItemQuantity = (index, dispatchQty, alreadyDispatched) => {
    const updatedItems = challanForm.items.map((item, i) =>
      i === index
        ? {
            ...item,
            dispatchQty: Math.min(
              Math.max(0, dispatchQty),
              item?.quantity - (item?.alreadyDispatched || 0)
            ),
            alreadyDispatched,
          }
        : item
    );
    setChallanForm({ ...challanForm, items: updatedItems });
  };

  const createChallan = async () => {
    // ✅ FIX: Use localSelectedCustomer instead of searching customers array
    const customer = selectedCustomer || customers.find((c) => c._id === challanForm?.customerId);
    const itemsToDispatch = challanForm.items.filter((item) => item.dispatchQty > 0);

    if (!customer || itemsToDispatch.length === 0) {
      toast.warning("Please select customer, order and dispatch quantities");
      return;
    }

    for (const item of itemsToDispatch) {
      const dispatchedPcs = item.dispatchQty * item?.productId?.pcsInSet;
      const stockItem = subProductsStock.find((s) => s.name === item.name);
      if (stockItem && stockItem.stock < dispatchedPcs) {
        toast.error(
          `Insufficient stock for ${item.name}. Available: ${stockItem.stock} pcs, Required: ${dispatchedPcs} pcs`
        );
        return;
      }
    }

    const totalValue = itemsToDispatch.reduce(
      (sum, i) => sum + i.dispatchQty * i?.pcsInSet * i?.singlePicPrice,
      0
    );

    const payload = {
      customerId: customer._id,
      customer: customer.name,
      orderId: challanForm?.orderId,
      orderNumber: challanForm?.orderNumber,
      items: itemsToDispatch.map((item) => ({
        color: item?.color,
        availableSizes: item?.availableSizes,
        dispatchedQty: item?.dispatchQty,
        price: item?.singlePicPrice,
        pcsInSet: item?.pcsInSet,
        selectedSizes: item?.availableSizes,
        alreadyDispatched: item?.alreadyDispatched,
      })),
      totalValue,
      date: new Date().toISOString().split("T")[0],
      status: "Dispatched",
      vendor: challanForm?.deliveryVendor,
      notes: challanForm?.notes,
    };

    try {
      const response = await postData("api/challan/create-challan", payload);
      if (response?.success) {
        toast.success("Challan created successfully!");
        fetchChallan();
        resetForm();
        setShowCreateChallanModal(false);
      } else {
        toast.error("Failed to create challan");
      }
    } catch (err) {
      toast.error("Server error, please try again");
      console.error(err);
    }
  };

  const resetForm = () => {
    setChallanForm({
      customerId: "",
      orderId: "",
      items: [],
      deliveryVendor: "BlueDart",
      notes: "",
    });
    setSelectedCustomerOrders([]);
    setCustomerSearch("");
    setSelectedCustomer(null); // ✅ FIX: Clear local selected customer on reset
  };

  const fetchChallanByCustomerAndOrder = async () => {
    if (!challanForm?.customerId || !challanForm?.orderId) return;
    try {
      const response = await postData(
        "api/challan/get-all-challans-by-customer-and-order",
        { customerId: challanForm.customerId, orderId: challanForm.orderId }
      );
      if (response?.status === true) setPreviewOrder(response?.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchChallanByCustomerAndOrder();
  }, [challanForm?.customerId, challanForm?.orderId]);

  const mergedItems = useMemo(() => {
    if (!challanForm?.items?.length) return [];
    return challanForm.items.map((item) => {
      const dispatchedCount = previewOrder
        ?.flatMap((ch) => ch.items)
        .filter((i) => i.name === item.name)
        .reduce((sum, i) => sum + (i.dispatchedQty || 0), 0);
      return {
        ...item,
        alreadyDispatched: dispatchedCount,
        remainingQty: Math.max(item.quantity - dispatchedCount, 0),
      };
    });
  }, [challanForm?.items, previewOrder]);

  useEffect(() => {
    if (orders && customers) {
      const matchedCustomer = customers.find(
        (c) =>
          c?.email?.trim().toLowerCase() ===
          orders?.customer?.email?.trim().toLowerCase()
      );
      // ✅ FIX: Also set selectedCustomer when auto-matching from orders
      if (matchedCustomer) setSelectedCustomer(matchedCustomer);

      handleOrderChange(orders?._id, "challan");
      setSelectedCustomerOrders([orders]);
      setChallanForm((prev) => ({
        ...prev,
        customerId: matchedCustomer?._id || "",
        orderId: orders?._id || "",
        orderNumber: orders?.orderNumber || "",
        deliveryVendor: orders?.transportName || "BlueDart",
        notes: orders?.orderNote || "",
      }));
    }
  }, [orders, customers]);

  const handleSelectAll = () => {
    const allItems = mergedItems.map((item) => ({
      ...item,
      dispatchQty: item.remainingQty,
    }));
    setChallanForm((prev) => ({ ...prev, items: allItems }));
  };

  // ✅ FIX: Display name comes from local state, never from the refreshing list
  const selectedCustomerName = selectedCustomer?.name || "";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="p-6 space-y-6">

          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Create Delivery Challan</h2>
            <button
              onClick={() => { setShowCreateChallanModal(false); resetForm(); }}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="ri-close-line text-lg"></i>
            </button>
          </div>

          {/* Customer & Order Selection */}
          <div className="grid grid-cols-2 gap-4">

            {/* ✅ Searchable Customer Dropdown */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Customer
              </label>

              {/* ✅ FIX: Show selected customer as a chip when selected */}
              {selectedCustomer ? (
                <div className="w-full px-3 py-2 border border-blue-400 rounded-lg text-sm bg-blue-50 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="font-medium text-blue-800">{selectedCustomer.name}</span>
                    <span className="text-xs text-blue-500">{selectedCustomer.email} • {selectedCustomer.phone}</span>
                  </div>
                  {/* ✅ X button to clear selection and re-open search */}
                  <button
                    onClick={() => {
                      setSelectedCustomer(null);
                      setChallanForm((prev) => ({ ...prev, customerId: "", orderId: "", items: [] }));
                      setSelectedCustomerOrders([]);
                      setCustomerSearch("");
                      fetchCustomers(1, "");
                    }}
                    className="ml-2 text-blue-400 hover:text-red-500 flex-shrink-0"
                  >
                    <i className="ri-close-circle-line text-base"></i>
                  </button>
                </div>
              ) : (
                <>
                  <div
                    className="w-full px-3 py-2 border rounded-lg text-sm cursor-pointer flex justify-between items-center bg-white"
                    onClick={() => setShowCustomerDropdown((v) => !v)}
                  >
                    <span className="text-gray-400">Choose Customer</span>
                    <i className={`ri-arrow-${showCustomerDropdown ? "up" : "down"}-s-line text-gray-500`}></i>
                  </div>

                  {showCustomerDropdown && (
                    <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                      {/* Search Input */}
                      <div className="p-2 border-b">
                        <input
                          autoFocus
                          type="text"
                          value={customerSearch}
                          onChange={(e) => setCustomerSearch(e.target.value)}
                          placeholder="Search by name, email, phone..."
                          className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      {/* Customer List */}
                      <div className="max-h-48 overflow-y-auto">
                        {customerLoading ? (
                          <div className="text-center py-4 text-sm text-gray-500">
                            <div className="inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-1" />
                            Loading...
                          </div>
                        ) : customers.length === 0 ? (
                          <div className="text-center py-4 text-sm text-gray-400">No customers found</div>
                        ) : (
                          customers.map((c) => (
                            <div
                              key={c._id}
                              onClick={() => {
                                // ✅ FIX: Save full customer object locally before list refreshes
                                setSelectedCustomer(c);
                                handleCustomerChange(c._id, "challan");
                                setShowCustomerDropdown(false);
                                setCustomerSearch("");
                              }}
                              className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 flex flex-col"
                            >
                              <span className="text-gray-800 font-medium">{c.name}</span>
                              <span className="text-gray-400 text-xs">{c.email} • {c.phone}</span>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Pagination */}
                      {customerTotalPages > 1 && (
                        <div className="flex justify-between items-center px-3 py-2 border-t text-xs text-gray-500">
                          <button
                            disabled={customerPage <= 1}
                            onClick={() => fetchCustomers(customerPage - 1, customerSearch)}
                            className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
                          >
                            ← Prev
                          </button>
                          <span>Page {customerPage} of {customerTotalPages}</span>
                          <button
                            disabled={customerPage >= customerTotalPages}
                            onClick={() => fetchCustomers(customerPage + 1, customerSearch)}
                            className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
                          >
                            Next →
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Order Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Order</label>
              <select
                value={challanForm?.orderId}
                onChange={(e) => handleOrderChange(e.target.value, "challan")}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                disabled={!challanForm?.customerId}
              >
                <option value="">Choose Order</option>
                {filteredOrders.map((o) => (
                  <option key={o._id} value={o._id}>
                    {o.orderNumber} - ₹{o.subtotal?.toLocaleString()} ({o?.status})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Order Items */}
          {mergedItems.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-700">Dispatch Quantities per Item</h3>
                <Button onClick={handleSelectAll}>All QUANTITY</Button>
              </div>
              {mergedItems.map((item, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                  <div className="grid grid-cols-5 gap-4 items-center">
                    <div className="col-span-2">
                      <div className="font-medium text-gray-800">{item?.color}</div>
                      <div className="text-xs text-gray-500">Sizes: {item.availableSizes.join(", ")}</div>
                    </div>
                    <div className="text-center text-sm">
                      <div className="text-gray-500">Ordered Qty</div>
                      <div className="font-semibold">{item?.quantity}</div>
                    </div>
                    <div className="text-center text-sm">
                      <div className="text-gray-500">Already Dispatched</div>
                      <div className="text-green-600 font-semibold">{item.alreadyDispatched}</div>
                    </div>
                    <div className="text-center text-sm">
                      <div className="text-gray-500 mb-1">New Dispatch</div>
                      <input
                        type="number"
                        value={item.dispatchQty || 0}
                        onChange={(e) =>
                          updateChallanItemQuantity(index, +e.target.value, item.alreadyDispatched)
                        }
                        min="0"
                        max={item.remainingQty}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                      />
                    </div>
                  </div>
                  {item?.dispatchQty > 0 && (
                    <div className="mt-2 text-right text-xs text-blue-600">
                      Value: ₹{(item.dispatchQty * item?.productId?.singlePicPrice * item?.productId?.pcsInSet).toLocaleString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Total */}
          {mergedItems.length > 0 && (
            <div className="p-4 bg-blue-50 rounded-lg flex justify-between items-center font-medium">
              <span>Total Dispatch Value:</span>
              <span className="text-xl text-blue-600 font-bold">
                ₹{mergedItems
                  .reduce((sum, item) => sum + Number(item.dispatchQty) * Number(item?.productId?.singlePicPrice) * Number(item?.productId?.pcsInSet), 0)
                  .toLocaleString()}
              </span>
            </div>
          )}

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Vendor</label>
              <select
                value={challanForm?.deliveryVendor}
                onChange={(e) => setChallanForm({ ...challanForm, deliveryVendor: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                {vendors.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes / Tracking ID</label>
              <input
                type="text"
                value={challanForm.notes}
                onChange={(e) => setChallanForm({ ...challanForm, notes: e.target.value })}
                placeholder="Special instructions or tracking number..."
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex space-x-3 pt-4">
            <Button
              onClick={() => { setShowCreateChallanModal(false); resetForm(); }}
              className="flex-1 bg-gray-700 text-white hover:bg-gray-900"
            >
              Cancel
            </Button>
            <Button
              onClick={createChallan}
              className="flex-1 bg-blue-900 text-white hover:bg-blue-700"
              disabled={
                !challanForm.customerId ||
                !challanForm.orderId ||
                mergedItems.every((i) => i.dispatchQty === 0)
              }
            >
              Create Challan
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CreateChallanModal;