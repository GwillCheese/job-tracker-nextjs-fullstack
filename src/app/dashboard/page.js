"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import JobCard from "@/components/JobCard";
import AddJobModal from "@/components/AddJobModal";

export default function DashboardPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const fetchJobs = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      setLoading(true);
      const filters = filter ? { status: filter } : {};
      const data = await api.getJobs(token, filters);
      const list = data?.data || data || [];
      setJobs(Array.isArray(list) ? list : []);
    } catch (err) {
      if (err?.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filter]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const filteredJobs = useMemo(() => {
    if (!searchTerm) return jobs;

    return jobs.filter((job) =>
      [job.companyName, job.jobTitle].some((value) =>
        value?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [jobs, searchTerm]);

  const stats = {
    total: jobs.length,
    applied: jobs.filter((job) => job.status === "Applied").length,
    interview: jobs.filter((job) => job.status === "Interview").length,
    offer: jobs.filter((job) => job.status === "Offer").length,
    rejected: jobs.filter((job) => job.status === "Rejected").length,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">JobTracker</h1>
          <button
            onClick={handleLogout}
            className="text-slate-600 hover:text-slate-900 text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <p className="text-sm text-slate-600 mb-1">Total</p>
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <p className="text-sm text-slate-600 mb-1">Applied</p>
            <p className="text-2xl font-bold text-blue-600">{stats.applied}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <p className="text-sm text-slate-600 mb-1">Interview</p>
            <p className="text-2xl font-bold text-purple-600">{stats.interview}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <p className="text-sm text-slate-600 mb-1">Offer</p>
            <p className="text-2xl font-bold text-green-600">{stats.offer}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <p className="text-sm text-slate-600 mb-1">Rejected</p>
            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by company or title..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
          >
            + Add Job
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-600">Loading...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">No applications yet!</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your first job application
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onDelete={fetchJobs}
                onUpdate={fetchJobs}
              />
            ))}
          </div>
        )}
      </div>

      {showAddModal ? (
        <AddJobModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            fetchJobs();
            setShowAddModal(false);
          }}
        />
      ) : null}
    </div>
  );
}
