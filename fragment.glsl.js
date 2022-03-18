export default `#version 300 es
precision highp float;

in vec4 vColor;
out vec4 outColor;

//uniform vec4 uColor;

void main() {
    outColor = vec4(vColor.rgb,vColor.a);


    //outColor = vec4(uColor.rgb,uColor.a); 
   //outColor = uColor;
    //outColor = vColor;
}
`;