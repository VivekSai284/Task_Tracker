import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

const EditItem = () => {
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const navigate = useNavigate();
  const [itemData, setItemData] = useState({ title: "", description: "", dueDate: "" });
  const [pageLoading, setPageLoading] = useState(true); // Loading task metadata
  const [submitting, setSubmitting] = useState(false);  // Loading submission update
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`https://task-tracker-kc3h.onrender.com/items/${id}`, {
        headers : {
          Authorization : `${token}`
        }
      });
        setItemData({
          title: response.data.title || "",
          description: response.data.description || "",
          dueDate: response.data.dueDate ? response.data.dueDate.split('T')[0] : ""
        });
      } catch (error) {
        showToast(error.response?.data?.message || "Failed to load task metadata", "error");
      } finally {
        setPageLoading(false);
      }
    };
    fetchTasks();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.put(`https://task-tracker-kc3h.onrender.com/items/${id}`, itemData, {
        headers : {
          Authorization : `${token}`
        }
      });
      showToast("Task Updated Successfully");
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to update task", "error");
      setSubmitting(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        <p className="text-sm text-gray-500 mt-3 font-medium">Loading record files...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 relative">
      {toast.show && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg text-white font-medium ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>
          {toast.message}
        </div>
      )}

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Modify Task</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Task Title</label>
            <input
              type='text' required disabled={submitting}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={itemData.title}
              onChange={(e) => setItemData({ ...itemData, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Due Date</label>
            <input
              type='date' disabled={submitting}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={itemData.dueDate}
              onChange={(e) => setItemData({ ...itemData, dueDate: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
            <textarea
              rows="4" disabled={submitting}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              value={itemData.description}
              onChange={(e) => setItemData({ ...itemData, description: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Link to="/" className="w-1/2 text-center border border-gray-200 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-50 block">Cancel</Link>
            <button 
              type='submit' 
              disabled={submitting}
              className="w-1/2 bg-indigo-600 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 disabled:bg-indigo-400"
            >
              {submitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
              {submitting ? "Updating..." : "Update Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItem;