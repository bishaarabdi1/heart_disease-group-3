"use client";

import React, { useEffect, useState } from "react";
import { History, Trash2 } from "lucide-react";

interface HistoryRecord {
  id: string;
  date: string;
  result: string;
  risk_class: number;
  confidence: number;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(sessionStorage.getItem("heartguard_history") || "[]");
      setHistory(stored);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const clearHistory = () => {
    sessionStorage.removeItem("heartguard_history");
    setHistory([]);
  };

  const deleteRecord = (id: string) => {
    const updated = history.filter(r => r.id !== id);
    sessionStorage.setItem("heartguard_history", JSON.stringify(updated));
    setHistory(updated);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-manrope font-bold text-slate-900 mb-2">Current Session History</h1>
          <p className="text-sm text-slate-600">History is stored temporarily in your browser during this session.</p>
        </div>
        {history.length > 0 && (
          <button 
            onClick={clearHistory}
            className="text-sm text-primary hover:text-primary-dark font-medium transition-colors"
          >
            Clear Session History
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border-color overflow-hidden">
        {history.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-400">
            <History className="h-12 w-12 mb-4 opacity-20" />
            <p className="text-lg font-medium text-slate-600">No History Available</p>
            <p className="text-sm mt-1">Complete an assessment to see the result here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200 text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium">Date & Time</th>
                  <th className="px-6 py-4 font-medium">Predicted Class</th>
                  <th className="px-6 py-4 font-medium">Confidence</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record) => (
                  <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                      {new Date(record.date).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      <span className={`px-2.5 py-1 rounded-full text-xs ${
                        record.risk_class === 1 
                          ? "bg-primary/10 text-primary border border-primary/20" 
                          : "bg-success/10 text-success border border-success/20"
                      }`}>
                        {record.result}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-slate-700">
                      {record.confidence.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button 
                        onClick={() => deleteRecord(record.id)}
                        className="p-2 text-slate-400 hover:text-primary transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
