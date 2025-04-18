import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCandidateElections } from "../apiCalls/apis"; // You'll need to create this API function

const CandidateProfilePage = () => {
  const navigate = useNavigate();
  const [candidateData, setCandidateData] = useState(null);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.role !== "candidate") {
      navigate("/login");
      return;
    }

    setCandidateData(storedUser);
    
    const fetchData = async () => {
      try {
        const electionData = await getCandidateElections(storedUser.id);
        setElections(electionData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);

  if (!candidateData) return null;
  if (loading) return <div className="text-center p-8 text-blue-600">Loading profile...</div>;
  if (error) return <div className="text-center p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-lightBlue-100 text-gray-800">
      <header className="bg-blue-500 text-white p-6 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">Candidate Profile</h1>
          <p className="mt-2">{candidateData.username}</p>
        </div>
      </header>

      <main className="container mx-auto p-8">
        {/* Approval Status Banner */}
        <div className={`mb-8 p-4 rounded-lg ${
          candidateData.candidateInfo.approved 
            ? "bg-green-100 border-green-500" 
            : "bg-yellow-100 border-yellow-500"
        } border-l-4`}>
          <h3 className="text-lg font-semibold">
            {candidateData.candidateInfo.approved ? "✓ Approved Candidate" : "⌛ Approval Pending"}
          </h3>
          <p className="text-sm mt-1">
            {candidateData.candidateInfo.approved
              ? "Your profile is visible to all voters"
              : "Your application is under review"}
          </p>
        </div>

        {/* Campaign Information */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">Campaign Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-700">
                <strong>Party:</strong> {candidateData.candidateInfo.party}
              </p>
              <p className="text-gray-700">
                <strong>Position:</strong> {candidateData.candidateInfo.position}
              </p>
            </div>
            <div>
              <p className="text-gray-700">
                <strong>Constituency:</strong> {candidateData.candidateInfo.constituency}
              </p>
              <p className="text-gray-700">
                <strong>Campaign Slogan:</strong> {candidateData.candidateInfo.slogan || "N/A"}
              </p>
            </div>
          </div>
        </section>

        {/* Election Participation */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">Election History</h2>
          {elections.length > 0 ? (
            <div className="space-y-4">
              {elections.map((election) => (
                <div key={election._id} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-medium text-blue-800">{election.title}</h3>
                      <p className="text-sm text-blue-600">
                        {new Date(election.startDate).toLocaleDateString()} -{" "}
                        {new Date(election.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      election.status === 'completed' 
                        ? "bg-gray-200 text-gray-800" 
                        : "bg-blue-200 text-blue-800"
                    }`}>
                      {election.status}
                    </span>
                  </div>
                  {election.results && (
                    <div className="mt-2">
                      <p className="text-gray-700">
                        <strong>Votes Received:</strong> {election.results.votes}
                      </p>
                      <p className="text-gray-700">
                        <strong>Vote Percentage:</strong> {election.results.percentage}%
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-600">No election participation history</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default CandidateProfilePage;