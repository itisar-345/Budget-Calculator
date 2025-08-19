#!/usr/bin/env node

/**
 * Production Build Test Script
 * Validates the production build for common issues
 */

import { execSync } from 'child_process';
import { existsSync, statSync } from 'fs';
import { join } from 'path';

const DIST_DIR = 'dist';
const REQUIRED_FILES = [
  'index.html',
  'assets',
  'favicon.ico',
  'robots.txt',
  'sitemap.xml',
  'manifest.json'
];

console.log('🔍 Running production build tests...\n');

try {
  // Test 1: Build the project
  console.log('1. Building project...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully\n');

  // Test 2: Check if dist directory exists
  console.log('2. Checking dist directory...');
  if (!existsSync(DIST_DIR)) {
    throw new Error('dist directory not found');
  }
  console.log('✅ dist directory exists\n');

  // Test 3: Check required files
  console.log('3. Checking required files...');
  for (const file of REQUIRED_FILES) {
    const filePath = join(DIST_DIR, file);
    if (!existsSync(filePath)) {
      throw new Error(`Required file missing: ${file}`);
    }
    console.log(`✅ ${file} exists`);
  }
  console.log();

  // Test 4: Check bundle sizes
  console.log('4. Checking bundle sizes...');
  const assetsDir = join(DIST_DIR, 'assets');
  if (existsSync(assetsDir)) {
    const files = require('fs').readdirSync(assetsDir);
    files.forEach(file => {
      const filePath = join(assetsDir, file);
      const stats = statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`📦 ${file}: ${sizeKB} KB`);
      
      // Warn about large bundles
      if (stats.size > 1024 * 1024) { // 1MB
        console.log(`⚠️  Large bundle detected: ${file} (${sizeKB} KB)`);
      }
    });
  }
  console.log();

  console.log('🎉 All production build tests passed!');
  console.log('📦 Your app is ready for deployment.');

} catch (error) {
  console.error('❌ Build test failed:', error.message);
  process.exit(1);
}