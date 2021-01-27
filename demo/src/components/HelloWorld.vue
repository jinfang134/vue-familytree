<template>
  <div class="hello">
    <svg id="svg" class="svg" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid meet">
      <g id="viewport">
        <rect class="svg-background" x="0" y="0" width="300" height="300" />
        <g transform="translate(86.08, 11.6)">
          <image />
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
import Image from './image.vue'
import Draggable from 'gsap/Draggable'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { TweenMax, Power2, TweenLite, TimelineLite } from 'gsap'

var resetAnimation = new TimelineLite()

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      zoom: {
        animation: new TimelineLite(),
        scaleFactor: 1.6,
        duration: 0.5,
        ease: Power2.easeOut
      },
      proxy: document.createElement('div'),
      startClient:'',
      viewBox:'',
    }
  },
  methods: {
    //
    // SELECT DRAGGABLE
    // ===========================================================================
    selectDraggable(event) {
      if (resetAnimation.isActive()) {
        resetAnimation.kill()
      }

      startClient.x = this.pointerX
      startClient.y = this.pointerY
      startGlobal = startClient.matrixTransform(svg.getScreenCTM().inverse())

      // Right mouse button

      TweenLite.set(proxy, {
        x: this.pointerX,
        y: this.pointerY
      })

      // pannable
      //   .enable()
      //   .update()
      //   .startDrag(event)
      // pivotAnimation.reverse()
    },
    updateViewBox() {
      if (this.zoom.animation.isActive()) {
        return
      }

      point.x = this.x
      point.y = this.y

      var moveGlobal = point.matrixTransform(svg.getScreenCTM().inverse())

      viewBox.x -= moveGlobal.x - startGlobal.x
      viewBox.y -= moveGlobal.y - startGlobal.y
    },
    onWheel(event) {
      event.preventDefault()

      // pivotAnimation.reverse()

      var normalized
      var delta = event.wheelDelta

      if (delta) {
        normalized = delta % 120 == 0 ? delta / 120 : delta / 12
      } else {
        delta = event.deltaY || event.detail || 0
        normalized = -(delta % 3 ? delta * 10 : delta / 3)
      }

      var scaleDelta =
        normalized > 0 ? 1 / this.zoom.scaleFactor : this.zoom.scaleFactor

      point.x = event.clientX
      point.y = event.clientY

      var startPoint = point.matrixTransform(svg.getScreenCTM().inverse())

      var fromVars = {
        ease: this.zoom.ease,
        x: viewBox.x,
        y: viewBox.y,
        width: viewBox.width,
        height: viewBox.height
      }

      viewBox.x -= (startPoint.x - viewBox.x) * (scaleDelta - 1)
      viewBox.y -= (startPoint.y - viewBox.y) * (scaleDelta - 1)
      viewBox.width *= scaleDelta
      viewBox.height *= scaleDelta

      this.zoom.animation = TweenLite.from(
        viewBox,
        this.zoom.duration,
        fromVars
      )
    }
  },
  mounted() {
    TweenLite.set(pivot, { scale: 0 })

    var svg = document.querySelector('#svg')
    var viewport = document.querySelector('#viewport')

    var rotateThreshold = 4
    var reachedThreshold = false

    var point = svg.createSVGPoint()
    var startClient = svg.createSVGPoint()
    var startGlobal = svg.createSVGPoint()

    var viewBox = svg.viewBox.baseVal

    var cachedViewBox = {
      x: viewBox.x,
      y: viewBox.y,
      width: viewBox.width,
      height: viewBox.height
    }

    var pannable = new Draggable(proxy, {
      throwResistance: 3000,
      trigger: svg,
      throwProps: true,
      onPress: this.selectDraggable,
      onDrag: this.updateViewBox,
      onThrowUpdate: this.updateViewBox
    })

    // reset.addEventListener("click", resetViewport);
    window.addEventListener('wheel', this.onWheel)

    window.addEventListener('contextmenu', function(event) {
      event.preventDefault()
      event.stopPropagation()
      return false
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.svg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: move;
}

.svg-scrim {
  pointer-events: none;
  z-index: 5;
}

.proxy {
  fill: none;
  stroke: none;
}

.controls {
  position: fixed;
  top: 0;
  left: 0;
  padding: 12px;
  z-index: 10;

  .controls-button {
    font-weight: 700;
  }
}

.info {
  user-select: none;
  pointer-events: none;

  ul {
    font-size: 13px;
    list-style-type: none;
    padding: 0;
    line-height: 20px;
    margin-top: 0;
  }
}

.svg-background {
  fill: none;
  stroke: none;
}

.pivot {
  fill: #ffc107;
  stroke: rgba(0, 0, 0, 0.5);
  stroke-width: 2;
  opacity: 0;
}
</style>
