<script lang="typescript">
import Hammer from 'hammerjs'
import {onMount} from 'svelte'
import { LightField, View } from './view'
export let S: number 
export let T: number
export let H: number
export let W: number
export let src: string
let sz = 1

let WHCanvas: HTMLCanvasElement
let SHCanvas: HTMLCanvasElement
let WTCanvas: HTMLCanvasElement
let STCanvas: HTMLCanvasElement
const lightfield = new LightField()
let [s, t, h, w] = lightfield.position
$: {
let [s0, t0, h0, w0] = lightfield.dimensions
lightfield.position = [s/S*s0, t/T*t0, h/H*h0, w/W*w0].map(Math.round)
}

onMount(() => {
  let s0, t0, h0, w0;
  const mc_wh = new Hammer(WHCanvas)
  mc_wh.on('panstart', _ => [h0, w0] = [h, w])
  mc_wh.on('panmove', evt => [h, w] = [
    Math.min(Math.max(h0+evt.deltaY, 0), H),
    Math.min(Math.max(w0+evt.deltaX, 0), W)
  ])
  const mc_st = new Hammer(STCanvas)
  mc_st.on('panstart', _ => [s0, t0] = [s, t])
  mc_st.on('panmove', evt => [s, t] = [
    Math.min(Math.max(s0+evt.deltaX, 0), S),
    Math.min(Math.max(t0+evt.deltaY, 0), T)
  ])
  lightfield.load(src, [S, T, H, W])
  new View(WHCanvas, lightfield.uniforms('W', 'H')).animate()
  new View(SHCanvas, lightfield.uniforms('S', 'H')).animate()
  new View(WTCanvas, lightfield.uniforms('W', 'T')).animate()
  new View(STCanvas, lightfield.uniforms('S', 'T')).animate()
})
</script>

<template lang="pug">
.viewer.flex.flex-col.m-10
  .lines.relative
    .absolute.bg-black#H(style!="height: {sz}px; width: {W+S+4}px; transform: translate(1px, {h+1}px)")
    .absolute.bg-black#W(style!="height: {H+T+4}px; width: {sz}px; transform: translate({w+1}px, 1px)")
    .absolute.bg-black#S(style!="height: {H+T+4}px; width: {sz}px; transform: translate({W+s+3}px, 1px)")
    .absolute.bg-black#T(style!="height: {sz}px; width: {W+S+4}px; transform: translate(1px, {H+t+3}px)")
  .row.flex.flex-row
    canvas.WH.border(width!="{W}" height!="{H}" bind:this!="{WHCanvas}")
    canvas.SH.border(width!="{S}" height!="{H}" bind:this!="{SHCanvas}")
  .row.flex.flex-row
    canvas.WT.border(width!="{W}" height!="{T}" bind:this!="{WTCanvas}")
    canvas.ST.border(width!="{S}" height!="{T}" bind:this!="{STCanvas}")
</template>
