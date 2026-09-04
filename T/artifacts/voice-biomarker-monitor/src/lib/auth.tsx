import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "patient" | "clinician";
  patientId: string;
  abhaId?: string;
  age?: number;
  dob?: string;
  phone?: string;
  doctorId?: string;
  department?: string;
  city?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string; role?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  login: async () => ({}),
  logout: () => {},
});

const AUTH_KEY = "medikiosk.auth.user";

const demoUsers: Array<AuthUser & { password: string }> = [
  {
    id: "demo-ram",
    email: "ram@medikiosk.ai",
    password: "patient123",
    name: "Ram Kumar",
    role: "patient",
    patientId: "PT-001",
    abhaId: "12-3456-7890-1234",
    age: 56,
    dob: "1970-05-15",
    phone: "+91 98765 43210",
    department: "General Medicine",
    city: "Mumbai",
  },
  {
    id: "demo-sunita",
    email: "sunita@medikiosk.ai",
    password: "patient123",
    name: "Sunita Devi",
    role: "patient",
    patientId: "PT-002",
    abhaId: "98-7654-3210-9876",
    age: 45,
    dob: "1981-08-22",
    phone: "+91 87654 32109",
    department: "Cardiology",
    city: "Delhi",
  },
  {
    id: "demo-ankit",
    email: "ankit@medikiosk.ai",
    password: "patient123",
    name: "Ankit Verma",
    role: "patient",
    patientId: "PT-003",
    age: 28,
    dob: "1997-11-03",
    phone: "+91 76543 21098",
    department: "General Medicine",
    city: "Bangalore",
  },
  {
    id: "demo-doctor",
    email: "doctor@medikiosk.ai",
    password: "doctor123",
    name: "Dr. Priya Sharma",
    role: "clinician",
    patientId: "CL-001",
    doctorId: "DR-001",
    department: "General Medicine",
    city: "Mumbai",
  },
  {
    id: "demo-doctor2",
    email: "dr.rajesh@medikiosk.ai",
    password: "doctor123",
    name: "Dr. Rajesh Gupta",
    role: "clinician",
    patientId: "CL-002",
    doctorId: "DR-002",
    department: "Cardiology",
    city: "Delhi",
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ error?: string; role?: string }> => {
    const commitUser = (nextUser: AuthUser) => {
      setUser(nextUser);
      localStorage.setItem(AUTH_KEY, JSON.stringify(nextUser));
    };

    const demoUser = demoUsers.find(
      (candidate) => candidate.email === email.toLowerCase().trim() && candidate.password === password
    );

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (demoUser) {
          const { password: _password, ...safeDemoUser } = demoUser;
          commitUser(safeDemoUser);
          return { role: safeDemoUser.role };
        }
        return { error: data.error || "Invalid email or password" };
      }
      commitUser(data.user);
      return { role: data.user.role };
    } catch {
      if (demoUser) {
        const { password: _password, ...safeDemoUser } = demoUser;
        commitUser(safeDemoUser);
        return { role: safeDemoUser.role };
      }
      return { error: "Network error — use a demo account or try again" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
    // Clear all persisted chat histories
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("medikiosk.chat.")) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
