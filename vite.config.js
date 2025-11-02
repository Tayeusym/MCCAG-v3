import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

// 定义复制文件夹的函数
function copyFolderRecursiveSync(source, target) {}

export default defineConfig({
	build: {
		// 清空输出目录
		emptyOutDir: true,
		// 输出目录
		outDir: '.dist',
		// 不生成源码映射
		sourcemap: false,
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'Index.html'),
			},
			output: {
				// 将所有 JavaScript 打包成一个文件
				entryFileNames: 'Bundle.[hash].js',
				chunkFileNames: 'Bundle.[hash].js',
				assetFileNames: (assetInfo) => {
					// 保留 CSS 文件名
					if (assetInfo.name.endsWith('.css'))
						return 'Index.[hash].css';
					// 保留资源文件的原始目录结构
					return assetInfo.originalFileNames[0];
				},
			},
			external: [], // 清空external，确保不排除任何资源
		},
	},
	// 开发服务器配置
	server: {
		port: 3000,
		// 在开发模式下不预构建依赖，更快启动
		preTransformRequests: false,
		// 确保服务器能正确提供静态资源
	},
	plugins: [
		{
			name: 'copy-resources',
			apply: 'build',
			closeBundle() {
				// 动态获取输出目录
				const outDir = this.meta?.rollupOptions?.output?.dir || '.dist';
				// 在构建完成后复制 Resources 文件夹到输出目录
				const source = resolve(__dirname, 'Resources');
				const target = resolve(__dirname, outDir, 'Resources');

				if (!existsSync(target)) mkdirSync(target, { recursive: true });

				if (statSync(source).isDirectory()) {
					const files = readdirSync(source);
					files.forEach(function (file) {
						const sourcePath = join(source, file);
						const targetPath = join(target, file);
						if (statSync(sourcePath).isDirectory())
							copyFolderRecursiveSync(sourcePath, targetPath);
						else copyFileSync(sourcePath, targetPath);
					});
				}
				console.log('✅ Resources 资源文件夹复制完成！');
			},
		},
	],
});
