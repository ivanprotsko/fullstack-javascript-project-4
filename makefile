

install:
	npm ci

install-eslint-packages:
	npm install eslint
	npm install eslint-config-airbnb-base
	npm install eslint-plugin-import

lint:
	npx eslint ./bin/
	npx eslint ./src/
	npx eslint __tests__
	npx eslint ./

test:
	npm run test

SCOPE=''
FILEPATH=''
URL=''
TIMESTAMP := $(shell /bin/date "+%Y.%m.%d")
debug-page-loader:
	mkdir -p ./logs/page-loader-logs
	DEBUG=page-loader node ./bin/page-loader.js $(URL) >> logs/page-loader-logs/$(TIMESTAMP).log 2>&1

debug-axios:
	mkdir -p ./logs/axios-logs
	DEBUG=axios node --require axios-debug-log ./bin/page-loader.js $(URL) >> logs/axios-logs/$(TIMESTAMP).log 2>&1

debug-nock:
	mkdir -p ./logs/nock-logs
	DEBUG=nock.scope:$(SCOPE) NODE_OPTIONS=--experimental-vm-modules npx jest $(FILEPATH) >> logs/nock-logs/$(TIMESTAMP) 2>&1

test-watch:
	npm run test-watch

test-coverage:
	npm test -- --coverage --coverageProvider=v8
