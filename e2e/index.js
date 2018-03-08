// test every e2e case
var path = require('path');
var cp = require('child_process');
var execFileSync = cp.execFileSync;

runTest('basic');
runTest('basic-src-ext');
runTest('basic-dist-ext');
runTest('tiered');
runTest('factoried');
runTest('site');
runTest('site-src-ext');
runTest('site-dist-ext');
runTest('fresh');

function runTest(testCase) {
	var dir = path.join(__dirname, testCase);
	execFileSync('rm', ['-rf', dir + '/dist']);
	execFileSync('node', [dir + '/index.js']);
	var diffError;
	try {
		execFileSync('/usr/bin/diff', ['-r', dir + '/expected', dir + '/dist'], {encoding:'utf8'});
	}
	catch (e) {
		diffError = e;
	}
	if (diffError) {
		console.error('differences detected in "' + testCase + '" case');
	}
	else {
		console.log('case "' + testCase + '" passed');
	}
}