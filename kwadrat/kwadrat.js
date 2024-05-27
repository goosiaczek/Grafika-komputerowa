console.error('works');
const vertexShaderTxt = `
    precision mediump float;

    attribute vec2 vertPosition;
    attribute vec3 vertColor;

    varying vec3 fragColor;

    void main() {
        fragColor = vertColor;
        gl_Position = vec4(vertPosition, 0.0, 1.0);
    }
`
const fragmentShaderTxt = `
    precision mediump float;

    varying vec3 fragColor;

    void main() {
        gl_FragColor = vec4(fragColor, 1.0);
    }
`

const Square = function () {
    const canvas = document.getElementById('main-canvas');
    const gl = canvas.getContext('webgl');
    let canvasColor = [0.2, 0.5, 1.0]          //kolor tla (canvasa)

    checkGl(gl);

    gl.clearColor(...canvasColor, 1.0);   //czyscimy kolor, sklada sie z R, G, B i przezroczystosci  A 
    gl.clear(gl.COLOR_BUFFER_BIT);

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

    let squareVerts = [
     // X, Y              R   G    B        //płaszczyzna dwuwymiarowa, osie X i Y oraz kolory w trzech kanalach
        -0.5, 0.5,      1.0, 0.0, 0.0,      //lewy gorny    
        -0.5, -0.5,     0.0, 1.0, 0.0,      //lewy dolny
        0.5, -0.5,      0.0, 0.0, 1.0,      //prawy dolny
        -0.5, 0.5,      1.0, 0.0, 0.0,      //lewy gorny 2
        0.5, -0.5,      0.0, 0.0, 1.0,      //prawy dolny 2          
        0.5, 0.5,       1.0, 0.7, 0.0       //prawy gorny             
    ];

    //let squareIndices = [     dwa wierzcholki sa wspolne, wiec mniej miejsca zajeloby podanie indeksow niz kordow kazdego wierzcholka osobno...
       // 0, 1, 2,
       // 0, 2, 3
    //];

    const squareVertBuffer = gl.createBuffer();         //bufor na kordy wierzcholkow
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareVerts), gl.STATIC_DRAW);

    //const squareIndicesBuffer = gl.createBuffer();        jesli uzywalibysmy indeksow
   // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareIndicesBuffer);
   // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(squareIndices), gl.STATIC_DRAW);
    
    const posAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
        posAttribLocation,
        2,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        0
    );
    gl.enableVertexAttribArray(posAttribLocation);

    const colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        colorAttribLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        2 * Float32Array.BYTES_PER_ELEMENT,         //offset
    );
    gl.enableVertexAttribArray(colorAttribLocation);
    
    // render time

    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 6);      //6 wierzcholkow bo dwa trojkaty

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