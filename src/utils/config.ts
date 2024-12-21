import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';
import { ConfigError } from './errors/ConfigError';

export interface AppConfig {
    version: string;
    paths: {
        root: string;
        working: string;
        backup: string;
        log: string;
    };
    rules: {
        [key: string]: string[];
    };
    organizing: {
        createDateFolders: boolean;
        dateFormat: string;
        preserveNames: boolean;
        conflictAction: 'rename' | 'skip' | 'overwrite';
    };
    backup: {
        enabled: boolean;
        keepCount: number;
        compress: boolean;
    };
    sourcePath: string;
    destinationPath: string;
    fileTypes: string[];
    organizeBy: 'extension' | 'date' | 'size';
    createSubfolders: boolean;
    supportedFileTypes: string[];
}

export interface FileMetadata {
    path: string;
    name: string;
    extension: string;
    size: number;
    created: Date;
    modified: Date;
    category?: string;
}

export interface Rule {
    name: string;
    patterns: string[];
    priority: number;
}

export interface Category {
    name: string;
    rules: Rule[];
    targetPath: string;
}

export interface OrganizeResult {
    success: boolean;
    message: string;
    error?: Error;
}

export const defaultConfig: AppConfig = {
    version: '1.0.0',
    paths: {
        root: process.env.USER_PROFILE + "/Documents",
        working: process.env.USER_PROFILE + "/Documents/FileOrganizer",
        backup: process.env.USER_PROFILE + "/Documents/Backup",
        log: process.env.USER_PROFILE + "/Documents/FileOrganizer.log"
    },
    rules: {
        Images: ["jpg", "png", "gif"],
        Documents: ["pdf", "doc", "docx"]
    },
    organizing: {
        createDateFolders: false,
        dateFormat: 'YYYY-MM-DD',
        preserveNames: true,
        conflictAction: 'rename'
    },
    backup: {
        enabled: true,
        keepCount: 5,
        compress: true
    },
    sourcePath: '',
    destinationPath: '',
    fileTypes: ['*'],
    organizeBy: 'extension',
    createSubfolders: true,
    supportedFileTypes: ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx']
};

export const getConfig = (): AppConfig => {
     // TODO: Load config from file or environment variables
     return defaultConfig;
};

export const updateConfig = (newConfig: Partial<AppConfig>): AppConfig => {
     // TODO: Save config to file or environment variables
     return { ...defaultConfig, ...newConfig };
};

interface ConfigChangeListener {
  (newConfig: AppConfig): void;
}

class ConfigManager {
  private configPath: string;
  private listeners: ConfigChangeListener[] = [];

  constructor(configPath: string) {
    this.configPath = configPath;
  }

  async updateConfig(newConfig: Partial<AppConfig>): Promise<AppConfig> {
    try {
      // Validate incoming config
      const merged = { ...defaultConfig, ...newConfig };
      const validationResult = this.validateConfig(merged);
      
      if (!validationResult.success) {
        throw new ConfigError(`Invalid config: ${validationResult.error.message}`);
      }

      // Create backup of existing config
      await this.backupConfig();

      // Write new config atomically
      const tempPath = `${this.configPath}.temp`;
      await fs.writeFile(tempPath, JSON.stringify(merged, null, 2));
      await fs.rename(tempPath, this.configPath);

      // Notify listeners
      this.notifyListeners(merged);

      return merged;
    } catch (error: unknown) {
      throw new ConfigError('Failed to update config', error);
    }
  }

  private async backupConfig(): Promise<void> {
    try {
      const backupPath = `${this.configPath}.backup`;
      await fs.copyFile(this.configPath, backupPath);
    } catch (error) {
      console.warn(`Failed to create config backup: ${error.message}`);
    }
  }

  onConfigChange(listener: ConfigChangeListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(config: AppConfig): void {
    this.listeners.forEach(listener => {
      try {
        listener(config);
      } catch (error) {
        console.error(`Config listener error: ${error.message}`);
      }
    });
  }

  private validateConfig(config: unknown): z.SafeParseReturnType<unknown, AppConfig> {
    const ConfigSchema = z.object({
      version: z.string(),
      paths: z.object({
        root: z.string(),
        working: z.string(),
        backup: z.string(),
        log: z.string()
      }),
      // Add other config validation rules
    });

    return ConfigSchema.safeParse(config);
  }
}

export class ConfigError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'ConfigError';
    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ConfigError);
    }
  }
}

export const configManager = new ConfigManager(
  path.join(process.cwd(), 'config.json')
);