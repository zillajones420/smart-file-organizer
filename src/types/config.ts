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
    }; // Add semicolon here
} // Add closing brace here