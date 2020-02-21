main();

//
// Start here
//
function main() {
  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl');

  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  const vsSource = {
    attribute vec4 aVertexPosition;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    void main() {
      gl_Position = uProjectionmatrix * uModelViewMatrix * a VertexPosition;
    }

    const fsSource =
      void main() {
        gl_Frag_Color = vec4(1.0, 1.0, 1.0, 1.0);
      }


    function initShaderProgram(gl, vsSource, fsSource) {
      const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
      const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

      // create shader program.
      const shaderProgram = gl.createProgram();
      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);

      // if creating the shadder proogram failed, alert.

      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(shaderProgram));
        return null;
      }

      return shaderProgram;
    }

    /* creates a shader of the given type,
     uploads the source and compiles it. */
    function loadShader(gl, type, source) {
      const shader = gl.createShader(type);

      // send the source to the shader object.
      gl.shaderSource(shader, source);

      // compile the shader program.
      gl.compileShader(shader);

      // see if it compiled successfully.
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("An error occured compiling the shader: " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    }

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
          vertexPosition: gl.getAtttribLocation(shaderProgram, 'aVertexPosition'),
        },
        uniformLocations: {
          projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
          modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        },
      }:

      function initBuffers(gl) {

        // create a buffer for the square's positions.
        const positionBuffer = gl.createBuffer();

        // select the positionBuffer as the one to apply buffer
        // operations to from here out.
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // now create an array of positions for the square.
        const positions = [
          -1.0, 1.0,
          1.0, 1.0,
          -1.0, -1.0,
          1.0, -1.0,
        ];

        // now pass the list of positions into WebGL to build the
        // shape. We do this by creating a Float32Array from the
        // JavaScript array, then use it to fill the current buffer.

        gl.bufferData(gl.ARRAY_BUFFER,
          new Float32Array(positions),
          gl.STATIC_DRAW);

        return {
          position: positionBuffer,
        };
      }

    function drawScene(gl, programInfo, buffers) {
      gl.clearColor(0.0, 0.0, 0.0, 1.0); // clear to black, fully opaque.
      gl.clearDepth(1.0); // clear everything.
      gl.enable(gl.DEPTH_TEST); // enable depth testing.
      gl.depthFunc(gl.LEQUAL); // near objects obscure far things.

      // clear the canvas before we start drawing on it.

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      /* create a perspective matrix, a special matrix that is
      used to simulate the distortion of perspective in a camera.
      our field of view is 45 degrees, with a width/height
      ratio that matches the display size of the canvas
      and we only want to see objects between 0..1 units and 100 units away from camera. */
      const fieldOfView = 45 * Math.PI / 180; // in radians
      const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      const zNear = 0.1;
      const zFar = 100.0;
      const projectionMatrix = mat4.create();

      // NOTE: glmatrix.js always has the first argument
      // as the destination to recieve the result.
      mat4.perspective(proectionMatrix,
        fieldOfView,
        aspect,
        zNear,
        zFar);

      /* set the drawing position a bit to where we want
      to start the drawing. */
      const modelViewMatrix = mat4.create();

      /* now move the drawing position a bit to where we want
      to start the drawing the square */
      mat4.translate(modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to translate
        [-0.0, 0.0, -6.0]) // amount to translate

      /* tell WebGL how to pull out positions from the positions
      buffer into the vertexPosition attribute. */
      {
        const numComponents = 2; //pull out 2 values per iteration
        const type = gl.FLOAT; // the data in the buffer is 32bit
        const normalize = false; // don't normalize
        const stride = 0;
        /* how many bytes to get from one
                             set of values to the next. */
        /* 0 = use type and numComponents above */
        const offset = 0;
        /* how many bytes inside the buffer
                             to start from. */
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(
          programInfo.attribLocations.vertexPosition,
          numComponents,
          type,
          normalize,
          stride,
          offset);
        gl.enableVertexAttribArray(
          programInfo.attribLocations.vertexPosition);
      }

      // tell WebGL to use our program when drawing.
      gl.useProgram(programInfo.program);

      // set the shader uniforms.
      gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
      gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix); {
        const offset = 0;
        const vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
      }
    }
  }
}
