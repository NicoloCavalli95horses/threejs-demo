#Lesson 04 - Transform objects

There are 4 properties to transform objects in our scene

1. position (to move the object)
2. scale (to resize the object)
3. rotation (to rotate the object)
4. quaternion (to also rotate the object; more about that later)

All classes that inherit from the Object3D class possess those properties like PerspectiveCamera or Mesh.
Those properties will be compiled in what we call matrices. Matrices are used internally by Three.js, by the WebGL, and by the GPU to transform things. 

1. Position
Position has three properties: x, y, z.
The position property is not any object. It's an instance of the Vector3 class. While this class has an x, a y, and a z property, it also has many useful methods.
- position.length()
- position.distanceTo(camera.position)
- position.normalize()

To change the values, instead of changing x, y and z separately, you can also use the set(...) method:
- mesh.position.set(0.7, -0.6, 1) //x, y, z

mesh.reorder('YXZ') // the order of the rotation is changed. Y axes is moved first

4. Quaternion
Similar to the rotation property, it has to deal with other mathematical aspects of rotation. When you change a rotation, you change also the quaternion properties, and viceversa.

camera.lookAt( mesh.position ) // this automatically orientate the camera towars a 3D object


##Groups
const group = new THREE.Group();
scene.add(group);

const cube1 = new THREE.Mesh( ..., ... );
const cube2 = new THREE.Mesh( ..., ... );
const cube3 = new THREE.Mesh( ..., ... );

group.add(cube1);
group.add(cube2);
group.add(cube3);

You can apply all the previous method (scale, rotation) to a group

group.position.y = 1,
group.scale.y = 3,