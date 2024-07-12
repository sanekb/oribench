import { IS_BROWSER } from "$fresh/runtime.ts";
import { useState, useEffect } from "preact/hooks";

import { Ori } from '@ori/core';
import schemas from '../game/schemas.js';

import * as THREE from 'three';
import { Timer } from 'three/addons/misc/Timer.js';

import { renderer, camera, scene, render, setup, stats, upd, newBullet, newPlayer } from '../game/three.js';


const timer1 = new Timer();
const timer2 = new Timer();
const timer3 = new Timer();

const meshes = new Map();
const controls = {
	vid: 'controls',
	KeyW: false,
	KeyA: false,
	KeyS: false,
	KeyD: false,
	Space: false,
};
let pid = null;

export default function Main ( props ) {

	if ( ! IS_BROWSER ) return;

	const [ cluster, setCluster ] = useState( null );
	const [ server, setServer ] = useState( null );
	const [ u, setU ] = useState( 0 );

	useEffect( () => {

		const ori = new Ori();
		const { $, $$, Cluster, Space } = ori;

		ori.use( schemas );

		const cluster = new Cluster()
		$$( 'Cluster', cluster )
		setCluster( cluster )

		cluster
		.use( function sync () {

			meshes.keys().forEach( e => {
				if ( ! cluster.entities.has( e ) ) {
					scene.remove( meshes.get(e) )
					meshes.delete( e );
				}
			})

			cluster.where( { vid: 'bullet' } ).forEach( e => {
				let m;
				if ( ! meshes.has( e ) ) {
					m = newBullet( e.get('color').value );
					meshes.set( e, m )
					scene.add( m )
				} else {
					m = meshes.get( e ) 
				}
				m.position.copy( e.get('position') )
			})	
			cluster.where( { vid: 'player' } ).forEach( e => {
				let m;
				if ( ! meshes.has( e ) ) {
					m = newPlayer( e.get('color').value );
					meshes.set( e, m )
					scene.add( m )
				} else {
					m = meshes.get( e ) 
				}
				m.position.copy( e.get('position') )
			})

		})
		.use( function smooth () {

			stats.begin()

			const p = cluster.find( { vid: 'player', id: pid } )

			if ( p ) {
				
				const mesh = meshes.get( p )
				if ( ! mesh ) return;
				// p.get( 'velocity' ).x = -25*controls.KeyA + 25*controls.KeyD;
				// p.get( 'velocity' ).z = -25*controls.KeyW + 25*controls.KeyS;

				camera.position.lerp( mesh.position, 0.005 ).setY( 40 );

			}

			timer1.update();
			cluster.where( { vid: 'position' }, { vid: 'velocity' } ).forEach( e => {
				
				const cube = meshes.get( e )
				if ( ! cube ) return;
				e.get('position').x += e.get( 'velocity' ).x * (timer1.getDelta());
				e.get('position').z += e.get( 'velocity' ).z * (timer1.getDelta());
				
			})

			cluster.where( { vid: 'lifetime' }, { vid: 'max_lifetime' } ).forEach( e => {
				
				const cube = meshes.get( e )
				if ( ! cube ) return;
				cube.material.opacity = (1-e.get( 'lifetime' ).value / e.get( 'max_lifetime' ).value)*0.75 + 0.25
				
			})

			stats.end()

		})
		.use( function _render () {

			render()

		})

		$$( 'Space', new Space( {


			open ( ctx ) {
				setServer( ctx.client ); window.server= ctx.client

				window.addEventListener( 'keydown', e => {
					if ( e.code == 'KeyW' ) { (controls.KeyW ^ true) && ctx.client.send( controls ); controls.KeyW = true; }
					if ( e.code == 'KeyA' ) { (controls.KeyA ^ true) && ctx.client.send( controls ); controls.KeyA = true; }
					if ( e.code == 'KeyS' ) { (controls.KeyS ^ true) && ctx.client.send( controls ); controls.KeyS = true; }
					if ( e.code == 'KeyD' ) { (controls.KeyD ^ true) && ctx.client.send( controls ); controls.KeyD = true; }
					// if ( e.code == 'Space' ) { controls.Space = true; ctx.client.send( controls ) }
				})
				window.addEventListener( 'keyup', e => {
					if ( e.code == 'KeyW' ) { (controls.KeyW ^ false) && ctx.client.send( controls ); controls.KeyW = false; }
					if ( e.code == 'KeyA' ) { (controls.KeyA ^ false) && ctx.client.send( controls ); controls.KeyA = false; }
					if ( e.code == 'KeyS' ) { (controls.KeyS ^ false) && ctx.client.send( controls ); controls.KeyS = false; }
					if ( e.code == 'KeyD' ) { (controls.KeyD ^ false) && ctx.client.send( controls ); controls.KeyD = false; }
					// if ( e.code == 'Space' ) { controls.Space = false; ctx.client.send( controls ) }
				})

			},

			your_id ( ctx ) {
				pid = ctx.valid.value;
			},

			snapshot ( ctx ) {
				cluster.fromSnapshot( ctx.valid.value );
				setup();
				renderer.setAnimationLoop( () => cluster.update() );
				// cluster.start( 1 )
			},

			delta ( ctx ) {
				timer3.update()
				// console.log( timer3.getDelta()*1e3^0 )
				setU( u => u + 1 )

				timer2.reset()
				cluster.update( ctx.valid.value )
				timer2.update()
				
				upd.update( timer3.getDelta() * 1e3, 100 )

			},

			close ( ctx ) {
				renderer.setAnimationLoop( null )
			},

		}))

		ori.connect( new WebSocket( '/socket' ) )

	}, []);


	return <div class="absolute text-white ml-24 w-64 text-2xl" onclick={ () => server?.send( { vid: 'create' } ) }>SPACE</div>;

}
