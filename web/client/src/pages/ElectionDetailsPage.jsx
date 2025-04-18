import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getElectionById, castVote } from "../apiCalls/apis";
import { CandidateModal } from "../components/candidate";
import { useCountdown } from "../components/countdown";

const ElectionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  // Retrieve and parse user from localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isLoggedIn = !!user?.id;

  // Countdown hook
  const timeLeft = useCountdown(election?.endDate);

  useEffect(() => {
    const fetchElection = async () => {
      setLoading(true);
      try {
        const data = await getElectionById(id);
        // Determine if the user has voted based on the voters array
        if (user && Array.isArray(data.voters)) {
          setHasVoted(data.voters.includes(user.id));
        }
        setElection(data);
      } catch (err) {
        setError(err.message || "Failed to fetch election");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchElection();
    }
  }, [id]);

  const handleVote = async (candidateId) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    try {
      await castVote(id, candidateId);
      setElection((prev) => ({
        ...prev,
        totalVotes: (prev.totalVotes || 0) + 1,
        results: prev.results.map((result) =>
          result.candidate._id === candidateId
            ? { ...result, votes: result.votes + 1 }
            : result
        ),
        voters: Array.isArray(prev.voters) ? [...prev.voters, user.id] : [user.id]
      }));
      setHasVoted(true);
    } catch (error) {
      alert(error.response?.data?.message || "Voting failed");
    }
  };

  if (loading) return <div className="text-center p-8 text-blue-600">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-600">Error: {error}</div>;
  if (!election) return <div className="text-center p-8">Election not found</div>;

  // Determine election status
  const now = new Date();
  const start = new Date(election.startDate);
  const end = new Date(election.endDate);
  let electionStatus = 'upcoming';
  if (now >= start && now <= end) electionStatus = 'active';
  else if (now > end) electionStatus = 'completed';

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-lightBlue-100 text-gray-800">
      <header className="bg-blue-500 text-white p-6 shadow-md">
        <h1 className="text-3xl font-bold">{election.title}</h1>
        <p className="mt-2">{election.description}</p>
      </header>

      <main className="container mx-auto p-8">
        {/* Status & Timer */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <span className={`px-3 py-1 rounded-full ${
              electionStatus === 'upcoming'
                ? 'bg-blue-200 text-blue-800'
                : electionStatus === 'active'
                ? 'bg-green-200 text-green-800'
                : 'bg-gray-200 text-gray-800'
            }`}>{electionStatus.toUpperCase()}</span>

            {electionStatus === 'active' && (
              <div className="flex items-center gap-2">
                <span className="font-semibold">Time Remaining:</span>
                <div className="bg-blue-100 px-3 py-1 rounded-lg">
                  {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
                </div>
              </div>
            )}

            <div className="text-right">
              <p className="text-sm">Total Votes: {election.totalVotes}</p>
            </div>
          </div>
        </div>

        {/* Voting Section */}
        {electionStatus === 'active' && (
          <section className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Candidates</h2>

            {!isLoggedIn ? (
              <div className="text-center p-4 bg-yellow-100 rounded-lg">
                You must log in to vote
              </div>
            ) : hasVoted ? (
              <div className="text-center p-4 bg-green-100 rounded-lg">
                You have already voted in this election
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {election.candidates.map((candidate) => (
                  <div
                    key={candidate._id}
                    className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedCandidate(candidate)}
                  >
                    <h3 className="text-xl font-semibold text-blue-800">{candidate.username}</h3>
                    <p className="text-blue-600">{candidate.candidateInfo.party}</p>
                    <p className="text-sm text-gray-600 mt-2">{candidate.candidateInfo.position}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Results Section */}
        {electionStatus === 'completed' && (
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Final Results</h2>
            <div className="space-y-4">
              {election.results.map((result) => (
                <div key={result.candidate._id} className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{result.candidate.username}</h3>
                      <p className="text-blue-600">{result.candidate.candidateInfo.party}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{result.percentage}%</p>
                      <p className="text-sm">{result.votes} votes</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Candidate Modal */}
        {selectedCandidate && (
          <CandidateModal
            candidate={selectedCandidate}
            onClose={() => setSelectedCandidate(null)}
            onVote={handleVote}
            hasVoted={hasVoted}
            isEligible={isLoggedIn}
          />
        )}
      </main>
    </div>
  );
};

export default ElectionDetailPage;
