# Introduction to rendering with three.js

![Teaser image](/media/docs/poster.png)

- Duration: 2+ hours
- Prerequisets:
    - Some javascript programming knowledge
    - Visual Studio Code

This Fraunhofer Singapore workshop is an introduction to 3D rendering and the GPU rasterization pipeline, focusing on the technical implementation of core rendering concepts on the web (WebGL) using the three.js graphics library. At the end of the workshop, you will understand how 3D data are represented and processed by the GPU rasterization pipeline, and you will be able to render a complex 3D model.

The three.js library abstracts away many WebGL specific terminologies and provides many useful features and functions that are required in 3D rendering, such as scene and material management, camera and controls, 3D model and texture importers, and a wealth of predefined shaders, geometries, lights, and rendering paradigms.
While the technicalities of the workshop may be specific to three.js, the rendering concepts you will learn apply to the modern GPU rasterization pipeline.

I will explain how 3D data are represented (triangles, vertex, index buffers), how these data are transformed in each stage of the graphics pipeline, focusing on the vertex and fragment shaders, and how meshes are shaded (Lambertian shading model).

Participate in a hands-on implementation walkthrough of the covered rendering concepts to create a textured block of dirt, which hopefully with more data, translates to a breathtaking real-life monastery!

## Resources

- Lecture slides: [Download](./download/course.pptx)
- Walkthrough source code: [GitHub](https://github.com/jingquanalex/workshop_threejs_2021)
- Media (texture and gltf model): [Download](./download/media.zip)

# Implementation walkthrough

This walkthrough is split into several parts, each building on top of the previous part. In each part, we will learn about a feature of three.js or a rendering concept, and implement it in code. The starting code is provided in each part in the [./src](./src/) folder.

### Overview

1. **Setup the development environment.** We will use Visual Studio Code. Hello Three.js! Try out the provided Three.js sample code to ensure WebGL rendering capabilities. Initialize the Three.js library, the rendering loop, and create a spinning cube.
3.  **Use the Three.js defined objects to add a cube, ambient, and direction lights in the scene.** Create a Lambert material to shade the cube. Initialize the orbit camera and control object and visualize the global axis to orient yourself in the world.
4.  **It’s time to create your cube.** Define the vertices and indices of a unit cube. You also need access to normal information for each triangle for shading. Notice that you can’t share normal information at each vertex for multiple triangles when using an index buffer. Hence, you must define positional and normal info for all triangle vertices. Apply this geometry buffer in place of the Three.js’s box geometry.
5.  **Create your vertex and fragment shader material (with Lambert shading) to use in place of Three.js Lambert material.** Notice Three.js provides predefined uniforms for transformation matrices and vertex attributes. In the fragment shader, replicate the Lambert shading model (N.L) with the Three.js defined ambient and directional light, as well as the object color. Note how those ShaderMaterial uniforms are defined and how they are updated. Ensure colors are provided in linear space.
6.  **Time to texture the cube to make it look more like a Minecraft block of dirt.** Define the texture coordinate buffer. Load the dirt texture. Modify the ShaderMaterial to include UV vertex component and the texture sampler and the shading model to include the diffuse texture factor. The texture doesn’t look ‘blocky’ enough? Apply nearest neighbor filtering when sampling texture. Don’t forget to assign the texture to the ShaderMaterial and try it out on the Three.js Lambert material first to make sure it’s loaded and working.
7.  **Import the monastery GLTF model using the Three.js GLTF importer.** The GLTF contains position, normal, and texture coordinate buffers, and associated textures which are automatically parsed by Three.js to initialize the MeshBasicMaterial, which is applied to every mesh in the GLTF scene.

# Part 1: Setup the development environment

- Install Visual Studio code (VSCode): https://code.visualstudio.com/
- Install the Live server extension for VS code.

![figure](/media/docs/p1.png)

We will use the VSCode extension 'Live Server' to host our three.js webpage and serve 3D content (texture, GLTF model) for rendering. We need a server to serve content due to the Cross-Origin Resource Sharing (CORS) policy, which restricts browsers from fetching files originating from other directories or domains.

- Create a new directory for your three.js project and navigate to it (Open Folder... in VSCode).
- We can use the npm package manager (install via Node.js: https://nodejs.org/en/download/) to retrieve the three.js source code into the current directory using the following command: `npm i three` in the VSCode terminal (Ctrl + `).
- Create a 'media' folder where we will store 3D models and textures, as well as a 'src' folder to store our source code.
- [Download](./download/media.zip) the media content and place in the 'media' folder.

Your project folder structure should now look like:
> - node_modules
>     - three
> - media
> - src

### Part 2: Initialize three.js

We will now create the HTML webpage that will run some javascript to initialize three.js, the WebGL rendering context, and set up the components for our three.js scene. You may obtain the starting code from the [./src/part1](./src/part1) folder or copy the code below.

> Note: Make sure that the relative paths to fetch your script files within the HTML script tags or media files specified in your javascript are correct.

- Create an 'index.html' file in the [./src](./src/) folder and add the following code:
```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <link rel="icon" href="data:,">
    <title>ThreeJS Workshop</title>
    <style>
        body {
            margin: 0;
        }
    </style>
</head>

<body>
    <script src="../node_modules/three/build/three.js"></script>
    <script src="main.js"></script>
</body>

</html>
```

When the webpage is loaded, the scripts in the body section of the HTML are executed. The three.js script imports all of the three.js library objects (e.g. Scene, PerspectiveCamera, BoxGeometry, DirectionalLight...) used for rendering, which we can later call in our main.js script.

- Create a 'main.js' file in the [./src](./src/) folder and add the following code sections:

```javascript
// Create the webgl rendering context
const renderer = new THREE.WebGLRenderer();
// Set the viewport size to the current window dimension
renderer.setSize(window.innerWidth, window.innerHeight);
// Set a clear color so it's easier to catch errors
renderer.setClearColor(new THREE.Color(0.3, 0.35, 0.4));
// Set renderer to automatically covert output colors to sRGB space
renderer.outputEncoding = THREE.sRGBEncoding;
// Add the rendering context canvas to the html body
document.body.appendChild(renderer.domElement);
```

We first create the WebGL rendering context, define the renderer size, the color to clear fragments, and the color space encoding type of the output, and append the renderer DOM element to the HTML body. The size of the renderer is also the size of the renderer viewport (in the `<canvas>` tag), as well as the framebuffer size that images are rendered into.

```javascript
// The threejs scene manager
const scene = new THREE.Scene();
```
The `Scene` object contains Three.js objects that go into rendering such as meshes, materials, and lights. Objects in the scene are organized in a hierarchal tree structure and you can iterate the tree to select and process any objects.

```javascript
// Create a perspective camera, defining fov, aspect ratio, near plane, far plane
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Set the camera to position (0, 0, 5)
camera.position.z = 5;
```

The `PerspectiveCamera` object defines a perspective camera with a field of view parameter, an aspect ratio, and the distance to the near and far plane from the camera origin. We will set the camera position to (0, 0, 5) and it will face the (0, 0, -1) direction by default. These parameters form the viewing frustum of the camera and it defines the view matrix and the projection matrix used to transforms mesh vertices.

> Check out the tutorial here for a refresher of coordinate systems and transformation matrices: https://learnopengl.com/Getting-started/Coordinate-Systems


```javascript
// Create a Threejs box mesh to compare with our rendering result
const geometryBox = new THREE.BoxGeometry();

// A Material with flat color shading
const materialBasic = new THREE.MeshBasicMaterial({
    color: new THREE.Color(1, 0.85, 0.43).convertSRGBToLinear()
});

// Create the Threejs box mesh that uses materialBasic
const meshBox = new THREE.Mesh(geometryBox, materialBasic);
scene.add(meshBox);
```

To add a cube mesh into the scene, we have to define its geometry and material. Create a three.js unit cube `BoxGeometry`, and create a `MeshBasicMaterial` that produces flat shading and gives it a yellow color by specifying the `color` property. Flat shading means that the material is not shaded and not affected by any lights, and it will simply output the color of the material.

```javascript
// The rendering loop
const animate = function () {
    requestAnimationFrame(animate);

    // Rotate the meshes in the x and y axis every frame
    meshBox.rotation.x += 0.01;
    meshBox.rotation.y += 0.01;

    // Render the frame, defined by the threejs camera in the scene
    renderer.render(scene, camera);
};

// When the window is resized...
function onWindowResize() {
    // Update the camera aspect ratio and recompute the projection matrix
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    // Set the renderer viewport and canvas size
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Set the function to call when the window resized event is triggered
window.addEventListener("resize", onWindowResize);

// Start the rendering loop
animate();
```

The animate function defines the rendering loop that repeats itself via `requestAnimationFrame(animate)`. It renders a frame defined by the scene objects (geometry, material, lights etc.) and the camera, and outputs the RGB fragment results into the framebuffer and displays it in the viewport. We can write code that changes the rendering and object parameters every frame, such as transforming (e.g. translating, rotating, scaling) mesh objects or updating the uniform variables in material shaders.

We also defined the event listener `"resize"` that calls the onWindowResize function when the browser window is resized. In this function, we resize the viewport based on the current window dimensions, and set the camera's aspect ratio to match the dimension of the window. Since the camera projection parameter is changed, we have to recompute the camera projection matrix to pass to shaders. At the end of the javascript, we call the animate function to get the rendering loop going.

Let's launch the VSCode Live Server to see our three.js renderer in action.

- Press `F1` in VSCode to open the command palette and type `live server`. Then, select the option to launch Live Server: `Open with Live Server`.

![figure](/media/docs/p1a.png)

Visit the webpage at the localhost (at default port 5500) and navigate to the `/src` folder where your `index.html` is at (http://127.0.0.1:5500/src/). You should see a spinning yellow cube.

![figure](/media/docs/p2.png)

In the VSCode status bar on the right, you can see the button to close or launch your live server and the port the webpage is hosted at. Currently the port is at 5500.

![figure](/media/docs/p1b.png)

# Part 2: Lambert shading model and camera controls

In this section, we will explore the Lambertian shading model and shade our cube using the three.js defined `MeshLambertMaterial`. We will also set up our camera as an orbit camera and enable mouse control for it.

- To import the three.js `OrbitControls` object, call the following script after the three.js script in the `index.html` body:

```html
<script src="../node_modules/three/examples/js/controls/OrbitControls.js"></script>
```

The `OrbitControls.js` script that defines the `OrbitControls` object located in the `three/examples/js/controls/` folder.

- Go back to the `main.js` and place the following code after your camera and renderer object:

```javascript
// Add orbit camera controls to the camera (js event assigned)
const controlOrbit = new THREE.OrbitControls(camera, renderer.domElement);

// Create a helper object to visualize the world axis
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);
```

The three.js `OrbitControls` adapts the specified camera into an orbit camera and sets up the event functions for mouse controls. To visualize the camera's orientation in the world, we can add an `AxesHelper` that draws a red, green, and blue line respective to the global X, Y, and Z axis, that is 2 units in length.

Three.js has already defined several helper objects that can help you visualize a bounding box, camera frustum, lights, as well as drawing arrows and grids.

> - `OrbitControls` https://threejs.org/docs/?q=OrbitControls#examples/en/controls/OrbitControls
> - `AxesHelper` https://threejs.org/docs/?q=helper#api/en/helpers/AxesHelper

![figure](/media/docs/p3.png)

You can now see the global axis visualization stemming from the scene origin (0,0,0). Rotate the camera using `Left Click + Drag`, pan the camera using `Right Click + Drag`, and dolly the camera forward and backward by rolling the `Mouse Wheel` or by holding `Mouse Wheel + Drag`.

- Now let's add two lights in the scene and shader the cube with a Lambert material shader.

```javascript
// Create an ambient light that is white in color and has a low intensity value
const light = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 0.2);
scene.add(light);

// Create a directional light that is white in color and has an intensity value of 1
const directionalLight = new THREE.DirectionalLight(new THREE.Color(1, 1, 1), 1);

// Set the direction light position
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);
```

The first light object `AmbientLight` is a constant, global light, with parameters defining a white color and an intensity value of 0.2. It uniformly lights object from all directions, providing a rough estimation of global incoming light hitting the surface of the object.

The second light object `DirectionalLight` imitates an infinitely faraway light source, with parameters defining a white color and an intensity value of 1. The direction of the light vector is defined by the position of the light object, which is set to (1, 1, 1). This light vector defines the direction of light rays hitting the surface of a mesh, and is used in many shading equations to compute the light intensity value at a particular mesh surface.

> ![figure](/media/docs/p4.png)
> Source: https://learnopengl.com/Lighting/Light-casters

- We can also visualize the direction vector of the `DirectionalLight` object by adding a `DirectionalLightHelper` with a size value of 0.2:

```javascript
// Create a helper object to visualize the directional light
const helperLight = new THREE.DirectionalLightHelper(directionalLight, 0.2);
scene.add(helperLight);
```

![figure](/media/docs/p6.png)

- The next step is to create a material shader that uses the Lambertian shading model:

```javascript
// Use lambert shading for the mesh (N.L)
// Note: Makes sure color vector is in the linear space before input into shaders (renderer will convert it back to sRGB space)
const materialLambert = new THREE.MeshLambertMaterial({
    color: new THREE.Color(1, 0.85, 0.43).convertSRGBToLinear()
});
```

The Lambertian shading model defines a simple function to calculate reflected light values for a perfectly diffuse mesh surface. It can be used to render a rough-looking appearance for materials like wood or stone. The reflected light intensity value at a surface location is computed by the dot product of the surface normal N (at that surface location) and the light vector L (N dot L). 

In some text, the angle between the normal and light vectors is cos θ.

> ![figure](/media/docs/p5.png)
> Source: https://learnopengl.com/Lighting/Basic-Lighting

In three.js, the `MeshLambertMaterial` evaluates the reflected light value per-vertex (i.e. at each vertex of the mesh), and the reflected light intensity values at each vertex are interpolated across the fragments that the triangle primitive spans. We also set the color of the material to yellow and convert the color value to linear color space.

> `MeshLambertMaterial` https://threejs.org/docs/?q=meshla#api/en/materials/MeshLambertMaterial

> Check out the applet for a visualization of dot product: https://www.falstad.com/dotproduct/

- Finally, we modify the `meshBox` object we have created to use the `MeshLambertMaterial`:

```javascript
// Create the Threejs box mesh that uses MeshLambertMaterial
const meshBox = new THREE.Mesh(geometryBox, materialLambert);
```

![figure](/media/docs/p7.png)

The result of this part is a shaded yellow cube, with helpers visualizing the global axis and the directional light, as well as a fully controllable orbit camera. Notice that the light intensity on the object surface is greater when the surface normal vector is more aligned with the light direction vector.

# Part 3: Creating a cube with vertex and index buffers

Now let's create our cube mesh object by specifying our own `BufferGeometry` instead of using three.js's `BoxGeometry`. We want to make our cube geometry appear identical to the three.js box geometry. Geometries in 3D graphics are often formed and represented using triangle primitives. Each triangle is defined by three vertices in a 3D Cartesian coordinate space, and each vertex defines an XYZ coordinate.

Vertices are stored in an array buffer, and sent to the graphics (or rasterization) pipeline for rendering. By default, 3 consecutive vertices in the array buffer will define a triangle face, and the winding order of the triangle vertices will result in either a front or back face. In three.js, having a counter-clockwise winding order will result in a face that is oriented at the +Z axis towards the camera.

> ![figure](/media/docs/p8.png)
> Source: https://learnopengl.com/Getting-started/Hello-Triangle

Optional: Set the `MeshLambertMaterial`'s wireframe property to `true` to visualize the triangles that forms the cube mesh:
```javascript
const materialLambert = new THREE.MeshLambertMaterial({
    color: new THREE.Color(1, 0.85, 0.43).convertSRGBToLinear(),
    wireframe: true
});
```

![figure](/media/docs/p8a.png)

The illustration shows how triangle vertices are stored in the vertex array buffer. We can also use an index array buffer  to address vertices in the vertex array buffer to create triangles. This avoids duplicates of triangle vertices in the vertex buffer and it reduces the size of vertex data for complex meshes.

![figure](/media/docs/vertex.png)

For example, to depict the quad, we have to specify the 6 vertices of the two triangles that form the quad.

```javascript
const vertices = new Float32Array([
    -0.5,  0.5,     // 0     // Triangle 1
    -0.5, -0.5,     // 1
     0.5,  0.5,     // 3
    -0.5, -0.5,     // 1     // Triangle 2
     0.5, -0.5,     // 2
     0.5,  0.5      // 3
]);
```

Or specify the unique vertices of the quad and the indices that form the two triangles.

```javascript
const vertices = new Float32Array([
    -0.5,  0.5,     // 0
    -0.5, -0.5,     // 1
     0.5, -0.5,     // 2
     0.5,  0.5      // 3
]);

const indices = [
    0, 1, 3,        // Triangle 1
    3, 1, 2,        // Triangle 2
];
```

To pass the vertex and index buffers to the graphics pipeline, we have to set the array buffers for each vertex attribute, or set the index buffer. Since the vertex array has a 32bit floating point type (`Float32Array`), we store this array in a `Float32BufferAttribute` container and specify the size of each vertex component, which is 2. Then we bind this index array buffer to the `"position"` vertex attribute. Later in the vertex shader, you can access this 2 component (XY) position data per vertex.

```javascript
// Set the positional vertex attribute
geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 2));
```

To set the index data, call the `setIndex` function.

```javascript
// Set the index array buffer
geometry.setIndex(indices);
```

It's time for a challenge:
- Define the cube geometry using the `BufferGeometry` object and set the vertex data to the `"position"` vertex attribute. We will use an index array as well. Use the figure below as a guide to create your unit cube geometry. A unit cube has a length of 1, and we want to have the cube's center at the origin (0,0,0).
- Below is the template to create your cube geometry by filling the vertices and indices array for the `BufferGeometry` object.
- Start by defining the coordinates for the 8 vertex positions of the unit cube.
- Then, specify 3 indices in a counter-clockwise order to form a triangle. Two triangles will form a side of the cube, and we want each side of the cube to be facing outwards so that they are visible to the camera.
- The backfacing sides of the cube may be tricky to imagine! Check out your rendering result to see if you got them right.
- Note that +Z axis is pointing towards you, and -Z axis is pointing away from you.

 ![figure](/media/docs/cube.png)

```javascript
// Create a buffer geometry with vertices and normals that defines our unit box
const geometryBoxCustom = new THREE.BufferGeometry();

// Define the 8 vertices of the box
const vertices = new Float32Array([
                        // 0 // top vertices
                        // 1
                        // 2
                        // 3

                        // 4 // bottom vertices
                        // 5
                        // 6
                        // 7
]);

// Index pointing to a vertex in the vertices list, forming two triangles per face of the cube
// Triangle winding order is counter-clockwise
const indices = [
                        // -X
                        // -Y
                        // -Z
                        // +X
                        // +Y
                        // +Z
];
geometryBoxCustom.setIndex(indices);

// Set the positional vertex attribute, it has 3 components (XYZ)
geometryBoxCustom.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
```

At the end, replace the cube mesh geometry with your custom one `geometryBoxCustom`. Since we have not defined the normals for the cube vertices, the box will appear black as `MeshLambertMaterial` requires the normal component to compute reflected light values. For now, let's just set the cube mesh to use the basic color material `MeshBasicMaterial`.

```javascript
// Create a custom Threejs box mesh that uses materialBasic
const meshBox = new THREE.Mesh(geometryBoxCustom, materialBasic);
scene.add(meshBox);
```

 ![figure](/media/docs/p9.png)

You should be able to make out the shape of the cube as you rotate the camera. If you notice any artifacts or holes in your shape, like a missing triangle, you may have incorrectly defined the winding order for the triangle indices.

  ![figure](/media/docs/p10.png)

If you're stuck, you can always refer to the completed vertex and index buffers below:

```javascript
const vertices = new Float32Array([
    -0.5, 0.5, -0.5,     // 0 // top vertices
    -0.5, 0.5, 0.5,      // 1
    0.5, 0.5, 0.5,       // 2
    0.5, 0.5, -0.5,      // 3

    -0.5, -0.5, -0.5,    // 4 // bottom vertices
    -0.5, -0.5, 0.5,     // 5
    0.5, -0.5, 0.5,      // 6
    0.5, -0.5, -0.5,     // 7
]);

const indices = [
    0, 4, 5, 5, 1, 0,   // -X
    5, 4, 7, 7, 6, 5,   // -Y
    0, 3, 7, 7, 4, 0,   // -Z
    2, 6, 7, 7, 3, 2,   // +X
    0, 1, 2, 2, 3, 0,   // +Y
    2, 1, 5, 5, 6, 2    // +Z
];
```

As you have noticed before, applying `MeshLambertMaterial` to the cube will result in a black color. It is because the normal vectors for each triangle vertex have not been defined, therefore, the Lambert shading model (N dot L) will produce a 0 value. You can find out how the Lambert shading model is defined in the fragment shader in the next section. For now, let's define the normal vertex attributes for each vertex of the cube.

Unfortunately, if you use indices to specify normal vectors like how you have described vertices above, you will notice that triangles sharing the same vertex will have the same normal vector, even though the triangles are facing different orientations. This results in a wrongly calculated light value for certain cube faces!

To get around this, you will have to describe every triangle's 3 vertices, along with other vertex attributes (e.g. normal, UV texture coordinates).

- Let's replace our vertex and index arrays with a new vertex array defining all triangle vertices of the cube:

```javascript
// List of 3 component (xyz) vertices defining two triangles per face of the cube
// Triangle winding order is counter-clockwise
const vertices = new Float32Array([
    -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5,     // -X
    -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5,
    -0.5, -0.5, 0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5,     // -Y
    0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5,
    -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5,       // -Z
    0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5,
    0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5,         // +X
    0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5,
    -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5,         // +Y
    0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5,
    0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5,         // +Z
    -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5,
]);
```

- Also create the normal array for each vertex. All 3 triangle vertices will have the same normal vector:

```javascript
// Define normals for each triangle face, so that the cube faces are outwards
const normals = new Float32Array([
    -1, 0, 0, -1, 0, 0, -1, 0, 0,   // -X
    -1, 0, 0, -1, 0, 0, -1, 0, 0,
    0, -1, 0, 0, -1, 0, 0, -1, 0,   // -Y
    0, -1, 0, 0, -1, 0, 0, -1, 0,
    0, 0, -1, 0, 0, -1, 0, 0, -1,   // -Z
    0, 0, -1, 0, 0, -1, 0, 0, -1,
    1, 0, 0, 1, 0, 0, 1, 0, 0,      // +X
    1, 0, 0, 1, 0, 0, 1, 0, 0,
    0, 1, 0, 0, 1, 0, 0, 1, 0,      // +Y
    0, 1, 0, 0, 1, 0, 0, 1, 0,
    0, 0, 1, 0, 0, 1, 0, 0, 1,      // +Z
    0, 0, 1, 0, 0, 1, 0, 0, 1,
]);
```

Then we set the `"normal"` vertex attribute the same way as we set the `"position"` vertex attribute, and we specify 3 as the number of components (x, y, z) for each vertex:

```javascript
// Set the positional and normal vertex attributes
geometryBoxCustom.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
geometryBoxCustom.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
```

- Let's have two cube meshes placed beside each other for comparison. The cube located at the origin will be your custom box geometry, and the other cube will be the three.js box geometry. Apply the `MeshLambertMaterial` to both.

```javascript
// Create the Threejs box mesh that uses MeshLambertMaterial
const meshBox = new THREE.Mesh(geometryBox, materialLambert);
meshBox.position.setX(2);
scene.add(meshBox);

// Create our box mesh that uses our material
const meshBoxCustom = new THREE.Mesh(geometryBoxCustom, materialLambert);
scene.add(meshBoxCustom);
```

![figure](/media/docs/p11.png)

You should see the two cubes with the same geometry and they look exactly the same.

# Part 4: Lambert shader and custom vertex and fragment shaders

In this part, we will write a custom Lambert material shader to create a rendering appearance similar to three.js's `MeshLambertMaterial`. Shaders are programs written in the GLSL language. The shader program has a vertex shader where the vertices of our meshes are transformed into the clip coordinate space and a fragment shader where lighting and color values are computed for each fragment (or pixel). Three.js defines a `ShaderMaterial` object in which you can specify a custom vertex shader, a fragment shader, and pass additional data to the two shaders using uniform variables.

> An overview of the GPU rasterization pipeline from the input vertex data to the shaded pixels in the framebuffer: https://vulkan-tutorial.com/Drawing_a_triangle/Graphics_pipeline_basics/Introduction

> Check out the list of predefined variables for the ShaderMaterial GLSL: https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram

> A note on transforming normal vectors: https://www.scratchapixel.com/lessons/mathematics-physics-for-computer-graphics/geometry/transforming-normals

- Create a `ShaderMaterial` object for our cube:

```javascript
// Create a custom shader to use as mesh material
const materialLambertCustom = new THREE.ShaderMaterial();
```

- Then define the vertex shader program:

```glsl
// Define the vertex shader
materialLambertCustom.vertexShader = `
    varying vec3 vNormal;

    // Matrix to transform the normal vectors
    uniform mat3 matNormal;

    void main()
    {
        // Transform positional vertices from object space to clip space
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

        // Transform normal vectors based on the object's model matrix
        vNormal = matNormal * normal;
    }
`;
```

- And the fragment shader program:

```glsl
// Define the fragment shader
materialLambertCustom.fragmentShader = `
    varying vec3 vNormal;

    uniform float lightAmbientValue; // Ambient light intensity
    uniform vec3 lightPosition; // Directional light vector
    uniform vec3 lightColor; // Directional light color
    uniform vec3 objColor; // Color of the object (in linear space)

    void main()
    {
        // Compute the diffuse term based on the lambert shading model (N . L)
        // Make sure all vector components are normalized to get a normalized value
        vec3 lightPos = normalize(lightPosition);

        // Note: Clamp to positive dot product values
        float sLambert = max(dot(vNormal, lightPos), 0.0);

        // A simple ambient + diffuse (lambert) shading model
        // More info: https://learnopengl.com/Lighting/Basic-Lighting
        float ambient = lightAmbientValue;
        float diffuse = sLambert;
        vec3 color = (ambient + diffuse) * objColor * lightColor;
        gl_FragColor = vec4(color, 1);

        // Convert fragment color from linear space back to sRGB space
        #include <encodings_fragment>
    }
`;
```

## The vertex shader

The vertex shader takes in vertex data from the vertex array buffer and transforms mesh vertices from object space (also called model space) to clip space. Per-vertex data such as normals, texture (UV) coordinates, and colors are stored in vertex attribute arrays, and they are passed to the vertex shader using the attribute type that matches the assigned vertex attribute data. For example in three.js, position, normal, and UV are predefined in the shader, and you can also define your vertex attribute of a certain type like so:

```glsl
// pre-defined in three.js
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

// custom vertex attribute
attribute int myObjectId;
```

Matches with:

```javascript
geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
geometry.setAttribute("myObjectId", new THREE.BufferAttribute(objectId, 1));
```

> The shaders in the three.js are modular, and they have references to other shader modules including functions and variables, all constructed using three.js's `ShaderChunk`. Shader modules are called using the preprocessor: `#include <encodings_fragment>`

Besides the `attribute` type qualifier in GLSL shaders, there also are the `varying` and `uniform` type qualifiers:

```glsl
varying vec3 vNormal;

// Matrix to transform the normal vectors
uniform mat3 matNormal;
```

- An `attribute` variable holds a specific vertex attribute data (position, normal, UV...) for a vertex.
- A `varying` variable passes data from the vertex to the fragment shader, and the value of the data is interpolated across the fragments that span the vertices of a triangle primitive (or other primitive types).
- A `uniform` variable is used to pass data to the shader, and you can update them every frame. Uniform variable are updated via the associated three.js uniforms object value.
- More info: https://www.khronos.org/opengl/wiki/Type_Qualifier_(GLSL)

At the end of the vertex shader, mesh vertices are expected to be transformed to clip space. Primitives (i.e. points, lines, triangles) that lie outside of this space will be clipped. Transformed vertices in clip space are passed to the predefined GLSL variable `gl_Position`, and these vertices will be transformed to screen space in the subsequent rasterization graphics pipeline stages.

> Here's the big picture of the coordinate spaces and transformation matrices used, and you can read up on how the camera projection and view matrices are derived: https://learnopengl.com/Getting-started/Coordinate-Systems

In the main shader program, we transform the mesh vertices (defined by the `position` vertex attribute) to clip space, by multiplying it with the model transformation matrix, the camera view matrix, and the camera projection matrix in this order. 

```glsl
// Transform positional vertices from object space to clip space
gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
```

We also need to pass the normal data for each vertex to the fragment shader to compute the Lambertian shading model (N.L) at each fragment surface. To do that, we use the `vNormal` variable with `varying` type, and directly pass the normal vertex attribute like so:

```glsl
vNormal = normal;
```

However, as the mesh object transforms by rotating or scaling, its normal vectors have to be transformed as well. We can simply transform the normal vectors using the `modelMatrix` that have the homogeneous coordinates (i.e. the translation portion of the matrix) discarded, provided that the scaling transformation is performed uniformly in all axis.

```glsl
// Transform normal vectors based on the object's model matrix
vNormal = modelMatrix * normal;
```

It is a better practise to generate a dedicated normal transformation matrix to support non-uniform scaling in the 3 axis. The transformed normal will need to be normalized again. For more information, refer to the article in learnopengl.com (Section: One last thing): https://learnopengl.com/Lighting/Basic-Lighting or the article https://www.scratchapixel.com/lessons/mathematics-physics-for-computer-graphics/geometry/transforming-normals.

We will multiply the vertex normals with the dedicated normal transform matrix `matNormal`.

```glsl
// Transform normal vectors based on the object's model matrix
vNormal = normalize(matNormal * normal);
```

All vertex attribute data passed to the fragment shader via the `varying` type are interpolated across the vertices by default. This is performed by the non-programmable rasterization stage, between the vertex and fragment shader stage, where defined vertex attributes are interpolated across the triangle primitive and the interpolated values per fragment are accessable via the same variable name.

More information in the link below:
> ![figure](/media/docs/p12.png) Source: https://codeplea.com/triangular-interpolation

## The fragment shader

In the fragment shader, we receive the interpolated vertex attribute data using the same variable name:

```glsl
varying vec3 vNormal;
```

We also want to define some parameters for shading a diffuse object surface, including the light direction vector, light intensity, color, and the diffuse color of the object.

```glsl
uniform float lightAmbientValue; // Ambient light intensity
uniform vec3 lightPosition; // Directional light vector
uniform vec3 lightColor; // Directional light color
uniform vec3 objColor; // Color of the object (in linear space)
```

We need to ensure the normal and the light direction vector are normalized so that the computed lambert shading model (N dot L) is normalized as well (i.e. between 0 and 1).

```glsl
// Compute the diffuse term based on the lambert shading model (N . L)
// Make sure all vector components are normalized to get a normalized value
vec3 lightPos = normalize(lightPosition);
```

The next line computes the reflected diffuse light value based on the Lambertian shading model, as you recall, depends on the dot product between the surface normal and the light vector. We have to clamp negative values to 0 as we don't want an illuminated mesh surface when the light is coming from behind the surface.

```glsl
// A simple ambient + diffuse (lambert) shading model
// More info: https://learnopengl.com/Lighting/Basic-Lighting
// Note: Clamp to positive dot product values
float sLambert = max(dot(vNormal, lightPos), 0.0);
```

To replicate the three.js `MeshLambertMaterial` shading, we will use the ambient light, directional light, and the uniform variables defined above. The ambient light and the diffuse light values are summed to produce the final intensity of the reflected light, and this intensity value is multiplied by the object material's color and the directional light's color. The final color value is then written out to the fragment (via `gl_FragColor`) and drawn to the framebuffer.

```glsl
float ambient = lightAmbientValue;
float diffuse = sLambert;
vec3 color = (ambient + diffuse) * objColor * lightColor;

gl_FragColor = vec4(color, 1);
```

One last thing in the shader code is to convert the fragment color value in `gl_FragColor` from linear back to sRGB space:

```glsl
// Convert fragment color from linear space back to sRGB space
#include <encodings_fragment>
```

We want to ensure that all input color values (e.g. object color, light color, sampled texture color) are transformed into linear space before performing computation using them.

> Colors (RGB values) can be represented in many coordinate spaces. Some of the color space (or color encoding) takes into account the computer display's exponential gamma function. The problem arises when we compute color values in a non-linear space, resulting in an erroneous color hue or intensity value. For more information: https://learnopengl.com/Advanced-Lighting/Gamma-Correction

- Next, we need to define the uniform variable values in our `ShaderMaterial` object:

```javascript
// Define the uniforms used in the shaders
// Note: Makes sure color vectors are in the linear space before input into shaders (renderer will convert it back to sRGB space)
materialLambertCustom.uniforms = {
    matNormal: {
        value: new THREE.Matrix3()
    },
    lightAmbientValue: {
        value: 0.2
    },
    lightPosition: {
        value: new THREE.Vector3(1, 1, 1)
    },
    lightColor: {
        value: new THREE.Color(1, 1, 1).convertSRGBToLinear()
    },
    objColor: {
        value: new THREE.Color(1, 1, 1).convertSRGBToLinear()
    }
};
```

For each uniform matching the uniforms in the shaders, we pass a value of an appropriate type. We can update these values during runtime and the change in shading will be reflected in rendering. Now, we have to update the `matNormal` uniform to transform mesh normals as the mesh object transform (we have a rotating cube).

- In the animate function, add the code to derive and update the normal transformation matrix uniform:

```javascript
// Compute the normal transformation matrix and update the matNormal uniform value, per frame
const matNormal = new THREE.Matrix3().setFromMatrix4(meshBoxCustom.matrix).invert().transpose();
materialLambertCustom.uniforms["matNormal"].value = matNormal;
```

This normal transformation matrix is then passed to our custom shader material's `matNormal` uniform every frame.

- To better test our custom Lambert material shader with three.js's `MeshLambertMaterial`, let's create two knot-shaped meshes and apply the two different materials. The meshes on the left will (position component x = 0) use our custom geometry and material, and the meshes the right will use the three.js defined geometry and material.

```javascript
// Create a knot geometry
const geometryKnot = new THREE.TorusKnotGeometry(1, 0.4, 80, 20);

...

// Create a knot mesh that uses the MeshLambertMaterial
const meshKnot = new THREE.Mesh(geometryKnot, materialLambert);
meshKnot.position.set(5, 0, -3);
scene.add(meshKnot);

// Create a knot mesh that uses our material
const meshKnotCustom = new THREE.Mesh(geometryKnot, materialLambertCustom);
meshKnotCustom.position.set(0, 0, -3);
scene.add(meshKnotCustom);

// Create the box mesh that uses the MeshLambertMaterial
const meshBox = new THREE.Mesh(geometryBox, materialLambert);
meshBox.position.setX(2);
scene.add(meshBox);

// Create our box mesh that uses our material
const meshBoxCustom = new THREE.Mesh(geometryBoxCustom, materialLambertCustom);
scene.add(meshBoxCustom);
```

If you like the meshes to rotate, add the following in the animate function or comment them out:

```javascript
// Rotate the meshes in the x and y axis every frame
meshBoxCustom.rotation.x += 0.01;
meshBoxCustom.rotation.y += 0.01;
meshKnotCustom.rotation.x += 0.01;
meshKnotCustom.rotation.y += 0.01;
meshBox.rotation.x += 0.01;
meshBox.rotation.y += 0.01;
meshKnot.rotation.x += 0.01;
meshKnot.rotation.y += 0.01;
```

This is the result of the complete part. You should see the rendering of the knot and box meshes with our custom material on the left, and the `MeshLambertMaterial` on the right.

![figure](/media/docs/p13.png)

By setting the light color and object material color to white, we can observe the differences in shading. Our Lambert shading computation is performed per-fragment, and it produces a more accurate light value at fragment of the mesh surface. On the other side, computing the Lambert shading model per-vertex and interpolating the resulting value across the fragments results in a noticeable shading pattern.

Performing shading per-vertex is usually faster than computing shading per-fragment, however, the shading performance on modern GPUs is neglectable and nowadays, we are able to compute complex physically-based shading models at high performances.

# Part 5: Texturing meshes

Textures store data like colors, normals, or shader-specific parameters for access in shaders. Often we use a texture image that stores diffuse color information, and sample the texture in shader at a UV coordinate location and map it to a location on the mesh surface.

This is the 16x16 PNG image of a dirt block that we will use:

![figure](/media/docs/dirt_zm.png)

You can address a specific texel color value from the texture image by specifying the U, V texture coordinates:

![figure](/media/docs/uv.png)

To map texture color values to locations on a mesh primitive, we have to specify the UV texture coordinates at each mesh vertex, and access the interpolated values in the fragment shader. We can then sample the texture at each fragment of the mesh primitive using the interpolated UV coordinate at the fragment location.

![figure](/media/docs/uv2.png)

- Let's define the UV vertex coordinate for each vertex of our custom box geometry `BufferGeometry`:

```javascript
const texcoords = new Float32Array([
    0, 1, 0, 0, 1, 0, // -X
    1, 0, 1, 1, 0, 1,
    0, 0, 0, 1, 1, 1, // -Y
    1, 1, 1, 0, 0, 0,
    1, 1, 0, 1, 0, 0, // -Z
    0, 0, 1, 0, 1, 1,
    0, 1, 0, 0, 1, 0, // +X
    1, 0, 1, 1, 0, 1,
    0, 1, 0, 0, 1, 0, // +Y
    1, 0, 1, 1, 0, 1,
    1, 1, 0, 1, 0, 0, // +Z
    0, 0, 1, 0, 1, 1
]);
```

- Then set the uv vertex attribute for access in the vertex shader:

```javascript
// Set the positional, normal, and texture uv vertex attributes
geometryBoxCustom.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
geometryBoxCustom.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
geometryBoxCustom.setAttribute("uv", new THREE.Float32BufferAttribute(texcoords, 2));
```

- We will use the three.js `TextureLoader` object to load the texture image into memory. Remember to specify the texture's color space encoding as sRGB so that three.js will automatically convert the color data values from sRGB to linear for sampling in the fragment shader. We also set the minification and magnification filtering to the nearest neighbor filtering.

```javascript
// Load a texture image
const texture = new THREE.TextureLoader().load("../media/dirt.png");
// Specify the color space encoding of the texture
// It will be automatically transformed to linear space in Threejs shader
texture.encoding = THREE.sRGBEncoding;
// Nearest neighbour filtering for a blocky look
texture.magFilter = THREE.NearestFilter;
texture.minFilter = THREE.NearestFilter;
```

> By default, three.js uses linear interpolation `LinearFilter` for the magnification and minification filtering. If you find that your rendered cube texture is smooth or non-blocky, switch to the nearest neighbor filtering. For more information on texture filtering and mipmapping: https://learnopengl.com/Getting-started/Textures

- Let's apply the texture image to the three.js materials that we have created, using the `map` property:

```javascript
// A Material with no shading, just output texture
const materialBasic = new THREE.MeshBasicMaterial({
    map: texture
});

// Use lambert shading for the mesh (N.L)
// Note: Makes sure color vector is in the linear space before input into shaders (renderer will convert it back to sRGB space)
const materialLambert = new THREE.MeshLambertMaterial({
    map: texture
});
```

- Let's also update our custom Lambert shading material to use our new texture map:

```glsl
// Create a custom shader to use as mesh material
// Check out the list of predefined variables for the ShaderMaterial GLSL: https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram
// A note on transforming normal vectors: https://www.scratchapixel.com/lessons/mathematics-physics-for-computer-graphics/geometry/transforming-normals
const materialLambertCustom = new THREE.ShaderMaterial();

// Define the vertex shader
materialLambertCustom.vertexShader = `
    varying vec3 vNormal;
    varying vec2 vUv;

    // Matrix to transform the normal vectors
    uniform mat3 matNormal;

    void main()
    {
        ...

        // Pass vertex uv to fragment
        vUv = uv;
    }
`;

// Define the fragment shader
materialLambertCustom.fragmentShader = `
    varying vec3 vNormal;
    varying vec2 vUv;

    uniform float lightAmbientValue; // Ambient light intensity
    uniform vec3 lightPosition; // Directional light vector
    uniform vec3 lightColor; // Directional light color
    uniform vec3 objColor; // Color of the object (in linear space)

    // Diffuse texture
    uniform sampler2D sDiffuse;

    void main()
    {
        ...

        // Sample the texel color at vUv coordinate
        vec4 texDiffuse = texture(sDiffuse, vUv);
        // Convert texel color from sRGB to linear space
        texDiffuse = sRGBToLinear(texDiffuse);

        // A simple ambient + diffuse (lambert) shading model
        // More info: https://learnopengl.com/Lighting/Basic-Lighting
        float ambient = lightAmbientValue;
        float diffuse = sLambert;
        vec3 color = (ambient + diffuse) * objColor * lightColor * texDiffuse.rgb;
        gl_FragColor = vec4(color, 1);

        ...
    }
`;
```

- And also specify the `sDiffuse` uniform variable to use our loaded texture:

```javascript
// Define the uniforms used in the shaders
// Note: Makes sure color vectors are in the linear space before input into shaders (renderer will convert it back to sRGB space)
materialLambertCustom.uniforms = {
    ...,
    sDiffuse: {
        value: texture
    }
```

This is the result of applying the dirt texture image on our objects using our custom material (left) and three.js material (right):

![figure](/media/docs/p14.png)

In the vertex shader, we simply retrieve the UV texture coordinate stored in the `"uv"` vertex attribute and pass it along to the fragment shader via `vUv`:

```glsl
varying vec3 vNormal;
varying vec2 vUv;

...

void main()
{
    ...

    // Pass vertex uv to fragment
    vUv = uv;
}

```

In the fragment shader, we receive the interpolated UV coordinates `vUv` for each fragment that spans the mesh's triangle primitive, as well as specify the texture sampler `sDiffuse` used to sample the dirt texture image.

```glsl
varying vec2 vUv;

...

// Diffuse texture
uniform sampler2D sDiffuse;

void main()
{
    ...

    // Sample the texel color at vUv coordinate
    vec4 texDiffuse = texture(sDiffuse, vUv);
    // Convert texel color from sRGB to linear space
    texDiffuse = sRGBToLinear(texDiffuse);

    // A simple ambient + diffuse (lambert) shading model
    // More info: https://learnopengl.com/Lighting/Basic-Lighting
    float ambient = lightAmbientValue;
    float diffuse = sLambert;
    vec3 color = (ambient + diffuse) * objColor * lightColor * texDiffuse.rgb;
    gl_FragColor = vec4(color, 1);

    ...
}
```

We use the GLSL defined `texture` function to specify the texture sampler and the UV coordinate to fetch the RGBA color value. When writing a custom `ShaderMaterial`, we have to manually convert the texture color space encoding from sRGB to linear space using the three.js provided `sRGBToLinear` function. Once we have the texel color value, we multiply it with the diffuse and ambient term to get the final color value.

# Part 6: Rendering a GLTF model

In this last part, let's apply the concepts we have learned so far to render a complex 3D model. I have provided an interesting GLTF model of a real-life Mar Saba monastery. Its geometry and texture data are captured using an ariel photogrammetry process.

- Three.js has provided a GLTF importer to import 3D models based on the GLTF specification (or format). Import the javascript to load GLTF models by adding this line in the HTML body section:

```html
<script src="../node_modules/three/examples/js/loaders/GLTFLoader.js"></script>
```

- Then we can simply call the GLTF loader to import a GLTF model, and add it to the scene:

```javascript
// Import a gltf model
// Source: https://sketchfab.com/3d-models/mar-saba-monastery-4bff096a20064d65b8af65ab8c51d9cf
const loader = new THREE.GLTFLoader();
loader.load("../media/gltf/scene.gltf", (gltf) => {
    // Add the gltf scene (i.e. it's associated mesh objects) to our scene
    scene.add(gltf.scene);
});
```

![figure](/media/docs/p15.png)
Wait a while for the model to load. If you zoom out, you will be able to see the entire 3D model in the scene.

The GLTF format can contain hierarchical scene descriptors or definitions of lights, cameras, materials (texture image data), and meshes (and each of their geometry - vertex, normal, UV array buffers). The GLTF loader interpret the GLTF scene descriptors and automatically creates objects with matching parameters. For example, the `MeshBasicMaterial` is applied to all meshes in the GLTF scene, with textures automatically supplied to the material's `map` property. Depending on the material definations in the GLTF file, three.js may use the more appropriate `MeshStandardMaterial` and configure the material properties. You can also choose to extract only the geometry data (vertex attribute arrays) or textures and create the mesh, geometry buffer, and material shaders yourself.

- Let try out our custom lambert material shader on the loaded GLTF mesh:

```javascript
// Import a gltf model
// Source: https://sketchfab.com/3d-models/mar-saba-monastery-4bff096a20064d65b8af65ab8c51d9cf
const loader = new THREE.GLTFLoader();
loader.load("../media/gltf/scene.gltf", (gltf) => {
    // Optional: Traverse the gltf scene and apply our material to all mesh objects
    // We also set materialLambertCustom to use the imported mesh's texture map.
    gltf.scene.traverse((mesh) => {
        if (mesh.isMesh)
        {
            mesh.materialOriginal = mesh.material;
            mesh.material = materialLambertCustom;
            materialLambertCustom.uniforms["sDiffuse"].value = mesh.materialOriginal.map;
        }
    });

    // Add the gltf scene (i.e. it's associated mesh objects) to our scene
    scene.add(gltf.scene);
});
```

In the code above, we traverse through the GLTF scene graph and apply our custom shader material to all meshes. We also need to transform each mesh's vertex normals as each mesh has been transformed using its own model matrix.

Let's update the vertex shader to apply the mesh's model transformation matrix to the mesh normals. As long as we don't scale the mesh in one or two axis, the transformed normals will be correct.

- We multiply the normal vector with the model transformation matrix `matNormal`, ignoring the homogeneous coordinate components (translation) of the model matrix:

```glsl
// Transform normal vectors based on the object's model matrix
vNormal = (modelMatrix * vec4(normal, 0)).xyz;
```

![figure](/media/docs/p16.png)

Try to adjust the `materialLambertCustom` uniform paramters to change the light direction and colors to your liking.

# References and further reading

- https://discoverthreejs.com/tips-and-tricks/ 
- https://webglfundamentals.org/ 
- https://learnopengl.com/ 
- Tomas Akenine-Mller, Eric Haines, and Naty Hoffman. 2018. Real-Time Rendering, Fourth Edition (4th. ed.). A. K. Peters, Ltd., USA.
- 3D Model: "Mar Saba monastery" (https://sketchfab.com/3d-models/mar-saba-monastery-4bff096a20064d65b8af65ab8c51d9cf) by matousekfoto (https://sketchfab.com/matousekfoto) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)

# Biography

Alex Zhang is a Research Engineer at Fraunhofer Singapore where he works on rendering large 3D cities. His research interest is in real-time rendering, focusing on realistic, high-performance, large-scale rendering for geospatial applications and mixed reality.