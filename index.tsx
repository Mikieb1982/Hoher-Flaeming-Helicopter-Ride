
'use strict';
import * as THREE from 'three';
import { GoogleGenAI } from "@google/genai";

// Configuration
const CONFIG = {
    MAP_WIDTH: 2048,
    MAP_HEIGHT: 1448,
    START_X: 1364,
    START_Y: 605,
    MAX_SPEED: 6,
    ACCELERATION: 0.22,
    DRAG: 0.97,
    TURN_SPEED: 4.0,
    LANDING_RADIUS: 70,
    JOYSTICK_RADIUS: 55,
};

// POI Data - Coordinates adjusted for precise map alignment
const POI_DATA = [
    { id: 1, name: "1. Stadt und Burg Ziesar", x: 472, y: 130, description: "Auf der Burg Ziesar befindet sich das Museum für brandenburgische Kirchen- und Kulturgeschichte des Mittelalters und der Reformationszeit. Sehenswert sind hier auch die Schlosskapelle und der sehr gut erhaltene Burgfriede - auch Schlosskappelle und der der weiße Blick vom Storchenturm über den ziesarschen Kiez." },
    { id: 2, name: "2. Gutspark Dahlen", x: 780, y: 355, description: "Der Gutspark Dahlen ist ein Waldstück seltener botanischer Wundt. Wobei die Spatziergänge um den Schwanensee die Besucher verzaubern. Zudem kann der Bauengarten Kultur- und Garttern und Duftrlanzen besucht werden. Gleich gegenüber dem Gutspark steht, etwas verborgen, die Friedhofswehrkirche." },
    { id: 3, name: "3. Klein Briesener Bach", x: 995, y: 250, description: "Der Artesische Brunnen ist im Naturschutzgebiet Klein Briesener Bach zu finden. Das Wasser steigt hier nur durch den Erd-Eigendruck hervor und wird durch eine Rinne Briesenfließ zu geführt. Wunderrode können dem Schönheiten Bach auf dem Burgerswanderweg bis zum Aussichtsturm 'Schöne Aussicht'." },
    { id: 4, name: "4. Paradies Dippmannsdorf", x: 1340, y: 275, description: "Hier scheint sich die einigen Dutzend Quellen glaskares Wasser, das die Mühlenbäche speist. Der sonstigen Buchen, Eichen und Birken bestehende Quellkopf wurde sprachlich erschlossen. Ein Spaziergang lohnt sich zu jeder Jahreszeit und lässt sich gut mit einer Wanderung auf dem Kinderferienflugplad verlieren - dem den hier auf dem Burgen-wanderweg verlauft." },
    { id: 5, name: "5. Töpferort Görzke", x: 415, y: 495, description: "Ein Besuch der kleinen Museen und des Hafischens auf dem Handwerkerhof, ein kleiner Bummel entlang der Bauernhöfe hinüber zum Städtchen Ziesar und die Einkaufsmöglichkeiten in fuuf Töpfereien können die Besucher des Flämingdorfes. Auf dem Töpferwanderweg werden Wandernde mit weit-läufigen Ausblicken auf das Tal der Buckau und die umliegende Fläminglandschaft belohnt." },
    { id: 6, name: "6. Hagelberg", x: 955, y: 725, description: "Der Hagelberg, ein echter 'Zweitausender', lädt zum Ein-stieg ins Gipfelbuch ein - nicht ohne Grund wird der Land-strich rings um Klein Glien auch 'Klein-Mittelgebirge' genannt. Für das 'Aufstieg' zum Gipfelkreuz wird mit einem Ausblick auf schönen Blick über die Fläminglandschaft belohnt. Unweit davon öffnet am Wochenende auf dem historischen Gasthof in Klein Glien ein Café für Ausflugsinnen und Ausflüger." },
    { id: 7, name: "7. Bad Belzig mit Burg Eisenhardt", x: 1364, y: 605, description: "Auf der komplett erhaltenen, die 1000-jährige Geschichte der Stadt hautnah erlunden. Vom Butterturm bietet sich wohl der schönste Ausblick auf Stadt und Urstromtal. Unterhalb der Burg befindet sich die Burgwiesen, auf denen die bedrohfreie trachten Großtrappen einen stillen Unterschlupf weckt. In der SteinTherme sorgt jodihaltiges Thermalwasser für gesunde Entspannung." },
    { id: 8, name: "8. Aussichtspunkt Belziger Landschaftswiesen", x: 1575, y: 555, description: "Am Burgenwanderweg 43 gelegen, liest sich ein besonders eindrückender Blick in das Niederungsgebiet der Belziger Land-schaftswiesen. Dort befindet sich eines der wichtigsten Vogelschutzgebiete Brandenburgs. Wenn im Winterhalbjahr Großtrappen pflichtliche Nahrung suchen, bieten sich vom Rastplatz aus sehr gute Beobachtungsmög-lichkeiten." },
    { id: 9, name: "9. Wiesenburg mit Schloss und Park", x: 765, y: 855, description: "Das Schloss erhebt sich heute über das Westende des 19. Jahrhunderts. Vom Schlossturm hat man eine ein-druckvolle Aussicht auf Wiesenburg und seinen Parkburg. Der aufstützende als Landschaftspark gestaltete Schlosspark ist der bedeutendste Aussage seiner Art im Hohen Fläming und lädt zum ausgiebigen Samsaui und Wohlritz. Bis zum Bahnhof erstrekt sich diese Anlage, durch die aus dem Kunstwanderweg führt." },
    { id: 10, name: "10. Naturparkzentrum Hoher Fläming", x: 1165, y: 1370, description: "Das Besucherinformationszentrum ist eine zentrale Anlauf-stelle für alle Gäste. Hier erhält man die besten Tipps für Ausflüge in und durch Hohen Fläming und kann Fahrräder ausleihen. Neben dem Fläming-Laden mit regionalen Produkten lädt eine spannenrde Naturparkzentrums ausstellung und einen 'Garten der Sinne'. Direkt vor dem Naturparkzentrum hält der Bus der genannten." },
    { id: 11, name: "11. Raben mit Burg Rabenstein", x: 1120, y: 1333, description: "Auf der Raben blicken 'legen' legt die süchlichste der Fläming-burgen, die Hohenburg Rabenstein. Von der Burg führt ein Friedlingspfad durch das Naturschutzgebiet Rabenstein hinunter ins Dorf und bis zum Naturparkzentrum. Die topsteller offene Feldsein-kirche kann auch besucht werden. Der Gasthof Hemmerling be-wirtet täglich außer montags seine Gäste." },
    { id: 12, name: "12. Niemegk", x: 1620, y: 1140, description: "Das Städtchen Niemegk und das alte Rathaus prägen das Stadtbild um. Vom Kirchturm bietet sich ein schöner Ausblick auf die Hauptarten des Flämings. Ein greßganter Wasserkrum, der heute ein Brausmuseum, einen Regionalladen und eine Lederungskultur behenbergs, liegen am südlichen Rand der Stadt ganz auf dem Brandwanderweg 44. Ein Ausflug mit dem Rad lohnt sich von Niemeck aus auf die Feldsteinkirchen-radroute, die zu sieben flämingstypischen Kunstensteinsten führt." },
    { id: 13, name: "13. Flämingbuchen", x: 650, y: 1174, description: "In dem großen Waldgebiet der Brandhelfe sind einige Inseln aus Buchen zu finden, wie in den Naturschutz-gebieten 'Flämingbuchen' und 'Spring'. Die Buchen-wanderwegen 70 oder 71 lassen sich diese landschaft-lichen Besonderheiten des Naturparks ertesten. Startpunkte sind die Bahnhöfe Medewitz und Merkenburg." },
    { id: 14, name: "14. Brautrummel mit Riesenstein", x: 1095, y: 995, description: "Wie ein kleiner Scetchel erfrrank im junges Brautpaar nach einem Gewitterregen in der Rummel, einem Trockental. Heute kann man auf einer Rundwanderung zum Rie-senste8n die besondere Natur in der Rummel erleben, Familienfotos auf dem Riesen-stein schleifen, ein Picknick im Grünen genießen und anschlie-ßend ein Nickerchen auf dem großen Feldbreit machen." },
    { id: 15, name: "15. Neuendorfer Rummel", x: 1400, y: 1340, description: "Die Rummeln, verzweigte, enge Trockentälchen, entstan-den nach Regien, Birnen und Weiden der Eiszeit. In Zeiten stetig weiter vereist. Wie grüne, bewaldete Finger stie-chen sie sich weit in die Agrarlandschaft hinein. Über den Burgenwanderweg oder den Rundwanderweg 40 kann man die üppig bewach-sene und stellengeise Neuen-dorfer Rummel durchwandern." },
    { id: 16, name: "16. Garrey mit Aussichtsplattform", x: 1490, y: 1430, description: "Die Landschaft rings um Garrey bietet fantastische Ausblicke, weite Täler und steile, aufgeschnittene Naturpfade. Deshalb 'krönt' eine Aussichtsplattform das alte Wasserwerk, das aufundig restauriert wurde und dem sich eine kleine Ausstellung befindet. Der Ausflug lässt sich sehr gut mit einer Wanderung in die Neuendorfer Rummel und einer Einkehr ins Café Leh-mann in Garrey verbinden." }
];

// Game State
const state = {
    helicopter: {
        x: CONFIG.START_X,
        y: CONFIG.START_Y,
        vx: 0,
        vy: 0,
        angle: -90,
        speed: 0,
        totalDistance: 0,
    },
    input: {
        keys: new Set(),
        joystick: { active: false, angle: 0, magnitude: 0, touchId: null }
    },
    pois: POI_DATA.map(p => ({ ...p, visited: false })),
    nearbyPOI: null,
    visitedCount: 0,
    gameActive: false,
    startTime: 0,
    elapsedTime: 0,
    stats: {
        maxSpeed: 0,
        landings: 0,
        totalDistance: 0
    },
    achievements: new Set(),
    minimapCtx: null as CanvasRenderingContext2D | null,
    three: {
        renderer: null as THREE.WebGLRenderer | null,
        scene: null as THREE.Scene | null,
        camera: null as THREE.PerspectiveCamera | null,
        mapMesh: null as THREE.Mesh | null,
        helicopterModel: null as THREE.Group | null,
    }
};

// DOM Cache
const dom = {
    loadingScreen: document.getElementById('loading-screen') as HTMLElement,
    mapContainer: document.getElementById('map-container') as HTMLElement,
    speedDisplay: document.getElementById('speed-display') as HTMLElement,
    poiCount: document.getElementById('poi-count') as HTMLElement,
    timeDisplay: document.getElementById('time-display') as HTMLElement,
    headingDisplay: document.getElementById('heading-display') as HTMLElement,
    compassNeedle: document.getElementById('compass-needle') as HTMLElement,
    joystickContainer: document.getElementById('joystick-container') as HTMLElement,
    joystickHandle: document.getElementById('joystick-handle') as HTMLElement,
    menuButton: document.getElementById('menu-button') as HTMLButtonElement,
    menuContainer: document.getElementById('menu-container') as HTMLElement,
    menuClose: document.getElementById('menu-close') as HTMLButtonElement,
    poiList: document.getElementById('poi-list') as HTMLElement,
    statDistance: document.getElementById('stat-distance') as HTMLElement,
    statMaxSpeed: document.getElementById('stat-max-speed') as HTMLElement,
    statLandings: document.getElementById('stat-landings') as HTMLElement,
    statCompletion: document.getElementById('stat-completion') as HTMLElement,
    poiModal: document.getElementById('poi-modal') as HTMLElement,
    poiModalTitle: document.getElementById('poi-modal-title') as HTMLElement,
    poiModalDescription: document.getElementById('poi-modal-description') as HTMLElement,
    modalIcon: document.getElementById('modal-icon') as HTMLElement,
    modalVisitTime: document.getElementById('modal-visit-time') as HTMLElement,
    modalPOINumber: document.getElementById('modal-poi-number') as HTMLElement,
    continueButton: document.getElementById('continue-button') as HTMLButtonElement,
    nextPOIButton: document.getElementById('next-poi-button') as HTMLButtonElement,
    completionModal: document.getElementById('completion-modal') as HTMLElement,
    finalTime: document.getElementById('final-time') as HTMLElement,
    finalDistance: document.getElementById('final-distance') as HTMLElement,
    finalSpeed: document.getElementById('final-speed') as HTMLElement,
    restartButton: document.getElementById('restart-button') as HTMLButtonElement,
    exploreButton: document.getElementById('explore-button') as HTMLButtonElement,
    achievementToast: document.getElementById('achievement-toast') as HTMLElement,
    achievementText: document.getElementById('achievement-text') as HTMLElement,
    minimapCanvas: document.getElementById('minimap-canvas') as HTMLCanvasElement
};

// Audio System
let audio = {
    initialized: false,
};

function initAudio() {
    if (audio.initialized) return;
    audio.initialized = true;
    console.log("Audio disabled for offline compatibility.");
}

function initThreeScene() {
    const { mapContainer } = dom;
    if (!mapContainer) return;

    // Renderer
    state.three.renderer = new THREE.WebGLRenderer({ antialias: true });
    state.three.renderer.setSize(window.innerWidth, window.innerHeight);
    mapContainer.appendChild(state.three.renderer.domElement);

    // Scene
    state.three.scene = new THREE.Scene();
    state.three.scene.background = new THREE.Color(0xf4f1e8);
    state.three.scene.fog = new THREE.Fog(0xf4f1e8, 1000, 2500);

    // Camera
    state.three.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    state.three.camera.position.z = 800;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    state.three.scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1000, 500);
    state.three.scene.add(directionalLight);

    // Helicopter Model
    state.three.helicopterModel = createHelicopterModel();
    state.three.scene.add(state.three.helicopterModel);

    // Skybox
    const skybox = createSkybox();
    state.three.scene.add(skybox);

    // POI Markers
    state.pois.forEach(poi => {
        const marker = createPOIMarker(poi);
        marker.position.set(poi.x - CONFIG.MAP_WIDTH / 2, -poi.y + CONFIG.MAP_HEIGHT / 2, 0);
        state.three.scene.add(marker);
    });

    // Map Plane
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('images/map.jpg', (texture) => {
        const geometry = new THREE.PlaneGeometry(CONFIG.MAP_WIDTH, CONFIG.MAP_HEIGHT);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        state.three.mapMesh = new THREE.Mesh(geometry, material);
        state.three.scene.add(state.three.mapMesh);
        onMapLoaded();
    }, undefined, onMapError);

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    if (state.three.camera && state.three.renderer) {
        state.three.camera.aspect = window.innerWidth / window.innerHeight;
        state.three.camera.updateProjectionMatrix();
        state.three.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Initialize
function init() {
    try {
        initThreeScene();
        createPOIMarkers();
        populatePOIList();
        setupEventListeners();
        setupMinimap();
    } catch (error) {
        console.error('Initialization error:', error);
        if (dom.loadingScreen) {
            dom.loadingScreen.innerHTML = `<p>Error initializing game: ${(error as Error).message}</p>`;
        }
    }
}

let mapLoaded = false;
function onMapLoaded() {
    if (mapLoaded) return;
    mapLoaded = true;

    dom.loadingScreen.style.opacity = '0';
    setTimeout(() => {
        dom.loadingScreen.style.display = 'none';
        state.gameActive = true;
        state.startTime = Date.now();
        requestAnimationFrame(gameLoop);
    }, 500);
}

function onMapError() {
    dom.loadingScreen.innerHTML = `
        <div class="loading-content" style="color: #c94a4a;">
            <div class="loading-helicopter" style="animation: none;">⚠️</div>
            <div class="loading-text">Error: Map failed to load.</div>
            <p style="font-size: 14px; color: var(--text-secondary); max-width: 300px; text-align: center;">
                Please check the developer console for more details and ensure the file at 'images/map.jpg' is available.
            </p>
        </div>
    `;
}


function populatePOIList() {
    dom.poiList.innerHTML = '';
    state.pois.forEach(poi => {
        const item = document.createElement('div');
        item.className = 'poi-item';
        item.id = `poi-list-${poi.id}`;
        item.innerHTML = `
            <div class="poi-item-header">
                <div class="poi-item-name">${poi.name}</div>
                <div class="poi-item-status">${poi.visited ? '✓' : ''}</div>
            </div>`;
        
        item.addEventListener('click', () => {
            // centerCameraOn(poi.x, poi.y);
            closeMenu();
        });
        dom.poiList.appendChild(item);
    });
}

function setupMinimap() {
    const canvas = dom.minimapCanvas;
    const ctx = canvas.getContext('2d');
    canvas.width = 180;
    canvas.height = 135;
    state.minimapCtx = ctx;
}

function setupEventListeners() {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    dom.joystickContainer.addEventListener('touchstart', handleJoystickStart, { passive: false });
    document.addEventListener('touchmove', handleJoystickMove, { passive: false });
    document.addEventListener('touchend', handleJoystickEnd, { passive: false });
    dom.joystickContainer.addEventListener('mousedown', handleJoystickMouseStart);
    document.addEventListener('mousemove', handleJoystickMouseMove);
    document.addEventListener('mouseup', handleJoystickMouseEnd);
    dom.landButton.addEventListener('click', landAtPOI);
    dom.menuButton.addEventListener('click', toggleMenu);
    dom.menuClose.addEventListener('click', closeMenu);
    dom.continueButton.addEventListener('click', resumeFlight);
    dom.nextPOIButton.addEventListener('click', navigateToNextPOI);
    dom.restartButton.addEventListener('click', restartGame);
    dom.exploreButton.addEventListener('click', freeFlightMode);
    document.addEventListener('contextmenu', e => e.preventDefault());
}

// Input Handlers
function handleKeyDown(e: KeyboardEvent) {
    if (!state.gameActive) return;
    initAudio();
    state.input.keys.add(e.key.toLowerCase());
    if ((e.key === 'l' || e.key === 'L') && state.nearbyPOI) landAtPOI();
    if (e.key === 'm' || e.key === 'M') toggleMenu();
    if (e.key === 'Escape') closeMenu();
}

function handleKeyUp(e: KeyboardEvent) {
    state.input.keys.delete(e.key.toLowerCase());
}

let joystickMouseActive = false;
function handleJoystickStart(e: TouchEvent) {
    if (!state.gameActive || state.input.joystick.active) return;
    initAudio();
    e.preventDefault();
    const touch = e.touches[0];
    state.input.joystick.active = true;
    state.input.joystick.touchId = touch.identifier;
    updateJoystick(touch.clientX, touch.clientY);
}

function handleJoystickMove(e: TouchEvent) {
    if (!state.input.joystick.active) return;
    for (let touch of e.touches) {
        if (touch.identifier === state.input.joystick.touchId) {
            e.preventDefault();
            updateJoystick(touch.clientX, touch.clientY);
            break;
        }
    }
}

function handleJoystickEnd(e: TouchEvent) {
    for (let touch of e.changedTouches) {
        if (touch.identifier === state.input.joystick.touchId) {
            e.preventDefault();
            resetJoystick();
            break;
        }
    }
}

function handleJoystickMouseStart(e: MouseEvent) {
    if (!state.gameActive) return;
    initAudio();
    e.preventDefault();
    joystickMouseActive = true;
    state.input.joystick.active = true;
    updateJoystick(e.clientX, e.clientY);
}

function handleJoystickMouseMove(e: MouseEvent) {
    if (!joystickMouseActive) return;
    updateJoystick(e.clientX, e.clientY);
}

function handleJoystickMouseEnd() {
    if (!joystickMouseActive) return;
    joystickMouseActive = false;
    resetJoystick();
}

function updateJoystick(clientX: number, clientY: number) {
    const rect = dom.joystickContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    let dx = clientX - centerX;
    let dy = clientY - centerY;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > CONFIG.JOYSTICK_RADIUS) {
        dx = (dx / distance) * CONFIG.JOYSTICK_RADIUS;
        dy = (dy / distance) * CONFIG.JOYSTICK_RADIUS;
        distance = CONFIG.JOYSTICK_RADIUS;
    }
    state.input.joystick.angle = Math.atan2(dy, dx);
    state.input.joystick.magnitude = distance / CONFIG.JOYSTICK_RADIUS;
    dom.joystickHandle.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
}

function resetJoystick() {
    state.input.joystick.active = false;
    state.input.joystick.magnitude = 0;
    state.input.joystick.touchId = null;
    dom.joystickHandle.style.transform = 'translate(-50%, -50%)';
}

// Game Loop
let lastTime = 0;
function gameLoop(currentTime: number) {
    const deltaTime = Math.min((currentTime - lastTime) / 16.67, 2);
    lastTime = currentTime;
    if (state.gameActive) {
        update(deltaTime);
        render();
    }
    requestAnimationFrame(gameLoop);
}

function update(dt: number) {
    const heli = state.helicopter;
    if (state.startTime > 0) state.elapsedTime = Date.now() - state.startTime;

    let thrust = 0;
    let turning = 0;
    if (state.input.keys.has('arrowup') || state.input.keys.has('w')) thrust = 1;
    if (state.input.keys.has('arrowdown') || state.input.keys.has('s')) thrust = -0.5;
    if (state.input.keys.has('arrowleft') || state.input.keys.has('a')) turning = -1;
    if (state.input.keys.has('arrowright') || state.input.keys.has('d')) turning = 1;

    if (state.input.joystick.active && state.input.joystick.magnitude > 0.1) {
        thrust = state.input.joystick.magnitude;
        const targetAngle = state.input.joystick.angle * 180 / Math.PI;
        let angleDiff = targetAngle - heli.angle;
        while (angleDiff > 180) angleDiff -= 360;
        while (angleDiff < -180) angleDiff += 360;
        turning = Math.max(-1, Math.min(1, angleDiff / 45));
    }

    heli.angle += turning * CONFIG.TURN_SPEED * dt;
    heli.angle = (heli.angle + 360) % 360;

    const angleRad = heli.angle * Math.PI / 180;
    const accel = thrust * CONFIG.ACCELERATION;
    heli.vx += Math.cos(angleRad) * accel * dt;
    heli.vy += Math.sin(angleRad) * accel * dt;

    const drag = state.nearbyPOI ? 0.88 : CONFIG.DRAG;
    heli.vx *= Math.pow(drag, dt);
    heli.vy *= Math.pow(drag, dt);

    const oldX = heli.x;
    const oldY = heli.y;
    heli.speed = Math.sqrt(heli.vx * heli.vx + heli.vy * heli.vy);
    if (heli.speed > CONFIG.MAX_SPEED) {
        const scale = CONFIG.MAX_SPEED / heli.speed;
        heli.vx *= scale;
        heli.vy *= scale;
        heli.speed = CONFIG.MAX_SPEED;
    }

    heli.x += heli.vx * dt;
    heli.y += heli.vy * dt;
    heli.x = Math.max(20, Math.min(CONFIG.MAP_WIDTH - 20, heli.x));
    heli.y = Math.max(20, Math.min(CONFIG.MAP_HEIGHT - 20, heli.y));

    const distance = Math.sqrt(Math.pow(heli.x - oldX, 2) + Math.pow(heli.y - oldY, 2));
    if (distance > 0.01) {
        heli.totalDistance += distance;
        state.stats.totalDistance = heli.totalDistance / 100;
    }

    if (heli.speed > state.stats.maxSpeed) state.stats.maxSpeed = heli.speed;

    checkPOIProximity();
    updateAudio();
}

function checkPOIProximity() {
    let nearestPOI = null;
    let minDistance = Infinity;
    state.pois.forEach((poi, index) => {
        if (poi.visited) return;
        const distance = Math.hypot(state.helicopter.x - poi.x, state.helicopter.y - poi.y);
        const marker = state.three.scene?.children.find(c => c.position.x === poi.x - CONFIG.MAP_WIDTH / 2 && c.position.y === -poi.y + CONFIG.MAP_HEIGHT / 2) as THREE.Mesh;

        if (distance < CONFIG.LANDING_RADIUS) {
            if (distance < minDistance) {
                nearestPOI = poi;
                minDistance = distance;
            }
            if (marker) {
                (marker.children[0] as THREE.Mesh).material.color.set(0x5a9a68);
            }
        } else {
            if (marker) {
                (marker.children[0] as THREE.Mesh).material.color.set(0xc94a4a);
            }
        }
    });

    if (nearestPOI && nearestPOI !== state.nearbyPOI) {
        state.nearbyPOI = nearestPOI;
        landAtPOI();
    } else if (!nearestPOI) {
        state.nearbyPOI = null;
    }
}

function updateAudio() {
    // Audio is disabled for offline compatibility
    return;
}

function render() {
    if (state.three.renderer && state.three.scene && state.three.camera) {
        const heli = state.helicopter;
        const camera = state.three.camera;

        // Smooth camera follow
        const targetPosition = new THREE.Vector3(
            heli.x - CONFIG.MAP_WIDTH / 2,
            -heli.y + CONFIG.MAP_HEIGHT / 2 + 300, // Y-offset for better view
            800 - heli.speed * 50 // Zoom out with speed
        );
        camera.position.lerp(targetPosition, 0.05);

        // Look at the helicopter
        const lookAtTarget = new THREE.Vector3(
            heli.x - CONFIG.MAP_WIDTH / 2,
            -heli.y + CONFIG.MAP_HEIGHT / 2,
            0
        );
        camera.lookAt(lookAtTarget);

        state.three.renderer.render(state.three.scene, state.three.camera);
    }

    // Update helicopter model
    if (state.three.helicopterModel) {
        const heli = state.helicopter;
        state.three.helicopterModel.position.x = heli.x - CONFIG.MAP_WIDTH / 2;
        state.three.helicopterModel.position.y = -heli.y + CONFIG.MAP_HEIGHT / 2;
        state.three.helicopterModel.position.z = 50; // Altitude
        state.three.helicopterModel.rotation.y = -heli.angle * Math.PI / 180;

        // Animate rotor
        const mainRotor = state.three.helicopterModel.children[3];
        if(mainRotor) {
            mainRotor.rotation.y += state.helicopter.speed * 0.5 + 0.1;
        }
    }

    dom.speedDisplay.textContent = state.helicopter.speed.toFixed(1);
    dom.poiCount.textContent = `${state.visitedCount}/16`;
    dom.timeDisplay.textContent = formatTime(state.elapsedTime);
    const heading = Math.round((state.helicopter.angle + 360) % 360);
    dom.headingDisplay.textContent = `${heading}°`;
    dom.compassNeedle.style.transform = `rotate(${state.helicopter.angle}deg)`;

    dom.statDistance.textContent = state.stats.totalDistance.toFixed(1);
    dom.statMaxSpeed.textContent = state.stats.maxSpeed.toFixed(1);
    dom.statLandings.textContent = String(state.stats.landings);
    dom.statCompletion.textContent = `${Math.round((state.visitedCount / 16) * 100)}%`;

    renderMinimap();
}

function renderMinimap() {
    const ctx = state.minimapCtx;
    if (!ctx) return;
    const w = 180, h = 135;
    const scale = w / CONFIG.MAP_WIDTH;
    
    ctx.fillStyle = 'rgba(244, 241, 232, 0.7)'; // Match background
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.strokeRect(0, 0, w, h);
    
    state.pois.forEach(poi => {
        ctx.fillStyle = poi.visited ? '#5a9a68' : '#c94a4a';
        ctx.beginPath();
        ctx.arc(poi.x * scale, poi.y * scale, 2, 0, Math.PI * 2);
        ctx.fill();
    });
    
    ctx.save();
    ctx.translate(state.helicopter.x * scale, state.helicopter.y * scale);
    ctx.rotate((state.helicopter.angle + 90) * Math.PI / 180);
    ctx.fillStyle = '#3d352e';
    ctx.beginPath();
    ctx.moveTo(0, -4);
    ctx.lineTo(-3, 3);
    ctx.lineTo(3, 3);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

// Game Actions
function landAtPOI() {
    if (!state.nearbyPOI || !state.gameActive) return;
    
    state.gameActive = false;
    state.helicopter.vx = 0;
    state.helicopter.vy = 0;
    state.stats.landings++;
    
    const poi = state.nearbyPOI;
    if (!poi.visited) {
        poi.visited = true;
        state.visitedCount++;
        document.getElementById(`poi-${poi.id}`)?.classList.add('visited');
        const listItem = document.getElementById(`poi-list-${poi.id}`);
        if(listItem) {
            listItem.classList.add('visited');
            (listItem.querySelector('.poi-item-status') as HTMLElement).textContent = '✓';
        }
        checkAchievements();
    }
    
    dom.landButton.classList.remove('visible');
    showPOIModal(poi);
    if (state.visitedCount === 16) setTimeout(showCompletionModal, 1500);
}

function showPOIModal(poi: typeof POI_DATA[0] & { visited: boolean }) {
    dom.poiModalTitle.textContent = poi.name;
    dom.poiModalDescription.textContent = poi.description;
    dom.modalIcon.textContent = String(poi.id);
    dom.modalVisitTime.textContent = formatTime(state.elapsedTime);
    dom.modalPOINumber.textContent = `${state.visitedCount}/16`;
    dom.poiModal.classList.toggle('visited', poi.visited);
    dom.nextPOIButton.style.display = state.pois.some(p => !p.visited) ? 'block' : 'none';
    dom.poiModal.classList.add('active');
}

function resumeFlight() {
    dom.poiModal.classList.remove('active');
    state.gameActive = true;
    state.nearbyPOI = null;
    document.querySelectorAll('.poi-marker.nearby').forEach(m => m.classList.remove('nearby'));
}

function navigateToNextPOI() {
    const unvisited = state.pois.filter(p => !p.visited);
    if (unvisited.length === 0) return;
    let nearest = unvisited[0];
    let minDist = Infinity;
    unvisited.forEach(poi => {
        const dist = Math.hypot(poi.x - state.helicopter.x, poi.y - state.helicopter.y);
        if (dist < minDist) {
            minDist = dist;
            nearest = poi;
        }
    });
    // centerCameraOn(nearest.x, nearest.y);
    resumeFlight();
}

function showCompletionModal() {
    dom.finalTime.textContent = formatTime(state.elapsedTime);
    dom.finalDistance.textContent = `${state.stats.totalDistance.toFixed(1)} km`;
    const avgSpeed = state.stats.totalDistance / (state.elapsedTime / 3600000) || 0;
    dom.finalSpeed.textContent = avgSpeed.toFixed(1);
    dom.completionModal.classList.add('active');
    showAchievement('🏆', 'Mission Complete!');
}

function checkAchievements() {
    if (state.visitedCount === 1 && !state.achievements.has('first')) {
        state.achievements.add('first');
        showAchievement('🎯', 'First Landing!');
    }
    if (state.visitedCount === 8 && !state.achievements.has('halfway')) {
        state.achievements.add('halfway');
        showAchievement('⭐', 'Halfway There!');
    }
    if (state.stats.maxSpeed >= 5.8 && !state.achievements.has('speed')) {
        state.achievements.add('speed');
        showAchievement('🚀', 'Speed Demon!');
    }
}

function showAchievement(icon: string, text: string) {
    dom.achievementText.textContent = text;
    const iconSpan = dom.achievementToast.querySelector('.achievement-icon');
    if (iconSpan) iconSpan.textContent = icon;
    dom.achievementToast.classList.add('show');
    setTimeout(() => dom.achievementToast.classList.remove('show'), 3000);
}

function toggleMenu() {
    dom.menuContainer.classList.toggle('open');
}

function closeMenu() {
    dom.menuContainer.classList.remove('open');
}

function restartGame() {
    state.helicopter = { x: CONFIG.START_X, y: CONFIG.START_Y, vx: 0, vy: 0, angle: -90, speed: 0, totalDistance: 0 };
    state.visitedCount = 0;
    state.nearbyPOI = null;
    state.gameActive = true;
    state.startTime = Date.now();
    state.elapsedTime = 0;
    state.stats = { maxSpeed: 0, landings: 0, totalDistance: 0 };
    state.achievements.clear();
    
    state.pois.forEach(poi => {
        poi.visited = false;
        document.getElementById(`poi-${poi.id}`)?.classList.remove('visited', 'nearby');
        const listItem = document.getElementById(`poi-list-${poi.id}`);
        if(listItem) {
            listItem.classList.remove('visited');
            (listItem.querySelector('.poi-item-status') as HTMLElement).textContent = '';
        }
    });
    
    dom.completionModal.classList.remove('active');
    dom.poiModal.classList.remove('active');
    dom.landButton.classList.remove('visible');
    resetJoystick();
    // centerCamera();
}

function freeFlightMode() {
    dom.completionModal.classList.remove('active');
    state.gameActive = true;
    state.startTime = Date.now();
    showAchievement('🦅', 'Free Flight Mode!');
}

function formatTime(ms: number) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function createHelicopterModel() {
    const helicopter = new THREE.Group();

    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xd9534f, metalness: 0.5, roughness: 0.5 });
    const bodyGeometry = new THREE.BoxGeometry(30, 15, 15);
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    helicopter.add(body);

    const tailBoomGeometry = new THREE.CylinderGeometry(2, 2, 25, 8);
    const tailBoom = new THREE.Mesh(tailBoomGeometry, bodyMaterial);
    tailBoom.position.x = -20;
    tailBoom.rotation.z = Math.PI / 2;
    helicopter.add(tailBoom);

    const tailRotorGeometry = new THREE.BoxGeometry(1, 10, 1);
    const tailRotorMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.2 });
    const tailRotor = new THREE.Mesh(tailRotorGeometry, tailRotorMaterial);
    tailRotor.position.set(-32, 5, 0);
    helicopter.add(tailRotor);

    const mainRotorGeometry = new THREE.BoxGeometry(80, 2, 1);
    const mainRotor = new THREE.Mesh(mainRotorGeometry, tailRotorMaterial);
    mainRotor.position.y = 10;
    helicopter.add(mainRotor);

    return helicopter;
}

function createPOIMarker(poi: typeof POI_DATA[0]) {
    const markerGroup = new THREE.Group();

    const geometry = new THREE.CylinderGeometry(15, 15, 5, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xc94a4a });
    const cylinder = new THREE.Mesh(geometry, material);
    markerGroup.add(cylinder);

    return markerGroup;
}

function createSkybox() {
    const skyboxGeometry = new THREE.BoxGeometry(5000, 5000, 5000);
    const skyboxMaterial = new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide });
    return new THREE.Mesh(skyboxGeometry, skyboxMaterial);
}

// Since the script is a module and at the end of the body, the DOM is already parsed.
// We can call init() directly for a simpler and more reliable startup.
init();