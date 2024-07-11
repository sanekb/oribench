import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js'


let renderer, scene, camera, stats, upd;


export function setup () {

	renderer = new THREE.WebGLRenderer( { antialias: true } )
	renderer.setSize( window.innerWidth, window.innerHeight );

	window.onresize = () => {
		renderer.setSize( window.innerWidth, window.innerHeight );
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix()
	}

	document.body.appendChild( renderer.domElement );

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 66, window.innerWidth / window.innerHeight, 0.1, 100 );
	camera.position.y = 40;
	camera.lookAt( 0, 0, 0 );

	stats = new Stats();
	upd = stats.addPanel( new Stats.Panel( 'upd', '#0ff', '#002' ) );
	stats.showPanel( 3 );
	document.body.appendChild( stats.dom );


	scene.background = new THREE.Color( 0x050f19 );

	const ambi = new THREE.AmbientLight( 0x7F7F7F );
	const hemi = new THREE.HemisphereLight( 0xffffff, 0x000000, 0.5 );
	const axes = new THREE.AxesHelper( 20 );
	const grid = new THREE.GridHelper( 1000, 200, 0x102e4d, 0x102e4d );

	hemi.position.set( 0, 100, 100 );
	grid.position.set( 2.5, 0, 7.5 );

	scene.add( ambi, hemi, /* axes, */ grid );	

}

const playerGeom = new THREE.BoxGeometry( 5, 5, 5 );
const bulletGeom = new THREE.SphereGeometry( 0.5, 16, 16 );

export function newPlayer ( color ) {

	const material = new THREE.MeshBasicMaterial( { color, transparent: true } );
	return new THREE.Mesh( playerGeom, material );

}

export function newBullet ( color ) {

	const material = new THREE.MeshBasicMaterial( { color, transparent: true } );
	return new THREE.Mesh( bulletGeom, material );

}

export function render () {
	
	renderer.render( scene, camera )

}

export { renderer, camera, scene, stats, upd };