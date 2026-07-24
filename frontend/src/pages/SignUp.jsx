import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { serverUrl } from "../main";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { userName, email, password },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      navigate("/profile");
      setEmail("");
      setPassword("");
      setUserName("");
    } catch (error) {
      setErr(error?.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-full items-center justify-center overflow-hidden bg-gradient-to-br from-brand-100 via-ink-50 to-brand-200 px-4 py-10">
      <div className="pointer-events-none absolute -right-20 top-8 h-64 w-64 rounded-full bg-brand-300/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 bottom-0 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl" />

      <div className="card-shell animate-slide-up relative z-10">
        <div className="bg-gradient-to-br from-brand-500 to-brand-700 px-8 pb-12 pt-10 text-center text-white">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand-100">
            Get started
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight">
            Join <span className="text-white">Chatly</span>
          </h1>
          <p className="mt-2 text-sm text-brand-100">
            Create your account and start chatting instantly.
          </p>
        </div>

        <form
          className="relative -mt-6 flex flex-col gap-4 px-6 pb-8 sm:px-8"
          onSubmit={handleSignUp}
        >
          <div className="rounded-2xl bg-white p-5 shadow-card">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
              Username
            </label>
            <input
              type="text"
              required
              placeholder="cool_user"
              className="input-field"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              autoComplete="username"
            />

            <label className="mb-1.5 mt-4 block text-xs font-semibold uppercase tracking-wide text-ink-500">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

            <label className="mb-1.5 mt-4 block text-xs font-semibold uppercase tracking-wide text-ink-500">
              Password
            </label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                required
                minLength={6}
                placeholder="At least 6 characters"
                className="input-field pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-600"
                onClick={() => setShow((p) => !p)}
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? (
                  <IoEyeOffOutline className="h-5 w-5" />
                ) : (
                  <IoEyeOutline className="h-5 w-5" />
                )}
              </button>
            </div>

            {err && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {err}
              </p>
            )}

            <button type="submit" className="btn-primary mt-5 w-full" disabled={loading}>
              {loading ? "Creating account…" : "Sign Up"}
            </button>
          </div>

          <p className="text-center text-sm text-ink-600">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
