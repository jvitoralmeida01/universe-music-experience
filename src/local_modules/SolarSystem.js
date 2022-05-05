import * as THREE from 'three'

export default class SolarSystem {
    constructor() {
        this.sun = this.sun()
    }
    static  sun = () => {
        const sunMesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 32, 32),
            new THREE.MeshBasicMaterial({color: 0xffff77})
        )
        sunMesh.position.set(0, 0, 0)
        return sunMesh
    }

    static planet = (radius, color) => {
    }
}

// let planets = new Array()
// let planetsOrbit = new Array()
// const mercury = new THREE.Mesh(
//     new THREE.SphereGeometry(0.03, 32, 32),
//     new THREE.MeshStandardMaterial({
//         color: 0xaaaaaa,
//     })
// )
// mercury.position.x = -0.3
// mercury.position.y = -0.6
// planets[0] = mercury
// planetsOrbit[0] = 0.3

// const venus = new THREE.Mesh(
//     new THREE.SphereGeometry(0.05, 32, 32),
//     new THREE.MeshStandardMaterial({
//         color: 0xeeff00,
//     })
// )
// venus.position.x = -0.6
// venus.position.y = -0.6
// planets[1] = venus
// planetsOrbit[1] = 0.6

// const earth = new THREE.Mesh(
//     new THREE.SphereGeometry(0.07, 32, 32),
//     new THREE.MeshStandardMaterial({
//         color: 0x0000ff,
//     })
// )
// earth.position.x = -0.9
// earth.position.y = -0.6
// planets[2] = earth
// planetsOrbit[2] = 0.9

// const mars = new THREE.Mesh(
//     new THREE.SphereGeometry(0.05, 32, 32),
//     new THREE.MeshStandardMaterial({
//         color: 0xff0000,
//     })
// )
// mars.position.x = -1.2
// mars.position.y = -0.6
// planets[4] = mars
// planetsOrbit[4] = 1.2