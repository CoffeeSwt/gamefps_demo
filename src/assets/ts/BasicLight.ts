import * as THREE from 'three';

export class BasicLight {
    static createAmbientLight(color: number = 0xffffff, intensity: number = 1): THREE.AmbientLight {
        return new THREE.AmbientLight(color, intensity);
    }

    static createDirectionalLight(color: number = 0xffffff, intensity: number = 1, position: THREE.Vector3 = new THREE.Vector3(0, 1, 0)): THREE.DirectionalLight {
        const directionalLight = new THREE.DirectionalLight(color, intensity);
        directionalLight.position.copy(position);
        return directionalLight;
    }

    static createPointLight(color: number = 0xffffff, intensity: number = 1, position: THREE.Vector3 = new THREE.Vector3(0, 0, 0), distance: number = 0, decay: number = 1): THREE.PointLight {
        const pointLight = new THREE.PointLight(color, intensity, distance, decay);
        pointLight.position.copy(position);
        return pointLight;
    }

    static createSpotLight(color: number = 0xffffff, intensity: number = 1, position: THREE.Vector3 = new THREE.Vector3(0, 0, 0), angle: number = Math.PI / 4, penumbra: number = 0, decay: number = 1): THREE.SpotLight {
        const spotLight = new THREE.SpotLight(color, intensity, 0, angle, penumbra, decay);
        spotLight.position.copy(position);
        return spotLight;
    }

    static createHemisphereLight(skyColor: number = 0xffffff, groundColor: number = 0x000000, intensity: number = 1): THREE.HemisphereLight {
        return new THREE.HemisphereLight(skyColor, groundColor, intensity);
    }
}
