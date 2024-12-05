import React, { useState, useEffect } from "react";

const CastVotePage = ({ isLoggedIn, userName }) => {
  const [electionDateTime, setElectionDateTime] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [votedCandidate, setVotedCandidate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    setElectionDateTime(localStorage.getItem("electionDateTime") || "Not Set");
    setCandidates(JSON.parse(localStorage.getItem("candidates")) || []);
  }, []);

  const handleVote = (candidate) => {
    if (!isLoggedIn) {
      alert("Please log in to vote!");
      return;
    }
    if (votedCandidate) {
      alert(`You have already voted for ${votedCandidate}`);
      return;
    }
    setSelectedCandidate(candidate);
    setShowModal(true);
  };

  const confirmVote = () => {
    setVotedCandidate(selectedCandidate);
    setShowModal(false);
    alert(`You have successfully voted for ${selectedCandidate}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-lightBlue-100 text-gray-800">
      <header className="bg-blue-500 text-white p-6 shadow-md">
        <h1 className="text-3xl font-bold">Cast Your Vote</h1>
        {isLoggedIn ? (
          <p className="mt-2">Welcome, {userName}!</p>
        ) : (
          <p className="mt-2 text-yellow-200">You must log in to cast your vote.</p>
        )}
      </header>

      <main className="container mx-auto p-8">
        {/* Election Info */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            Election Information
          </h2>
          <p className="text-gray-700">
            <strong>Election Date:</strong>{" "}
            {electionDateTime !== "Not Set"
              ? new Date(electionDateTime).toLocaleString()
              : "Not Set"}
          </p>
          {new Date(electionDateTime) > new Date() ? (
            <p className="text-gray-500 mt-2">
              Voting not started yet. Starts at:{" "}
              <strong>{electionDateTime}</strong>
            </p>
          ) : null}
        </section>

        {/* Candidates List */}
        <section className="bg-blue-50 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            Candidates
          </h2>
          {candidates.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {candidates.map((candidate, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    votedCandidate === candidate
                      ? "bg-lightBlue-200 border-blue-500"
                      : "bg-white border-blue-300"
                  }`}
                >
                  <p className="text-lg font-medium text-gray-800">
                    {candidate}
                  </p>
                  <button
                    onClick={() => handleVote(candidate)}
                    disabled={votedCandidate}
                    className={`mt-4 px-4 py-2 font-medium text-white rounded ${
                      votedCandidate
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-700"
                    }`}
                  >
                    {votedCandidate ? "Vote Casted" : "Vote"}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No candidates available for voting.</p>
          )}
        </section>
      </main>

      {/* Modal for Confirming Vote */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 w-96">
            <h3 className="text-2xl font-semibold text-gray-800">
              Confirm Your Vote
            </h3>
            <p className="mt-4 text-gray-600">
              Are you sure you want to vote for{" "}
              <strong className="text-blue-600">{selectedCandidate}</strong>?
            </p>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmVote}
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CastVotePage;
