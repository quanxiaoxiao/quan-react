import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'react-hooks',
      globals: {
        react: 'React',
      },
    },
  ],
  external: ['react'],
  plugins: [
    nodeResolve({
      extensions: ['.js', '.jsx'],
      browser: true,
    }),
    commonjs({}),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.js', '.jsx'],
    }),
  ],
};
