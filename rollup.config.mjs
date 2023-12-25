import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';

export default {
  input: [
    'src/hooks/index.js',
  ],
  output: [
    {
      dir: 'dist/hooks/',
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
