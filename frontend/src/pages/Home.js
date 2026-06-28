import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const Home = () => {
  const token = localStorage.getItem("token");
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [confirmModal, setConfirmModal] = useState({ show: false, id: null, type: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://task-tracker-kc3h.onrender.com/items', {
        headers : {
          Authorization : `${token}`
        }
      });
      setItems(response.data);
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to fetch tasks", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const requestConfirmation = (id, type) => {
    setConfirmModal({ show: true, id, type });
  };

  const handleConfirmAction = async () => {
    const { id, type } = confirmModal;
    setConfirmModal({ show: false, id: null, type: "" });
    setIsLoading(true);

    if (type === "delete") {
      try {
        await axios.delete(`https://task-tracker-kc3h.onrender.com/items/${id}`, {
        headers : {
          Authorization : `${token}`
        }
      });
        await fetchItems();
        showToast("Item deleted successfully");
      } catch (error) {
        showToast(error.response?.data?.message || "Failed to delete task", "error");
        setIsLoading(false);
      }
    } else if (type === "complete") {
      try {
        const currentItem = items.find(item => item._id === id);
        await axios.put(`https://task-tracker-kc3h.onrender.com/items/${id}`, {
          title: currentItem.title,
          description: currentItem.description,
          dueDate: currentItem.dueDate,
          status: "Completed"
        }, {
        headers : {
          Authorization : `${token}`
        }
      });
        await fetchItems();
        showToast("Task completed!");
      } catch (error) {
        showToast(error.response?.data?.message || "Failed to update task", "error");
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = items.filter(item => {
    const query = searchQuery.toLowerCase();
    return item.title?.toLowerCase().includes(query) || item.description?.toLowerCase().includes(query);
  });

  const checkOverdue = (dateString, isCompleted) => {
    if (!dateString || isCompleted) return { overdue: false, formatted: "" };
    const targetDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return {
      overdue: targetDate < today,
      formatted: targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navbar />

      {toast.show && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg text-white font-medium ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>
          {toast.message}
        </div>
      )}

      {confirmModal.show && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Are you sure?</h3>
            <p className="text-gray-500 text-sm mb-5">
              {confirmModal.type === "delete" ? "This will permanently delete this task." : "Mark this task as completed?"}
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmModal({ show: false, id: null, type: "" })} className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={handleConfirmAction} className={`px-4 py-2 text-white rounded-lg text-sm font-medium ${confirmModal.type === "delete" ? "bg-red-600" : "bg-emerald-600"}`}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto p-6 md:p-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Task Dashboard</h1>
          </div>
          <Link to={'/add'} className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm gap-2">Add Task</Link>
        </div>

        {items.length > 0 && (
          <div className="relative mb-8 max-w-md">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}

        {isLoading ? (
          /* Visual Spinner Loading Blocks */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-sm text-gray-500 mt-4 font-medium">Syncing dashboard data...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-400 text-lg">No tasks found.</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-400 text-lg">No matches found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredItems.map(item => {
              const isCompleted = item.status === 'Completed';
              const dateDetails = checkOverdue(item.dueDate, isCompleted);

              return (
                <div key={item._id} className={`p-6 rounded-xl border flex flex-col justify-between ${isCompleted ? 'bg-emerald-50/60 border-emerald-200' : dateDetails.overdue ? 'bg-red-50/40 border-red-200' : 'bg-white border-gray-100 shadow-sm'}`}>
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <h3 className={`text-xl font-bold line-clamp-1 ${isCompleted ? 'line-through text-emerald-800/50' : 'text-gray-800'}`}>{item.title}</h3>
                      <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full uppercase ${isCompleted ? 'bg-emerald-200 text-emerald-800' : dateDetails.overdue ? 'bg-red-200 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                        {isCompleted ? "Completed" : dateDetails.overdue ? "Overdue" : "Pending"}
                      </span>
                    </div>
                    <p className={`text-sm mb-4 line-clamp-3 whitespace-pre-wrap ${isCompleted ? 'text-emerald-700/60' : 'text-gray-600'}`}>{item.description}</p>
                    {item.dueDate && (
                      <div className="text-xs font-medium mb-6 text-gray-500">
                        Due: {new Date(item.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between border-t pt-4 border-gray-100">
                    <div>{!isCompleted && <button onClick={() => requestConfirmation(item._id, "complete")} className="text-sm font-semibold text-emerald-600">Mark Completed</button>}</div>
                    <div className="flex items-center gap-4">
                      {!isCompleted && <Link to={`/edit/${item._id}`} className="text-sm font-medium text-gray-400 hover:text-indigo-600">Edit</Link>}
                      <button onClick={() => requestConfirmation(item._id, "delete")} className="text-sm font-medium text-red-400">Delete</button>
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