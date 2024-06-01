const vertexShaderTxt = `
    precision mediump float;

    uniform mat4 mWorld;
    uniform mat4 mView;
    uniform mat4 mProjection;
    
    attribute vec3 vertPosition;
    attribute vec3 vertColor;

    varying vec3 fragColor;

    void main() {
        fragColor = vertColor;
        gl_Position = mProjection * mView * mWorld * vec4(vertPosition, 1.0);
    }
`
const fragmentShaderTxt = `
    precision mediump float;

    varying vec3 fragColor;

    void main() {
        gl_FragColor = vec4(fragColor, 1.0);
    }
`
const mat4 = glMatrix.mat4;

function generateBox(position, size) {      //generate_box([x,y,z], s)   ----output---->   boxVertices, boxIndices
    const [x, y, z] = position;     
    const s = size / 2;

    const boxVertices = [
        //Top
        x - s, y + s, z - s, //0
        x - s, y + s, z + s, //1
        x + s, y + s, z + s, //2
        x + s, y + s, z - s, //3

        //Bottom
        x - s, y - s, z - s, //4
        x - s, y - s, z + s, //5
        x + s, y - s, z + s, //6
        x + s, y - s, z - s, //7
    ];

    const boxIndices = [
        //Top
        0, 1, 2,
        0, 2, 3,

        //Left
        4, 5, 1,
        4, 1, 0,

        //Right
        3, 2, 6,
        3, 6, 7,

        //Front
        1, 5, 6,
        1, 6, 2,

        //Back
        4, 0, 3,
        4, 3, 7,

        //Bottom
        7, 6, 5,
        7, 5, 4,
    ];

    return { boxVertices, boxIndices };
}

const Box = function (position, size) {
    const canvas = document.getElementById('main-canvas');
    const gl = canvas.getContext('webgl');
    let canvasColor = [0.2, 0.5, 0.8]

    checkGl(gl);

    gl.clearColor(...canvasColor, 1.0);   // R, G, B,  A 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);       //zeby nie renderowac caly czas wszystkich scian

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderTxt);
    gl.shaderSource(fragmentShader, fragmentShaderTxt);

    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    checkShaderCompile(gl, vertexShader);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);

    gl.validateProgram(program);

    const { boxVertices, boxIndices } = generateBox(position, size);          //generowanie wierzcholkow i indeksow

    //z tego miejsca wyrzucono ręcznie podane wierzcholki

    let colors = [
        1.0, 0.0, 0.2,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,
        0.0, 0.1, 0.0,

        1.0, 0.0, 0.2,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,
        0.0, 0.1, 0.0,

        1.0, 0.0, 0.2,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,
        0.0, 0.1, 0.0,

        1.0, 0.0, 0.2,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,
        0.0, 0.1, 0.0,

        1.0, 0.0, 0.2,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,
        0.0, 0.1, 0.0,

        1.0, 0.0, 0.2,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,
        0.0, 0.1, 0.0,
    ]

    const boxVertBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);
    
    const boxIndicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(boxIndices), gl.STATIC_DRAW);

    const posAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
        posAttribLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        3 * Float32Array.BYTES_PER_ELEMENT,
        0
    );
    gl.enableVertexAttribArray(posAttribLocation);

    const boxColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    
    const colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        colorAttribLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        3 * Float32Array.BYTES_PER_ELEMENT,
        0,
    );
    gl.enableVertexAttribArray(colorAttribLocation);
    
    //render time

    gl.useProgram(program);

    const worldMatLoc = gl.getUniformLocation(program, 'mWorld');
    const viewMatLoc = gl.getUniformLocation(program, 'mView');
    const projectionMatLoc = gl.getUniformLocation(program, 'mProjection');

    const worldMatrix = mat4.create();
    const viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, [0,0,-4], [0,0,0], [0,1,0]);
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, glMatrix.glMatrix.toRadian(60), 
                    canvas.width/canvas.height, 1, 10)

    gl.uniformMatrix4fv(worldMatLoc, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(viewMatLoc, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(projectionMatLoc, gl.FALSE, projectionMatrix);

    const identityMat = mat4.create();
    let angle = 0;

    const loop = function () {
        angle = performance.now() / 1000 / 60 * 23 * Math.PI;
        mat4.rotate(worldMatrix, identityMat, angle, [1,1,-0.5]);
        gl.uniformMatrix4fv(worldMatLoc, gl.FALSE, worldMatrix);
        
        gl.clearColor(...canvasColor, 1.0);   // R, G, B,  A 
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(loop);        
    }

    requestAnimationFrame(loop);
} 


function checkGl(gl) {
    if (!gl) {console.log('WebGL not suppoerted, use another browser');}
}

function checkShaderCompile(gl, shader) {
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('shader not compiled', gl.getShaderInfoLog(shader));
    }
}

function checkLink(gl, program) {
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('linking error', gl.getProgramInfoLog(program));
    }
}