// Code from three.js docs, Getting Started
// https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene

// The threejs scene manager
const scene = new THREE.Scene();

// Create a perspective camera, defining fov, aspect ratio, near plane, far plane
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Set the camera to position (0, 0, 5)
camera.position.z = 5;

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

// Add orbit camera controls to the camera (js event assigned)
const controlOrbit = new THREE.OrbitControls(camera, renderer.domElement);

// Create a helper object to visualize the world axis
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

// Create an ambient light that is white in color and has a low intensity value
const light = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 0.2);
scene.add(light);

// Create a directional light that is white in color and has an intensity value of 1
const directionalLight = new THREE.DirectionalLight(new THREE.Color(1, 1, 1), 1);

// Set the direction light position
directionalLight.position.set(1, 1, 1);

// Create a helper object to visualize the directional light
const helperLight = new THREE.DirectionalLightHelper(directionalLight, 0.2);
scene.add(helperLight);

scene.add(directionalLight);

// Create a test knot geometry
const geometryKnot = new THREE.TorusKnotGeometry(1, 0.4, 80, 20);

// Create a Threejs box mesh to compare with our rendering result
const geometryBox = new THREE.BoxGeometry();

// Create a buffer geometry with vertices and normals that defines our unit box
const geometryBoxCustom = new THREE.BufferGeometry();

// // Define the 8 vertices of the box
// const vertices = new Float32Array([
//     -0.5, 0.5, -0.5,    // 0 // top
//     -0.5, 0.5, 0.5,     // 1
//     0.5, 0.5, 0.5,      // 2
//     0.5, 0.5, -0.5,     // 3

//     -0.5, -0.5, -0.5,   // 4 // bottom
//     -0.5, -0.5, 0.5,    // 5
//     0.5, -0.5, 0.5,     // 6
//     0.5, -0.5, -0.5,    // 7
// ]);

// // Index pointing to a vertex in the vertices list, forming two triangles per face of the cube
// // Triangle winding order is counter-clockwise
// const indices = [
//     0, 4, 5, 5, 1, 0,   // -X
//     5, 4, 7, 7, 6, 5,   // -Y
//     0, 3, 7, 7, 4, 0,   // -Z
//     2, 6, 7, 7, 3, 2,   // +X
//     0, 1, 2, 2, 3, 0,   // +Y
//     2, 1, 5, 5, 6, 2,   // +Z
// ];
// geometryBoxCustom.setIndex(indices);

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

// Set the positional and normal vertex attributes
geometryBoxCustom.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
geometryBoxCustom.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));

// A Material with no shading, just output texture
const materialBasic = new THREE.MeshBasicMaterial({
    color: new THREE.Color(1, 0.85, 0.43).convertSRGBToLinear()
});

// Use lambert shading for the mesh (N.L)
// Note: Makes sure color vector is in the linear space before input into shaders (renderer will convert it back to sRGB space)
const materialLambert = new THREE.MeshLambertMaterial({
    color: new THREE.Color(1, 0.85, 0.43).convertSRGBToLinear()
});

// Create the Threejs box mesh that uses MeshLambertMaterial
const meshBox = new THREE.Mesh(geometryBox, materialLambert);
meshBox.position.setX(2);
scene.add(meshBox);

// Create our box mesh that uses our material
const meshBoxCustom = new THREE.Mesh(geometryBoxCustom, materialLambert);
scene.add(meshBoxCustom);

// The rendering loop
const animate = function () {
    requestAnimationFrame(animate);

    // Rotate the meshes in the x and y axis every frame
    // meshBoxCustom.rotation.x += 0.01;
    // meshBoxCustom.rotation.y += 0.01;
    // meshBox.rotation.x += 0.01;
    // meshBox.rotation.y += 0.01;

    // Render the frame, defined by the threejs camera in the scene
    renderer.render(scene, camera);
};

// When the window is resized, update the camera aspect ratio and recompute the projection matrix
// Also set the renderer viewport and canvas size
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Set the function to call when the window resized event is triggered
window.addEventListener("resize", onWindowResize);

// Start the rendering loop
animate();