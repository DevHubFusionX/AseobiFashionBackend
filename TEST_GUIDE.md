# Image Upload Testing & Troubleshooting Guide

## Overview

A comprehensive test suite has been created to diagnose and verify image upload functionality. The test file performs 6 critical checks to identify issues.

---

## Quick Start

### Step 1: Install Dependencies

First, install all required packages in the backend directory:

```bash
cd backend
npm install
```

This will install:
- `p-limit` - For concurrency control
- `form-data` - For multipart form uploads in tests
- All other existing dependencies

### Step 2: Verify Environment Variables

Ensure your `.env` file in the backend directory contains:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Step 3: Start the Backend Server

In one terminal, start the development server:

```bash
npm run dev
```

Wait for the message: `Server running on port 5000`

### Step 4: Run the Test Suite

In another terminal, run the upload tests:

```bash
npm run test:upload
```

---

## What the Test Suite Checks

### Test 1: Environment Variables ✓
Verifies that all Cloudinary credentials are properly configured in `.env`

**If it fails:**
- Check that `.env` file exists in the backend directory
- Verify all three variables are set: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- Restart the server after updating `.env`

### Test 2: Dependencies Check ✓
Confirms all required npm packages are installed

**If it fails:**
- Run `npm install` in the backend directory
- Check for any error messages during installation
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

### Test 3: Test Image Creation ✓
Creates a minimal valid JPEG image for testing

**If it fails:**
- Check disk space availability
- Verify write permissions in the backend directory
- Check that the backend directory is not read-only

### Test 4: Single Image Upload ✓
Tests uploading a single image to Cloudinary

**If it fails:**
- Verify Cloudinary credentials are correct
- Check internet connectivity
- Ensure the backend server is running
- Look for specific error messages in the output

### Test 5: Multiple Image Upload ✓
Tests uploading multiple images with concurrency control

**If it fails:**
- Same checks as Test 4
- Verify `p-limit` is properly installed
- Check Cloudinary API rate limits

### Test 6: Server Connectivity ✓
Verifies the backend server is running and accessible

**If it fails:**
- Start the backend server: `npm run dev`
- Check that port 5000 is not in use
- Verify firewall settings allow localhost connections

---

## Expected Output

### Success Scenario

```
═══ TEST 1: Environment Variables ═══

✓ CLOUDINARY_CLOUD_NAME is set
✓ CLOUDINARY_API_KEY is set
✓ CLOUDINARY_API_SECRET is set

─────────────────────────────────────

═══ TEST 2: Dependencies Check ═══

✓ cloudinary is installed
✓ multer is installed
✓ p-limit is installed
✓ axios is installed
✓ form-data is installed

─────────────────────────────────────

═══ TEST 3: Creating Test Image ═══

✓ Test image created at: C:\Users\fanya\Desktop\Favour\backend\test-image.jpg
ℹ File size: 0.50 KB

─────────────────────────────────────

═══ TEST 4: Single Image Upload ═══

ℹ Uploading to: http://localhost:5000/api/upload
✓ Single image upload successful!
ℹ URL: https://res.cloudinary.com/...
ℹ Public ID: favour-products/...

─────────────────────────────────────

═══ TEST 5: Multiple Image Upload ═══

ℹ Uploading to: http://localhost:5000/api/upload/multiple
✓ Multiple image upload successful!
ℹ Uploaded 2 images
ℹ Image 1: https://res.cloudinary.com/...
ℹ Image 2: https://res.cloudinary.com/...

─────────────────────────────────────

═══ TEST SUMMARY ═══

ℹ Environment Variables: ✓
ℹ Server Connectivity: ✓
ℹ Single Upload: ✓
ℹ Multiple Upload: ✓

✓ All tests passed! Image upload is working correctly.
```

---

## Common Issues & Solutions

### Issue 1: "Cannot find package 'p-limit'"

**Solution:**
```bash
cd backend
npm install p-limit
```

### Issue 2: "Cannot connect to server"

**Solution:**
- Ensure backend is running: `npm run dev`
- Check if port 5000 is in use: `netstat -ano | findstr :5000`
- Kill the process if needed and restart

### Issue 3: "Cloudinary credentials missing"

**Solution:**
- Create/update `.env` file in backend directory
- Add your Cloudinary credentials
- Restart the server

### Issue 4: "Upload failed: Invalid credentials"

**Solution:**
- Verify credentials are correct in Cloudinary dashboard
- Check for typos in `.env` file
- Regenerate API key if needed

### Issue 5: "ECONNREFUSED" error

**Solution:**
- Backend server is not running
- Start it with: `npm run dev`
- Wait for "Server running on port 5000" message

---

## Frontend Testing

After backend tests pass, test the frontend upload components:

### Test Single Image Upload
1. Navigate to admin product creation page
2. Use the ImageUpload component
3. Drag and drop or click to select an image
4. Verify progress bar appears
5. Verify success toast notification

### Test Multiple Image Upload
1. Use the ImageUpload component with `multiple={true}`
2. Select 3-5 images
3. Verify concurrent upload with progress tracking
4. Verify all images upload successfully

### Test Color Variants
1. Navigate to product creation
2. Use ColorImageUpload component
3. Enter a color name
4. Upload an image for that color
5. Verify success notification

---

## Performance Verification

After successful uploads, verify performance improvements:

### Metrics to Check

1. **Upload Speed**
   - Single image: Should be 2-3 seconds
   - Multiple images (5): Should be 8-12 seconds total

2. **File Size Reduction**
   - Original file size vs uploaded file size
   - Should see 50-70% reduction due to compression

3. **Progress Tracking**
   - Progress bar should update smoothly
   - Percentage should reach 100% before completion

4. **Error Recovery**
   - Simulate network interruption
   - Verify automatic retry with exponential backoff
   - Should retry up to 3 times

---

## Debugging Tips

### Enable Verbose Logging

Add this to your backend `.env`:
```env
DEBUG=*
```

### Check Cloudinary Logs

1. Go to Cloudinary Dashboard
2. Navigate to Media Library
3. Check upload history and any errors

### Monitor Network Traffic

Use browser DevTools (F12):
1. Open Network tab
2. Perform upload
3. Check request/response headers and body
4. Verify Content-Type is `multipart/form-data`

### Check Backend Logs

Watch the terminal where `npm run dev` is running:
- Look for upload errors
- Check Cloudinary API responses
- Verify concurrency limiting is working

---

## Next Steps

Once all tests pass:

1. **Deploy to Production**
   - Ensure environment variables are set on production server
   - Test with production Cloudinary account
   - Monitor upload performance

2. **Monitor Performance**
   - Track upload times
   - Monitor Cloudinary API usage
   - Check error rates

3. **Optimize Further**
   - Adjust concurrency limits if needed
   - Fine-tune compression settings
   - Consider CDN caching strategies

---

## Support

If tests still fail after following this guide:

1. Check all error messages carefully
2. Verify each prerequisite is met
3. Review the specific test that's failing
4. Check Cloudinary dashboard for account issues
5. Verify network connectivity and firewall settings
