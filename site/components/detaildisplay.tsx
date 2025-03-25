"use client";

import { Select, SelectItem } from "@heroui/select";
import { DeviceDetails } from "database";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export default function DetailDisplay({ details }: { details: any }) {
  const ref = useRef<HTMLElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (ref.current) {
      setDimensions({
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight,
      });
    }

    getChart("#my-svg", details[0]);
  }, []);

  return (
    <section ref={ref} className="sm:block md:hidden">
      {dimensions.width} {dimensions.height}
      <Select
        label="Sorter"
        placeholder="Select a sorter"
        selectionMode="single"
      >
        {details.map((device: any) => (
          <SelectItem key={device.device_id}>{device.device_id}</SelectItem>
        ))}
      </Select>
      <svg id="my-svg" />
    </section>
  );
}

function getChart(id: string, device: DeviceDetails) {
  const width = 600;
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const y = d3
    .scaleLinear()
    .domain([0, Math.max(...device.types.map((type) => type.count))])
    .range([height - margin.bottom, margin.top]);

  const x = d3
    .scaleBand()
    .domain(device.types.map((type) => type.type_name))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  const svg = d3
    .select(id)
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  svg
    .append("g")
    .attr("fill", "steelblue")
    .selectAll()
    .data(device.types)
    .join("rect")
    .attr("x", (d) => x(d.type_name) as number)
    .attr("y", (d) => y(d.count))
    .attr("height", (d) => y(0) - y(d.count))
    .attr("width", x.bandwidth());

  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0));

  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickFormat((y) => (y.toString())))
    .call((g) => g.select(".domain").remove())
    .call((g) =>
      g
        .append("text")
        .attr("x", -margin.left)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text("Quantity"),
    );

  return svg.node();
}
