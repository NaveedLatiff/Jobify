"use client";

import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext.js';
import Axios from '../../axios';
import Loader from '@/components/Loader';

const Home = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user?.role === 'RECRUITER') {
      router.push('/posted-jobs');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await Axios.get('/job/all-jobs');
        setJobs(data.jobs);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleAction = (jobId) => {
    if (!user) {
      router.push('/login');
      return;
    }
    router.push(`/apply/${jobId}`);
  };

  if (user?.role === 'RECRUITER') return null;

  if (authLoading || loading) return <div className="fixed inset-0 flex items-center justify-center bg-black"><Loader /></div>;

  return (
    <div className="min-h-screen w-full bg-black/88 px-4 py-10">
      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-white">
              Available <span className="text-purple-800 underline">Jobs</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              {jobs.length} active {jobs.length === 1 ? "listing" : "listings"}
            </p>
          </div>
        </div>

        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job) => (
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
                      {job.companyName}
                    </span>
                    <span className="text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                      {job.location}
                    </span>
                    {job.jobType && (
                      <span className="text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                        {job.jobType}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t border-white/10 pt-4">
                  <button
                    onClick={() => handleAction(job.id)}
                    className="flex-1 text-xs font-semibold text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 py-2 rounded-xl transition-all duration-150 cursor-pointer"
                
                >
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <p className="text-slate-500 text-lg">No jobs available right now.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Home;