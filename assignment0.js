import vertexShaderSrc from './vertex.glsl.js';
import fragmentShaderSrc from './fragment.glsl.js';

var gl;
var program;
var vao;
var uniformLoc;
var currColor;
var newColor;
var currTri;
var animRunning = false;
var start;
var ntraingle;

var user_mode =true;
var data;

var ccon = document.querySelector("#user-config"); //checkbox for panel mode
var cfile = document.querySelector("#file"); //checkbox for json file 

var vao2;

// check for config panel 
ccon.onchange = function(){

    if(ccon.checked == true){
        cfile.checked = false; 
        
        user_mode =true; 
    }
    else { //strict to  tick again, when trying untick this box by click itself
        ccon.checked =true;
    }
    
    
};

// check for file 
cfile.onclick = function(){
    //dataArr();
    if(cfile.checked == true){
    
        ccon.checked =false;
        user_mode =false;

        
    }
    else{ 
        cfile.checked =true;
    }
};

function sliderAdjust(new_max){
    var previous_max = document.querySelector("#sliderN").max ; 
   
    document.querySelector("#sliderN").max = new_max
    document.querySelector("#sliderN").value = ntraingle*(new_max/previous_max)
    ntraingle =  document.querySelector("#sliderN").value ;
    
}
// open file
window.openFile = function(event) {
    var input = event.target;
  
    var reader = new FileReader();
    reader.onload = function(){

        try {
            var c= JSON.parse(reader.result);
            if( !("colors" in c) || !("positions" in c)){
                throw "no colors and positions attribute"
            }
            var color  = c["colors"].length;
            var position =  c["positions"].length;
            console.log("pos-: "+position);
            console.log("col-: "+color);
            if( color%12 == 0 && position%9==0 && parseInt(color*3/4)== position){
        
            var colorAttLoc = gl.getAttribLocation(program,"color");
            var posAttLoc = gl.getAttribLocation(program,"position") ;
            var posBuf = createBuffer(c['positions']);  
            var colBuf = createBuffer(c['colors']); 
        
            vao2 = createVAO(posAttLoc,posBuf, colorAttLoc,colBuf);  
            sliderAdjust(color/12);
           }
           else{
               throw "invalid size to create complete triangle/color  OR  color/color size no match"; 
           }
           
        }
        catch(error){
            window.alert(error);
        }
    

    };
    reader.readAsText(input.files[0]);
  
} 




function draw(){
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT); 
    
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.useProgram(program);
    
    ntraingle =updateN();
    if(!user_mode){
       console.log("no user_mode");
        gl.uniform1i(gl.getUniformLocation(program,'c_user'),0);    
        gl.bindVertexArray(vao2); 
    }
    else{
        console.log("user mode");
        gl.uniform1i(gl.getUniformLocation(program,'c_user'),1);
       
        gl.uniform4fv(uniformLoc, new Float32Array(currColor)); 
        gl.bindVertexArray(vao2); 
        
    }
    gl.drawArrays(gl.TRIANGLES,0, 3*ntraingle);

    requestAnimationFrame(draw);
}

function updateC(){
    var r = parseInt(document.querySelector("#sliderR").value)/255.0;
    var g = parseInt(document.querySelector("#sliderG").value)/255.0;
    var b = parseInt(document.querySelector("#sliderB").value)/255.0;
    var a = parseInt(document.querySelector("#sliderA").value)/255.0;
    return [r,g,b,a]; 
}

window.updateColor = function(){
    
    currColor = updateC(); //depend slider R,G,B,A 
  
}
function updateN(){
    return parseInt(document.querySelector("#sliderN").value); 
}


function createBuffer(vertices) {
    var buffer= gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    return buffer;
}
function createShader(type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader,source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS) ) {
        var info = gl.getShaderInfoLog(shader);
        console.log('Could not compile WebGL program:' + info);
    }
    
    return shader;
}
function createProgram(vertexShader, fragmentShader) {
    var program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS) ) {
        var info = gl.getProgramInfoLog(program);
        console.log('Could not compile WebGL program:' + info);
    }

    return program;
}






function createTraingle(ng){
    var positions =[] ;
    var  colors = [];
    for(var i =0; i<ng;i++){
        var size =((2* Math.random())-1)*0.25;
        var x= (2* Math.random())-1;
        var y = (2* Math.random())-1;
        var pos =  [x,y,0,
            x-size,y-size,0,
            x+size,y-size,0
        ];
        //console.log([x,y])
        positions = positions.concat(pos);

    }
    for(var i = 0;i<ng ;i++){
    var color = [
        1,0,0,0.5,
        0,1,0,1,
        0,0,1,1
    ];
    colors = colors.concat(color);
    }

    
    
   
    
    return {"positions":positions ,"colors":colors };

}

// create VAO with enable position and color attribute and let tell  shader how to process VBO 
function createVAO(posAttribLoc,  posBuffer,colorAttribLoc,colorBuffer ){
    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.enableVertexAttribArray(posAttribLoc);
    var size = 3; // number of components per attribute
     var type = gl.FLOAT;
     var normalization = false;
     var stride =0; // offset in bytes to next attribute
    var offset = 0;
    gl.vertexAttribPointer(posAttribLoc, size, type, false, stride, offset);

    gl.enableVertexAttribArray(colorAttribLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
     size= 4;
    type = gl.FLOAT;
    normalization = false;
     stride = 0; 
    offset = 0;
    gl.vertexAttribPointer(colorAttribLoc, size, type, normalization, stride, offset); 
    return vao;
}

// initialize state 
function initialize(){

    var canvas = document.querySelector("#glcanvas");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

   gl = canvas.getContext("webgl2");
   
 
   ntraingle = updateN();
   currColor = updateC();
   console.log(ntraingle);
  

   var vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSrc);
   var fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSrc);
   program = createProgram(vertexShader, fragmentShader);


   
   uniformLoc = gl.getUniformLocation(program,"colo");

 

   window.requestAnimationFrame(draw);
}
window.onload = initialize();