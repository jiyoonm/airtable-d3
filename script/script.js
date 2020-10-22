//Download Airtable Data
var data1 = [];
var data2 = [];

var Airtable = require('airtable');


function findData() {

  var base = new Airtable({apiKey: 'keyJvXFNWQIMm9EA2'}).base('appmrMX9i7Il9Ewtq');
  base('NTA').select({
      view: "Grid view",
    }).eachPage(function page(records, fetchNextPage) {
        records.forEach(function(record) {
          data1.push({name: record.fields.Name, percent: (record.fields.Percent*100), count: record.fields.Count, borough: record.fields.Borocode, id: record.fields.recordIDs });
        });

        fetchNextPage();
    }, 
    function done(err) {
      if (err) { console.error(err); return; 
    }

  });}


  findData();

function findData2() {

  var base = new Airtable({apiKey: 'keyJvXFNWQIMm9EA2'}).base('appmrMX9i7Il9Ewtq');
    base('Imported table').select({
      view: "Grid view",
    }).eachPage(function page(records, fetchNextPage) {
        records.forEach(function(record) {
          data2.push({name1: record.fields.dd, n: record.fields.Neighborhood2, location:record.fields.Location });
        });

        fetchNextPage();
    }, function done(err) {
      if (err) { console.error(err); 
        return; 
    }
    ready(data1,data2);
  });

}
findData2();
//button data switch
function dataSwap(datasetGroup) {  
  d3.selectAll('circle')
    .transition()
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

  };

const margin = {top: 20, right: 30, bottom: 50, left: 70};
const outerWidth = 910;
const outerHeight = 780;
const innerWidth = outerWidth - margin.left - margin.right
const innerHeight = outerHeight - margin.top - margin.bottom
const radius=6;
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
  .range([ "#EFB605", "#E01A25", "#991C71","#2074A0",  "#7EB852"])

function ready(data1, data2) {
    const startData =  data1
    const boroughList = d3.set(data1.map(function(d) { return d.borough })).values();
    const neighborhoodList = d3.set(data2.map(function(D) { return D.n })).values();
 
    d3.select('#buttonsDiv')
      .selectAll('button')
      .data(boroughList)
      .enter().append('button')
      .attr('class','button')
      .style("background-color",function (d) { return color(d) }  )
      .style('opacity', .9)
    .style('color','white')
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
            .style('opacity', .8)
        });

    //Data points for neighborhoods
    wifiGroup.append('circle')
        .style('opacity', .8)
        .attr('class', 'wifiCircle')
        .attr('r', radius)
        .style("fill", function (d) { return color(d.borough) } )
        .on("mouseover", tipMouseover)
        .on("click", tip)
        .on("mouseout", tipMouseout)
    //Data title
   
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (innerHeight / 2))
    .attr("dy", "1em")
    .style("color",'#6e6e6e')
    .style('font-size','23px')
    .style("text-anchor", "middle")
    .style("color","#6e6e6e")
    .text("# of Free Wi-Fi Hotspot Locations"); 
 
    svg.append("text")
    .attr("class", "x label")
  
    .style("text-anchor", "middle")
    .attr("x", innerWidth/2)
    .style('font-size','23px')
    .attr("y", innerHeight + 40)
    .style("color","#6e6e6e")

    .text("% of Households without Internet");
        
  }

  var tooltip = d3.select("#my_dataviz").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

  var tipMouseover = function(d) {    
    var html  = "<span style='color:" +  color(d.borough)  + ";'>" + d.name + "</span><br> Hotspot Locations: "+"<b>" + d.count + "</b><br>Households Without Internet: <b>"+ Math.floor(d.percent)+"%";
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

  var locations=[];


  var tip = function(d) {

    locations=[];

    // var 
    for (i = 0; i < data2.length; i++) {
      if (d.name===data2[i].n){
        locations.push({name1: data2[i].location, name2:data2[i].name1 });
  }
  
    }
    console.log( locations)
    update(locations, ['name1','name2']);

    var x = document.getElementById("table1");
    var y = document.getElementById("dissapear");
        if (x.style.display === "none" && y.style.display === "none" ) {
      x.style.display = "inline-block";
      y.style.display = "block";
      y.innerHTML = ("Free Wi-fi Hotspot Locations in " + d.name)
    } else {
      x.style.display = "none";
      y.style.display = "none";
    }
  }
  
var table = d3.select('table')

var ident = function(d) { return d.value; };
var update = function(locations, columns) {


  var rows = table.selectAll('tr').data(locations)
   //////////////////////////////////////////
  // ROW UPDATE SELECTION

  // Update cells in existing rows.

  var cells = rows.selectAll("td")
  .data(function(row) {
      return columns.map(function(column) {
          return {column: column, value: row[column]};
      });
  });

  cells.attr('class', 'update');
  
  // Cells enter selection
  cells.enter().append('td')
    .style('opacity', 0.0)
    .attr('class', 'enter')
    .transition()
    .delay(200)
    .duration(500)
    .style('opacity', 1.0);

  cells.text(ident);

  // Cells exit selection
  cells.exit()
    .attr('class', 'exit')
    .transition()
    .delay(200)
    .duration(500)
    .style('opacity', 0.0)
    .remove();

  //////////////////////////////////////////
  // ROW ENTER SELECTION
  // Add new rows
  var cells_in_new_rows = rows.enter().append('tr')
                              .selectAll('td')
                              .data(function(row) {
                                return columns.map(function(column) {
                                    return {column: column, value: row[column]};
                                });
                            });

  cells_in_new_rows.enter().append('td')
    .style('opacity', 0.0)
    .attr('class', 'enter')
    .transition()
      .delay(200)
      .duration(500)
    .style('opacity', 1.0);

  cells_in_new_rows.text(ident);

  /////////////////////////////////////////
  // ROW EXIT SELECTION
  // Remove old rows
  rows.exit()
    .attr('class', 'exit')
    .transition()
    .delay(200)
    .duration(500)

    .style('opacity', 0.0)
    .remove();

  table.selectAll('tr').select('td').classed('row-header', true);


};
