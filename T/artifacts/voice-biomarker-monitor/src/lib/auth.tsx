import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "patient" | "clinician";
  patientId: string;
  conditions: string[];
  age?: number;
  dob?: string;
  phone?: string;
  clinicianName?: string;
  doctorId?: string;
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

const AUTH_KEY = "voxara.auth.user";

const demoUsers: Array<AuthUser & { password: string }> = [
  {
    id: "demo-alex",
    email: "alex@voxara.ai",
    password: "patient123",
    name: "Alex Carter",
    role: "patient",
    patientId: "PT-001",
    conditions: ["Asthma", "Mild Depression"],
    age: 34,
    dob: "1990-03-12",
    phone: "+1 (555) 291-4820",
    clinicianName: "Dr. Priya Mehta",
  },
  {
    id: "demo-sofia",
    email: "sofia@voxara.ai",
    password: "patient123",
    name: "Sofia Reyes",
    role: "patient",
    patientId: "PT-002",
    conditions: ["Parkinson's (Early Stage)"],
    age: 62,
    dob: "1962-07-28",
    phone: "+1 (555) 838-3710",
    clinicianName: "Dr. James Osei",
  },
  {
    id: "demo-doctor",
    email: "doctor@voxara.ai",
    password: "doctor123",
    name: "Dr. Priya Mehta",
    role: "clinician",
    patientId: "CL-001",
    conditions: [],
    doctorId: "DR-003",
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

    const demoUser = demoUsers.find((candidate) => candidate.email === email.toLowerCase().trim() && candidate.password === password);

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
