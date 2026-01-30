"use client";

import { useEffect, useState } from "react";

export default function PrintfulProductsPage() {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(12); // Items per page
  const [activeTab, setActiveTab] = useState("store"); // 'store', 'sync', 'available_products', or 'stores'
  const [fetchMethod, setFetchMethod] = useState(""); // Track how products were fetched

  // Fetch data based on active tab
  const fetchData = async (page = 1, tab = activeTab, storeId = null, storeType = null) => {
    setLoading(true);
    setError(null);

    try {
      const offset = (page - 1) * limit;

      if (tab === "stores") {
        // Fetch stores
        const response = await fetch(`/api/printful/stores`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch stores");
        }

        setStores(data.data || []);
        setTotalPages(Math.ceil((data.count || 0) / limit) || 1);
      } else if (tab === "store") {
        // Fetch store products (catalog products)
        let endpoint = `/api/printful/store-products?limit=${limit}&offset=${offset}`;

        const response = await fetch(endpoint);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch store products");
        }

        setProducts(data.data || []);
        setTotalPages(Math.ceil((data.pagination?.total || data.data?.length || 0) / limit) || 1);
        setFetchMethod("catalog_products");
      } else if (tab === "available_products" && storeId) {
        // Fetch available products for a specific store using the new endpoint
        const response = await fetch(
          `/api/printful/store-products-by-store?storeId=${storeId}&type=${storeType}&limit=${limit}&offset=${offset}`,
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `Failed to fetch available products for store ${storeId}`);
        }

        setProducts(data.data || []);
        setTotalPages(Math.ceil((data.count || 0) / limit) || 1);
        setFetchMethod(data.methodUsed || "unknown");
      } else if (tab === "sync" && storeId) {
        // Fetch sync products for specific store
        const response = await fetch(`/api/printful/sync-products?storeId=${storeId}&limit=${limit}&offset=${offset}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `Failed to fetch sync products for store ${storeId}`);
        }

        // Handle case where sync products are not available for this store type
        if (data.hint && data.hint.includes("not support sync products")) {
          setProducts([]); // Show empty state with message
          setTotalPages(1);
          setFetchMethod("no_sync_products");
        } else {
          setProducts(data.data || []);
          setTotalPages(Math.ceil((data.pagination?.total || data.data?.length || 0) / limit) || 1);
          setFetchMethod("sync_products");
        }
      } else if (tab === "sync" && !storeId) {
        // If no store is selected for sync products, show a message
        setProducts([]);
        setTotalPages(1);
        setFetchMethod("no_store_selected");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stores on initial load
  useEffect(() => {
    const fetchInitialStores = async () => {
      try {
        const response = await fetch(`/api/printful/stores`);
        const data = await response.json();
        if (response.ok) {
          setStores(data.data || []);
          // Set the first store as selected if available
          if (data.data && data.data.length > 0) {
            setSelectedStore(data.data[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching initial stores:", err);
      }
    };

    fetchInitialStores();
  }, []);

  // Refetch data when tab or selected store changes
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when changing tabs or stores

    if ((activeTab === "sync" || activeTab === "available_products") && selectedStore) {
      fetchData(1, activeTab, selectedStore.id, selectedStore.type);
    } else {
      fetchData(1, activeTab);
    }
  }, [activeTab, selectedStore]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleStoreChange = (storeId) => {
    const store = stores.find((s) => s.id === parseInt(storeId));
    setSelectedStore(store);
  };

  // Function to handle clicking on a store to view its available products
  const handleViewStoreProducts = (store) => {
    setSelectedStore(store);
    setActiveTab("available_products"); // Switch to available products view
  };

  // Function to get descriptive text based on fetch method and store type
  const getMethodDescription = () => {
    const storeType = selectedStore?.type || "";
    const isSyncSupported = ["squarespace", "shopify", "woocommerce", "bigcommerce", "wix"].includes(storeType);

    switch (fetchMethod) {
      case "sync_products":
        return "Showing actual products synced to this store";
      case "catalog_products_fallback":
      case "catalog_products_fallback_native":
        if (storeType === "native") {
          return "Native Printful stores use the general catalog. These are products available to be added to your store.";
        } else if (!isSyncSupported) {
          return `Store type '${storeType}' does not support sync products. Showing available products from Printful catalog.`;
        }
        return "Showing available products from Printful catalog (these can be added to your store)";
      case "catalog_products":
        return "Showing general Printful catalog products";
      case "no_sync_products":
        if (storeType === "native") {
          return "Native Printful stores don't use sync products. They use the general catalog instead.";
        } else if (!isSyncSupported) {
          return `Store type '${storeType}' does not support sync products.`;
        }
        return "This store type does not support sync products";
      default:
        return "Showing available products";
    }
  };

  // Function to check if sync products are supported for current store
  const isSyncSupportedForStore = (store) => {
    if (!store) return false;
    const syncSupportedTypes = ["squarespace", "shopify", "woocommerce", "bigcommerce", "wix"];
    return syncSupportedTypes.includes(store.type);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Printful Management</h1>

          {/* Tab Navigation */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "store"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("store")}
              >
                Store Products
              </button>
              <button
                className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "sync"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("sync")}
              >
                Sync Products
              </button>
              <button
                className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "available_products"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => {
                  setActiveTab("available_products");
                  if (stores.length > 0 && !selectedStore) {
                    setSelectedStore(stores[0]);
                  }
                }}
              >
                Available Products
              </button>
              <button
                className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "stores"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("stores")}
              >
                Stores
              </button>
            </nav>
          </div>

          {/* Store Selection Dropdown */}
          {(activeTab === "sync" || activeTab === "available_products") && stores.length > 0 && (
            <div className="mb-6">
              <label htmlFor="store-select" className="block text-sm font-medium text-gray-700 mb-2">
                Select Store:
              </label>
              <select
                id="store-select"
                value={selectedStore?.id || ""}
                onChange={(e) => handleStoreChange(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name} (ID: {store.id})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Printful Management</h1>

          {/* Tab Navigation */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "store"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("store")}
              >
                Store Products
              </button>
              <button
                className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "sync"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("sync")}
              >
                Sync Products
              </button>
              <button
                className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "available_products"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => {
                  setActiveTab("available_products");
                  if (stores.length > 0 && !selectedStore) {
                    setSelectedStore(stores[0]);
                  }
                }}
              >
                Available Products
              </button>
              <button
                className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "stores"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("stores")}
              >
                Stores
              </button>
            </nav>
          </div>

          {/* Store Selection Dropdown */}
          {(activeTab === "sync" || activeTab === "available_products") && stores.length > 0 && (
            <div className="mb-6">
              <label htmlFor="store-select" className="block text-sm font-medium text-gray-700 mb-2">
                Select Store:
              </label>
              <select
                id="store-select"
                value={selectedStore?.id || ""}
                onChange={(e) => handleStoreChange(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name} (ID: {store.id})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Printful Management</h1>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === "store"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("store")}
            >
              Store Products
            </button>
            <button
              className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === "sync"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } ${!isSyncSupportedForStore(selectedStore) ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => {
                if (isSyncSupportedForStore(selectedStore)) {
                  setActiveTab("sync");
                  if (stores.length > 0 && !selectedStore) {
                    setSelectedStore(stores[0]); // Auto-select first store if none selected
                  }
                }
              }}
              disabled={!isSyncSupportedForStore(selectedStore)}
              title={
                !isSyncSupportedForStore(selectedStore)
                  ? `Sync products not supported for ${selectedStore?.type || "this"} store type`
                  : ""
              }
            >
              Sync Products
            </button>
            <button
              className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === "available_products"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => {
                setActiveTab("available_products");
                if (stores.length > 0 && !selectedStore) {
                  setSelectedStore(stores[0]); // Auto-select first store if none selected
                }
              }}
            >
              Available Products
            </button>
            <button
              className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === "stores"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("stores")}
            >
              Stores
            </button>
          </nav>
        </div>

        {/* Store Selection Dropdown */}
        {(activeTab === "sync" || activeTab === "available_products") && stores.length > 0 && (
          <div className="mb-6">
            <label htmlFor="store-select" className="block text-sm font-medium text-gray-700 mb-2">
              Select Store:
            </label>
            <select
              id="store-select"
              value={selectedStore?.id || ""}
              onChange={(e) => handleStoreChange(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name} (ID: {store.id}, Type: {store.type})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Information Banner */}
        {(activeTab === "sync" || activeTab === "available_products") && selectedStore && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Product Information</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>{getMethodDescription()}</p>
                  {fetchMethod.includes("catalog") && (
                    <p className="mt-1">
                      These are products available from Printful that can be added to your store. They may not currently
                      be in your store inventory.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "sync" && !selectedStore && (
          <div
            className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            <strong className="font-bold">Notice: </strong>
            <span className="block sm:inline">Please select a store to view its sync products.</span>
          </div>
        )}

        {activeTab === "available_products" && !selectedStore && (
          <div
            className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            <strong className="font-bold">Notice: </strong>
            <span className="block sm:inline">Please select a store to view its available products.</span>
          </div>
        )}

        {(activeTab === "sync" || activeTab === "available_products") &&
          selectedStore &&
          products.length === 0 &&
          !loading &&
          fetchMethod !== "no_sync_products" && (
            <div
              className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-6"
              role="alert"
            >
              <strong className="font-bold">Note: </strong>
              <span className="block sm:inline">
                No products found for {selectedStore.name} ({selectedStore.type}). This store type may not support the
                requested product type.
              </span>
            </div>
          )}

        {activeTab === "stores" ? (
          // Render stores
          stores.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No stores found.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {stores.map((store) => (
                  <div
                    key={store.id}
                    className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 ${
                      selectedStore?.id === store.id ? "ring-2 ring-indigo-500" : ""
                    }`}
                  >
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{store.name}</h3>
                      <p className="text-sm text-gray-500 mb-1">
                        <span className="font-medium">ID:</span> {store.id}
                      </p>
                      <p className="text-sm text-gray-500 mb-1">
                        <span className="font-medium">Type:</span> {store.type}
                      </p>
                      <p className="text-sm text-gray-500 mb-2">
                        <span className="font-medium">Status:</span> {store.status || "Active"}
                      </p>
                      <div className="text-xs text-gray-400">
                        <p>Connected: {new Date(store.created).toLocaleDateString()}</p>
                      </div>
                      <button
                        onClick={() => handleViewStoreProducts(store)}
                        className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        View Available Products
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )
        ) : products.length === 0 && !["sync", "available_products"].includes(activeTab) ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No {activeTab} products found.</p>
          </div>
        ) : (
          // Render products
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing products for:{" "}
              <span className="font-semibold">
                {activeTab === "sync" && selectedStore
                  ? `${selectedStore.name} (Sync Products)`
                  : activeTab === "available_products" && selectedStore
                    ? `${selectedStore.name} - Available Products (ID: ${selectedStore.id}, Type: ${selectedStore.type})`
                    : "All Stores (Catalog)"}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {products.map((product) => (
                <div
                  key={product.id || product.sync_product_id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="p-4">
                    {(product.image || product.thumbnail_url) && (
                      <img
                        src={product.image || product.thumbnail_url}
                        alt={product.title || product.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.title || product.name || "Untitled Product"}
                    </h3>
                    <p className="text-sm text-gray-500 mb-1">
                      <span className="font-medium">Type:</span> {product.type_name || product.type || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      <span className="font-medium">Variants:</span>{" "}
                      {product.variant_count || (product.variants && product.variants.length) || 0}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xs text-gray-400">ID: {product.id || product.sync_product_id}</span>
                      <span className="text-xs text-gray-400">{product.currency || "USD"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Previous
                </button>

                <span className="mx-2 text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
