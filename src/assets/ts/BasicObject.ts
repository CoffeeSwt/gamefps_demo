import * as THREE from 'three';

export class BasicObject {
    static createBox(width: number, height: number, depth: number, color: number = 0xffffff): THREE.Mesh {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshStandardMaterial({ color });
        return new THREE.Mesh(geometry, material);
    }

    static createSphere(radius: number, widthSegments: number, heightSegments: number, color: number = 0xffffff): THREE.Mesh {
        const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
        const material = new THREE.MeshStandardMaterial({ color });
        return new THREE.Mesh(geometry, material);
    }

    static createPlane(width: number, height: number, color: number = 0xffffff): THREE.Mesh {
        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshStandardMaterial({ color, side: THREE.DoubleSide });
        return new THREE.Mesh(geometry, material);
    }

    static createCylinder(radiusTop: number, radiusBottom: number, height: number, radialSegments: number, color: number = 0xffffff): THREE.Mesh {
        const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
        const material = new THREE.MeshStandardMaterial({ color });
        return new THREE.Mesh(geometry, material);
    }
    static createLine(points: THREE.Vector3[], color: number = 0xffffff): THREE.Line {
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color });
        return new THREE.Line(geometry, material);
    }
}