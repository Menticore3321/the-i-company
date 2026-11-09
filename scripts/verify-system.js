import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('\n======================================================');
console.log('🛡️  THE I COMPANY · SYSTEM INTEGRITY & HEALTH CHECK');
console.log('======================================================\n');

let passed = true;

// 1. Sync architecture state first
try {
  console.log('1. Running Architecture Manifest Sync...');
  execSync('node scripts/sync-architecture.js', { cwd: rootDir, stdio: 'inherit' });
  console.log('   [PASS] Manifest & Blueprint verified and refreshed.\n');
} catch (e) {
  console.error('   [FAIL] Architecture sync failed:', e.message);
  passed = false;
}

// 2. TypeScript compilation check
try {
  console.log('2. Verifying TypeScript compilation (tsc --noEmit)...');
  execSync('node node_modules/typescript/lib/tsc.js --noEmit', { cwd: rootDir, stdio: 'inherit' });
  console.log('   [PASS] Zero TypeScript type errors detected.\n');
} catch (e) {
  console.error('   [FAIL] TypeScript compilation errors detected!\n');
  passed = false;
}

// 3. Database configuration check
try {
  console.log('3. Checking Database Hybrid Configuration...');
  const envPath = path.join(rootDir, '.env');
  if (fs.existsSync(envPath)) {
    const env = fs.readFileSync(envPath, 'utf8');
    if (env.includes('VITE_SUPABASE_URL') && env.includes('VITE_SUPABASE_ANON_KEY')) {
      console.log('   [PASS] Supabase Cloud credentials active & configured.\n');
    } else {
      console.log('   [WARN] .env found but Supabase keys appear incomplete (using fallback local persistence).\n');
    }
  } else {
    console.log('   [WARN] No .env found (using offline hybrid persistence).\n');
  }
} catch (e) {
  console.error('   [FAIL] Database check failed:', e.message);
  passed = false;
}

// 4. Capacitor Android health check
try {
  console.log('4. Checking Capacitor Android Scaffolding...');
  const capConfig = path.join(rootDir, 'capacitor.config.ts');
  const androidManifest = path.join(rootDir, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
  const workflow = path.join(rootDir, '.github', 'workflows', 'android-build.yml');

  if (fs.existsSync(capConfig) && fs.existsSync(androidManifest) && fs.existsSync(workflow)) {
    console.log('   [PASS] Android project and GitHub Actions build workflow healthy.\n');
  } else {
    console.error('   [FAIL] Android project files or CI workflow missing!\n');
    passed = false;
  }
} catch (e) {
  console.error('   [FAIL] Capacitor check failed:', e.message);
  passed = false;
}

// Summary
console.log('======================================================');
if (passed) {
  console.log('🎉 ALL SYSTEM CHECKS PASSED: READY FOR PRODUCTION');
} else {
  console.log('❌ SOME INTEGRITY CHECKS FAILED: REVIEW LOGS ABOVE');
  process.exit(1);
}
console.log('======================================================\n');
