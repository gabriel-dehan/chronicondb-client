import * as fs from 'fs';
import * as path from 'path';

export function readFile(version: number, fileName: string): string {
  const absolutePath = path.resolve(__dirname, `../data/${version}/sources/${fileName}`);
  return fs.readFileSync(absolutePath).toString();
}


export function getAssetPath(fileName: string): string {
  return path.resolve(__dirname, `../../assets/game/${fileName}`);
}

export function assetExists(fileName: string): boolean {
  return fs.existsSync(getAssetPath(fileName));
}
