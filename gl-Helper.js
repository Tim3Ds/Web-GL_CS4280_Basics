var initWebGL = function(canvas){
    var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!gl) {
        alert("Unable To start WebGL: Your Browser dose not support it")
    }
    return gl
}
var getShader = function(gl, kind, script){
    gl.shaderSource(kind, script);
    gl.compileShader(kind);
}
var initShaders = function(gl, vs_script, fs_script){
    // Process Fragment shader
    var v_shader = gl.createShader(gl.VERTEX_SHADER);
    getShader(gl, v_shader, vs_script);
    
    // Process Fragment shader
    var f_shader = gl.createShader(gl.FRAGMENT_SHADER);
    getShader(gl, f_shader, fs_script);
    
    // Create a shader program from both vertex and fragment shaders
    var program = gl.createProgram();
    gl.attachShader(program, v_shader);
    gl.attachShader(program, f_shader);
    gl.linkProgram(program);
    gl.useProgram(program);

    return program;
}
var initBuffers = function(gl, program, data){
    var Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, Buffer);// load any existing data into buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    // Pass coordinates to vertex shader
    var coordinates = gl.getAttribLocation(program, "coordinates");
    gl.vertexAttribPointer(coordinates, 3, gl.FLOAT, false, 0, 0); 
    gl.enableVertexAttribArray(coordinates);
    if(coordinates < 0){
        console.log('Unable to get location of coordinates');
        return;
    }
    
}

var render = function(gl){
    // Render
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    // CLEAR BOTH COLOR_BUFFER_BIT and DEPTH_BUFFER_BIT
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}