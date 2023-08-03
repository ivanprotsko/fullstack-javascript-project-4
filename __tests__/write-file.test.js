import os from 'os';
import fsp from 'fs/promises';
import { writeFile } from '../src/page-loader.js';

const temporaryFolder = os.tmpdir();
const fileName = 'test-file-name.html';
const filePath = `${temporaryFolder}/${fileName}`;
const data = 'test-data';
test('Create file', async () => {
  expect(await writeFile(filePath, data))
    .toEqual('success');
});
afterAll(async () => await fsp.rm(filePath));
