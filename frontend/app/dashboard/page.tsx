"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Activity, Server, FileText, CheckCircle } from "lucide-react";
import { checkHealth, fetchAssessments } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function DashboardOverview() {
  const { user } = useAuth();
  const [apiOnline, setApiOnline] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    async function init() {
      try {
        await checkHealth();
        setApiOnline(true);
      } catch (e) {
        setApiOnline(false);
      }
      
      if (user) {
        try {
          const list = await fetchAssessments();
          setHistoryCount(list.length);
        } catch (e) {
          setHistoryCount(0);
        }
      } else {
        const history = JSON.parse(sessionStorage.getItem("heartguard_history") || "[]");
        setHistoryCount(history.length);
      }
    }
    init();
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      
      {/* Hero Section */}
      <div className="bg-navy rounded-2xl shadow-lg p-8 md:p-12 relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50" />
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-manrope font-bold mb-4">
            Welcome to HeartGuard AI
          </h1>
          <p className="text-slate-300 text-lg mb-8">
            Risk Intelligence Platform evaluating heart-disease patterns using a trained Logistic Regression model.
          </p>
          <Link 
            href="/dashboard/assessment"
            className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition-colors shadow-md shadow-primary/20"
          >
            Start New Assessment
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Model Details Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-border-color p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Server className="h-6 w-6 text-blue-500" />
            <h2 className="text-lg font-semibold text-slate-800">Model Details</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Algorithm</span>
              <span className="font-medium text-slate-800">Logistic Regression</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Training Dataset</span>
              <span className="font-medium text-slate-800">1,024 records</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Input Features</span>
              <span className="font-medium text-slate-800">13</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Target Classes</span>
              <span className="font-medium text-slate-800">2</span>
            </div>
          </div>
        </div>

        {/* API Status Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-border-color p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Activity className={`h-6 w-6 ${apiOnline ? "text-success" : "text-primary"}`} />
            <h2 className="text-lg font-semibold text-slate-800">System Status</h2>
          </div>
          <div className="flex flex-col items-center justify-center py-4 space-y-3">
            <div className={`p-4 rounded-full ${apiOnline ? "bg-success/10" : "bg-primary/10"}`}>
              {apiOnline ? (
                <CheckCircle className="h-8 w-8 text-success" />
              ) : (
                <Server className="h-8 w-8 text-primary" />
              )}
            </div>
            <div className="text-center">
              <p className="font-medium text-slate-800 text-lg">
                {apiOnline ? "API Online" : "API Offline"}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                {apiOnline 
                  ? "Prediction pipeline is ready." 
                  : "Start the backend server on port 3200."}
              </p>
            </div>
          </div>
        </div>

        {/* Session / Account Stats Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-border-color p-6">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="h-6 w-6 text-purple-500" />
            <h2 className="text-lg font-semibold text-slate-800">
              {user ? "Account History" : "Session Stats"}
            </h2>
          </div>
          
          <div className="flex flex-col items-center justify-center py-4 space-y-2 text-center h-[calc(100%-2rem)]">
            <span className="text-4xl font-bold text-slate-800 font-mono">{historyCount}</span>
            <p className="text-sm text-slate-500">Assessments Completed</p>
            {historyCount === 0 && (
              <p className="text-xs text-slate-400 mt-2">
                No assessments recorded yet.
              </p>
            )}
            {historyCount > 0 && (
              <Link href="/dashboard/history" className="text-sm text-primary hover:underline mt-4 font-semibold">
                View History →
              </Link>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
