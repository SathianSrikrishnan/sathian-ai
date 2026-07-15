$ErrorActionPreference = 'Stop'

node tests/browser/homepage_accessibility_check.cjs
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

node tests/browser/public_launch_metadata_check.cjs
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$python = $env:CODEX_TEST_PYTHON
if (-not $python) {
  throw 'CODEX_TEST_PYTHON must point to the Python 3.12 browser-test runtime.'
}

$env:PYTHONPATH = (Resolve-Path '.codex-python').Path
& $python tests/browser/homepage_relaunch_check.py
exit $LASTEXITCODE
