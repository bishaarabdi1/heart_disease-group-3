"use client";

import React from "react";
import Link from "next/link";
import { Activity, Shield, Brain, ArrowRight, ActivitySquare, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <Activity className="h-6 w-6 text-primary" />
              <span className="font-manrope font-bold text-xl text-navy">HeartGuard AI</span>
            </div>
            <div>
              <Link 
                href="/dashboard/assessment"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark transition-colors"
              >
                Start Assessment
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="relative bg-gradient-to-b from-[#071A33] to-[#0B2A55] overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12">
              <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-6 border border-primary/20">
                Educational ML Model
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-manrope font-extrabold text-white leading-tight mb-6">
                Understand Heart-Health Risk Through Machine Learning
              </h1>
              <p className="text-lg text-slate-300 mb-8 max-w-lg">
                HeartGuard AI uses an educational machine-learning model to estimate a binary risk class from commonly studied health-related variables.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/dashboard/assessment"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-dark transition-colors"
                >
                  Start Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  href="/dashboard"
                  className="inline-flex items-center justify-center px-6 py-3 border border-slate-700 rounded-md shadow-sm text-base font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  View Dashboard
                </Link>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="md:w-1/2 mt-12 md:mt-0 w-full relative">
              <div className="relative rounded-2xl bg-navy-surface border border-slate-700 shadow-2xl overflow-hidden aspect-video flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <ActivitySquare className="w-64 h-64 text-blue-500" />
                </div>
                
                <div className="relative z-10 w-3/4 bg-slate-900/80 backdrop-blur border border-slate-700 rounded-xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700">
                    <div className="flex items-center space-x-2">
                      <Brain className="text-primary h-5 w-5" />
                      <span className="text-sm font-semibold text-white">AI Analysis Console</span>
                    </div>
                    <span className="flex h-2 w-2 rounded-full bg-success animate-pulse"></span>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 bg-slate-800 rounded w-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-3/4"></div>
                    </div>
                    <div className="h-2 bg-slate-800 rounded w-full overflow-hidden">
                      <div className="h-full bg-primary w-1/4"></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 mt-2">
                      <span>Validating 13 variables...</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features / How It Works */}
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-manrope font-bold text-slate-900">How It Works</h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                A simple three-step process to generate an educational risk classification based on 13 clinical features.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold font-manrope">1</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Input Variables</h3>
                <p className="text-slate-600">Provide 13 health-related variables, including age, blood pressure, and cholesterol levels.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold font-manrope">2</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Model Processing</h3>
                <p className="text-slate-600">The Logistic Regression model processes your inputs against patterns learned from 1,024 dataset records.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold font-manrope">3</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Review Classification</h3>
                <p className="text-slate-600">Receive a "Lower Risk" or "Higher Risk" classification along with model confidence probabilities.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer Section */}
        <div className="bg-slate-50 py-16 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Shield className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h2 className="text-2xl font-manrope font-bold text-slate-900 mb-4">Responsible AI Use</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-amber-800">
              <p className="font-medium text-lg mb-2">Educational use only.</p>
              <p>
                This application does not diagnose heart disease and does not replace a qualified healthcare professional. 
                The model predictions are generated purely for educational and analytical purposes based on a historical dataset.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0B2A55] py-8 border-t border-[#152F53]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 text-white mb-4 md:mb-0">
            <Activity className="h-5 w-5 text-primary" />
            <span className="font-manrope font-bold">HeartGuard AI</span>
          </div>
          <div className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} BILE Initiative — Group 3. Educational Platform.
          </div>
        </div>
      </footer>
    </div>
  );
}
