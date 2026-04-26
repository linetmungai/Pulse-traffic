import { useEffect, useState } from "react";
import { getCurrentUser, type AuthUser } from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
    setReady(true);
    const onChange = () => setUser(getCurrentUser());
    window.addEventListener("flowsight-auth", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("flowsight-auth", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  return { user, ready };
}
