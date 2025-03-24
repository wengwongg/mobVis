"use client";

import { Label } from "@/components/shadcn-components/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-components/select";
import ScatterPlot from "@/components/viz/charts&graphs/scatter-plot";
import { perWbDataFields, refinedParamNames } from "@/lib/fields";
import { createDataset } from "@/lib/utils";
import { PerWbParameter, PerWbParameters } from "@/types/parameters";
import { useState } from "react";

interface Props {
  allPerWbParameters: PerWbParameters;
}
export default function TwoParamsRelationshipScatter({
  allPerWbParameters,
}: Props) {
  const [paramX, setParamX] = useState<string>("stride_length_m");
  const [paramY, setParamY] = useState<string>("walking_speed_mps");

  return (
    <>
      <div className="flex gap-5 items-center">
        <Select onValueChange={setParamX} defaultValue={paramX}>
          <div className="flex flex-col gap-1">
            <Label>X-axis parameter</Label>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Select x-axis parameter" />
            </SelectTrigger>
          </div>
          <SelectContent>
            <SelectGroup>
              {perWbDataFields
                .filter((param) => param !== paramY)
                .map((param) => (
                  <SelectItem value={param} key={param}>
                    {refinedParamNames.get(param)}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select onValueChange={setParamY} defaultValue={paramY}>
          <div className="flex flex-col gap-1">
            <Label>Y-axis parameter</Label>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Select y-axis parameter" />
            </SelectTrigger>
          </div>
          <SelectContent>
            <SelectGroup>
              {perWbDataFields
                .filter((param) => param !== paramX)
                .map((param) => (
                  <SelectItem value={param} key={param}>
                    {refinedParamNames.get(param)}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <ScatterPlot
        height={500}
        width={1000}
        margin={{ left: 100, right: 50, bottom: 65, top: 20 }}
        data={
          createDataset(
            allPerWbParameters.map((wb) => wb[paramX as keyof PerWbParameter]),
            allPerWbParameters.map((wb) => wb[paramY as keyof PerWbParameter])
          ) as [number, number][]
        }
        xLabel={refinedParamNames.get(paramX) as string}
        yLabel={refinedParamNames.get(paramY) as string}
        type="correlation"
        className="self-center"
      />
    </>
  );
}
