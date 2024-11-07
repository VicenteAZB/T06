import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Crear la escena, la cámara y el renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Agregar luz ambiental básica
const light = new THREE.AmbientLight(0x808080); // Luz ambiental
scene.add(light);

// Agregar luz direccional para darle más profundidad a los modelos
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Cargar los modelos GLTF
const loader = new GLTFLoader();
let model1, model2, model3;

// Cargar el primer modelo
loader.load('pez1/scene.gltf', (gltf) => {
    model1 = gltf.scene;
    model1.scale.set(26, 26, 26); // Escalar el modelo
    model1.position.set(-50, 0, 0); // Posicionar el modelo
    scene.add(model1);
});

// Cargar el segundo modelo
loader.load('pez2/scene.gltf', (gltf) => {
    model2 = gltf.scene;
    model2.scale.set(0.3, 0.3, 0.3); // Escalar el modelo
    model2.position.set(50, 0, 0); // Posicionar el modelo
    scene.add(model2);
});

// Cargar el tercer modelo
loader.load('pez3/scene.gltf', (gltf) => {
    model3 = gltf.scene;
    model3.scale.set(32, 32, 32); // Escalar el modelo
    model3.position.set(0, -100, 0); // Posicionar el modelo
    scene.add(model3);
});

// Configuración de la cámara (ajustar posición)
camera.position.z = 280;
camera.position.y = 100; // Elevar la cámara para obtener una mejor vista

// Agregar controles de cámara para rotar y hacer zoom
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Suavizar el movimiento
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;

const listener = new THREE.AudioListener();
camera.add(listener);

// Crear un objeto `Audio` y asociarlo al `AudioListener`
const sound = new THREE.Audio(listener);

// Cargar la canción
const audioLoader = new THREE.AudioLoader();
let audioStarted = false; // Variable para rastrear si el audio ha comenzado

// Función para reproducir el sonido
const playAudio = () => {
    audioLoader.load('t.mp3', (buffer) => {
        sound.setBuffer(buffer);
        sound.setLoop(true); // Reproducir en bucle
        sound.setVolume(0.5); // Volumen de la música (puedes ajustar este valor)
        sound.play(); // Iniciar la reproducción
    });
};

// Esperar a que el usuario haga clic para iniciar el audio
document.addEventListener('click', () => {
    if (!audioStarted) {
        audioStarted = true;
        playAudio();
    }
});

// Animación y renderizado
function animate() {
    requestAnimationFrame(animate);

    // Rotar los modelos
    if (model1) model1.rotation.y += 0.01;
    if (model2) model2.rotation.y -= 0.01;
    if (model3) model3.rotation.y += 0.01;

    // Actualizar controles
    controls.update();

    renderer.render(scene, camera);
}

// Llamar a la función de animación
animate();

// Ajustar el tamaño del renderizador cuando la ventana cambie de tamaño
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
