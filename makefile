install:
	npm ci

install-eslint-packages:
	npm install eslint
	npm install eslint-config-airbnb-base
	npm install eslint-plugin-import

lint:
	npx eslint ./bin/
	npx eslint ./src/
	npx eslint __fixtures__
	npx eslint __tests__
	npx eslint ./

test:
	npm run test

debug-page-loader:
	DEBUG=page-loader node ./bin/page-loader.js https://ru.hexlet.1io/courses 2>> ./logs/page-loader.log

debug-axios:
	DEBUG=axios node --require axios-debug-log ./bin/page-loader.js https://ru.hexlet.1io/courses 2>> ./logs/axios.log

test-watch:
	npm run test-watch

test-coverage:
	npm test -- --coverage --coverageProvider=v8
