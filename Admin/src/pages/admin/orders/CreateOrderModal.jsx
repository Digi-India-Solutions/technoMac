
import React, { useEffect, useState } from 'react'
import Button from '../../../components/base/Button';
import { getData, postData } from '../../../services/FetchNodeServices';
import CreateUserModel from './CreateUserModels.jsx';
import Select from "react-select";

// ─── Blank form factory — single source of truth ─────────────────────────────
const blankForm = () => ({
    customerId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerType: 'Retail',
    deliveryAddress: '',
    orderType: 'Offline',
    orderNote: '',
    transportName: '',
    payments: [{ method: 'Cash', amount: '' }],
    items: [],
    customerAvailablePoints: 0,
    redeemPoints: 0,
    pointsToEarn: 0,
    additionalDiscount: '',   // ✅ always present
});

function CreateOrderModal({
    subProducts, orders, fetchAllOrder, setOrders, setFilteredOrders,
    filteredOrders, setOrderToPrint, setShowPrintOrderModal,
    setShowProductSelectionModal, calculatePointsValue, calculatePointsToEarn,
    getTotalPaidAmount, setShowCreateOrderModal, setNewOrderForm, newOrderForm,
}) {
    const [customers, setCustomers] = useState(null);
    const [customerSearch, setCustomerSearch] = useState("");
    const [customerPage, setCustomerPage] = useState(1);
    const [customerTotalPages, setCustomerTotalPages] = useState(1);
    const [customerLoading, setCustomerLoading] = useState(false);
    const [qrScanInput, setQrScanInput] = useState('');
    const [showUserModal, setShowUserModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
    const AdminUser = JSON.parse(sessionStorage.getItem("JeansUser"));

    // ── Derived totals ────────────────────────────────────────────────────────
    const getTotalValue = () =>
        newOrderForm?.items?.reduce(
            (sum, item) => sum + (item?.quantity * item?.singlePicPrice * item?.pcsInSet),
            0
        ) ?? 0;

    const getTotalPcs = () =>
        newOrderForm?.items?.reduce(
            (sum, item) => sum + (Number(item?.quantity) * Number(item?.pcsInSet || 0)),
            0
        ) ?? 0;

    const getTotalQuantity = () =>
        newOrderForm?.items?.reduce((sum, item) => sum + Number(item?.quantity), 0) ?? 0;

    // ✅ All discount sources combined
    const getAdditionalDiscount = () => Number(newOrderForm?.additionalDiscount || 0);

    const getBalanceAmount = () => {
        const total = getTotalValue();
        const pointsDisc = calculatePointsValue(newOrderForm?.redeemPoints || 0);
        const addDisc = getAdditionalDiscount();
        const paid = getTotalPaidAmount();
        return Math.max(0, total - pointsDisc - addDisc - paid);
    };

    const getPaymentType = () =>
        getBalanceAmount() === 0 ? 'Complete Payment' : 'Partial Payment';

    // ── Payment helpers ───────────────────────────────────────────────────────
    const addPaymentMethod = () => {
        setNewOrderForm({
            ...newOrderForm,
            payments: [...newOrderForm.payments, { method: 'Cash', amount: '' }],
        });
    };

    const removePaymentMethod = (index) => {
        if (newOrderForm.payments.length <= 1) return;
        setNewOrderForm({
            ...newOrderForm,
            payments: newOrderForm.payments.filter((_, i) => i !== index),
        });
    };

    // ✅ Max allowed = orderTotal - pointsDiscount - additionalDiscount
    const updatePaymentMethod = (index, field, value) => {
        const updatedPayments = newOrderForm.payments.map((p, i) =>
            i === index ? { ...p, [field]: value } : p
        );

        if (field === 'amount') {
            const subtotal = getTotalValue();
            const pointsDisc = calculatePointsValue(newOrderForm?.redeemPoints || 0);
            const addDisc = getAdditionalDiscount();
            const maxAllowed = Math.max(0, subtotal - pointsDisc - addDisc);

            const totalEntered = updatedPayments.reduce(
                (sum, p) => sum + (parseFloat(p.amount) || 0),
                0
            );

            if (totalEntered > maxAllowed) {
                alert("⚠️ Total payment cannot exceed the payable amount after discounts.");
                return;
            }
        }

        setNewOrderForm({ ...newOrderForm, payments: updatedPayments });
    };

    // ── Item helpers ──────────────────────────────────────────────────────────
    const removeItemFromOrder = (index) => {
        setNewOrderForm({
            ...newOrderForm,
            items: newOrderForm.items.filter((_, i) => i !== index),
        });
    };

    const updateItemQuantity = (index, newQty) => {
        if (newQty <= 0) return;
        setNewOrderForm({
            ...newOrderForm,
            items: newOrderForm.items.map((item, i) =>
                i === index ? { ...item, quantity: newQty } : item
            ),
        });
    };

    const updateItemPcsInSet = (index, newPcs) => {
        if (newPcs <= 0) return;
        setNewOrderForm({
            ...newOrderForm,
            items: newOrderForm.items.map((item, i) =>
                i === index ? { ...item, pcsInSet: newPcs } : item
            ),
        });
    };

    const updateItemSinglePicPrice = (index, price) => {
        setNewOrderForm({
            ...newOrderForm,
            items: newOrderForm.items.map((item, i) =>
                i === index ? { ...item, singlePicPrice: price } : item
            ),
        });
    };

    // ── Points helpers ────────────────────────────────────────────────────────
    const calculateMaxRedeemablePoints = (cartValue) => {
        const maxValue = cartValue * 0.3;
        return Math.floor(maxValue / 0.5);
    };

    const handleRedeemPointsChange = (points) => {
        const maxRedeemable = calculateMaxRedeemablePoints(getTotalValue());
        const validPoints = Math.min(points, Math.min(maxRedeemable, newOrderForm.customerAvailablePoints));
        setNewOrderForm({ ...newOrderForm, redeemPoints: Math.max(0, validPoints) });
    };

    const handleRedeemMax = () => {
        const maxAllowed = Math.min(
            calculateMaxRedeemablePoints(getTotalValue()),
            newOrderForm.customerAvailablePoints
        );
        setNewOrderForm({ ...newOrderForm, redeemPoints: maxAllowed });
    };

    // ── Customer helpers ──────────────────────────────────────────────────────
    const handleCustomerSelect = (customerId) => {
        if (customerId === 'new') {
            setShowUserModal(true);
            return;
        }
        const customer = customers?.find(c => c._id === customerId);
        if (customer) {
            setNewOrderForm({
                ...newOrderForm,
                customerId,
                customerName: customer.name,
                customerEmail: customer.email,
                customerPhone: customer.phone,
                deliveryAddress: [
                    customer.address?.street,
                    customer.address?.city,
                    customer.address?.state,
                    customer.address?.zipCode,
                    customer.address?.country,
                ].filter(Boolean).join(', '),
            });
        } else {
            setNewOrderForm({ ...newOrderForm, customerId, customerName: '', customerEmail: '', customerPhone: '', deliveryAddress: '' });
        }
    };

    // ── Barcode scanner ───────────────────────────────────────────────────────
    const addProductByBarcode = (value) => {
        const foundProduct = subProducts?.find(p =>
            p.barcode === value ||
            p.barcode === value.padStart(13, '0') ||
            p.barcode === value.replace(/^0+/, '')
        );

        if (!foundProduct) {
            playBeepSound('error');
            return;
        }

        const existingIndex = newOrderForm.items.findIndex(item => item.productId === foundProduct._id);
        if (existingIndex >= 0) {
            const updatedItems = [...newOrderForm.items];
            updatedItems[existingIndex].quantity += 1;
            setNewOrderForm({ ...newOrderForm, items: updatedItems });
        } else {
            setNewOrderForm({
                ...newOrderForm,
                items: [...newOrderForm.items, {
                    productId: foundProduct._id,
                    color: foundProduct.color,
                    quantity: 1,
                    singlePicPrice: foundProduct.singlePicPrice,
                    pcsInSet: foundProduct.pcsInSet,
                }],
            });
        }
        playBeepSound('success');
        setQrScanInput('');
    };

    const handleQRScan = () => {
        if (!qrScanInput.trim()) return;
        addProductByBarcode(qrScanInput.trim()); // ✅ was using undefined `value`
    };

    const handleBarcodeInputChange = (value) => {
        setQrScanInput(value);
        if (value.length === 13 && /^\d{13}$/.test(value)) {
            setTimeout(() => addProductByBarcode(value), 100);
        }
    };

    // ── Create order ──────────────────────────────────────────────────────────
    const createOrder = async (e) => {
        e.preventDefault();
        if (newOrderForm.items.length === 0) {
            alert('Please add at least one item to the order');
            return;
        }

        setLoading(true);

        const subtotal = getTotalValue();
        const pointsDisc = calculatePointsValue(newOrderForm.redeemPoints || 0);
        const addDisc = getAdditionalDiscount();
        // ✅ finalTotal accounts for both discount types
        const finalTotal = Math.max(0, subtotal - pointsDisc - addDisc);
        const paidAmount = getTotalPaidAmount();
        const balanceAmount = Math.max(0, finalTotal - paidAmount);
        const pointsToEarn = calculatePointsToEarn(finalTotal);

        const newOrder = {
            id: Date.now(),
            createdBy: AdminUser?.id,
            customer: {
                userId: newOrderForm.customerId,
                name: newOrderForm.customerName,
                email: newOrderForm.customerEmail,
                phone: newOrderForm.customerPhone,
                deliveryAddress: newOrderForm.deliveryAddress,
            },
            items: newOrderForm.items.map(item => ({
                ...item,
                images: [subProducts.find(p => p._id === item.productId)?.subProductImages?.[0] || ''],
                selectedSizes: subProducts.find(p => p._id === item.productId)?.sizes || [],
            })),
            subtotal,
            additionalDiscount: addDisc,          // ✅ persisted
            pointsRedeemed: newOrderForm.redeemPoints,
            pointsRedemptionValue: pointsDisc,
            total: finalTotal || subtotal,
            status: 'Pending',
            paymentType: balanceAmount === 0 ? 'Complete Payment' : 'Partial Payment',
            paidAmount,
            balanceAmount,
            orderNote: newOrderForm.orderNote,
            transportName: newOrderForm.transportName,
            payments: newOrderForm.payments.filter(p => parseFloat(p.amount) > 0),
            paymentMethod: newOrderForm.payments[0]?.method || 'Cash',
            orderType: newOrderForm.orderType,
            orderDate: new Date().toISOString().split('T')[0],
            trackingId: '',
            deliveryVendor: '',
            pointsEarned: pointsToEarn,
            pointsEarnedValue: calculatePointsValue(pointsToEarn),
            statusHistory: [
                { status: 'Pending', date: new Date().toISOString().split('T')[0], updatedBy: 'System' },
            ],
        };

        const response = await postData('api/order/create-order-by-admin', newOrder);
        setLoading(false);

        if (!response.success) {
            console.error('Error:', response.message);
            return;
        }

        fetchAllOrder();
        setOrders([newOrder, ...orders]);
        setFilteredOrders([newOrder, ...filteredOrders]);
        setOrderToPrint(newOrder);
        setShowPrintOrderModal(true);
        setNewOrderForm(blankForm());   // ✅ full reset including additionalDiscount
        setShowCreateOrderModal(false);
    };

    // ── Data fetching ─────────────────────────────────────────────────────────
    // const fetchCustomers = async () => {
    //     try {
    //         const response = await getData("api/user/get-all-user");
    //         if (response.success) setCustomers(response.data);
    //     } catch (error) {
    //         console.error("Fetch users error:", error);
    //     }
    // };

    // ── Replace the old fetchCustomers ───────────────────────────────────────────
    const fetchCustomers = async (page = 1, search = "") => {
        try {
            setCustomerLoading(true);
            const response = await getData(
                `api/user/get-all-user?page=${page}&limit=20&search=${encodeURIComponent(search)}`
            );
            if (response?.success) {
                setCustomers(response?.data);
                setCustomerTotalPages(response?.pagination?.totalPages || 1);
                setCustomerPage(page);
            }
        } catch (error) {
            console.error("Fetch users error:", error);
        } finally {
            setCustomerLoading(false);
        }
    };

    // ── Debounced search effect ───────────────────────────────────────────────────
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCustomers(1, customerSearch);
        }, 400);
        return () => clearTimeout(timer);
    }, [customerSearch]);

    // ── Keep existing useEffect for showUserModal refresh ────────────────────────
    useEffect(() => {
        fetchCustomers(1, "");
    }, [showUserModal]);

    const fetchRewardByUserId = async (id) => {
        if (!id) return;
        try {
            const response = await getData(`api/reward/get-all-rewards-by-id/${id}`);
            if (response?.success) {
                setNewOrderForm(prev => ({ ...prev, customerAvailablePoints: response.data.points }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { fetchRewardByUserId(newOrderForm?.customerId); }, [newOrderForm?.customerId]);

    const normalizeSizes = (sizes) => {
        if (!sizes) return [];
        if (Array.isArray(sizes)) return sizes;
        if (typeof sizes === "string") {
            try { const p = JSON.parse(sizes); return Array.isArray(p) ? p : []; }
            catch { return sizes.split(",").map(s => s.trim()).filter(Boolean); }
        }
        return [];
    };

    const closeModal = () => {
        setShowCreateOrderModal(false);
        setNewOrderForm(blankForm()); // ✅ consistent reset everywhere
    };

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Create New Order</h2>
                        <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 w-6 h-6 flex items-center justify-center">
                            <i className="ri-close-line" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* ── Left: Form ── */}
                        <div className="lg:col-span-2">
                            <form onSubmit={createOrder} className="space-y-4">

                                {/* Customer Information */}
                                <div>
                                    <h3 className="font-medium mb-3">Customer Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                                            <Select
                                                options={[
                                                    ...(customers ? customers.map(c => ({ value: c._id, label: c.name })) : []),
                                                    { value: "new", label: "+ Add New Customer" },
                                                ]}
                                                value={
                                                    newOrderForm?.customerId
                                                        ? { value: newOrderForm.customerId, label: customers?.find(c => c._id === newOrderForm.customerId)?.name || "+ Add New Customer" }
                                                        : null
                                                }
                                                onChange={(selected) => handleCustomerSelect(selected?.value)}
                                                placeholder="Select Customer"
                                                className="text-sm"
                                                isSearchable
                                                styles={{ control: (base) => ({ ...base, borderColor: "#374151", boxShadow: "none", "&:hover": { borderColor: "#3b82f6" } }) }}
                                            />
                                            <Button type="button" onClick={() => setShowUserModal(true)}
                                                className="bg-green-600 text-white hover:bg-green-700 px-3 py-2 flex items-center justify-center w-10 h-10 mt-2" title="Add New User">
                                                <i className="ri-user-add-line" />
                                            </Button>
                                        </div> */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>

                                            {/* ✅ Searchable paginated customer dropdown */}
                                            <div className="relative">
                                                <div
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm cursor-pointer flex justify-between items-center bg-white"
                                                    onClick={() => setShowCustomerDropdown((v) => !v)}
                                                >
                                                    <span className={newOrderForm?.customerId ? "text-gray-800" : "text-gray-400"}>
                                                        {newOrderForm?.customerId
                                                            ? customers?.find(c => c._id === newOrderForm.customerId)?.name || "Choose Customer"
                                                            : "Choose Customer"}
                                                    </span>
                                                    <i className={`ri-arrow-${showCustomerDropdown ? "up" : "down"}-s-line text-gray-500`} />
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
                                                                    <div className="inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2" />
                                                                    Loading...
                                                                </div>
                                                            ) : customers?.length === 0 ? (
                                                                <div className="text-center py-4 text-sm text-gray-400">No customers found</div>
                                                            ) : (
                                                                customers?.map((c) => (
                                                                    <div
                                                                        key={c._id}
                                                                        onClick={() => {
                                                                            handleCustomerSelect(c._id);
                                                                            setShowCustomerDropdown(false);
                                                                            setCustomerSearch("");
                                                                        }}
                                                                        className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 flex flex-col ${newOrderForm?.customerId === c._id ? "bg-blue-50 font-medium" : ""
                                                                            }`}
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
                                                                    type="button"
                                                                    disabled={customerPage <= 1}
                                                                    onClick={() => fetchCustomers(customerPage - 1, customerSearch)}
                                                                    className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
                                                                >
                                                                    ← Prev
                                                                </button>
                                                                <span>Page {customerPage} of {customerTotalPages}</span>
                                                                <button
                                                                    type="button"
                                                                    disabled={customerPage >= customerTotalPages}
                                                                    onClick={() => fetchCustomers(customerPage + 1, customerSearch)}
                                                                    className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
                                                                >
                                                                    Next →
                                                                </button>
                                                            </div>
                                                        )}

                                                        {/* ✅ Add New Customer option at bottom */}
                                                        <div
                                                            onClick={() => {
                                                                setShowUserModal(true);
                                                                setShowCustomerDropdown(false);
                                                            }}
                                                            className="px-3 py-2 text-sm cursor-pointer text-blue-600 font-medium hover:bg-blue-50 border-t flex items-center gap-2"
                                                        >
                                                            <i className="ri-user-add-line" />
                                                            + Add New Customer
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* ✅ Keep the standalone Add User button too */}
                                            {/* <Button
                                                type="button"
                                                onClick={() => setShowUserModal(true)}
                                                className="bg-green-600 text-white hover:bg-green-700 px-3 py-2 flex items-center justify-center w-10 h-10 mt-2"
                                                title="Add New User"
                                            >
                                                <i className="ri-user-add-line" />
                                            </Button> */}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <input type="email" value={newOrderForm?.customerEmail}
                                                onChange={(e) => setNewOrderForm({ ...newOrderForm, customerEmail: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                required readOnly={!!(newOrderForm?.customerId && newOrderForm.customerId !== 'new')} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                            <input type="tel" value={newOrderForm?.customerPhone}
                                                onChange={(e) => setNewOrderForm({ ...newOrderForm, customerPhone: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                required readOnly={!!(newOrderForm?.customerId && newOrderForm.customerId !== 'new')} />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                                            <textarea value={newOrderForm?.deliveryAddress}
                                                onChange={(e) => setNewOrderForm({ ...newOrderForm, deliveryAddress: e.target.value })}
                                                rows="2" maxLength="500" required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none" />
                                        </div>
                                    </div>
                                </div>

                                {/* Order Information */}
                                <div>
                                    <h3 className="font-medium mb-3">Order Information</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Order Type</label>
                                            <div className="relative">
                                                <select value={newOrderForm?.orderType}
                                                    onChange={(e) => setNewOrderForm({ ...newOrderForm, orderType: e.target.value })}
                                                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none">
                                                    <option value="Offline">Offline</option>
                                                    <option value="Online">Online</option>
                                                </select>
                                                <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Order Note</label>
                                            <input type="text" value={newOrderForm?.orderNote}
                                                onChange={(e) => setNewOrderForm({ ...newOrderForm, orderNote: e.target.value })}
                                                placeholder="Special instructions..." maxLength="200"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Transport Name</label>
                                            <input type="text" value={newOrderForm?.transportName}
                                                onChange={(e) => setNewOrderForm({ ...newOrderForm, transportName: e.target.value })}
                                                placeholder="Transport company..." maxLength="100"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" />
                                        </div>
                                    </div>
                                </div>

                                {/* Barcode Scanner & Product Selection */}
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="font-medium">Add Product Sets</h3>
                                        <Button type="button" onClick={() => setShowProductSelectionModal(true)}
                                            className="bg-green-600 text-white hover:bg-green-700 text-sm">
                                            <i className="ri-add-line mr-1" />Manual Selection
                                        </Button>
                                    </div>

                                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                                        <h4 className="font-medium text-blue-900 mb-2">QR Code / Barcode Scanner</h4>
                                        <div className="flex space-x-2">
                                            <input type="text" value={qrScanInput}
                                                onChange={(e) => handleBarcodeInputChange(e.target.value)}
                                                placeholder="Scan barcode or enter manually (auto-detects 13 digits)"
                                                className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                autoComplete="off" />
                                            <Button type="button" onClick={handleQRScan} className="bg-blue-600 text-white hover:bg-blue-700">
                                                <i className="ri-qr-scan-line mr-1" />Add
                                            </Button>
                                        </div>
                                        <div className="mt-2 space-y-1">
                                            <p className="text-xs text-blue-600">• Physical scanner: Auto-detects and adds product on 13-digit scan</p>
                                            <p className="text-xs text-blue-600">• Manual entry: Click "Add" button or press Enter</p>
                                        </div>
                                    </div>

                                    {/* Cart items */}
                                    <div className="space-y-2">
                                        {newOrderForm?.items?.map((item, index) => {
                                            const totalPcs = item.quantity * (item.pcsInSet || 0);
                                            const product = subProducts?.find(p => p._id === item.productId);
                                            return (
                                                <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                                                    <img src={product?.subProductImages?.[0] || ''} alt={item.color}
                                                        className="w-12 h-12 object-cover rounded-lg" />
                                                    <div className="flex-1">
                                                        <div className="font-medium">{item.color}</div>
                                                        <div className="text-sm text-gray-500 flex items-center gap-1">
                                                            ₹
                                                            <input type="text" pattern="[0-9]*" min="0"
                                                                value={item.singlePicPrice || 0}
                                                                onChange={(e) => updateItemSinglePicPrice(index, parseInt(e.target.value) || 1)}
                                                                className="w-16 px-1 py-0.5 border border-gray-300 rounded text-xs text-center" />
                                                            per piece
                                                        </div>
                                                        <div className="text-xs text-blue-600">
                                                            Total: {item.quantity} set{item.quantity > 1 ? 's' : ''} × {item.pcsInSet || 0} pcs = {totalPcs} pieces
                                                        </div>
                                                        <div className="flex items-center space-x-2 mt-1">
                                                            <span className="text-xs text-gray-600">Pcs per set:</span>
                                                            <div className="flex items-center space-x-1">
                                                                <button type="button"
                                                                    onClick={() => updateItemPcsInSet(index, (item.pcsInSet || 1) - 1)}
                                                                    disabled={item.pcsInSet <= 1}
                                                                    className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded text-xs hover:bg-gray-50 disabled:opacity-40">
                                                                    <i className="ri-subtract-line text-xs" />
                                                                </button>
                                                                <input type="number" min="1" value={item.pcsInSet || 1}
                                                                    onChange={(e) => updateItemPcsInSet(index, parseInt(e.target.value) || 1)}
                                                                    className="w-12 px-1 py-0.5 border border-gray-300 rounded text-xs text-center" />
                                                                <button type="button"
                                                                    onClick={() => updateItemPcsInSet(index, (item.pcsInSet || 1) + 1)}
                                                                    className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded text-xs hover:bg-gray-50">
                                                                    <i className="ri-add-line text-xs" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <button type="button"
                                                            onClick={() => updateItemQuantity(index, item.quantity - 1)}
                                                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50">
                                                            <i className="ri-subtract-line text-sm" />
                                                        </button>
                                                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                                                        <button type="button"
                                                            onClick={() => updateItemQuantity(index, item.quantity + 1)}
                                                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50">
                                                            <i className="ri-add-line text-sm" />
                                                        </button>
                                                    </div>
                                                    <div className="font-medium">
                                                        ₹{(item.quantity * item.pcsInSet * item.singlePicPrice)?.toLocaleString()}
                                                    </div>
                                                    <button type="button" onClick={() => removeItemFromOrder(index)}
                                                        className="text-red-500 hover:text-red-700 w-6 h-6 flex items-center justify-center">
                                                        <i className="ri-delete-bin-line" />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                        {newOrderForm?.items?.length === 0 && (
                                            <p className="text-gray-500 text-center py-8">No sets added yet</p>
                                        )}
                                    </div>
                                </div>

                                <CreateUserModel fetchCustomers={fetchCustomers} showUserModal={showUserModal} setShowUserModal={setShowUserModal} />

                                {/* Redeem Points */}
                                {newOrderForm?.customerAvailablePoints > 0 && getTotalValue() > 0 && (
                                    <div>
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="font-medium">Redeem Points</h3>
                                            <div className="text-sm text-blue-600">
                                                Available: {newOrderForm.customerAvailablePoints?.toLocaleString()} pts
                                            </div>
                                        </div>
                                        <div className="space-y-4 p-4 bg-orange-50 rounded-lg">
                                            <div className="text-sm text-orange-800 bg-orange-100 p-3 rounded-lg">
                                                <div className="grid grid-cols-2 gap-4 mb-2">
                                                    <div>
                                                        <span className="font-medium">Available Points:</span>
                                                        <div className="text-lg font-bold text-orange-900">
                                                            {newOrderForm.customerAvailablePoints?.toLocaleString()} pts
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Points Value:</span>
                                                        <div className="text-lg font-bold text-green-600">
                                                            ₹{calculatePointsValue(newOrderForm.customerAvailablePoints)?.toLocaleString()}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="border-t border-orange-200 pt-2">
                                                    <div className="flex justify-between mb-1"><span>Conversion Rate:</span><span className="font-medium">1 point = ₹0.50</span></div>
                                                    <div className="flex justify-between mb-1"><span>Max Redemption:</span><span className="font-medium">30% of cart value</span></div>
                                                    <div className="flex justify-between font-bold text-orange-900">
                                                        <span>Max Redeemable:</span>
                                                        <span>{calculateMaxRedeemablePoints(getTotalValue())?.toLocaleString()} pts (₹{calculatePointsValue(calculateMaxRedeemablePoints(getTotalValue()))?.toLocaleString()})</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Redeem Now</label>
                                                    <div className="flex items-center space-x-2">
                                                        <button type="button" onClick={() => handleRedeemPointsChange(newOrderForm.redeemPoints - 100)}
                                                            disabled={newOrderForm.redeemPoints <= 0}
                                                            className="w-8 h-8 flex items-center justify-center border border-orange-300 rounded-md hover:bg-orange-100 disabled:opacity-40">
                                                            <i className="ri-subtract-line text-sm" />
                                                        </button>
                                                        <input type="number" value={newOrderForm.redeemPoints || 0}
                                                            onChange={(e) => handleRedeemPointsChange(parseInt(e.target.value) || 0)}
                                                            placeholder="Enter points" min="0"
                                                            max={Math.min(calculateMaxRedeemablePoints(getTotalValue()), newOrderForm.customerAvailablePoints)}
                                                            className="flex-1 px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm" />
                                                        <button type="button" onClick={() => handleRedeemPointsChange(newOrderForm.redeemPoints + 100)}
                                                            disabled={newOrderForm.redeemPoints >= Math.min(calculateMaxRedeemablePoints(getTotalValue()), newOrderForm.customerAvailablePoints)}
                                                            className="w-8 h-8 flex items-center justify-center border border-orange-300 rounded-md hover:bg-orange-100 disabled:opacity-40">
                                                            <i className="ri-add-line text-sm" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm text-gray-600">Discount Value</div>
                                                    <div className="font-bold text-green-600 text-lg">
                                                        ₹{calculatePointsValue(newOrderForm.redeemPoints || 0).toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <Button type="button" onClick={handleRedeemMax}
                                                    disabled={newOrderForm.redeemPoints >= Math.min(calculateMaxRedeemablePoints(getTotalValue()), newOrderForm.customerAvailablePoints)}
                                                    className="bg-orange-600 text-white hover:bg-orange-700 text-sm px-4 py-2">
                                                    Max Redeem ({Math.min(calculateMaxRedeemablePoints(getTotalValue()), newOrderForm.customerAvailablePoints)?.toLocaleString()} pts)
                                                </Button>
                                                {newOrderForm.redeemPoints > 0 && (
                                                    <Button type="button" onClick={() => setNewOrderForm({ ...newOrderForm, redeemPoints: 0 })}
                                                        className="bg-gray-500 text-white hover:bg-gray-600 text-sm px-3 py-2">
                                                        Clear
                                                    </Button>
                                                )}
                                            </div>

                                            {newOrderForm.redeemPoints > 0 && (
                                                <div className="text-xs text-orange-700 bg-orange-200 p-3 rounded">
                                                    <div className="flex justify-between mb-1"><span>Redeeming:</span><span className="font-medium">{newOrderForm.redeemPoints?.toLocaleString()} points</span></div>
                                                    <div className="flex justify-between mb-1"><span>Discount:</span><span className="font-medium">₹{calculatePointsValue(newOrderForm.redeemPoints).toFixed(2)}</span></div>
                                                    <div className="flex justify-between font-bold"><span>Payable After Discount:</span><span>₹{(getTotalValue() - calculatePointsValue(newOrderForm.redeemPoints))?.toLocaleString()}</span></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Payment Information */}
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="font-medium">Payment Information</h3>
                                        <Button type="button" onClick={addPaymentMethod}
                                            className="bg-green-50 text-green-600 hover:bg-green-100 text-sm px-3 py-1">
                                            <i className="ri-add-line mr-1" />Add Payment
                                        </Button>
                                    </div>

                                    {/* Additional Discount */}
                                    <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-3">
                                        <div className="flex items-center gap-2 flex-1">
                                            <i className="ri-price-tag-3-line text-yellow-600" />
                                            <label className="text-sm font-medium text-yellow-700 whitespace-nowrap">
                                                Additional Discount (₹)
                                            </label>
                                        </div>
                                        <input type="text"
                                            value={newOrderForm?.additionalDiscount ?? ""}
                                            onChange={(e) => {
                                                const cleaned = e.target.value.replace(/[^0-9]/g, "");
                                                setNewOrderForm(prev => ({ ...prev, additionalDiscount: cleaned }));
                                            }}
                                            placeholder="0"
                                            className="w-36 px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm text-right" />
                                    </div>

                                    {/* Payment rows */}
                                    <div className="space-y-3">
                                        {newOrderForm?.payments?.map((payment, index) => (
                                            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                                <div className="flex-1">
                                                    <div className="relative">
                                                        <select value={payment.method}
                                                            onChange={(e) => updatePaymentMethod(index, "method", e.target.value)}
                                                            className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none">
                                                            <option value="Cash">Cash</option>
                                                            <option value="UPI">UPI</option>
                                                            <option value="Bank Transfer">Bank Transfer</option>
                                                            <option value="Credit Card">Credit Card</option>
                                                            <option value="Other">Other</option>
                                                        </select>
                                                        <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <input type="text" value={payment.amount}
                                                        onChange={(e) => {
                                                            const cleaned = e.target.value.replace(/[^0-9]/g, "");
                                                            updatePaymentMethod(index, "amount", cleaned);
                                                        }}
                                                        placeholder="Amount (₹)"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" />
                                                </div>
                                                {newOrderForm?.payments?.length > 1 && (
                                                    <button type="button" onClick={() => removePaymentMethod(index)}
                                                        className="text-red-500 hover:text-red-700 w-8 h-8 flex items-center justify-center">
                                                        <i className="ri-delete-bin-line" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Payment Summary */}
                                    <div className="mt-3 p-3 bg-blue-50 rounded-lg space-y-1">
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Order Value:</span>
                                            <span>₹{getTotalValue()?.toLocaleString()}</span>
                                        </div>
                                        {getAdditionalDiscount() > 0 && (
                                            <div className="flex justify-between text-sm text-yellow-700">
                                                <span>Additional Discount:</span>
                                                <span>− ₹{getAdditionalDiscount()?.toLocaleString()}</span>
                                            </div>
                                        )}
                                        {Number(newOrderForm?.redeemPoints) > 0 && (
                                            <div className="flex justify-between text-sm text-purple-700">
                                                <span>Points Redeemed:</span>
                                                <span>− ₹{calculatePointsValue(newOrderForm.redeemPoints)?.toLocaleString()}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-sm pt-1 border-t border-blue-200">
                                            <span>Total Paid:</span>
                                            <span className="font-medium text-green-600">₹{getTotalPaidAmount()?.toLocaleString()}</span>
                                        </div>
                                        {getBalanceAmount() > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span>Balance Due:</span>
                                                <span className="font-medium text-red-600">₹{getBalanceAmount()?.toLocaleString()}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-sm font-medium pt-2 border-t border-blue-200">
                                            <span>Payment Status:</span>
                                            <span className={getPaymentType() === "Complete Payment" ? "text-green-600" : "text-yellow-600"}>
                                                {getPaymentType()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex space-x-3 pt-4">
                                    <Button type="button" onClick={closeModal}
                                        className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200">
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={newOrderForm?.items?.length === 0 || loading}
                                        className="flex-1 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
                                        {loading ? 'Creating...' : 'Create Order'}
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* ── Right: Order Summary ── */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-50 p-4 rounded-lg sticky top-0">
                                <h3 className="font-medium mb-4">Order Summary</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span>Total Sets:</span>
                                        <span className="font-medium text-blue-600">{getTotalQuantity()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Total Pcs:</span>
                                        <span className="font-medium text-purple-600">{getTotalPcs()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal:</span>
                                        <span className="font-medium">₹{getTotalValue()?.toLocaleString()}</span>
                                    </div>
                                    {newOrderForm?.redeemPoints > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span>Points Discount:</span>
                                            <span className="font-medium text-green-600">
                                                − ₹{calculatePointsValue(newOrderForm.redeemPoints).toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                    {getAdditionalDiscount() > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span>Additional Discount:</span>
                                            <span className="font-medium text-yellow-600">
                                                − ₹{getAdditionalDiscount()?.toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm">
                                        <span>Total Paid:</span>
                                        <span className="font-medium text-green-600">₹{getTotalPaidAmount()?.toLocaleString()}</span>
                                    </div>
                                    {/* ✅ Fixed: was toLocaleString() - Number(...) — string - number = NaN */}
                                    <div className="flex justify-between text-sm">
                                        <span>Balance:</span>
                                        <span className="font-medium text-red-600">₹{getBalanceAmount()?.toLocaleString()}</span>
                                    </div>
                                    <div className="border-t pt-3">
                                        <div className="flex justify-between font-medium">
                                            <span>Final Amount:</span>
                                            <span className="text-lg text-blue-600">
                                                ₹{Math.max(0, getTotalValue() - calculatePointsValue(newOrderForm?.redeemPoints || 0) - getAdditionalDiscount())?.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    {getTotalValue() > 0 && (
                                        <div className="mt-4 pt-3 border-t">
                                            <div className="flex justify-between font-medium">
                                                <span>Points to Earn:</span>
                                                <span className="text-orange-600">
                                                    {calculatePointsToEarn(Math.max(0, getTotalValue() - calculatePointsValue(newOrderForm?.redeemPoints || 0) - getAdditionalDiscount()))} pts
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">₹100 = 1 point • Points expire in 90 days</div>
                                        </div>
                                    )}
                                </div>

                                {newOrderForm?.items?.length > 0 && (
                                    <div className="mt-4 pt-4 border-t">
                                        <h4 className="font-medium text-sm mb-2">Items in Order:</h4>
                                        <div className="space-y-2">
                                            {newOrderForm.items.map((item, index) => {
                                                const totalPcs = item.quantity * (item.pcsInSet || 0);
                                                const lineTotal = item.quantity * item.pcsInSet * item.singlePicPrice;
                                                return (
                                                    <div key={index} className="text-xs bg-white p-2 rounded border">
                                                        <div className="font-medium truncate">{item.color}</div>
                                                        <div className="text-gray-600">{item.quantity} sets × {item.pcsInSet} pcs = {totalPcs} pieces</div>
                                                        <div className="text-green-600 font-medium">₹{item.singlePicPrice} × {totalPcs} = ₹{lineTotal?.toLocaleString()}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateOrderModal;