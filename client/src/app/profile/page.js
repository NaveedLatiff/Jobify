"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Axios from '../../../axios';
import Loader from '@/components/Loader';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", password: "", resume: "" });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        resume: user.resume || "",
        password: ""
      });
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, resume: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData };
      if (!payload.password) delete payload.password;

      const { data } = await Axios.put('/auth/update-profile', payload);
      if (data.success) {
        setUser(data.user);
        setFormData(prev => ({ ...prev, password: "" }));
        toast.success("Profile updated successfully!", { position: "bottom-right" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message, { position: "bottom-right" });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="fixed inset-0 flex items-center justify-center bg-black"><Loader /></div>;

  const inputClass = "w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-purple-500/50 transition-all duration-200";
  const labelClass = "block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5";

  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center bg-black/88 px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl px-8 py-8">

          <div className="mb-8 text-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              {user.role}
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-4">
              {user.name}
            </h2>
            <p className="text-slate-400 text-sm mt-1">{user.email}</p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4">

            <div>
              <label className={labelClass}>Full Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your full name"
                className={inputClass}
              />
            </div>

            {user.role === "APPLICANT" && (
              <div>
                <label className={labelClass}>Update Resume (PDF)</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-dashed border-white/10 text-slate-400 text-sm focus:outline-none hover:border-purple-500/50 transition-all duration-200 cursor-pointer file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-500/20 file:text-purple-300 hover:file:bg-purple-500/30"
                />
                {user.resume && (
                  <p className="text-[10px] font-semibold text-green-400 uppercase tracking-wide mt-1.5">
                    ✓ Current resume is already saved
                  </p>
                )}
              </div>
            )}

            <div>
              <label className={labelClass}>Change Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={inputClass}
              />
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mt-1.5 italic">
                Leave blank to keep current
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-1 rounded-lg bg-gradient-to-r from-purple-900 via-purple-700 to-purple-500 hover:from-purple-800 hover:via-purple-600 hover:to-purple-400 active:scale-[0.98] text-white text-sm font-semibold tracking-wide transition-all duration-200 shadow-lg shadow-purple-900/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Saving Changes..." : "Update Profile"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;