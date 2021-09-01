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

// Create a Threejs box mesh to compare with our rendering result
const geometryBox = new THREE.BoxGeometry();

// A Material with flat color shading
const materialBasic = new THREE.MeshBasicMaterial({
    color: new THREE.Color(1, 0.85, 0.43).convertSRGBToLinear()
});

// Create the Threejs box mesh that uses materialBasic
const meshBox = new THREE.Mesh(geometryBox, materialBasic);
scene.add(meshBox);

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