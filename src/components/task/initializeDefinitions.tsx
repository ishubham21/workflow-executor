import { useEffect } from "react";
import {
  calculationTaskDefinition,
  emailTaskDefinition,
  logTaskDefinition,
  useTaskDefinitionStore,
} from "@/store/taskDefinition.store";

// This component helps in initializing the default task definitions: Email Task, Log Task, and Calculation Task.
export const InitializeTaskDefinitions = () => {
  const { registerTaskDefinition } = useTaskDefinitionStore();

  useEffect(() => {
    registerTaskDefinition(emailTaskDefinition);
    registerTaskDefinition(logTaskDefinition);
    registerTaskDefinition(calculationTaskDefinition);
  }, [registerTaskDefinition]);

  return null;
};
