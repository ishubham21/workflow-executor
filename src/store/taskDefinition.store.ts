import { create } from "zustand";
import { TaskDefinition, TaskDefinitionState } from "../types/task.types";

export const useTaskDefinitionStore = create<TaskDefinitionState>((set) => ({
  definitions: {},
  registerTaskDefinition: (definition) =>
    set((state) => ({
      definitions: {
        ...state.definitions,
        [definition.type]: definition,
      },
    })),
  removeTaskDefinition: (type) =>
    set((state) => {
      const { [type]: _, ...rest } = state.definitions;
      return { definitions: rest };
    }),
}));

// Default task definitions
export const emailTaskDefinition: TaskDefinition = {
  type: "email",
  name: "Send Email",
  schema: {
    inputs: {
      to: {
        type: "string",
        required: true,
      },
      subject: {
        type: "string",
        required: true,
      },
      body: {
        type: "string",
        required: true,
      },
    },
    outputs: {
      sent: {
        type: "boolean",
      },
    },
  },
  validator: (config) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      emailRegex.test(config.to) &&
      config.subject?.length > 0 &&
      config.body?.length > 0
    );
  },
};

export const logTaskDefinition: TaskDefinition = {
  type: "log",
  name: "Log Message",
  schema: {
    inputs: {
      message: {
        type: "string",
        required: true,
      },
      level: {
        type: "string",
        required: true,
        default: "info",
      },
    },
    outputs: {
      logged: {
        type: "boolean",
      },
    },
  },
  validator: (config) => {
    return config.message?.length > 0;
  },
};

export const calculationTaskDefinition: TaskDefinition = {
  type: "calculation",
  name: "Perform Calculation",
  schema: {
    inputs: {
      operation: {
        type: "string",
        required: true,
        default: "add",
      },
      value1: {
        type: "number",
        required: true,
      },
      value2: {
        type: "number",
        required: true,
      },
    },
    outputs: {
      result: {
        type: "number",
      },
    },
  },
  validator: (config) => {
    return (
      ["add", "subtract", "multiply", "divide"].includes(config.operation) &&
      typeof config.value1 === "number" &&
      typeof config.value2 === "number" &&
      !(config.operation === "divide" && config.value2 === 0)
    );
  },
};
