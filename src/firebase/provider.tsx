'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore, doc, getDoc } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { CacheService } from '@/lib/cache-service';

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

// Internal state for user authentication and role metadata
interface UserAuthState {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
  role: 'job-seeker' | 'employer' | null;
  profile: any | null;
}

// Combined state for the Firebase context
export interface FirebaseContextState {
  areServicesAvailable: boolean;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
  role: 'job-seeker' | 'employer' | null;
  profile: any | null;
}

export interface FirebaseServicesAndUser {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
  role: 'job-seeker' | 'employer' | null;
  profile: any | null;
}

export interface UserHookResult {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
  role: 'job-seeker' | 'employer' | null;
  profile: any | null;
}

export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
}) => {
  const [userAuthState, setUserAuthState] = useState<UserAuthState>({
    user: null,
    isUserLoading: true,
    userError: null,
    role: null,
    profile: null,
  });

  // Handle Auth State and Profile Resolution (with Cache)
  useEffect(() => {
    if (!auth || !firestore) {
      setUserAuthState(prev => ({ ...prev, isUserLoading: false }));
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (!firebaseUser) {
          setUserAuthState({ 
            user: null, 
            isUserLoading: false, 
            userError: null, 
            role: null, 
            profile: null 
          });
          CacheService.clear(); // Clear local cache on sign-out
          return;
        }

        // 1. Attempt to load from IndexedDB Cache first for instant resolution
        const cachedRole = await CacheService.get<'job-seeker' | 'employer'>(`role_${firebaseUser.uid}`);
        const cachedProfile = await CacheService.get<any>(`profile_${firebaseUser.uid}`);

        if (cachedRole) {
          setUserAuthState(prev => ({
            ...prev,
            user: firebaseUser,
            role: cachedRole,
            profile: cachedProfile,
            isUserLoading: false // Resolve immediately if cached
          }));
        } else {
          setUserAuthState(prev => ({ ...prev, user: firebaseUser, isUserLoading: true }));
        }

        // 2. Fetch fresh data from Firestore to ensure cache is correct
        try {
          const seekerDoc = await getDoc(doc(firestore, 'jobseekerProfile', firebaseUser.uid));
          const employerDoc = await getDoc(doc(firestore, 'employerProfiles', firebaseUser.uid));

          let finalRole: 'job-seeker' | 'employer' | null = null;
          let finalProfile: any = null;

          if (seekerDoc.exists()) {
            finalRole = 'job-seeker';
            finalProfile = seekerDoc.data();
          } else if (employerDoc.exists()) {
            finalRole = 'employer';
            finalProfile = employerDoc.data();
          }

          // 3. Update Cache for next visit (24hr TTL)
          if (finalRole) {
            await CacheService.set(`role_${firebaseUser.uid}`, finalRole);
            await CacheService.set(`profile_${firebaseUser.uid}`, finalProfile);
          }

          setUserAuthState({
            user: firebaseUser,
            isUserLoading: false,
            userError: null,
            role: finalRole,
            profile: finalProfile,
          });
        } catch (err: any) {
          console.error("Profile resolution error:", err);
          setUserAuthState(prev => ({ ...prev, isUserLoading: false, userError: err }));
        }
      },
      (error) => {
        setUserAuthState(prev => ({ ...prev, isUserLoading: false, userError: error }));
      }
    );

    return () => unsubscribe();
  }, [auth, firestore]);

  const contextValue = useMemo((): FirebaseContextState => {
    const servicesAvailable = !!(firebaseApp && firestore && auth);
    return {
      areServicesAvailable: servicesAvailable,
      firebaseApp: servicesAvailable ? firebaseApp : null,
      firestore: servicesAvailable ? firestore : null,
      auth: servicesAvailable ? auth : null,
      user: userAuthState.user,
      isUserLoading: userAuthState.isUserLoading,
      userError: userAuthState.userError,
      role: userAuthState.role,
      profile: userAuthState.profile,
    };
  }, [firebaseApp, firestore, auth, userAuthState]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): FirebaseServicesAndUser => {
  const context = useContext(FirebaseContext);
  if (context === undefined) throw new Error('useFirebase must be used within a FirebaseProvider.');
  if (!context.areServicesAvailable || !context.firebaseApp || !context.firestore || !context.auth) {
    throw new Error('Firebase core services not available.');
  }
  return context as FirebaseServicesAndUser;
};

export const useAuth = (): Auth => useFirebase().auth;
export const useFirestore = (): Firestore => useFirebase().firestore;
export const useFirebaseApp = (): FirebaseApp => useFirebase().firebaseApp;

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T & {__memo?: boolean} {
  const memoized = useMemo(factory, deps) as any;
  if(typeof memoized === 'object' && memoized !== null) memoized.__memo = true;
  return memoized;
}

export const useUser = (): UserHookResult => {
  const { user, isUserLoading, userError, role, profile } = useFirebase();
  return { user, isUserLoading, userError, role, profile };
};
