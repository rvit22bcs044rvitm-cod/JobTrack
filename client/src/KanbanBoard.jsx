import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import { useJobContext } from "./JobContext";

const KanbanBoard = () => {
  const {
    columns,
    moveCard,
    updateJobStages,
    deleteJob,
    moveToNext,
  } = useJobContext();

  const [stageJob, setStageJob] = useState(null);
  const [stageColumn, setStageColumn] = useState(null);
  const [stages, setStages] = useState([]);

  const [jobStatus, setJobStatus] = useState("Accepted");
  const [offerStatus, setOfferStatus] = useState("Received");

  const [stageOpen, setStageOpen] = useState(false);
  const [detailJob, setDetailJob] = useState(null);

  const onDragEnd = (result) => {
    moveCard(result.source, result.destination);
  };

  // OPEN STAGES POPUP
  const openStages = (job, colId) => {
    setStageJob(job);
    setStageColumn(colId);

    if (colId === "interview") {
      setStages(job.stages || []);
    } else if (colId === "rejected") {
      setJobStatus(job.stages?.[0]?.name || "Accepted");
    } else if (colId === "offer") {
      setOfferStatus(job.stages?.[0]?.name || "Received");
    }

    setStageOpen(true);
  };

  const addStageRow = () => {
    setStages([...stages, { name: "", status: "upcoming" }]);
  };

  const updateStageField = (index, field, value) => {
    const copy = [...stages];
    copy[index][field] = value;
    setStages(copy);
  };

  const removeStage = (index) => {
    const copy = [...stages];
    copy.splice(index, 1);
    setStages(copy);
  };

  const saveStages = async () => {
    if (!stageJob) return;

    let payload = [];

    if (stageColumn === "interview") {
      payload = stages.filter((s) => s.name.trim());
    } else if (stageColumn === "rejected") {
      payload = [{ name: jobStatus, status: "completed" }];
    } else if (stageColumn === "offer") {
      payload = [{ name: offerStatus, status: "completed" }];
    }

    await updateJobStages(stageJob.id, payload);
    setStageOpen(false);
  };

  // OPEN DETAILS POPUP
  const openDetails = (job) => {
    setDetailJob(job);

    if (job.status === "interview") {
      setStages(job.stages || []);
    } else if (job.status === "rejected") {
      setJobStatus(job.stages?.[0]?.name || "Accepted");
    } else if (job.status === "offer") {
      setOfferStatus(job.stages?.[0]?.name || "Received");
    }
  };

  const closeDetails = () => setDetailJob(null);

  const saveDetailStages = async () => {
    if (!detailJob) return;

    let payload = [];
    const col = detailJob.status;

    if (col === "interview") {
      payload = stages.filter((s) => s.name.trim());
    } else if (col === "rejected") {
      payload = [{ name: jobStatus, status: "completed" }];
    } else if (col === "offer") {
      payload = [{ name: offerStatus, status: "completed" }];
    }

    await updateJobStages(detailJob.id, payload);
    setDetailJob({ ...detailJob, stages: payload });
  };

  return (
    <>
      {/* BOARD */}
      <div className="max-w-6xl mx-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 py-6 overflow-x-auto">
            {Object.entries(columns).map(([colId, col]) => (
              <div
                key={colId}
                className="flex-1 min-w-[260px] bg-slate-900 border border-slate-800 rounded-lg px-4 py-3"
              >
                <h2 className="text-xs font-bold tracking-wide text-slate-300 mb-3">
                  {col.title}
                </h2>

                <Droppable droppableId={colId}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-3 min-h-[80px]"
                    >
                      {col.items.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(dragProps) => (
                            <div
                              ref={dragProps.innerRef}
                              {...dragProps.draggableProps}
                              {...dragProps.dragHandleProps}
                              className="bg-slate-800 border border-slate-700 rounded-lg p-3 relative cursor-pointer hover:shadow-md"
                              onClick={() => openDetails(item)}
                            >
                              {/* DELETE BUTTON */}
                              <button
                                className="absolute top-2 right-2 text-slate-500 hover:text-red-400 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteJob(item.id);
                                }}
                              >
                                ✕
                              </button>

                              {/* CARD CONTENT */}
                              <div className="space-y-1 text-sm">
                                <div className="font-semibold text-slate-100">
                                  {item.company}
                                </div>

                                <div className="text-slate-400 text-xs">
                                  Role: {item.role}
                                </div>

                                {/* OFFER STATUS ON CARD */}
                                {colId === "offer" &&
                                  item.stages?.length > 0 && (
                                    <span
                                      className={
                                        item.stages[0].name === "Received"
                                          ? "text-emerald-400 text-xs font-semibold"
                                          : "text-red-400 text-xs font-semibold"
                                      }
                                    >
                                      {item.stages[0].name}
                                    </span>
                                  )}

                                {item.description && (
                                  <p className="text-slate-400 text-xs line-clamp-2">
                                    {item.description}
                                  </p>
                                )}
                              </div>

                              {/* BUTTONS */}
                              <div className="flex justify-between mt-3 text-[11px]">
                                {/* STAGES BUTTON */}
                                {colId !== "applied" && (
                                  <button
                                    className="px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-500"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openStages(item, colId);
                                    }}
                                  >
                                    Stages
                                  </button>
                                )}

                                {/* NEXT BUTTON (HIDE IN OFFER COLUMN) */}
                                {colId !== "offer" && (
                                  <button
                                    className="px-2 py-1 rounded bg-green-600 text-white hover:bg-green-500"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      moveToNext(item);
                                    }}
                                  >
                                    Next →
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* ============================
        STAGES POPUP
      ============================== */}
      {stageOpen && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]"
          onClick={() => setStageOpen(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-xl px-6 py-5 w-[420px] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-semibold text-center mb-4">
              {stageColumn === "interview" && "Process Stages"}
              {stageColumn === "rejected" && "Job Status"}
              {stageColumn === "offer" && "Offer Status"} – {stageJob?.company}
            </h2>

            {/* PROCESS */}
            {stageColumn === "interview" && (
              <>
                <div className="space-y-2 max-h-64 overflow-y-auto mb-3">
                  {stages.map((stage, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        className="flex-1 p-2 bg-slate-800 border border-slate-700 rounded text-white"
                        placeholder="Stage (OA, Tech 1, HR...)"
                        value={stage.name}
                        onChange={(e) =>
                          updateStageField(index, "name", e.target.value)
                        }
                      />
                      <select
                        className="p-2 bg-slate-800 border border-slate-700 rounded text-white text-xs"
                        value={stage.status}
                        onChange={(e) =>
                          updateStageField(index, "status", e.target.value)
                        }
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="completed">Completed</option>
                      </select>
                      <button
                        className="text-red-400 text-xs"
                        onClick={() => removeStage(index)}
                      >
                        Rem
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  className="px-3 py-2 rounded bg-slate-800 text-white border border-slate-600 text-xs"
                  onClick={addStageRow}
                >
                  + Add Stage
                </button>
              </>
            )}

            {/* JOB STATUS */}
            {stageColumn === "rejected" && (
              <select
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-white"
                value={jobStatus}
                onChange={(e) => setJobStatus(e.target.value)}
              >
                <option>Accepted</option>
                <option>Rejected</option>
                <option>On Hold</option>
              </select>
            )}

            {/* OFFER */}
            {stageColumn === "offer" && (
              <select
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-white"
                value={offerStatus}
                onChange={(e) => setOfferStatus(e.target.value)}
              >
                <option>Received</option>
                <option>Not received</option>
              </select>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-3 py-2 rounded bg-gray-700 text-white text-xs"
                onClick={() => setStageOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-2 rounded bg-blue-600 text-white text-xs hover:bg-blue-500"
                onClick={saveStages}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================
          FULL EDITABLE DETAILS POPUP
      ============================== */}
      {detailJob && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]"
          onClick={closeDetails}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-xl px-6 py-5 w-[520px] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex justify-between mb-3">
              <h2 className="text-lg font-semibold">{detailJob.company}</h2>
              <button
                className="text-slate-400 hover:text-white"
                onClick={closeDetails}
              >
                ✕
              </button>
            </div>

            {/* EDITABLE FIELDS */}
            <div className="space-y-3">
              <input
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-white"
                value={detailJob.company}
                onChange={(e) =>
                  setDetailJob({ ...detailJob, company: e.target.value })
                }
              />

              <input
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-white"
                value={detailJob.role}
                onChange={(e) =>
                  setDetailJob({ ...detailJob, role: e.target.value })
                }
              />

              <input
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-white"
                placeholder="Location"
                value={detailJob.location || ""}
                onChange={(e) =>
                  setDetailJob({ ...detailJob, location: e.target.value })
                }
              />

              <input
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-white"
                placeholder="Salary"
                value={detailJob.salary || ""}
                onChange={(e) =>
                  setDetailJob({ ...detailJob, salary: e.target.value })
                }
              />

              <textarea
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-white h-20 resize-none"
                value={detailJob.description || ""}
                onChange={(e) =>
                  setDetailJob({ ...detailJob, description: e.target.value })
                }
              />
            </div>

            {/* EDITABLE STAGES */}
            <div className="mt-5">
              <h3 className="text-xs font-bold text-slate-300 mb-2">
                Stages ({detailJob.status.toUpperCase()})
              </h3>

              {/* INTERVIEW */}
              {detailJob.status === "interview" && (
                <>
                  <div className="space-y-2 max-h-64 overflow-y-auto mb-3">
                    {stages.map((stage, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input
                          className="flex-1 p-2 bg-slate-800 border border-slate-700 rounded text-white"
                          value={stage.name}
                          onChange={(e) =>
                            updateStageField(index, "name", e.target.value)
                          }
                        />
                        <select
                          className="p-2 bg-slate-800 border border-slate-700 rounded text-white text-xs"
                          value={stage.status}
                          onChange={(e) =>
                            updateStageField(index, "status", e.target.value)
                          }
                        >
                          <option value="upcoming">Upcoming</option>
                          <option value="completed">Completed</option>
                        </select>
                        <button
                          className="text-red-400 text-xs"
                          onClick={() => removeStage(index)}
                        >
                          Rem
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    className="px-3 py-2 rounded bg-slate-800 text-white border border-slate-600 text-xs"
                    onClick={addStageRow}
                  >
                    + Add Stage
                  </button>
                </>
              )}

              {/* JOB STATUS */}
              {detailJob.status === "rejected" && (
                <select
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-white"
                  value={jobStatus}
                  onChange={(e) => setJobStatus(e.target.value)}
                >
                  <option>Accepted</option>
                  <option>Rejected</option>
                  <option>On Hold</option>
                </select>
              )}

              {/* OFFER */}
              {detailJob.status === "offer" && (
                <select
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-white"
                  value={offerStatus}
                  onChange={(e) => setOfferStatus(e.target.value)}
                >
                  <option>Received</option>
                  <option>Not received</option>
                </select>
              )}
            </div>

            {/* SAVE BUTTON */}
            <div className="flex justify-end mt-5">
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white text-xs hover:bg-blue-500"
                onClick={saveDetailStages}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KanbanBoard;
