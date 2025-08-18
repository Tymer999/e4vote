import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { registerUser } from "../firebase/auth";
import { addUser } from "../firebase/firestore";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
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
      const userCredentials = await registerUser(
        formData.email,
        formData.password
      );

      if (userCredentials) {
        // Optionally, you can add user data to Firestore here
        await addUser(
          {
            name: formData.username,
            email: formData.email,
            uid: userCredentials.user.uid,
          },
          userCredentials.user.uid
        );
      }

      setIsSigningIn(false);
      navigate("/admin");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 pt-[2rem]">
      <Navbar />

      <main className="min-h-[80vh] flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-4 md:p-8 sm:p-12 w-full max-w-md border border-gray-700 mx-[1rem]">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Create your account
          </h2>
          <form className="space-y-6" onSubmit={onSubmit}>
            <div>
              <label
                className="block text-sm font-medium text-gray-200 mb-1"
                htmlFor="name"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Your Name"
                onChange={(e) => {
                  setFormData({ ...formData, username: e.currentTarget.value });
                }}
              />
            </div>
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
                autoComplete="new-password"
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Create a password"
                onChange={(e) => {
                  setFormData({ ...formData, password: e.currentTarget.value });
                }}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg shadow transition"
            >
              {isSigningIn ? "Loading..." : "Sign Up"}
            </button>
          </form>
          <p className="mt-6 text-center text-gray-300 text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-blue-400 hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SignUp;
