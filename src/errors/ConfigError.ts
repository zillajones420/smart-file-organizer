export class ConfigError extends Error {
    constructor(message: string, public readonly cause?: unknown) {
        super(message);
        this.name = 'ConfigError';
        
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ConfigError);
        }
    }
}
