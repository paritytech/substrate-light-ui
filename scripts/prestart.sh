#!/bin/bash

# FIXME: this is an interim solution until paritytech/substrate-light-ui#10 gets merged
# which is currently blocked by facebook/create-react-app#5645

echo Prebuilding Dependent Apps...

echo Building ui-components...
pushd './packages/ui-components'
yarn build
popd

echo Building ui-api ...
pushd './packages/ui-api'
yarn build
popd

echo Building identity-app...
pushd './packages/identity-app'
yarn build
popd

echo Building transfer-app...
pushd './packages/transfer-app'
yarn build
popd

echo Finished Prestart Build!
