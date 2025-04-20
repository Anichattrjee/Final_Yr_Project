import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getElectionResults } from "../apiCalls/apis";

const ElectionResultsPage = () => {
  const { id: electionId } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (!electionId) throw new Error("Invalid election ID");
        const data = await getElectionResults(electionId);
        if (!data) throw new Error("Election not found");

        // First normalize candidates
        const normalizedCandidates = (data.candidates || []).map(c => ({
          _id: c._id,
          username: c.username,
          candidateInfo: {
            party: c.candidateInfo?.party || "Independent",
            position: c.candidateInfo?.position || "N/A"
          }
        }));

        // Map results to candidate IDs using username lookup
        const normalizedResults = (data.results || []).map(r => {
          const match = normalizedCandidates.find(c => c.username === r.candidate?.username);
          return { candidateId: match?._id, votes: r.votes || 0 };
        });

        const processedData = {
          ...data,
          candidates: normalizedCandidates,
          results: normalizedResults,
          totalVotes: data.totalVotes || 0
        };

        setElection(processedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [electionId]);

  const renderWinnerSection = () => {
    // Rank candidates by votes
    const ranked = election.candidates
      .map(c => {
        const r = election.results.find(res => res.candidateId === c._id) || { votes: 0 };
        return { ...c, votes: r.votes };
      })
      .sort((a, b) => b.votes - a.votes);

    // Check for draw (all have equal votes)
    const allEqual = ranked.length > 0 && ranked.every(c => c.votes === ranked[0].votes);
    if (allEqual) {
      const voteCount = ranked[0].votes;
      return (
        <div className="bg-yellow-100 shadow-lg rounded-lg p-8 text-center mb-8">
          <h2 className="text-2xl font-bold text-yellow-800">It's a Draw!</h2>
          <p className="text-lg text-yellow-700 mt-4">
            All candidates received {voteCount.toLocaleString()} votes.
          </p>
        </div>
      );
    }

    if (ranked.length === 0) {
      return (
        <div className="bg-yellow-100 shadow-lg rounded-lg p-8 text-center mb-8">
          <h2 className="text-2xl font-bold text-yellow-800">Results Pending</h2>
          <p className="text-yellow-600 mt-4">Final results are being calculated</p>
        </div>
      );
    }

    const winner = ranked[0];
    const runnerUpVotes = ranked[1]?.votes || 0;
    const margin = winner.votes - runnerUpVotes;
    const totalValidVotes = election.totalVotes;

    return (
      <div className="bg-blue-200 shadow-lg rounded-lg p-8 text-center mb-8">
        <h2 className="text-2xl font-bold text-blue-800">🏆 Winner</h2>
        <p className="text-3xl font-extrabold text-blue-900 mt-4">
          {winner.username} - {winner.votes.toLocaleString()} votes ({
            totalValidVotes > 0 ? ((winner.votes / totalValidVotes) * 100).toFixed(1) : 0
          }%)
        </p>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Votes</p>
            <p className="text-xl font-bold text-blue-600">{totalValidVotes.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-600">Winning Votes</p>
            <p className="text-xl font-bold text-blue-600">{winner.votes.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-600">Winning Percentage</p>
            <p className="text-xl font-bold text-blue-600">
              {totalValidVotes > 0 ? ((winner.votes / totalValidVotes) * 100).toFixed(1) : 0}%
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-600">Margin</p>
            <p className="text-xl font-bold text-blue-600">
              {election.candidates.length > 1 ? margin.toLocaleString() : "No Competitors"}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderCandidates = (showResults = false) => {
    const list = election.candidates;
    if (!list.length) {
      return (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-gray-600 text-lg">No candidates registered</p>
        </div>
      );
    }

    // Prepare display list with votes and percentage
    const displayList = list.map((c, idx) => {
      const result = election.results.find(r => r.candidateId === c._id) || { votes: 0 };
      const percentage = election.totalVotes > 0 ? ((result.votes / election.totalVotes) * 100).toFixed(1) : 0;
      return { ...c, votes: result.votes, percentage, index: idx };
    });

    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">
          {showResults ? "Results Breakdown" : "Election Candidates"}
        </h2>
        <div className="space-y-4">
          {displayList.map(item => (
            <div
              key={item._id}
              className="p-4 bg-blue-50 rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.index + 1}. {item.username}
                </h3>
                <p className="text-blue-600">
                  {item.candidateInfo.party}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-blue-800">
                  {item.votes.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">{item.percentage}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center p-8 text-blue-600">
        <i className="fas fa-spinner fa-spin mr-2"></i>
        Loading election details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-600 text-xl mb-4">Error: {error}</div>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          ← Back to elections list
        </button>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="text-center p-8">
        <div className="text-gray-600 text-xl mb-4">No election data found</div>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          ← Back to elections list
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-100 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back to All Results
        </button>

        <header className="bg-white shadow-lg rounded-lg p-6 mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-700">
            {election.title} - {election.constituency}
          </h1>
          <div className="mt-4 text-sm text-gray-600">
            {new Date(election.startDate).toLocaleDateString()} -{' '}
            {new Date(election.endDate).toLocaleDateString()}
          </div>
          {!election.isResultPublished && (
            <div className="mt-4 bg-yellow-100 p-3 rounded-lg">
              <i className="fas fa-info-circle text-yellow-700 mr-2"></i>
              Results will be published after official verification
            </div>
          )}
        </header>

        {election.isResultPublished ? (
          <>
            {renderWinnerSection()}
            {renderCandidates(true)}
          </>
        ) : (
          <>
            <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">
                Candidate List
              </h2>
              <p className="text-gray-600 mb-4">
                {election.candidates.length} registered candidates
              </p>
              {renderCandidates(false)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ElectionResultsPage;
