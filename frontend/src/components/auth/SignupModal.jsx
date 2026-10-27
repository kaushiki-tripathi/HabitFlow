import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "../../context/ToastContext";

export default function SignupModal({ open, onClose, onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      const msg = "Please fill in all fields.";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (password.length < 6) {
      const msg = "Password must be at least 6 characters long.";
      setError(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);
    try {
      const result = await register(name.trim(), email.trim(), password);
      if (result?.success) {
        toast.success("Account created successfully! Welcome to HabitFlow.");
        onClose();
        navigate("/dashboard");
      } else {
        const msg = result?.error || "Registration failed";
        setError(msg);
        toast.error(msg);
      }
    } catch (err) {
      const msg = err?.message || "Registration failed";
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
        toast.success("Account created with Google! Welcome to HabitFlow.");
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
        {/* Pinterest style single card matching LoginModal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[420px] rounded-3xl bg-[#FFFCFA] p-8 sm:p-10 shadow-2xl border border-[#E8DFD6] text-[#2C261F]"
        >
          {/* ONLY X closes modal */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#F1EAE2] text-[#7A6F64] transition-colors hover:bg-[#E0D5CA] hover:text-[#2C261F]"
            aria-label="Close modal"
          >
            <X size={18} strokeWidth={2.2} />
          </button>

          {/* Header Branding */}
          <div className="text-center mb-6">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-[#2C261F]">
              Create an account
            </h2>
            <p className="mt-1 text-xs text-[#7A6F64]">
              Start your personal space for daily habits
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 p-3 text-center text-xs font-medium text-red-600 border border-red-100">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A6F64] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-2xl border border-[#E8DFD6] bg-[#F7F4EF] px-4 py-2.5 text-sm text-[#2C261F] outline-none transition-all placeholder:text-[#A89A8E] focus:border-[#2C261F] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A6F64] mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-[#E8DFD6] bg-[#F7F4EF] px-4 py-2.5 text-sm text-[#2C261F] outline-none transition-all placeholder:text-[#A89A8E] focus:border-[#2C261F] focus:bg-white"
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
                  placeholder="At least 6 characters"
                  className="w-full rounded-2xl border border-[#E8DFD6] bg-[#F7F4EF] px-4 py-2.5 pr-11 text-sm text-[#2C261F] outline-none transition-all placeholder:text-[#A89A8E] focus:border-[#2C261F] focus:bg-white"
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
              className="mt-2 w-full rounded-full bg-[#2C261F] py-3 text-sm font-semibold text-[#F7F4EF] shadow-md transition-transform active:scale-[0.98] hover:bg-[#3A322A] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
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
              onError={() => setError("Google Sign Up failed")}
              shape="pill"
              theme="outline"
              size="large"
              width="340"
              text="signup_with"
            />
          </div>

          {/* Footer note */}
          <p className="mt-5 text-center text-xs text-[#7A6F64]">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                if (onSwitchToLogin) {
                  onSwitchToLogin();
                } else {
                  onClose();
                }
              }}
              className="font-semibold text-[#2C261F] underline underline-offset-2 hover:opacity-80"
            >
              Log in
            </button>
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
