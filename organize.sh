# Create proper directory structure
mkdir -p src/{core,utils,types,errors}

# Move files to correct locations
mv organizer.ts src/core/
mv scanner.ts src/core/
mv ConfigError.ts src/errors/
mv config.ts src/types/
mv {config,configLoader,fileTypeValidator,logger}.ts src/utils/

# Clean up duplicates and unnecessary files
rm -rf Untitled-4.jsonc
