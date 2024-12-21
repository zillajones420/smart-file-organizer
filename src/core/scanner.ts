import * as fs from 'fs/promises';
import * as path from 'path';

export interface ScanResult {
     path: string;
     isDirectory: boolean;
     size: number;
     modifiedDate: Date;
}

export class FileScanner {
     constructor(private readonly basePath: string) {}

     async scan(): Promise<ScanResult[]> {
          try {
               const results: ScanResult[] = [];
               await this.scanDirectory(this.basePath, results);
               return results;
          } catch (error) {
               console.error('Error scanning files:', error);
               throw error;
          }
     }

     private async scanDirectory(dirPath: string, results: ScanResult[]): Promise<void> {
          const entries = await fs.readdir(dirPath, { withFileTypes: true });

          for (const entry of entries) {
               const fullPath = path.join(dirPath, entry.name);
               const stats = await fs.stat(fullPath);

               results.push({
                    path: fullPath,
                    isDirectory: entry.isDirectory(),
                    size: stats.size,
                    modifiedDate: stats.mtime
               });

               if (entry.isDirectory()) {
                    await this.scanDirectory(fullPath, results);
               }
          }
     }
}