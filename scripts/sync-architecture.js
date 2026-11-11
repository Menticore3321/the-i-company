import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function getGitInfo() {
  try {
    const hash = execSync('git rev-parse --short HEAD', { cwd: rootDir }).toString().trim();
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: rootDir }).toString().trim();
    const lastCommitMsg = execSync('git log -1 --pretty=%B', { cwd: rootDir }).toString().trim();
    const commitDate = execSync('git log -1 --pretty=%cd --date=iso', { cwd: rootDir }).toString().trim();
    return { hash, branch, lastCommitMsg, commitDate };
  } catch {
    return { hash: 'local', branch: 'main', lastCommitMsg: 'Working tree', commitDate: new Date().toISOString() };
  }
}

function scanDirectory(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) return [];
    return fs.readdirSync(dirPath).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));
  } catch {
    return [];
  }
}

function runArchitectureSync() {
  console.log('🔄 [The I Company] Running Automated Architecture & State Synchronization...');

  const git = getGitInfo();
  const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
  
  const views = scanDirectory(path.join(rootDir, 'src', 'components', 'views'));
  const modals = scanDirectory(path.join(rootDir, 'src', 'components', 'modals'));
  const types = scanDirectory(path.join(rootDir, 'src', 'types'));
  const lib = scanDirectory(path.join(rootDir, 'src', 'lib'));

  const envPath = path.join(rootDir, '.env');
  let hasSupabase = false;
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    hasSupabase = envContent.includes('VITE_SUPABASE_URL') && !envContent.includes('your-supabase-url');
  }

  const capacitorConfigPath = path.join(rootDir, 'capacitor.config.ts');
  const hasCapacitor = fs.existsSync(capacitorConfigPath);

  const manifest = {
    projectName: 'The I Company',
    appId: 'com.theicompany.app',
    version: pkg.version || '1.0.0',
    lastSyncTimestamp: new Date().toISOString(),
    gitCommit: git.hash,
    gitBranch: git.branch,
    lastCommitMessage: git.lastCommitMsg,
    lastCommitDate: git.commitDate,
    systemIntegrity: {
      cloudDatabaseConnected: hasSupabase,
      capacitorAndroidReady: hasCapacitor,
      roleIsolationActive: true,
      portalsCount: views.length,
      modalsCount: modals.length
    },
    architectureInventory: {
      stakeholderPortals: views,
      interactiveModals: modals,
      coreLibraries: lib,
      dataModels: types
    },
    liveEndpoints: {
      productionWeb: 'https://theicompany.netlify.app',
      gitHubRepository: 'https://github.com/Menticore3321/the-i-company',
      databaseRegion: 'South Asia (Mumbai) - Supabase'
    }
  };

  // Write machine-readable SYSTEM_STATE.json
  const manifestPath = path.join(rootDir, 'SYSTEM_STATE.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log('✅ Generated machine-readable SYSTEM_STATE.json');

  // Update dynamic verification block in PROJECT_BLUEPRINT.md
  const blueprintPath = path.join(rootDir, 'PROJECT_BLUEPRINT.md');
  if (fs.existsSync(blueprintPath)) {
    let blueprintContent = fs.readFileSync(blueprintPath, 'utf8');
    
    const verificationStamp = `<!-- AUTO-SYNC-START -->
## 🔄 Automated Verification & State Manifest (Auto-Updated)
> **Last Synchronized**: \`${manifest.lastSyncTimestamp}\`  
> **Active Git Commit**: \`${git.hash}\` (\`${git.branch}\`) — *${git.lastCommitMsg}*  
> **Database Status**: \`${hasSupabase ? 'CONNECTED (Supabase PostgreSQL)' : 'OFFLINE HYBRID'}\`  
> **Android Native**: \`${hasCapacitor ? 'SYNCHRONIZED (Capacitor Android)' : 'NOT READY'}\`  
> **Discovered Portals (${views.length})**: ${views.map(v => `\`${v}\``).join(', ')}  
> **Discovered Modals (${modals.length})**: ${modals.map(m => `\`${m}\``).join(', ')}  
<!-- AUTO-SYNC-END -->`;

    if (blueprintContent.includes('<!-- AUTO-SYNC-START -->')) {
      blueprintContent = blueprintContent.replace(
        /<!-- AUTO-SYNC-START -->[\s\S]*?<!-- AUTO-SYNC-END -->/,
        verificationStamp
      );
    } else {
      blueprintContent = `${verificationStamp}\n\n${blueprintContent}`;
    }

    fs.writeFileSync(blueprintPath, blueprintContent, 'utf8');
    console.log('✅ Updated dynamic verification stamp in PROJECT_BLUEPRINT.md');
  }

  console.log('✨ Architecture synchronization complete!');
}

runArchitectureSync();

