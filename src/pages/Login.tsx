import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { loginUser } from "../firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const onSubmit = async (e: any) => {
    e.preventDefault();

    if (isSigningIn) {
      return;
    }
    setIsSigningIn(true);
    try {
      await loginUser(formData.email, formData.password);

      setIsSigningIn(false);

      navigate("/admin");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials and try again.");
      setIsSigningIn(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 pt-[2rem]">
      <Navbar />
      <main className="min-h-[92vh] flex items-center justify-center ">
        <div className="bg-white/10 rounded-2xl shadow-2xl p-4 md:p-8 sm:p-12 w-full max-w-md border border-gray-700 mx-[1rem]">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Sign in to your account
          </h2>
          <form className="space-y-6" onSubmit={onSubmit}>
            <div>
              <label
                className="block text-sm font-medium text-gray-200 mb-1"
                htmlFor="email"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="you@email.com"
                onChange={(e) => {
                  setFormData({ ...formData, email: e.currentTarget.value });
                  console.log(formData);
                }}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-200 mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="••••••••"
                onChange={(e) => {
                  setFormData({ ...formData, password: e.currentTarget.value });
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-gray-200"
                >
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-blue-400 hover:underline">
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg shadow transition"
            >
              {isSigningIn ? "Loading..." : "Sign In"}
            </button>
          </form>
          <p className="mt-6 text-center text-gray-300 text-sm">
            Don&apos;t have an account?{" "}
            <Link to={"/sign-up"} className="text-blue-400 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default Login;
