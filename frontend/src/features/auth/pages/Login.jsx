import React, { useState } from "react";
import { Link } from "react-router";
import { FaGoogle, FaCloud } from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email Address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      setIsSubmitting(true);

      setTimeout(() => {
        alert("Login Successful! Backend integration pending.");
        setIsSubmitting(false);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#f0f4f9] text-slate-800 lg:h-screen lg:overflow-hidden">

      {/* LEFT PANEL */}

      <div className="relative w-full lg:w-[42%] xl:w-[40%] bg-[#0047b3] flex flex-col justify-between p-8 sm:p-12 lg:h-full overflow-hidden shrink-0">

        <div
          className="absolute inset-0 bg-cover bg-center z-0 opacity-90 transform scale-105"
          style={{
            backgroundImage: "url('/login-image.jpg')",
          }}
        />

        <div className="absolute inset-0 bg-[#0052cc]/30 mix-blend-color pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 via-blue-900/20 to-transparent pointer-events-none z-10" />

        {/* LOGO */}

        <div className="relative z-20 flex items-center gap-2">
          <div className="flex items-end gap-0.5 h-6 shrink-0">
            <div className="w-[10px] h-[14px] bg-white rounded-tl-[2px] rounded-bl-[2px]" />
            <div className="w-[10px] h-[22px] bg-white rounded-tr-[2px] rounded-br-[2px]" />
          </div>

          <span className="text-lg font-bold text-white tracking-tight ml-1">
            PolicyGPT
          </span>
        </div>

        {/* HERO TEXT */}

        <div className="relative z-20 mt-32 lg:mt-auto">

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
            Welcome Back.
          </h1>

          <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-md">
            Securely access your personalized government schemes,
            eligibility recommendations, and AI-powered assistance.
          </p>

        </div>

      </div>

      {/* RIGHT PANEL */}

      <div className="w-full lg:w-[58%] xl:w-[60%] flex items-center justify-center p-4 sm:p-6 lg:p-8">

        <div className="w-full max-w-[430px] bg-white rounded-[24px] border border-slate-300 shadow-md p-8">

          {/* HEADER */}

          <div className="text-center mb-6">

            <h2 className="text-3xl font-bold text-slate-800">
              Welcome Back
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Sign in to continue exploring government schemes.
            </p>

          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* EMAIL */}

            <div>

              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl border text-sm shadow-sm focus:outline-none ${
                  errors.email
                    ? "border-red-500"
                    : "border-slate-300 focus:border-[#0052cc]"
                }`}
              />

              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email}
                </p>
              )}

            </div>

            {/* PASSWORD */}

            <div>

              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl border text-sm shadow-sm focus:outline-none ${
                  errors.password
                    ? "border-red-500"
                    : "border-slate-300 focus:border-[#0052cc]"
                }`}
              />

              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password}
                </p>
              )}

            </div>
                        {/* REMEMBER ME + FORGOT PASSWORD */}

            <div className="flex items-center justify-between">

              <label className="flex items-center gap-2 cursor-pointer">

                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="rounded border-slate-300 text-[#0052cc] focus:ring-[#0052cc]"
                />

                <span className="text-sm text-slate-600">
                  Remember Me
                </span>

              </label>

              <button
                type="button"
                className="text-sm font-semibold text-[#0052cc] hover:underline"
              >
                Forgot Password?
              </button>

            </div>

            {/* SIGN IN BUTTON */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-[#0052cc] hover:bg-[#0047b3] text-white font-bold transition-colors duration-200 disabled:opacity-70"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>

            {/* DIVIDER */}

            <div className="relative flex items-center py-2">

              <div className="flex-grow border-t border-slate-300"></div>

              <span className="mx-4 text-xs font-semibold text-slate-500">
                OR
              </span>

              <div className="flex-grow border-t border-slate-300"></div>

            </div>

            {/* GOOGLE */}

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 border border-slate-300 rounded-xl py-3 hover:bg-slate-50 transition"
            >
              <FaGoogle className="text-red-500 text-lg" />

              <span className="font-medium">
                Continue with Google
              </span>

            </button>

            {/* DIGILOCKER */}

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 border border-slate-300 rounded-xl py-3 hover:bg-slate-50 transition"
            >
              <FaCloud className="text-[#0052cc] text-lg" />

              <span className="font-medium">
                Continue with DigiLocker
              </span>

            </button>

            {/* CREATE ACCOUNT */}

            <div className="text-center pt-2">

              <p className="text-sm text-slate-500">

                Don't have an account?{" "}

                <Link
                  to="/register"
                  className="font-bold text-[#0052cc] hover:underline"
                >
                  Create Account
                </Link>

              </p>

            </div>
                      </form>

        </div>

      </div>

    </div>
  );
};

export default Login;