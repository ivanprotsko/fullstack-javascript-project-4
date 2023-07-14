import os from 'os';
import fsp from 'fs/promises';
import { createFolder } from '../src/page-loader.js';

const temporaryFolder = os.tmpdir();
const directory = 'test-directory'
const fullDirectoryPath = `${temporaryFolder}/${directory}`

test('Create folder', async () => {
  expect(await createFolder(fullDirectoryPath))
    .toEqual('success');
})
afterAll(async () => await fsp.rmdir(fullDirectoryPath));
