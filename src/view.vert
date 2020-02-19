# version 300 es
precision mediump float;
precision mediump int;

in vec3 position;
out vec2 coord;

uniform vec2 dimensions;

void main() {
  coord = position.xy;
  gl_Position = vec4(coord*2.0-1.0, 1.0, 1.0);
}
