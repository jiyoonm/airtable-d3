//Download Airtable Data
var data1 = [];

var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keyJvXFNWQIMm9EA2'}).base('appmrMX9i7Il9Ewtq');
  base('NTA').select({
    view: "Grid view",
  }).eachPage(function page(records, fetchNextPage) {
      records.forEach(function(record) {
        data1.push({name: record.fields.Name, percent: (record.fields.Percent*100), count: record.fields.Count, borough: record.fields.Borocode});
      });
 
      fetchNextPage();
  }, function done(err) {
    if (err) { console.error(err); return; 
  }
  ready();
});

function dataSwap(datasetGroup) {  
  d3.selectAll('circle')
    .transition()
    // .ease(d3.easeElastic)
    .duration(transitionTime)
        .style("visibility", function(d) {
          if (d.borough == datasetGroup) {
            return "visible"
          }
          else{
            return "hidden"
            }
          ;})
          .style("opacity", function(d) {
            if (d.borough == datasetGroup) {
              return 1
            }
            else{
              return 0
              }
            ;})
  d3.select('#titleText')
    .text('Wifi ' + datasetGroup);
  };
  
  

// tooltip mouseover event handler


const margin = {top: 20, right: 30, bottom: 20, left: 30};
const outerWidth = 700;
const outerHeight = 600;
const innerWidth = outerWidth - margin.left - margin.right
const innerHeight = outerHeight - margin.top - margin.bottom
const radius=5;
const transitionTime=1000;
//SVG 

const SVG = d3.select("#my_dataviz").append("svg")

  .attr("width", outerWidth)
  .attr("height", outerHeight);  
const svg = SVG.append('g')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");  

//Defining scales and axes
const xScale =  d3.scaleLinear()
    .range([0, innerWidth]);
const xAxis = d3.axisBottom(xScale)
    .tickSize(-innerHeight);
const yScale = d3.scaleLinear()
    .range([innerHeight, 0])
const yAxis = d3.axisLeft(yScale)
    .tickSize(-innerWidth);
//Axis lines
const xAxisGroup = svg.append("g")
  .attr("class", "x axis") 
  .attr("transform", "translate(0," + innerHeight + ")")
  .call(xAxis);
const yAxisGroup = svg.append("g")
  .attr("class", "y axis") 
  .call(yAxis);
  var color = d3.scaleOrdinal()
  .domain(["Manhattan", "Bronx", "Brooklyn", "Queens","Staten Island" ])
  .range([ "#440154ff", "#21908dff", "#fde725ff", "red", "blue"])

function ready() {
 
  
    const startData = data1
    const boroughList = d3.set(data1.map(function(d) { return d.borough })).values();

    console.log(startData)
   
    d3.select('#buttonsDiv')
      .selectAll('button')
      .data(boroughList)
      .enter().append('button')
      .text(function(d) { return d; })
      .on('click', function(d) {
         dataSwap(d,data1) 
       });

    xScale.domain([0, d3.max(startData, function(d) { return d.percent })+6])
    yScale.domain([0, d3.max(startData, function(d) { return d.count })+6])
    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    const wifiGroup = svg.selectAll('.wifiGroup')
        .data(startData).enter().append('g') 
        .attr('class', 'wifiGroup')
        .attr('transform', function(d) { return 'translate(' + xScale(d.percent) + ',' + yScale(d.count) + ')'})
        .on('mouseover', function(d) {
            d3.select(this)
            .select('circle')
            .transition()
            .ease(d3.easeElastic)
            .duration(transitionTime) 
            .attr('r', radius*2)
            .style('opacity', 1);
            d3.selectAll('circle')
            .style('opacity', 0.5)
            
         })
      .on('mouseout', function(d) {
         d3.select(this)
            .select('circle')
            .transition()
            .ease(d3.easeElastic)
            .duration(transitionTime) 
            .attr('r', radius)
            d3.selectAll('circle')
            .style('opacity', 1)
        });

    //Data points for neighborhoods
    wifiGroup.append('circle')
        .style('fill', '#a4d7ed')
        .attr('class', 'wifiCircle')
        .attr('r', radius)
        .style("fill", function (d) { return color(d.borough) } )
        .on("mouseover", tipMouseover)
        .on("mouseout", tipMouseout)
    //Data title
    d3.select('#titleDiv')
        .append('h1')
        .attr('id', 'titleText')
        .text('Wifi Access in NYC')
        
  }
  
  var tooltip = d3.select("#my_dataviz").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);
  var tipMouseover = function(d) {  
    var html  = "<span style='color:" +  color(d.borough)  + ";'>" + d.name + "</span><br/>";
    tooltip.html(html)
        .style("left", (d3.event.pageX + 15) + "px")
        .style("top", (d3.event.pageY - 28) + "px")
        .transition()
        .duration(transitionTime/2) 
        .style("opacity", .9) 

  };
  // tooltip mouseout event handler
  var tipMouseout = function(d) {
    tooltip.transition()
        .duration(transitionTime/2)
        .style("opacity", 0);
  };
  