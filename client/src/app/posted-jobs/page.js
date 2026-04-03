"use client";

import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext.js';
import Axios from '../../../axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Loader from '@/components/Loader';
import { toast } from 'react-toastify';

const PostedJob = () => {
  const { user, loading } = useContext(AuthContext);
  const [myJobs, setMyJobs] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [deleteJobId, setDeleteJobId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'RECRUITER')) {
      router.push('/');
      return;
    }

    const fetchMyJobs = async () => {
      try {
        const { data } = await Axios.get('/job/get-posted-jobs');
        if (data.success) {
          setMyJobs(data.jobs);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setFetching(false);
      }
    };

    if (user) fetchMyJobs();
  }, [user, loading, router]);

  const handleDelete = async () => {
    try {
      const { data } = await Axios.delete(`/job/delete-job/${deleteJobId}`);
      if (data.success) {
        toast.success(data.message, { position: "bottom-right" });
        setMyJobs(myJobs.filter(job => job.id !== deleteJobId));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete job", { position: "bottom-right" });
    } finally {
      setDeleteJobId(null);
    }
  };

  if (loading || fetching) return <div className="fixed inset-0 flex items-center justify-center bg-black"><Loader /></div>;

  return (
    <div className="min-h-screen w-full bg-black/88 px-4 py-10">
      <div className="max-w-6xl mx-auto">

        {deleteJobId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteJobId(null)} />
            <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8 w-full max-w-sm flex flex-col items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-white font-semibold text-lg">Delete Job</h3>
                <p className="text-slate-400 text-sm mt-1">Are you sure you want to delete this job? This action cannot be undone.</p>
              </div>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setDeleteJobId(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-150 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all duration-150 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-white">Posted <span className='text-purple-800 underline'>Jobs</span></h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              {myJobs.length} active {myJobs.length === 1 ? "listing" : "listings"}
            </p>
          </div>
          <Link href="/post-job">
            <button className="text-xs sm:text-sm text-white bg-gradient-to-r from-purple-900 via-purple-700 to-purple-500 hover:from-purple-800 hover:via-purple-600 hover:to-purple-400 cursor-pointer font-medium px-4 py-2 sm:px-6 sm:py-2.5 rounded-3xl transition-all duration-200 active:scale-95">
              <span className="hidden sm:inline">+ Post New Job</span>
              <span className="sm:hidden">+ Post Job</span>
            </button>
          </Link>
        </div>

        {myJobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {myJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col justify-between gap-5 hover:border-purple-500/40 hover:bg-white/8 transition-all duration-200"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-white font-semibold text-lg leading-tight">{job.title}</h2>
                    <span className="text-xs text-slate-500 whitespace-nowrap pt-1">
                      {new Date(job.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                      {job.location}
                    </span>
                    <span className="text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                      {job.jobType}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t border-white/10 pt-4">
                  <button
                    onClick={() => router.push(`/applications/${job.id}`)}
                    className="flex-1 text-xs font-semibold text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 py-2 rounded-xl transition-all duration-150 cursor-pointer"
                  >
                    Applicants
                  </button>
                  <button
                    onClick={() => router.push(`/edit-job/${job.id}`)}
                    className="flex-1 text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 py-2 rounded-xl transition-all duration-150 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteJobId(job.id)}
                    className="flex-1 text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 py-2 rounded-xl transition-all duration-150 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <p className="text-slate-500 text-lg">No jobs posted yet.</p>
            <Link href="/post-job">
              <button className="text-sm text-white bg-gradient-to-r from-purple-900 via-purple-700 to-purple-500 cursor-pointer font-medium px-6 py-2.5 rounded-3xl transition-all duration-200">
                Post your first job
              </button>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default PostedJob;