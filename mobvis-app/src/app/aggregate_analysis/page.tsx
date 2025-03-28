"use client";

import HyperLink from "@/components/custom/hyperlink";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/shadcn-components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn-components/table";
import StatCard from "@/components/viz/stat-card";
import VizCardDescription from "@/components/viz/viz-card-description";
import VizCardTitle from "@/components/viz/viz-card-title";
import { refinedParamNames } from "@/lib/fields";
import {
  convertHoursToMinutesAndTrunc,
  getAndParseStorageItem,
  roundToNDpIfNeeded,
} from "@/lib/utils";
import {
  AggregateParameters,
  Inputs,
  PerWbParameters,
} from "@/types/parameters";
import { useEffect, useState } from "react";

export default function AggregateAnalysis() {
  // need to ensure inputs are being set with localStorage on the client side.
  const [inputs, setInputs] = useState<Inputs | null>(null);
  const [aggregateParameters, setAggregateParameters] =
    useState<AggregateParameters | null>(null);
  const [perWbParameters, setPerWbParameters] =
    useState<PerWbParameters | null>(null);
  const [totalWalkingDurationMins, setTotalWalkingDurationMins] = useState<
    number | null
  >(null);

  useEffect(() => {
    setInputs(getAndParseStorageItem("inputs"));
    setAggregateParameters(getAndParseStorageItem("aggregate_parameters"));
    setPerWbParameters(getAndParseStorageItem("per_wb_parameters"));
    setTotalWalkingDurationMins(
      convertHoursToMinutesAndTrunc(
        Number(localStorage.getItem("total_walking_duration"))
      )
    );
  }, []);

  if (
    inputs &&
    aggregateParameters &&
    perWbParameters &&
    totalWalkingDurationMins
  ) {
    return (
      <div>
        <div className="p-10 text-white">
          <h1 className="text-4xl font-bold mb-2">
            📦 Aggregate-level analysis
          </h1>
          <p>
            Visualisations for aggregate gait parameters extracted from{" "}
            <span className="font-semibold">{inputs.name}</span>.{" "}
            <HyperLink url="">Click here</HyperLink> to see the inputs
            you&apos;ve submitted.
          </p>
        </div>
        <div className="flex justify-center mb-10">
          <div className="flex flex-col gap-5 w-[850px]">
            <div className="flex justify-center gap-5">
              <StatCard
                name="Total detected walking bouts"
                value={perWbParameters.length}
              />
              <StatCard
                name="Total walking duration"
                value={
                  totalWalkingDurationMins +
                  " min" +
                  (totalWalkingDurationMins > 1 ? "s" : "")
                }
              />
            </div>
            <Card>
              <CardHeader>
                <VizCardTitle>Table of all aggregate parameters</VizCardTitle>
                <VizCardDescription
                  mainDescription={
                    "Tabular view of the exact figures of the aggregate parameters (average, maximum, minimum and variance) for each gait parameter."
                  }
                  exampleAnalysis="what is the precise walking speed that the patient walks at on average?"
                />
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parameter</TableHead>
                      <TableHead>Average</TableHead>
                      <TableHead>Maximum</TableHead>
                      <TableHead>Minimum</TableHead>
                      <TableHead>Variance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {aggregateParameters.map((param) => (
                      <TableRow key={param.param}>
                        <TableCell>
                          {refinedParamNames.get(param.param) ?? param.param}
                        </TableCell>
                        <TableCell>
                          {roundToNDpIfNeeded(param.avg, 5)}
                        </TableCell>
                        <TableCell>
                          {roundToNDpIfNeeded(param.max, 5)}
                        </TableCell>
                        <TableCell>
                          {roundToNDpIfNeeded(param.min, 5)}
                        </TableCell>
                        <TableCell>
                          {roundToNDpIfNeeded(param.var, 5)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            {/* 
              <Card>
                <CardHeader>
                  <VizCardTitle>Overall gait performance</VizCardTitle>
                  <VizCardDescription
                    mainDescription={
                      "Radar chart with each gait parameter as an axis. For each gait parameter, its average value across all walking bouts is plotted."
                    }
                    exampleAnalysis="how does this patient's gait this time around compare against the last assessment?"
                  />
                </CardHeader>
                <CardContent></CardContent>
              </Card>
           */}
          </div>
        </div>
      </div>
    );
  } else {
    // TODO: render not found form if no inputs submitted.
    return <div>No data can be found...</div>;
  }
}
