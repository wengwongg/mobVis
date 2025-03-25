"use client";

import HyperLink from "@/components/custom/hyperlink";
import InputsDialog from "@/components/page-specific/inputs/inputs-dialog";
import TableOfPerStrideParameters from "@/components/page-specific/stride_analysis/table-of-per-stride-parameters";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/shadcn-components/card";
import VizCardDescription from "@/components/viz/viz-card-description";
import VizCardTitle from "@/components/viz/viz-card-title";
import { getAndParseStorageItem } from "@/lib/utils";
import { InputsJson, PerStrideParameters } from "@/types/parameters";
import { useEffect, useState } from "react";

export default function StrideAnalysis() {
  const [inputs, setInputs] = useState<InputsJson | null>(null);
  const [perStrideParameters, setPerStrideParameters] =
    useState<PerStrideParameters | null>(null);

  useEffect(() => {
    setInputs(getAndParseStorageItem("inputs"));
    setPerStrideParameters(getAndParseStorageItem("per_stride_parameters"));
  }, []);

  // inputs dialog
  const [isInputDialogOpen, setIsInputDialogOpen] = useState(false);

  if (inputs && perStrideParameters) {
    return (
      <div>
        <div className="p-10 text-white">
          <h1 className="text-4xl font-bold mb-2">🦶 Stride level analysis</h1>
          <p>
            Walking bouts are made up of left and right strides. Visualisations
            for per walking bout gait parameters extracted from{" "}
            <span className="font-semibold">{inputs.name}</span>.{" "}
            <HyperLink url="" onClick={() => setIsInputDialogOpen(true)}>
              Click here
            </HyperLink>{" "}
            to see the inputs you&apos;ve submitted.
          </p>
          <InputsDialog
            inputs={inputs}
            isInputDialogOpen={isInputDialogOpen}
            setIsInputDialogOpen={setIsInputDialogOpen}
          />
        </div>
        <div className="flex justify-center mb-10">
          <div className="flex flex-col gap-5 w-full max-w-[1300px] min-w-[1150px] mx-6">
            <Card>
              <CardHeader>
                <VizCardTitle>
                  Table of all parameters of each stride under each walking bout
                </VizCardTitle>
                <VizCardDescription
                  mainDescription={
                    "Tabular view of the exact figures of each gait parameter for each identified stride of each identified walking bout in the CSV data you uploaded. Use this table to assist your decision in picking what walking bouts to visualise for, in the visualisations below. Drag rows around to compare selected records side by side. Click the left and right buttons to view the strides of a desired walking bout. You can also set the number of stride records displayed with the input textbox. Please note that if a value is 0, it means that the value could not be calculated."
                  }
                  exampleAnalysis="which walking bout contained the stride with the largest length?"
                />
              </CardHeader>
              <CardContent className="space-y-5">
                <TableOfPerStrideParameters
                  allPerStrideParameters={perStrideParameters}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  } else {
    // TODO: amend this.
    return "Loading...";
  }
}
