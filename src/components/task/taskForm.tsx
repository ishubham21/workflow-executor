import React, { memo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTaskDefinitionStore } from "@/store/taskDefinition.store";

interface ITaskForm {
  type: string;
  initialConfig?: Record<string, any>;
  onSubmit: (config: Record<string, any>) => void;
}

export const TaskForm = memo(
  ({
    type,
    initialConfig = {},
    onSubmit,
  }: ITaskForm) => {
    const { definitions } = useTaskDefinitionStore();
    const taskDef = definitions[type];
    const [config, setConfig] = React.useState(initialConfig);

    if (!taskDef) return null;

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const finalConfig = {
        ...config,
        type: taskDef.type,
        name: taskDef.name,
      };

      onSubmit(finalConfig);
    };

    const handleInputChange = (key: string, value: any) => {
      setConfig((prev) => ({ ...prev, [key]: value }));
    };

    return (
      <Card className="p-4 mt-4">
        <form onSubmit={handleSubmit}>
          {Object.entries(taskDef.schema.inputs).map(([key, schema]) => (
            <div key={key} className="mb-4">
              <label className="block text-sm font-medium mb-1">{key}</label>
              {schema.type === "string" && (
                <Input
                  type="text"
                  value={config[key] || ""}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  required={schema.required}
                  placeholder={schema.default as ""}
                />
              )}
              {schema.type === "number" && (
                <Input
                  type="number"
                  value={config[key] || schema.default || ""}
                  onChange={(e) =>
                    handleInputChange(key, parseFloat(e.target.value))
                  }
                  required={schema.required}
                />
              )}
            </div>
          ))}
          <Button type="submit">Save Task</Button>
        </form>
      </Card>
    );
  }
);
