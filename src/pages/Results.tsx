import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebase.config";
import { doc, collection, getDocs, getDoc } from "firebase/firestore";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

const Results = () => {
  const { electionId } = useParams<{ electionId: string }>();
  const [positions, setPositions] = useState<any[]>([]);
  const [results, setResults] = useState<{
    [key: string]: { [key: string]: number };
  }>({});
  const [loading, setLoading] = useState(true);
  const [election, setElection] = useState<any>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!electionId) return;
      setLoading(true);

      // Fetch election info
      const electionRef = doc(db, "elections", electionId);
      const electionSnap = await getDoc(electionRef);
      if (electionSnap.exists()) {
        setElection({ id: electionSnap.id, ...electionSnap.data() });
      }

      // Fetch positions
      const positionsRef = collection(electionRef, "positions");
      const positionsSnap = await getDocs(positionsRef);

      const positionsData = await Promise.all(
        positionsSnap.docs.map(async (posDoc) => {
          const aspirantsRef = collection(posDoc.ref, "aspirants");
          const aspirantsSnap = await getDocs(aspirantsRef);
          return {
            id: posDoc.id,
            position: posDoc.data().position,
            aspirants: aspirantsSnap.docs.map((aDoc) => ({
              id: aDoc.id,
              name: aDoc.data().name,
              image: aDoc.data().image,
              email: aDoc.data().email,
              ...aDoc.data(),
            })),
          };
        })
      );
      setPositions(positionsData);

      // Fetch votes
      const votesRef = collection(electionRef, "votes");
      const votesSnap = await getDocs(votesRef);
      const votes = votesSnap.docs.map((doc) => doc.data());

      // Count results
      const counted: {
        [positionId: string]: { [aspirantId: string]: number };
      } = {};

      positionsData.forEach((position) => {
        counted[position.id] = {};
        position.aspirants.forEach((aspirant: any) => {
          counted[position.id][aspirant.id] = 0;
        });
      });

      votes.forEach((vote: any) => {
        if (vote.selections) {
          Object.entries(vote.selections).forEach(
            ([positionId, aspirantId]) => {
              const posId = positionId as string;
              const aspId = aspirantId as string;
              if (counted[posId] && counted[posId][aspId] !== undefined) {
                counted[posId][aspId]++;
              }
            }
          );
        }
      });

      setResults(counted);
      setLoading(false);
    };

    fetchResults();
  }, [electionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading results...
      </div>
    );
  }

  // console.log(election.status);

  return (
    <div className="bg-gray-900 from-gray-900 min-h-screen">
      {/* <Navbar /> */}
      {election.status !== "Completed" ? (
        <div className="h-[100vh] items-center justify-center max-w-2xl m-auto py-12 px-4 flex flex-col">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            {election ? election.name + " RESULTS" : "Election Results"}
          </h1>
          <h2 className="text-2xl font-semibold text-red-500 text-center mb-4">
            Election still ongoing.
          </h2>
        </div>
      ) : (
        <main className="max-w-2xl mx-auto py-12 px-4 min-h-[70vh]">
          <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
            {election ? election.name + " RESULTS" : "Election Results"}
          </h1>
          {positions.map((position) => {
            // Calculate total votes for this position
            const totalVotes = position.aspirants.reduce(
              (sum: number, aspirant: any) =>
                sum + (results[position.id]?.[aspirant.id] || 0),
              0
            );
            return (
              <div
                key={position.id}
                className="mb-8 bg-white/5 rounded-xl p-4 md:p-6 shadow"
              >
                <h2 className="text-xl font-semibold text-blue-300 mb-4">
                  {position.position}
                </h2>
                <table className="w-full text-left">
                  <thead>
                    <tr className="">
                      <th className="text-gray-300 pb-2 w-[25%] pl-2">Image</th>
                      <th className="text-gray-300 pb-2 w-[35%]">Aspirants</th>
                      <th className="text-gray-300 pb-2 w-[20%]">Votes</th>
                      <th className="text-gray-300 pb-2 w-[20%]">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {position.aspirants.map((aspirant: any, idx: number) => {
                      const votes = results[position.id]?.[aspirant.id] || 0;
                      const percent =
                        totalVotes > 0
                          ? ((votes / totalVotes) * 100).toFixed(1)
                          : "0.0";
                      const isFirst = idx === 0;
                      const isLast = idx === position.aspirants.length - 1;
                      return (
                        <tr
                          key={aspirant.id}
                          className={`border-b border-blue-600 bg-white/10 
                          ${isFirst ? "rounded-4xl" : ""}
                          ${isLast ? "rounded-4xl border-b-0" : ""}
                        `}
                          style={{
                            overflow: "hidden",
                          }}
                        >
                          <td
                            className={`py-2 md:py-3 text-white pl-2 md:pl-3 w-[25%] aspect-square overflow-hidden ${
                              isFirst ? "rounded-tl-3xl" : ""
                            } ${isLast ? "rounded-bl-3xl" : ""}`}
                          >
                            <img
                              src={aspirant.image}
                              alt={aspirant.name}
                              className="object-cover w-[85%] md:w-[70%] aspect-square rounded-xl md:rounded-3xl"
                            />
                          </td>
                          <td className="py-2 md:py-3 text-white w-[35%] md:text-lg font-semibold">
                            {aspirant.name}
                          </td>
                          <td className="py-2 md:py-3 text-blue-400 font-bold w-[20%] text-xl md:text-2xl">
                            {votes}
                          </td>
                          <td
                            className={`py-2 md:py-3 text-green-400 text-xl md:text-2xl font-bold w-[20%] text-center ${
                              isFirst ? "rounded-tr-3xl" : ""
                            } ${isLast ? "rounded-br-3xl" : ""}`}
                          >
                            {percent}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}
        </main>
      )}
      {/* <Footer /> */}
    </div>
  );
};

export default Results;
