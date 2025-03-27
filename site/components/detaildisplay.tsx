"use client";

import { Select, SelectItem } from "@heroui/select";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

import { DeviceDetails } from "@/database/database";

export default function DetailDisplay({ details }: { details: any }) {
  const ref = useRef<HTMLElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [selected, setSelected] = useState(details[0]);

  useEffect(() => {
    if (selected) {
      console.log(`Running effect with device: ${selected.device_id}`);
      if (ref.current) {
        setDimensions({
          width: ref.current.offsetWidth,
          height: ref.current.offsetHeight,
        });
      }

      getChart("#active-chart", selected);
    }
  }, [selected]);

  return (
    <section ref={ref} className="sm:block">
      {dimensions.width} {dimensions.height}
      <Select
        defaultSelectedKeys={[details[0].device_id]}
        label="Sorter"
        placeholder="Select a sorter"
        selectionMode="single"
        onChange={(e) => {
          let val = e.target.value;
          let device = details.find((device: any) => device.device_id === val);
          
          setSelected(device);
        }}
      >
        {details.map((device: any) => (
          <SelectItem key={device.device_id}>{device.device_id}</SelectItem>
        ))}
      </Select>
      <svg id="active-chart" />
    </section>
  );
}

function getChart(id: string, device: DeviceDetails) {
  d3.select(id).selectAll("*").remove();

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
    .call(d3.axisLeft(y).tickFormat((y) => y.toString()))
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
