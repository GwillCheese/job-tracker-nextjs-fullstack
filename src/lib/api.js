const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://job-tracker-api-production-dfd7.up.railway.app";

const handleResponse = async (res) => {
  const contentType = res.headers.get("content-type") || "";
  const hasJson = contentType.includes("application/json");
  const data = hasJson ? await res.json() : null;

  if (!res.ok) {
    const message = data?.message || "Request failed";
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }

  return data;
};

export const api = {
  register: async (email, password) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    return handleResponse(res);
  },

  login: async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    return handleResponse(res);
  },

  getJobs: async (token, filters = {}) => {
    const params = new URLSearchParams(filters);
    const query = params.toString();
    const url = query ? `${API_URL}/jobs?${query}` : `${API_URL}/jobs`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return handleResponse(res);
  },

  createJob: async (token, jobData) => {
    const res = await fetch(`${API_URL}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(jobData),
    });

    return handleResponse(res);
  },

  updateJob: async (token, jobId, jobData) => {
    const res = await fetch(`${API_URL}/jobs/${jobId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(jobData),
    });

    return handleResponse(res);
  },

  deleteJob: async (token, jobId) => {
    const res = await fetch(`${API_URL}/jobs/${jobId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    return handleResponse(res);
  },
};
