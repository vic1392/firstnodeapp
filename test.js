// A simple test file (no fancy framework needed for learning)
const http = require('http');

console.log('🧪 Running tests...\n');

let testsPassed = 0;
let testsFailed = 0;

// Test 1: Home endpoint
function testHome() {
  return new Promise((resolve) => {
    http.get('http://localhost:3000/', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200 && data.includes('Welcome')) {
          console.log('✅ Test 1 PASSED: Home endpoint works');
          testsPassed++;
        } else {
          console.log('❌ Test 1 FAILED: Home endpoint broken');
          testsFailed++;
        }
        resolve();
      });
    }).on('error', () => {
      console.log('❌ Test 1 FAILED: Could not connect');
      testsFailed++;
      resolve();
    });
  });
}

// Test 2: Health endpoint
function testHealth() {
  return new Promise((resolve) => {
    http.get('http://localhost:3000/health', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200 && data.includes('healthy')) {
          console.log('✅ Test 2 PASSED: Health endpoint works');
          testsPassed++;
        } else {
          console.log('❌ Test 2 FAILED: Health endpoint broken');
          testsFailed++;
        }
        resolve();
      });
    }).on('error', () => {
      console.log('❌ Test 2 FAILED: Could not connect');
      testsFailed++;
      resolve();
    });
  });
}

// Test 3: Tasks endpoint
function testTasks() {
  return new Promise((resolve) => {
    http.get('http://localhost:3000/tasks', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Test 3 PASSED: Tasks endpoint works');
          testsPassed++;
        } else {
          console.log('❌ Test 3 FAILED: Tasks endpoint broken');
          testsFailed++;
        }
        resolve();
      });
    }).on('error', () => {
      console.log('❌ Test 3 FAILED: Could not connect');
      testsFailed++;
      resolve();
    });
  });
}

// Run all tests
(async () => {
  await testHome();
  await testHealth();
  await testTasks();
  
  console.log(`\n📊 Results: ${testsPassed} passed, ${testsFailed} failed`);
  
  if (testsFailed > 0) {
    process.exit(1); // Exit with error code if tests fail
  }
})();
