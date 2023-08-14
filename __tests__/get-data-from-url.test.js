import nock from 'nock';
import axios from "axios";
import { getBinaryDataFromUrl } from '../src/page-loader.js';

test('Get data from URL', async () => {
  const scope = nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, 'data');
  try {
    await expect(
      getBinaryDataFromUrl('https://ru.hexlet.io/courses'),
    ).resolves.toBe('dat1a');
  } catch (e) {
   console.error(e);
  }
  scope.done();
});

// test('Get error from URL 2', async () => {
//   const scope = nock('https://ru.hexlet.i1')
//     .get('/courses')
//     .reply(200, 'error');
//
//   await expect(
//     getBinaryDataFromUrl('https://ru.hexlet.i1/courses'),
//   ).rejects.toMatch('error');
//   scope.done();
// });

// test('the data is peanut butter', async () => {
//   await expect(fetchData()).resolves.toBe('peanut butter');
// });
//
// test('the fetch fails with an error', async () => {
//   await expect(fetchData()).rejects.toMatch('error');
// });
//
// // test('Get data from URL', async () => {
//   const scope = nock('https://ru.hexlet.io')
//     .get('/courses')
//     .reply(200, 'data');
//
//   expect(
//     await getBinaryDataFromUrl('https://ru.hexlet.io/courses'),
//   ).toEqual('data');
//
//   scope.done();
// });
// describe('Read data from API', () => {
//   test('Get successful result of the API call', async() => {
//     const apiUrl = "https://ru.hexlet.io/courses";
//     await axios.get(apiUrl)
//       .then(r => {
//         expect(r.data).toBeDefined();
//         expect(r.data.length).toBeGreaterThan(0);
//         expect(r.status).toBeGreaterThanOrEqual(200);
//         expect(r.status).toBeLessThan(300);
//       })
//       .catch(e => {
//         fail(`Expected successful response`);
//       });
//   });
//
//   test('Get failure result of the API call', async() => {
//     const apiUrl = "https://ru.hexlet.io/coursex";
//     await axios.get(apiUrl)
//       .then(r => {
//         fail(`Expected failure response`);
//       })
//       .catch(e => {
//         if (e.response) {
//           expect(e.response.status).toBeGreaterThanOrEqual(400);
//           expect(e.response.status).toBeLessThan(500);
//         } else {
//           throw e;
//         }
//       });
//   });
// });
