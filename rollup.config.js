import dts from 'rollup-plugin-dts';

const watchFiles = ['lib/**'];

export default [
  {
    input: 'lib/mapbox-layer-groups.js',
    output: {
      file: 'dist/mapbox-layer-groups.js',
      sourcemap: true,
      format: 'es',
      name: 'MapboxGlLayerGroups',
    },
    watch: {
      include: watchFiles,
    },
  },
  {
    input: './lib/mapbox-layer-groups.d.ts',
    output: {
      file: 'dist/mapbox-layer-groups.d.ts',
      format: 'es',
      name: 'MapboxGlLayerGroups',
    },
    plugins: [dts()],
  },
];
