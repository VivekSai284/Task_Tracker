import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const Home = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [confirmModal, setConfirmModal] = useState({ show: false, id: null, type: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/items');
      setItems(response.data);
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to fetch tasks", "error");
    }
  };

  const requestConfirmation = (id, type) => {
    setConfirmModal({ show: true, id, type });
  };

  const handleConfirmAction = async () => {
    const { id, type } = confirmModal;
    setConfirmModal({ show: false, id: null, type: "" });

    if (type === "delete") {
      try {
        await axios.delete(`http://localhost:5000/items/${id}`);
        fetchItems();
        showToast("Item deleted successfully");
      } catch (error) {
        showToast(error.response?.data?.message || "Failed to delete task", "error");
      }
    } else if (type === "complete") {
      try {
        const currentItem = items.find(item => item._id === id);
        await axios.put(`http://localhost:5000/items/${id}`, {
          title: currentItem.title,
          description: currentItem.description,
          dueDate: currentItem.dueDate,
          status: "Completed"
        });
        fetchItems();
        showToast("Task completed!");
      } catch (error) {
        showToast(error.response?.data?.message || "Failed to update task", "error");
      }
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = items.filter(item => {
    const query = searchQuery.toLowerCase();
    const matchesTitle = item.title?.toLowerCase().includes(query);
    const matchesDescription = item.description?.toLowerCase().includes(query);
    return matchesTitle || matchesDescription;
  });

  // Helper function to dynamically check if a task is overdue
  const checkOverdue = (dateString, isCompleted) => {
    if (!dateString || isCompleted) return { overdue: false, formatted: "" };
    
    const targetDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Strip time parameters to focus on day accuracy

    const formatted = targetDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    return {
      overdue: targetDate < today,
      formatted
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navbar />

      {/* Toast Alert */}
      {toast.show && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300 ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>
          {toast.message}
        </div>
      )}

      {/* Reconfirmation Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Are you sure?</h3>
            <p className="text-gray-500 text-sm mb-5">
              {confirmModal.type === "delete" 
                ? "This will permanently delete this task tracker item." 
                : "Do you want to mark this task as completed?"}
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setConfirmModal({ show: false, id: null, type: "" })}
                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmAction}
                className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition ${confirmModal.type === "delete" ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"}`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto p-6 md:p-12">
        
        {/* Top Dashboard Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Task Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Manage, search, and update your assignments.</p>
          </div>
          <Link to={'/add'} className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg transition shadow-sm gap-2 whitespace-nowrap">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Task
          </Link>
        </div>

        {/* Real-time Search Input Section */}
        {items.length > 0 && (
          <div className="relative mb-8 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition shadow-sm placeholder-gray-400"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 text-xs font-medium"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Task Item Render Flow */}
        {items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-lg">No tasks found. Get started by adding a task!</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-lg">No tasks match your search query: "{searchQuery}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredItems.map(item => {
              const isCompleted = item.status === 'Completed';
              const dateDetails = checkOverdue(item.dueDate, isCompleted);

              return (
                <div 
                  key={item._id} 
                  className={`p-6 rounded-xl border transition-all flex flex-col justify-between ${
                    isCompleted 
                      ? 'bg-emerald-50/60 border-emerald-200 shadow-none' 
                      : dateDetails.overdue 
                        ? 'bg-red-50/40 border-red-200 shadow-sm'
                        : 'bg-white border-gray-100 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div>
                    {/* Title & Dynamic Badging Status */}
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <h3 className={`text-xl font-bold line-clamp-1 ${isCompleted ? 'line-through text-emerald-800/50' : 'text-gray-800'}`}>
                        {item.title}
                      </h3>
                      <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full uppercase tracking-wider ${
                        isCompleted 
                          ? 'bg-emerald-200 text-emerald-800' 
                          : dateDetails.overdue
                            ? 'bg-red-200 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isCompleted ? "Completed" : dateDetails.overdue ? "Overdue" : "Pending"}
                      </span>
                    </div>
                    
                    <p className={`text-sm mb-4 line-clamp-3 whitespace-pre-wrap ${isCompleted ? 'text-emerald-700/60' : 'text-gray-600'}`}>
                      {item.description || "No description provided."}
                    </p>

                    {/* Display Due Date UI Tag */}
                    {item.dueDate && (
                      <div className="flex items-center gap-1.5 text-xs font-medium mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${dateDetails.overdue ? 'text-red-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 3V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className={isCompleted ? 'text-emerald-700/40' : dateDetails.overdue ? 'text-red-600 font-bold' : 'text-gray-500'}>
                          Due: {isCompleted ? new Date(item.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : dateDetails.formatted}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Operational Footer Actions */}
                  <div className={`flex items-center justify-between border-t pt-4 mt-auto ${isCompleted ? 'border-emerald-200/50' : 'border-gray-100'}`}>
                    <div>
                      {!isCompleted && (
                        <button 
                          onClick={() => requestConfirmation(item._id, "complete")}
                          className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition"
                        >
                          Mark as Completed
                        </button>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {!isCompleted && (
                        <Link to={`/edit/${item._id}`} className="text-sm font-medium text-gray-400 hover:text-indigo-600 transition">
                          Edit
                        </Link>
                      )}
                      <button 
                        onClick={() => requestConfirmation(item._id, "delete")} 
                        className={`text-sm font-medium transition ${isCompleted ? 'text-emerald-600 hover:text-red-600' : 'text-red-400 hover:text-red-600'}`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;