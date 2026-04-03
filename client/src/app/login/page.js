"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext.js";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup, user, loading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "APPLICANT",
  });

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      await login(formData.email, formData.password);
    } else {
      await signup(formData);
    }
  };

  if (loading || user) return <div className="fixed inset-0 flex items-center justify-center bg-black"><Loader /></div>;

  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center bg-black/88 px-4.5">
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl px-8 py-4">

          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {isLogin
                ? <p>Welcome <span className="text-purple-400">Back</span></p>
                : <p>Create <span className="text-purple-400">Account</span></p>}
            </h2>
            <p className="text-slate-400 text-sm mt-1.5">
              {isLogin ? "Sign in to your account to continue" : "Fill in the details to get started"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {!isLogin && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Naveed Latif"
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-purple-500/50 transition-all duration-200"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="naveed@example.com"
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-purple-500/50 transition-all duration-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-purple-500/50 transition-all duration-200"
              />
            </div>

            {!isLogin && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Register as
                </label>
                <div className="flex gap-3">
                  {[
                    { value: "APPLICANT", label: "Job Seeker" },
                    { value: "RECRUITER", label: "Recruiter" },
                  ].map(({ value, label }) => (
                    <label
                      key={value}
                      className={`flex-1 flex items-center justify-center py-2.5 rounded-lg border cursor-pointer text-sm font-medium transition-all duration-200
                        ${formData.role === value
                          ? "bg-blue-600/20 border-purple-500/40 text-blue-300"
                          : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-300"
                        }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={value}
                        checked={formData.role === value}
                        onChange={handleChange}
                        className="hidden"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 mt-1 rounded-lg bg-gradient-to-r from-purple-900 via-purple-700 to-purple-500 cursor-pointer hover:from-purple-800 hover:via-purple-600 hover:to-purple-400 active:scale-[0.98] text-white text-sm font-semibold tracking-wide transition-all duration-200 shadow-lg shadow-blue-900/30"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-white cursor-pointer font-semibold hover:text-blue-300 transition-colors duration-150"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;