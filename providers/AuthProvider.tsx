import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import createContextHook from '@nkzw/create-context-hook';
import { supabase } from '@/lib/supabase';
import { Alert } from 'react-native';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  membership_tier: 'free' | 'premium' | 'pro';
  membership_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [initializing, setInitializing] = useState<boolean>(true);
  const isMountedRef = React.useRef(true);

  // Cleanup function to set mounted state to false
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (isMountedRef.current) {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setInitializing(false);
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (isMountedRef.current) {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadProfile();
    } else {
      if (isMountedRef.current) {
        setProfile(null);
      }
    }
  }, [user]);

  const loadProfile = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      if (isMountedRef.current) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }, [user]);

  const signUp = useCallback(async (email: string, password: string, fullName?: string) => {
    try {
      if (isMountedRef.current) {
        setLoading(true);
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error: error as AuthError };
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      if (isMountedRef.current) {
        setLoading(true);
      }
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error: error as AuthError };
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      if (isMountedRef.current) {
        setLoading(true);
      }
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      Alert.alert('Error', 'Failed to sign out');
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      if (isMountedRef.current) {
        setLoading(true);
      }
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error: error as AuthError };
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      if (isMountedRef.current) {
        setLoading(true);
      }
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;
      await loadProfile();
      return { error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { error: error as Error };
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [user, loadProfile]);

  const isPremium = useMemo(() => {
    if (!profile) return false;
    if (profile.membership_tier === 'free') return false;
    if (!profile.membership_expires_at) return false;
    return new Date(profile.membership_expires_at) > new Date();
  }, [profile]);

  return useMemo(() => ({
    session,
    user,
    profile,
    loading,
    initializing,
    isPremium,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    loadProfile,
  }), [session, user, profile, loading, initializing, isPremium, signUp, signIn, signOut, resetPassword, updateProfile, loadProfile]);
});
