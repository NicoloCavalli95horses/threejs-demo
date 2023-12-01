# Geometry
In Three.js, geometries are composed of vertices (point coordinates in 3D spaces) and faces (triangles that join those vertices to create a surface).

We use geometries to create meshes, but you can also use geometries to form particles. Each vertex (singular of vertices) will correspond to a particle, but this is for a future lesson.

We can store more data than the position in the vertices. A good example would be to talk about the UV coordinates or the normals. 

## Build in geometries
Three.js has many built-in geometries. While you don't need to know precisely how to instantiate each one, it is good to know that they exist. All the built-in geometries we are going to see inherit from the BufferGeometry class. This class has many built in methods like translate(...), rotateX(...), normalize(), etc.
Most of the geometries documentation pages have examples.

- BoxGeometry: To create a box.
- PlaneGeometry: To create a rectangle plane.
- CircleGeometry: To create a disc or a portion of a disc (like a pie chart).
- ConeGeometry: To create a cone or a portion of a cone. You can open or close the base of the cone.
- CylinderGeometry: To create a cylinder. You can open or close the ends of the cylinder and you can change the radius of each end.
- RingGeometry: To create a flat ring or portion of a flat circle.
- TorusGeometry: To create a ring that has a thickness (like a donut) or portion of a ring.
- TorusKnotGeometry: To create some sort of knot geometry.
- DodecahedronGeometry: To create a 12 faces sphere. You can add details for a rounder sphere.
- OctahedronGeometry: To create a 8 faces sphere. You can add details for a rounder sphere.
- TetrahedronGeometry: To create a 4 faces sphere (it won't be much of a sphere if you don't increase details). You can add details for a rounder sphere.
- IcosahedronGeometry: To create a sphere composed of triangles that have roughly the same size.
- SphereGeometry: To create the most popular type of sphere where faces looks like quads (quads are just a combination of two triangles).
- ShapeGeometry: To create a shape based on a path.
- TubeGeometry: To create a tube following a path.
- ExtrudeGeometry: To create an extrusion based on a path. You can add and control the bevel.
- LatheGeometry: To create a vase or portion of a vase (more like a revolution).
- TextGeometry: To create a 3D text. You'll have to provide the font in typeface json format.

If you need a particular geometry that is not supported by Three.js, you can create your own geometry in JavaScript, or you can make it in a 3D software, export it and import it into your project. We will learn more about that later.