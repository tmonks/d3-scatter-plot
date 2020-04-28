// margins and dimensions
const w = 800;
const h = 500;
const margin = { top: 20, right: 20, bottom: 50, left: 50 };
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

// add title
graph
  .append("text")
  .attr("id", "title")
  .attr("x", graphWidth / 2)
  .attr("y", margin.top)
  .text("Doping in Professional Bicycle Racing");


document.addEventListener("DOMContentLoaded", () => {
  fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
    .then((res) => res.json())
    .then((data => {
      const minDate = new Date(d3.min(data, d => d.Year), 0, 1);
      const maxDate = new Date(d3.max(data, d => d.Year), 0, 1);
      const minTime = new Date(0, 0, 0, 0, 0, d3.min(data, d => d.Seconds));
      const maxTime = new Date(0, 0, 0, 0, 0, d3.max(data, d => d.Seconds));

      console.log(minDate + " - " + maxDate);
      console.log(minTime + " - " + maxTime);

      // define the scales
      const xScale = d3.scaleTime().domain([minDate, maxDate]).range([0, graphWidth])
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
      graph
        .append("g")
        .attr("id", "y-axis")
        .call(yAxis);

      graph.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(new Date(d.Year, 0, 1)))
        .attr("cy", d => yScale(new Date(0, 0, 0, 0, 0, d.Seconds)))
        .attr("r", 5) 
        .attr("class", "dot")
        .attr("data-xvalue", d => d.Year)
        .attr("data-yvalue", d => new Date(0, 0, 0, 0, 0, d.Seconds));
      

    }))
})