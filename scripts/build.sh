#!/bin/sh

npm install --silent
npm run build
cp -r src/generate/templates bin/generate/templates
cp ./package.json bin/package.json
cp ./README.md bin/README.md