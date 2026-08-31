"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { 
  History, 
  Trash2, 
  Eye, 
  AlertCircle, 
  Loader2, 
  X, 
  CheckCircle2, 
  Calendar, 
  ArrowRight,
  Database,
  Info
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { fetchAssessments, deleteAssessmentById } from "@/lib/api";
import { Assessment } from "@/lib/types";

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();

  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [sessionRecords, setSessionRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected assessment for details modal
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  
  // Assessment ID queued for delete confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (user) {
        const data = await fetchAssessments();
        setAssessments(data);
      } else {
        const stored = JSON.parse(sessionStorage.getItem("heartguard_history") || "[]");
        setSessionRecords(stored);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load assessment history.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      loadData();
    }
  }, [authLoading, user, loadData]);

  const confirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      if (user) {
        await deleteAssessmentById(deletingId);
        setAssessments((prev) => prev.filter((a) => a.id !== deletingId));
      } else {
        const updated = sessionRecords.filter((r) => r.id !== deletingId);
        sessionStorage.setItem("heartguard_history", JSON.stringify(updated));
        setSessionRecords(updated);
      }
      setDeletingId(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete assessment.");
    } finally {
      setIsDeleting(false);
    }
  };

  const clearSessionHistory = () => {
    sessionStorage.removeItem("heartguard_history");
    setSessionRecords([]);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-manrope font-bold text-slate-900 mb-1">
            Assessment History
          </h1>
          <p className="text-sm text-slate-500">
            {user
              ? "Your assessments are securely stored and synced with Neon PostgreSQL."
              : "Temporary session history stored in browser memory."}
          </p>
        </div>

        {!user && sessionRecords.length > 0 && (
          <button 
            onClick={clearSessionHistory}
            className="text-xs text-red-600 hover:text-red-700 font-semibold px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
          >
            Clear Session History
          </button>
        )}
      </div>

      {/* Guest Notice Banner */}
      {!user && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-blue-900">
          <div className="flex items-start space-x-3 text-sm">
            <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">You are viewing temporary session history.</span>
              <p className="text-blue-700 text-xs mt-0.5">
                Sign in or create an account to permanently save and track your assessment history in Neon PostgreSQL.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <Link
              href="/login"
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-xs transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="px-3.5 py-1.5 bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 rounded-lg font-medium text-xs transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between text-red-700 text-sm">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span>{error}</span>
          </div>
          <button 
            onClick={loadData}
            className="text-xs underline font-semibold text-red-800 hover:text-red-900"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
            <p className="text-sm font-medium text-slate-600">Loading assessment history...</p>
          </div>
        ) : (user ? assessments.length === 0 : sessionRecords.length === 0) ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 text-slate-400">
              <History className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">No Assessments Found</h3>
            <p className="text-sm text-slate-500 max-w-sm mb-6">
              You haven&apos;t completed any risk assessments yet. Run your first assessment to view results here.
            </p>
            <Link
              href="/dashboard/assessment"
              className="inline-flex items-center px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold text-sm shadow-sm transition-colors"
            >
              Start New Assessment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200 text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Date & Time</th>
                  <th className="px-6 py-4 font-semibold">Predicted Class</th>
                  <th className="px-6 py-4 font-semibold">Model Percentage</th>
                  <th className="px-6 py-4 font-semibold">Model Engine</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {user ? (
                  assessments.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-slate-700 flex items-center">
                        <Calendar className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
                        {new Date(record.created_at).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          record.risk_class === 1
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                            record.risk_class === 1 ? "bg-red-500" : "bg-emerald-500"
                          }`} />
                          {record.result}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono font-semibold text-slate-800">
                        {record.model_percentage.toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                        <span className="font-medium text-slate-700">{record.model_name}</span>
                        <span className="text-slate-400 ml-1">v{record.model_version}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right space-x-1">
                        <button
                          onClick={() => setSelectedAssessment(record)}
                          className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(record.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Assessment"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  sessionRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-slate-700 flex items-center">
                        <Calendar className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
                        {new Date(record.date || record.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          record.risk_class === 1
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}>
                          {record.result}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono font-semibold text-slate-800">
                        {(record.confidence || record.model_percentage || 0).toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                        Logistic Regression v1.0
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => setDeletingId(record.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedAssessment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex justify-between items-start pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">
                  Assessment Details
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {selectedAssessment.result} ({selectedAssessment.model_percentage.toFixed(2)}% confidence)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Saved on {new Date(selectedAssessment.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedAssessment(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Model Outputs Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block">Risk Class</span>
                <span className="text-base font-bold text-slate-800">{selectedAssessment.risk_class}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block">Lower Risk Prob</span>
                <span className="text-base font-bold text-slate-800">{(selectedAssessment.lower_risk * 100).toFixed(1)}%</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block">Higher Risk Prob</span>
                <span className="text-base font-bold text-slate-800">{(selectedAssessment.higher_risk * 100).toFixed(1)}%</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block">Model Engine</span>
                <span className="text-xs font-bold text-slate-800">{selectedAssessment.model_name}</span>
              </div>
            </div>

            {/* 13 Input Features Grid */}
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Recorded Clinical Input Variables
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-slate-700 mb-6 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
              <div><span className="text-slate-400">Age:</span> <span className="font-semibold text-slate-900">{selectedAssessment.age} yrs</span></div>
              <div><span className="text-slate-400">Sex:</span> <span className="font-semibold text-slate-900">{selectedAssessment.sex === 1 ? "Male" : "Female"}</span></div>
              <div><span className="text-slate-400">Resting BP:</span> <span className="font-semibold text-slate-900">{selectedAssessment.trestbps} mm Hg</span></div>
              <div><span className="text-slate-400">Cholesterol:</span> <span className="font-semibold text-slate-900">{selectedAssessment.chol} mg/dl</span></div>
              <div><span className="text-slate-400">Fasting BS:</span> <span className="font-semibold text-slate-900">{selectedAssessment.fbs === 1 ? "> 120 mg/dl" : "Normal"}</span></div>
              <div><span className="text-slate-400">Max HR (thalach):</span> <span className="font-semibold text-slate-900">{selectedAssessment.thalach} bpm</span></div>
              <div><span className="text-slate-400">ST Depr (oldpeak):</span> <span className="font-semibold text-slate-900">{selectedAssessment.oldpeak}</span></div>
              <div><span className="text-slate-400">Chest Pain (CP):</span> <span className="font-semibold text-slate-900">Type {selectedAssessment.cp}</span></div>
              <div><span className="text-slate-400">Resting ECG:</span> <span className="font-semibold text-slate-900">Type {selectedAssessment.restecg}</span></div>
              <div><span className="text-slate-400">Ex Angina:</span> <span className="font-semibold text-slate-900">{selectedAssessment.exang === 1 ? "Yes" : "No"}</span></div>
              <div><span className="text-slate-400">Slope:</span> <span className="font-semibold text-slate-900">Type {selectedAssessment.slope}</span></div>
              <div><span className="text-slate-400">Major Vessels (ca):</span> <span className="font-semibold text-slate-900">{selectedAssessment.ca}</span></div>
              <div><span className="text-slate-400">Thal:</span> <span className="font-semibold text-slate-900">Type {selectedAssessment.thal}</span></div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedAssessment(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl font-semibold text-xs hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-sm w-full p-6 text-center animate-in fade-in zoom-in-95">
            <div className="h-12 w-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Assessment?</h3>
            <p className="text-xs text-slate-500 mb-6">
              This action cannot be undone. The assessment record will be permanently removed from your history.
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setDeletingId(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors flex items-center space-x-1.5"
              >
                {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                <span>{isDeleting ? "Deleting..." : "Delete"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
