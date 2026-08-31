"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  BarChart2, 
  Info,
  Menu,
  X,
  Activity,
  User,
  LogOut,
  LogIn,
  UserPlus,
  ChevronDown
} from "lucide-react";
import { checkHealth } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">("checking");
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function verifyHealth() {
      try {
        await checkHealth();
        setApiStatus("online");
      } catch (error) {
        setApiStatus("offline");
      }
    }
    verifyHealth();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    router.push("/login");
  };

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "New Assessment", href: "/dashboard/assessment", icon: PlusCircle },
    { name: "History", href: "/dashboard/history", icon: History },
    { name: "Model Analytics", href: "/dashboard/model", icon: BarChart2 },
    ...(user ? [{ name: "Profile", href: "/dashboard/profile", icon: User }] : []),
    { name: "About Project", href: "/", icon: Info },
  ];

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Overview";
    const item = navigation.find((n) => n.href === pathname);
    return item ? item.name : "Dashboard";
  };

  const getInitials = (name?: string) => {
    if (!name) return "GU";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
      {/* Mobile sidebar backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-navy/80 md:hidden backdrop-blur-sm" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-[280px] bg-gradient-to-b from-[#071A33] to-[#0B2A55] text-white border-r border-[#152F53] transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 font-sans shadow-xl
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex h-[72px] shrink-0 items-center px-6 border-b border-[#152F53]">
          <Activity className="h-[26px] w-[26px] text-primary mr-3" />
          <div className="flex flex-col justify-center">
            <div className="font-manrope font-extrabold text-[20px] leading-tight tracking-wide text-white">HeartGuard AI</div>
            <div className="text-[11px] text-[#8BA3C5] font-semibold uppercase tracking-[0.15em] mt-0.5">Risk Intelligence Platform</div>
          </div>
        </div>
        
        <div className="flex flex-col h-[calc(100vh-72px)]">
          <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    group flex items-center px-4 py-[14px] text-[15px] font-semibold rounded-xl transition-all duration-200 ease-in-out
                    ${isActive 
                      ? "bg-primary/15 text-primary border border-primary/20 shadow-sm" 
                      : "text-[#8BA3C5] hover:bg-[#112948] hover:text-white"
                    }
                  `}
                >
                  <item.icon
                    className={`mr-3.5 h-[22px] w-[22px] flex-shrink-0 transition-colors duration-200 ${isActive ? "text-primary" : "text-[#5C7EAA] group-hover:text-white"}`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          {/* User badge in sidebar or Guest links */}
          <div className="p-4 mx-4 mb-3 bg-[#0B2342]/70 rounded-xl border border-[#152F53]">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5 overflow-hidden">
                  <div className="h-8 w-8 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center text-xs font-bold shrink-0">
                    {getInitials(user.full_name)}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-white truncate">{user.full_name}</p>
                    <p className="text-[11px] text-[#8BA3C5] truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="p-1.5 text-[#8BA3C5] hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-[#8BA3C5] font-medium">Guest Mode</p>
                <div className="flex gap-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 text-center py-1.5 px-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 text-center py-1.5 px-2 bg-white/10 hover:bg-white/15 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    Register
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Project Identity */}
          <div className="p-4 pt-0">
            <div className="text-[12px] text-[#6B8BB4] font-medium leading-relaxed bg-[#0B2342]/40 p-3 rounded-xl border border-[#152F53]/60">
              <div className="flex justify-between items-center text-[11px]">
                <span>BILE Initiative</span>
                <span className="text-[#8BA3C5] font-semibold">Group 3</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border-color bg-white px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button
              type="button"
              className="mr-4 text-slate-500 md:hidden hover:text-slate-700"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="text-sm text-slate-500 flex items-center space-x-2">
              <Link href="/dashboard" className="hover:text-slate-900 transition-colors">Dashboard</Link>
              <span>›</span>
              <span className="font-medium text-slate-900">{getPageTitle()}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* API Status Badge */}
            <div className={`
              inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
              ${apiStatus === "online" ? "bg-success/10 text-success border-success/20" : 
                apiStatus === "checking" ? "bg-slate-100 text-slate-500 border-slate-200" : 
                "bg-primary/10 text-primary border-primary/20"}
            `}>
              <span className={`mr-1.5 h-2 w-2 rounded-full ${
                apiStatus === "online" ? "bg-success" : 
                apiStatus === "checking" ? "bg-slate-400 animate-pulse" : 
                "bg-primary"
              }`}></span>
              {apiStatus === "online" ? "Model Online" : 
               apiStatus === "checking" ? "Checking API..." : 
               "API: Offline"}
            </div>
            
            {/* User Dropdown / Login actions */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2.5 p-1 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-xs font-bold">
                    {getInitials(user.full_name)}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 hidden sm:inline-block">
                    {user.full_name}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:inline-block" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.full_name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User className="h-4 w-4 mr-2 text-slate-400" />
                      Account Profile
                    </Link>
                    <Link
                      href="/dashboard/history"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <History className="h-4 w-4 mr-2 text-slate-400" />
                      Assessment History
                    </Link>
                    <div className="border-t border-slate-100 mt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <LogIn className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-primary hover:bg-primary-dark transition-colors shadow-sm"
                >
                  <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                  Create account
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Main scrollable area */}
        <main className="flex-1 overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
