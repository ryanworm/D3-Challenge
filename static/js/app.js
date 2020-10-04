// starting by setting up parameters for the graph

// returning a js object parsing index.html id= scatter"width" for int and storing 
// as variable

var width = parseInt(d3.select("#scatter").style("width"));

// setting the height parameter

var height = width - width / 3.5;

// creating margins for the graph
var margin = 25;

// space for placing words
var labelArea = 100;

// padding for the text at the bottom and left axes
var txtPadBot = 40;
var txtPadLeft = 40;

// creating the 'canvas' for visualizing the graph
// starting with selecting the div id="scatter" (where graph will pop)

var svg = d3.select("#scatter")
// adding the svg element
  .append("svg")
  // creating a 'width' attribute == width specified earlier
  .attr("width", width)
  // adding heigh attribute
  .attr("height", height)
  // identifying this object under the 'chart' class 
  .attr("class", "chart");

// now we will specify the circle radius that will be our markers

var circRad;

function detCircRad() {
// this function will seth the circle radius to 10. 
    circRad = 10;
}
detCircRad();

// now that we have the dimensions of our chart area and markers established
// we can start creating labels for our chart

// we are going to start by creating group for the x-axis labels as there will be 
// multiple x-axis for this chart

svg.append("g").attr("class", "xText");

// we can set xText to a variable for simplicty 

var xText = d3.select(".xText");

// next we add a transform property placing it at the bottom of the chart. This allows us 
// to move it when the width changes 
function xRefresh() {
  //setting the parameters of the translation
  xText.attr(
    "transform",
    "translate(" +
      ((width - labelArea) / 2 + labelArea) +
      ", " +
      (height - margin - txtPadBot) +
      ")"
  );
}
// calling the function to refresh the x axis labels
xRefresh();

// appending the poverty label to the xText group class
xText
  .append("text")
  // specifying the 'y' coordinate (spacing out labels)
  .attr("y", -26)
  // identifying what the data is 
  .attr("data-name", "poverty")
  // identifying which axis will be on
  .attr("data-axis", "x")
  // setting an active or inactive class 
  .attr("class", "aText active x")
  // inputing the text value for the label
  .text("In Poverty (%)");

// appending the age label to the xText group class
xText
  .append("text")
  .attr("y", 0)
  .attr("data-name", "age")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Median Age");

xText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "income")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Median Household Income");

var leftTextX = margin + txtPadLeft;
var leftTextY = (height + labelArea) / 2 - labelArea;

// creating another group class for the y axis label values
svg.append("g").attr("class", "yText");

var yText = d3.select(".yText");

function yRefresh() {
  yText.attr(
    "transform",
    "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
  );
}
yRefresh();

// appending text attributes to our y axis labels starting with obesity
yText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "obesity")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("Obesity (%)");

// then appending healthcare access label
yText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "healthcare")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Limited Healthcare Access(%)");

//  and finally smoker label
yText
  .append("text")
  .attr("x", 0)
  .attr("data-name", "smokes")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Smoker (%)");

//   with the x and y axis labeled we now import in our csv file..
d3.csv("static/data/data.csv").then(function(data) {
// creating a promise to execute function when the data is returned
visPlot(data);
});

// creating the visPlot function to visualize our data

function visPlot(theData) {
// we are now going to set variables to store the data that will populate the 
    // x and y axis, with the column labels from 'data.csv'
  var xComorbidity = "poverty";
  var yComorbidity = "obesity";

    // to limit redundancy we are going to store the min/max values for the x/y axis as 
    // empty variables   
    var xMin;
    var xMax;
    var yMin;
    var yMax;

  // creating the rules for tool tip 
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([50, -50])
    .html(function(d) {
       // storing the x key values
      var xKeyValue;
     // retrieving the state initials
      var theState = "<div>" + d.state + "</div>";
      // storing y values 
      var yKeyValue = "<div>" + yComorbidity + ": " + d[yComorbidity] + "%</div>";
      // If the x key is poverty
      if (xComorbidity === "poverty") {
        // Grab the x key and a version of the value formatted to show percentage
        xKeyValue = "<div>" + xComorbidity + ": " + d[xComorbidity] + "%</div>";
      }
      else {
        // Otherwise
        // Grab the x key and a version of the value formatted to include commas after every third digit.
        xKeyValue = "<div>" +
          xComorbidity +
          ": " +
          parseFloat(d[xComorbidity]).toLocaleString("en") +
          "</div>";
      }
      // Display what we capture.
      return theState + xKeyValue + yKeyValue;
    });
  // Call the toolTip function.
  svg.call(toolTip);

// getting the min and max values for our x values

function xMinMax() {
    // min returns the minimum value from the data set
    xMin = d3.min(theData, function(d) {
      return parseFloat(d[xComorbidity]) * 0.90;
    });

    // max will return the largest value from the data set 
    xMax = d3.max(theData, function(d) {
      return parseFloat(d[xComorbidity]) * 1.10;
    });
  }

  // getting the min and max values for our y values
  function yMinMax() {
    //  // min returns the minimum value from the data set
    yMin = d3.min(theData, function(d) {
      return parseFloat(d[yComorbidity]) * 0.90;
    });

    //max will return the largest value from the data set 
    yMax = d3.max(theData, function(d) {
      return parseFloat(d[yComorbidity]) * 1.10;
    });
  }

  // switching the currently active label to inactive
  function labelSwitch(axis, clickedText) {
    d3
      .selectAll(".aText")
      .filter("." + axis)
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);

    // activating the clicked label
    clickedText.classed("inactive", false).classed("active", true);
  }

  // calling x and y MinMax functions to establish the domain for the axis
  xMinMax();
  yMinMax();

//   now that we have the min/max values for our axis we can create the scales. 
//  when placing our circles we need to account for the margins and padding. We do
//  this by including those parameters in the range. 
  var xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin + labelArea, width - margin]);
  var yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range([height - margin - labelArea, margin]);

 // setting the x and y axis with their respective scale values
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

//   creating the ticks for x and y axis
  function tickCount() {
      xAxis.ticks(10);
      yAxis.ticks(10);
  }
  tickCount();

// now we create another group element to include the labels and ticks 
// with the axis when we call them
  svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (height - margin - labelArea) + ")");
  svg
    .append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin + labelArea) + ", 0)");

//   creating a group for the markers with their respective labels
  var circMarker = svg.selectAll("g circMarker").data(theData).enter();

  // now we add circles for each row of the data set in each category
  circMarker
    .append("circle")
    .attr("cx", function(d) {
      return xScale(d[xComorbidity]);
    })
    .attr("cy", function(d) {
      return yScale(d[yComorbidity]);
    })
    .attr("r", circRad)
    .attr("class", function(d) {
      return "stateCircle " + d.abbr;
    })

    // creating the hover function when user places cursor over text
    .on("mouseover", function(d) {
      toolTip.show(d, this);
      // creating highlight
      d3.select(this).style("stroke", "#323232");
    })
    // creating function for when user moves cursor off text
    .on("mouseout", function(d) {
      toolTip.hide(d);
      // removing highlight
      d3.select(this).style("stroke", "#e3e3e3");
    });

  // creating the labels to match the markers that we have created for our chart
  circMarker
    // appending text property to the marker
  .append("text")
    // appending the abbreviation as the text value
    .text(function(d) {
      return d.abbr;
    })
    // placing the text on the chart
    .attr("dx", function(d) {
      return xScale(d[xComorbidity]);
    })
    .attr("dy", function(d) {
      //moving the text into the middle of the circle (moving it up by 1/3 of the
    //   height of the circle)
      return yScale(d[yComorbidity]) + circRad / 3;
    })
    .attr("font-size", circRad)
    .attr("class", "stateText")
    // again creating rules for moving mouse cursor on and off.
       .on("mouseover", function(d) {
      // Show the tooltip
      toolTip.show(d);
    //  highlighting the marker's border
      d3.select("." + d.abbr).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      toolTip.hide(d);
      d3.select("." + d.abbr).style("stroke", "#e3e3e3");
    });

  // selecting the axis text groups and creating a click event
  d3.selectAll(".aText").on("click", function() {
    var self = d3.select(this);
    if (self.classed("inactive")) {
      var axis = self.attr("data-axis");
      var name = self.attr("data-name");

      // if x is the saved axis
      if (axis === "x") {
        // Make the comorbidity == name 
        xComorbidity = name;

    //    call MinMax function to be able to create domain for scale
        xMinMax();

        // updating domain for x
        xScale.domain([xMin, xMax]);

        // updating the xaxis with transition = 300ms
        svg.select(".xAxis").transition().duration(300).call(xAxis);

        // now that the axis has changed we ned to update the marker location
        d3.selectAll("circle").each(function() {
          // creating a transition for each of the markers as we move them
          d3
            .select(this)
            .transition()
            .attr("cx", function(d) {
              return xScale(d[xComorbidity]);
            })
            .duration(300);
        });

        // associated text also needs to be moved with the markers.
        d3.selectAll(".stateText").each(function() {
          // need to give them the same transition as the markers
          d3
            .select(this)
            .transition()
            .attr("dx", function(d) {
              return xScale(d[xComorbidity]);
            })
            .duration(300);
        });

        // now we need to change the class status of the label that was just clicked
        labelSwitch(axis, self);
      }
      else {
        // doing the same for y if it is the saved axis
        // Make curY the same as the data name.
        yComorbidity = name;

        // updating the min and max of the y-axis.
        yMinMax();

        // updating the domain of y
        yScale.domain([yMin, yMax]);

        // updating the y axis
        svg.select(".yAxis").transition().duration(300).call(yAxis);

        // now that the axis have been uppdated we also need to update the markers
        d3.selectAll("circle").each(function() {
          // we are adding a transition to create a more dynamic chart 
          d3
            .select(this)
            .transition()
            .attr("cy", function(d) {
              return yScale(d[yComorbidity]);
            })
            .duration(300);
        });

        // updating the text labels
        d3.selectAll(".stateText").each(function() {
          // giving the text the same transition as the label and axis
          d3
            .select(this)
            .transition()
            .attr("dy", function(d) {
              return yScale(d[yComorbidity]) + circRad / 3;
            })
            .duration(300);
        });

        // changing the classes of the label active/inactive
        labelSwitch(axis, self);
      }
    }
  })};