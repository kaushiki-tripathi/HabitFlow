import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, User as UserIcon, Sparkles, ArrowLeft } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";

const fieldClass =
  "w-full rounded-2xl border border-[#E8DFD6] bg-[#F7F4EF]/60 px-4 py-3.5 pl-11 text-sm text-[#2C261F] outline-none transition placeholder:text-[#A08F7E] focus:border-[#C4B2A0] focus:bg-white focus:ring-2 focus:ring-[#C4B2A0]/20";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const { register, googleLogin, loading, error: authError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setLocalError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters long.");
      return;
    }

    const result = await register(name, email, password);
    if (result.success) {
      navigate("/dashboard");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLocalError("");
    if (credentialResponse?.credential) {
      const result = await googleLogin(credentialResponse.credential);
      if (result.success) {
        navigate("/dashboard");
      }
    }
  };

  const displayError = localError || authError;

  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#F4F0EA] px-4 py-12 text-[#2C261F] sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-[#6F655C] transition hover:text-[#2C261F]"
        >
          <ArrowLeft size={14} /> Back to home
        </Link>

        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#8C7465]">
            <Sparkles size={14} /> HabitFlow
          </span>
          <h1 className="mt-2 font-serif text-3xl tracking-tight text-[#2C261F] sm:text-4xl">
            Begin your practice
          </h1>
          <p className="mt-2 text-sm text-[#6F655C]">
            Create a personal space for your daily habits.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-[2rem] border border-[#E8DFD6] bg-[#FFFCFA] p-6 shadow-[0_20px_60px_rgba(44,38,31,0.08)] sm:p-8">
          {displayError && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50/70 p-3.5 text-xs text-red-700">
              {displayError}
            </div>
          )}

          {/* Google OAuth Button */}
          <div className="mb-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setLocalError("Google Sign-In failed. Please try again.")}
              theme="outline"
              shape="pill"
              size="large"
              text="continue_with"
            />
          </div>

          <div className="relative mb-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E8DFD6]" />
            </div>
            <span className="relative bg-[#FFFCFA] px-3 text-[11px] font-semibold uppercase tracking-wider text-[#A08F7E]">
              or register with email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A7B6C]">
                Your Name
              </span>
              <div className="relative">
                <UserIcon
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A08F7E]"
                />
                <input
                  type="text"
                  required
                  placeholder="Kaushiki"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={fieldClass}
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A7B6C]">
                Email Address
              </span>
              <div className="relative">
                <Mail
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A08F7E]"
                />
                <input
                  type="email"
                  required
                  placeholder="kaushiki@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={fieldClass}
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A7B6C]">
                Password
              </span>
              <div className="relative">
                <Lock
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A08F7E]"
                />
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={fieldClass}
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full cursor-pointer rounded-full bg-[#2C261F] px-4 py-3.5 text-sm font-semibold text-[#F7F4EF] transition hover:bg-[#3A322A] disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 border-t border-[#E8DFD6] pt-6 text-center text-xs text-[#6F655C]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#8C7465] transition hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}