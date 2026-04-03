"use client";

import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Axios from '../../../axios';
import { AuthContext } from '@/context/AuthContext.js';
import { toast } from 'react-toastify';
import Loader from '@/components/Loader';

const PostJob = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hasSalary, setHasSalary] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role === 'APPLICANT') {
        router.push("/");
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
      const { data } = await Axios.post("/job/post-job", payload);
      if (data.success) {
        toast.success("Job Posted!", { position: "bottom-right" });
        setTimeout(() => router.push("/posted-jobs"), 1000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error occurred", { position: "bottom-right" });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user || user.role === 'APPLICANT') return <div className="fixed inset-0 flex items-center justify-center bg-black"><Loader /></div>;

  const inputClass = "w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-purple-500/50 transition-all duration-200";
  const labelClass = "block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5";

  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center bg-black/88 px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl px-8 py-8">

          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Post a <span className="text-purple-400">Job</span>
            </h2>
            <p className="text-slate-400 text-sm mt-1.5">Fill out the details to find your next teammate</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Job Title</label>
                <input
                  name="title"
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
                  className={`w-11 h-6 flex items-center cursor-pointer rounded-full p-1 transition-colors duration-300 ${hasSalary ? 'bg-purple-600' : 'bg-white/10'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${hasSalary ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              {hasSalary && (
                <div className="mt-3">
                  <input
                    type="text"
                    name="salary"
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
                rows="5"
                onChange={handleChange}
                required
                placeholder="Explain the role and requirements..."
                className={`${inputClass} resize-none`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-1 rounded-lg bg-gradient-to-r from-purple-900 via-purple-700 to-purple-500 hover:from-purple-800 hover:via-purple-600 hover:to-purple-400 active:scale-[0.98] text-white text-sm font-semibold tracking-wide transition-all duration-200 shadow-lg shadow-purple-900/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Publishing..." : "Post Job Listing"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;