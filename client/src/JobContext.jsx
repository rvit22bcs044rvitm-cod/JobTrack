import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";

const JobContext = createContext();
export const useJobContext = () => useContext(JobContext);

// ----------------------
// AXIOS INSTANCE WITH TOKEN
// ----------------------
const API = axios.create({
  baseURL: "http://localhost:5001",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ----------------------
// JOB CONTEXT PROVIDER
// ----------------------
export const JobProvider = ({ children }) => {
  const [columns, setColumns] = useState({
    applied: { id: "applied", title: "APPLIED", items: [] },
    interview: { id: "interview", title: "PROCESS", items: [] },
    rejected: { id: "rejected", title: "JOB STATUS", items: [] },
    offer: { id: "offer", title: "OFFER", items: [] },
  });

  // ----------------------
  // FETCH JOBS FROM BACKEND
  // ----------------------
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
        const key =
          ["applied", "interview", "rejected", "offer"].includes(job.status)
            ? job.status
            : "applied";

        newColumns[key].items.push({
          id: job._id,
          company: job.company,
          role: job.role,
          description: job.description,
          location: job.location,
          salary: job.salary,
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

  // ----------------------
  // ADD JOB
  // ----------------------
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

  // ----------------------
  // DELETE JOB
  // ----------------------
  const deleteJob = async (id) => {
    try {
      await API.delete(`/jobs/${id}`);
      fetchJobs();
    } catch (err) {
      console.error("Delete job failed:", err);
    }
  };

  // ----------------------
  // MOVE TO NEXT COLUMN
  // ----------------------
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

  // ----------------------
  // UPDATE JOB STAGES
  // ----------------------
  const updateJobStages = async (jobId, stages) => {
    try {
      await API.put(`/jobs/${jobId}`, { stages });
      fetchJobs();
    } catch (err) {
      console.error("Update stages failed:", err);
    }
  };

  // ----------------------
  // DRAG AND DROP LOGIC
  // ----------------------
  const moveCard = async (source, destination) => {
    if (!destination) return;

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];

    const sourceItems = [...sourceCol.items];
    const destItems = [...destCol.items];

    const [removed] = sourceItems.splice(source.index, 1);

    if (source.droppableId !== destination.droppableId) {
      // Move to another column
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
      // Reorder in same column
      sourceItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceCol, items: sourceItems },
      });
    }
  };

  // ----------------------
  // RETURN CONTEXT API
  // ----------------------
  return (
    <JobContext.Provider
      value={{
        columns,
        addJob,
        deleteJob,
        moveToNext,
        moveCard,
        updateJobStages,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};
