//Download Airtable Data
var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keyJvXFNWQIMm9EA2'}).base('appmrMX9i7Il9Ewtq');
    var data = [];
  base('NTA').select({
    view: "Grid view",
  }).eachPage(function page(records, fetchNextPage) {
      records.forEach(function(record) {
        data.push({name: record.fields.Name, percent: (record.fields.Percent*100), count: record.fields.Count});
      });
 
      fetchNextPage();
  }, function done(err) {
    if (err) { console.error(err); return; 
  }
  ready();
});

const margin = {top: 20, right: 30, bottom: 20, left: 30};
const outerWidth = 700;
const outerHeight = 600;
const innerWidth = outerWidth - margin.left - margin.right
const innerHeight = outerHeight - margin.top - margin.bottom
const radius=5;
const transitionTime=1000;

//SVG 
const SVG = d3.select("body").append("svg")
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

function ready(fullData) {
    const startData = data
    console.log(startData)
    
    xScale.domain([0, d3.max(startData, function(d) { return d.percent })+6])

    yScale.domain([0, d3.max(startData, function(d) { return d.count })+6])
   
    const wifiGroup = svg.selectAll('.wifiGroup')
        .data(startData).enter().append('g') 
        .attr('class', 'wifiGroup')
        .attr('transform', function(d) { return 'translate(' + xScale(d.percent) + ',' + yScale(d.count) + ')'})
        .on('mouseenter', function(d) {

            d3.select(this)
            .select('text')
            .transition()
            .style('opacity', 1)
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
      .on('mouseleave', function(d) {

          d3.select(this)
            .select('text')
            .transition()
            .style('opacity', 0)
         d3.select(this)
            .select('circle')
            .transition()
            .ease(d3.easeElastic)
            .duration(transitionTime) 
            .attr('r', radius)
    
        });
    //Axis lines
    const xAxisGroup = svg.append("g")
        .attr("class", "x axis") 
        .attr("transform", "translate(0," + innerHeight + ")")
        .call(xAxis);
    
    const yAxisGroup = svg.append("g")
        .attr("class", "y axis") 
        .call(yAxis);
   
    //Data points for neighborhoods
    wifiGroup.append('circle')
        .style('fill', '#a4d7ed')
        .attr('class', 'wifiCircle')
        .attr('r', radius)
  
    //Data points name
    wifiGroup.append('text')
        .attr('class', 'wifiText')
        .attr('dx', 10)
        .attr('dy', -10)
        .text(function(d) { return d.name })
        .attr('opacity', 0);
    //Data title
    d3.select('#titleDiv')
        .append('h1')
        .attr('id', 'titleText')
        .text('Wifi Access in NYC')
  }