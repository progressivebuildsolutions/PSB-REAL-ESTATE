import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true, 
  isAdmin: false,
  signInWithGoogle: async () => {},
  logout: async () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  console.log('AuthProvider initializing...');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const signInWithGoogle = async () => {
    console.log('Attempting Google Sign-In...');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Sign-In Success:', result.user.email);
      toast.success(`Welcome back, ${result.user.displayName}!`);
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      if (error.code === 'auth/popup-blocked') {
        toast.error('Login popup was blocked by your browser. Please allow popups.');
      } else if (error.code === 'auth/unauthorized-domain') {
        toast.error('This domain is not authorized in Firebase. Please add it to Authorized Domains.');
      } else {
        toast.error(`Login failed: ${error.message}`);
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout Error:', error);
      toast.error('Failed to logout');
    }
  };

  useEffect(() => {
    console.log('AuthProvider useEffect running...');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('onAuthStateChanged fired:', user?.email);
      try {
        setUser(user);
        if (user) {
          // Check if user document exists, if not create it
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
            console.log('Creating new user document...');
            await setDoc(userRef, {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              role: user.email === 'progressivebuildsolutions@gmail.com' ? 'admin' : 'user',
              createdAt: serverTimestamp()
            });
            setIsAdmin(user.email === 'progressivebuildsolutions@gmail.com');
          } else {
            const data = userSnap.data();
            console.log('User document found, role:', data?.role);
            setIsAdmin(data?.role === 'admin');
          }
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Auth State Change Error:', error);
        toast.error('Error updating user profile');
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
