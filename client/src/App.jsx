import { useState } from "react";
import Auth from "./Auth";
import { JobProvider } from "./JobContext";
import KanbanBoard from "./KanbanBoard";
import AddJob from "./AddJob";

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));

  if (!loggedIn) {
    return <Auth onLogin={() => setLoggedIn(true)} />;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  return (
    <JobProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        {/* Top bar */}
        <header className="flex items-center justify-between px-10 py-4 border-b border-slate-800">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              JobTrack
            </h1>
            <p className="text-xs text-slate-400">
              Track your applications like a LinkedIn pro.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <AddJob />
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md text-sm"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="px-10 py-6">
          <KanbanBoard />
        </main>
      </div>
    </JobProvider>
  );
}

export default App;

