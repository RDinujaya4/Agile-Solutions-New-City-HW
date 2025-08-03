import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  query,
  where,
  collection,
  getDocs,
} from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import authImage from "../assets/Signup.jpg";
import toast from 'react-hot-toast';
import { sendPasswordResetEmail } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import { Toast } from '../utils/toast';

export default function Auth() {
  const [isSignup, setIsSignup] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docSnap = await getDoc(doc(db, "users", user.uid));
          if (docSnap.exists()) {
            setUserInfo(docSnap.data());
          }
        } catch (err) {
          console.error("Error fetching user info:", err);
        }
      } else {
        setUserInfo(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkUsername = async () => {
      if (!isSignup || formData.username.trim().length < 3) {
        setUsernameAvailable(null);
        return;
      }

      try {
        const q = query(
          collection(db, "users"),
          where("username", "==", formData.username.trim())
        );
        const snapshot = await getDocs(q);
        setUsernameAvailable(snapshot.empty);
      } catch (error) {
        console.error("Error checking username:", error);
        setUsernameAvailable(null);
      }
    };

    checkUsername();
  }, [formData.username, isSignup]);

  useEffect(() => {
    if (!isSignup) return;

    const { password } = formData;

    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [formData.password, isSignup]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        if (
          !formData.firstName ||
          !formData.lastName ||
          !formData.username ||
          !formData.email ||
          !formData.password
        ) {
          Toast.fire({ icon: 'warning', title: 'Please fill in all fields.' });
          setLoading(false);
          return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov|lk|info|io|co)$/;
        if (!emailRegex.test(formData.email)) {
          Toast.fire({ icon: 'error', title: 'Enter a valid email address.' });
          setLoading(false);
          return;
        }

        if (!usernameAvailable) {
          Toast.fire({ icon: 'error', title: 'Username already taken.' });
          setLoading(false);
          return;
        }

        if (!agree) {
          Toast.fire({ icon: 'warning', title: 'You must agree to the Terms and Privacy Policy.' });
          return;
        }

        const allValid = Object.values(passwordStrength).every((v) => v === true);
          if (!allValid) {
            Toast.fire({
              icon: 'warning',
              title: 'Please choose a stronger password.',
            });
            setLoading(false);
            return;
          }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username.trim(),
          email: formData.email,
          role: "user",
          createdAt: new Date(),
        });

        Toast.fire({
          icon: 'success',
          title: "Signup successful!",
        });
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        const role = userDoc.exists() ? userDoc.data().role : "user";
        navigate(role === "admin" ? "/admindash" : "/");
      } else {
        await setPersistence(auth, browserSessionPersistence);

        await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        
        await auth.currentUser.getIdToken(true);
        Toast.fire({
          icon: 'success',
          title: "Login successful!",
        });
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        const role = userDoc.exists() ? userDoc.data().role : "user";
        navigate(role === "admin" ? "/admindash" : "/");
      }
    } catch (error) {
      console.error(error);
      Toast.fire({
        icon: 'error',
        title: "Enter valid email and password.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          uid: user.uid,
          firstName: user.displayName?.split(" ")[0] || "",
          lastName: user.displayName?.split(" ")[1] || "",
          username: user.email.split("@")[0],
          email: user.email,
          provider: "google",
          role: "user",
          createdAt: new Date(),
        });
      }

      Toast.fire({
        icon: 'info',
        title: 'Signed in with Google!',
      });
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      const role = userDoc.exists() ? userDoc.data().role : "user";
      navigate(role === "admin" ? "/admindash" : "/");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  useEffect(() => {
    if (userInfo) {
      const role = userInfo.role || "user";
      navigate(role === "admin" ? "/admindash" : "/");
    }
  }, [userInfo, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-800">
        <div className="animate-pulse flex flex-col md:flex-row w-full max-w-5xl p-4 gap-6">
          <div className="hidden md:block md:w-1/2 bg-gray-700 rounded-2xl h-[75vh]"></div>

          <div className="flex-1 space-y-4 bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10">
            <div className="h-6 bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/3"></div>

            <div className="space-y-4 mt-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-700 rounded w-full"></div>
              ))}

              <div className="h-10 bg-yellow-500/60 rounded w-full mt-4"></div>
              <div className="h-4 bg-gray-600 rounded w-2/3 mt-4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-800">
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-slate-800">
        <div className="p-6">
          <img
            src={authImage}
            alt="Authentication"
            className="w-full h-[75vh] object-cover rounded-2xl shadow-lg"
          />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-6 md:py-4 bg-slate-800">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 sm:p-10 w-full max-w-xl text-white border border-white/10 mt-[-30px]">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold mb-2">
              {isSignup ? "Create an Account" : "Welcome Back"}
            </h2>
            <p className="text-sm text-gray-400">
              {isSignup ? "Register with:" : "Sign in with:"}
            </p>
          </div>

          <div className="flex justify-center gap-4 mb-6">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition"
            >
              <FcGoogle size={18} /> Google
            </button>
          </div>

          <div className="text-center text-gray-500 text-sm mb-6">or</div>
          <AnimatePresence mode="wait">
            {isForgotPassword ? (
              <motion.form
                key="forgot"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!formData.email) {
                    Toast.fire({
                      icon: 'error',
                      title: 'Please enter your email',
                    });
                    return;
                  }
                  try {
                    await sendPasswordResetEmail(auth, formData.email);
                    Toast.fire({
                      icon: 'success',
                      title: 'Password reset email sent!',
                    });
                    setIsForgotPassword(false);
                  } catch (error) {
                    console.error(error);
                    Toast.fire({
                      icon: 'error',
                      title: 'Failed to send reset email',
                    });
                  }
                }}
              >
                <div>
                  <label className="text-sm text-gray-300">Enter your email</label>
                  <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
                    <FiMail className="text-gray-400 mr-2" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="bg-transparent focus:outline-none w-full"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-yellow-400 text-black font-bold py-2 rounded-xl hover:bg-yellow-300 transition"
                >
                  Send Reset Email
                </button>
              </motion.form>
                ) : (
              <motion.form
                key="login"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-2" 
                onSubmit={handleSubmit}>
                {isSignup && (
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm text-gray-300">First Name</label>
                      <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
                        <FiUser className="text-gray-400 mr-2" />
                        <input
                          type="text"
                          placeholder="First Name"
                          className="bg-transparent focus:outline-none w-full"
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData({ ...formData, firstName: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="text-sm text-gray-300">Last Name</label>
                      <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
                        <FiUser className="text-gray-400 mr-2" />
                        <input
                          type="text"
                          placeholder="Last Name"
                          className="bg-transparent focus:outline-none w-full"
                          value={formData.lastName}
                          onChange={(e) =>
                            setFormData({ ...formData, lastName: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                {isSignup && (
                  <div>
                    <label className="text-sm text-gray-300">Username</label>
                    <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
                      <FiUser className="text-gray-400 mr-2" />
                      <input
                        type="text"
                        placeholder="Username"
                        className="bg-transparent focus:outline-none w-full"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                      />
                    </div>
                    {formData.username.trim().length >= 3 &&
                      usernameAvailable !== null && (
                        <p
                          className={`text-sm mt-1 ${
                            usernameAvailable ? "text-green-400" : "text-red-500"
                          }`}
                        >
                          {usernameAvailable
                            ? "Username is available"
                            : "Username is taken"}
                        </p>
                      )}
                  </div>
                )}

                <div>
                  <label className="text-sm text-gray-300">Email</label>
                  <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
                    <FiMail className="text-gray-400 mr-2" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="bg-transparent focus:outline-none w-full"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-300">Password</label>
                  <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
                    <FiLock className="text-gray-400 mr-2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="bg-transparent focus:outline-none w-full"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 ml-2"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {isSignup && formData.password.length > 0 && (
                    <div className="text-xs mt-2 text-gray-400 space-y-1 transition-opacity duration-300">
                      <p className={passwordStrength.length ? "text-green-400" : "text-red-400"}>
                        • At least 8 characters
                      </p>
                      <p className={passwordStrength.uppercase ? "text-green-400" : "text-red-400"}>
                        • At least one uppercase letter
                      </p>
                      <p className={passwordStrength.lowercase ? "text-green-400" : "text-red-400"}>
                        • At least one lowercase letter
                      </p>
                      <p className={passwordStrength.number ? "text-green-400" : "text-red-400"}>
                        • At least one number
                      </p>
                      <p className={passwordStrength.special ? "text-green-400" : "text-red-400"}>
                        • At least one special character (!@#$%^...)
                      </p>
                    </div>
                  )}
                  {isSignup && (
                    <div className="flex items-start space-x-3 mt-4">
                      <input
                        id="terms"
                        type="checkbox"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <p className="text-sm">
                        I agree to the{' '}
                        <a href="/terms" target="_blank" className="text-blue-600 underline">
                          Terms of Service and Privacy Policy
                        </a>
                      </p>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-yellow-400 text-black font-bold py-2 rounded-xl hover:bg-yellow-300 transition"
                >
                  {loading ? "Please wait..." : isSignup ? "Sign Up" : "Log In"}
                </button>
              </motion.form>
          )}
        </AnimatePresence>
          <div className="text-sm text-center text-gray-400 mt-6">
            {isForgotPassword ? (
              <button
                onClick={() => setIsForgotPassword(false)}
                className="text-yellow-400 hover:underline"
              >
                ← Back to Login
              </button>
            ) : isSignup ? (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setIsSignup(false)}
                  className="text-yellow-400 hover:underline"
                >
                  Login
                </button>
              </>
            ) : (
              <>
                Don’t have an account?{" "}
                <button
                  onClick={() => setIsSignup(true)}
                  className="text-yellow-400 hover:underline"
                >
                  Sign up
                </button>
                <br />
                <br />
                Forgot Password?{" "}
                <button
                  onClick={() => {
                    setIsSignup(false);
                    setIsForgotPassword(true);
                  }}
                  className="text-yellow-400 hover:underline"
                >
                  Click here
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
