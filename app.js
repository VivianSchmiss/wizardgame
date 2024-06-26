import * as THREE from '../../libs/three/three.module.js';
import { VRButton } from '../../libs/three/jsm/VRButton.js';
import { XRControllerModelFactory } from '../../libs/three/jsm/XRControllerModelFactory.js';
import { BoxLineGeometry } from '../../libs/three/jsm/BoxLineGeometry.js';
import { Stats } from '../../libs/stats.module.js';
import { OrbitControls } from '../../libs/three/jsm/OrbitControls.js';

/*
class App{
	constructor(){
		const container = document.createElement( 'div' );
		document.body.appendChild( container );
        
        this.clock = new THREE.Clock();
        
		this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 100 );
		this.camera.position.set( 0, 1.6, 3 );
        
		this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x505050 );

		this.scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

        const light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 ).normalize();
		this.scene.add( light );
			
		this.renderer = new THREE.WebGLRenderer({ antialias: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        
		container.appendChild( this.renderer.domElement );
        
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.target.set(0, 1.6, 0);
        this.controls.update();
        
        this.stats = new Stats();
        container.appendChild( this.stats.dom );
        
        this.initScene();
        this.setupXR();
        
        window.addEventListener('resize', this.resize.bind(this) );
        
        this.renderer.setAnimationLoop( this.render.bind(this) );
	}	
    
    random( min, max ){
        return Math.random() * (max-min) + min;
    }
    
    initScene(){
        
    }
    
    setupXR(){
        
    }
    
    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );  
    }
    
	render( ) {   
        this.stats.update();
        
        this.renderer.render( this.scene, this.camera );
    }
}

export { App };
*/

import * as THREE from "../../libs/three/three.module.js";
import { VRButton } from "../../libs/three/jsm/VRButton.js";
import { XRControllerModelFactory } from "../../libs/three/jsm/XRControllerModelFactory.js";
import { BoxLineGeometry } from "../../libs/three/jsm/BoxLineGeometry.js";
import { Stats } from "../../libs/stats.module.js";
import { OrbitControls } from "../../libs/three/jsm/OrbitControls.js";

/*
class App{
	constructor(){
		const container = document.createElement( 'div' );
		document.body.appendChild( container );
        
        this.clock = new THREE.Clock();
        
		this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 100 );
		this.camera.position.set( 0, 1.6, 3 );
        
		this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x505050 );

		this.scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

        const light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 ).normalize();
		this.scene.add( light );
			
		this.renderer = new THREE.WebGLRenderer({ antialias: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        
		container.appendChild( this.renderer.domElement );
        
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.target.set(0, 1.6, 0);
        this.controls.update();
        
        this.stats = new Stats();
        //container.appendChild( this.stats.dom );
        document.body.appendChild( this.stats.dom );

        this.raycaster = new THREE.Raycaster();
        this.workingMatrix = new THREE.Matrix4();
        this.workingVector = new THREE.Vector3();
        
        this.initScene();
        this.setupVR();
        
        window.addEventListener('resize', this.resize.bind(this) );
        
        this.renderer.setAnimationLoop( this.render.bind(this) );
	}	
    
    random( min, max ){
        return Math.random() * (max-min) + min;
    }
    
    initScene(){
        this.radius = 0.08;

        this.room = new THREE.LineSegments(
            new BoxLineGeometry( 6,6,6,10,10,10 ),
            new THREE.LineBasicMaterial( { color: 0x808080 } )
        );
        this.room.geometry.translate( 0, 3, 0 );
        this.scene.add( this.room );

        const geometry = new THREE.IcosahedronBufferGeometry( this.radius, 2 );

        for(let i=0; i<200; i++){
            const object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( {
                color: Math.random() * 0xFFFFFF
            }));

            object.position.x = this.random(-2, 2);
            object.position.y = this.random(-2, 2);
            object.position.z = this.random(-2, 2);

            this.room.add( object );
        }

        this.highlight = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
            color: 0xFFFFFF, side: THREE.BackSide}));
        this.highlight.scale.set(1.2, 1.2, 1.2);
        this.scene.add(this.highlight);
    }
    
    setupVR(){
        this.renderer.xr.enabled = true;

        document.body.appendChild( VRButton.createButton( this.renderer ));

        this.controllers = this.buildControllers();

        const self = this;

        function onSelectedStart(){
            this.children[0].scale.z = 10;
            this.userData.selectedPressed = true;
        }

        function onSelectedEnd(){
            this.children[0].scale.z = 0;
            self.highlight.visible = false;
            this.userData.selectedPressed = false;
        }

        this.controllers.forEach((controller) => {
            controller.addEventListener('selectedstart', onSelectedStart);
            controller.addEventListener('selectedend', onSelectedEnd);
        })
    }

    buildControllers(){
        const controllerModelFactory = new XRControllerModelFactory();

        const geometry = new THREE.BufferGeometry().setFromPoints( [
            new THREE.Vector3(0,0,0),
            new THREE.Vector3(0,0,-1)
        ]);
        const line = new THREE.Line( geometry );
        line.name = 'line';
        line.getWorldScale.z = 0;

        const controllers = [];

        for(let i=0; i<=1; i++){
            const controller = this.renderer.xr.getController( i );
            controller.add( line.clone() );
            controller.userData.selectedPressed = false;
            this.scene.add(controller);

            const grip = this.renderer.xr.getControllerGrip(i);
            grip.add(controllerModelFactory.createControllerModel(grip));
            this.scene.add(grip);
        }

        return controllers;
    }

    handleController( controller ){
        if (controller.userData.selectedPressed){
            controller.children[0].scale.z = 10;

            this.workingMatrix.identity().extractRotation(controller.matrixWorld);
            this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
            this.raycaster.ray.direction.set(0,0,-1).applyMatrix4(this.workingMatrix);

            const intersects = this.raycaster.intersectObjects(this.room.children);

            if (intersects.length>0){
                intersects[0].object.add(this.highlight);
                this.highlight.visible = true;
                controller.children[0].scale.z = intersects[0].distance;
            } else {
                this.highlight.visible = false;
            }
        }
    }
    
    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );  
    }
    
	render( ) {   
        this.stats.update();

        if (this.controllers ){
            const self = this;
            this.controllers.forEach( ( controller) => { 
                self.handleController( controller ) 
            });
        }
        
        this.renderer.render( this.scene, this.camera );
    }
}

export { App };
*/

let scene, camera, renderer;
let score = 0;
const enemySpeed = 0.05;
const enemies = [];

// Initialisierung
function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  document.body.appendChild(renderer.domElement);
  document.body.appendChild(VRButton.createButton(renderer));

  // Licht
  const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
  scene.add(light);

  // Boden
  const floorGeometry = new THREE.PlaneGeometry(100, 100);
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // Spieler
  camera.position.set(0, 1.6, 5);
  scene.add(camera);

  // Gegner
  for (let i = 0; i < 5; i++) {
    createEnemy();
  }

  // VR-Controller
  const controller = renderer.xr.getController(0);
  controller.addEventListener("selectstart", onSelectStart);
  scene.add(controller);

  animate();
}

function createEnemy() {
  const geometry = new THREE.SphereGeometry(0.5, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const enemy = new THREE.Mesh(geometry, material);
  enemy.position.set(Math.random() * 10 - 5, 1.5, -Math.random() * 10 - 10);
  enemies.push(enemy);
  scene.add(enemy);
}

function onSelectStart(event) {
  const controller = event.target;
  const intersections = getIntersections(controller);
  if (intersections.length > 0) {
    const enemy = intersections[0].object;
    scene.remove(enemy);
    enemies.splice(enemies.indexOf(enemy), 1);
    score++;
    document.getElementById("score").innerText = "Score: " + score;
    if (score >= 15) {
      alert("Gewonnen!");
    }
    createEnemy();
  }
}

function getIntersections(controller) {
  const tempMatrix = new THREE.Matrix4();
  tempMatrix.identity().extractRotation(controller.matrixWorld);
  const raycaster = new THREE.Raycaster();
  raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
  raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);
  return raycaster.intersectObjects(enemies);
}

function animate() {
  renderer.setAnimationLoop(render);
}

function render() {
  enemies.forEach((enemy) => {
    enemy.position.z += enemySpeed;
    if (enemy.position.z > camera.position.z) {
      enemy.position.set(Math.random() * 10 - 5, 1.5, -Math.random() * 10 - 10);
    }
  });
  renderer.render(scene, camera);
}

init();
