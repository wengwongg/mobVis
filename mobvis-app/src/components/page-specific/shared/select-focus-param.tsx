import { Label } from "@/components/shadcn-components/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-components/select";
import { refinedParamNames } from "@/lib/fields";

interface Props {
  setFocusParam: (param: string) => void;
  focusParam: string;
  paramFields: string[];
}
export default function SelectFocusParam({
  setFocusParam,
  focusParam,
  paramFields,
}: Props) {
  return (
    <Select onValueChange={setFocusParam} defaultValue={focusParam}>
      <div className="flex flex-col gap-1">
        <Label>Focus parameter</Label>
        <SelectTrigger className="w-[240px]">
          <SelectValue placeholder="Select focus parameter" />
        </SelectTrigger>
      </div>
      <SelectContent>
        <SelectGroup>
          {paramFields.map((param) => (
            <SelectItem value={param} key={param}>
              {refinedParamNames.get(param)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
