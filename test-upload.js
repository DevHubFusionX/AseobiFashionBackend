import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';

// Color codes for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

const log = {
    info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
    success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
    error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
    warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
    section: (msg) => console.log(`\n${colors.bright}${colors.cyan}═══ ${msg} ═══${colors.reset}\n`),
    divider: () => console.log(`${colors.cyan}${'─'.repeat(50)}${colors.reset}`)
};

// Test 1: Check environment variables
const testEnvironmentVariables = () => {
    log.section('TEST 1: Environment Variables');
    
    const requiredVars = [
        'CLOUDINARY_CLOUD_NAME',
        'CLOUDINARY_API_KEY',
        'CLOUDINARY_API_SECRET'
    ];

    let allPresent = true;
    requiredVars.forEach(varName => {
        const value = process.env[varName];
        if (value) {
            log.success(`${varName} is set`);
        } else {
            log.error(`${varName} is missing`);
            allPresent = false;
        }
    });

    if (!allPresent) {
        log.warn('Some environment variables are missing. Check your .env file.');
    }

    return allPresent;
};

// Test 2: Check dependencies
const testDependencies = async () => {
    log.section('TEST 2: Dependencies Check');

    const dependencies = [
        { name: 'cloudinary', import: () => import('cloudinary') },
        { name: 'multer', import: () => import('multer') },
        { name: 'p-limit', import: () => import('p-limit') },
        { name: 'axios', import: () => import('axios') },
        { name: 'form-data', import: () => import('form-data') }
    ];

    for (const dep of dependencies) {
        try {
            await dep.import();
            log.success(`${dep.name} is installed`);
        } catch (error) {
            log.error(`${dep.name} is NOT installed`);
        }
    }
};

// Test 3: Create a test image
const createTestImage = () => {
    log.section('TEST 3: Creating Test Image');

    const testImagePath = path.join(process.cwd(), 'test-image.jpg');

    // Create a simple 100x100 JPEG buffer (minimal valid JPEG)
    const jpegBuffer = Buffer.from([
        0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
        0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
        0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
        0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
        0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
        0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
        0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x0B, 0x08, 0x00, 0x01,
        0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xFF, 0xC4, 0x00, 0x1F, 0x00, 0x00,
        0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
        0x09, 0x0A, 0x0B, 0xFF, 0xC4, 0x00, 0xB5, 0x10, 0x00, 0x02, 0x01, 0x03,
        0x03, 0x02, 0x04, 0x03, 0x05, 0x05, 0x04, 0x04, 0x00, 0x00, 0x01, 0x7D,
        0x01, 0x02, 0x03, 0x00, 0x04, 0x11, 0x05, 0x12, 0x21, 0x31, 0x41, 0x06,
        0x13, 0x51, 0x61, 0x07, 0x22, 0x71, 0x14, 0x32, 0x81, 0x91, 0xA1, 0x08,
        0x23, 0x42, 0xB1, 0xC1, 0x15, 0x52, 0xD1, 0xF0, 0x24, 0x33, 0x62, 0x72,
        0x82, 0x09, 0x0A, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x25, 0x26, 0x27, 0x28,
        0x29, 0x2A, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A, 0x43, 0x44, 0x45,
        0x46, 0x47, 0x48, 0x49, 0x4A, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59,
        0x5A, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6A, 0x73, 0x74, 0x75,
        0x76, 0x77, 0x78, 0x79, 0x7A, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89,
        0x8A, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9A, 0xA2, 0xA3,
        0xA4, 0xA5, 0xA6, 0xA7, 0xA8, 0xA9, 0xAA, 0xB2, 0xB3, 0xB4, 0xB5, 0xB6,
        0xB7, 0xB8, 0xB9, 0xBA, 0xC2, 0xC3, 0xC4, 0xC5, 0xC6, 0xC7, 0xC8, 0xC9,
        0xCA, 0xD2, 0xD3, 0xD4, 0xD5, 0xD6, 0xD7, 0xD8, 0xD9, 0xDA, 0xE1, 0xE2,
        0xE3, 0xE4, 0xE5, 0xE6, 0xE7, 0xE8, 0xE9, 0xEA, 0xF1, 0xF2, 0xF3, 0xF4,
        0xF5, 0xF6, 0xF7, 0xF8, 0xF9, 0xFA, 0xFF, 0xDA, 0x00, 0x08, 0x01, 0x01,
        0x00, 0x00, 0x3F, 0x00, 0xFB, 0xD3, 0xFF, 0xD9
    ]);

    try {
        fs.writeFileSync(testImagePath, jpegBuffer);
        log.success(`Test image created at: ${testImagePath}`);
        log.info(`File size: ${(jpegBuffer.length / 1024).toFixed(2)} KB`);
        return testImagePath;
    } catch (error) {
        log.error(`Failed to create test image: ${error.message}`);
        return null;
    }
};

// Test 4: Test single image upload
const testSingleUpload = async (imagePath) => {
    log.section('TEST 4: Single Image Upload');

    if (!imagePath || !fs.existsSync(imagePath)) {
        log.error('Test image not found');
        return false;
    }

    try {
        const form = new FormData();
        form.append('image', fs.createReadStream(imagePath));

        log.info(`Uploading to: ${API_BASE_URL}/upload`);
        
        const response = await axios.post(`${API_BASE_URL}/upload`, form, {
            headers: form.getHeaders(),
            timeout: 30000
        });

        if (response.data.success) {
            log.success('Single image upload successful!');
            log.info(`URL: ${response.data.url}`);
            log.info(`Public ID: ${response.data.publicId}`);
            return true;
        } else {
            log.error(`Upload failed: ${response.data.message}`);
            return false;
        }
    } catch (error) {
        log.error(`Upload error: ${error.message}`);
        if (error.response?.data) {
            log.error(`Response: ${JSON.stringify(error.response.data, null, 2)}`);
        }
        return false;
    }
};

// Test 5: Test multiple image upload
const testMultipleUpload = async (imagePath) => {
    log.section('TEST 5: Multiple Image Upload');

    if (!imagePath || !fs.existsSync(imagePath)) {
        log.error('Test image not found');
        return false;
    }

    try {
        const form = new FormData();
        form.append('images', fs.createReadStream(imagePath));
        form.append('images', fs.createReadStream(imagePath));

        log.info(`Uploading to: ${API_BASE_URL}/upload/multiple`);
        
        const response = await axios.post(`${API_BASE_URL}/upload/multiple`, form, {
            headers: form.getHeaders(),
            timeout: 30000
        });

        if (response.data.success) {
            log.success('Multiple image upload successful!');
            log.info(`Uploaded ${response.data.images.length} images`);
            response.data.images.forEach((img, idx) => {
                log.info(`Image ${idx + 1}: ${img.url}`);
            });
            return true;
        } else {
            log.error(`Upload failed: ${response.data.message}`);
            return false;
        }
    } catch (error) {
        log.error(`Upload error: ${error.message}`);
        if (error.response?.data) {
            log.error(`Response: ${JSON.stringify(error.response.data, null, 2)}`);
        }
        return false;
    }
};

// Test 6: Check server connectivity
const testServerConnectivity = async () => {
    log.section('TEST 6: Server Connectivity');

    try {
        log.info(`Checking server at: ${API_BASE_URL}`);
        const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/`, {
            timeout: 5000
        });
        log.success('Server is reachable');
        return true;
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            log.error('Cannot connect to server. Is it running?');
            log.warn('Start the backend with: npm run dev');
        } else {
            log.error(`Connection error: ${error.message}`);
        }
        return false;
    }
};

// Main test runner
const runTests = async () => {
    console.clear();
    log.section('IMAGE UPLOAD TEST SUITE');
    log.info(`API Base URL: ${API_BASE_URL}`);
    log.divider();

    // Run tests
    const envOk = testEnvironmentVariables();
    log.divider();

    await testDependencies();
    log.divider();

    const imagePath = createTestImage();
    log.divider();

    const serverOk = await testServerConnectivity();
    log.divider();

    if (!serverOk) {
        log.error('Server is not running. Cannot proceed with upload tests.');
        log.warn('Please start the backend server first: npm run dev');
        process.exit(1);
    }

    if (!envOk) {
        log.error('Environment variables are missing. Cannot proceed with upload tests.');
        log.warn('Please configure your .env file with Cloudinary credentials.');
        process.exit(1);
    }

    if (imagePath) {
        const singleOk = await testSingleUpload(imagePath);
        log.divider();

        const multipleOk = await testMultipleUpload(imagePath);
        log.divider();

        // Cleanup
        try {
            fs.unlinkSync(imagePath);
            log.info('Test image cleaned up');
        } catch (e) {
            // Ignore cleanup errors
        }

        // Summary
        log.section('TEST SUMMARY');
        log.info(`Environment Variables: ${envOk ? '✓' : '✗'}`);
        log.info(`Server Connectivity: ${serverOk ? '✓' : '✗'}`);
        log.info(`Single Upload: ${singleOk ? '✓' : '✗'}`);
        log.info(`Multiple Upload: ${multipleOk ? '✓' : '✗'}`);

        if (singleOk && multipleOk) {
            log.success('All tests passed! Image upload is working correctly.');
            process.exit(0);
        } else {
            log.error('Some tests failed. Check the errors above.');
            process.exit(1);
        }
    }
};

// Run the tests
runTests().catch(error => {
    log.error(`Fatal error: ${error.message}`);
    console.error(error);
    process.exit(1);
});
