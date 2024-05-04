import { defineConfig } from '@umijs/max';
import routes from './src/routes';
export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    name: "BasicLayout",
  },
  routes,
  npmClient: 'npm',
  proxy: {
    '/api': {
      // target: 'http://124.222.161.37:8090/',
      target: 'http://127.0.0.1:8090/',
      changeOrigin: true,
  
    },
  },
  extraPostCSSPlugins: [require('tailwindcss'), require('autoprefixer')],
});

