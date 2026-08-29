"use client";

import React, { useEffect, useState } from "react";
import { Activity, Heart, ServerCrash, CheckCircle2, AlertTriangle, ShieldCheck, Download, RefreshCcw, Home } from "lucide-react";
import { PredictionResponse } from "@/lib/types";
import Link from "next/link";

type ConsoleState = "checking" | "awaiting" | "ready" | "processing" | "result" | "error";

interface AnalysisConsoleProps {
  completedFields: number;
  totalFields: number;
  apiStatus: "checking" | "online" | "offline";
  isProcessing: boolean;
  result: PredictionResponse | null;
  error: string | null;
  onReset: () => void;
}

export function AnalysisConsole({
  completedFields,
  totalFields,
  apiStatus,
  isProcessing,
  result,
  error,
  onReset
}: AnalysisConsoleProps) {
  const [currentState, setCurrentState] = useState<ConsoleState>("checking");
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    if (apiStatus === "checking") {
      setCurrentState("checking");
    } else if (apiStatus === "offline") {
      setCurrentState("error");
    } else if (error) {
      setCurrentState("error");
    } else if (result) {
      setCurrentState("result");
    } else if (isProcessing) {
      setCurrentState("processing");
    } else if (completedFields === totalFields) {
      setCurrentState("ready");
    } else {
      setCurrentState("awaiting");
    }
  }, [apiStatus, completedFields, totalFields, isProcessing, result, error]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentState === "processing") {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep(s => (s < 4 ? s + 1 : s));
      }, 700);
    }
    return () => clearInterval(interval);
  }, [currentState]);

  const loadingSteps = [
    "Validating 13 input variables",
    "Applying saved preprocessing",
    "Running Logistic Regression",
    "Calculating class probabilities",
    "Preparing responsible result"
  ];

  const renderContent = () => {
    switch (currentState) {
      case "checking":
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-6 text-slate-300">
            <Activity className="h-12 w-12 text-blue-400 animate-pulse" />
            <div className="space-y-2 text-center">
              <p className="text-sm font-medium">Connecting to HeartGuard API</p>
              <p className="text-xs text-slate-500">Checking model availability</p>
              <p className="text-xs text-slate-500">Verifying 13-feature pipeline</p>
            </div>
          </div>
        );

      case "error":
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-4 text-slate-300 px-6 text-center">
            <ServerCrash className="h-12 w-12 text-primary" />
            <h3 className="text-lg font-manrope font-semibold text-white">Connection Error</h3>
            <p className="text-sm text-slate-400">{error || "Failed to connect to the prediction API. Please ensure the backend is running."}</p>
          </div>
        );

      case "awaiting":
      case "ready":
        return (
          <div className="flex flex-col items-center justify-center h-full px-6">
            <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border border-slate-800 border-dashed animate-[spin_20s_linear_infinite]" />
              {/* Inner ring */}
              <div className="absolute inset-4 rounded-full border border-slate-700 opacity-50" />
              {/* Nodes representing features */}
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180;
                const radius = 96; // matches w-48
                const x = radius + radius * Math.cos(angle) - 4;
                const y = radius + radius * Math.sin(angle) - 4;
                const isActive = i < completedFields;
                return (
                  <div
                    key={i}
                    className={`absolute w-2 h-2 rounded-full transition-colors duration-500 ${
                      isActive ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" : "bg-slate-800"
                    }`}
                    style={{ left: x, top: y }}
                  />
                );
              })}
              {/* Center Heart */}
              <div className={`relative z-10 p-4 rounded-full bg-navy-surface border transition-colors duration-500 ${
                currentState === "ready" ? "border-success shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "border-slate-700"
              }`}>
                <Heart className={`h-8 w-8 ${currentState === "ready" ? "text-success" : "text-slate-600"}`} />
              </div>
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-manrope font-semibold text-white">
                {currentState === "ready" ? "Ready for Analysis" : "Awaiting Features"}
              </h3>
              <p className="text-sm text-slate-400">
                {currentState === "ready" 
                  ? "All required inputs are valid." 
                  : "Please complete the 13-feature schema on the left to activate the evaluation pipeline."}
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800">
                <p className="text-xs font-mono text-blue-400">
                  {completedFields} of {totalFields} variables validated
                </p>
              </div>
            </div>
          </div>
        );

      case "processing":
        return (
          <div className="flex flex-col items-center justify-center h-full px-8">
            <div className="relative w-32 h-32 mb-12">
              <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
              <div className="absolute inset-2 rounded-full border-2 border-primary/20 border-b-primary animate-[spin_1.5s_linear_infinite_reverse]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Activity className="h-8 w-8 text-blue-400 animate-pulse" />
              </div>
            </div>
            
            <div className="w-full max-w-xs space-y-4">
              {loadingSteps.map((step, idx) => (
                <div key={idx} className={`flex items-center space-x-3 transition-all duration-500 ${
                  idx <= loadingStep ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}>
                  {idx < loadingStep ? (
                    <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                  ) : idx === loadingStep ? (
                    <div className="h-4 w-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin flex-shrink-0" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-slate-700 flex-shrink-0" />
                  )}
                  <span className={`text-sm ${
                    idx < loadingStep ? "text-slate-400" : 
                    idx === loadingStep ? "text-white font-medium" : "text-slate-600"
                  }`}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case "result":
        if (!result) return null;
        
        const isHigherRisk = result.risk_class === 1;
        const colorPrimary = isHigherRisk ? "text-primary" : "text-teal-400";
        const bgPrimary = isHigherRisk ? "bg-primary/10" : "bg-teal-400/10";
        const borderPrimary = isHigherRisk ? "border-primary/30" : "border-teal-400/30";
        const Icon = isHigherRisk ? AlertTriangle : ShieldCheck;

        return (
          <div className="flex flex-col h-full text-white animate-in fade-in zoom-in duration-500">
            {/* Header section */}
            <div className={`p-6 border-b border-slate-800 ${bgPrimary}`}>
              <div className="flex items-center space-x-3 mb-4">
                <Icon className={`h-8 w-8 ${colorPrimary}`} />
                <h3 className="text-2xl font-manrope font-bold">{result.result}</h3>
              </div>
              <p className="text-sm text-slate-300">
                The submitted values were classified according to patterns learned from the approved training dataset.
              </p>
            </div>

            {/* Content section */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Confidence Gauge */}
              <div className="bg-navy-surface p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm text-slate-400">Model Confidence</span>
                  <span className={`text-2xl font-bold font-mono ${colorPrimary}`}>
                    {result.model_percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${isHigherRisk ? "bg-primary" : "bg-teal-400"}`} 
                    style={{ width: `${result.model_percentage}%` }}
                  />
                </div>
              </div>

              {/* Class Probabilities */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Class Probabilities</h4>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">Higher Risk Class</span>
                  <span className="font-mono">{(result.probabilities.higher_risk * 100).toFixed(1)}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-primary/70" style={{ width: `${result.probabilities.higher_risk * 100}%` }} />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">Lower Risk Class</span>
                  <span className="font-mono">{(result.probabilities.lower_risk * 100).toFixed(1)}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-400/70" style={{ width: `${result.probabilities.lower_risk * 100}%` }} />
                </div>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4 text-xs text-slate-400 bg-slate-900/50 p-4 rounded-lg">
                <div>
                  <p className="mb-1 text-slate-500">Model</p>
                  <p className="font-medium text-slate-300">{result.model_name} v{result.model_version}</p>
                </div>
                <div>
                  <p className="mb-1 text-slate-500">Inputs Analyzed</p>
                  <p className="font-medium text-slate-300">13 Features</p>
                </div>
                <div className="col-span-2 border-t border-slate-800 pt-3 mt-1">
                  <p className="text-center font-mono opacity-60">{new Date().toLocaleString()}</p>
                </div>
              </div>

              {/* Warning / Disclaimer */}
              <div className={`p-4 rounded-lg border text-sm ${isHigherRisk ? "bg-amber-500/10 border-amber-500/30 text-amber-200" : "bg-slate-800 border-slate-700 text-slate-300"}`}>
                <p className="font-medium mb-1">{result.disclaimer}</p>
                {isHigherRisk && (
                  <p className="mt-2 text-xs">
                    If you are experiencing chest pain, difficulty breathing, fainting, or another urgent symptom, seek immediate professional medical assistance.
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-navy-surface border-t border-slate-800 grid grid-cols-2 gap-3">
              <button 
                onClick={onReset}
                className="flex items-center justify-center py-2 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                New Assessment
              </button>
              <button 
                className="flex items-center justify-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Edu Summary
              </button>
              <Link 
                href="/dashboard"
                className="col-span-2 flex items-center justify-center py-2 px-4 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-md text-sm font-medium transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                Return to Dashboard
              </Link>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-navy h-[800px] md:h-auto md:min-h-[700px] rounded-xl shadow-xl overflow-hidden flex flex-col sticky top-6">
      <div className="bg-navy-surface border-b border-slate-800 px-6 py-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-blue-500" />
          <h2 className="text-white font-manrope font-medium">Analysis Console</h2>
        </div>
        <div className="text-xs font-mono px-2 py-1 bg-slate-900 rounded text-slate-400">
          STATUS: {currentState.toUpperCase()}
        </div>
      </div>
      
      <div className="flex-1 relative overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
}
