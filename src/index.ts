#! /usr/bin/env node

/**
 * Unrelated
 */

const args = process.argv.slice(2).reduce((acc, arg) => {
	const [key, value] = arg.split('=');
	acc[key] = value;
	return acc;
}, {} as { [key: string]: string });

/**
 * End of unrelated
 */

type GridElement = GridElements.Water | GridElements.Grass;
type Grid = Array<Array<GridElement>>;

enum GridElements {
	Water = 0,
	Grass = 1,
}

/**
 * The noise grid.
 */
let NOISE_GRID: Grid = [];

/**
 * The size of the noise grid.
 */
const NOISE_GRID_SIZE = {
	x: args.x ? parseInt(args.x) : 200,
	y: args.y ? parseInt(args.y) : 50,
};

/**
 * The amount of iterations the cellular automata should run.
 */
const CELLULAR_AUTOMATA_ITERATIONS = args.iterations ? parseInt(args.iterations) : 20;

/**
 * The noise density is the percentage of the grid that is filled with walls.
 */
const NOISE_DENSITY = args.density ? parseInt(args.density) : 50;

/**
 * Generates a noise grid.
 */
for (let y = 0; y < NOISE_GRID_SIZE.y; y++) {
	NOISE_GRID[y] = [];

	for (let x = 0; x < NOISE_GRID_SIZE.x; x++) {
		Math.floor(Math.random() * 100) > NOISE_DENSITY ? NOISE_GRID[y].push(GridElements.Water) : NOISE_GRID[y].push(GridElements.Grass);
	}
}

/**
 * Runs the cellular automata.
 */
for (let i = 0; i < CELLULAR_AUTOMATA_ITERATIONS; i++) {
	const NEW_GRID: Grid = [];

	for (let y = 0; y < NOISE_GRID_SIZE.y; y++) {
		NEW_GRID[y] = [];

		for (let x = 0; x < NOISE_GRID_SIZE.x; x++) {
			/**
			 * The amount of walls surrounding the current cell.
			 * It can probably be done better.
			 */
			const NEIGHBOURS = [
				NOISE_GRID[y - 1] && NOISE_GRID[y - 1][x - 1], // Top left
				NOISE_GRID[y - 1] && NOISE_GRID[y - 1][x], // Top
				NOISE_GRID[y - 1] && NOISE_GRID[y - 1][x + 1], // Top right
				NOISE_GRID[y] && NOISE_GRID[y][x - 1], // Left
				NOISE_GRID[y] && NOISE_GRID[y][x + 1], // Right
				NOISE_GRID[y + 1] && NOISE_GRID[y + 1][x - 1], // Bottom left
				NOISE_GRID[y + 1] && NOISE_GRID[y + 1][x], // Bottom
				NOISE_GRID[y + 1] && NOISE_GRID[y + 1][x + 1], // Bottom right
			];

			const NEIGHBOUR_COUNT = NEIGHBOURS.filter((neighbour) => neighbour === GridElements.Grass).length;

			if (NEIGHBOUR_COUNT > 4 || NEIGHBOUR_COUNT < 2) NEW_GRID[y].push(GridElements.Grass);
			else NEW_GRID[y].push(GridElements.Water);
		}
	}

	NOISE_GRID = NEW_GRID;
}
/**
 * Stringifies the grid and formats it for printing.
 */
console.log(NOISE_GRID.map((row) => row.map((cell) => (cell === GridElements.Water ? '\x1b[34m#\x1b[0m' : '\x1b[32m#\x1b[0m')).join('')).join('\n'));
console.log(`x: ${NOISE_GRID_SIZE.x} y: ${NOISE_GRID_SIZE.y} density: ${NOISE_DENSITY} iterations: ${CELLULAR_AUTOMATA_ITERATIONS}`);
