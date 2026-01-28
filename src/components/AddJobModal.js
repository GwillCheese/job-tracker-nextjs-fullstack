"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function AddJobModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    companyName: "",
    jobTitle: "",
    status: "Applied",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      await api.createJob(token, formData);
      onSuccess();
    } catch (err) {
      setError(err?.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-900">Add New Application</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Company Name *
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(event) =>
                setFormData({ ...formData, companyName: event.target.value })
              }
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Google"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Job Title *
            </label>
            <input
              type="text"
              value={formData.jobTitle}
              onChange={(event) =>
                setFormData({ ...formData, jobTitle: event.target.value })
              }
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Software Engineer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(event) =>
                setFormData({ ...formData, status: event.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {error ? (
            <div className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm">
              {error}
            </div>
          ) : null}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Application"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
