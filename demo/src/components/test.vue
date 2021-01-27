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
import { gsap } from "gsap";
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
     
    }
  },
  methods: {
   
  },
  mounted() {
   Draggable.create("#svg").enable()
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
