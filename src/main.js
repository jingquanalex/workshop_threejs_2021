// Code from three.js docs, Getting Started
// https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene

// The threejs scene manager
const scene = new THREE.Scene();

// Create a perspective camera, defining fov, aspect ratio, near plane, far plane
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Create the canvas and the webgl rendering context
const renderer = new THREE.WebGLRenderer();

// Set the viewport and canvas size to the current window dimension
renderer.setSize(window.innerWidth, window.innerHeight);

// Set a clear color so it's easier to catch errors
renderer.setClearColor(new THREE.Color(0.3, 0.35, 0.4));

// Append canvas to the html body
document.body.appendChild(renderer.domElement);

// Create a helper object to visualize the world axis
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

// Create a mesh out of a box geometry and a MeshLambertMaterial that is orange in color
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshLambertMaterial({
    color: new THREE.Color(1, 0.85, 0.43)
});
const meshTest = new THREE.Mesh(geometry, material);

// Add the mesh to the scene
scene.add(meshTest);

// Create an ambient light that is white in color and has a low intensity value
const light = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 0.2);
scene.add(light);

// Create a directional light that is white in color and has an intensity value of 1
const directionalLight = new THREE.DirectionalLight(new THREE.Color(1, 1, 1), 1);

// Set the direction light position
directionalLight.position.set(1, 1, 1);

scene.add(directionalLight);

// Set the camera to position (0, 0, 5)
camera.position.z = 5;

// The rendering loop
const animate = function () {
    requestAnimationFrame(animate);

    // Rotate the mesh in the x and y axis every frame
    meshTest.rotation.x += 0.01;
    meshTest.rotation.y += 0.01;

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