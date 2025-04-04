import { PerWbParameter, PerWbParameters } from "@/types/parameters";
import { useState } from "react";
import SelectFocusParam from "../stride_analysis/select-focus-param";
import Histogram from "@/components/viz/charts&graphs/histogram";
import { refinedParamNames } from "@/lib/fields";
import { filterOutZerosPerWbParameters } from "@/lib/utils";

interface Props {
  allPerWbParameters: PerWbParameters;
}
export default function ParameterDistributionHistogram({
  allPerWbParameters,
}: Props) {
  const [focusParam, setFocusParam] = useState<string>("walking_speed_mps");

  const filteredAllPerWbParameters = filterOutZerosPerWbParameters(
    allPerWbParameters,
    focusParam as keyof PerWbParameter
  );

  return (
    <>
      <div className="flex items-end gap-5">
        <SelectFocusParam
          setFocusParam={setFocusParam}
          focusParam={focusParam}
        />
      </div>

      <Histogram
        width={450}
        height={500}
        margin={{ top: 20, bottom: 65, left: 75, right: 25 }}
        data={filteredAllPerWbParameters.map((wb) => [
          "Current analysis",
          wb[focusParam as keyof PerWbParameter] as number,
        ])}
        className="self-center"
        xLabel={refinedParamNames.get(focusParam)!}
        yLabel="Frequency"
      />
    </>
  );
}
