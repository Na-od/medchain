/**
 * Simple test to check backend response
 */

async function testBackend() {
  console.log("Testing backend connection...");
  
  try {
    // Test basic connection
    const response = await fetch("http://localhost:5000");
    console.log("Backend response:", response.status, response.statusText);
    
    const text = await response.text();
    console.log("Response body:", text);
    
  } catch (error) {
    console.log("Error connecting to backend:", error.message);
  }
}

testBackend();
