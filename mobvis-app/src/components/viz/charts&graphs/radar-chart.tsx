"use client";

import { colours, roundToNDpIfNeeded } from "@/lib/utils";
import { Record } from "@/types/parameters";
import { Margin } from "@/types/viz";
import * as d3 from "d3";
import { useRef, useEffect } from "react";

interface Props {
  width: number;
  height: number;
  radius: number;
  margin: Margin;
  data: Record[];
  // indices of records to plot shapes for
  recordsToPlot: number[];
  axes: string[];
  axesNameMapper?: Map<string, string>;
  className?: string;
}
export default function RadarChart({
  width,
  height,
  margin,
  radius,
  data,
  recordsToPlot,
  axes,
  axesNameMapper,
  className,
}: Props) {
  const ref = useRef(null);
  const totalHeight = height + margin.top + margin.bottom;
  const totalWidth = width + margin.left + margin.right;

  useEffect(() => {
    draw();
  });

  function draw() {
    const svg = d3.select(ref.current);
    // clean slate.
    svg.selectAll("*").remove();

    const plot = svg
      .attr("width", totalWidth)
      .attr("height", totalHeight)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // build a linear scale for each axis
    const y: { [key: string]: d3.ScaleLinear<number, number> } = {};
    axes.forEach((axis) => {
      const dataForAxis = data.map((d) => d[axis]);
      const max = Math.max(...dataForAxis);
      const min = Math.min(...dataForAxis);

      y[axis] = d3
        .scaleLinear()
        .domain([min - 0.1 * min, max + 0.1 * max])
        .range([0, radius]);
    });

    // draw big outer circle
    plot
      .append("circle")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("r", radius)
      .attr("opacity", 0.1);

    // draw the axes
    plot
      .selectAll("axis")
      .data(axes)
      .enter()
      .append("g")
      .each(function (axis, i) {
        // create the axis
        const d3Axis = d3.axisRight(y[axis]);
        d3.select(this).call(d3Axis);

        // manipulate the ticks before rotating whole axis
        const angle = (360 / axes.length) * i;
        const ticksTexts = d3
          .select(this)
          .selectAll(".tick text")
          .attr("transform", `rotate(${-angle})`)
          .style("text-anchor", "start");

        // move ticks to the center of the axis
        d3.select(this)
          .selectAll(".tick line")
          .attr("transform", "translate(-3,0)");

        // remove the first tick
        d3.select(this)
          .selectAll(".tick")
          .filter((_, i) => i === 0)
          .remove();

        const labels = d3
          .select(this)
          .append("text")
          .attr("text-anchor", "middle")
          .style("fill", "black")
          .style("font-weight", 600)
          .style("font-size", "0.8rem")
          .attr("transform", `translate(0, ${radius + 20}) rotate(${-angle})`)
          .text(
            (axis) => axesNameMapper?.get(axis as string) ?? (axis as string)
          );

        if (i === 1 && axes.length === 4) {
          ticksTexts.attr("transform", "");
          labels.attr(
            "transform",
            `translate(-10, ${radius + 20}) rotate(${-angle})`
          );
        }

        if (i === 3 && axes.length === 4) {
          ticksTexts.attr("transform", "translate(-32,0)");
          labels.attr(
            "transform",
            `translate(10, ${radius + 20}) rotate(${-angle})`
          );
        }
      })
      // rotate the axis around the circle
      .attr("transform", (_, i) => {
        const angle = (360 / axes.length) * i;
        return `translate(${width / 2}, ${height / 2}) rotate(${angle})`;
      });

    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("display", "none")
      .style("background", "black")
      .style("color", "white")
      .style("padding", "6px 10px")
      .style("border-radius", "6px")
      .style("font-size", "20px");

    // compute the coordinates;
    const coordinates: [number, number, string][][] = [];

    // plot the shapes for selected records FIRST
    recordsToPlot.forEach((indexOfRecord, order) => {
      const colour = colours[order % colours.length];
      const record = data[indexOfRecord];

      // compute the coordinates for each point on the axis
      // for this record.
      const coordinatesForRecord: [number, number, string][] = axes.map(
        (axis, i) => {
          const correspondingAxis = y[axis];
          const recordAxisValue = record[axis];
          const pointOnAxis = correspondingAxis(recordAxisValue);
          const angleInDeg = (360 / axes.length) * i;
          const angleInRad = (angleInDeg * Math.PI) / 180;

          // rotate the pointOnaxis by angleInRad
          const newX: number =
            -1 * pointOnAxis * Math.sin(angleInRad) + width / 2;
          const newY: number = pointOnAxis * Math.cos(angleInRad) + height / 2;
          return [newX, newY, axis];
        }
      );

      // duplicate first coordinate to close shape
      coordinatesForRecord.push(coordinatesForRecord[0]);
      // push for all coordinates.
      coordinates.push(coordinatesForRecord);

      // connect dots and plot shape
      plot
        .append("path")
        .datum(coordinatesForRecord)
        .attr("stroke", colour)
        .attr("stroke-width", 2)
        .attr("fill", colour)
        .attr("opacity", 0.4)
        .attr("d", d3.line());
    });

    // plot the points afterwards so hoverable.
    recordsToPlot.forEach((indexOfRecord, order) => {
      const colour = colours[order % colours.length];
      const record = data[indexOfRecord];

      const currentCoordinates = coordinates[order];

      plot
        .selectAll("shapePoint")
        .data(currentCoordinates)
        .enter()
        .append("circle")
        .attr("cx", (d) => d[0])
        .attr("cy", (d) => d[1])
        .attr("r", 3)
        .style("fill", colour)
        .on("mouseover", (event, d) => {
          tooltip
            .html(`${roundToNDpIfNeeded(record[d[2]], 3)}`)
            .style("display", "block")
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 20 + "px");
        })
        .on("mouseout", () => {
          tooltip.style("display", "none");
        });
    });
  }

  return (
    <svg width={width} height={height} ref={ref} className={className}></svg>
  );
}
