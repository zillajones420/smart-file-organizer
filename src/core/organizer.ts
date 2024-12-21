import * as fs from 'fs';
import * as path from 'path';

class FileOrganizer {
  constructor(
    private sourcePath: string,
    private options = { othersDir: 'others', dryRun: false }
  ) {}

  async organize(): Promise<void> {
    try {
      const files = await fs.promises.readdir(this.sourcePath);
      
      for (const file of files) {
        await this.organizeFile(file);
      }
    } catch (error) {
      throw new Error(`Failed to organize files: ${error}`);
    }
  }

  private async organizeFile(file: string): Promise<void> {
    const filePath = path.join(this.sourcePath, file);
    const stats = await fs.promises.stat(filePath);

    if (stats.isFile()) {
      const extension = path.extname(file).toLowerCase();
      const targetDir = path.join(
        this.sourcePath, 
        extension.slice(1) || this.options.othersDir
      );

      if (!this.options.dryRun) {
        await fs.promises.mkdir(targetDir, { recursive: true });
        await fs.promises.rename(filePath, path.join(targetDir, file));
      }
    }
  }
}

export default FileOrganizer;
