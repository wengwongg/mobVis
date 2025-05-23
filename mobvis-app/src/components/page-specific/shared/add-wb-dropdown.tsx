import { Button } from "@/components/shadcn-components/button";
import { Label } from "@/components/shadcn-components/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-components/select";
import { SetStateAction, useState } from "react";

interface Props {
  currentWbIds: number[];
  allWbIds: number[];
  maxWbs: number;
  maxHit?: () => void;
  setCurrentWbIds: (value: SetStateAction<number[]>) => void;
  disabled?: boolean;
}
export default function AddWbDropdown({
  currentWbIds,
  allWbIds,
  maxWbs,
  maxHit,
  setCurrentWbIds,
  disabled = false,
}: Props) {
  const [selectedWb, setSelectedWb] = useState<number | undefined>(undefined);

  return (
    <div className="flex gap-3 items-end">
      <Select
        onValueChange={(val: string) => setSelectedWb(Number(val))}
        defaultValue={selectedWb?.toString()}
      >
        <div className="flex flex-col gap-1">
          <Label>Walking bout</Label>
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Select a walking bout to plot">
              {selectedWb !== undefined
                ? selectedWb.toString()
                : "Select a walking bout to plot"}
            </SelectValue>
          </SelectTrigger>
        </div>
        <SelectContent>
          <SelectGroup>
            {allWbIds
              .filter((id) => !currentWbIds.includes(id))
              .map((id) => (
                <SelectItem value={id.toString()} key={id}>
                  {id}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button
        variant="default"
        type="button"
        onClick={() => {
          if (selectedWb !== undefined) {
            if (currentWbIds.length === maxWbs && maxHit !== undefined) {
              maxHit();
              return;
            }
            setCurrentWbIds((prev) => [...prev, selectedWb]);
            setSelectedWb(undefined);
          }
        }}
        className="self-end"
        disabled={disabled}
      >
        Add
      </Button>
    </div>
  );
}
