import React, {
  useEffect,
  useState,
  useRef,
  type ChangeEvent,
  type FormEvent,
} from "react";
import toast from "react-hot-toast";
import {
  addVoterToElection,
  getElectionById,
  getVotersForElection,
} from "../firebase/firestore";
import type { Voter } from "../../types/types";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegisterVoter = () => {
  const electionId = window.location.pathname.split("/").pop();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formData, setFormData] = useState<Voter>({
    name: "",
    email: "",
    uniqueField: "",
    password: "",
    verificationPhoto: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [election, setElection] = useState<any>(null);

  const handleFileUpload = async () => {
    const data = new FormData();

    if (!file) {
      return "";
    }

    data.append("file", file);
    data.append("upload_preset", "EVote4");
    data.append("cloud_name", "dy3okigwk");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dy3okigwk/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const result = await res.json();

      if (!result.secure_url) {
        return "";
      }
      return result.secure_url;
    } catch (err) {
      console.error("Error uploading image:", err);
      return "";
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "verificationPhoto" && files && files[0]) {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image")) {
        toast.error("Please upload an image file");
        return;
      }

      setFile(file);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple submissions

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Name, email, and phone fields are required");
      return;
    }

    if (formData.password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Check if Voter already exists (by email or name)
    setIsSubmitting(true);
    // const alreadyExists = aspirants.some(
    //   (asp) => asp.email?.toLowerCase() === formData.email.toLowerCase()
    // );

    // if (alreadyExists) {
    //   toast.error(
    //     "Aspirant with this name or email is already registered for this position."
    //   );
    //   return;
    // }
    const voters: any[] = await getVotersForElection(electionId || "");

    const alreadyExists = voters.some(
      (voter) =>
        voter.uniqueField?.toLowerCase() ===
          formData.uniqueField.toLowerCase() ||
        voter.email?.toLowerCase() === formData.email.toLowerCase()
    );

    if (alreadyExists) {
      toast.error("Voter is already registered for this election.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Upload file and get image URL
      const imageUrl = await handleFileUpload();

      // Pass the image URL directly
      await addVoterToElection(electionId || "", {
        ...formData,
        verificationPhoto: imageUrl,
      });

      toast.success("Voter added successfully and waiting for approval.");

      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // <-- Reset file input
      }

      setFormData({
        name: "",
        email: "",
        uniqueField: "",
        password: "",
        verificationPhoto: "",
        phone: "",
      });

      setConfirmPassword("");

      return;
    } catch (error) {
      toast.error(
        "Failed to add voter" +
          (typeof error === "string"
            ? `: ${error}`
            : error instanceof Error
            ? `: ${error.message}`
            : "")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchElection = async () => {
      const electionData = await getElectionById(electionId || "");
      setElection(electionData);
    };

    fetchElection();
  }, [electionId]);

  // console.log(election);

  // console.log(
  //   "AAMUSTED SRC ELECTION".toLowerCase().includes("election")
  //     ? "AAMUSTED SRC ELECTION".split("ELECTION")[0].trim()
  //     : "AAMUSTED SRC ELECTION"
  // );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="md:bg-white/5 md:p-8 p-5 rounded-3xl shadow md:border border-gray-700 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center max-w-[90%] mx-auto">
          {"Register in the upcoming ".toUpperCase()}
          <span className="text-blue-600">
            {election?.name.toLowerCase().includes("election")
              ? election?.name
                  .toLowerCase()
                  .split("election")[0]
                  .trim()
                  .toUpperCase()
              : election?.name}{" "}
            ELECTION
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-gray-400">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full px-4 py-2 md:py-3 rounded border border-gray-800 md:border-gray-600 outline-0 text-white placeholder-gray-500 md:placeholder-gray-400 bg-white/5"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-gray-400">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full px-4 py-2 md:py-3 rounded border border-gray-800 md:border-gray-600 outline-0 text-white placeholder-gray-500 md:placeholder-gray-400 bg-white/5"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-gray-400">
              {election?.uniqueField || "Unique Field"}
            </label>
            <input
              type="text"
              name="uniqueField"
              placeholder={
                election?.uniqueField ||
                "Unique Field (e.g. Index Number, Employee ID)"
              }
              className="w-full px-4 py-2 md:py-3 rounded border border-gray-800 md:border-gray-600 outline-0 text-white placeholder-gray-500 md:placeholder-gray-400 bg-white/5"
              value={formData.uniqueField}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-gray-400">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full px-4 py-2 md:py-3 rounded border border-gray-800 md:border-gray-600 outline-0 text-white placeholder-gray-500 md:placeholder-gray-400 bg-white/5"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <div className="absolute right-3 top-3 md:top-4 text-white">
                {showPassword ? (
                  <FaEye onClick={() => setShowPassword(false)} />
                ) : (
                  <FaEyeSlash onClick={() => setShowPassword(true)} />
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="confirmPassword" className="text-gray-400">
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full px-4 py-2 md:py-3 rounded border border-gray-800 md:border-gray-600 outline-0 text-white placeholder-gray-500 md:placeholder-gray-400 bg-white/5"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="text-gray-400">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              className="w-full px-4 py-2 md:py-3 rounded border border-gray-800 md:border-gray-600 outline-0 text-white placeholder-gray-500 md:placeholder-gray-400 bg-white/5"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="verificationPhoto" className="text-gray-400">
              {election?.verificationPhotoType || "Verification Photo"}
            </label>
            <input
              type="file"
              ref={fileInputRef} // <-- Add ref here
              name="verificationPhoto"
              accept="image/*"
              className="w-full text-white file:text-white file:bg-blue-600 file:border-0 file:rounded file:px-4 file:py-2"
              onChange={handleChange}
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full mt-6 bg-blue-600 cursor-pointer text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
        >
          {isSubmitting ? "Loading..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default RegisterVoter;
