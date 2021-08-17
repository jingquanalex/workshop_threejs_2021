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
// Set renderer to automatically covert output colors to sRGB space
renderer.outputEncoding = THREE.sRGBEncoding;

// Append canvas to the html body
document.body.appendChild(renderer.domElement);

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
const helperLight = new THREE.DirectionalLightHelper(directionalLight, 0.5);
scene.add(helperLight);

scene.add(directionalLight);

// Create a buffer geometry with vertices and normals that defines our unit box
const geometry = new THREE.BufferGeometry();

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
// geometry.setIndex(indices);

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

const texcoords = new Float32Array([
    0, 1, 0, 0, 1, 0,   // -X
    1, 0, 1, 1, 0, 1,
    0, 0, 0, 1, 1, 1,   // -Y
    1, 1, 1, 0, 0, 0,
    1, 1, 0, 1, 0, 0,   // -Z
    0, 0, 1, 0, 1, 1,
    0, 1, 0, 0, 1, 0,   // +X
    1, 0, 1, 1, 0, 1,
    0, 1, 0, 0, 1, 0,   // +Y
    1, 0, 1, 1, 0, 1,
    1, 1, 0, 1, 0, 0,   // +Z
    0, 0, 1, 0, 1, 1
]);

// Set the positional and normal vertex attributes
geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
geometry.setAttribute("uv", new THREE.Float32BufferAttribute(texcoords, 2));

// Load a texture image
const texture = new THREE.TextureLoader().load("../texture/dirt.png");
texture.encoding = THREE.sRGBEncoding;
texture.magFilter = THREE.NearestFilter;
texture.minFilter = THREE.NearestFilter;

// Use lambert shading for the mesh (N.L)
// Note: Makes sure color vector is in the linear space before input into shaders (renderer will convert it back to sRGB space)
const material = new THREE.MeshLambertMaterial({
    color: new THREE.Color(1, 0.85, 0.43).convertSRGBToLinear(),
    map: texture
});

// Create a custom shader to use as mesh material
// Check out the list of predefined variables for the ShaderMaterial GLSL: https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram
// A note on transforming normal vectors: https://www.scratchapixel.com/lessons/mathematics-physics-for-computer-graphics/geometry/transforming-normals
const materialLambert = new THREE.ShaderMaterial();

// Define the vertex shader
materialLambert.vertexShader = `
    varying vec3 vNormal;
    varying vec2 vUv;

    // Matrix to transform the normal vectors
    uniform mat3 matNormal;

    void main()
    {
        // Transform positional vertices from object space to clip space
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

        // Transform normal vectors based on the object's model matrix
        vNormal = matNormal * normal;

        // Pass vertex uv to fragment
        vUv = uv;
    }
`;

// Define the fragment shader
materialLambert.fragmentShader = `
    varying vec3 vNormal;
    varying vec2 vUv;

    // Positional vector of the light object
    uniform vec3 lightPosition;

    // Color of the object (in linear space)
    uniform vec3 objColor;

    // Diffuse texture
    uniform sampler2D sDiffuse;

    void main()
    {
        // Compute the diffuse term based on the lambert shading model (N . L)
        // Make sure all vector components are normalized to get a normalized value
        // Note: Clamp to positive dot product values
        vec3 lightPos = normalize(lightPosition);
        float sLambert = max(dot(vNormal, lightPos), 0.0);

        // A simple ambient + diffuse (lambert) shading model
        // More info: https://learnopengl.com/Lighting/Basic-Lighting
        vec4 texDiffuse = texture(sDiffuse, vUv);
        texDiffuse = (texDiffuse);
        vec3 ambient = vec3(0.2);
        vec3 diffuse = vec3(sLambert);
        vec3 color = (ambient + diffuse) * objColor * texDiffuse.rgb;
        gl_FragColor = vec4(color, 1);
    }
`;

// Define the uniforms used in the shaders
materialLambert.uniforms = {
    matNormal: {
        value: new THREE.Matrix3()
    },
    lightPosition: {
        value: directionalLight.position
    },
    objColor: {
        // Note: Makes sure color vector is in the linear space before input into shaders (renderer will convert it back to sRGB space)
        value: new THREE.Color(1, 0.85, 0.43).convertSRGBToLinear()
    },
    sDiffuse: {
        value: texture
    }
};

// Create the box mesh and add it to the scene
const meshTest = new THREE.Mesh(geometry, materialLambert);
scene.add(meshTest);



// Set the camera to position (0, 0, 5)
camera.position.z = 5;

// The rendering loop
const animate = function () {
    requestAnimationFrame(animate);

    // Compute the normal transformation matrix and update the matNormal uniform value, per frame
    const matNormal = new THREE.Matrix3().setFromMatrix4(meshTest.matrix).invert().transpose();
    materialLambert.uniforms["matNormal"].value = matNormal;

    // Rotate the mesh in the x and y axis every frame
    // meshTest.rotation.x += 0.01;
    // meshTest.rotation.y += 0.01;

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