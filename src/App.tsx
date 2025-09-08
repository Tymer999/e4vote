import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import { AuthProvider } from "./context/authContext";
import Dashboard from "./pages/Dashboard";
import VotePage from "./pages/VotePage";
import Results from "./pages/Results";
import Services from "./pages/Services";
import Pricing from "./pages/Pricing";
import { Toaster } from "react-hot-toast";
import Help from "./pages/Help";
import RegisterVoter from "./pages/RegisterVoter";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="bottom-right"
          reverseOrder={false}
          toastOptions={{
            duration: 6000,
            style: {
              background: "#333",
              color: "#fff",
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/vote/:electionId" element={<VotePage />} />
          <Route path="/vote" element={<VotePage />} />
          <Route path="/results/:electionId" element={<Results />} />
          <Route
            path="/vote/register/:electionId"
            element={<RegisterVoter />}
          />
          <Route path="/vote/register" element={<RegisterVoter />} />
          <Route path="/results" element={<Results />} />
          <Route path="/services" element={<Services />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/help" element={<Help />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
