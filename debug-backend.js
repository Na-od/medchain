/**
 * Debug backend connection and prescription creation
 */

async function debugBackend() {
  const API_URL = "http://localhost:5000";
  
  console.log("🔍 Debugging backend connection...");
  
  // 1. Check if backend is running
  try {
    const healthResponse = await fetch(`${API_URL}/health`);
    if (healthResponse.ok) {
      console.log("✅ Backend is running");
    } else {
      console.log("❌ Backend health check failed");
      return;
    }
  } catch (error) {
    console.log("❌ Backend is not running on http://localhost:5000");
    console.log("Please start the backend first: cd backend && npm run dev");
    return;
  }
  
  // 2. Try to login as doctor
  console.log("\n🔑 Testing doctor login...");
  try {
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "doctor@medchain.et",
        password: "demo1234"
      })
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log("✅ Doctor login successful");
      console.log(`   User ID: ${loginData.user?.id}`);
      console.log(`   Role: ${loginData.user?.role}`);
      console.log(`   Token: ${loginData.token?.substring(0, 50)}...`);
      
      // 3. Try to create prescription with the token
      console.log("\n📝 Testing prescription creation...");
      const prescriptionData = {
        patientId: "69f2114b9ade80e228655ee8", // Test patient ID
        drugs: [
          {
            name: "Amoxicillin 500mg",
            dosage: "1 capsule 3 times daily",
            frequency: "Three times daily",
            duration: "7 days"
          }
        ],
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        notes: "Test prescription"
      };
      
      const createResponse = await fetch(`${API_URL}/prescriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${loginData.token}`
        },
        body: JSON.stringify(prescriptionData)
      });
      
      console.log(`Status: ${createResponse.status}`);
      console.log(`Status Text: ${createResponse.statusText}`);
      
      const responseText = await createResponse.text();
      console.log(`Response: ${responseText}`);
      
      if (createResponse.ok) {
        console.log("✅ Prescription creation successful!");
      } else {
        console.log("❌ Prescription creation failed");
        try {
          const errorData = JSON.parse(responseText);
          console.log("Error details:", errorData);
        } catch {
          console.log("Raw error response:", responseText);
        }
      }
      
    } else {
      const error = await loginResponse.json();
      console.log("❌ Doctor login failed:", error);
    }
  } catch (error) {
    console.log("❌ Network error during login:", error.message);
  }
}

debugBackend();
