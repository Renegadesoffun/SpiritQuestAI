console.log('Test script running...');

// Test file system
import fs from 'fs';
import path from 'path';

try {
    console.log('Current directory:', process.cwd());
    console.log('Directory contents:', fs.readdirSync('.'));
    
    // Try to create a test file
    fs.writeFileSync('test.txt', 'Hello World');
    console.log('Successfully wrote test.txt');
    
    // Read it back
    const content = fs.readFileSync('test.txt', 'utf8');
    console.log('File content:', content);
    
    // Clean up
    fs.unlinkSync('test.txt');
    console.log('Successfully cleaned up test file');
} catch (error) {
    console.error('Error:', error);
}

console.log('Test complete'); 