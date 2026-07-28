import { writeFileSync } from 'fs';
import { join } from 'path';

async function generateSupportedBrowsersRegex() {
  try {
    const { getUserAgentRegex } = await import('browserslist-useragent-regexp');
    const supportedBrowsersRegex = getUserAgentRegex({
      allowHigherVersions: true
    });
    const outputPath = join(__dirname, '..', 'src', 'assets', 'supportedBrowsers.js');
    const fileContent = `export default\n${supportedBrowsersRegex.toString()}\n`;

    writeFileSync(outputPath, fileContent, 'utf8');
  }
  catch (error) {
    console.error('Failed to generate supported browsers regex file.');
    console.error(error);
    process.exit(1);
  }
}

generateSupportedBrowsersRegex();
