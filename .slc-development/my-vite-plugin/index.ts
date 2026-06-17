import { exec } from 'child_process';
import path from 'path';
import type { ViteDevServer, Plugin } from 'vite';

// PocketBase Typegen Otomatik İzleme Eklentisi
export function pocketbaseTypegenPlugin(): Plugin {
	const migrationsPath = path.resolve('./.slc-production/pocketbase/pb_migrations');
	
	let debounceTimer: NodeJS.Timeout | null = null;
	const runTypegen = () => {
		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			console.log('⚡ PocketBase şeması değişti, tipler yeniden üretiliyor...');
			exec('npm run pb:typegen', (err: Error | null, stdout: string, stderr: string) => {
				if (err) {
					console.error('❌ Typegen hatası:', stderr);
				} else {
					console.log('✅ Tipler başarıyla güncellendi!');
				}
			});
		}, 300);
	};

	return {
		name: 'pocketbase-typegen-plugin',
		configureServer(server: ViteDevServer) {
			// Sadece pb_migrations klasörünü izlenecekler listesine ekle
			server.watcher.add(migrationsPath);
			
			// Dosya eklenme veya değiştirilme durumlarında tetiklen
			server.watcher.on('all', (event: string, filePath: string) => {
				const resolvedPath = path.resolve(filePath);
				if (resolvedPath.startsWith(migrationsPath)) {
					runTypegen();
				}
			});
		}
	};
}
