import { IS_BROWSER } from "$fresh/runtime.ts";
import { useState, useEffect } from "preact/hooks";

import { Ori } from '@ori/core';
import schemas from '../game/schemas.js';

import * as THREE from 'npm:three';
import { Timer } from 'npm:three/addons/misc/Timer.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 66, window.innerWidth / window.innerHeight, 0.1, 100 );
let renderer = null;
const timer = new Timer();

if ( IS_BROWSER ) {

	renderer = new THREE.WebGLRenderer( { antialias: true } )
	renderer.setSize( window.innerWidth, window.innerHeight );

	window.onresize = () => {
		renderer.setSize( window.innerWidth, window.innerHeight );
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix()
	}

	document.body.appendChild( renderer.domElement );

	camera.position.y = 40;
	camera.lookAt( 0, 0, 0 );

}


function addScenery () {

	scene.background = new THREE.Color( 0x050f19 );

	const ambi = new THREE.AmbientLight( 0x7F7F7F );
	const hemi = new THREE.HemisphereLight( 0xffffff, 0x000000, 0.5 );
	const axes = new THREE.AxesHelper( 20 );
	const grid = new THREE.GridHelper( 1000, 200, 0x102e4d, 0x102e4d );

	hemi.position.set( 0, 100, 100 );
	grid.position.set( 2.5, 0, 7.5 );

	scene.add( ambi, hemi, /* axes, */ grid );	
}

function newPlayer ( color ) {

	const geometry = new THREE.BoxGeometry( 3, 3, 3 );
	const material = new THREE.MeshBasicMaterial( { color, transparent: true } );
	const mesh = new THREE.Mesh( geometry, material );

	return mesh;

}

function newBullet ( color ) {

	const geometry = new THREE.SphereGeometry( 0.5, 16, 16 );
	const material = new THREE.MeshBasicMaterial( { color, transparent: true } );
	const mesh = new THREE.Mesh( geometry, material );

	return mesh;

}


const meshes = new Map();
const controls = {
	vid: 'controls',
	KeyW: false,
	KeyA: false,
	KeyS: false,
	KeyD: false,
	Space: false,
};

export default function Main ( props ) {

	if ( ! IS_BROWSER ) return;

	const [ cluster, setCluster ] = useState( null );
	const [ server, setServer ] = useState( null );
	const [ conn, setConn ] = useState( false );
	const [ upd, setUpd ] = useState( 0 );

	useEffect( () => {

		const ori = new Ori();

		ori.use( schemas );

		ori.$$( 'Cluster', new ori.Cluster() )
		const cluster = ori.$( 'Cluster' )
		setCluster( cluster )

		

		ori.$$( 'Space', new ori.Space( {

			your_id ( ctx ) {

				window.pid = ctx.valid.value;

			},

			open ( ctx ) {
				setConn( true )
				setServer( ctx.client )

				window.addEventListener( 'keydown', e => {
					if ( e.code == 'KeyW' ) { controls.KeyW = true; ctx.client.send( controls ) }
					if ( e.code == 'KeyA' ) { controls.KeyA = true; ctx.client.send( controls ) }
					if ( e.code == 'KeyS' ) { controls.KeyS = true; ctx.client.send( controls ) }
					if ( e.code == 'KeyD' ) { controls.KeyD = true; ctx.client.send( controls ) }
					if ( e.code == 'Space' ) { controls.Space = true; ctx.client.send( controls ) }
				})
				window.addEventListener( 'keyup', e => {
					if ( e.code == 'KeyW' ) { controls.KeyW = false; ctx.client.send( controls ) }
					if ( e.code == 'KeyA' ) { controls.KeyA = false; ctx.client.send( controls ) }
					if ( e.code == 'KeyS' ) { controls.KeyS = false; ctx.client.send( controls ) }
					if ( e.code == 'KeyD' ) { controls.KeyD = false; ctx.client.send( controls ) }
					if ( e.code == 'Space' ) { controls.Space = false; ctx.client.send( controls ) }
				})

			},

			close ( ctx ) {
				setConn( false )
				renderer.setAnimationLoop( null )
			},

			delta ( ctx ) {

				setUpd( u => u+1 )
				cluster.update( ctx.valid.value )

				meshes.clear();
				scene.clear();

				addScenery();

				cluster.where( { vid: 'player' } ).forEach( e => {
					
					const mesh = newPlayer( e.get( 'color' ).value )

					meshes.set( cluster.entities.get(e), mesh )

					mesh.position.x = e.get( 'position' ).x;
					mesh.position.z = e.get( 'position' ).z;
					mesh.material.opacity = (e.get( 'health' ).value / 100)*0.75 + 0.25

					if ( e.get('player').id == window.pid ) {
						camera.position.copy( mesh.position ).setY( 40 );
					}

					scene.add( mesh );

				})
				cluster.where( { vid: 'bullet' } ).forEach( e => {
					
					const mesh = newBullet( e.get( 'color' ).value )

					meshes.set( cluster.entities.get(e), mesh )

					mesh.position.x = e.get( 'position' ).x;
					mesh.position.z = e.get( 'position' ).z;

					scene.add( mesh );

				})

				if ( upd == 0 ) {

					renderer.setAnimationLoop( function ( dt ) {

						timer.update()

						cluster.where( { vid: 'player' } ).forEach( e => {
							
							if ( e.get( 'player').id == window.pid ) {
								const mesh = meshes.get( cluster.entities.get(e) )
								e.get( 'velocity').x = -5*controls.KeyA + 5*controls.KeyD;
								e.get( 'velocity').z = -5*controls.KeyW + 5*controls.KeyS;

								camera.position.copy( mesh.position ).setY( 40 );

							}

						})

						cluster.where( { vid: 'position' } ).forEach( e => {
							
							const cube = meshes.get( cluster.entities.get(e) )
							cube.position.x += e.get( 'velocity' ).x * (timer.getDelta());
							cube.position.z += e.get( 'velocity' ).z * (timer.getDelta());
							
						})

						renderer.render( scene, camera )

					});

				}

			},

		}))

		ori.connect( new WebSocket( '/socket' ) )

	}, []);


	return <div></div>;

}
