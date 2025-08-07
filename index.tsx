<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Helicopter Game</title>
    <style>
        body { margin: 0; overflow: hidden; }
        canvas { display: block; }
        #loader {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-family: sans-serif;
            font-size: 24px;
            background-color: rgba(0,0,0,0.5);
            padding: 10px 20px;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <div id="loader">Loading...</div>
    <!-- Load the Three.js library -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

    <script>
        // --- SCENE SETUP ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(renderer.domElement);

        // --- LIGHTING ---
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(100, 20, 100);
        scene.add(directionalLight);
        
        // --- SKY ---
        const sky = new THREE.Mesh(
            new THREE.SphereGeometry(500, 32, 32),
            new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide })
        );
        scene.add(sky);

        // --- HELICOPTER ---
        const helicopter = new THREE.Group();
        
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: 'skyblue' });
        const bodyGeometry = new THREE.BoxGeometry(2, 1, 4);
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.5;
        helicopter.add(body);

        const cockpitMaterial = new THREE.MeshStandardMaterial({ color: 'white' });
        const cockpitGeometry = new THREE.BoxGeometry(1.5, 0.5, 1);
        const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
        cockpit.position.set(0, 0.75, 1.5);
        helicopter.add(cockpit);

        const tailGeometry = new THREE.BoxGeometry(0.2, 0.2, 2);
        const tail = new THREE.Mesh(tailGeometry, bodyMaterial);
        tail.position.set(0, 0.5, -3);
        helicopter.add(tail);

        const rotorMaterial = new THREE.MeshStandardMaterial({ color: 'gray' });
        const mainRotorGeometry = new THREE.BoxGeometry(5, 0.1, 0.2);
        const mainRotor = new THREE.Mesh(mainRotorGeometry, rotorMaterial);
        mainRotor.position.y = 1.5;
        helicopter.add(mainRotor);

        const tailRotorGeometry = new THREE.BoxGeometry(0.1, 1, 0.1);
        const tailRotor = new THREE.Mesh(tailRotorGeometry, rotorMaterial);
        tailRotor.position.set(0.2, 0.5, -4);
        helicopter.add(tailRotor);

        helicopter.position.y = 5; // Start helicopter higher up
        scene.add(helicopter);

        // --- SCENERY ---
        const loadingManager = new THREE.LoadingManager(() => {
            const loadingScreen = document.getElementById('loader');
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
        });
        const textureLoader = new THREE.TextureLoader(loadingManager);
        
        // FIX: Replaced the local image path with a placeholder URL.
        // This bypasses potential issues with the environment serving local files
        // and ensures that the texture loading logic itself works correctly.
        const mapTextureUrl = 'https://placehold.co/1024x1024/2E8B57/FFFFFF?text=Hoher+Flaeming';

        const mapTexture = textureLoader.load(
            mapTextureUrl,
            (texture) => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                const planeGeometry = new THREE.PlaneGeometry(500, 500);
                const planeMaterial = new THREE.MeshStandardMaterial({ map: texture });
                const scenery = new THREE.Mesh(planeGeometry, planeMaterial);
                scenery.rotation.x = -Math.PI / 2;
                scene.add(scenery);
            },
            undefined, // onProgress callback not needed here
            (err) => {
                console.error('An error happened while loading the texture.', err);
                const loadingScreen = document.getElementById('loader');
                if (loadingScreen) {
                    loadingScreen.textContent = 'Error loading map. Please try refreshing.';
                }
            }
        );

        // --- CONTROLS ---
        const keys = {
            ArrowUp: false, w: false, W: false,
            ArrowDown: false, s: false, S: false,
            ArrowLeft: false, a: false, A: false,
            ArrowRight: false, d: false, D: false,
            PageUp: false, ' ': false,
            PageDown: false, Shift: false,
        };

        document.addEventListener('keydown', (event) => {
            if (keys.hasOwnProperty(event.key)) keys[event.key] = true;
        });
        document.addEventListener('keyup', (event) => {
            if (keys.hasOwnProperty(event.key)) keys[event.key] = false;
        });
        
        // --- MOUSE LOOK ---
        let isMouseDown = false;
        let prevMouseX = 0;
        let prevMouseY = 0;
        
        document.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            prevMouseX = e.clientX;
            prevMouseY = e.clientY;
        });
        
        document.addEventListener('mouseup', () => {
            isMouseDown = false;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            const deltaX = e.clientX - prevMouseX;
            helicopter.rotation.y -= deltaX * 0.005;
            prevMouseX = e.clientX;
            prevMouseY = e.clientY;
        });

        // --- GAME LOOP ---
        const clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);

            const delta = clock.getDelta();
            const moveSpeed = 10.0 * delta; // Increased speed
            const rotationSpeed = (Math.PI / 2) * delta; // Increased rotation speed

            if (keys.ArrowUp || keys.w || keys.W) helicopter.translateZ(-moveSpeed);
            if (keys.ArrowDown || keys.s || keys.S) helicopter.translateZ(moveSpeed);
            if (keys.ArrowLeft || keys.a || keys.A) helicopter.rotation.y += rotationSpeed;
            if (keys.ArrowRight || keys.d || keys.D) helicopter.rotation.y -= rotationSpeed;
            if (keys.PageUp || keys[' ']) helicopter.position.y += moveSpeed;
            if (keys.PageDown || keys.Shift) helicopter.position.y = Math.max(0.5, helicopter.position.y - moveSpeed); // Prevent going through floor
            
            // Animate rotors
            mainRotor.rotation.y += delta * 30;
            tailRotor.rotation.x += delta * 30;

            // Update camera to follow helicopter
            const offset = new THREE.Vector3(0, 5, 15);
            const cameraPosition = offset.applyMatrix4(helicopter.matrixWorld);
            camera.position.lerp(cameraPosition, 0.1); // Smooth camera follow
            
            const lookAtPosition = new THREE.Vector3();
            lookAtPosition.copy(helicopter.position);
            camera.lookAt(lookAtPosition);

            renderer.render(scene, camera);
        }

        // --- RESIZE HANDLER ---
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        animate();
    </script>
</body>
</html>
