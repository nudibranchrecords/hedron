/**
 * Build script for the example project. Important when packaging up the app. Can't just copy over the folder,
 * because with pnpm node_modules are symlinked and so we'd just be copying empty folders
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const sourceDir = path.join(__dirname, 'packages', 'example-project')
const buildDir = path.join(__dirname, 'dist', 'example-project')

console.log('Building standalone example-project...')

// Create dist directory if it doesn't exist
const distParent = path.dirname(buildDir)
if (!fs.existsSync(distParent)) {
  fs.mkdirSync(distParent, { recursive: true })
}

// Remove existing build directory
if (fs.existsSync(buildDir)) {
  fs.rmSync(buildDir, { recursive: true })
}

// Copy all files except node_modules and build artifacts
console.log('Copying project files...')
copyDir(sourceDir, buildDir, [
  'node_modules',
  'build-standalone.js',
  '.npmrc',
  'install-standalone.sh',
])

// Change to build directory and install with npm for real dependencies
console.log('Installing dependencies with npm...')
process.chdir(buildDir)

try {
  execSync('npm install --production', { stdio: 'inherit' })

  console.log('Creating zip archive...')

  // Change back to dist directory to create zip
  process.chdir(path.join(__dirname, 'dist'))

  // Create zip file
  // we use -0 to "store" (no compression) so that it unzips quickly
  // TODO: Should use cross platform approach here, zip may not exist on some machines
  execSync('zip -1 -r hedron-example-project.zip example-project', { stdio: 'inherit' })

  console.log('✅ Standalone example-project built successfully!')
  console.log(`📁 Folder: ${buildDir}`)
  console.log(`📦 Zip: ${path.join(__dirname, 'dist', 'hedron-example-project.zip')}`)
} catch (error) {
  console.error('❌ Build failed:', error.message)
  process.exit(1)
}

function copyDir(src, dest, exclude = []) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }

  const items = fs.readdirSync(src)

  for (const item of items) {
    if (exclude.includes(item) || item.startsWith('.git')) {
      continue
    }

    const srcPath = path.join(src, item)
    const destPath = path.join(dest, item)
    const stat = fs.statSync(srcPath)

    if (stat.isDirectory()) {
      copyDir(srcPath, destPath, exclude)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}
