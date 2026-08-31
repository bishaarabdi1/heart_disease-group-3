import { 
  PredictionRequest, 
  PredictionResponse, 
  HealthResponse, 
  User, 
  Assessment, 
  AssessmentCreateResponse 
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3200";

// --- Health Check ---
export async function checkHealth(): Promise<HealthResponse> {
  try {
    const res = await fetch(`${API_URL}/api/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error(`Health check failed with status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error("Health check error:", error);
    throw error;
  }
}

// --- Guest Prediction ---
export async function predictRisk(data: PredictionRequest): Promise<PredictionResponse> {
  try {
    const res = await fetch(`${API_URL}/api/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `Prediction failed with status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error("Prediction error:", error);
    throw error;
  }
}

// --- Authenticated Assessments ---
export async function createAssessment(data: PredictionRequest): Promise<AssessmentCreateResponse> {
  const res = await fetch(`${API_URL}/api/assessments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to create assessment.");
  }
  return res.json();
}

export async function fetchAssessments(): Promise<Assessment[]> {
  const res = await fetch(`${API_URL}/api/assessments`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to fetch assessment history.");
  }
  return res.json();
}

export async function fetchAssessmentById(id: string): Promise<Assessment> {
  const res = await fetch(`${API_URL}/api/assessments/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to fetch assessment.");
  }
  return res.json();
}

export async function deleteAssessmentById(id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/api/assessments/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to delete assessment.");
  }
  return res.json();
}

// --- Auth Endpoints ---
export async function loginUser(email: string, password: string): Promise<User> {
  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Invalid email or password.");
    }
    return res.json();
  } catch (error: any) {
    if (error.name === "TypeError" || error.message === "Failed to fetch") {
      throw new Error("Unable to connect to backend server. Please verify the backend is running on port 3200.");
    }
    throw error;
  }
}

export async function registerUser(fullName: string, email: string, password: string): Promise<User> {
  try {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ full_name: fullName, email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Registration failed.");
    }
    return res.json();
  } catch (error: any) {
    if (error.name === "TypeError" || error.message === "Failed to fetch") {
      throw new Error("Unable to connect to backend server. Please verify the backend is running on port 3200.");
    }
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  const res = await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!res.ok) {
    console.warn("Logout error");
  }
}

export async function fetchCurrentUser(): Promise<User | null> {
  try {
    const res = await fetch(`${API_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!res.ok) {
      return null;
    }
    return res.json();
  } catch (error) {
    return null;
  }
}

export async function updateUserProfile(data: { full_name?: string; email?: string }): Promise<User> {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to update profile.");
  }
  return res.json();
}
