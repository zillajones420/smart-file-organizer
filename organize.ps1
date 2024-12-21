# Create directories
New-Item -ItemType Directory -Force -Path "src/core"
New-Item -ItemType Directory -Force -Path "src/utils"
New-Item -ItemType Directory -Force -Path "src/types"
New-Item -ItemType Directory -Force -Path "src/errors"

# Move files
Move-Item -Path "organizer.ts" -Destination "src/core/" -Force
Move-Item -Path "scanner.ts" -Destination "src/core/" -Force
Move-Item -Path "ConfigError.ts" -Destination "src/errors/" -Force
Move-Item -Path "config.ts" -Destination "src/types/" -Force
Move-Item -Path "config.ts","configLoader.ts","fileTypeValidator.ts","logger.ts" -Destination "src/utils/" -Force

# Clean up
Remove-Item "Untitled-4.jsonc" -Force
