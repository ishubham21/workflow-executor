import { useEffect } from "react";
import {
  calculationTaskDefinition,
  emailTaskDefinition,
  logTaskDefinition,
  useTaskDefinitionStore,
} from "@/store/taskDefinition.store";

export const InitializeTaskDefinitions = () => {
  const { registerTaskDefinition } = useTaskDefinitionStore();

  useEffect(() => {
    registerTaskDefinition(emailTaskDefinition);
    registerTaskDefinition(logTaskDefinition);
    registerTaskDefinition(calculationTaskDefinition);
  }, [registerTaskDefinition]);

  return null;
};
