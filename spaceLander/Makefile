.PHONY: all server clean build deploy

all: deploy server

server: build
	npx http-server

build: node_modules/
	npx rollup -c ./rollup.config.js

deploy: build lint

lint: node_modules/
	npx eslint src/

node_modules/: package.json
	npm install
	touch node_modules/

clean:
	-rm -f package-lock.json
	-rm -r ./node_modules
	-npm cache verify
