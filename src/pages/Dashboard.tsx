import React, { useEffect, useState } from "react";
// import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/authContext";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
  addAspirantToPosition,
  addElection,
  addPositionToElection,
  addVoterToElection,
  closeElection,
  deleteAspirantFromPosition,
  deleteElection,
  deletePositionFromElection,
  deleteVoterFromElection,
  getAspirantsForPosition,
  getElectionsByAdmin,
  getPositionsForElection,
  getVotersForElection,
  updateElection,
} from "../firebase/firestore";
import { signOutUser } from "../firebase/auth";
import toast from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();

  const [manageElectionId, setManageElectionId] = useState<string | null>(null);
  const [manageElection, setManageElection] = useState<any>(null);
  const [selectedPositionId, setSelectedPositionId] = useState<string>("");
  const [file, setFile] = useState<any>(null);

  const electionLink = `${window.location.origin}/vote/${manageElectionId}`;
  const electionResultsLink = `${window.location.origin}/results/${manageElectionId}`;

  const { loggedIn, user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [elections, setElections] = useState<
    { id: string; name: string; status: string; date: string }[]
  >([]);
  const [newElection, setNewElection] = useState({
    name: "",
    date: new Date().toISOString().slice(0, 10),
    status: "Pending",
    uniqueField: "", // Add the unique field here
  });
  const [loading, setLoading] = useState(false);
  const [newPosition, setNewPosition] = useState("");

  const [showVoterModal, setShowVoterModal] = useState(false);
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [showAspirantModal, setShowAspirantModal] = useState(false);
  const [newVoter, setNewVoter] = useState({
    name: "",
    email: "",
  });
  const [newAspirant, setNewAspirant] = useState({
    name: "",
    email: "",
    image: "",
    phone: "",
  });
  const [voters, setVoters] = useState<Array<any>>([]);
  const [positions, setPositions] = useState<Array<any>>([]);
  const [aspirants, setAspirants] = useState<Array<any>>([]);

  const [dataChanged, setDataChanged] = useState(false);

  const pendingElections = elections.filter(
    (election) => election.status === "Pending"
  ).length;

  const completeElections = elections.filter(
    (election) => election.status === "Completed"
  ).length;

  const stats = [
    { label: "Total Elections", value: elections.length },
    // { label: "Active Voters", value: 245 },
    { label: "Pending Elections", value: pendingElections },
    { label: "Completed Elections", value: completeElections },
  ];

  const handleAddElection = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!user) {
      console.error("User not authenticated");
      setLoading(false);
      return;
    }
    await addElection({
      ...newElection,
      createdBy: user.uid,
    });
    setLoading(false);
    setShowModal(false);
    setNewElection({
      name: "",
      date: "",
      status: "Pending",
      uniqueField: "",
    });
    // Optionally: refresh elections list here
  };

  const [_, setIsGettingElection] = useState(false);

  const getUserElections = async () => {
    if (!user) {
      return;
    }
    setIsGettingElection(true);
    try {
      const electionsRaw = await getElectionsByAdmin(user.uid);

      if (electionsRaw) {
        const formattedElections = electionsRaw.map((election: any) => ({
          id: election.id,
          name: election.name ?? "",
          status: election.status ?? "Pending",
          date: election.date ?? "",
          uniqueField: election.uniqueField ?? "",
        }));
        setElections(formattedElections);
      }
    } catch (error) {
      toast.error("Unable to fetch election");
      console.error("Error fetching user elections:", error);
    } finally {
      setIsGettingElection(false);
    }
  };

  // const handleDeleteElection = async () => {
  //   if (!manageElectionId) return;
  //   try {
  //     await deleteElection(manageElectionId);
  //     setElections((prev) =>
  //       prev.filter((election) => election.id !== manageElectionId)
  //     );
  //     setManageElectionId(null);
  //     setManageElection(null);
  //   } catch (error) {
  //     console.error("Error deleting election:", error);
  //   }
  // };

  const handleCloseElection = async () => {
    if (!manageElectionId) return;
    try {
      await closeElection(manageElectionId);
      setElections((prev) =>
        prev.map((election) =>
          election.id === manageElectionId
            ? { ...election, status: "Completed" }
            : election
        )
      );
      setManageElectionId(null);
      setManageElection(null);
    } catch (error) {
      console.error("Error closing election:", error);
    }
  };

  const handleSaveElectionChanges = async () => {
    if (!manageElectionId || !manageElection) return;
    try {
      await updateElection(manageElectionId, manageElection);
      setElections((prev) =>
        prev.map((election) =>
          election.id === manageElectionId ? manageElection : election
        )
      );
      setManageElectionId(null);
      setManageElection(null);
    } catch (error) {
      console.error("Error saving election changes:", error);
    }
  };

  useEffect(() => {
    getUserElections();
  }, [dataChanged]);

  const handleManageElection = (id: string) => {
    const election = elections.find((e) => e.id === id);

    console.log("Managing election:", election);

    setManageElectionId(id);
    setManageElection(election);
  };

  const filteredElections = isExpanded ? elections : elections.slice(0, 3);

  const [isAddingVoter, setIsAddingVoter] = useState(false);
  const [isAddingPosition, setIsAddingPosition] = useState(false);
  const [isAddingAspirant, setIsAddingAspirant] = useState(false);

  const handleAddVoter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVoter.name || !newVoter.email) {
      toast.error("Please name and email fields are required");
      return;
    }

    // Check if voter already exists (by email)
    const alreadyExists = voters.some(
      (voter) => voter.email?.toLowerCase() === newVoter.email.toLowerCase()
    );

    if (alreadyExists) {
      toast.error(
        `A voter with this ${
          manageElection.uniqueField || "email"
        } is already registered for this election.`
      );
      return;
    }

    setIsAddingVoter(true);
    try {
      await addVoterToElection(manageElectionId || "", newVoter);
      toast.success("Voter added successfully");
      getAllVoters();
      setNewVoter({ name: "", email: "" });
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
      setIsAddingVoter(false);
    }
  };

  const [isGettingVoters, setIsGettingVoters] = useState(true);
  const getAllVoters = async () => {
    if (!manageElectionId) return;
    try {
      const votersData = await getVotersForElection(manageElectionId);
      setVoters(votersData);
      setIsGettingVoters(false);
    } catch (error) {
      console.error("Error fetching voters:", error);
      setIsGettingVoters(false);
    }
  };

  const handleRemoveVoter = async (voterId: string) => {
    if (!manageElectionId) return;
    try {
      await deleteVoterFromElection(manageElectionId, voterId);
      toast.success("Voter removed successfully");
      getAllVoters();
      setVoters((prev) => prev.filter((voter) => voter.id !== voterId));
    } catch (error) {
      toast.error(
        "Failed to remove voter" +
          (typeof error === "string"
            ? `: ${error}`
            : error instanceof Error
            ? `: ${error.message}`
            : "")
      );
    }
  };

  const handleAddPosition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPosition) {
      toast.error("Position name is required");
      return;
    }
    setIsAddingPosition(true);
    try {
      await addPositionToElection(manageElectionId || "", newPosition);
      toast.success("Position added successfully");
      getAllPositions();
      setNewPosition("");
    } catch (error) {
      toast.error(
        "Failed to add position" +
          (typeof error === "string"
            ? `: ${error}`
            : error instanceof Error
            ? `: ${error.message}`
            : "")
      );
    } finally {
      setIsAddingPosition(false);
    }
  };

  const getAllPositions = async () => {
    if (!manageElectionId) return;
    try {
      const positionsData = await getPositionsForElection(manageElectionId);
      setPositions(positionsData);
    } catch (error) {
      console.error("Error fetching positions:", error);
    }
  };

  const handleRemovePosition = async (positionID: string, name: string) => {
    if (!manageElectionId) return;
    try {
      await deletePositionFromElection(manageElectionId || "", positionID);
      toast.success(`Position ${name} removed successfully`);
      getAllPositions();
    } catch (error) {
      toast.error(
        "Failed to remove position" +
          (typeof error === "string"
            ? `: ${error}`
            : error instanceof Error
            ? `: ${error.message}`
            : "")
      );
    }
  };

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

  const handleAddAspirant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAspirant.name || !newAspirant.email || !newAspirant.phone) {
      toast.error("Name, email, and phone fields are required");
      return;
    }

    if (!manageElectionId || !selectedPositionId) {
      toast.error("Invalid election or position selected");
      return;
    }

    // Check if aspirant already exists (by email or name)
    const alreadyExists = aspirants.some(
      (asp) => asp.email?.toLowerCase() === newAspirant.email.toLowerCase()
    );

    if (alreadyExists) {
      toast.error(
        "Aspirant with this name or email is already registered for this position."
      );
      return;
    }

    setIsAddingAspirant(true);

    try {
      // Upload file and get image URL
      const imageUrl = await handleFileUpload();

      // Pass the image URL directly
      await addAspirantToPosition(manageElectionId || "", selectedPositionId, {
        ...newAspirant,
        image: imageUrl,
      });

      toast.success("Aspirant added successfully");

      getAllAspirants();

      setNewAspirant({ name: "", email: "", phone: "", image: "" });
    } catch (error) {
      toast.error(
        "Failed to add aspirant" +
          (typeof error === "string"
            ? `: ${error}`
            : error instanceof Error
            ? `: ${error.message}`
            : "")
      );
    } finally {
      setIsAddingAspirant(false);
    }
  };

  const handleRemoveAspirant = async (aspirantID: string, name: string) => {
    if (!manageElectionId || !selectedPositionId) return;
    try {
      await deleteAspirantFromPosition(
        manageElectionId || "",
        selectedPositionId,
        aspirantID
      );

      toast.success(
        `Aspirant ${name} removed successfully from position ${
          positions.find((pos) => pos.id === selectedPositionId)?.position ||
          "Unknown"
        }`
      );
      getAllAspirants();
    } catch (error) {
      toast.error(
        "Failed to remove aspirant" +
          (typeof error === "string"
            ? `: ${error}`
            : error instanceof Error
            ? `: ${error.message}`
            : "")
      );
    }
  };

  const getAllAspirants = async () => {
    if (!manageElectionId || !selectedPositionId) return;
    try {
      const aspirantsData = await getAspirantsForPosition(
        manageElectionId,
        selectedPositionId
      );
      console.log("Fetched Aspirants:", aspirantsData);

      setAspirants(aspirantsData);
    } catch (error) {
      console.error("Error fetching Aspirants:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image")) {
      toast.error("Please upload an image file");
      return;
    }

    setFile(file);
  };

  // Redirect to login if not logged in

  if (!loggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="h-full min-h-[100vh] bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 pt-[2rem]">
      <Navbar />
      <main className="py-12 px-4 h-full flex flex-col items-center">
        <div className="w-full max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
            <h1 className="text-4xl font-extrabold text-white mb-4 md:mb-0 text-center md:text-left">
              Admin Dashboard
            </h1>
            <div className="flex gap-4 justify-center">
              <button
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-semibold px-6 py-3 rounded-full shadow transition"
                onClick={() => setShowModal(true)}
              >
                + New Election
              </button>
              <button
                className="bg-white/10 hover:bg-white/20 text-blue-200 font-semibold px-6 py-3 rounded-full border border-blue-400 shadow transition cursor-pointer"
                onClick={async () => {
                  await signOutUser();

                  navigate("/home");
                }}
              >
                Logout
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-gradient-to-br from-blue-700/30 via-blue-900/20 to-gray-900/30 rounded-xl shadow-lg border border-gray-700 p-6 flex flex-col items-center cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out"
              >
                <span className="text-4xl font-extrabold text-blue-400 mb-2">
                  {stat.value}
                </span>
                <span className="text-lg text-gray-200">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Recent Elections */}
          {elections.length < 1 ? (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-gray-700 p-8 mb-12 h-[20rem] flex items-center justify-center flex-col gap-2">
              '
              {
                <h2 className="text-white font-bold text-3xl">
                  No Election Created Yet
                </h2>
              }
              <p className="text-gray-300 text-lg">Plese Create An Election</p>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-gray-700 p-4 md:p-8 mb-12">
              <h2 className="text-2xl font-semibold text-white mb-6">
                {isExpanded ? "All Elections" : "Recent Elections"}
              </h2>
              <div className="w-full overflow-x-auto">
                <table className="min-w-[600px] w-full text-left">
                  <thead>
                    <tr>
                      <th className="text-gray-300 pb-2">Name</th>
                      <th className="text-gray-300 pb-2">Status</th>
                      <th className="text-gray-300 pb-2">Date</th>
                      <th className="text-gray-300 pb-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredElections.map((election, idx) => (
                      <tr
                        key={idx}
                        className={`rounded-2xl ${
                          idx % 2 === 0 ? "bg-white/10" : "bg-white/5"
                        }`}
                      >
                        <td className="py-4 md:py-8 text-white pl-2 md:pl-4 font-semibold">
                          {election.name}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              election.status === "Completed"
                                ? "bg-green-600 text-white"
                                : election.status === "Active"
                                ? "bg-blue-600 text-white"
                                : "bg-yellow-500 text-gray-900"
                            }`}
                          >
                            {election.status}
                          </span>
                        </td>
                        <td className="py-3 text-gray-300">{election.date}</td>
                        <td className="py-3">
                          <div className="gap-4 flex w-fit">
                            <button
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-xs font-semibold shadow transition cursor-pointer"
                              onClick={() => handleManageElection(election.id)}
                            >
                              Manage
                            </button>
                            <button
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-xs font-semibold shadow transition cursor-pointer"
                              onClick={async () => {
                                try {
                                  await deleteElection(election.id);
                                  setDataChanged((prev) => !prev);

                                  toast.success(
                                    "Election removed successfully"
                                  );
                                } catch (error) {
                                  toast.error("Failed to remove election");
                                }
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {elections.length > 3 && (
                <div className="mt-8 items-center justify-center flex">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow transition"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? "View Less" : "View All"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Quick Actions */}
          {/* <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-gray-700 p-8 flex flex-col items-center">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Quick Actions
            </h2>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full shadow transition">
                Manage Voters
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full shadow transition">
                View Results
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full shadow transition">
                Analytics
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full shadow transition">
                Help Center
              </button>
            </div>
          </div> */}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form
            onSubmit={handleAddElection}
            className="bg-[#182439] text-white border border-gray-500 rounded-xl p-8 shadow-xl w-[90%] max-w-md"
          >
            <h2 className="text-2xl font-bold mb-4">Add New Election</h2>
            <input
              type="text"
              placeholder="Election Name"
              className="w-full mb-6 px-4 py-2 rounded border border-gray-500 outline-0"
              value={newElection.name}
              onChange={(e) =>
                setNewElection({ ...newElection, name: e.target.value })
              }
              required
            />

            {/* <p className="text-sm text-gray-400 mb-2">
              You can specify a unique identifier for voters in this election
              (e.g., Index Number, Voter ID, Employee ID). This will be used for
              voter verification when voting. If left blank, Email will be used
              by default.
            </p>
            <input
              type="text"
              placeholder="Unique Field"
              className="w-full mb-4 px-4 py-2 rounded border border-gray-500 outline-0"
              value={newElection.uniqueField}
              onChange={(e) =>
                setNewElection({ ...newElection, uniqueField: e.target.value })
              }
              required
            /> */}


            {/* <input
              type="date"
              className="w-full mb-4 px-4 py-2 rounded border border-gray-500 outline-0"
              value={newElection.date}
              onChange={(e) =>
                setNewElection({ ...newElection, date: e.target.value })
              }
              required
            /> */}
            {/* <select
              className="w-full mb-4 px-4 py-2 pr-4 rounded border border-gray-500 outline-0"
              value={newElection.status}
              onChange={(e) =>
                setNewElection({ ...newElection, status: e.target.value })
              }
            >
              <option value="Pending">Pending</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select> */}
            <div className="flex gap-4 justify-end">
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-700 cursor-pointer"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white cursor-pointer"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Election"}
              </button>
            </div>
          </form>
        </div>
      )}

      {manageElectionId &&
        manageElection &&
        !showVoterModal &&
        !showPositionModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <form className="bg-[#182439] text-white border border-gray-500 rounded-xl p-4 lg:p-8 shadow-xl w-[90%] max-w-lg">
              <div className="flex mb-6 items-center justify-between">
                <h2 className="text-xl font-bold">Manage Election</h2>

                <div className="gap-2 flex justify-center">
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-green-600 text-sm text-white cursor-pointer"
                    onClick={() => {
                      setShowModal(false);
                      setShowVoterModal(true);
                      getAllVoters();
                    }}
                  >
                    Voters
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-orange-600 text-sm text-white cursor-pointer"
                    onClick={() => {
                      setShowPositionModal(true);
                      getAllPositions();
                    }}
                  >
                    Positions
                  </button>
                </div>
              </div>
              {/* Edit election details */}
              <input
                type="text"
                className="w-full mb-4 px-4 py-2 rounded border border-gray-500 outline-0"
                value={manageElection.name}
                onChange={(e) =>
                  setManageElection({ ...manageElection, name: e.target.value })
                }
              />
              <input
                type="date"
                className="w-full mb-4 px-4 py-2 rounded border border-gray-500 outline-0"
                value={manageElection.date}
                onChange={(e) =>
                  setManageElection({ ...manageElection, date: e.target.value })
                }
              />
              <select
                className="w-full mb-4 px-4 py-2 rounded border border-gray-500 outline-0"
                value={manageElection.status}
                onChange={(e) =>
                  setManageElection({
                    ...manageElection,
                    status: e.target.value,
                  })
                }
              >
                <option value="Pending">Pending</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>

              {/* Actions */}
              <div className="flex gap-2 justify-center mt-4 flex-wrap">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-green-600 text-white cursor-pointer"
                  onClick={handleSaveElectionChanges}
                >
                  Save Changes
                </button>
                {/* <button
                  type="button"
                  className="px-4 py-2 rounded bg-red-600 text-white cursor-pointer"
                  onClick={handleDeleteElection}
                >
                  Delete
                </button> */}
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-blue-800 text-white cursor-pointer"
                  onClick={handleCloseElection}
                >
                  Close Election
                </button>

                <button
                  type="button"
                  className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(electionLink);
                    toast.success("Election link copied!");
                  }}
                >
                  Copy Election Link
                </button>
                <button
                  type="button"
                  className="bg-orange-600 text-white px-4 py-2 rounded cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(electionResultsLink);
                    toast.success("Election results link copied!");
                  }}
                >
                  Copy Result Link
                </button>
                <button
                  type="button"
                  className="bg-orange-400 text-white px-4 py-2 rounded cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(manageElectionId);
                    toast.success("Election ID copied!");
                  }}
                >
                  Copy Election ID
                </button>

                <button
                  type="button"
                  className="bg-green-700 text-white px-4 py-2 rounded cursor-pointer"
                  onClick={async () => {
                    // Fetch voters for this election
                    const votersData = await getVotersForElection(
                      manageElectionId
                    );
                    if (!votersData || votersData.length === 0) {
                      toast.error("No voters registered for this election.");
                      return;
                    }
                    // Collect all emails
                    const emails = votersData
                      .map((v: any) => v.email)
                      .filter(Boolean);
                    // Prepare mailto link
                    const subject = encodeURIComponent("Your Election Link");
                    const body = encodeURIComponent(
                      `Dear Voter,\n\nYou are invited to participate in the election.\n\nPlease use the following link to cast your vote:\n${electionLink}\n \nOr You can also visit our website to vote\nhttp://google.com\n use the following Election ID: ${manageElectionId}\n\nThank you! \nBest regards,\nYour Election Team`
                    );
                    // Open mail client with all emails in BCC
                    window.location.href = `mailto:?bcc=${emails.join(
                      ","
                    )}&subject=${subject}&body=${body}`;
                  }}
                >
                  Send Email to All Voters
                </button>

                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-700 cursor-pointer"
                  onClick={() => setManageElectionId(null)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        )}

      {showVoterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form
            onSubmit={handleAddVoter}
            className="bg-[#182439] text-white border border-gray-500 rounded-xl p-6 shadow-xl w-[90%] max-w-md"
          >
            <h2 className="text-xl font-bold mb-4">Register Voter</h2>
            <input
              type="text"
              placeholder="Name"
              className="w-full mb-4 px-4 py-2 rounded border border-gray-500 outline-0"
              value={newVoter.name}
              onChange={(e) =>
                setNewVoter({ ...newVoter, name: e.target.value })
              }
              required
            />
            <input
              type={!manageElection.uniqueField ? "email" : "text"}
              placeholder={manageElection.uniqueField || "Email"}
              className="w-full mb-4 px-4 py-2 rounded border border-gray-500 outline-0"
              value={newVoter.email}
              onChange={(e) =>
                setNewVoter({ ...newVoter, email: e.target.value })
              }
              required
            />

            {manageElection.uniqueField && <input
              type={ "password"}
              placeholder={"Password"}
              className="w-full mb-4 px-4 py-2 rounded border border-gray-500 outline-0"
              value={newVoter.email}
              onChange={(e) =>
                setNewVoter({ ...newVoter, email: e.target.value })
              }
              required
            />}
            {/* <input
              type="text"
              placeholder="Phone"
              className="w-full mb-4 px-4 py-2 rounded border border-gray-500 outline-0"
              value={newVoter.phone}
              onChange={(e) =>
                setNewVoter({ ...newVoter, phone: e.target.value })
              }
            /> */}
            <div className="flex gap-2 justify-end mb-4">
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-700 cursor-pointer"
                onClick={() => {
                  setManageElectionId(null);
                  setVoters([]);
                  setShowVoterModal(false);
                }}
              >
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white cursor-pointer"
              >
                {isAddingVoter ? "Adding..." : "Add Voter"}
              </button>
            </div>
            <h3 className="font-semibold mb-2">All Voters</h3>
            <div className="max-h-40 overflow-y-auto border rounded p-2 bg-gray-700 border-gray-500">
              {/* {voters.length === 0 && (
                <div className="text-gray-400 text-sm">
                  No voters registered yet.
                </div>
              )} */}
              {isGettingVoters ? (
                <div className="text-gray-400 text-sm">Loading voters...</div>
              ) : voters.length === 0 ? (
                <div className="text-gray-400 text-sm">
                  No voters registered yet.
                </div>
              ) : (
                voters.map((voter, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-2 border-b border-gray-700"
                  >
                    <span className="text-sm">
                      {voter.name} ({voter.email || voter.phone})
                    </span>
                    <button
                      type="button"
                      className="text-xs text-red-600 cursor-pointer"
                      onClick={() => handleRemoveVoter(voter.voterId)}
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </form>
        </div>
      )}

      {showPositionModal && !showAspirantModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form
            onSubmit={handleAddPosition}
            className="bg-[#182439] text-white border border-gray-500 rounded-xl p-6 shadow-xl w-[90%] max-w-md"
          >
            <h2 className="text-xl font-bold mb-4">Register a Position</h2>
            <input
              type="text"
              placeholder="Name"
              className="w-full mb-4 px-4 py-2 rounded border border-gray-500 outline-0"
              value={newPosition}
              onChange={(e) => setNewPosition(e.target.value)}
              required
            />

            <div className="flex gap-2 justify-end mb-4">
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-700 cursor-pointer"
                onClick={() => {
                  // setManageElectionId(null);
                  setShowVoterModal(false);
                  setPositions([]);
                  setShowPositionModal(false);
                }}
              >
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white cursor-pointer"
              >
                {isAddingPosition ? "Adding..." : "Add Position"}
              </button>
            </div>
            <h3 className="font-semibold mb-2">All Positions</h3>
            <div className="max-h-40 overflow-y-auto border border-gray-500 rounded p-2 bg-gray-700">
              {/* {positions.length === 0 && (
                <div className="text-gray-400 text-sm">
                  No Position registered yet.
                </div>
              )} */}
              {positions.length < 1 ? (
                <div className="text-gray-400 text-sm">
                  No Position registered yet.
                </div>
              ) : (
                positions.map((position, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-2 border-b border-gray-700"
                  >
                    <span className="text-sm">{position.position}</span>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        className="text-xs text-red-600 cursor-pointer"
                        onClick={() => {
                          handleRemovePosition(position.positionId, position.position);
                        }}
                      >
                        Remove
                      </button>
                      <button
                        type="button"
                        className="text-xs text-green-600 cursor-pointer"
                        onClick={() => {
                          setSelectedPositionId(position.positionId);

                          getAllAspirants();
                          setShowAspirantModal(true);
                        }}
                      >
                        Add Candidate
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </form>
        </div>
      )}

      {showAspirantModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form
            onSubmit={handleAddAspirant}
            className="bg-[#182439] text-white rounded-xl p-6 shadow-xl w-[90%] max-w-md"
          >
            <h2 className="text-xl font-bold mb-4 text-center max-w-[80%] mx-auto">
              Register a Candidate{" "}
              {selectedPositionId &&
                `for ${
                  positions.find((pos) => pos.positionId === selectedPositionId)
                    ?.position
                }`}
            </h2>
            <input
              type="text"
              placeholder="Name"
              className="w-full mb-4 px-4 py-2 rounded border border-gray-500 outline-0"
              value={newAspirant.name}
              onChange={(e) =>
                setNewAspirant({ ...newAspirant, name: e.target.value })
              }
              required
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full mb-4 px-4 py-2 rounded border border-gray-500 outline-0"
              value={newAspirant.email}
              onChange={(e) =>
                setNewAspirant({ ...newAspirant, email: e.target.value })
              }
              required
            />

            <input
              type="file"
              onChange={(e) => handleFileChange(e)}
              className="w-full mb-4 px-4 py-2 rounded border border-gray-500 outline-0 cursor-pointer"
              placeholder="Upload Image"
            />

            <input
              type="text"
              placeholder="Phone"
              className="w-full mb-4 px-4 py-2 rounded border border-gray-500 outline-0"
              value={newAspirant.phone}
              onChange={(e) =>
                setNewAspirant({ ...newAspirant, phone: e.target.value })
              }
            />

            <div className="flex gap-2 justify-end mb-4">
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-700 cursor-pointer"
                onClick={() => {
                  setShowAspirantModal(false);
                  setAspirants([]);
                  setNewAspirant({
                    name: "",
                    email: "",
                    phone: "",
                    image: "",
                  });
                }}
              >
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white cursor-pointer"
              >
                {isAddingAspirant ? "Adding..." : "Add Candidate"}
              </button>
            </div>
            <h3 className="font-semibold mb-2">All Candidates</h3>
            <div className="max-h-40 overflow-y-auto border border-gray-500 rounded p-2 bg-gray-700">
              {/* {aspirants.length === 0 && (
                <div className="text-gray-400 text-sm">
                  No Candidate registered yet.
                </div>
              )} */}
              {aspirants.length === 0 ? (
                <div className="text-gray-400 text-sm">
                  No Candidate registered yet.
                </div>
              ) : (
                aspirants.map((aspirant, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-2 border-b border-gray-700"
                  >
                    <span className="text-sm">{aspirant.name}</span>
                    <button
                      type="button"
                      className="text-xs text-red-600 cursor-pointer"
                      onClick={() => {
                        handleRemoveAspirant(
                          aspirant.aspirantId,
                          aspirant.name
                        );
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </form>
        </div>
      )}
      {/* <Footer /> */}
    </div>
  );
};

export default Dashboard;
