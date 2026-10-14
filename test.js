// A simple test file (no fancy framework needed for learning)
const http = require('http');

console.log('🧪 Running tests...\n');

let testsPassed = 0;
let testsFailed = 0;

// Generic helper — GET a path and run an assertion on the response
function get(path) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    }).on('error', () => resolve({ statusCode: 0, body: '' }));
  });
}

// Test 1: Home endpoint
async function testHome() {
  const { statusCode, body } = await get('/');
  if (statusCode === 200 && body.includes('Welcome')) {
    console.log('✅ Test 1 PASSED: Home endpoint works');
    testsPassed++;
  } else {
    console.log('❌ Test 1 FAILED: Home endpoint broken');
    testsFailed++;
  }
}

// Test 2: Health endpoint
async function testHealth() {
  const { statusCode, body } = await get('/health');
  if (statusCode === 200 && body.includes('healthy')) {
    console.log('✅ Test 2 PASSED: Health endpoint works');
    testsPassed++;
  } else {
    console.log('❌ Test 2 FAILED: Health endpoint broken');
    testsFailed++;
  }
}

// Test 3: Tasks endpoint (list)
async function testTasks() {
  const { statusCode } = await get('/tasks');
  if (statusCode === 200) {
    console.log('✅ Test 3 PASSED: Tasks endpoint works');
    testsPassed++;
  } else {
    console.log('❌ Test 3 FAILED: Tasks endpoint broken');
    testsFailed++;
  }
}

// ✅ NEW Test 4: Single task by ID
async function testSingleTask() {
  const { statusCode, body } = await get('/tasks/1');
  if (statusCode === 200 && body.includes('"id":1')) {
    console.log('✅ Test 4 PASSED: Single task endpoint works');
    testsPassed++;
  } else {
    console.log('❌ Test 4 FAILED: Single task endpoint broken');
    testsFailed++;
  }
}

// ✅ NEW Test 5: 404 for missing task
async function testMissingTask() {
  const { statusCode } = await get('/tasks/9999');
  if (statusCode === 404) {
    console.log('✅ Test 5 PASSED: Missing task returns 404');
    testsPassed++;
  } else {
    console.log('❌ Test 5 FAILED: Missing task did not return 404');
    testsFailed++;
  }
}

// ✅ NEW Test 6: Version endpoint
async function testVersion() {
  const { statusCode, body } = await get('/version');
  if (statusCode === 200 && body.includes('1.1.0')) {
    console.log('✅ Test 6 PASSED: Version endpoint works');
    testsPassed++;
  } else {
    console.log('❌ Test 6 FAILED: Version endpoint broken');
    testsFailed++;
  }
}

// Run all tests
(async () => {
  await testHome();
  await testHealth();
  await testTasks();
  await testSingleTask();
  await testMissingTask();
  await testVersion();

  console.log(`\n📊 Results: ${testsPassed} passed, ${testsFailed} failed`);

  // Use exitCode instead of process.exit() to let stdout flush cleanly
  if (testsFailed > 0) {
    process.exitCode = 1;
  }
})();
