## Computer Graphic Project 
## Link
   - https://stevenmach123.github.io/createVAO-vertex_shader-WebGL/
### How the program work
  1. Download or clone repository first, then open the link
  2. Ask **choose file**, choose between **example0.json** or **uic.json**  (first you see nothing)
  3. Until you load a JSON file. This file immediately reflected based on sliders rgba (color combination) and sliderN (number of traingle)
  4. Once file uploaded, Options for 2 checkboxs:
      - If choose, **User Config** checkbox, you can modify color of vertex shaders and their SliderN.
      - If choose, **File Update** checkbox, you can only modify their SliderN (as color has been configured) 
  5. Upload different file (incidate different amount of max triangle) slider will scale in its max-min value, and reflect on currently selected input perspective. 
 
 ### Some methods functionality 
 
 #### Main function involved:On Draw(), initialize() 
 - Functionality of change color by slider rgba  when in “user-configure”  checkbox, provoked by gl.uniform4fv(uniformLoc, new Float32Array(currColor)); Here, the currColor constantly updated by  window.updateColor() and updateC(); 
 
 - On updateN() :  update number of triangle  that configuration panel slider change value, which reflect when updateN() constantly called on Draw() 
 
 - Meanwhile, functionality of change color by slider rgba disable when in “File-load” checkbox, provoked by gl.bindVertexArray(vao2). Here, certain color provided for each vertice on file. So this case, only sliderN  can change number of triangle
    -	Then you can change slider rgba (even color of user mode not reflected).But later, change the checkbox to “user-configure” the color will update based on current change. 

#### Main function involved:  Vertex-shader.glsl, Draw(), createVAO() 
- In vertex-shader.glsl, c_user will respond changes  between color mode, *[this provoked by gl.uniform1i(gl.getUniformLocation(program,'c_user'),0 or 1) in Draw() assign value from js to vertex-shader].* 
   - c_user == 0: “color” data sent  from vao2 when  gl.bindVertexArray(vao2) called in Draw() [vao2 bind to position and color/position vertex buffer array  ] , while gl_Position: take position data from vao2. This indicate vao2 take color array from file upload. 
   - c_user ==1: “color” data sent from  gl.uniform4fv(uniformLoc, new Float32Array(currColor)). This indicate color respond to change from currColor. 
   - Those color assigned to vColor, then to  fragment.glsl to output.
#### Main function involved: window.openFile, sliderAdjust(), and  createVAO() 
- Everytime, onload() called, we create new vao2, but before that need change file. 
- If pass valid file,  posBuf and colBuf will intake new buffer color and position array to create update new vao2 
- sliderAdjust,sliderN will scale both in max value perspective and current value perspective. 
 
