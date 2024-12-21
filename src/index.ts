import { FileOrganizer } from './core/organizer';
import { ConfigLoader } from './utils/configLoader';
import { logger } from './utils/logger';
import path from 'path';

async function main() {
    try {
        // Initialize configuration
        const configLoader = new ConfigLoader(path.join(__dirname, '../config.json'));
        const config = configLoader.load();

        // Initialize file organizer
        const organizer = new FileOrganizer(config.sourcePath, config);

        // Start organization process
        logger.info('Starting file organization...');
        await organizer.organize();
        logger.info('File organization completed successfully');
    } catch (error) {
        logger.error('Application failed:', error);
        process.exit(1);
    }
}

// Run the application
main();
