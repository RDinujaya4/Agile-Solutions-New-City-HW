import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function ProtectedRoute({ children, roleRequired }) {
  const [checking, setChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsAuthorized(false);
        setChecking(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const role = userDoc.data().role;
          setIsAuthorized(role === roleRequired);
        } else {
          setIsAuthorized(false);
        }
      } catch (err) {
        console.error('Error checking role:', err);
        setIsAuthorized(false);
      } finally {
        setChecking(false);
      }
    });

    return () => unsubscribe();
  }, [roleRequired]);

  if (checking) {
    return <div className="text-center mt-10 text-white">Checking permissions...</div>;
  }

  if (!auth.currentUser) return <Navigate to="/login" />;
  if (!isAuthorized) return <Navigate to="/" />;

  return children;
}
