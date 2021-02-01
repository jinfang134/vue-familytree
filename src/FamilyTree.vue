<template>
  <div>
    <svg class="d3-tree-vi width-100-percent container-border" />
  </div>
</template>

<script>
import * as d3 from 'd3'
import female from './female.svg'
import male from './male.svg'

export default {
  props: {
    data: {
      type: Object
    }
  },
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
    appendButton(node) {
      // const btnGrp = node
      //   .selectAll('g.btn-more')
      //   .data(d => {
      //     return d.data && d.data.children ? ['+'] : []
      //   })
      //   .enter()
      //   .append('g')
      //   .attr('class', 'btn-more')

      const btnGrp = node.selectAll('g.btn').data(d => {
        console.log('d:', d)
        if (d.children) {
          return [1]
        }
        if (d._children) {
          return [0]
        }
        return []
      })

      const btnEnter = btnGrp
        .enter()
        .append('g')
        .attr('class', 'btn')
      // .attr('transform', (data, index) => {
      //   return `translate(${index * 32},0)`
      // })

      btnEnter
        .append('circle')
        .attr('cx', 0)
        .attr('cy', 34)
        .attr('r', 6)
        .attr('class', 'btn-more')

      btnEnter
        .append('text')
        .attr('class', 'status')
        .attr('dy', '0.31em')
        .attr('x', 0)
        .attr('y', 34.5)
        .attr('text-anchor', 'middle')
        .text(d => {
          console.log(d)
          return d == 1 ? '-' : '+'
        })

      btnGrp.exit().remove()
      node.merge(btnEnter)
    },
    appendNode(node) {
      const margin = 4
      const imageWidth = 32

      const container = node
        .append('rect')
        .attr('x', -(imageWidth + margin * 2) / 2)
        .attr('y', -18)
        .attr('rx', 4)
        .attr('ry', 4)
        .attr('width', d => {
          const list = (d.data && d.data.companion) || []
          return imageWidth + margin * 2 + list.length * 32
        })
        .attr('class', 'container')

      this.appendButton(node)

      const manGrp = node.append('g').attr('class', 'main')
      const comGrp = node.append('g').attr('class', 'comp')

      manGrp
        .append('image')
        .attr('x', -imageWidth / 2)
        .attr('y', -imageWidth / 2)
        .attr('width', imageWidth)
        .attr('height', imageWidth)
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

      const subGrp = comGrp.selectAll('g').data(d => {
        return (d.data && d.data.companion) || []
      })

      const comEnter = subGrp
        .enter()
        .append('g')
        .attr('class', 'companions')
        .attr('transform', (data, index) => {
          return `translate(${index * 32},0)`
        })

      comEnter
        .append('image')
        .attr('x', 16)
        .attr('y', -16)
        .attr('width', 32)
        .attr('height', 32)
        .attr('href', function(d) {
          return d.gender == 'f' ? female : male
        })

      comEnter
        .append('text')

        .attr('dy', '0.31em')
        .attr('class', 'name')
        .attr('x', 32)
        .attr('y', 24)
        .attr('text-anchor', 'middle')
        .text(d => {
          return d.name
        })

      subGrp.exit().remove()
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

    let dy = 130
    let dx = 80

    let tree = d3.tree().nodeSize([dx, dy])
    // let diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x)
    // 这个函数用来画线
    let diagonal = d3
      .linkVertical()
      .x(d => d.x)
      .y(d => d.y + 30)
    const root = d3.hierarchy(this.data)

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
      const duration = d3.event && d3.event.altKey ? 2500 : 750
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

      // console.log(nodes)

      // Update the nodes…
      const node = gNode.selectAll('g.family').data(nodes, d => d.id)

      // Enter any new nodes at the parent's previous position.
      const nodeEnter = node
        .enter()
        .append('g')
        .attr('class', 'family')
        .attr('transform', () => `translate(${source.x0},${source.y0})`)
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0)
        .on('click', d => {
          d.children = d.children ? null : d._children
          update(d)
          event.preventDefault()
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

      // Transition exiting nodes to the parent's new position.
      const nodeExit = node
        .exit()
        .transition(transition)
        .remove()
        .attr('transform', () => `translate(${source.x},${source.y + 30})`)
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0)

      node.selectAll('text.status').text(d => {
        return d.children ? '-' : '+'
      })

      // console.log(nodeExit) // eslint-disable-line

      // Update the links…
      const link = gLink.selectAll('path').data(links, d => d.target.id)

      // Enter any new links at the parent's previous position.
      const linkEnter = link
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('stroke-width', d => {
          // console.log('d',d)
          return Math.max(3 - source.depth, 1)
        })
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
  /* color: #fff; */
  /* stroke: #aaa; */
}

.link {
  stroke: #4c85d1;
}

.family {
  /* outline: thin dashed #4c85d1; */
  padding-top: 10px;
}

.btn-more {
  fill: #fff;
  stroke: #555;
}

.container {
  fill: #c8d14c;
  stroke: #555;
  height: 52px;
  stroke-opacity: 0.1;
  stroke-width: 0.5;
}
</style>
