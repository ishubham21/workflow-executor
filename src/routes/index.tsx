import ExecutionLog from "@/components/execution/executionLog";
import WorkflowBuilder from "@/components/workflow/workflowBuilder";
import { memo } from "react";
import { Routes, Route } from "react-router";

/**
 * Main application router
 */
export const AppRouter = memo(() => {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Routes>
        <Route path="/" element={<WorkflowBuilder />} />
        <Route path="/execution-log" element={<ExecutionLog />} />
      </Routes>
    </main>
  );
});
