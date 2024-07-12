import { faker } from 'npm:@faker-js/faker';
import { Ori } from '@ori/core';
import schemas from './game/schemas.js';
import * as THREE from 'npm:three';
import randomColor from 'npm:randomcolor';


const ori = new Ori();
const { Cluster, Space, Entity, $, $$, $$d } = ori;


const MAX_ENTITIES = 1e3;
const TPS = 1;


ori.use( schemas )

const cluster = new Cluster()

	.use( function spawner () {

		const total = this.where( { vid: 'bullet' } ).length;

		const red = new THREE.Color( 0xff0000 );
		const green = new THREE.Color( 0x00ff00 );

		for ( let i = total; i < MAX_ENTITIES; i++ ) {

			const radiusP = Math.random()*0+5;
			const radiusV = Math.random()*4+1;

			const angleP = Math.random()*Math.PI*2;
			const angleV = Math.random()*Math.PI*2;

			const entity = new Entity(
				{ vid: 'bullet' },
				{ vid: 'color', value: red.clone().lerp( green, (5-radiusV)/5  ).getHex() },
				{ vid: 'position', x: Math.cos(angleV)*radiusP, y: 0, z: Math.sin(angleV)*radiusP },
				{ vid: 'velocity', x: Math.cos(angleV)*radiusV, y: 0, z: Math.sin(angleV)*radiusV },
				{ vid: 'max_lifetime', value: Math.floor(Math.random()*7+3) },
				{ vid: 'lifetime', value: 0 },
			)

			this.add( entity );

		}

	})

cluster.update();


Deno.bench( 'Position for if', function () {

	const entities = Array.from( cluster.entities.keys() );

	for ( let i = 0; i <= entities.length - 1; i++ ) {
		if ( entities[i].has( 'position' ) ) {

			const pos = entities[i].get( 'position' );
			const vel = entities[i].get( 'velocity' );

			pos.x += vel.x * 60/1000;
			pos.z += vel.z * 60/1000;

		}
	}

})

Deno.bench( 'where for', function () {

	const entities = cluster.where( { vid: 'position' } );

	for ( let i = 0; i <= entities.length - 1; i++ ) {

		const pos = entities[i].get( 'position' );
		const vel = entities[i].get( 'velocity' );

		pos.x += vel.x * 60/1000;
		pos.z += vel.z * 60/1000;

	}

})

Deno.bench( 'where forEach', function () {

	cluster.where( { vid: 'position' } ).forEach( entity => {

		const pos = entity.get( 'position' );
		const vel = entity.get( 'velocity' );

		pos.x += vel.x * 60/1000;
		pos.z += vel.z * 60/1000;

	});

})
