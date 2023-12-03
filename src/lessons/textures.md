# Geometry
Textures, as you probably know, are images that will cover the surface of your geometries. Many types of textures can have different effects on the appearance of your geometry. It's not just about the color.

Types of textures:
- Color: base colored image
- Alpha: level of opacity/transparency
- Height (or displacement) map: adjust the level of overlapping (you need enough subdivisions)
- Normal: a layer that add details about light. Does not need subdivisions. The vertices wont move (applying this layers instead of height will result in more performance)
- Occlusion: a layera that add shadows details and a sense of depth. It is not physically accurate
- Metalness: used to create reflection on metallic materials.
- Roughness: grayscale image in duo with the metalness. Used for light dissipation

There are many other types but thesere are the main ones

## PBR principles (physically based rendering):
- many technics that tend to follow real-life directions to get realistic resutls
- becoming the standard for realistic renders
- many software, engines and libraries are following PBR standard

## UV unwrapping
While it is quite logical how to place a texture on a cube, things can be a little trickier for other geometries (such as cones, torus, etc). In those case, the texture is being stretched or squeezed in different ways to cover the geometry.
That is called UV unwrapping. You can imagine that like unwrapping an origami or a candy wrap to make it flat. Each vertex will have a 2D coordinate on a flat (usually square) plane.

### MIPMAPPING
If you look at the cube's top face while this face is almost hidden, you'll see a blurry texture. That is due to the filtering and the mipmapping.

### MINIFICATION
Happens when the pixels of the texture are smaller that the pixels of the render. In other words, the texture is too big for the surface (maybe the object is too far away from the camera). You can change the minification filter of the texture using the minFilter property. There are 6 possible values:
- THREE.NearestFilter
- THREE.LinearFilter
- THREE.NearestMipmapNearestFilter
- THREE.NearestMipmapLinearFilter
- THREE.LinearMipmapNearestFilter
- THREE.LinearMipmapLinearFilter

The default is THREE.LinearMipmapLinearFilter. If you are not satisfied with how your texture looks, you should try the other filters.

### MAGNIFICATION
It is the opposite of the minification. Happens when the pixels of the texture are bigger than the pixels of the render. In other words, the texture is too small for the surface it covers. You can change the magnification filter of the texture using the magFilter property. There are only two possible values:
- THREE.NearestFilter (better performance)
- THREE.LinearFilter

The default is THREE.LinearFilter.If you test the THREE.NearestFilter, you'll see that the base image is preserved, and you get a pixelated texture

## Optimizing textures
When you are preparing your textures, you must keep 3 crucial elements in mind:
- The weight
- The size (or the resolution)
- The data

### The weight
Don't forget that the users going to your website will have to download those textures. You can use most of the types of images we use on the web like .jpg (lossy compression but usually lighter) or .png (lossless compression but usually heavier). Try to apply the usual methods to get an acceptable image but as light as possible. You can use compression websites like TinyPNG (also works with jpg) or any software.

### The size
Each pixel of the textures you are using will have to be stored on the GPU regardless of the image's weight. And like your hard drive, the GPU has storage limitations. It's even worse because the automatically generated mipmapping increases the number of pixels that have to be stored. Try to reduce the size of your images as much as possible.
If you are using a texture with a width or height different than a power of 2 value, Three.js will try to stretch it to the closest power of 2 number, which can have visually poor results, and you'll also get a warning in the console.

### The data
We haven't tested it yet, because we have other things to see first, but textures support transparency. As you may know, jpg files don't have an alpha channel, so you might prefer using a png.

If you are using a normal texture (the purple one), you will probably want to have the exact values for each pixel's red, green, and blue channels, or you might end up with visual glitches. For that, you'll need to use a png because its lossless compression will preserve the values.

## Where to find textures
Unfortunately, it's always hard to find the perfect textures. There are many websites, but the textures aren't always right, and you may have to pay. It's probably a good idea to start by searching on the web. Here are some websites I frequently end up on.
- poliigon.com
- 3dtextures.me
- arroway-textures.ch

Always make sure that you have the right to use the texture if it's not for personal usage. You can also create your own using photos and 2D software like Photoshop or even procedural textures with software like Substance Designer.