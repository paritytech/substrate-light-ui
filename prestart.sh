#!/bin/bash

echo Prebuilding Dependent Apps...

echo Building ui-components...
cd './packages/ui-components'
yarn build

echo Building ui-api ...
cd '../ui-api'
yarn build

echo Building identity-app...
cd '../identity-app'
yarn build

echo Building transfer-app...
cd '../transfer-app'
yarn build

echo Finished Prestart Build!
