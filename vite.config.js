import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    // 清空输出目录
    emptyOutDir: true,
    // 输出目录
    outDir: '.dist',
    // 不生成源码映射
    sourcemap: false,
    // 不压缩代码（保持可读性）
    minify: true,
    // 指定入口文件
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'Index.html'),
      },
      output: {
        // 将所有 JavaScript 打包成一个文件
        entryFileNames: 'bundle.js',
        chunkFileNames: 'bundle.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'Index.css';
          }
          return assetInfo.name;
        },
      },
      // 不将 node_modules 中的依赖打包
      external: [],
    },
  },
  // 开发服务器配置
  server: {
    port: 3000,
  },
});