import React, { useState, useEffect } from "react";
import { getMyVotingHistory } from "../apiCalls/apis";

const VoterProfilePage = () => {
  const [votingHistory, setVotingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      alert("Please login to view profile");
      window.location.href = "/login";
      return;
    }
    setUserData(storedUser);

    // Fetch voting history
    const fetchData = async () => {
      try {
        console.log("Fetching voting history for user ID:", storedUser.id);
        const history = await getMyVotingHistory(storedUser.id);
        
        setVotingHistory(history);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (!userData) return null;
  if (loading) return <div className="text-center p-8 text-blue-600">Loading profile...</div>;
  if (error) return <div className="text-center p-8 text-red-600">Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-lightBlue-100 text-gray-800">
      <header className="bg-blue-500 text-white p-6 shadow-md">
        <h1 className="text-3xl font-bold">Voter Profile</h1>
        <p className="mt-2">Welcome, {userData.username}</p>
      </header>

      <main className="container mx-auto p-8">
        {/* Personal Info Section */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">Your Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p><strong>Voter ID:</strong> {userData.voterID}</p>
              <p><strong>Email:</strong> {userData.email}</p>
            </div>
            <div className="space-y-2">
              <p><strong>Role:</strong> {userData.role}</p>
              <p><strong>Constituency:</strong> {userData.constituency || "National"}</p>
            </div>
          </div>
        </section>

        {/* Voting History Section */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">Your Voting History</h2>
          {votingHistory.length > 0 ? (
            <div className="space-y-4">
              {votingHistory.map((record, index) => (
                <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-blue-800">
                      {record.electionTitle}
                    </h3>
                    <span className="text-sm text-blue-600">
                      {new Date(record.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">
                    Voted for: {record.candidateName} ({record.party})
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-600">No voting history available</p>
            </div>
          )}
        </section>

        {/* Voting Status Section */}
        <section className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">Voting Status</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <p className="text-sm text-blue-800 mb-1">Total Votes Cast</p>
              <p className="text-3xl font-bold text-blue-600">{votingHistory.length}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <p className="text-sm text-blue-800 mb-1">Last Voted</p>
              <p className="text-blue-600">
                {votingHistory.length > 0 
                  ? new Date(votingHistory[0].timestamp).toLocaleDateString()
                  : "Never"}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default VoterProfilePage;