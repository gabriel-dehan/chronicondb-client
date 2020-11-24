import * as fs from 'fs';
import * as path from 'path';

export function createExtractsFolder(version: string) {
  const absolutePath = path.resolve(__dirname, `../data/${version}/extracts/`);

  if (!fs.existsSync(absolutePath)) {
    fs.mkdirSync(absolutePath);
  }
}

export function readSourceFile(version: string, fileName: string): string {
  const absolutePath = path.resolve(__dirname, `../data/${version}/sources/${fileName}`);
  return fs.readFileSync(absolutePath).toString();
}

export function readExtractFile(version: string, fileName: string): string {
  const absolutePath = path.resolve(__dirname, `../data/${version}/extracts/${fileName}.json`);
  return fs.readFileSync(absolutePath).toString();
}

export function writeFile(data: unknown, version: string, fileName: string): void {
  const absolutePath = path.resolve(__dirname, `../data/${version}/extracts/${fileName}.json`);
  fs.writeFileSync(absolutePath, JSON.stringify(data, null, 2));
}

export function getAssetPath(fileName: string): string {
  return path.resolve(__dirname, `../../assets/game/${fileName}`);
}

export function assetExists(fileName: string): boolean {
  return fs.existsSync(getAssetPath(fileName));
}
