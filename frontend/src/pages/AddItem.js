import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const AddItem = () => {
  const [itemData, setItemData] = useState({ title: "", description: "", dueDate: "" });
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/items/create', itemData);
      showToast("Task Added Successfully!");
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to create task", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 relative">
      {toast.show && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300 ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>
          {toast.message}
        </div>
      )}

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Task</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Task Title</label>
            <input
              type='text'
              placeholder='What needs to be done?'
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              value={itemData.title}
              onChange={(e) => setItemData({ ...itemData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Due Date</label>
            <input
              type='date'
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-700"
              value={itemData.dueDate}
              onChange={(e) => setItemData({ ...itemData, dueDate: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Description (Optional)</label>
            <textarea
              placeholder='Add details or notes...'
              rows="4"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
              value={itemData.description}
              onChange={(e) => setItemData({ ...itemData, description: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Link to="/" className="w-1/2 text-center border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-lg transition">
              Cancel
            </Link>
            <button type='submit' className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition shadow-sm">
              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItem;