#version 330 core
in vec2 ex_UV;
in vec4 ex_color;
out vec4 out_color;

// sampler2DRect / GL_TEXTURE_RECTANGLE don't exist in OpenGL ES (Android), so a plain 2D texture
// fetched by pixel coordinates is used instead. Same result, works on desktop GL and GLES.
uniform sampler2D tiles;

void main()
{
    ivec3 placed  = ivec3(texelFetch(tiles, ivec2(floor(ex_UV)), 0).rgb * 255.0);
    int index = (placed.b >> 3) | ((placed.g >> 2) << 5) | ((placed.r >> 3) << 11);
    if (index == 0)
        discard;
    out_color = vec4(placed, 1.0);
}