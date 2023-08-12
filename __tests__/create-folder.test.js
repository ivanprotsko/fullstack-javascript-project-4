import os from 'os';
import fsp from 'fs/promises';
import { createFolder } from '../src/page-loader.js';

const temporaryFolder = os.tmpdir();
const directory = 'test-directory';
const fullDirectoryPath = `${temporaryFolder}/${directory}`;

test('Create folder', () => {
  expect(
    createFolder(fullDirectoryPath),
  )
    .toEqual('success');
});
afterAll(() => fsp.rmdir(fullDirectoryPath));
