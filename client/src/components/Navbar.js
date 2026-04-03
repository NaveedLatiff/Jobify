"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAuthPage = pathname === "/login";

  return (
    <nav className="w-full bg-black/88 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          <Link href="/" className="text-2xl font-bold italic text-white tracking-tight">
            Job<span className="text-purple-700">ify</span>
          </Link>

          <div className="hidden md:flex space-x-6 items-center">
            {user?.role === "RECRUITER" ? (
              <>
                <Link href="/posted-jobs" className="text-20px text-slate-300 hover:text-purple-600 hover:underline font-medium transition-colors duration-150">
                  My Jobs
                </Link>
                <Link href="/post-job" className="text-20px text-slate-300 hover:text-purple-600 hover:underline font-medium transition-colors duration-150">
                  Post Job
                </Link>
              </>
            ) : user?.role === "APPLICANT" ? (
              <Link href="/applied-jobs" className="text-20px text-slate-300 hover:text-purple-600 hover:underline font-medium transition-colors duration-150">
                Applied Jobs
              </Link>
            ) : null}
          </div>
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              !isAuthPage && (
                <Link href="/login">
                  <button className="text-sm text-white bg-gradient-to-r from-purple-900 cursor-pointer font-medium px-8 py-3 rounded-3xl transition-colors duration-150">
                    Login
                  </button>
                </Link>
              )
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/profile">
                  <button className="text-sm text-white bg-gradient-to-r from-purple-900 cursor-pointer px-8 py-3 rounded-3xl font-medium transition-all duration-150">
                    Profile
                  </button>
                </Link>
                <button
                  onClick={logout}
                  className="text-sm bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-white cursor-pointer px-8 py-3 rounded-3xl font-medium transition-all duration-150"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <button
            className="md:hidden text-white p-2 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/90 px-4 py-4 flex flex-col gap-3 justify-center items-center">

          {user?.role === "RECRUITER" ? (
            <>
              <Link href="/posted-jobs" onClick={() => setMenuOpen(false)} className="text-slate-300 hover:text-purple-500 font-medium transition-colors duration-150">
                My Jobs
              </Link>
              <Link href="/post-job" onClick={() => setMenuOpen(false)} className="text-slate-300 hover:text-purple-500 font-medium transition-colors duration-150">
                Post Job
              </Link>
            </>
          ) : user?.role === "APPLICANT" ? (
            <Link href="/applied-jobs" onClick={() => setMenuOpen(false)} className="text-slate-300 hover:text-purple-500 font-medium transition-colors duration-150">
              Applied Jobs
            </Link>
          ) : null}

          {!user ? (
            !isAuthPage && (
              <Link href="/login" onClick={() => setMenuOpen(false)}>
                <button className="w-full text-sm text-white bg-gradient-to-r from-purple-900 cursor-pointer font-medium px-8 py-3 rounded-3xl transition-colors duration-150">
                  Login
                </button>
              </Link>
            )
          ) : (
            <div className="flex flex-col gap-3">
              <Link href="/profile" onClick={() => setMenuOpen(false)}>
                <button className="w-full text-sm text-white bg-gradient-to-r from-purple-900 cursor-pointer px-8 py-3 rounded-3xl font-medium transition-all duration-150">
                  Profile
                </button>
              </Link>
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="w-full text-sm bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-white cursor-pointer px-8 py-3 rounded-3xl font-medium transition-all duration-150"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;