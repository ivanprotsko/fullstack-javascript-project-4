import os from 'os';
import fsp from 'fs/promises';
import {
  test, expect, afterAll, describe,
} from '@jest/globals';
import createFolder from '../src/utils/get-folder/create-folder';
import doesFolderExist from '../src/utils/get-folder/does-folder-exist';

const temporaryFolder = os.tmpdir();
const directory = 'test-directory';
const fullPath = `${temporaryFolder}/${directory}`;

describe('Test of createFolder function', () => {
  test('Folder exists', async () => {
    const existingFolder = os.tmpdir();
    const result = await doesFolderExist(existingFolder);

    await expect(result).toBe('folder-exists');
  });

  test('Folder not exists', async () => {
    await expect(doesFolderExist(fullPath).catch((e) => e.toString()))
      .resolves.toMatch(`Error: ENOENT: no such file or directory, access '${fullPath}'`);
  });

  test('Create folder', async () => {
    await expect(createFolder(fullPath))
      .resolves
      .toEqual('the-folder-has-been-created');
  });
});

afterAll(() => fsp.rmdir(fullPath));
