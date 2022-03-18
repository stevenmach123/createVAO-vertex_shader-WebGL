# spring-2021-assignment-0-stevenmach123
spring-2021-assignment-0-stevenmach123 created by GitHub Classroom
### How the program run
  - First, you see nothing when try all slider or check box. Until you load a JSON file. This file immediately reflected based on sliders rgba an sliderN , and what color for triangles based on current checkbox selective 
  
 - SliderN change number of triangles in both mode, while slider rgba change color of triangles in user-config
 
 - Upload new file( incidate different amount of max triangle) slider will scale in both  max value perspective and selected value perspective. 
 
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
 
