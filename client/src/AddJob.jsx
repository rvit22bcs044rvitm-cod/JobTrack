import { useState, useEffect } from "react";
import { useJobContext } from "./JobContext";

const AddJob = () => {
  const { addJob } = useJobContext();

  const [open, setOpen] = useState(false);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");

  const resetForm = () => {
    setCompany("");
    setRole("");
    setDescription("");
    setLocation("");
    setSalary("");
  };

  const submit = (e) => {
    e.preventDefault();
    addJob(company, role, description, location, salary);
    resetForm();
    setOpen(false);
  };

  // ESC closes modal
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
      >
        + Add Job
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]"
          onClick={() => setOpen(false)}
        >
          <form
            onSubmit={submit}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-700 rounded-xl px-6 py-5 w-[420px] shadow-2xl space-y-4"
          >
            <h2 className="text-lg font-semibold text-center mb-2">
              Add Job Application
            </h2>

            <input
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded text-white"
              placeholder="Company Name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />

            <input
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded text-white"
              placeholder="Job Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            />

            <textarea
              className="w-full p-2.5 h-20 bg-slate-800 border border-slate-700 rounded text-white resize-none"
              placeholder="Job Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded text-white"
              placeholder="Location (Optional)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <input
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded text-white"
              placeholder="Salary (Optional)"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                className="px-4 py-2 rounded border border-slate-600 text-white hover:bg-slate-800"
                onClick={() => {
                  resetForm();
                  setOpen(false);
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AddJob;
