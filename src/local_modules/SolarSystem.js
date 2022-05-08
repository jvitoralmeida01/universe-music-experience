import * as THREE from 'three'

export default class SolarSystem {
    constructor(origin, textureLoader) {

        this.sunTexture = textureLoader.load('./textures/rocky/sun.jpg');
        this.displacementSunTexture = textureLoader.load('./textures/rocky/displacementSun.jpg');
        

        this.sun = this.sunCreator(origin.x, origin.y, origin.z, (Math.random() > 0.5));
        this.planets = new Array(8).fill(null).map((_, index) => this.planetCreator(
            this.sun.mesh.position,
            0.2 + Math.random()*0.5,
            Math.floor(Math.random()*10000000).toString(16),
            index,
            textureLoader
        ));
    }

    sunCreator(x, y, z, blue = false) {
        const sunMesh = new THREE.Mesh(
            new THREE.SphereGeometry(1, 32, 32),
            new THREE.MeshBasicMaterial({
                color: blue ? 0x55ddff : 0xffdd55,
            })
        )
        sunMesh.position.set(x, y, z);
        const sunLight = new THREE.PointLight(0xffffaa, 1)
        sunLight.position.set(sunMesh.position.x, sunMesh.position.y, sunMesh.position.z)
        return {
            mesh: sunMesh,
            light: sunLight,
        }
    }

    planetCreator(orbitCenter, radius, color, index, textureLoader) {
        const planetTexture = textureLoader.load('./textures/rocky/' + Math.floor((Math.random()*6)) + '.jpg');
        // when using NearestFilter as the minFilter we dont need to generate the mipmaps (better for the GPU)
        planetTexture.generateMipmaps = false
        planetTexture.minFilter = THREE.NearestFilter
        planetTexture.magFilter = THREE.NearestFilter

        const planetMesh = new THREE.Mesh(
            new THREE.SphereGeometry(radius, 32, 32),
            new THREE.MeshStandardMaterial({
                color: 0xaaaaaa,
                map: planetTexture,
            })
        )
        planetMesh.position.set( orbitCenter.x + this.getOrbit(index), orbitCenter.y, orbitCenter.z );
        planetMesh.layers.set(1)
        return planetMesh;
    }

    getOrbit(index) {
        return 5 * index;
    }

    update(time, factor) {
        this.planets.forEach(planet => {
            let index = this.planets.indexOf(planet)
            let orbit = this.getOrbit(index) * (factor + 1)
            let speed = 10 / (this.getOrbit(index))
            planet.position.x = (Math.sin(time*speed) * orbit)
            planet.position.z = (Math.cos(time*speed) * orbit)
            planet.rotation.y = 2*time*speed
        })
    }
}

// /**
//  * Objects
//  */
//  let planets = new Array()
//  let planetsOrbit = new Array()
//  // Material
//  const planeMaterial = new THREE.MeshStandardMaterial({
//      color: 0x000000
//  })
//  planeMaterial.roughness = 0.4
 
//  // const planetMaterial = new THREE.MeshStandardMaterial()
//  // planetMaterial.roughness = 0.2
 
//  // Planets
//      const mercury = new THREE.Mesh(
//          new THREE.SphereGeometry(0.03, 32, 32),
//          new THREE.MeshStandardMaterial({
//              color: 0xaaaaaa,
//          })
//      )
//      mercury.position.x = -0.3
//      mercury.position.y = -0.6
//      planets[0] = mercury
//      planetsOrbit[0] = 0.3
 
//      const venus = new THREE.Mesh(
//          new THREE.SphereGeometry(0.05, 32, 32),
//          new THREE.MeshStandardMaterial({
//              color: 0xeeff00,
//          })
//      )
//      venus.position.x = -0.6
//      venus.position.y = -0.6
//      planets[1] = venus
//      planetsOrbit[1] = 0.6
 
//      const earth = new THREE.Mesh(
//          new THREE.SphereGeometry(0.07, 32, 32),
//          new THREE.MeshStandardMaterial({
//              color: 0x0000ff,
//          })
//      )
//      earth.position.x = -0.9
//      earth.position.y = -0.6
//      planets[2] = earth
//      planetsOrbit[2] = 0.9
 
//      const mars = new THREE.Mesh(
//          new THREE.SphereGeometry(0.05, 32, 32),
//          new THREE.MeshStandardMaterial({
//              color: 0xff0000,
//          })
//      )
//      mars.position.x = -1.2
//      mars.position.y = -0.6
//      planets[4] = mars
//      planetsOrbit[4] = 1.2
     
//  const sunMesh = new THREE.Mesh(
//      new THREE.SphereGeometry(0.1, 32, 32),
//      new THREE.MeshBasicMaterial({color: 0xffff77})
//  )
//  sunMesh.position.set(0, 0, 0)
 
//  const plane = new THREE.Mesh(
//      new THREE.PlaneGeometry(10, 5),
//      planeMaterial
//  )
//  plane.rotation.x = - Math.PI * 0.5
//  plane.position.y = - 1
 