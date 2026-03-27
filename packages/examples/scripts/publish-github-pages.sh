#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXAMPLES_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
REPO_ROOT="$(cd "${EXAMPLES_DIR}/../.." && pwd)"
DOCS_DIR="${REPO_ROOT}/docs"

build_demo() {
    local html_name="$1"
    local dist_dir="$2"

    cp "${EXAMPLES_DIR}/${html_name}" "${EXAMPLES_DIR}/${dist_dir}/${html_name}"
}

publish_shared_resources() {
    mkdir -p "${DOCS_DIR}/resources/styling"

    npx sass resources/styling/all.scss "${DOCS_DIR}/resources/styling/all.css"

    rm -rf "${DOCS_DIR}/resources/fonts"
    mkdir -p "${DOCS_DIR}/resources"
    cp -a "${EXAMPLES_DIR}/resources/fonts" "${DOCS_DIR}/resources/"
}

copy_to_docs() {
    local src_dir="$1"
    local dst_dir="$2"

    rm -rf "${DOCS_DIR:?}/${dst_dir}"
    mkdir -p "${DOCS_DIR}"
    cp -a "${EXAMPLES_DIR}/${src_dir}" "${DOCS_DIR}/${dst_dir}"
}

cd "${EXAMPLES_DIR}"

rm -rf "${EXAMPLES_DIR}/dist_sorting" "${EXAMPLES_DIR}/dist_game_of_life" "${DOCS_DIR}"

echo "Building TypeScript..."
npx tsc

echo "Bundling sorting..."
npx rollup -c rollup.config.sorting.js

echo "Bundling game_of_life..."
npx rollup -c rollup.config.game_of_life.js

echo "Preparing dist_sorting..."
build_demo "sorting.html" "dist_sorting"

echo "Preparing dist_game_of_life..."
build_demo "game_of_life.html" "dist_game_of_life"

echo "Publishing into docs/..."
mkdir -p "${DOCS_DIR}"
copy_to_docs "dist_sorting" "dist_sorting"
copy_to_docs "dist_game_of_life" "dist_game_of_life"
publish_shared_resources

touch "${DOCS_DIR}/.nojekyll"

echo
echo "Done."
echo "GitHub Pages-ready files:"
echo "  ${DOCS_DIR}/dist_sorting/"
echo "  ${DOCS_DIR}/dist_game_of_life/"
echo "  ${DOCS_DIR}/resources/"
echo
echo "If GitHub Pages is configured to serve from the 'master' branch /docs folder,"
echo "the demos will be available at:"
echo "  ./dist_sorting/sorting.html"
echo "  ./dist_game_of_life/game_of_life.html"
