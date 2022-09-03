import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js'
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

import SolarSystem from './local_modules/SolarSystem';
import Stars from './local_modules/Stars';

/**
 * Buttons
 */
 const playButton = document.querySelector('button.play');
 const randomizeButton = document.querySelector('button.randomize');

/*
 * Audio
*/
const audioContext = new AudioContext();
const audioElement = document.querySelector('audio');
const track = audioContext.createMediaElementSource(audioElement);

const gainNode = audioContext.createGain()
gainNode.gain.value = 0.5

const analyser = audioContext.createAnalyser()

track.connect(gainNode).connect(audioContext.destination);
track.connect(analyser);
// analyser.connect(audioContext.destination)


/**
 * Texture
 */
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Stars
const stars_firstLayer = new Stars(80, textureLoader);
const stars0 = new Stars(100, textureLoader);
const stars_lastLayer = new Stars(120, textureLoader);
const nebulae = new Stars(10, textureLoader, {
    texturePath: 'nebula',
    size: 10
});

// Solar System
const solarSystem = new SolarSystem(new THREE.Vector3(0, 0, 0), textureLoader)
solarSystem.sun.light.layers.set(1)

scene.add(...solarSystem.planets, solarSystem.sun.mesh, solarSystem.sun.light, stars_firstLayer.particles, stars0.particles, stars_lastLayer.particles, nebulae.particles);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
ambientLight.layers.set(1)
scene.add(ambientLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 10
camera.position.y = 10
camera.position.z = 10
camera.lookAt(new THREE.Vector3(0, 0, 0))
camera.far = stars_lastLayer.radius * 30
camera.updateProjectionMatrix()
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.minDistance = 10
controls.maxDistance = 80
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.autoClear = false;
renderer.setClearColor(0xffffffff, 0.0);

// Post-processing
//bloom renderer
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
);
bloomPass.threshold = 0.2;
bloomPass.strength = 2; //intensity of glow
bloomPass.radius = 0;
const bloomComposer = new EffectComposer(renderer);
bloomComposer.setSize(window.innerWidth, window.innerHeight);
bloomComposer.renderToScreen = true;
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

solarSystem.sun.mesh.layers.set(1);
stars_firstLayer.particles.layers.set(1);
stars0.particles.layers.set(1);
stars_lastLayer.particles.layers.set(1);

/**
 * Animate
 */
const clock = new THREE.Clock()

// Play Song
playButton.addEventListener('click', () => {
    console.log(audioElement.readyState)
    audioElement.play()
    document.querySelector('.webgl').style['z-index'] = '10'
})

// Randomize system
randomizeButton.addEventListener('click', () => {
    location.reload()
})

window.addEventListener('load', () => {

    // if(!audioElement.paused) {
    //     audioElement.pause()
    // }

    // audioElement.play()
    
    analyser.fftSize = 64
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const tick = () =>
        {
            analyser.getByteFrequencyData(dataArray);

            //update sun
            solarSystem.sun.mesh.scale.x = 1 + dataArray[16] / 255
            solarSystem.sun.mesh.scale.y = 1 + dataArray[16] / 255
            solarSystem.sun.mesh.scale.z = 1 + dataArray[16] / 255

            solarSystem.sun.light.intensity = 0.1 + dataArray[16] / 125

            const factor = dataArray[16] / 512

            const elapsedTime = clock.getElapsedTime()

            // Update objects
            solarSystem.update(elapsedTime, factor)
            stars_firstLayer.update(elapsedTime, 1)
            stars0.update(elapsedTime, 0.9)
            stars_lastLayer.update(elapsedTime, 0.8)

            // Update controls
            controls.update()

            // Render
            // camera.layers.set(0);
            // renderer.render(scene, camera);
            camera.layers.set(1);
            bloomComposer.render();

            // Call tick again on the next frame
            window.requestAnimationFrame(tick)
        }
    tick()
})