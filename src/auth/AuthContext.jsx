import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient";

const AuthContext = createContext(null);

async function fetchProfile(userId) {
  if (!supabase || !userId) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, role, status, created_at")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Unable to fetch profile", error);
    return null;
  }

  return data;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const sessionRef = useRef(null);
  const profileRequestRef = useRef(0);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return undefined;
    }

    let isMounted = true;

    async function hydrateSession() {
      setIsLoading(true);
      const { data, error } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      if (error) {
        console.error("Unable to hydrate Supabase session", error);
        setSession(null);
        setProfile(null);
        setIsLoading(false);
        return;
      }

      const nextSession = data.session ?? null;
      sessionRef.current = nextSession;
      setSession(nextSession);
      setProfile(nextSession?.user ? await fetchProfile(nextSession.user.id) : null);
      setIsLoading(false);
    }

    hydrateSession();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      const previousUserId = sessionRef.current?.user?.id ?? null;
      const nextUserId = nextSession?.user?.id ?? null;
      const shouldBlockRoute = previousUserId !== nextUserId;
      const requestId = ++profileRequestRef.current;

      sessionRef.current = nextSession;
      setSession(nextSession);
      if (shouldBlockRoute) {
        setIsLoading(true);
      }

      window.setTimeout(async () => {
        if (!isMounted) {
          return;
        }

        const nextProfile = nextSession?.user ? await fetchProfile(nextSession.user.id) : null;
        if (!isMounted || requestId !== profileRequestRef.current) {
          return;
        }

        setProfile(nextProfile);
        if (shouldBlockRoute) {
          setIsLoading(false);
        }
      }, 0);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  }

  async function refreshProfile() {
    if (!session?.user) {
      setProfile(null);
      return;
    }

    setIsLoading(true);
    setProfile(await fetchProfile(session.user.id));
    setIsLoading(false);
  }

  const value = useMemo(() => {
    const role = profile?.role ?? null;
    const status = profile?.status ?? null;
    const isApproved = status === "approved";
    const isTeamMember = isApproved && (role === "team" || role === "admin");
    const isAdmin = isApproved && role === "admin";

    return {
      isConfigured: isSupabaseConfigured,
      isLoading,
      session,
      user: session?.user ?? null,
      profile,
      role,
      status,
      isApproved,
      isTeamMember,
      isAdmin,
      signOut,
      refreshProfile
    };
  }, [isLoading, profile, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return value;
}
