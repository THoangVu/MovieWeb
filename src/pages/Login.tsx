import React from "react";
import { useNavigate } from "react-router-dom";
import { login, validateCredentials } from "../utils/auth";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Vui lòng nhập email và mật khẩu");
      return;
    }
    const ok = validateCredentials(email, password);
    if (!ok) {
      setError("Email hoặc mật khẩu không đúng");
      return;
    }
    login({ email });
    navigate("/profile", { replace: true });
  };

  return (
    <div className="pt-24 text-white min-h-screen bg-black px-6 flex justify-center">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md bg-neutral-900 rounded p-6 shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-6">Sign In</h1>
        <label className="block mb-3">
          <span className="text-sm text-gray-300">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded bg-neutral-800 px-3 py-2 outline-none focus:ring-2 focus:ring-red-600"
            placeholder="you@example.com"
          />
        </label>
        <label className="block mb-4">
          <span className="text-sm text-gray-300">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded bg-neutral-800 px-3 py-2 outline-none focus:ring-2 focus:ring-red-600"
            placeholder="••••••••"
          />
        </label>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 transition rounded px-4 py-2 font-semibold"
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
};

export default Login;


