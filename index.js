// margins and dimensions
const w = 800;
const h = 500;
const legendWidth = 300;
const legendHeight = 20;
const margin = { top: 50, right: 50, bottom: 50, left: 50 };
const graphWidth = w - margin.left - margin.right;
const graphHeight = h - margin.top - margin.bottom;

// main svg
const svg = d3.select(".canvas").append("svg").attr("width", w).attr("height", h);

// create graph area
const graph = svg
  .append("g")
  .attr("width", graphWidth)
  .attr("height", graphHeight)
  .attr("transform", `translate(${margin.left}, ${margin.top})`); // move it by margin sizes

// create legend area
const legend = svg
  .append("g")
  .attr("width", legendWidth)
  .attr("height", legendHeight)
  .attr("id", "legend");

// green circle and text for "no doping allegations"
legend.append("circle").attr("cx", 10).attr("cy", 10).attr("r", 6).attr("fill", "green");
legend
  .append("text")
  .attr("x", 20)
  .attr("y", 10)
  .attr("font-size", "12")
  .text("No doping allegations")
  .attr("alignment-baseline", "middle");

// orange circle and text for "doping allegations"
legend.append("circle").attr("cx", 150).attr("cy", 10).attr("r", 6).attr("fill", "orange");
legend
  .append("text")
  .attr("x", 160)
  .attr("y", 10)
  .attr("font-size", "12")
  .text("Doping allegations")
  .attr("alignment-baseline", "middle");

// center the legend by moving it to the left by half of its computed width
legend.attr(
  "transform",
  `translate(${w / 2 - legend.node().getBoundingClientRect().width / 2}, ${margin.top - 10})`
);

// add title
svg
  .append("text")
  .attr("id", "title")
  .attr("x", w / 2)
  .attr("y", 30)
  .text("Doping in Professional Bicycle Racing");

// add tooltip
const tooltip = d3.select(".canvas").append("div").attr("id", "tooltip").style("opacity", 0);

document.addEventListener("DOMContentLoaded", () => {
  fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
  )
    .then((res) => res.json())
    .then((data) => {
      const minDate = new Date(d3.min(data, (d) => d.Year) - 1, 0, 1);
      const maxDate = new Date(d3.max(data, (d) => d.Year) + 1, 0, 1);
      const minTime = new Date(
        0,
        0,
        0,
        0,
        0,
        d3.min(data, (d) => d.Seconds)
      );
      const maxTime = new Date(
        0,
        0,
        0,
        0,
        0,
        d3.max(data, (d) => d.Seconds)
      );

      // define the scales
      const xScale = d3.scaleTime().domain([minDate, maxDate]).range([0, graphWidth]);
      const yScale = d3.scaleTime().domain([minTime, maxTime]).range([0, graphHeight]);

      // add x-axis
      const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"));
      graph
        .append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${graphHeight})`)
        .call(xAxis);

      // add y-axis
      const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));
      graph.append("g").attr("id", "y-axis").call(yAxis);

      // add dots
      graph
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(new Date(d.Year, 0, 1)))
        .attr("cy", (d) => yScale(new Date(0, 0, 0, 0, 0, d.Seconds)))
        .attr("r", 5)
        .attr("class", "dot")
        .attr("fill", (d) => {
          return d.Doping ? "orange" : "green";
        })
        .attr("data-xvalue", (d) => d.Year)
        .attr("data-yvalue", (d) => new Date(0, 0, 0, 0, 0, d.Seconds))
        .on("mouseover", (d) => {
          tooltip.transition().duration(100).style("opacity", 1);
          tooltip
            .html(`${d.Name}<br>${d.Year}<br>${d.Time}<br>${d.Doping}`)
            .style("left", d3.event.pageX + 20 + "px")
            .style("top", d3.event.pageY - 20 + "px");
          tooltip.attr("data-year", d.Year);
        })
        .on("mouseout", (d) => {
          tooltip.transition().duration(100).style("opacity", 0);
        });
    });
});
