export type TaskType = "email" | "log" | "calculation";

export interface BaseTask {
  id: string;
  name: string;
  description?: string;
  type: string;
  order: number;
  config: Record<string, unknown>;
}

export interface TaskDefinition {
  type: string;
  name: string;
  schema: {
    inputs: Record<
      string,
      {
        type: string;
        required: boolean;
        default?: unknown;
      }
    >;
    outputs: Record<
      string,
      {
        type: string;
      }
    >;
  };
  validator?: (config: Record<string, any>) => boolean;
}

export interface TaskDefinitionState {
  definitions: Record<string, TaskDefinition>;
  registerTaskDefinition: (definition: TaskDefinition) => void;
  removeTaskDefinition: (type: string) => void;
}

export interface TaskConfig {
  type: string;
  [key: string]: any;
}

// Email Task
export interface EmailConfig extends TaskConfig {
  type: "email";
  to: string;
  subject: string;
  body: string;
}

export interface EmailOutputs {
  sent: boolean;
}

export type LogLevel = "info" | "warn" | "error";

export interface LogConfig extends TaskConfig {
  type: "log";
  message: string;
  level: LogLevel;
}

export interface LogOutputs {
  logged: boolean;
}

export type Operation = "add" | "subtract" | "multiply" | "divide";

export interface CalculationConfig extends TaskConfig {
  type: "calculation";
  operation: Operation;
  value1: number;
  value2: number;
}

export interface CalculationOutputs {
  result: number;
}

export type TaskResult = {
  success: boolean;
  outputs: EmailOutputs | LogOutputs | CalculationOutputs;
  error?: string;
};
