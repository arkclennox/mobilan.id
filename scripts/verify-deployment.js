#!/usr/bin/env node

/**
 * Vercel Deployment Verification Script
 * Run this script to verify your project is ready for Vercel deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Vercel Deployment Verification\n');

// 1. Check package.json
function checkPackageJson() {
  console.log('📦 Checking package.json...');
  
  if (!fs.existsSync('package.json')) {
    console.error('❌ package.json not found');
    return false;
  }
  
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Check required scripts
  const requiredScripts = ['build', 'start', 'dev'];
  const missingScripts = requiredScripts.filter(script => !pkg.scripts[script]);
  
  if (missingScripts.length > 0) {
    console.error(`❌ Missing scripts: ${missingScripts.join(', ')}`);
    return false;
  }
  
  console.log('✅ package.json looks good');
  return true;
}

// 2. Check Next.js configuration
function checkNextConfig() {
  console.log('⚙️  Checking Next.js configuration...');
  
  const configFiles = ['next.config.js', 'next.config.mjs', 'next.config.ts'];
  const configExists = configFiles.some(file => fs.existsSync(file));
  
  if (configExists) {
    console.log('✅ Next.js config found');
  } else {
    console.log('⚠️  No Next.js config found (using defaults)');
  }
  
  return true;
}

// 3. Check for problematic files
function checkProblematicFiles() {
  console.log('🚫 Checking for problematic files...');
  
  const problematicFiles = [
    'vercel.json',
    'now.json',
    '.nowignore'
  ];
  
  const foundFiles = problematicFiles.filter(file => fs.existsSync(file));
  
  if (foundFiles.length > 0) {
    console.error(`❌ Found problematic files: ${foundFiles.join(', ')}`);
    console.log('   These files may cause deployment issues. Consider removing them.');
    return false;
  }
  
  console.log('✅ No problematic files found');
  return true;
}

// 4. Check TypeScript configuration
function checkTypeScript() {
  console.log('📝 Checking TypeScript configuration...');
  
  if (fs.existsSync('tsconfig.json')) {
    console.log('✅ TypeScript configuration found');
    
    // Check for common issues
    const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
    
    if (tsconfig.compilerOptions && tsconfig.compilerOptions.strict === false) {
      console.log('⚠️  TypeScript strict mode is disabled');
    }
    
    return true;
  }
  
  console.log('ℹ️  No TypeScript configuration (JavaScript project)');
  return true;
}

// 5. Check environment variables
function checkEnvironmentVariables() {
  console.log('🔐 Checking environment variables...');
  
  const envFiles = ['.env', '.env.local', '.env.example'];
  const foundEnvFiles = envFiles.filter(file => fs.existsSync(file));
  
  if (foundEnvFiles.length > 0) {
    console.log(`✅ Environment files found: ${foundEnvFiles.join(', ')}`);
    
    // Check for common patterns
    foundEnvFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
      
      console.log(`   ${file}: ${lines.length} variables`);
      
      // Check for potentially sensitive data
      const sensitivePatterns = ['password', 'secret', 'key', 'token'];
      const sensitiveVars = lines.filter(line => 
        sensitivePatterns.some(pattern => 
          line.toLowerCase().includes(pattern)
        )
      );
      
      if (sensitiveVars.length > 0) {
        console.log(`   ⚠️  Found ${sensitiveVars.length} potentially sensitive variables`);
      }
    });
  } else {
    console.log('ℹ️  No environment files found');
  }
  
  return true;
}

// 6. Check dependencies
function checkDependencies() {
  console.log('📚 Checking dependencies...');
  
  if (!fs.existsSync('node_modules')) {
    console.error('❌ node_modules not found. Run: npm install');
    return false;
  }
  
  console.log('✅ Dependencies installed');
  return true;
}

// 7. Check build output
function checkBuildOutput() {
  console.log('🏗️  Checking build configuration...');
  
  // Check if .next exists (previous build)
  if (fs.existsSync('.next')) {
    console.log('ℹ️  Previous build found (.next directory exists)');
  }
  
  // Check gitignore
  if (fs.existsSync('.gitignore')) {
    const gitignore = fs.readFileSync('.gitignore', 'utf8');
    const hasNextIgnore = gitignore.includes('.next');
    const hasNodeModulesIgnore = gitignore.includes('node_modules');
    
    if (!hasNextIgnore) {
      console.log('⚠️  .next directory not in .gitignore');
    }
    if (!hasNodeModulesIgnore) {
      console.log('⚠️  node_modules not in .gitignore');
    }
    
    if (hasNextIgnore && hasNodeModulesIgnore) {
      console.log('✅ .gitignore properly configured');
    }
  }
  
  return true;
}

// Run all checks
async function runAllChecks() {
  const checks = [
    checkPackageJson,
    checkNextConfig,
    checkProblematicFiles,
    checkTypeScript,
    checkEnvironmentVariables,
    checkDependencies,
    checkBuildOutput
  ];
  
  let allPassed = true;
  
  for (const check of checks) {
    const result = check();
    if (!result) allPassed = false;
    console.log('');
  }
  
  console.log('='.repeat(50));
  
  if (allPassed) {
    console.log('🎉 All checks passed! Your project is ready for Vercel deployment.');
    console.log('\nNext steps:');
    console.log('1. Push your changes to GitHub');
    console.log('2. Check Vercel dashboard for automatic deployment');
    console.log('3. Verify your site is working at the deployed URL');
  } else {
    console.log('❌ Some checks failed. Please fix the issues above before deploying.');
  }
}

// Run the verification
runAllChecks().catch(console.error);