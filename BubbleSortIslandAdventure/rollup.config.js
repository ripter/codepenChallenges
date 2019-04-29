import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
	input: 'src/index.js',
	output: {
		file: 'public/bundle.js',
		format: 'iife',
		sourcemap: true
	},
	plugins: [
		resolve(), // tells Rollup how to find libraries in node_modules
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
	],
	external: [ 'anime', 'lighterhtml' ]
};
