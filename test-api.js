import axios from 'axios';

const testAPI = async () => {
  try {
    console.log('Testing backend API...');
    const response = await axios.get('http://localhost:5000/api/products');
    console.log('✅ Success:', response.data);
  } catch (error) {
    console.log('❌ Error:', error.message);
    if (error.response) {
      console.log('Response:', error.response.data);
    }
  }
};

testAPI();
