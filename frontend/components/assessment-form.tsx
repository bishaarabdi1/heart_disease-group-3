"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { fieldDefinitions, isHighRisk } from "@/lib/model-fields";
import { PredictionRequest } from "@/lib/types";

const schema = z.object({
  age: z.coerce.number().min(18).max(100),
  sex: z.coerce.number().pipe(z.union([z.literal(0), z.literal(1)])),
  trestbps: z.coerce.number().min(70).max(250),
  chol: z.coerce.number().min(80).max(700),
  fbs: z.coerce.number().pipe(z.union([z.literal(0), z.literal(1)])),
  thalach: z.coerce.number().min(50).max(250),
  oldpeak: z.coerce.number().min(0).max(10),
  cp: z.coerce.number().pipe(z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)])),
  restecg: z.coerce.number().pipe(z.union([z.literal(0), z.literal(1), z.literal(2)])),
  exang: z.coerce.number().pipe(z.union([z.literal(0), z.literal(1)])),
  slope: z.coerce.number().pipe(z.union([z.literal(1), z.literal(2), z.literal(3)])),
  ca: z.coerce.number().pipe(z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)])),
  thal: z.coerce.number().pipe(z.union([z.literal(3), z.literal(6), z.literal(7)])),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must accept the educational disclaimer.",
  }),
});

type FormData = z.infer<typeof schema>;

type SelectionTone = "safe" | "risk";

function selectedClasses(tone: SelectionTone) {
  return tone === "safe"
    ? "bg-green-100 border-green-600 text-green-800 ring-2 ring-green-200 font-semibold"
    : "bg-red-100 border-red-600 text-red-800 ring-2 ring-red-200 font-semibold";
}

const optionTones: Record<string, Record<number, SelectionTone>> = {
  sex: { 0: "safe", 1: "risk" },
  fbs: { 0: "safe", 1: "risk" },
  cp: { 1: "safe", 2: "risk", 3: "safe", 4: "risk" },
  restecg: { 0: "safe", 1: "risk", 2: "risk" },
  exang: { 0: "safe", 1: "risk" },
  slope: { 1: "safe", 2: "risk", 3: "risk" },
  ca: { 0: "safe", 1: "risk", 2: "risk", 3: "risk" },
  thal: { 3: "safe", 6: "risk", 7: "risk" }
};

interface AssessmentFormProps {
  onSubmit: (data: PredictionRequest) => void;
  isLoading: boolean;
  onProgressUpdate: (completed: number, total: number) => void;
}

export function AssessmentForm({ onSubmit, isLoading, onProgressUpdate }: AssessmentFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      consent: false,
    }
  });

  const watchAllFields = watch();
  
  useEffect(() => {
    const fields = ['age', 'sex', 'trestbps', 'chol', 'fbs', 'thalach', 'oldpeak', 'cp', 'restecg', 'exang', 'slope', 'ca', 'thal'];
    let completed = 0;
    fields.forEach(field => {
      const val = watchAllFields[field as keyof FormData];
      if (val !== undefined && val !== "" && !Number.isNaN(Number(val))) {
        completed++;
      }
    });
    onProgressUpdate(completed, 13);
  }, [watchAllFields, onProgressUpdate]);

  const submitHandler = (data: FormData) => {
    const { consent, ...requestData } = data;
    onSubmit(requestData as PredictionRequest);
  };

  const renderInput = (name: keyof typeof fieldDefinitions) => {
    const field = fieldDefinitions[name] as any;
    
    if (field.options) {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">{field.label}</label>
          <div className="flex bg-slate-100 rounded-md p-1 gap-1">
            {field.options.map((opt: any) => {
              const watchedValue = watchAllFields[name as keyof FormData];
              const isSelected = String(watchedValue) === String(opt.value);
              
              const fieldTones = optionTones[name as keyof typeof optionTones];
              const tone = fieldTones ? fieldTones[opt.value] : "safe";
              
              const baseStyles = "py-2 px-1 text-sm rounded-md transition-all flex items-center justify-center relative w-full h-full border ";
              const unselectedStyles = "bg-transparent border-transparent text-slate-600";
              const styles = baseStyles + (isSelected ? selectedClasses(tone) : unselectedStyles);

              return (
                <label key={opt.value} className="relative flex-1 text-center cursor-pointer">
                  <input 
                    type="radio" 
                    value={opt.value} 
                    {...register(name)} 
                    className="sr-only"
                  />
                  <div className={styles}>
                    {opt.label}
                    {isSelected && (
                      <span className="ml-1.5 flex-shrink-0">
                        {tone === "risk" ? (
                          <AlertCircle className="w-[18px] h-[18px] fill-red-600 text-white" />
                        ) : (
                          <CheckCircle2 className="w-[18px] h-[18px] fill-green-600 text-white" />
                        )}
                      </span>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
          {errors[name] && <p className="text-primary text-xs mt-1">{errors[name]?.message}</p>}
        </div>
      );
    }
    
    const currentValue = watchAllFields[name as keyof FormData] as number;
    const hasValue = currentValue !== undefined && (currentValue as any) !== "" && !Number.isNaN(Number(currentValue)) && !errors[name];
    const highRiskInput = hasValue ? isHighRisk(name, Number(currentValue)) : false;
    
    let inputStyles = "w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-colors pr-10 ";
    if (hasValue) {
      if (highRiskInput) {
        inputStyles += "bg-[#FEE2E2] border-[#E11D48] text-[#9F1239] focus:ring-[#E11D48]/20 focus:border-[#E11D48]";
      } else {
        inputStyles += "bg-[#DCFCE7] border-[#16A34A] text-[#166534] focus:ring-[#16A34A]/20 focus:border-[#16A34A]";
      }
    } else {
      inputStyles += "border-slate-300 focus:ring-primary/20 focus:border-primary";
    }

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">{field.label}</label>
        <div className="relative">
          <input 
            type="number" 
            step={field.step || 1}
            placeholder={`e.g. ${field.min || 0}`}
            className={inputStyles}
            {...register(name, { valueAsNumber: true })}
          />
          {hasValue && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {highRiskInput ? (
                <AlertCircle className="w-[18px] h-[18px] fill-[#E11D48] text-white" />
              ) : (
                <CheckCircle2 className="w-[18px] h-[18px] fill-[#16A34A] text-white" />
              )}
            </div>
          )}
        </div>
        {errors[name] && <p className="text-primary text-xs mt-1">{errors[name]?.message}</p>}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border-color p-6 md:p-8">
      <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
        <h2 className="text-xl font-manrope font-semibold text-slate-900">Clinical Variables</h2>
        <div className="flex items-center text-sm">
          <span className="text-primary font-bold mr-1">
            {Object.keys(watchAllFields).filter(k => {
              if (k === 'consent') return false;
              const val = watchAllFields[k as keyof FormData];
              return val !== undefined && val !== "" && !Number.isNaN(Number(val));
            }).length}
          </span>
          <span className="text-slate-500">of 13 completed</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(submitHandler)}>
        
        {/* Section 1 */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mr-2">1</span>
            <h3 className="font-semibold text-slate-800">Personal Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderInput("age")}
            {renderInput("sex")}
          </div>
        </div>

        {/* Section 2 */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mr-2">2</span>
            <h3 className="font-semibold text-slate-800">Health Measurements</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderInput("trestbps")}
            {renderInput("chol")}
            {renderInput("fbs")}
            {renderInput("thalach")}
            <div className="md:col-span-2">
              {renderInput("oldpeak")}
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mr-2">3</span>
            <h3 className="font-semibold text-slate-800">Clinical Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">{renderInput("cp")}</div>
            {renderInput("restecg")}
            {renderInput("exang")}
            {renderInput("slope")}
            {renderInput("ca")}
            <div className="md:col-span-2">{renderInput("thal")}</div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <div className="flex items-start mb-6">
            <div className="flex items-center h-5">
              <input
                id="consent"
                type="checkbox"
                className="w-4 h-4 text-primary bg-slate-100 border-slate-300 rounded focus:ring-primary"
                {...register("consent")}
              />
            </div>
            <label htmlFor="consent" className="ml-2 text-sm text-slate-600">
              I understand that this is an educational model prediction and not a medical diagnosis.
            </label>
          </div>
          {errors.consent && <p className="text-primary text-xs mt-1 mb-4">{errors.consent.message}</p>}

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => reset()}
              className="px-6 py-3 border border-slate-200 text-slate-600 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={!isValid || isLoading}
              className={`flex-1 px-6 py-3 rounded-md text-sm font-medium text-white transition-all
                ${!isValid || isLoading 
                  ? "bg-primary/50 cursor-not-allowed" 
                  : "bg-primary hover:bg-primary-dark shadow-md hover:shadow-lg"}`}
            >
              {isLoading ? "Analyzing Inputs..." : "Analyze Heart Risk"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
