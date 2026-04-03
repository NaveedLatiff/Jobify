"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Axios from '../../../axios';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';

const AppliedJobs = () => {
  const { user, loading } = useAuth();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'APPLICANT')) {
      router.push('/');
      return;
    }

    const fetchAppliedJobs = async () => {
      try {
        const { data } = await Axios.get('/applicant/applied-jobs');
        if (data.success) {
          setAppliedJobs(data.applications);
        }
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      } finally {
        setFetching(false);
      }
    };

    if (user) fetchAppliedJobs();
  }, [user, loading, router]);

  if (loading || fetching) return <div className="fixed inset-0 flex items-center justify-center bg-black"><Loader /></div>;

  return (
    <div className="min-h-screen w-full bg-black/88 px-4 py-10">
      <div className="max-w-6xl mx-auto">

       <div className="mb-8">
          <h1 className="text-lg sm:text-2xl font-bold text-white">
            Applied <span className="text-purple-800 underline">Jobs</span>
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            {appliedJobs.length} {appliedJobs.length === 1 ? "application" : "applications"} submitted
          </p>
        </div>

        {appliedJobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {appliedJobs.map((app) => (
              <div
                key={app.id}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col justify-between gap-5 hover:border-purple-500/40 hover:bg-white/8 transition-all duration-200"
              >
                <div className="flex flex-col gap-3">
            
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-white font-semibold text-base leading-tight">
                      {app.job?.title || "N/A"}
                    </h2>
                    <span className="text-xs text-slate-500 whitespace-nowrap pt-0.5">
                      {new Date(app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                      {app.job?.companyName || "Company"}
                    </span>
                    {app.job?.location && (
                      <span className="text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                        {app.job.location}
                      </span>
                    )}
                    {app.job?.jobType && (
                      <span className="text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                        {app.job.jobType}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-slate-500 text-xs">Status</span>
                  <span className="text-xs font-semibold text-slate-300 bg-white/5 border border-white px-3 py-1 rounded-full">
                    {app.status || 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <p className="text-slate-500 text-lg">You haven't applied to any jobs yet.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default AppliedJobs;