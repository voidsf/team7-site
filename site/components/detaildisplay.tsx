"use client";

import { Select, SelectItem } from "@heroui/select";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Card, CardHeader, CardBody } from "@heroui/card";

import { DeviceDetails, getLeaderboardData } from "@/database/database";
import type { Row } from "postgres"
import { getLeaderboardDataF } from "@/app/actions/useroperations";

export default function DetailDisplay({ details }: { details: any }) {
  const ref = useRef<HTMLElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [selected, setSelected] = useState(details[0]);
  const [leaderboardData, setLeaderboardData] = useState<Row[]>([]);
  
  useEffect(() => {
    // get initial dimensions
    if (ref.current) {
      setDimensions({
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight,
      });
    }

    const handleTable = async () => {
      const data = await getLeaderboardDataF();
      console.log(data);
      setLeaderboardData(data);
    }
    handleTable();
  }, []);


  useEffect(() => {

    if (ref.current) {
      if (ref.current.style.display === "flex") {
        getChart("#active-chart", dimensions.width / 2, selected);
      } else {
        getChart("#active-chart", dimensions.width, selected);
      }
    }

  }, [dimensions, selected]);


  return (
    <section ref={ref}>

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
      {/* window size dependent */}
      <section className="sm:block md:flex">

        {/* chart */}
        <Card className="m-5 sm:p-5 md:p-10">
          <CardHeader>
            Your Stats
          </CardHeader>
          <CardBody>
            <svg id="active-chart" />
          </CardBody>
        </Card>


        {/* score */}
        <Card className="m-5 sm:p-5 md:p-10">
          <CardHeader>
            Your Recycling Score
          </CardHeader>
          <CardBody className="text-center text-6xl">
            {Math.round(calculateRecyclingScore(selected) * 100)}%
          </CardBody>
        </Card>

        {/* leaderboard */}
        <Card className="m-5 sm:p-5 md:p-10" >
          <CardHeader>
            Leaderboard
          </CardHeader>
          <CardBody>
            <table>
              <tbody>
                <tr>
                  <th>Rank</th>
                  <th>Organisation</th>
                  <th>Score</th>
                </tr>

                {leaderboardData.map((row, index) => (
                  <tr key={index}>
                    <td>{index+1}</td>
                    <td>{row.name}</td>
                    <td>{row.score}</td>
                  </tr>
                ))}
              
              </tbody>
            </table>
          </CardBody>
        </Card>
      </section>

      
    </section>
  );
}

function getChart(id: string, w: number, device: DeviceDetails) {
  // clear chart
  d3.select(id).selectAll("*").remove();

  const width = w;
  const height = w / 1.6;
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

function calculateRecyclingScore(details: DeviceDetails) {
  let total = 0;
  let nr_total = 0;


  details.types.forEach((type) => {
    if (type.type_name != "Non-Recyclable") {
      total += type.count;
    } else {
      nr_total += type.count;
    }
  });

  return total / (total + nr_total);

}