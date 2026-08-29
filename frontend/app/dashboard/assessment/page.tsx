"use client";

import React, { useState, useEffect } from "react";
import { AssessmentForm } from "@/components/assessment-form";
import { AnalysisConsole } from "@/components/analysis-console";
import { predictRisk, checkHealth } from "@/lib/api";
import { PredictionRequest, PredictionResponse } from "@/lib/types";

export default function AssessmentPage() {
  const [completedFields, setCompletedFields] = useState(0);
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">("checking");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
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
    
    // Minimum visual delay of 3 seconds for the processing animation
    const minDelay = new Promise(resolve => setTimeout(resolve, 3500));
    
    try {
      const [res] = await Promise.all([predictRisk(data), minDelay]);
      setResult(res);
      saveToSessionHistory(res);
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
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Intro Section */}
      <div className="bg-white rounded-xl shadow-sm border border-border-color p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-primary font-bold text-xs tracking-wider uppercase mb-2 block">
              Educational AI Classification
            </span>
            <h1 className="text-3xl font-manrope font-bold text-slate-900 mb-3">
              Analyze Heart-Disease Risk Patterns
            </h1>
            <p className="text-slate-600">
              Enter the 13 required variables to generate an educational machine-learning risk classification.
            </p>
          </div>
          
          <div className="bg-slate-50 rounded-lg p-4 text-sm border border-slate-100 flex-shrink-0 grid grid-cols-2 gap-x-8 gap-y-2">
            <div>
              <span className="text-slate-500 block text-xs">Model</span>
              <span className="font-semibold text-slate-800">Logistic Regression</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Inputs</span>
              <span className="font-semibold text-slate-800">13</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Classes</span>
              <span className="font-semibold text-slate-800">2</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Version</span>
              <span className="font-semibold text-slate-800">1.0</span>
            </div>
          </div>
        </div>
      </div>

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
