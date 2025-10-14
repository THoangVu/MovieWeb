import React from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, login } from "../utils/auth";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password || !confirm) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu tối thiểu 6 ký tự");
      return;
    }
    if (password !== confirm) {
      setError("Mật khẩu không khớp");
      return;
    }
    const result = registerUser({ email, name, password });
    if (!result.ok) {
      setError(result.message ?? "Đăng ký thất bại");
      return;
    }
    // Auto login after register
    login({ email, name });
    navigate("/profile", { replace: true });
  };

  return (
    <div className="pt-24 text-white min-h-screen bg-black px-6 flex justify-center">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-neutral-900 rounded p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Tạo tài khoản</h1>
        <label className="block mb-3">
          <span className="text-sm text-gray-300">Tên</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded bg-neutral-800 px-3 py-2 outline-none focus:ring-2 focus:ring-red-600"
            placeholder="Tên của bạn"
          />
        </label>
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
        <label className="block mb-3">
          <span className="text-sm text-gray-300">Mật khẩu</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded bg-neutral-800 px-3 py-2 outline-none focus:ring-2 focus:ring-red-600"
            placeholder="••••••••"
          />
        </label>
        <label className="block mb-4">
          <span className="text-sm text-gray-300">Nhập lại mật khẩu</span>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="mt-1 w-full rounded bg-neutral-800 px-3 py-2 outline-none focus:ring-2 focus:ring-red-600"
            placeholder="••••••••"
          />
        </label>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <button type="submit" className="w-full bg-red-600 hover:bg-red-700 transition rounded px-4 py-2 font-semibold">
          Đăng ký
        </button>
      </form>
    </div>
  );
};

export default Register;


