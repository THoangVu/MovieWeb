import React from "react";
import { getUser, logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  if (!user) {
    return (
      <div className="pt-24 text-white min-h-screen bg-black px-6">
        <h1 className="text-2xl font-semibold">Bạn chưa đăng nhập</h1>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 bg-red-600 hover:bg-red-700 transition rounded px-4 py-2 font-semibold"
        >
          Đến trang đăng nhập
        </button>
      </div>
    );
  }

  return (
    <div className="pt-24 text-white min-h-screen bg-black px-6">
      <h1 className="text-3xl font-bold mb-4">Hồ sơ</h1>
      <div className="bg-neutral-900 rounded p-6 max-w-lg">
        <p className="text-gray-300"><span className="text-white font-semibold">Email:</span> {user.email}</p>
        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 transition rounded px-4 py-2 font-semibold"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;


