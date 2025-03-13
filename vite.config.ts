import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import { AntdvLessPlugin, AntdvModifyVars } from 'stepin/lib/style/plugins';
import vueJsx from '@vitejs/plugin-vue-jsx'
import svgLoader from 'vite-svg-loader'
const resolve = path.resolve
const isProduction = process.env.NODE_ENV === 'production'
const examplePlugin = () => {
  let config

  return {
    name: 'custom-vuedraggableAndSortable',
    transform (code, id) {
      /*eslint-disable*/
      if (isProduction) { 
        if (/vuedraggable\.js/.test(id)) {
          return code.replace('this._sortable = new Sortable(targetDomElement, sortableOptions);', (...e) => {
            return `Sortable.mount($attrs.plugins || []);
            ${e[0]}`
          })
        }
        if (/sortablejs/.test(id)) {
          return code.replace(`    plugins.forEach(function (p) {
      if (p.pluginName === plugin.pluginName) {
        throw "Sortable: Cannot mount plugin ".concat(plugin.pluginName, " more than once");
      }
    });
    plugins.push(plugin);`, (...e) => {
            return `if (!plugins.filter(e => e.pluginName === plugin.pluginName).length) {
          window.plugins = plugins;
			    plugins.push(plugin);}`
          })
        }
      } else {
        if (/vuedraggable/.test(id)) {
          let result = code.replace('this._sortable = new external_commonjs_sortablejs_commonjs2_sortablejs_amd_sortablejs_root_Sortable_default.a(targetDomElement, sortableOptions);', (...e) => {
            return `external_commonjs_sortablejs_commonjs2_sortablejs_amd_sortablejs_root_Sortable_default.a.mount($attrs.plugins || []);
  ${e[0]}`
          })
          result = result.replace(`plugins.forEach(function(p) {
          if (p.pluginName === plugin.pluginName) {
            throw "Sortable: Cannot mount plugin ".concat(plugin.pluginName, " more than once");
          }
        });
        plugins.push(plugin);`, (...e) => {
            return `if (!plugins.filter(e => e.pluginName === plugin.pluginName).length) {
          window.plugins = plugins;
			    plugins.push(plugin);}`
          })
          return result
        }
      }
      /*eslint-disable*/
    }
  }
}
//认输
const timestamp = new Date().getTime();
const prodRollupOptions = {
  output: {
    chunkFileNames: (chunk) => {
      return 'assets/' + chunk.name + '.[hash]' + '.' + timestamp + '.js';
    },
    assetFileNames: (asset) => {
      const name = asset.name;
      if (name && (name.endsWith('.css') || name.endsWith('.js'))) {
        const names = name.split('.');
        const extname = names.splice(names.length - 1, 1)[0];
        return `assets/${names.join('.')}.[hash].${timestamp}.${extname}`;
      }
      return 'assets/' + asset.name;
    },
  },
};
// vite 配置
export default ({ command, mode }) => {
  // 获取环境变量
  const env = loadEnv(mode, process.cwd());
  console.log(mode);

  return defineConfig({
    server: {
      port: 3002,
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          ws: true,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
      hmr: true,
    },

    resolve: {
      alias: [{
        find: "@",
        replacement: path.resolve(__dirname, 'src'),
      }, {
        find: 'vuedraggable',
        replacement: false ? 'vuedraggable/src/vuedraggable' : 'vuedraggable'
      },
      {
        find: '@ER',
        replacement: resolve(__dirname, 'src/packages')
      },
      {
        find: '@ER-examples',
        replacement: resolve(__dirname, 'src/examples')
      },
      {
        find: '@ER-test',
        replacement: resolve(__dirname, 'src/test')
      }],
    },
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
    },
    build: {
      sourcemap: true,
      chunkSizeWarningLimit: 2048,
      rollupOptions: mode === 'production' ? prodRollupOptions : {},
    },
    plugins: [
      vue({
        template: {
          transformAssetUrls: {
            img: ['src'],
            'a-avatar': ['src'],
            'stepin-view': ['logo-src', 'presetThemeList'],
            'a-card': ['cover'],
          },
        },
      }),
      vueJsx(),
      Components({ 
        resolvers: [AntDesignVueResolver({ importStyle: mode === 'development' ? false : 'less' })],
      }),
      svgLoader(),
      examplePlugin()
    ],
    css: {
      preprocessorOptions: {
        less: {
          plugins: [AntdvLessPlugin],
          modifyVars: AntdvModifyVars,
          javascriptEnabled: true,
        },
        scss: {
          additionalData: `
          @use 'sass:math';
          @use 'sass:map';
          @use '@ER/theme/base.scss' as *;
          `
        }
      },
    },
    base: env.VITE_BASE_URL,
  });
};
