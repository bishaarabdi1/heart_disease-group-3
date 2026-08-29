export const fieldDefinitions = {
  age: { label: "Age (Years)", type: "number", min: 18, max: 100 },
  sex: { label: "Sex", options: [{ value: 0, label: "Female (0)" }, { value: 1, label: "Male (1)" }] },
  trestbps: { label: "Resting Blood Pressure (mm Hg)", type: "number", min: 70, max: 250 },
  chol: { label: "Serum Cholesterol (mg/dl)", type: "number", min: 80, max: 700 },
  fbs: { label: "Fasting Blood Sugar > 120 mg/dl", options: [{ value: 0, label: "No (0)" }, { value: 1, label: "Yes (1)" }] },
  thalach: { label: "Maximum Heart Rate Achieved", type: "number", min: 50, max: 250 },
  oldpeak: { label: "ST Depression (Oldpeak)", type: "number", min: 0, max: 10, step: 0.1 },
  cp: { label: "Chest Pain Type", options: [
    { value: 1, label: "Typical Angina (1)" },
    { value: 2, label: "Atypical Angina (2)" },
    { value: 3, label: "Non-Anginal Pain (3)" },
    { value: 4, label: "Asymptomatic (4)" }
  ]},
  restecg: { label: "Resting ECG", options: [
    { value: 0, label: "Normal (0)" },
    { value: 1, label: "ST-T Wave Abnormality (1)" },
    { value: 2, label: "Left Ventricular Hypertrophy (2)" }
  ]},
  exang: { label: "Exercise Induced Angina", options: [{ value: 0, label: "No (0)" }, { value: 1, label: "Yes (1)" }] },
  slope: { label: "ST-Segment Slope", options: [
    { value: 1, label: "Upsloping (1)" },
    { value: 2, label: "Flat (2)" },
    { value: 3, label: "Downsloping (3)" }
  ]},
  ca: { label: "Number of Major Vessels", options: [
    { value: 0, label: "0" }, { value: 1, label: "1" }, { value: 2, label: "2" }, { value: 3, label: "3" }
  ]},
  thal: { label: "Thalassemia Result", options: [
    { value: 3, label: "Normal (3)" },
    { value: 6, label: "Fixed Defect (6)" },
    { value: 7, label: "Reversible Defect (7)" }
  ]}
};

export function isHighRisk(field: string, value: number): boolean {
  switch (field) {
    case 'age': return value > 60;
    case 'sex': return false; // Male is not universally flagged high risk in this UI
    case 'trestbps': return value > 140 || value < 80;
    case 'chol': return value > 240;
    case 'fbs': return value === 1;
    case 'thalach': return value < 100;
    case 'oldpeak': return value > 2;
    case 'cp': return [1, 2, 3].includes(value); // Any typical/atypical/non-anginal pain
    case 'restecg': return value !== 0; // Any abnormality
    case 'exang': return value === 1; // Exercise induced angina
    case 'slope': return value !== 1; // 2=flat, 3=downsloping
    case 'ca': return value > 0; // >0 vessels colored
    case 'thal': return value !== 3; // 6=fixed, 7=reversable
    default: return false;
  }
}
