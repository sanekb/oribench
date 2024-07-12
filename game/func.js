import * as THREE from 'npm:three';

const ori = Symbol.for( 'ori' );

const MAX_ENTITIES = 250;


export function spawner () {

	const { Entity } = this[ ori ];

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

}

export function mover ( dt ) {

	this.where( { vid: 'position' } ).forEach( entity => {

		const pos = entity.get( 'position' );
		const vel = entity.get( 'velocity' );

		pos.x += vel.x * dt;
		pos.z += vel.z * dt;

	})

}

export function liver ( dt ) {

	this.where( { vid: 'lifetime' } ).forEach( entity => {

		entity.get( 'lifetime' ).value += dt;

	})

}

export function deleter () {

	this.where( { vid: 'lifetime' } ).forEach( entity => {

		const cur = entity.get( 'lifetime' );
		const max = entity.get( 'max_lifetime' );

		if ( cur.value >= max.value ) {
			this.delete( entity )
		}

	})

}