import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader, GLTFReference } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm//controls/OrbitControls'

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

    constructor() { }

    //FIRST CREATE A SCENE
    scene = new THREE.Scene();
    //SECOND SET CAMERA PRESPECTIVE
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    //THIRD CREATE A RENDERER
    renderer = new THREE.WebGLRenderer();
    model!: THREE.Group<THREE.Object3DEventMap>


    @ViewChild('canvasContainer', { static: true }) container!: ElementRef;
    ngOnInit(): void {
        console.log("INIT")
    }

    private initScene(): void {
        this.scene = new THREE.Scene();
        const topColor = new THREE.Color(0x630093); // Top color
        const bottomColor = new THREE.Color(0xe1a4ff); // Bottom color

        const gradientTexture = this.createGradientTexture(topColor, bottomColor);
        this.scene.background = gradientTexture;
        console.log(window.innerWidth)
        this.camera = new THREE.PerspectiveCamera(window.innerWidth < 500 ? 85 : 45, window.innerWidth / window.innerHeight, 0.0001, 20000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight - 52.4);
        this.container.nativeElement.appendChild(this.renderer.domElement)

        this.camera.position.z = 5;

        // Add lights and other scene objects if needed
        const ambientLight = new THREE.AmbientLight(0xD9D9D9);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xD9D9D9);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.target.set(0, 0, 0); // Set the target (center) of the scene
        controls.update();
    }
    ngAfterViewInit(): void {
        this.initScene();
        this.loadModel();
    }

    loadModel(name = 'macLaren'): void {
        const loader = new GLTFLoader();
        if (this.model)
            this.scene.remove(this.model)
        loader.load(`./assets/gltfs/${name}/scene.gltf`, (gltf) => {
            this.model = gltf.scene;
            this.scene.add(this.model);
            gltf.scene.scale.set(10, 10, 10);
            // You can set the model's position, rotation, and scale as needed
            this.model.position.set(0, 0, 0);
            this.model.rotation.set(0, 0, 0);
            this.model.scale.set(1, 1, 1);

            this.render();
        });
    }

    render(): void {
        const animate = () => {
            requestAnimationFrame(animate);
            this.renderer.render(this.scene, this.camera);
        };
        animate();
    }

    // animate() {
    //     requestAnimationFrame(() => this.animate);
    //     setInterval(() => {

    //         this.cube.rotation.x += 0.01;
    //         this.cube.rotation.y += 0.01;
    //         this.renderer.render(this.scene, this.camera);
    //     }, 10)

    // }

    select(name: string) {
        this.loadModel(name);
    }
    createGradientTexture(topColor: THREE.Color, bottomColor: any) {
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const context = canvas.getContext('2d');

        // Create a vertical gradient
        const gradient = context!.createLinearGradient(0, 200, window.innerWidth / 2 + 300, window.innerHeight / 2 + 100);
        gradient.addColorStop(0, topColor.getStyle());
        gradient.addColorStop(1, bottomColor.getStyle());

        context!.fillStyle = gradient;
        context!.fillRect(0, 0, window.innerWidth, window.innerHeight);

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

        return texture;
    }
}


