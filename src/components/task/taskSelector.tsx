import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTaskDefinitionStore } from "@/store/taskDefinition.store";

export const TaskSelector = ({
  onSelect,
}: {
  onSelect: (type: string) => void;
}) => {
  const { definitions } = useTaskDefinitionStore();

  console.log(definitions);
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
};
