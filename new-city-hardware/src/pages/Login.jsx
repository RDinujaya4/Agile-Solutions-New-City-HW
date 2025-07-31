import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
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

export default function Auth() {
  const [isSignup, setIsSignup] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
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
          alert("Please fill in all fields");
          setLoading(false);
          return;
        }

        if (!usernameAvailable) {
          alert("Username already taken");
          setLoading(false);
          return;
        }

        const allValid = Object.values(passwordStrength).every((v) => v === true);
          if (!allValid) {
            toast.error("Please choose a stronger password.");
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

        toast.success("Signup successful!");
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        const role = userDoc.exists() ? userDoc.data().role : "user";
        navigate(role === "admin" ? "/admindash" : "/");
      } else {
        await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        await auth.currentUser.getIdToken(true);
        toast.success("Login successful!");
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        const role = userDoc.exists() ? userDoc.data().role : "user";
        navigate(role === "admin" ? "/admindash" : "/");
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
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

      alert("Signed in with Google!");
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

  const handleLogout = async () => {
    await signOut(auth);
    setUserInfo(null);
    toast.success("Logout successful!");
  };

  if (userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-800">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-12 text-white text-center border border-white/10">
          <h1 className="text-3xl font-bold mb-4">Welcome, {userInfo.username} 👋</h1>
          <button
            onClick={handleLogout}
            className="mt-4 px-6 py-2 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300 transition"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  if (authLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-800">
      {/* Left Image */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-slate">
        <div className="p-8">
          <img
            src={authImage}
            alt="Authentication"
            className="w-full h-[85vh] object-cover rounded-2xl shadow-lg"
          />
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-10 bg-slate-800">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 sm:p-12 w-full max-w-xl text-white border border-white/10">
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

          <form className="space-y-4" onSubmit={handleSubmit}>
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
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-400 text-black font-bold py-2 rounded-xl hover:bg-yellow-300 transition"
            >
              {loading ? "Please wait..." : isSignup ? "Sign Up" : "Log In"}
            </button>
          </form>

          <div className="text-sm text-center text-gray-400 mt-6">
            {isSignup ? (
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
