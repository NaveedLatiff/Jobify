"use client";

import React, { useState, useEffect, useContext } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Axios from '../../../../axios';
import { AuthContext } from '@/context/AuthContext.js';
import { toast } from 'react-toastify';
import Loader from '@/components/Loader';

const EditJob = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [hasSalary, setHasSalary] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'RECRUITER') {
        router.push('/');
      }
    }
  }, [user, authLoading, router]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    companyName: "",
    jobType: "Full-time",
  });

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const { data } = await Axios.get(`/job/${id}`);
        if (data.success) {
          const job = data.job;
          setFormData({
            title: job.title,
            description: job.description,
            location: job.location,
            salary: job.salary || "",
            companyName: job.companyName,
            jobType: job.jobType,
          });
          if (job.salary) setHasSalary(true);
        }
      } catch (error) {
        console.error("Error fetching job:", error);
        toast.error("Could not load job details", { position: "bottom-right" });
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchJobDetails();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      salary: hasSalary ? formData.salary : null,
    };

    try {
      const { data } = await Axios.put(`/job/update-job/${id}`, payload);
      if (data.success) {
        toast.success("Job updated successfully!", { position: "bottom-right" });
        setTimeout(() => router.push("/posted-jobs"), 1000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed", { position: "bottom-right" });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user || user.role !== 'RECRUITER') return <div className="fixed inset-0 flex items-center justify-center bg-black"><Loader/></div>;

  if (fetching) return (
    <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center bg-black/88">
      <p className="text-slate-400 text-sm">Loading job details...</p>
    </div>
  );

  const inputClass = "w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-purple-500/50 transition-all duration-200";
  const labelClass = "block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5";

  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center bg-black/88 px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl px-8 py-8">

          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Edit <span className="text-purple-400">Job Listing</span>
            </h2>
            <p className="text-slate-400 text-sm mt-1.5">Update the information for this position</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Job Title</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Frontend Developer"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Company Name</label>
                <input
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  placeholder="TechCorp"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Location</label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="Remote / New York"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Job Type</label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="Full-time" className="bg-slate-900">Full-time</option>
                  <option value="Part-time" className="bg-slate-900">Part-time</option>
                  <option value="Contract" className="bg-slate-900">Contract</option>
                </select>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-300">Salary Details</p>
                  <p className="text-xs text-slate-500">Would you like to show the salary range?</p>
                </div>
                <button
                  type="button"
                  onClick={() => setHasSalary(!hasSalary)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 cursor-pointer ${hasSalary ? 'bg-purple-600' : 'bg-white/10'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${hasSalary ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              {hasSalary && (
                <div className="mt-3">
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    placeholder="e.g. $70k - $90k / year"
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              )}
            </div>

            <div>
              <label className={labelClass}>Job Description</label>
              <textarea
                name="description"
                value={formData.description}
                rows="5"
                onChange={handleChange}
                required
                placeholder="Explain the role and requirements..."
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] py-2.5 rounded-lg bg-gradient-to-r from-purple-900 via-purple-700 to-purple-500 hover:from-purple-800 hover:via-purple-600 hover:to-purple-400 active:scale-[0.98] text-white text-sm font-semibold tracking-wide transition-all duration-200 shadow-lg shadow-purple-900/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditJob;