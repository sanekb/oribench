import { lit, list, str, num, obj, def, bool, any } from '@oxi/schema';


export default {

	player: { id: num() },
	delta_mode: {},

	health: { value: num() },
	color: { value: num() },
	controls: {
		KeyW: bool(),
		KeyA: bool(),
		KeyS: bool(),
		KeyD: bool(),
		Space: bool(),
	},
	controls2: {
		KeyW: list( any() ),
		KeyA: list( any() ),
		KeyS: list( any() ),
		KeyD: list( any() ),
		Space: list( any() ),
	},
	space: {},
	create: {},
	hidden: {},

	bullet: {},

	position: { x: num(), y: num(), z: num() },
	velocity: { x: num(), y: num(), z: num() },

	your_id: { value: num() },

	max_lifetime: { value: num() },
	lifetime: { value: num() },
	
};