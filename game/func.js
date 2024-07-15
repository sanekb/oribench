import * as THREE from 'npm:three';

const ori = Symbol.for( 'ori' );

const MAX_ENTITIES = 1000;

let spawned = false;

export function spawner () {

	const { Entity } = this[ ori ];

	const red = new THREE.Color( 0xff0000 );
	const green = new THREE.Color( 0x00ff00 );

	if ( spawned ) {

		this.where( { vid: 'hidden' } ).forEach( entity => {

			const radiusP = Math.random()*0+5;
			const radiusV = Math.random()*4+1;

			const angleP = Math.random()*Math.PI*2;
			const angleV = Math.random()*Math.PI*2;

			entity.get( 'color' ).copy( { value: red.clone().lerp( green, (5-radiusV)/5  ).getHex() } );
			entity.get( 'position' ).copy( { x: Math.cos(angleV)*radiusP, y: 0, z: Math.sin(angleV)*radiusP } );
			entity.get( 'velocity' ).copy( { x: Math.cos(angleV)*radiusV, y: 0, z: Math.sin(angleV)*radiusV } );
			entity.get( 'max_lifetime' ).copy( { value: Math.floor(Math.random()*7+3) } );
			entity.get( 'lifetime' ).copy( { value: 0 } );

			entity.delete( 'hidden' );

		})

		return;

	}

	for ( let i = this.where( { vid: 'bullet' } ).length; i < MAX_ENTITIES; i++ ) {

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

	spawned = true;

}

export function mover ( dt ) {

	this.where( { vid: 'position' }, { vid: 'velocity' } ).forEach( entity => {

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

	this.where( { vid: 'lifetime' }, { vid: 'max_lifetime' } ).forEach( entity => {

		const cur = entity.get( 'lifetime' );
		const max = entity.get( 'max_lifetime' );

		if ( cur.value >= max.value ) {
			// this.delete( entity )
			entity.add({vid:'hidden'})
		}

	})

}