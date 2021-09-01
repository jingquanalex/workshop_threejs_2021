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
geometryBoxCustom.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
geometryBoxCustom.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
geometryBoxCustom.setAttribute("uv", new THREE.Float32BufferAttribute(texcoords, 2));

// Load a texture image
const texture = new THREE.TextureLoader().load("../../media/dirt.png");
// Specify the color space encoding of the texture
// It will be automatically transformed to linear space in Threejs shader
texture.encoding = THREE.sRGBEncoding;
// Nearest neighbour filtering for a blocky look
texture.magFilter = THREE.NearestFilter;
texture.minFilter = THREE.NearestFilter;

// A Material with no shading, just output texture
const materialBasic = new THREE.MeshBasicMaterial({
    map: texture
});

// Use lambert shading for the mesh (N.L)
// Note: Makes sure color vector is in the linear space before input into shaders (renderer will convert it back to sRGB space)
const materialLambert = new THREE.MeshLambertMaterial({
    map: texture
});

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
        // Transform positional vertices from object space to clip space
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

        // Transform normal vectors based on the object's model matrix
        vNormal = (modelMatrix * vec4(normal, 0)).xyz;
        // vNormal = matNormal * normal;

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
        // Compute the diffuse term based on the lambert shading model (N . L)
        // Make sure all vector components are normalized to get a normalized value
        vec3 lightPos = normalize(lightPosition);

        // Note: Clamp to positive dot product values
        float sLambert = max(dot(vNormal, lightPos), 0.0);

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

        // Convert fragment color from linear space back to sRGB space
        #include <encodings_fragment>
    }
`;

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
        value: new THREE.Vector3(1, 1, -1)
    },
    lightColor: {
        value: new THREE.Color(1, 1, 1).convertSRGBToLinear()
    },
    objColor: {
        value: new THREE.Color(1, 1, 1).convertSRGBToLinear()
    },
    sDiffuse: {
        value: texture
    }
};

// Create a Threejs knot mesh that uses MeshLambertMaterial
const meshKnot = new THREE.Mesh(geometryKnot, materialLambert);
meshKnot.position.set(5, 0, -3);
scene.add(meshKnot);

// Create a Threejs knot mesh that uses our material
const meshKnotCustom = new THREE.Mesh(geometryKnot, materialLambertCustom);
meshKnotCustom.position.set(0, 0, -3);
scene.add(meshKnotCustom);

// Create the Threejs box mesh that uses MeshLambertMaterial
const meshBox = new THREE.Mesh(geometryBox, materialLambert);
meshBox.position.setX(2);
scene.add(meshBox);

// Create our box mesh that uses our material
const meshBoxCustom = new THREE.Mesh(geometryBoxCustom, materialLambertCustom);
scene.add(meshBoxCustom);

// Import a gltf model
// Source: https://sketchfab.com/3d-models/mar-saba-monastery-4bff096a20064d65b8af65ab8c51d9cf
const loader = new THREE.GLTFLoader();
loader.load("../../media/gltf/scene.gltf", (gltf) => {
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

// The rendering loop
const animate = function () {
    requestAnimationFrame(animate);

    // Compute the normal transformation matrix and update the matNormal uniform value, per frame
    const matNormal = new THREE.Matrix3().setFromMatrix4(meshBoxCustom.matrix).invert().transpose();
    materialLambertCustom.uniforms["matNormal"].value = matNormal;

    // Rotate the meshes in the x and y axis every frame
    // meshBoxCustom.rotation.x += 0.01;
    // meshBoxCustom.rotation.y += 0.01;
    // meshKnotCustom.rotation.x += 0.01;
    // meshKnotCustom.rotation.y += 0.01;
    // meshBox.rotation.x += 0.01;
    // meshBox.rotation.y += 0.01;
    // meshKnot.rotation.x += 0.01;
    // meshKnot.rotation.y += 0.01;

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