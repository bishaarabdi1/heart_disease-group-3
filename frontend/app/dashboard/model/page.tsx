"use client";

import React from "react";
import { Server, Database, CheckSquare, Target } from "lucide-react";

export default function ModelInfoPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-manrope font-bold text-slate-900 mb-2">Model Information</h1>
        <p className="text-sm text-slate-600">Technical details regarding the trained machine-learning model.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Core Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-border-color">
          <div className="flex items-center space-x-3 mb-4 text-blue-600">
            <Server className="h-6 w-6" />
            <h2 className="text-lg font-semibold text-slate-800">Architecture</h2>
          </div>
          <ul className="space-y-4 text-sm">
            <li className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Selected Model</span>
              <span className="font-medium text-slate-800">Logistic Regression</span>
            </li>
            <li className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Compared Model</span>
              <span className="font-medium text-slate-800">Decision Tree</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-500">Metric Values</span>
              <span className="font-medium italic text-slate-400">Final notebook metric will be inserted here.</span>
            </li>
          </ul>
        </div>

        {/* Dataset Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-border-color">
          <div className="flex items-center space-x-3 mb-4 text-purple-500">
            <Database className="h-6 w-6" />
            <h2 className="text-lg font-semibold text-slate-800">Training Data</h2>
          </div>
          <ul className="space-y-4 text-sm">
            <li className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Dataset Records</span>
              <span className="font-medium text-slate-800">1,024</span>
            </li>
            <li className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Input Features</span>
              <span className="font-medium text-slate-800">13</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-500">Excluded Data Leakage</span>
              <span className="font-medium text-slate-800 font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">num</span>
            </li>
          </ul>
        </div>

        {/* Target Classes */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-border-color md:col-span-2">
          <div className="flex items-center space-x-3 mb-4 text-primary">
            <Target className="h-6 w-6" />
            <h2 className="text-lg font-semibold text-slate-800">Target Variable</h2>
          </div>
          
          <div className="flex flex-col space-y-2 mb-6">
            <span className="text-sm text-slate-500">Target Field</span>
            <span className="font-mono text-sm bg-slate-100 self-start px-2 py-1 rounded text-slate-800">target_binary</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-success/30 bg-success/5 p-4 rounded-lg flex items-start space-x-3">
              <CheckSquare className="h-5 w-5 text-success mt-0.5" />
              <div>
                <h4 className="font-medium text-slate-800">Class 0: Lower Risk Class</h4>
                <p className="text-xs text-slate-600 mt-1">Indicates patterns generally associated with a lower probability of heart-disease risk factors based on the training data.</p>
              </div>
            </div>
            
            <div className="border border-primary/30 bg-primary/5 p-4 rounded-lg flex items-start space-x-3">
              <CheckSquare className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-slate-800">Class 1: Higher Risk Class</h4>
                <p className="text-xs text-slate-600 mt-1">Indicates patterns that aligned with a higher probability of heart-disease risk factors in the training data.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
