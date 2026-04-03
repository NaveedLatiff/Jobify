"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Axios from '../../../../axios';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/Loader';

const JobApplications = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const statuses = ["pending", "accepted", "rejected"];

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'RECRUITER') {
        router.push('/');
      }
    }
  }, [user, authLoading, router]);

  const formatResumeUrl = (url) => {
    if (!url) return "#";
    if (url.includes("cloudinary.com")) {
      return url.replace("/image/upload/", "/raw/upload/");
    }
    return url;
  };

  const fetchApplications = async () => {
    try {
      const { data } = await Axios.get(`/applicant/applications/${id}`);
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'RECRUITER') fetchApplications();
  }, [id, user]);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      const { data } = await Axios.put(`/applicant/update/${applicationId}`, {
        status: newStatus
      });

      if (data.success) {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === applicationId ? { ...app, status: newStatus } : app
          )
        );
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  if (authLoading || !user || user.role !== 'RECRUITER') return <div className="fixed inset-0 flex items-center justify-center bg-black"><Loader /></div>;
  
  return (
    <div className="min-h-screen w-full mx-auto p-3 sm:p-6 bg-black/88">
      <div className="mb-8">
        <h1 className="text-lg sm:text-2xl font-bold text-white">Job <span className='text-purple-800 underline'>Applicants</span></h1>
        <p className="text-slate-500 text-[10px] sm:text-sm mt-1">
          Review resumes and update candidate statuses.
        </p>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <table className="w-full text-left border-collapse table-fixed sm:table-auto">
          <thead className="border-b border-slate-100">
            <tr>
              <th className="p-3 sm:p-5 font-black text-[10px] sm:text-xs uppercase tracking-widest text-white w-[45%] sm:w-auto">Candidate</th>
              <th className="p-3 sm:p-5 font-black text-[10px] sm:text-xs uppercase tracking-widest text-white">Resume</th>
             <th className="hidden sm:table-cell p-5 font-black text-xs uppercase tracking-widest text-white">Status</th>
              <th className="p-3 sm:p-5 font-black text-[10px] sm:text-xs uppercase tracking-widest text-white text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.length > 0 ? (
              applications.map((app) => (
                <tr key={app.id} className="hover:bg-purple-700/40 transition-colors group border-b border-slate-500 last:border-0">
                  <td className="p-3 sm:p-5">
                    <div className="font-bold text-purple-400 text-[11px] sm:text-base truncate">{app.user?.name}</div>
                    <div className="text-[10px] sm:text-sm text-white font-medium truncate opacity-80">{app.user?.email}</div>
                  </td>

                  <td className="p-3 sm:p-5">
                    {app.user?.resume ? (
                      <a
                        href={formatResumeUrl(app.user.resume)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-4 sm:py-2 bg-blue-50 text-blue-600 text-[9px] sm:text-xs font-black rounded-lg transition-all uppercase tracking-tighter"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="sm:inline">View</span>
                      </a>
                    ) : (
                      <span className="text-[10px] sm:text-xs font-bold text-white/40 uppercase">N/A</span>
                    )}
                  </td>

                  <td className="hidden sm:table-cell p-5">
                    <span className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest border ${
                        app.status === 'accepted' ? 'text-green-400 border-green-400/30' :
                        app.status === 'rejected' ? 'text-red-400 border-red-400/30' :
                        'text-amber-400 border-amber-400/30'
                      }`}>
                      {app.status}
                    </span>
                  </td>

                  <td className="p-3 sm:p-5 text-right">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                      className="bg-white border border-white text-slate-900 text-[10px] sm:text-xs font-bold rounded-lg p-1 sm:p-2.5 outline-none cursor-pointer max-w-[85px] sm:max-w-none"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>{s.toUpperCase()}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-10 text-center text-slate-400 font-bold text-xs uppercase">No applications yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobApplications;