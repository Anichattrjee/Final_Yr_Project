import React, { useState, useEffect } from "react";
import { 
  getPendingCandidates, 
  setCandidateApproval,
  createElection,
  getApprovedCandidates
} from "../apiCalls/apis"; // Adjust imports as needed

const AdminDashboard = () => {
  const [pendingCandidates, setPendingCandidates] = useState([]);
  const [approvedCandidates, setApprovedCandidates] = useState([]);
  const [loading, setLoading] = useState({
    pending: true,
    approved: true
  });
  const [actionLoading, setActionLoading] = useState(null);
  const [electionForm, setElectionForm] = useState({
    title: '',
    description: '',
    constituency: '',
    startDate: '',
    endDate: '',
    candidateIds: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pending, approved] = await Promise.all([
        getPendingCandidates(),
        getApprovedCandidates()
      ]);
      setPendingCandidates(pending);
      setApprovedCandidates(approved);
      setLoading({ pending: false, approved: false });
    } catch (error) {
      console.error(error);
      alert("Failed to load data");
    }
  };

  const handleApproval = async (id, approved) => {
    setActionLoading(id);
    try {
      await setCandidateApproval(id, approved);
      await fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleElectionCreate = async (e) => {
    e.preventDefault();
    try {
      await createElection(electionForm);
      alert("Election created successfully!");
      setElectionForm({
        title: '',
        description: '',
        constituency: '',
        startDate: '',
        endDate: '',
        candidateIds: []
      });
    } catch (error) {
      alert(error.response?.data?.message || "Election creation failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 text-gray-700 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600">Admin Dashboard</h1>
          <p className="text-lg mt-2 text-blue-800">Manage elections and candidates</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Election Creation Section */}
          <section className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Create New Election</h2>
            <form onSubmit={handleElectionCreate} className="space-y-4">
              <div>
                <label className="block text-blue-800 mb-1">Title</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={electionForm.title}
                  onChange={e => setElectionForm({...electionForm, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-blue-800 mb-1">Description</label>
                <textarea
                  required
                  className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={electionForm.description}
                  onChange={e => setElectionForm({...electionForm, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-blue-800 mb-1">Start Date</label>
                  <input
                    type="datetime-local"
                    required
                    className="w-full p-2 border border-blue-200 rounded-lg"
                    value={electionForm.startDate}
                    onChange={e => setElectionForm({...electionForm, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-blue-800 mb-1">End Date</label>
                  <input
                    type="datetime-local"
                    required
                    className="w-full p-2 border border-blue-200 rounded-lg"
                    value={electionForm.endDate}
                    onChange={e => setElectionForm({...electionForm, endDate: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-blue-800 mb-1">Candidates</label>
                <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                  {approvedCandidates.map(candidate => (
                    
                    <label key={candidate._id} className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                      <input
                        type="checkbox"
                        className="text-blue-600"
                        checked={electionForm.candidateIds.includes(candidate._id)}
                        onChange={e => {
                          const newIds = e.target.checked
                            ? [...electionForm.candidateIds, candidate._id]
                            : electionForm.candidateIds.filter(id => id !== candidate._id);
                          setElectionForm({...electionForm, candidateIds: newIds,constituency: candidate.candidateInfo.constituency});
                        }}
                      />
                      <span>{candidate.username} ({candidate.candidateInfo.party})</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Election
              </button>
            </form>
          </section>

          {/* Candidate Approval Section */}
          <section className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Pending Candidates</h2>
            {loading.pending ? (
              <p className="text-center text-blue-500">Loading candidates...</p>
            ) : pendingCandidates.length > 0 ? (
              <div className="space-y-4">
                {pendingCandidates.map(candidate => (
                  <div key={candidate._id} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-blue-800">{candidate.username}</p>
                        <p className="text-sm text-blue-600">
                          {candidate.candidateInfo.party} | {candidate.candidateInfo.position}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproval(candidate._id, true)}
                          disabled={actionLoading === candidate._id}
                          className={`px-3 py-1 rounded-md ${
                            actionLoading === candidate._id 
                              ? 'bg-green-300' 
                              : 'bg-green-500 hover:bg-green-600 text-white'
                          }`}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleApproval(candidate._id, false)}
                          disabled={actionLoading === candidate._id}
                          className={`px-3 py-1 rounded-md ${
                            actionLoading === candidate._id 
                              ? 'bg-red-300' 
                              : 'bg-red-500 hover:bg-red-600 text-white'
                          }`}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-blue-400">No pending candidates</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;