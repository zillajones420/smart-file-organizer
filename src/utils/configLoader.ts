import fs from 'fs';
import { AppConfig, defaultConfig } from './config';
import { ConfigError } from './errors/ConfigError';
import { logger } from './logger';

export class ConfigLoader {
    constructor(private configPath: string) {}

    load(): AppConfig {
        try {
            if (!fs.existsSync(this.configPath)) {
                logger.info('Config file not found, using default configuration');
                return defaultConfig;
            }

            const configData = fs.readFileSync(this.configPath, 'utf8');
            const config = JSON.parse(configData);
            return { ...defaultConfig, ...config };
        } catch (error) {
            throw new ConfigError('Failed to load configuration', error);
        }
    }

    save(config: AppConfig): void {
        try {
            fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
        } catch (error) {
            throw new ConfigError('Failed to save configuration', error);
        }
    }
}

function getTimestamp(): string {
    return new Date().toISOString().replace(/[:.]/g, '-');
}
