const canvas = document.querySelector('canvas');
canvas.width = 800;
canvas.height = 800;

const gl = canvas.getContext('webgl');

if (!gl) {
  throw new Error('WebGL not supported');
}

gl.clearColor(0.242, 0.102, 0.139, 1.0); 
gl.clear(gl.COLOR_BUFFER_BIT);

const triangleVertices = [
  0.0, 0.9,   
  -0.1, -0.1, 
  0.9, -0.1   
];

const squareVertices = [
  -0.8, -0.8, 
  -0.2, -0.8,
  -0.2, -0.2,
  -0.8, -0.2
];

// Function to create shader
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile failed: ', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const vertexShaderSource = `
attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
precision mediump float;

void main() {
  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);  // Black color
}
`;

// Create shaders
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

var shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
  console.error('Shader program failed to link: ', gl.getProgramInfoLog(shaderProgram));
}

gl.useProgram(shaderProgram);

// Function to create and fill buffer
function createAndFillBuffer(data) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  return buffer;
}

// Create buffers
const triangleBuffer = createAndFillBuffer(triangleVertices);
const squareBuffer = createAndFillBuffer(squareVertices);

const positionAttributeLocation = gl.getAttribLocation(shaderProgram, 'a_position');
gl.enableVertexAttribArray(positionAttributeLocation);

// Draw triangle
gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
gl.drawArrays(gl.TRIANGLES, 0, 3);

// Draw square
gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

// It's a good practice to clean up by disabling the attribute array after use
gl.disableVertexAttribArray(positionAttributeLocation);