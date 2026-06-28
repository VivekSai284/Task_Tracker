import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [itemData, setItemData] = useState({ title: "", description: "", dueDate: "" });
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/items/${id}`);
      
      // Clean up the date string format for HTML5 input compatibility
      let structuredDate = "";
      if (response.data.dueDate) {
        structuredDate = response.data.dueDate.split('T')[0];
      }

      setItemData({
        title: response.data.title || "",
        description: response.data.description || "",
        dueDate: structuredDate
      });
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to load task metadata", "error");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/items/${id}`, itemData);
      showToast("Task Updated Successfully");
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to update task", "error");
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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Modify Task</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Task Title</label>
            <input
              type='text'
              placeholder='Title'
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
            <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
            <textarea
              placeholder='Description'
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
              Update Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItem;