import React, { useState } from 'react';
import { useJobContext } from './JobContext';

const JobModal = ({ job, columnId, onClose }) => {
  const { updateJobDetails, updateJobStatus } = useJobContext();
  const [newRound, setNewRound] = useState('');
  
  const rounds = job.rounds || [];

  // This function decides what happens when you pick something from the dropdown
  const handleStatusChange = (e) => {
    const selectedValue = e.target.value;

    if (selectedValue === 'applied') {
      updateJobStatus(job.id, columnId, 'applied', '');
    } 
    else if (selectedValue === 'rejected') {
      updateJobStatus(job.id, columnId, 'rejected', '');
    } 
    else if (selectedValue === 'offer') {
      updateJobStatus(job.id, columnId, 'offer', '');
    } 
    else {
      // It must be a custom round (e.g. "OA", "HR")
      // Move to "Interviewing" and set the name
      updateJobStatus(job.id, columnId, 'interviewing', selectedValue);
    }
    
    // We don't close the modal anymore so you can see the change
  };

  const handleAddRound = (e) => {
    e.preventDefault();
    if (!newRound) return;
    const updatedRounds = [...rounds, { id: Date.now(), name: newRound, completed: false }];
    updateJobDetails(columnId, job.id, { rounds: updatedRounds });
    setNewRound('');
  };

  const deleteRound = (roundId) => {
    const updatedRounds = rounds.filter(r => r.id !== roundId);
    updateJobDetails(columnId, job.id, { rounds: updatedRounds });
  };

  // Calculate what the current value of the dropdown should be
  const currentDropdownValue = () => {
    if (columnId === 'applied') return 'applied';
    if (columnId === 'rejected') return 'rejected';
    if (columnId === 'offer') return 'offer';
    // If we are in "Interviewing", show the active round name
    return job.activeRound || 'interviewing_generic';
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-800/50">
          <div>
            <h2 className="text-2xl font-bold text-white">{job.company}</h2>
            <p className="text-blue-400 text-sm font-medium">{job.role}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl p-2">✕</button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* SECTION 1: THE UNIFIED DROPDOWN */}
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Current Stage</label>
            <select 
              value={currentDropdownValue()} 
              onChange={handleStatusChange}
              className="w-full bg-gray-800 text-white border border-gray-600 rounded p-3 focus:border-blue-500 outline-none font-medium"
            >
              <option className="text-gray-400" disabled>-- Status --</option>
              <option value="applied">Applied</option>
              
              {/* DYNAMIC ROUNDS (These map to "Interviewing") */}
              {rounds.length > 0 && <optgroup label="Interview Rounds">
                {rounds.map(r => (
                  <option key={r.id} value={r.name}>{r.name}</option>
                ))}
              </optgroup>}
              
              {/* Fallback if no rounds added but in interviewing */}
              {rounds.length === 0 && <option value="interviewing_generic">Interviewing</option>}

              <option value="offer">Offer 🎉</option>
              <option value="rejected">Rejected ✕</option>
            </select>
          </div>

          {/* SECTION 2: ADD ROUNDS */}
          <div className="pt-4 border-t border-gray-800">
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Manage Process</label>
            
            <div className="space-y-2 mb-3">
              {rounds.map((round) => (
                <div key={round.id} className="flex items-center justify-between bg-gray-800 p-2 rounded border border-gray-700">
                  <span className="text-sm text-white pl-2">{round.name}</span>
                  <button onClick={() => deleteRound(round.id)} className="text-gray-500 hover:text-red-400 text-xs px-2">Remove</button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddRound} className="flex gap-2">
              <input 
                value={newRound}
                onChange={(e) => setNewRound(e.target.value)}
                placeholder="Add Stage (e.g. OA, HR)"
                className="flex-1 bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 text-sm focus:border-blue-500 outline-none"
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded text-sm font-bold">Add</button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default JobModal;