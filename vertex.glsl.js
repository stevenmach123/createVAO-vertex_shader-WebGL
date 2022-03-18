export default `#version 300 es


uniform int c_user;

in vec3 position;
in vec4 color;


uniform vec4 colo;
out vec4 vColor;


void main() {
  if(c_user==0){
    vColor = color;
    gl_Position = vec4(position.xyz,1);
  }
  else {
   // vColor = vec4(color.rgb,color.a);
   vColor =vec4(colo.rgb,colo.a);
    gl_Position = vec4(position.xyz,1);
  }
}
`;