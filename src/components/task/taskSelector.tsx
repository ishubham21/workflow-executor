import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTaskDefinitionStore } from "@/store/taskDefinition.store";
import { memo } from "react";

interface ITaskSelector {
  onSelect: (type: string) => void;
}

export const TaskSelector = memo(({ onSelect }: ITaskSelector) => {
  const { definitions } = useTaskDefinitionStore();
  return (
    <Select onValueChange={onSelect}>
      <SelectTrigger>
        <SelectValue placeholder="Select task type" />
      </SelectTrigger>
      <SelectContent>
        {Object.values(definitions).map((def) => (
          <SelectItem key={def.type} value={def.type}>
            {def.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
});
