import fs from 'fs';
import path from 'path';

export default function logError(error: Error) {
    const logFilePath = path.join(process.cwd(), 'logs', 'error.log');
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${error.message}\n${error.stack}\n\n`;
    fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
    fs.appendFileSync(logFilePath, logMessage, 'utf8');
}