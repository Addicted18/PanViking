$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
Push-Location $projectRoot

try {
  & npx.cmd --yes esbuild app.js --minify --target=es2020 --outfile=app.min.js
  if ($LASTEXITCODE -ne 0) {
    throw "JavaScript build failed with exit code $LASTEXITCODE."
  }

  & npx.cmd --yes lightningcss-cli --minify --bundle style.css -o style.min.css
  if ($LASTEXITCODE -ne 0) {
    throw "CSS build failed with exit code $LASTEXITCODE."
  }
} finally {
  Pop-Location
}
