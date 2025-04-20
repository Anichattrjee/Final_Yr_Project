import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPendingCandidates,
  setCandidateApproval,
  createElection,
  getApprovedCandidates,
  endElection,
  deleteElection,
  getAllElections
} from "../apiCalls/apis";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Candidate states
  const [pendingCandidates, setPendingCandidates] = useState([]);
  const [approvedCandidates, setApprovedCandidates] = useState([]);
  const [loading, setLoading] = useState({ pending: true, approved: true });
  const [actionLoading, setActionLoading] = useState(null);

  // Election states
  const [elections, setElections] = useState({ active: [], completed: [] });
  const [electionLoading, setElectionLoading] = useState(true);
  const [electionActionLoading, setElectionActionLoading] = useState(null);

  // New election form
  const [electionForm, setElectionForm] = useState({
    title: '',
    description: '',
    constituency: '',
    startDate: '',
    endDate: '',
    candidateIds: []
  });

  // Redirect if not authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pending, approved, allElections] = await Promise.all([
        getPendingCandidates(),
        getApprovedCandidates(),
        getAllElections()
      ]);

      // Split elections into active/completed
      const now = new Date();
      const active = allElections.filter(e => new Date(e.endDate) > now && e.status !== 'completed');
      const completed = allElections.filter(e => e.status === 'completed' || new Date(e.endDate) <= now);

      setElections({ active, completed });
      setPendingCandidates(pending);
      setApprovedCandidates(approved);
      setLoading({ pending: false, approved: false });
      setElectionLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert("Failed to load data. Please try refreshing the page.");
      }
    }
  };

  // Candidate approval handler
  const handleApproval = async (id, approved) => {
    setActionLoading(id);
    try {
      await setCandidateApproval(id, approved);
      await fetchData();
    } catch (error) {
      console.error("Approval error:", error);
      alert(error.response?.data?.message || "Action failed");
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setActionLoading(null);
    }
  };

  // Create election handler
  const handleElectionCreate = async e => {
    e.preventDefault();
    try {
      if (electionForm.candidateIds.length < 2) {
        alert("Please select at least 2 candidates");
        return;
      }
      if (new Date(electionForm.startDate) >= new Date(electionForm.endDate)) {
        alert("End date must be after start date");
        return;
      }
      await createElection(electionForm);
      alert("Election created successfully!");
      setElectionForm({ title: '', description: '', constituency: '', startDate: '', endDate: '', candidateIds: [] });
      await fetchData();
    } catch (error) {
      console.error("Creation error:", error);
      alert(error.response?.data?.message || "Election creation failed");
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  // End election handler
  const handleEndElection = async id => {
    setElectionActionLoading(id);
    try {
      await endElection(id);
      await fetchData();
      alert('Election ended successfully');
    } catch (error) {
      alert(error.response?.data?.message || "Failed to end election");
    } finally {
      setElectionActionLoading(null);
    }
  };

  // Delete election handler
  const handleDeleteElection = async id => {
    if (!window.confirm("Are you sure you want to delete this election?")) return;
    setElectionActionLoading(id);
    try {
      await deleteElection(id);
      await fetchData();
      alert('Election deleted successfully');
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete election");
    } finally {
      setElectionActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 text-gray-700 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600">Admin Dashboard</h1>
          <p className="text-lg mt-2 text-blue-800">Manage elections and candidates</p>
        </header>

        {/* Manage Elections Section */}
        <section className="bg-white shadow-lg rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">Manage Elections</h2>
          {electionLoading ? (
            <p className="text-center text-blue-500">Loading elections...</p>
          ) : (
            <div className="space-y-6">
              {/* Active Elections */}
              <div>
                <h3 className="text-lg font-semibold text-blue-700 mb-3">Active Elections</h3>
                {elections.active.length ? (
                  elections.active.map(e => (
                    <div key={e._id} className="p-4 bg-blue-50 rounded-lg border border-blue-200 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-blue-800">{e.title}</p>
                        <p className="text-sm text-blue-600">
                          {new Date(e.startDate).toLocaleDateString()} - {new Date(e.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleEndElection(e._id)}
                        disabled={electionActionLoading === e._id}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-red-300"
                      >
                        {electionActionLoading === e._id ? 'Ending...' : 'End Election'}
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-blue-400">No active elections</p>
                )}
              </div>

              {/* Completed Elections */}
              <div>
                <h3 className="text-lg font-semibold text-blue-700 mb-3">Completed Elections</h3>
                {elections.completed.length ? (
                  elections.completed.map(e => (
                    <div key={e._id} className="p-4 bg-blue-50 rounded-lg border border-blue-200 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-blue-800">{e.title}</p>
                        <p className="text-sm text-blue-600">Ended: {new Date(e.endDate).toLocaleDateString()}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteElection(e._id)}
                        disabled={electionActionLoading === e._id}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:bg-gray-300"
                      >
                        {electionActionLoading === e._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-blue-400">No completed elections</p>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Create & Approval Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Election */}
          <section className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Create New Election</h2>
            <form onSubmit={handleElectionCreate} className="space-y-4">
              <div>
                <label className="block text-blue-800 mb-1">Title</label>
                <input
                  type="text" required
                  className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={electionForm.title}
                  onChange={e => setElectionForm({ ...electionForm, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-blue-800 mb-1">Description</label>
                <textarea
                  required
                  className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={electionForm.description}
                  onChange={e => setElectionForm({ ...electionForm, description: e.target.value })}
cmp
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-blue-800 mb-1">Start Date</label>
                  <input
                    type="datetime-local" required
                    className="w-full p-2 border border-blue-200 rounded-lg"
                    value={electionForm.startDate}
                    onChange={e => setElectionForm({ ...electionForm, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-blue-800 mb-1">End Date</label>
                  <input
                    type="datetime-local" required
                    className="w-full p-2 border border-blue-200 rounded-lg"
                    value={electionForm.endDate}
                    onChange={e => setElectionForm({ ...electionForm, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-blue-800 mb-1">Candidates</label>
                <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                  {approvedCandidates.map(c => (
                    <label key={c._id} className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                      <input
                        type="checkbox"
                        className="text-blue-600"
                        checked={electionForm.candidateIds.includes(c._id)}
                        onChange={e => {
                          const ids = e.target.checked
                            ? [...electionForm.candidateIds, c._id]
                            : electionForm.candidateIds.filter(i => i !== c._id);
                          setElectionForm({
                            ...electionForm,
                            candidateIds: ids,
                            constituency: c.candidateInfo.constituency
                          });
                        }}
                      />
                      <span>{c.username} ({c.candidateInfo.party})</span>
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                Create Election
              </button>
            </form>
          </section>

          {/* Pending Candidates */}
          <section className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Pending Candidates</h2>
            {loading.pending ? (
              <p className="text-center text-blue-500">Loading candidates...</p>
            ) : pendingCandidates.length ? (
              <div className="space-y-4">
                {pendingCandidates.map(c => (
                  <div key={c._id} className="p-4 bg-blue-50 rounded-lg border border-blue-200 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-blue-800">{c.username}</p>
                      <p className="text-sm text-blue-600">{c.candidateInfo.party} | {c.candidateInfo.position}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproval(c._id, true)}
                        disabled={actionLoading === c._id}
                        className={`px-3 py-1 rounded-md ${actionLoading === c._id ? 'bg-green-300' : 'bg-green-500 hover:bg-green-600 text-white'}`}>
                        Approve
                      </button>
                      <button
                        onClick={() => handleApproval(c._id, false)}
                        disabled={actionLoading === c._id}
                        className={`px-3 py-1 rounded-md ${actionLoading === c._id ? 'bg-red-300' : 'bg-red-500 hover:bg-red-600 text-white'}`}>
                        Reject
                      </button>
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
