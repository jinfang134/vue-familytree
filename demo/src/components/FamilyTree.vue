<template>
  <div>
    <svg class="d3-tree-vi width-100-percent container-border" />
  </div>
</template>

<script>
import * as d3 from 'd3'
import data from './data'
import female from './female.svg'
import male from './male.svg'

export default {
  data() {
    return {
      nodeId: '',
      nodeName: '',
      zoom: null,
      index: 0,
      root: null,
      nodes: [],
      links: [],
      dTreeData: null,
      margin: { top: 20, right: 90, bottom: 30, left: 90 },
      currentNode: null,
      svg: null,
      container: null,
      // nodeObj: null,
      newNodeName: '',
      rootNodeId: null
    }
  },
  methods: {
    appendNode(node) {
      const manGrp = node.append('g').attr('class', 'main')
      const comGrp = node.append('g').attr('class', 'comp')

      manGrp
        .append('image')
        .attr('x', -16)
        .attr('y', -16)
        .attr('width', 32)
        .attr('height', 32)
        .attr('href', function(d) {
          return d.data.gender == 'f' ? female : male
        })

      manGrp
        .append('text')
        .attr('dy', '0.31em')
        .attr('class', 'name')
        .attr('x', 0)
        .attr('y', 24)
        .attr('text-anchor', 'middle')
        .text(d => d.data.name)
        .clone(true)
        .lower()
        .attr('stroke-linejoin', 'round')
        .attr('stroke-width', 3)
        .attr('stroke', 'white')

      // for (var item in node.data.companion) {
      //   console.log(item)
      // }
      const compNode = comGrp.selectAll('g').data(function(d) {
        console.log('companion:', d.data.companion)
        return d.data.companion || []
      })

      compNode
        .enter()
        // .append('g')
        // .attr('class','comp')
        .append('image')
        .attr('x', 16)
        .attr('y', -18)
        .attr('width', 32)
        .attr('height', 32)
        .attr('href', function(d) {
          return d && d.gender == 'm' ? male : female
        })
        .append('text')
        .attr('dy', '0.31em')
        .attr('class', 'name')
        .attr('x', 32)
        .attr('y', 24)
        .attr('text-anchor', 'middle')
        .text(d => {
          console.log('d:', d)
          return d && d.name
        })
        .clone(true)
        .lower()
        .attr('stroke-linejoin', 'round')
        .attr('stroke-width', 3)
        .attr('stroke', 'white')

      node.merge(compNode)

      compNode.exit().remove()
    }
  },
  mounted() {
    let clientWidth = document.body.clientWidth
    let clientHeight = document.body.clientHeight
    this.width = Math.floor(clientWidth * 0.6)
    this.height = clientHeight - 72
    console.log('width: ' + this.width + ' height: ' + this.height) // eslint-disable-line

    let margin = { top: 40, right: 90, bottom: 10, left: 100 }

    let width = this.width

    let dy = 100
    let dx = 130

    let tree = d3.tree().nodeSize([dx, dy])
    // let diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x)
    // 这个函数用来画线
    let diagonal = d3
      .linkVertical()
      .x(d => d.x)
      .y(d => d.y)

    const root = d3.hierarchy(data)

    root.x0 = 0
    root.y0 = 0

    // 折叠子树
    root.descendants().forEach((d, i) => {
      d.id = i
      d._children = d.children
      if (d.depth && d.data.name.length !== 4) d.children = null
    })

    let svg = d3
      .select('svg.d3-tree-vi')
      .attr('viewBox', [-width / 2, -margin.top, width, dx])

    const gLink = svg
      .append('g')
      .attr('fill', 'none')
      .attr('stroke', '#555')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 1.5)

    const gNode = svg
      .append('g')
      // .attr('cursor', 'pointer')
      .attr('pointer-events', 'all')

    // ****************  zoom ************************
    // add zoom capabilities
    let zoomHandler = d3
      .zoom()
      .on('zoom', zoomActions)
      .scaleExtent([1 / 2, 8])

    svg.call(zoomHandler).on('dblclick.zoom', null)
    zoomHandler(svg)

    // Zoom functions
    function zoomActions() {
      gNode.attr('transform', d3.event.transform)
      gLink.attr('transform', d3.event.transform)
    }
    // ***********************************************
    const self = this
    function update(source) {
      const duration = d3.event && d3.event.altKey ? 2500 : 250
      const nodes = root.descendants().reverse()
      const links = root.links()

      // Compute the new tree layout.
      tree(root)

      // console.log('root ', root)

      let left = root
      let right = root
      root.eachBefore(node => {
        if (node.x < left.x) left = node
        if (node.x > right.x) right = node
      })

      const height = right.x - left.x + margin.top + margin.bottom

      const transition = svg
        .transition()
        .duration(duration)
        .attr('viewBox', [-width / 2, -margin.top, width, height])
        // .attr('viewBox', [-240, 0, 846, 10])
        .tween(
          'resize',
          window.ResizeObserver ? null : () => () => svg.dispatch('toggle')
        )

      console.log(nodes)

      // Update the nodes…
      const node = gNode.selectAll('g').data(nodes, d => d.id)

      // Enter any new nodes at the parent's previous position.
      const nodeEnter = node
        .enter()
        .append('g')
        .attr('transform', () => `translate(${source.x0},${source.y0})`)
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0)
        .on('click', d => {
          d.children = d.children ? null : d._children
          update(d)
        })
      self.appendNode(nodeEnter)

      // Transition nodes to their new position.
      const nodeUpdate = node
        .merge(nodeEnter)
        .transition(transition)
        .attr('transform', d => `translate(${d.x},${d.y})`)
        .attr('cursor', function(d) {
          return d._children || d.children ? 'pointer' : ''
        })
        .attr('fill-opacity', 1)
        .attr('stroke-opacity', 1)
      // console.log(nodeUpdate) // eslint-disable-line

      // Transition exiting nodes to the parent's new position.
      const nodeExit = node
        .exit()
        .transition(transition)
        .remove()
        .attr('transform', () => `translate(${source.x},${source.y})`)
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0)

      // console.log(nodeExit) // eslint-disable-line

      // Update the links…
      const link = gLink.selectAll('path').data(links, d => d.target.id)

      // Enter any new links at the parent's previous position.
      const linkEnter = link
        .enter()
        .append('path')
        .attr('d', () => {
          const o = { x: source.x0, y: source.y0 }
          return diagonal({ source: o, target: o })
        })

      // Transition links to their new position.
      link
        .merge(linkEnter)
        .transition(transition)
        .attr('d', diagonal)

      // Transition exiting nodes to the parent's new position.
      link
        .exit()
        .transition(transition)
        .remove()
        .attr('d', () => {
          const o = { x: source.x, y: source.y }
          return diagonal({ source: o, target: o })
        })

      // Stash the old positions for transition.
      root.eachBefore(d => {
        d.x0 = d.x
        d.y0 = d.y
      })
    }

    update(root)
  }
}
</script>
<style >
.width-100-percent {
  height: 100vh;
  width: 100%;
}

.name {
  font: normal 9px sans-serif;
}
</style>
