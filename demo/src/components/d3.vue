<template>
  <div>

  </div>
</template>

<script>
import * as d3 from 'd3'
export default {
  data() {
    return {
      treeData: [
        {
          name: 'Top Level',
          parent: 'null',
          children: [
            {
              name: 'Level 2: A',
              parent: 'Top Level',
              children: [
                {
                  name: 'Son of A',
                  parent: 'Level 2: A'
                },
                {
                  name: 'Daughter of A',
                  parent: 'Level 2: A'
                }
              ]
            },
            {
              name: 'Level 2: B',
              parent: 'Top Level'
            }
          ]
        }
      ]
      // ************** Generate the tree diagram	 *****************
      //   margin: { top: 20, right: 120, bottom: 20, left: 120 },
      //   width: 960 - this.margin.right - this.margin.left,
      //   height: 500 - this.margin.top - this.margin.bottom,

      //   // var i = 0, duration = 750, root;

      //   tree: d3.layout.tree().size([height, width]),

      //   diagonal: d3.svg.diagonal().projection(function(d) {
      //     return [d.y, d.x]
      //   }),

      //   svg: d3
      //     .select('body')
      //     .append('svg')
      //     .attr('width', width + margin.right + margin.left)
      //     .attr('height', height + margin.top + margin.bottom)
      //     .append('g')
      //     .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      // d3.select(self.frameElement).style("height", "500px");
    }
  },
  methods: {
    update(source,tree,  svg, duration,diagonal) {
        var i = 0;
      // Compute the new tree layout.
      var nodes = tree.nodes(source).reverse(),
        links = tree.links(nodes)

      // Normalize for fixed-depth.
      nodes.forEach(function(d) {
        d.y = d.depth * 180
      })

      // Update the nodes…
      var node = svg.selectAll('g.node').data(nodes, function(d) {
        return d.id || (d.id = ++i)
      })

      // Enter any new nodes at the parent's previous position.
      var nodeEnter = node
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', function(d) {
          return 'translate(' + source.y0 + ',' + source.x0 + ')'
        })
        .on('click', this.click)

      nodeEnter
        .append('circle')
        .attr('r', 1e-6)
        .style('fill', function(d) {
          return d._children ? 'lightsteelblue' : '#fff'
        })

      nodeEnter
        .append('text')
        .attr('x', function(d) {
          return d.children || d._children ? -13 : 13
        })
        .attr('dy', '.35em')
        .attr('text-anchor', function(d) {
          return d.children || d._children ? 'end' : 'start'
        })
        .text(function(d) {
          return d.name
        })
        .style('fill-opacity', 1e-6)

      // Transition nodes to their new position.
      var nodeUpdate = node
        .transition()
        .duration(duration)
        .attr('transform', function(d) {
          return 'translate(' + d.y + ',' + d.x + ')'
        })

      nodeUpdate
        .select('circle')
        .attr('r', 10)
        .style('fill', function(d) {
          return d._children ? 'lightsteelblue' : '#fff'
        })

      nodeUpdate.select('text').style('fill-opacity', 1)

      // Transition exiting nodes to the parent's new position.
      var nodeExit = node
        .exit()
        .transition()
        .duration(duration)
        .attr('transform', function(d) {
          return 'translate(' + source.y + ',' + source.x + ')'
        })
        .remove()

      nodeExit.select('circle').attr('r', 1e-6)

      nodeExit.select('text').style('fill-opacity', 1e-6)

      // Update the links…
      var link = svg.selectAll('path.link').data(links, function(d) {
        return d.target.id
      })

      // Enter any new links at the parent's previous position.
      link
        .enter()
        .insert('path', 'g')
        .attr('class', 'link')
        .attr('d', function(d) {
          var o = { x: source.x0, y: source.y0 }
          return diagonal({ source: o, target: o })
        })

      // Transition links to their new position.
      link
        .transition()
        .duration(duration)
        .attr('d', diagonal)

      // Transition exiting nodes to the parent's new position.
      link
        .exit()
        .transition()
        .duration(duration)
        .attr('d', function(d) {
          var o = { x: source.x, y: source.y }
          return diagonal({ source: o, target: o })
        })
        .remove()

      // Stash the old positions for transition.
      nodes.forEach(function(d) {
        d.x0 = d.x
        d.y0 = d.y
      })
    },
    click(d) {
      if (d.children) {
        d._children = d.children
        d.children = null
      } else {
        d.children = d._children
        d._children = null
      }
      this.update(d)
    }
  },
  mounted() {
  
// Set the dimensions and margins of the diagram
var margin = {top: 20, right: 90, bottom: 30, left: 90},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var colorScale = d3.scaleLinear()
    .domain([0, 1])
		.range(['red', 'green']);
var widthScale = d3.scaleLinear()
		.domain([1,80])
		.range([1, 10]);

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate("
          + margin.left + "," + margin.top + ")");

var i = 0,
    duration = 750,
    root;

// declares a tree layout and assigns the size
var treemap = d3.tree().size([height, width]);

// Assigns parent, children, height, depth
root = d3.hierarchy(treeData, function(d) { return d.children; });
root.x0 = height / 2;
root.y0 = 0;

// Collapse after the second level
root.children.forEach(collapse);

update(root);

// Collapse the node and all it's children
function collapse(d) {
  if(d.children) {
    d._children = d.children
    d._children.forEach(collapse)
    d.children = null
  }
}

function update(source) {

  // Assigns the x and y position for the nodes
  var treeData = treemap(root);

  // Compute the new tree layout.
  var nodes = treeData.descendants(),
      links = treeData.descendants().slice(1);

  // Normalize for fixed-depth.
  nodes.forEach(function(d){ d.y = d.depth * 180});

  // ****************** Nodes section ***************************

  // Update the nodes...
  var node = svg.selectAll('g.node')
      .data(nodes, function(d) {return d.id || (d.id = ++i); });

  // Enter any new modes at the parent's previous position.
  var nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr("transform", function(d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
    })
    .on('click', click);

  // Add Circle for the nodes
  nodeEnter.append('circle')
      .attr('class', 'node')
      .attr('r', 1e-6)
      .style("fill", function(d) {
          return d._children ? "lightsteelblue" : "#fff";
      })
  		.style("stroke", function(d){return colorScale(d.data.female/(d.data.female + d.data.male))});

  // Add labels for the nodes
  nodeEnter.append('text')
      .attr("dy", ".35em")
      .attr("x", function(d) {
          return d.children || d._children ? -13 : 13;
      })
      .attr("text-anchor", function(d) {
          return d.children || d._children ? "end" : "start";
      })
      .text(function(d) { return d.data.name; })
  		.style("fill", function(d){return colorScale(d.data.female/(d.data.value))});

  // UPDATE
  var nodeUpdate = nodeEnter.merge(node);

  // Transition to the proper position for the node
  nodeUpdate.transition()
    .duration(duration)
    .attr("transform", function(d) { 
        return "translate(" + d.y + "," + d.x + ")";
     });

  // Update the node attributes and style
  nodeUpdate.select('circle.node')
    .attr('r', 10)
    .style("fill", function(d) {
        return d._children ? "lightsteelblue" : "#fff";
    })
    .attr('cursor', 'pointer');


  // Remove any exiting nodes
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) {
          return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();

  // On exit reduce the node circles size to 0
  nodeExit.select('circle')
    .attr('r', 1e-6);

  // On exit reduce the opacity of text labels
  nodeExit.select('text')
    .style('fill-opacity', 1e-6);

  // ****************** links section ***************************

  // Update the links...
  var link = svg.selectAll('path.link')
      .data(links, function(d) { return d.id; })
  		.style('stroke-width', function(d){
        return widthScale(d.data.value)
      });

  // Enter any new links at the parent's previous position.
  var linkEnter = link.enter().insert('path', "g")
      .attr("class", "link")
      .attr('d', function(d){
        var o = {x: source.x0, y: source.y0}
        return diagonal(o, o)
      })
  		.style('stroke-width', function(d){
        return widthScale(d.data.value)
      });

  // UPDATE
  var linkUpdate = linkEnter.merge(link);

  // Transition back to the parent element position
  linkUpdate.transition()
      .duration(duration)
      .attr('d', function(d){ return diagonal(d, d.parent) });

  // Remove any exiting links
  var linkExit = link.exit().transition()
      .duration(duration)
      .attr('d', function(d) {
        var o = {x: source.x, y: source.y}
        return diagonal(o, o)
      })
  		.style('stroke-width', function(d){
        return widthScale(d.data.value)
      })
      .remove();

  // Store the old positions for transition.
  nodes.forEach(function(d){
    d.x0 = d.x;
    d.y0 = d.y;
  });

  // Creates a curved (diagonal) path from parent to the child nodes
  function diagonal(s, d) {

    path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`

    return path
  }

  // Toggle children on click.
  function click(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
    update(d);
  }
}
  }
}
</script>
<style lang="css">
.node circle {
  fill: #fff;

  /*   stroke: steelblue; */
  stroke-width: 3px;
}

.node text {
  font: 12px sans-serif;
}

.link {
  fill: none;
  stroke: #ccc;

  /*   stroke-width: 2px; */
}
</style>