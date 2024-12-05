import React, { useState, useEffect } from "react";

const CurrentStatusPage = () => {
  const [electionDateTime, setElectionDateTime] = useState("");
  const [electionEndTime, setElectionEndTime] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [votes, setVotes] = useState({});
  const [voteTrends, setVoteTrends] = useState({});

  useEffect(() => {
    const storedElectionDateTime =
      localStorage.getItem("electionDateTime") || "Not Set";
    setElectionDateTime(storedElectionDateTime);

    if (storedElectionDateTime !== "Not Set") {
      const endTime = new Date(storedElectionDateTime);
      endTime.setHours(endTime.getHours() + 24);
      setElectionEndTime(endTime.toLocaleString());
    }

    const storedCandidates = JSON.parse(localStorage.getItem("candidates")) || [];
    setCandidates(storedCandidates);

    const generatedVotes = {};
    const generatedTrends = {};
    storedCandidates.forEach((candidate) => {
      const randomVotes = Math.floor(Math.random() * 1000);
      const trend = Math.random() > 0.5 ? "up" : "down"; // Randomly generate up or down trends
      generatedVotes[candidate] = randomVotes;
      generatedTrends[candidate] = trend;
    });
    setVotes(generatedVotes);
    setVoteTrends(generatedTrends);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 text-gray-800">
      <header className="bg-white shadow-md p-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-600">Current Election Status</h1>
          <p className="text-gray-600 mt-2">
            Stay updated with the latest election details.
          </p>
        </div>
        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
          LIVE
        </span>
      </header>

      <main className="container mx-auto p-8">
        {/* Election Info */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            Election Information
          </h2>
          <p className="text-gray-700">
            <strong>Election Start:</strong>{" "}
            {electionDateTime !== "Not Set"
              ? new Date(electionDateTime).toLocaleString()
              : "Not Set"}
          </p>
          {electionEndTime && (
            <p className="text-gray-700 mt-2">
              <strong>Election End:</strong> {electionEndTime}
            </p>
          )}
        </section>

        {/* Candidates and Votes */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            Candidates & Votes
          </h2>
          {candidates.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {candidates.map((candidate, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-blue-50 border border-blue-300 shadow-md flex flex-col items-start"
                >
                  <h3 className="text-lg font-medium text-gray-800">{candidate}</h3>
                  <div className="mt-4 flex items-center">
                    <p className="text-gray-600 text-lg font-semibold">
                      Votes: {votes[candidate]}
                    </p>
                    <span
                      className={`ml-2 text-xl ${
                        voteTrends[candidate] === "up" ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {voteTrends[candidate] === "up" ? "↑" : "↓"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No candidates added yet.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default CurrentStatusPage;
