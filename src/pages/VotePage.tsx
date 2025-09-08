import React, { useEffect, useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import { getDoc, doc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase.config";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
import { submitVote } from "../firebase/firestore";
import toast from "react-hot-toast";
import { FaEyeSlash, FaEye } from "react-icons/fa6";

const VotePage = () => {
  const { electionId } = useParams<{ electionId: string }>();
  const [election, setElection] = useState<any>(null);
  const [positions, setPositions] = useState<any[]>([]);
  const [selected, setSelected] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [voterVerified, setVoterVerified] = useState(false);
  const [voterCredentials, setVoterCredentials] = useState({
    uniqueField: "",
    password: "",
    electionId: electionId || "",
  });

  const [voterError, setVoterError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const fetchElection = async () => {
      if (!electionId) return;

      setLoading(true);

      try {
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
      } catch (error) {
        toast.error("Failed to fetch election data");
      } finally {
        setLoading(false);
      }
    };
    fetchElection();
  }, [electionId]);

  // console.log(election);

  const [submitting, setSubmitting] = useState(false);

  const handleVote = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (submitting) {
      return;
    }

    setSubmitting(true);

    // Check if this voter has already voted
    const votesRef = collection(
      doc(db, "elections", electionId || ""),
      "votes"
    );
    const votesSnap = await getDocs(votesRef);

    const alreadyVoted = votesSnap.docs.find(
      (doc) => doc.data().uniqueField === voterCredentials.uniqueField
    );

    if (
      voterCredentials.uniqueField === "" ||
      voterCredentials.password === ""
    ) {
      toast.error("Please enter your email and password to vote.");
      setSubmitting(false);
      return;
    }

    if (alreadyVoted) {
      toast.error("You have already voted in this election.");
      setSubmitting(false);
      return;
    }

    await submitVote(electionId || "", selected, voterCredentials.uniqueField);

    setVoterCredentials({
      uniqueField: "",
      password: "",
      electionId: electionId || "",
    });

    toast.success(`Your vote has been submitted successfully!
      Thank you for participating!`);

    setSubmitting(false);
    setVoterVerified(false);
  };

  // Show loading state while fetching election data

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
  const handleVoterVerification = async (e: FormEvent) => {
    e.preventDefault();

    if (verifying) return;

    setVerifying(true);
    setVoterError("");
    try {
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
        (doc) => doc.data().uniqueField === voterCredentials.uniqueField
      );      

      if (found) {
        // Check if this voter has already voted

        if (found.data().password !== voterCredentials.password) {
          toast.error("Voter credentials do not match.");
          setVerifying(false);
          return;
        }

        if (!found.data().isVerified) {
          toast.error("Voter not yet approved by Admin.");
          setVerifying(false);
          return;
        }

        const votesRef = collection(
          doc(db, "elections", electionId || voterCredentials.electionId || ""),
          "votes"
        );
        const votesSnap = await getDocs(votesRef);        

        const alreadyVoted = votesSnap.docs.find(
          (doc) => doc.data().uniqueField === voterCredentials.uniqueField
        );
        

        if (alreadyVoted) {
          toast.error("Sorry This email has already voted in this Election");
          setVerifying(false);
          return;
        }

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
        toast.error("Voter not registered for this election.");
        setVerifying(false);
      }
    } catch (error) {
      toast.error("Failed to verify voter");      
      setVerifying(false);
    } finally {
      setVerifying(false);
      setVerifying(false);
    }
  };

  if (!voterVerified || !election) {
    return (
      <div className="h-screen items-center justify-center bg-gray-900 text-white">
        {/* <Navbar /> */}

        <div className="flex items-center justify-center h-full flex-col">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mb-8 text-center max-w-[90%] mx-auto">
            {election?.name.toLowerCase().includes("election")
              ? election?.name
                  .toLowerCase()
                  .split("election")[0]
                  .trim()
                  .toUpperCase()
              : election?.name}{" "}
            ELECTION
          </h2>

          <form
            className="bg-white/5 p-8 w-[370px] rounded-xl shadow border border-gray-600"
            onSubmit={handleVoterVerification}
          >
            <h2 className="text-xl font-bold mb-4">Voter Verification</h2>

            {!election && (
              <input
                type="text"
                placeholder="Election ID"
                className="w-full mb-4 px-4 py-2 md:py-3 rounded border border-gray-600 bg-white/5 outline-0"
                value={voterCredentials.electionId}
                onChange={(e) =>
                  setVoterCredentials({
                    ...voterCredentials,
                    electionId: e.target.value,
                  })
                }
                autoCorrect="off"
                autoCapitalize="none"
                autoComplete="none"
                required
              />
            )}

            <input
              type="text"
              placeholder={election?.uniqueField || "Email"}
              className="w-full mb-4 px-4 py-2 md:py-3 rounded border border-gray-600 bg-white/5 outline-0"
              value={voterCredentials.uniqueField}
              onChange={(e) =>
                setVoterCredentials({
                  ...voterCredentials,
                  uniqueField: e.target.value,
                })
              }
              autoCorrect="off"
              autoCapitalize="none"
              autoComplete="none"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full mb-4 px-4 py-2 md:py-3 rounded border border-gray-600 bg-white/5 outline-0"
                value={voterCredentials.password}
                onChange={(e) =>
                  setVoterCredentials({
                    ...voterCredentials,
                    password: e.target.value,
                  })
                }
                autoCorrect="off"
                autoCapitalize="none"
                autoComplete="none"
                required
              />

              <div className="absolute right-3 top-3 md:top-4">
                {showPassword ? (
                  <FaEye onClick={() => setShowPassword(false)} />
                ) : (
                  <FaEyeSlash onClick={() => setShowPassword(true)} />
                )}
              </div>
            </div>

            {voterError && (
              <div className="text-red-500 mb-2">{voterError}</div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 md:py-3 rounded cursor-pointer mt-2"
            >
              {verifying ? "Verifying..." : "Verify Voter"}
            </button>
          </form>
        </div>

        {/* <Footer /> */}
      </div>
    );
  }

  // Step-by-step voting
  const currentPosition = positions[step];

  // Helper to get aspirant name by position and id
  const getAspirantName = (posId: string, aspId: string) => {
    const pos = positions.find((p) => p.id === posId);
    if (!pos) return "";
    const asp = pos.aspirants.find((a: any) => a.aspirantId === aspId);
    return asp ? asp.name : "";
  };

  return (
    <div className="bg-gray-900 from-gray-900 via-blue-900 to-gray-800 min-h-screen pt-[2rem]">
      {/* <Navbar /> */}
      <main className="max-w-2xl mx-auto py-12 px-4 h-[70vh] flex flex-col justify-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center mt-[5rem]">
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
          <>
            {!showPreview ? (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (step < positions.length - 1) {
                    setStep((prev) => prev + 1);
                  } else {
                    setShowPreview(true);
                  }
                }}
                className="bg-white/10 backdrop-blur-md rounded-4xl shadow-xl border border-gray-700"
              >
                {currentPosition && (
                  <div className="h-fit">
                    <h2 className="text-xl font-bold text-blue-200 rounded-b-xl rounded-t-3xl bg-blue-600 p-4">
                      {currentPosition.position}
                    </h2>

                    <div className="flex flex-col gap-4 p-2 md:p-8 overflow-scroll max-h-[40vh] bg-amber-200]">
                      {currentPosition.aspirants.length < 1 ? (
                        <p className="text-gray-300 text-lg max-w-[60%] mx-auto md:text-xl text-center my-4">
                          No candidates available in this Position
                        </p>
                      ) : (
                        currentPosition.aspirants.map(
                          (aspirant: any, index: number) => (
                            <label
                              key={aspirant.aspirantId}
                              className={`flex relative items-center gap-4 overflow-hidden p-2 md:p-3 rounded-4xl cursor-pointer ${
                                selected[currentPosition.id] ===
                                aspirant.aspirantId
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
                                  <h2 className="font-medium text-lg md:text-xl">
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
                                          ? {
                                              ...prev,
                                              [currentPosition.id]: "",
                                            }
                                          : {
                                              ...prev,
                                              [currentPosition.id]:
                                                aspirant.aspirantId,
                                            }
                                      );
                                    }}
                                    className="accent-yellow-600 w-[1.25rem] md:w-[1.55rem] aspect-square"
                                  />
                                </div>

                                <p className="text-gray-300 text-sm md:text-lg">
                                  {aspirant.email}
                                </p>
                              </div>

                              <div className="text-blue-200 text-xl md:text-3xl font-bold absolute top-2 right-2 rounded-2xl w-[2.55rem] flex items-center md:w-[3.25rem] aspect-square bg-white/10 text-center justify-center">
                                <span>#{index + 1}</span>
                              </div>
                            </label>
                          )
                        )
                      )}
                    </div>
                  </div>
                )}
                <div className="flex justify-between mt-[1rem] pt-0 md:p-8">
                  {step < 1 ? (
                    <div></div>
                  ) : (
                    <button
                      type="button"
                      className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-r-full md:rounded-full cursor-pointer shadow transition"
                      disabled={step === 0}
                      onClick={() => setStep((prev) => prev - 1)}
                    >
                      Previous
                    </button>
                  )}
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-l-full md:rounded-full cursor-pointer shadow transition"
                  >
                    {step < positions.length - 1 ? "Next Position" : "Submit"}
                  </button>
                </div>
              </form>
            ) : (
              // Preview Dialog
              <div className="bg-white/10 backdrop-blur-md rounded-4xl shadow-xl border border-gray-700 p-2 md:p-8 flex flex-col items-center justify-center">
                <h2 className="text-lg md:text-2xl font-bold text-white/90 text-center">
                  Are you sure you want to submit your vote?
                </h2>
                <h2 className="text-sm md:text-lg text-gray-400 italic mb-6 text-center">
                  Preview Your Selections to Confirm
                </h2>
                <div className="w-full mb-6">
                  {positions.map((pos) => (
                    <div key={pos.id} className="mb-4">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {pos.position}
                      </h3>
                      {selected[pos.id] ? (
                        <div className="flex items-center gap-3 bg-blue-600/20 rounded-xl p-3">
                          <img
                            src={
                              pos.aspirants.find(
                                (a: any) => a.aspirantId === selected[pos.id]
                              )?.image
                            }
                            alt={
                              pos.aspirants.find(
                                (a: any) => a.aspirantId === selected[pos.id]
                              )?.name
                            }
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <span className="text-white font-semibold">
                            {getAspirantName(pos.id, selected[pos.id])}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">
                          No selection
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 justify-between items-center w-full">
                  <button
                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-full shadow transition cursor-pointer"
                    onClick={() => setShowPreview(false)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full shadow transition"
                    onClick={async () => {
                      await handleVote();
                      setShowPreview(false);
                    }}
                  >
                    {submitting ? "Submitting..." : "Confirm"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default VotePage;
