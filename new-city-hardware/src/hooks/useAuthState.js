import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { auth } from '../firebase';

export function useAuthState() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, authLoading };
}
