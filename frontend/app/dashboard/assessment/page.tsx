"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, BookmarkCheck, Shield, Sparkles } from "lucide-react";
import { AssessmentForm } from "@/components/assessment-form";
import { AnalysisConsole } from "@/components/analysis-console";
import { predictRisk, createAssessment, checkHealth } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { PredictionRequest, PredictionResponse } from "@/lib/types";

export default function AssessmentPage() {
  const { user } = useAuth();

  const [completedFields, setCompletedFields] = useState(0);
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">("checking");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedToDb, setSavedToDb] = useState(false);
  const totalFields = 13;

  useEffect(() => {
    async function verifyHealth() {
      try {
        await checkHealth();
        setApiStatus("online");
      } catch (e) {
        setApiStatus("offline");
        setError("API is unreachable.");
      }
    }
    verifyHealth();
  }, []);

  const saveToSessionHistory = (res: PredictionResponse) => {
    try {
      const history = JSON.parse(sessionStorage.getItem("heartguard_history") || "[]");
      const record = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        result: res.result,
        risk_class: res.risk_class,
        confidence: res.model_percentage,
      };
      sessionStorage.setItem("heartguard_history", JSON.stringify([record, ...history]));
    } catch (e) {
      console.error("Failed to save session history");
    }
  };

  const handleSubmit = async (data: PredictionRequest) => {
    setIsProcessing(true);
    setResult(null);
    setError(null);
    setSavedToDb(false);
    
    // Minimum visual delay of 3.5 seconds for the processing animation
    const minDelay = new Promise((resolve) => setTimeout(resolve, 3500));
    
    try {
      if (user) {
        // Authenticated user -> Save to Neon database
        const [res] = await Promise.all([createAssessment(data), minDelay]);
        setResult(res);
        setSavedToDb(true);
      } else {
        // Guest user -> Ephemeral prediction
        const [res] = await Promise.all([predictRisk(data), minDelay]);
        setResult(res);
        saveToSessionHistory(res);
      }
    } catch (err: any) {
      await minDelay;
      setError(err.message || "Failed to complete prediction.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setSavedToDb(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Intro Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-border-color p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-primary font-bold text-xs tracking-wider uppercase">
                Educational AI Classification
              </span>
              {user ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <BookmarkCheck className="h-3 w-3 mr-1" />
                  Account Sync Active
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                  Guest Mode
                </span>
              )}
            </div>
            
            <h1 className="text-3xl font-manrope font-bold text-slate-900 mb-3">
              Analyze Heart-Disease Risk Patterns
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed">
              Enter the 13 required variables to generate an educational machine-learning risk classification.
              {user 
                ? " Completed assessments are automatically saved to your account history." 
                : " Log in to automatically save your assessment results to your account."}
            </p>
          </div>
          
          <div className="bg-slate-50 rounded-xl p-4 text-sm border border-slate-100 flex-shrink-0 grid grid-cols-2 gap-x-8 gap-y-2">
            <div>
              <span className="text-slate-500 block text-xs">Model</span>
              <span className="font-semibold text-slate-800">Logistic Regression</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Inputs</span>
              <span className="font-semibold text-slate-800">13 Features</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Classes</span>
              <span className="font-semibold text-slate-800">2 (Lower/Higher)</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Engine Version</span>
              <span className="font-semibold text-slate-800">v1.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Saved notification banner */}
      {savedToDb && result && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between text-emerald-800 text-sm animate-in fade-in">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span className="font-medium">
              Assessment complete and saved to your account history in Neon PostgreSQL.
            </span>
          </div>
          <Link
            href="/dashboard/history"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline shrink-0 ml-4"
          >
            View in History →
          </Link>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 xl:col-span-7">
          <AssessmentForm 
            onSubmit={handleSubmit}
            isLoading={isProcessing}
            onProgressUpdate={(completed) => setCompletedFields(completed)}
          />
        </div>
        
        <div className="lg:col-span-5 xl:col-span-5">
          <AnalysisConsole 
            completedFields={completedFields}
            totalFields={totalFields}
            apiStatus={apiStatus}
            isProcessing={isProcessing}
            result={result}
            error={error}
            onReset={handleReset}
          />
        </div>
      </div>

    </div>
  );
}
