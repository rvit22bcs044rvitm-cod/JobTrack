import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";

const JobContext = createContext();
export const useJobContext = () => useContext(JobContext);

// ----------------------------------------
// AXIOS INSTANCE
// ----------------------------------------
const API = axios.create({
  baseURL: "http://localhost:5001",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ----------------------------------------
// JOB CONTEXT PROVIDER
// ----------------------------------------
export const JobProvider = ({ children }) => {
  const [columns, setColumns] = useState({
    applied: { id: "applied", title: "APPLIED", items: [] },
    interview: { id: "interview", title: "PROCESS", items: [] },
    rejected: { id: "rejected", title: "JOB STATUS", items: [] },
    offer: { id: "offer", title: "OFFER", items: [] },
  });

  // ----------------------------------------
  // FETCH JOBS
  // ----------------------------------------
  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs");
      const jobs = res.data;

      const newColumns = {
        applied: { id: "applied", title: "APPLIED", items: [] },
        interview: { id: "interview", title: "PROCESS", items: [] },
        rejected: { id: "rejected", title: "JOB STATUS", items: [] },
        offer: { id: "offer", title: "OFFER", items: [] },
      };

      jobs.forEach((job) => {
        const key = ["applied", "interview", "rejected", "offer"].includes(job.status)
          ? job.status
          : "applied";

        newColumns[key].items.push({
          id: job._id,
          company: job.company,
          role: job.role,
          description: job.description || "",
          location: job.location || "",
          salary: job.salary || "",
          stages: job.stages || [],
          status: job.status,
          date: new Date(job.dateApplied).toLocaleDateString(),
        });
      });

      setColumns(newColumns);
    } catch (err) {
      console.error("Fetch jobs failed:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ----------------------------------------
  // ADD JOB
  // ----------------------------------------
  const addJob = async (company, role, description, location, salary) => {
    try {
      await API.post("/jobs", {
        company,
        role,
        description,
        location,
        salary,
      });
      fetchJobs();
    } catch (err) {
      console.error("Add job failed:", err);
    }
  };

  // ----------------------------------------
  // DELETE JOB
  // ----------------------------------------
  const deleteJob = async (id) => {
    try {
      await API.delete(`/jobs/${id}`);
      fetchJobs();
    } catch (err) {
      console.error("Delete job failed:", err);
    }
  };

  // ----------------------------------------
  // MOVE TO NEXT COLUMN
  // ----------------------------------------
  const moveToNext = async (job) => {
    const order = ["applied", "interview", "rejected", "offer"];
    const currentIndex = order.indexOf(job.status);

    if (currentIndex === -1 || currentIndex === order.length - 1) return;

    const nextStatus = order[currentIndex + 1];

    try {
      await API.put(`/jobs/${job.id}`, { status: nextStatus });
      fetchJobs();
    } catch (err) {
      console.error("Move to next failed:", err);
    }
  };

  // ----------------------------------------
  // ⭐ FINAL UPDATED FUNCTION — UPDATE ALL FIELDS
  // ----------------------------------------
  const updateJobStages = async (jobId, stagesPayload, extraFields = {}) => {
    try {
      const body = {
        ...extraFields,
        stages: stagesPayload,
      };

      const res = await API.put(`/jobs/${jobId}`, body);
      const updated = res.data;

      // Convert backend -> frontend shape
      const updatedJob = {
        id: updated._id,
        company: updated.company,
        role: updated.role,
        description: updated.description || "",
        location: updated.location || "",
        salary: updated.salary || "",
        status: updated.status,
        stages: updated.stages || [],
      };

      // Update columns UI
      setColumns((prev) => {
        const newCols = {};

        // remove job from all columns
        for (const [colId, col] of Object.entries(prev)) {
          newCols[colId] = {
            ...col,
            items: col.items.filter((item) => item.id !== jobId),
          };
        }

        // add job to its CORRECT column
        const correctColumn = updatedJob.status;
        newCols[correctColumn].items.push(updatedJob);

        return newCols;
      });
    } catch (err) {
      console.error("updateJobStages error:", err);
    }
  };

  // ----------------------------------------
  // DRAG & DROP
  // ----------------------------------------
  const moveCard = async (source, destination) => {
    if (!destination) return;

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];

    const sourceItems = [...sourceCol.items];
    const destItems = [...destCol.items];

    const [removed] = sourceItems.splice(source.index, 1);

    if (source.droppableId !== destination.droppableId) {
      destItems.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceCol, items: sourceItems },
        [destination.droppableId]: { ...destCol, items: destItems },
      });

      try {
        await API.put(`/jobs/${removed.id}`, {
          status: destination.droppableId,
        });
      } catch (err) {
        console.error("Move card failed:", err);
        fetchJobs();
      }
    } else {
      sourceItems.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceCol, items: sourceItems },
      });
    }
  };

  // ----------------------------------------
  // PROVIDER RETURN
  // ----------------------------------------
  return (
    <JobContext.Provider
      value={{
        columns,
        addJob,
        deleteJob,
        moveToNext,
        moveCard,
        updateJobStages, // UPDATED VERSION INCLUDED
      }}
    >
      {children}
    </JobContext.Provider>
  );
};
