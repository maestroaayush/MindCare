// Script to clear any cached user data and test authentication
console.log('🔍 Checking current localStorage...');

// Check what's in localStorage
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));

// Clear any cached data
console.log('🧹 Clearing localStorage...');
localStorage.clear();

console.log('✅ localStorage cleared!');
console.log('Please refresh the page and login again to test.');
