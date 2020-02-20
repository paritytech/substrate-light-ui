#!/bin/bash

# FIXME: this is an interim solution until paritytech/substrate-light-ui#10 gets merged
# which is currently blocked by facebook/create-react-app#5645
# https://github.com/paritytech/substrate-light-ui/issues/10

echo Prebuilding Dependent Apps...

# Exit immediately if a command exits with a non-zero status
trap 'exit' ERR

ROOT=`dirname "$0"`
PROJECT_ROOT=`git rev-parse --show-toplevel`

# A list of dependent directories to build before light-apps
SRCS=(
	"packages/light"
	"packages/ui-components"
)

# Save current directory.
pushd .

cd $ROOT

for SRC in "${SRCS[@]}"
do
  echo "*** Building $SRC ***"
  cd "$PROJECT_ROOT/$SRC"

  yarn build
done

# restore initial directory
popd
