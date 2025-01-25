import WorkflowBuilder from "./components/workflow/builder";

import React from "react";
import { Routes, Route, Link } from "react-router";
import ExecutionLog from "./components/execution/executionLog";
import { InitializeTaskDefinitions } from "./components/task/initializeDefinitions";
import { Toaster } from "./components/ui/toaster";

const App: React.FC = () => {
  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gray-50">
        <InitializeTaskDefinitions />
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center sm:ml-6 sm:flex sm:space-x-8">
                  <Link to="/" className="px-3 py-2 text-sm font-medium">
                    Builder
                  </Link>
                  <Link
                    to="/execution-log"
                    className="px-3 py-2 text-sm font-medium"
                  >
                    Execution Log
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            <Route path="/" element={<WorkflowBuilder />} />
            <Route path="/execution-log" element={<ExecutionLog />} />
          </Routes>
        </main>
      </div>
    </>
  );
};

export default App;
