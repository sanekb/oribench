import { faker } from 'npm:@faker-js/faker';
import { Ori } from '@ori/core';
import schemas from './game/schemas.js';
import * as THREE from 'npm:three';
import randomColor from 'npm:randomcolor';


const ori = new Ori();
const { Cluster, Space, Entity, Valid, $, $$, $$d } = ori;

import { spawner, mover, liver, deleter } from './game/func.js'



import { gzipSync, gunzipSync } from 'fflate';
import { addExtension, Packr, FLOAT32_OPTIONS } from 'msgpackr';

const packr = new Packr( { useFloat32: FLOAT32_OPTIONS.NEVER, sequential: false } );

let delta, snapshot;

ori.use( schemas )

const cluster = new Cluster()

cluster
	.use( spawner )
	.use( mover )
	.use( liver )
	.use( deleter )
	.on( 'update', v => {
		delta = v.delta;
		snapshot = v.snapshot;
		console.log( cluster.where( { vid: 'bullet' } ).length )
	})
	.update();


// Deno.bench( 'cluster where', function () {

// 	cluster.where( { vid: 'position' } )

// })


let entity;
let valid;

const red = new THREE.Color( 0xff0000 );
const green = new THREE.Color( 0x00ff00 );

const radiusP = Math.random()*0+5;
const radiusV = Math.random()*4+1;

const angleP = Math.random()*Math.PI*2;
const angleV = Math.random()*Math.PI*2;


// Deno.bench( 'Where Entities copy RND', function () {

// 	cluster.where( { vid: 'bullet' } ).forEach( entity => {

// 		const radiusP = Math.random()*0+5;
// 		const radiusV = Math.random()*4+1;

// 		const angleP = Math.random()*Math.PI*2;
// 		const angleV = Math.random()*Math.PI*2;
		
// 		entity.get( 'color' ).copy( { value: red.clone().lerp( green, (5-radiusV)/5  ).getHex() } );
// 		entity.get( 'position' ).copy( { x: Math.cos(angleV)*radiusP, y: 0, z: Math.sin(angleV)*radiusP } );
// 		entity.get( 'velocity' ).copy( { x: Math.cos(angleV)*radiusV, y: 0, z: Math.sin(angleV)*radiusV } );
// 		entity.get( 'max_lifetime' ).copy( { value: Math.floor(Math.random()*7+3) } );
// 		entity.get( 'lifetime' ).copy( { value: 0 } );

// 	})

// })

// Deno.bench( 'color lerp', function () {

// 	red.clone().lerp( green, (5-radiusV)/5  ).getHex()

// })

// Deno.bench( 'create Valid', function () {

valid = new Valid(
	{ vid: 'position', x: Math.cos(angleV)*radiusP, y: 0, z: Math.sin(angleV)*radiusP }
)
valid = new Valid(
	{ vid: 'position', x: Math.cos(angleV)*radiusP, y: 0, z: Math.sin(angleV)*radiusP }
)

console.log( valid[ Symbol.for('id') ] )

// })

// Deno.bench( 'Valid copy 999', function () {

// 	valid.copy( { x: 9, y: 9, z: 9 } );

// })

// Deno.bench( 'create Entity', function () {

// 	entity = new Entity(
// 		{ vid: 'position', x: Math.cos(angleV)*radiusP, y: 0, z: Math.sin(angleV)*radiusP },
// 		{ vid: 'velocity', x: Math.cos(angleV)*radiusV, y: 0, z: Math.sin(angleV)*radiusV }
// 	)

// })

// Deno.bench( 'Entity copy 999', function () {

// 	entity.get( 'position' ).copy( { x: 9, y: 9, z: 9 } );
// 	entity.get( 'velocity' ).copy( { x: 9, y: 9, z: 9 } );

// })

// Deno.bench( 'Entity copy RND', function () {

// 	const radiusP = Math.random()*0+5;
// 	const radiusV = Math.random()*4+1;

// 	const angleP = Math.random()*Math.PI*2;
// 	const angleV = Math.random()*Math.PI*2;
	
// 	entity.get( 'position' ).copy( { x: Math.cos(angleV)*radiusP, y: 0, z: Math.sin(angleV)*radiusP } );
// 	entity.get( 'velocity' ).copy( { x: Math.cos(angleV)*radiusV, y: 0, z: Math.sin(angleV)*radiusV } );

// })

// Deno.bench( 'create Big Entity', function () {

// 	entity = new Entity(
// 		{ vid: 'bullet' },
// 		{ vid: 'color', value: red.clone().lerp( green, (5-radiusV)/5  ).getHex() },
// 		{ vid: 'position', x: Math.cos(angleV)*radiusP, y: 0, z: Math.sin(angleV)*radiusP },
// 		{ vid: 'velocity', x: Math.cos(angleV)*radiusV, y: 0, z: Math.sin(angleV)*radiusV },
// 		{ vid: 'max_lifetime', value: Math.floor(Math.random()*7+3) },
// 		{ vid: 'lifetime', value: 0 },
// 	)

// })


// Deno.bench( 'Big Entity copy RND', function () {

// 	const radiusP = Math.random()*0+5;
// 	const radiusV = Math.random()*4+1;

// 	const angleP = Math.random()*Math.PI*2;
// 	const angleV = Math.random()*Math.PI*2;
	
// 	entity.get( 'color' ).copy( { value: red.clone().lerp( green, (5-radiusV)/5  ).getHex() } );
// 	entity.get( 'position' ).copy( { x: Math.cos(angleV)*radiusP, y: 0, z: Math.sin(angleV)*radiusP } );
// 	entity.get( 'velocity' ).copy( { x: Math.cos(angleV)*radiusV, y: 0, z: Math.sin(angleV)*radiusV } );
// 	entity.get( 'max_lifetime' ).copy( { value: Math.floor(Math.random()*7+3) } );
// 	entity.get( 'lifetime' ).copy( { value: 0 } );

// })