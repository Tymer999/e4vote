import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDoc, doc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { submitVote } from "../firebase/firestore";
import toast from "react-hot-toast";

const VotePage = () => {
  const { electionId } = useParams<{ electionId: string }>();
  const [election, setElection] = useState<any>(null);
  const [positions, setPositions] = useState<any[]>([]);
  const [selected, setSelected] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [verifying, setVerifying] = useState(false);

  const [voterVerified, setVoterVerified] = useState(false);
  const [voterCredentials, setVoterCredentials] = useState({
    email: "",
    electionId: electionId || "",
  });

  const [voterError, setVoterError] = useState("");

  useEffect(() => {
    const fetchElection = async () => {
      if (!electionId) return;

      setLoading(true);
      const electionRef = doc(db, "elections", electionId);
      const electionSnap = await getDoc(electionRef);

      if (electionSnap.exists()) {
        setElection({ id: electionSnap.id, ...electionSnap.data() });

        // Fetch positions subcollection
        const positionsRef = collection(electionRef, "positions");
        const positionsSnap = await getDocs(positionsRef);

        const positionsData = await Promise.all(
          positionsSnap.docs.map(async (posDoc) => {
            const aspirantsRef = collection(posDoc.ref, "aspirants");
            const aspirantsSnap = await getDocs(aspirantsRef);
            return {
              id: posDoc.id,
              ...posDoc.data(),

              aspirants: aspirantsSnap.docs.map((aDoc) => ({
                aspirantId: aDoc.id, // Firestore document ID
                ...aDoc.data(),
              })),
            };
          })
        );

        setPositions(positionsData);
      }
      setLoading(false);
    };
    fetchElection();
  }, [electionId]);

  const handleVote = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if this voter has already voted
    const votesRef = collection(
      doc(db, "elections", electionId || ""),
      "votes"
    );
    const votesSnap = await getDocs(votesRef);
    const alreadyVoted = votesSnap.docs.find(
      (doc) => doc.data().voterId === voterCredentials.email
    );

    if (voterCredentials.email === "") {
      toast.error("Please enter your email to vote.");
      return;
    }

    if (alreadyVoted) {
      toast.error("You have already voted in this election.");
      return;
    }

    await submitVote(electionId || "", selected, voterCredentials.email);

    toast.success(`Your vote has been submitted successfully!
      Thank you for participating!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading election...
      </div>
    );
  }

  // if (!election) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
  //       Election not found.
  //     </div>
  //   );
  // }

  if (voterVerified || !election) {
    return (
      <div className="min-h-screen items-center justify-center bg-gray-900 text-white pt-[2rem]">
        <Navbar />

        <div className="flex items-center justify-center h-[70vh]">
          <form
            className="bg-white/10 p-8 w-[370px] rounded-xl shadow border border-gray-500"
            onSubmit={async (e) => {
              e.preventDefault();
              setVerifying(true);
              setVoterError("");
              const electionRef = doc(
                db,
                "elections",
                electionId || voterCredentials.electionId || ""
              );
              const electionSnap = await getDoc(electionRef);

              if (!electionSnap.exists()) {
                toast.error("Election not found");
                setVoterError("Election not found");
                setVerifying(false);
                return;
              }

              // Fetch voters subcollection for this election
              const votersRef = collection(electionRef, "voters");

              const snapshot = await getDocs(votersRef);

              const found = snapshot.docs.find(
                (doc) => doc.data().email === voterCredentials.email
              );

              if (found) {
                toast.success("Voter verified successfully. You can now vote.");
                setVoterVerified(true);
                setElection({ id: electionSnap.id, ...electionSnap.data() });

                // Fetch positions subcollection
                const positionsRef = collection(electionRef, "positions");
                const positionsSnap = await getDocs(positionsRef);

                const positionsData = await Promise.all(
                  positionsSnap.docs.map(async (posDoc) => {
                    const aspirantsRef = collection(posDoc.ref, "aspirants");
                    const aspirantsSnap = await getDocs(aspirantsRef);
                    return {
                      id: posDoc.id,
                      ...posDoc.data(),

                      aspirants: aspirantsSnap.docs.map((aDoc) => ({
                        aspirantId: aDoc.id, // Firestore document ID
                        ...aDoc.data(),
                      })),
                    };
                  })
                );

                setPositions(positionsData);

                setVerifying(false);
              } else {
                toast.error("Invalid credentials. Please try again.");
                setVoterError("Invalid credentials. Please try again.");
                setVerifying(false);
              }
            }}
          >
            <h2 className="text-xl font-bold mb-4">Voter Verification</h2>

            {!election && (
              <input
                type="text"
                placeholder="Election ID"
                className="w-full mb-4 px-4 py-2 rounded border border-gray-500 outline-0"
                value={voterCredentials.electionId}
                onChange={(e) =>
                  setVoterCredentials({
                    ...voterCredentials,
                    electionId: e.target.value,
                  })
                }
                required
              />
            )}
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-4 px-4 py-2 rounded border border-gray-500 outline-0"
              value={voterCredentials.email}
              onChange={(e) =>
                setVoterCredentials({
                  ...voterCredentials,
                  email: e.target.value,
                })
              }
              required
            />

            {voterError && (
              <div className="text-red-500 mb-2">{voterError}</div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              {verifying ? "Verifying..." : "Verify Voter"}
            </button>
          </form>
        </div>

        <Footer />
      </div>
    );
  }

  // Step-by-step voting
  const currentPosition = positions[step];

  // if (election.status !== "pending") return (
  //   <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
  //     <h1 className="text-2xl font-bold">The Election has not started yet.</h1>
  //   </div>
  // );

  return (
    <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 min-h-screen pt-[2rem]">
      <Navbar />(
      <main className="max-w-2xl mx-auto py-12 px-4 h-[70vh] flex flex-col justify-center">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          {election?.name}
        </h1>
        {election.status === "Pending" ? (
          <div className="text-center text-red-300">
            <h1 className="text-4xl font-bold">
              The Election has not started yet.
            </h1>
            <p className="text-lg mt-2">Please check back later.</p>
          </div>
        ) : election.status === "Completed" ? (
          <div className="text-center text-green-300">
            <h1 className="text-4xl font-bold">Voting has ended.</h1>
            <p className="text-lg mt-2">Thank you for your participation!</p>
          </div>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (step < positions.length - 1) {
                setStep((prev) => prev + 1);
              } else {
                await handleVote(e);
              }
            }}
            className="bg-white/10 backdrop-blur-md rounded-4xl shadow-xl border border-gray-700 overflow-scroll"
          >
            {currentPosition && (
              <div className="">
                <h2 className="text-xl font-bold text-blue-200 rounded-b-xl bg-blue-600 p-4">
                  {currentPosition.position}
                </h2>

                <div className="flex flex-col gap-4 p-4 md:p-8">
                  {currentPosition.aspirants.length < 1 ? (
                    <p className="text-gray-300 text-lg max-w-[60%] mx-auto md:text-xl text-center my-4">
                      No candidates available in this Position
                    </p>
                  ) : (
                    currentPosition.aspirants.map((aspirant: any) => (
                      <label
                        key={aspirant.aspirantId}
                        className={`flex items-center gap-4 p-2 md:p-3 rounded-4xl cursor-pointer ${
                          selected[currentPosition.id] === aspirant.aspirantId
                            ? "bg-blue-600/50 text-white"
                            : "bg-white/20 text-gray-200"
                        }`}
                      >
                        <div className="w-[5rem] md:w-[6rem] aspect-square rounded-3xl md:rounded-4xl overflow-hidden">
                          <img
                            src={aspirant.image}
                            alt={aspirant.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div>
                          <div className="flex-row gap-2 flex items-center">
                            <h2 className="font-medium text-xl">
                              {aspirant.name}
                            </h2>

                            <input
                              type="checkbox"
                              name={currentPosition.id}
                              checked={
                                selected[currentPosition.id] ===
                                aspirant.aspirantId
                              }
                              onChange={() => {
                                setSelected((prev) =>
                                  prev[currentPosition.id] ===
                                  aspirant.aspirantId
                                    ? { ...prev, [currentPosition.id]: "" }
                                    : {
                                        ...prev,
                                        [currentPosition.id]:
                                          aspirant.aspirantId,
                                      }
                                );
                              }}
                              className="accent-yellow-600 w-[1.35rem] md:w-[1.55rem] aspect-square"
                            />
                          </div>

                          <p className="text-gray-300">{aspirant.email}</p>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>
            )}
            <div className="flex justify-between pt-0 md:p-8">
              {step < 1 ? (
                <div></div>
              ) : (
                <button
                  type="button"
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-r-full md:rounded-full cursor-pointer shadow transition"
                  disabled={step === 0}
                  onClick={() => setStep((prev) => prev - 1)}
                >
                  Previous Vote
                </button>
              )}
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-l-full md:rounded-full cursor-pointer shadow transition"
              >
                {step < positions.length - 1 ? "Next Position" : "Submit Vote"}
              </button>
            </div>
          </form>
        )}
      </main>
      )
      <Footer />
    </div>
  );
};

export default VotePage;
