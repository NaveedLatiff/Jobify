"use client";

import React, { useEffect, useState, useContext } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext.js';
import Axios from '../../../../axios';
import Loader from '@/components/Loader';
import { toast } from 'react-toastify';

const JobDetailsPage = () => {
  const { id } = useParams();
  const { user, loading: authLoading } = useContext(AuthContext);
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role === 'RECRUITER') {
        router.push('/');
      }
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const { data } = await Axios.get(`job/${id}`);
        if (data.success) {
          setJob(data.job);
        }
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      toast.error("Please login to apply", { position: "bottom-right" });
      return router.push('/login');
    }

    if (!user.resume || user.resume.trim() === "") {
      toast.error("Please add your CV/Resume in your profile before applying!", { position: "bottom-right" });
      
      return router.push('/profile');
    }

    setApplying(true);
    try {
      const { data } = await Axios.post(`/applicant/apply/${id}`);
      toast.success(data.message, { position: "bottom-right" })

      if (data.success) {
        router.push('/applied-jobs');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong", { position: "bottom-right" });

    } finally {
      setApplying(false);
    }
  };

  if (authLoading || (user && user.role === 'RECRUITER')) return null;

  if (loading) return <div className="fixed inset-0 flex items-center justify-center bg-black"><Loader /></div>;

  if (!job) return (
    <div className="min-h-screen w-full bg-black/88 flex items-center justify-center">
      <p className="text-slate-500 text-lg">Job not found.</p>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-black/88 px-4 py-10">
      <div className="max-w-3xl mx-auto">

        <div className="mb-8">
          <h1 className="text-lg sm:text-2xl font-bold text-white">
            Job <span className="text-purple-800 underline">Details</span>
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Review the listing and apply below</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 hover:border-purple-500/40 transition-all duration-200">

          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-white font-semibold text-xl sm:text-2xl leading-tight">{job.title}</h2>
              <p className="text-purple-400 text-sm font-semibold mt-1 uppercase tracking-wide">{job.companyName}</p>
            </div>
            <span className="text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full whitespace-nowrap mt-1">
              {job.location}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {job.jobType && (
              <span className="text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                {job.jobType}
              </span>
            )}
            {job.experience && (
              <span className="text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                {job.experience} exp
              </span>
            )}
            {job.salary && (
              <span className="text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                {job.salary}
              </span>
            )}
            {job.position && (
              <span className="text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                {job.position} position{job.position > 1 ? 's' : ''}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Salary', value: job.salary },
              { label: 'Type', value: job.jobType },
              { label: 'Experience', value: job.experience },
              { label: 'Positions', value: job.position },
            ].map((item, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-3">
                <p className="text-slate-500 text-[10px] uppercase tracking-widest font-semibold mb-1">{item.label}</p>
                <p className="text-white text-sm font-semibold">{item.value || 'N/A'}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-5">
            <p className="text-slate-500 text-[10px] uppercase tracking-widest font-semibold mb-3">Job Description</p>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          <div className="border-t border-white/10 pt-5 flex flex-col gap-3">
            <button
              onClick={handleApply}
              disabled={applying}
              className="w-full py-3 rounded-xl text-sm font-semibold text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {applying ? "Processing Application..." : "Apply For This Job"}
            </button>

            {!user?.resume && (
              <p className="text-center text-xs font-semibold text-amber-400/80 uppercase tracking-tight">
                * Upload a resume in your profile before applying.
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;