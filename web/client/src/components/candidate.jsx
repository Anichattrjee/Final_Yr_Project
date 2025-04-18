export const CandidateModal = ({ candidate, onClose, onVote, hasVoted, isEligible }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">{candidate.username}</h2>
          <div className="space-y-2">
            <p><strong>Party:</strong> {candidate.candidateInfo.party}</p>
            <p><strong>Position:</strong> {candidate.candidateInfo.position}</p>
            <p><strong>Constituency:</strong> {candidate.candidateInfo.constituency}</p>
            <p><strong>Experience:</strong> {candidate.candidateInfo.experience || 'N/A'}</p>
          </div>
  
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Close
            </button>
            {isEligible && !hasVoted && (
              <button
                onClick={() => {
                  onVote(candidate._id);
                  onClose();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Vote for {candidate.username}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };