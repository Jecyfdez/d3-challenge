// @TODO: YOUR CODE HERE!
//create svg wrapper dimensions
var svgWidth = 960;
var svgHeight = 500;

//create chart margins
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

//create H x W of chart
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(healthData){
    console.log(healthData)
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    healthData.forEach(function(data){
        data.poverty = +data.poverty;
        data.smokes = +data.smokes;
    });
    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([5, d3.max(healthData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(healthData, d => d.smokes) + 10])
      .range([height, 0]);
    
    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", "15")
    .attr("fill", "pink")
    .attr("opacity", ".8");


        // Create abbrivation of states to show on the circle
        
        var textGroup = chartGroup
        .selectAll(".stateText")
        .data(healthData)
        .enter()
        .append("text")
        .classed("stateText", true)
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.smokes))
        .attr("dy", 3)
        .attr("font-size", "10px")
        .text(function(data) {
          return data.abbr;
        });

    // // Step 6: Initialize tool tip
    // // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br> Poverty: ${d.poverty} % <br> Smokes : ${d.smokes} `);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
      })
        // on mouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });
  
      // Label the axis
      chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 1.5))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Smokes (% of People)");
  
      chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Poverty (%)");
    }).catch(function(error) {
      console.log(error);
});


