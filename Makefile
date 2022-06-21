install:
	npm ci
develop:
	npx webpack serve
lint:
	npx eslint
test:
	npx jest
test-coverage:
	npm run coverage