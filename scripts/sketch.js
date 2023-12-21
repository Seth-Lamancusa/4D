let canvasWidth = 720;
let canvasHeight = (1 / 2) * canvasWidth;
let cnv;
let sketch = document.getElementById('sketch');

// // Matrices for transforming point to relative location
// M1 = [[0, -1, 0, 0],
// [-1, 0, 0, 0],
// [0, 0, 1, 0],
// [0, 0, 0, 0]];

// M2 = [[Math.cos(-cam_theta), 0, -Math.sin(-cam_theta), 0],
// [0, 1, 0, 0],
// [Math.sin(-cam_theta), 0, Math.cos(-cam_theta), 0],
// [0, 0, 0, 0]];

// M3 = [[Math.cos(-cam_theta), -Math.sin(-cam_theta), 0, 0],
// [Math.sin(-cam_theta), Math.cos(-cam_theta), 0, 0],
// [0, 0, 1, 0],
// [0, 0, 0, 0]];

// M4 = [[1, 0, 0, cam_x],
// [0, 1, 0, cam_y],
// [0, 0, 1, cam_z],
// [0, 0, 0, 0]];

function setup() {

    frameRate(60);
    cnv = createCanvas(canvasWidth, canvasHeight, WEBGL);
    cnv.parent("sketch");

    let fov = PI / 2; // 90 degrees field of view
    let aspect = width / height;
    let near = 0.1;
    let far = 1000;
    perspective(fov, aspect, near, far);

}

function draw() {

    sketchWidth = sketch.offsetWidth;
    canvasWidth = sketchWidth;
    canvasHeight = (1 / 2) * canvasWidth;
    resizeCanvas(canvasWidth, canvasHeight);

    background("#160714");

    // Square (appended 0s are for matrix multiplication)
    vertex_1 = [1, 0, 0, 0];
    vertex_2 = [1, 1, 0, 0];
    vertex_3 = [1, 0, 1, 0];
    vertex_4 = [1, 1, 1, 0];
    vertex_5 = [2, 0, 0, 0];
    vertex_6 = [2, 1, 0, 0];
    vertex_7 = [2, 0, 1, 0];
    vertex_8 = [2, 1, 1, 0];

    cam_x = 0;
    cam_y = 0;
    cam_z = 0;

    cam_theta = mouseX / 100;
    cam_phi = PI / 2;

    normalMaterial();

    let points = [
        { x: vertex_1[0], y: vertex_1[1], z: vertex_1[2] },
        { x: vertex_2[0], y: vertex_2[1], z: vertex_2[2] },
        { x: vertex_3[0], y: vertex_3[1], z: vertex_3[2] },
        { x: vertex_4[0], y: vertex_4[1], z: vertex_4[2] },
        { x: vertex_5[0], y: vertex_5[1], z: vertex_5[2] },
        { x: vertex_6[0], y: vertex_6[1], z: vertex_6[2] },
        { x: vertex_7[0], y: vertex_7[1], z: vertex_7[2] },
        { x: vertex_8[0], y: vertex_8[1], z: vertex_8[2] }
    ];

    // Scale point locations by 100
    points = points.map(p => ({ x: p.x * 100, y: p.y * 100, z: p.z * 100 }));
    cam_x = cam_x * 100;
    cam_y = cam_y * 100;
    cam_z = cam_z * 100;

    // Transform camera angle to point on unit sphere
    cam_x_dir = Math.cos(cam_theta) * Math.sin(cam_phi);
    cam_y_dir = Math.sin(cam_theta) * Math.sin(cam_phi);
    cam_z_dir = Math.cos(cam_phi);

    // Translate points for p5 coordinates
    points = points.map(p => ({ x: p.y, y: -p.z, z: p.x }));

    // Translate camera for p5 coordinates
    p5_cam_x = cam_y;
    p5_cam_y = -cam_z;
    p5_cam_z = cam_x;

    // Transform point on unit sphere to p5 coordinates
    p5_cam_x_dir = cam_y_dir;
    p5_cam_y_dir = -cam_z_dir;
    p5_cam_z_dir = cam_x_dir;

    // Setting the camera position
    camera(p5_cam_x, p5_cam_y, p5_cam_z, p5_cam_x + p5_cam_x_dir, p5_cam_y + p5_cam_y_dir, p5_cam_z + p5_cam_z_dir, 0, 1, 0);

    // Render each point
    sphereSize = 5;
    for (let p of points) {
        push(); // Start a new drawing state
        translate(p.x, p.y, p.z); // Move to the point location
        sphere(sphereSize); // Draw a small sphere at the point location
        pop(); // Restore original state
        sphereSize += 2;
    }



}
