"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function JobCard({ job, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    companyName: job.companyName,
    jobTitle: job.jobTitle,
    status: job.status,
  });
  const [loading, setLoading] = useState(false);

  const statusColors = {
    Applied: "bg-blue-100 text-blue-700 border-blue-200",
    Interview: "bg-purple-100 text-purple-700 border-purple-200",
    Offer: "bg-green-100 text-green-700 border-green-200",
    Rejected: "bg-red-100 text-red-700 border-red-200",
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this application?")) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await api.deleteJob(token, job.id);
      onDelete();
    } catch (err) {
      alert("Failed to delete job");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await api.updateJob(token, job.id, editData);
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      alert("Failed to update job");
    } finally {
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              value={editData.companyName}
              onChange={(event) =>
                setEditData({ ...editData, companyName: event.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Job Title
            </label>
            <input
              type="text"
              value={editData.jobTitle}
              onChange={(event) =>
                setEditData({ ...editData, jobTitle: event.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Status
            </label>
            <select
              value={editData.status}
              onChange={(event) =>
                setEditData({ ...editData, status: event.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            {job.jobTitle}
          </h3>
          <p className="text-slate-600 mb-3">{job.companyName}</p>
          <span
            className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${
              statusColors[job.status]
            }`}
          >
            {job.status}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
      {job.createdAt ? (
        <p className="text-xs text-slate-500 mt-3">
          Added {new Date(job.createdAt).toLocaleDateString()}
        </p>
      ) : null}
    </div>
  );
}
