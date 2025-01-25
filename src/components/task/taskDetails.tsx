import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { useTaskDefinitionStore } from "@/store/taskDefinition.store";
import { memo } from "react";

interface TaskDetailsProps {
  task: {
    id: string;
    type: string;
    name: string;
    config: Record<string, any>;
  };
  executionTime?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskDetails = memo(
  ({ task, executionTime, isOpen, onClose }: TaskDetailsProps) => {
    const { definitions } = useTaskDefinitionStore();
    const taskDef = definitions[task.type];

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{task.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Configuration</h3>
              <Card className="p-4">
                {Object.entries(task.config).map(([key, value]) => (
                  <div key={key} className="mb-2">
                    <span className="font-medium">{key}:</span>{" "}
                    {value?.toString()}
                  </div>
                ))}
              </Card>
            </div>
            {executionTime !== undefined && (
              <div>
                <h3 className="font-medium mb-2">Execution Time</h3>
                <div>{executionTime}ms</div>
              </div>
            )}
            <div>
              <h3 className="font-medium mb-2">Schema</h3>
              <Card className="p-4">
                {Object.entries(taskDef.schema.inputs).map(([key, schema]) => (
                  <div key={key} className="mb-2">
                    <div className="font-medium">{key}</div>
                    <div className="text-sm text-gray-500">
                      Type: {schema.type}
                      {schema.required && " (required)"}
                      {schema.default !== undefined &&
                        ` (default: ${schema.default})`}
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);
