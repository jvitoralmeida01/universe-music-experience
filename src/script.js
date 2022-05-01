import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Texture
 */
const loadingManager = new THREE.LoadingManager();
// loadingManager.onStart = () => {console.log("Starting")}
// loadingManager.onLoad = () => {console.log("Loaded")}
// loadingManager.onProgress = () => {console.log("Progress")}
// loadingManager.onError = () => {console.log("Error")}
const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoader.load('./textures/minecraft.png');

// when using NearestFilter as the minFilter we dont need to generate the mipmaps (better for the GPU)
colorTexture.generateMipmaps = false
colorTexture.minFilter = THREE.NearestFilter
colorTexture.magFilter = THREE.NearestFilter

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
let planets = new Array(8)
let planetsOrbit = new Array(8)
// Material
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000
})
planeMaterial.roughness = 0.4

// const planetMaterial = new THREE.MeshStandardMaterial()
// planetMaterial.roughness = 0.2

// Planets
    const mercury = new THREE.Mesh(
        new THREE.SphereGeometry(0.03, 32, 32),
        new THREE.MeshStandardMaterial({
            color: 0xaaaaaa,
        })
    )
    mercury.position.x = -0.3
    mercury.position.y = -0.6
    planets[0] = mercury
    planetsOrbit[0] = 0.3

    const venus = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 32, 32),
        new THREE.MeshStandardMaterial({
            color: 0xeeff00,
        })
    )
    venus.position.x = -0.6
    venus.position.y = -0.6
    planets[1] = venus
    planetsOrbit[1] = 0.6

    const earth = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 32, 32),
        new THREE.MeshStandardMaterial({
            color: 0x0000ff,
        })
    )
    earth.position.x = -0.9
    earth.position.y = -0.6
    planets[2] = earth
    planetsOrbit[2] = 0.9

    const mars = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 32, 32),
        new THREE.MeshStandardMaterial({
            color: 0xff0000,
        })
    )
    mars.position.x = -1.2
    mars.position.y = -0.6
    planets[4] = mars
    planetsOrbit[4] = 1.2
    
const sunMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 32, 32),
    new THREE.MeshBasicMaterial({color: 0xffff77})
)
sunMesh.position.set(0, 0, 0)

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 5),
    planeMaterial
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 1

scene.add(...planets, plane, sunMesh)

/**
 * Lights
 */
// const rectAreaLight = new THREE.RectAreaLight(0xffffff, 1, 2, 2)
// rectAreaLight.position.set(0, 0, -2)
// rectAreaLight.rotation.y = Math.PI
// scene.add(rectAreaLight)

const dirLight = new THREE.DirectionalLight(0xffffff, 0.08)
dirLight.position.set(0, 1, 1)
scene.add(dirLight)

const sunLight = new THREE.PointLight(0xffffaa, 1)
sunLight.position.set(sunMesh.position.x, sunMesh.position.y, sunMesh.position.z)
scene.add(sunLight)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 1
camera.lookAt(new THREE.Vector3(0, 0, 0))
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
        // update Sun
        sunMesh.position.y = (Math.sin(elapsedTime) * 0.1) - 0.6
        sunLight.position.y = (Math.sin(elapsedTime) * 0.1) - 0.6
        // update planets
        planets.forEach(planet => {
            let index = planets.indexOf(planet)
            let orbit = planetsOrbit[index]
            let speed = 1 / planetsOrbit[index] 
            planet.position.x = (Math.sin(elapsedTime*speed) * orbit)
            planet.position.z = (Math.cos(elapsedTime*speed) * orbit)
        })

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()