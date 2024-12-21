import path from 'path';
import { AppConfig } from './config';

export class FileTypeValidator {
    private extensionMap: Map<string, string>;

    constructor(private config: AppConfig) {
        this.extensionMap = this.buildExtensionMap();
    }

    public getCategory(filePath: string): string {
        const ext = path.extname(filePath).toLowerCase().slice(1);
        return this.extensionMap.get(ext) || 'Others';
    }

    public isSupported(filePath: string): boolean {
        const ext = path.extname(filePath).toLowerCase().slice(1);
        return this.extensionMap.has(ext);
    }

    private buildExtensionMap(): Map<string, string> {
        const map = new Map<string, string>();
        
        const defaultCategories = {
            Images: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'],
            Documents: ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'],
            Audio: ['mp3', 'wav', 'flac', 'm4a', 'aac'],
            Video: ['mp4', 'avi', 'mkv', 'mov', 'wmv'],
            Archives: ['zip', 'rar', '7z', 'tar', 'gz'],
            Code: ['js', 'ts', 'py', 'java', 'cpp', 'html', 'css']
        };

        // Merge default categories with config rules
        const rules = { ...defaultCategories, ...this.config.rules };
        
        Object.entries(rules).forEach(([category, extensions]) => {
            extensions.forEach(ext => {
                map.set(ext.toLowerCase(), category);
            });
        });

        return map;
    }
}
