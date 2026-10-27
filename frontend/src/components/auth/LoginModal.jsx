import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "../../context/ToastContext";

export default function LoginModal({ open, onClose, onSwitchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result?.success) {
        toast.success("Welcome back! Logged in successfully.");
        onClose();
        navigate("/dashboard");
      } else {
        const msg = result?.error || "Invalid email or password";
        setError(msg);
        toast.error(msg);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err?.message || "Invalid email or password";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setLoading(true);
    try {
      if (!credentialResponse?.credential) {
        const msg = "No credentials received from Google.";
        setError(msg);
        toast.error(msg);
        return;
      }
      const result = await googleLogin(credentialResponse.credential);
      if (result?.success) {
        toast.success("Welcome back! Signed in with Google.");
        onClose();
        navigate("/dashboard");
      } else {
        const msg = result?.error || "Google sign in failed";
        setError(msg);
        toast.error(msg);
      }
    } catch (err) {
      const msg = err?.message || "Google sign in failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-[#2C261F]/40 backdrop-blur-sm">

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[420px] rounded-3xl bg-[#FFFCFA] p-8 sm:p-10 shadow-2xl border border-[#E8DFD6] text-[#2C261F]"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#F1EAE2] text-[#7A6F64] transition-colors hover:bg-[#E0D5CA] hover:text-[#2C261F]"
            aria-label="Close modal"
          >
            <X size={18} strokeWidth={2.2} />
          </button>

          {/* Header Branding */}
          <div className="text-center mb-7">
            
            <h2 className="font-serif text-2xl font-bold tracking-tight text-[#2C261F]">
              Welcome back
            </h2>
            <p className="mt-1 text-xs text-[#7A6F64]">
              Log in to continue your daily tracking
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 p-3 text-center text-xs font-medium text-red-600 border border-red-100">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A6F64] mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your_name@gmail.com"
                className="w-full rounded-2xl border border-[#E8DFD6] bg-[#F7F4EF] px-4 py-3 text-sm text-[#2C261F] outline-none transition-all placeholder:text-[#A89A8E] focus:border-[#2C261F] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A6F64] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="your_password"
                  className="w-full rounded-2xl border border-[#E8DFD6] bg-[#F7F4EF] px-4 py-3 pr-11 text-sm text-[#2C261F] outline-none transition-all placeholder:text-[#A89A8E] focus:border-[#2C261F] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7A6F64] hover:text-[#2C261F]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-full bg-[#2C261F] py-3.5 text-sm font-semibold text-[#F7F4EF] shadow-md transition-transform active:scale-[0.98] hover:bg-[#3A322A] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Signing in..." : "Continue"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#E8DFD6]" />
            <span className="text-[11px] font-semibold tracking-wider text-[#A89A8E]">
              OR
            </span>
            <div className="h-px flex-1 bg-[#E8DFD6]" />
          </div>

          {/* Google OAuth Button */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google Sign In failed")}
              shape="pill"
              theme="outline"
              size="large"
              width="340"
            />
          </div>

          {/* Footer note */}
          <p className="mt-6 text-center text-xs text-[#7A6F64]">
            New to HabitFlow?{" "}
            <button
              type="button"
              onClick={() => {
                if (onSwitchToSignup) {
                  onSwitchToSignup();
                } else {
                  onClose();
                }
              }}
              className="font-semibold text-[#2C261F] underline underline-offset-2 hover:opacity-80"
            >
              Create an account
            </button>
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}