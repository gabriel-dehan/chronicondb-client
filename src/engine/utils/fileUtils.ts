import * as fs from 'fs';
import * as path from 'path';

export function readFile(version: number, fileName: string): string {
  const absolutePath = path.resolve(__dirname, `../data/${version}/sources/${fileName}`);
  return fs.readFileSync(absolutePath).toString();
}
