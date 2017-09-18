/*
 * File: webgl_helper.js 
 * Description: a helper class for the webgl programs of cs4280
 * Version: 1.0.0
 * Last updated at: sep 7, 2017
 * By: Abdulmalek Al-Gahmi
 */

// Initializes WebGL
function initWebGL(canvas) {
  var ctx = null;
  ctx = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

  if (!ctx) {
    alert("Unable to initialize WebGL; your browser may not support it.");
  }
  
  return ctx;
}

// Creates and compiles a shader
function getShader(gl, kind, script){
  var shader = gl.createShader(kind);
  gl.shaderSource(shader, script);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw (kind == gl.VERTEX_SHADER? "vertex" : "fragment") + " compile error: " + gl.getShaderInfoLog(shader);
  }

  return shader;
}

// Creates and links a program using the given scripts.
function initShaders(gl, vs_script, fs_script){
  var v_shader = getShader(gl, gl.VERTEX_SHADER, vs_script);
  var f_shader = getShader(gl, gl.FRAGMENT_SHADER, fs_script);

  var program = gl.createProgram();
  gl.attachShader(program, v_shader);
  gl.attachShader(program, f_shader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw ("Linking error: " + gl.getProgramInfoLog (program));
  }

  return program;
}

/* Initializes and enables one or more buffers for the given 
   attributes data which is expected to be of the following form:
  
   data[{
     name: "attribute_name",
     size: 3,
     data: vertices array or number of vertices to reserve memory 
           for or undefined if buffer was defined in a previous element,
     stride: how many floats in per vertex data,
     offset: at what index within the per vertex 
             data the item's portion of data starts
   }]
*/
function initBuffers(gl, program, data){
  var buffers = {}
  var fSize = Float32Array.BYTES_PER_ELEMENT;
  data.forEach(function(item){
    if(item.data !== undefined){
      // Create the buffer
      var buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      
      if(typeof(item.data) !== 'number'){
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(item.data), gl.STATIC_DRAW);
      }else{
        gl.bufferData(gl.ARRAY_BUFFER, fSize * item.size * item.data, gl.STATIC_DRAW);
      }
    }

    // Get the location of and enable the attribute
    var attribute = gl.getAttribLocation(program, item.name);
    var stride = fSize * (item.stride || 0);
    var offset = fSize * (item.offset || 0);
    gl.vertexAttribPointer(attribute, item.size, gl.FLOAT, false, stride, offset); 
    gl.enableVertexAttribArray(attribute);
    
    buffers[item.name] = buffer;
  });
  
  return buffers;
}

// Clears the canvas and sets the background color.
function clear(gl, color){
  gl.clearColor(...color);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}
