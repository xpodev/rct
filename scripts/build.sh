#!/bin/sh

cd ..

npm install --silent
npm run build
cp -r src/generate/templates bin/generate/templates