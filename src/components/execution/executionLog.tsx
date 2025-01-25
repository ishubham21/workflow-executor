import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { useExecutionStore } from "@/store/execution.store";

const ExecutionLog = () => {
  const { logs, executionStatus } = useExecutionStore();

  const getLogIcon = (type: string) => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✗";
      case "info":
        return "ℹ";
      default:
        return "•";
    }
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-500";
      case "error":
        return "text-red-500";
      case "info":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Execution Log</h2>
        <span
          className={`px-2 py-1 rounded ${
            executionStatus === "running"
              ? "bg-blue-100 text-blue-700"
              : executionStatus === "completed"
              ? "bg-green-100 text-green-700"
              : executionStatus === "error"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {executionStatus.charAt(0).toUpperCase() + executionStatus.slice(1)}
        </span>
      </div>

      <ScrollArea className="h-96">
        <div className="space-y-2">
          {logs.map((log, index) => (
            <div
              key={`${log.timestamp}-${index}`}
              className={`flex items-start gap-2 p-2 rounded ${getLogColor(
                log.type
              )}`}
            >
              <span className="mt-1">{getLogIcon(log.type)}</span>
              <div>
                <div className="text-sm font-medium">{log.message}</div>
                <div className="text-xs text-gray-500">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default ExecutionLog;
