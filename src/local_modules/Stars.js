import * as THREE from 'three'

export default class Stars{
    constructor(radius, textureLoader) {

        const colorTexture = textureLoader.load('./textures/star.png');
        // when using NearestFilter as the minFilter we dont need to generate the mipmaps (better for the GPU)
        colorTexture.generateMipmaps = false
        colorTexture.minFilter = THREE.NearestFilter
        colorTexture.magFilter = THREE.NearestFilter

        let geometry;
        const particles = 1000;
        this.radius = radius;
        geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const color = new THREE.Color();
        for ( let i = 0; i < particles; i ++ ) {

            //(x - a)² + (y - b)² + (z - c)² = r²,
            const a = 2*Math.random() - 1;
            const b = 2*Math.random() - 1;
            const c = 2*Math.random() - 1;

            const x = a / Math.sqrt(a * a + b * b + c * c);
            const y = b / Math.sqrt(a * a + b * b + c * c);
            const z = c / Math.sqrt(a * a + b * b + c * c);

            positions.push( x * this.radius );
            positions.push( y * this.radius );
            positions.push( z * this.radius );
    
        }
    
        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
        geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

        this.particles = new THREE.Points( geometry, new THREE.PointsMaterial({
            size: 1,
            color: 0xddffff,
            map: colorTexture,
        }));
    }
    
    update(time, factor) {
        this.particles.rotation.z = factor*(time/10)%(Math.PI*2)
    }

};