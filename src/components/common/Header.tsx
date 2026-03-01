"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/* eslint-disable @next/next/no-img-element */

const Header = () => {
  const pathname = usePathname();

  const isLaunchesPage = pathname === "/launches";

  return (
    <header className="flex w-full items-center justify-center border-b border-slate-800/80 bg-slate-950/60 backdrop-blur">
      <div className="flex w-full max-w-7xl items-center justify-between px-4 py-4">
        
        {/* Left */}
        <div className="flex items-center gap-4">
          
          {/* Icon */}
          <div className="rounded-lg bg-linear-to-br from-sky-500 to-indigo-500 p-2 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-white"
            >
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
              <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
              <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
              <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
            </svg>
          </div>

          {/* Title + Dynamic Button */}
          <div className="flex items-center gap-4">
            <h1 className="hidden lg:flex text-lg md:text-xl font-semibold tracking-tight">
              Launch Explorer
            </h1>

            <Link
              href={isLaunchesPage ? "/" : "/launches"}
              className=" sm:inline-flex items-center rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-300 transition hover:border-sky-400 hover:bg-sky-500/20"
            >
              {isLaunchesPage ? "← Back to dashboard" : "View all →"}
            </Link>
          </div>
        </div>

        {/* Right: Logo */}
        <div className="flex items-center">
          <img
            className="h-7 w-auto opacity-90 hover:opacity-100 transition"
            src="https://www.efrouting.com/_next/image?url=%2FefLogoBig.png&w=640&q=75"
            alt="efRouting logo"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;