# version 300 es
precision mediump float;
precision mediump int;

out vec4 colour; 
in vec2 coord;

uniform sampler2D lightfield;
uniform vec2 stride;
uniform vec2 offset;
uniform vec2 dimensions;

void main() {
  ivec2 uv = ivec2(gl_FragCoord.xy*stride+offset);
  colour = texelFetch(lightfield, uv, 0);
  /* colour = vec4(coord, 0.0, 1.0); */
}
