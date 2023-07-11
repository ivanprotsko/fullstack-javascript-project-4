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

test-coverage:
	npm test -- --coverage --coverageProvider=v8

publish:
	npm publish
