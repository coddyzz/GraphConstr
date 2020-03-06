
var radius = 4;
var width = 900;
var height = 960;
var svg = d3.select("#container").append("svg").attr("width",width).attr("height",height)

var color = "black"   

// var context = canvas.getContext("2d")
// var width = canvas.width;
// var height = canvas.height;

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

//add encompassing group for the zoom 
var g = svg.append("g")
    .attr("class", "everything");


d3.csv("val.csv", function(error, graph) {
  if (error) throw error;

  let nodes = []
  let links = []

  graph.forEach(function(d){
  	nodes.push(d.head);
  	nodes.push(d.tail);
  	links.push({"source":d.head,"target":d.tail,"value":d3.randomInt(10)(),"id":d.relation})}
  	)

  let uniqueNodes = new Set(nodes)

  nodes = []
  uniqueNodes.forEach(function(d){
  	nodes.push({"id":d,"value":d3.randomInt(10)()})
  })

  simulation
      .nodes(nodes)
      .on("tick", tickActions);

  simulation.force("link")
      .links(links);

	var link = g.append("g")
		.attr("class", "links")
		.selectAll("line")
		.data(links)
		.enter().append("line")
		.attr("stroke-width", 1)
		.attr("stroke","teal")
		.attr("id",function(d){return d.id})
		.on("mouseover", handleMouseOverLink)
		.on("mouseout", handleMouseOutLink);

	var node = g.append("g")
	        .attr("class", "nodes") 
	        .selectAll("circle")
	        .data(nodes)
	        .enter()
	        .append("circle")
	        .attr("r",radius)
	        .attr("fill","black")
	        .attr("id",function(d){return d.id})
			.on("mouseover", handleMouseOverNode)
			.on("mouseout", handleMouseOutNode);

	var drag_handler = d3.drag()
	.on("start", drag_start)
	.on("drag", drag_drag)
	.on("end", drag_end);	
	
	drag_handler(node);

	var zoom_handler = d3.zoom()
	    .on("zoom", zoom_actions);

	zoom_handler(svg);  

	function tickActions() {
    //update circle positions each tick of the simulation 
       node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
        
    //update link positions 
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
} 

});

function drag_start() {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d3.event.subject.fx = d3.event.subject.x;
  d3.event.subject.fy = d3.event.subject.y;
}

function drag_drag() {
  d3.event.subject.fx = d3.event.x;
  d3.event.subject.fy = d3.event.y;
}

function drag_end() {
  if (!d3.event.active) simulation.alphaTarget(0);
  d3.event.subject.fx = null;
  d3.event.subject.fy = null;
}

function drawLink(d) {
  context.moveTo(d.source.x, d.source.y);
  context.lineTo(d.target.x, d.target.y);
}

function drawNode(d) {
  context.moveTo(d.x + 3, d.y);
  context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
}


//Zoom functions 
function zoom_actions(){
    g.attr("transform", d3.event.transform)
}

// Create Event Handlers for mouse
function handleMouseOverNode(d, i) {  // Add interactivity

    // Use D3 to select element, change color and size
    d3.select(this).attr("fill", "orange");
    let name = d3.select(this).attr("id");
    // Specify where to put label of text
    svg.append("text")
    .attr("id","tooltipText")
    .attr("x",d3.mouse(this)[0])
    .attr("y",d3.mouse(this)[1])
    .text(name);
  }

function handleMouseOutNode(d, i) {
    // Use D3 to select element, change color back to normal
	d3.select(this).attr("fill", "black");

    // Select text by id and then remove
    d3.select("#tooltipText").remove();  // Remove text location
  }

function handleMouseOverLink(d, i) {  // Add interactivity

    // Use D3 to select element, change color and size
    d3.select(this).attr("stroke", "orange").attr("stroke-width", 2);

	let name = d3.select(this).attr("id")
    // console.log(name)
    // Specify where to put label of text
    svg.append("text")
    .attr("id","tooltipText")
    .attr("x",d3.mouse(this)[0])
    .attr("y",d3.mouse(this)[1])
    .text(name);

  }

function handleMouseOutLink(d, i) {
    // Use D3 to select element, change color back to normal
	d3.select(this).attr("stroke", "teal").attr("stroke-width", 1);

    // Select text by id and then remove
    d3.select("#tooltipText").remove();  // Remove text location
  }