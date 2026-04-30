/**
 * Create test doctor account
 */

async function createDoctor() {
  const API_URL = "http://localhost:5000";
  
  const doctor = {
    name: "Dr. Hanna Bekele",
    email: "doctor@medchain.et",
    password: "demo1234",
    role: "doctor",
    approved: true,
  };
  
  console.log("🔄 Creating doctor account...");
  
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(doctor)
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Created doctor: ${doctor.name}`);
      console.log(`   ID: ${data.user?.id || 'N/A'}`);
      console.log(`   Email: ${doctor.email}`);
      console.log(`   Password: ${doctor.password}`);
    } else {
      const error = await response.json();
      console.log(`❌ Failed to create doctor: ${error.error || error.message}`);
      
      // If doctor already exists, try to login and get token
      if (error.error?.includes("already exists")) {
        console.log("🔄 Doctor already exists, trying to login...");
        
        const loginResponse = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: doctor.email,
            password: doctor.password
          })
        });
        
        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          console.log(`✅ Doctor login successful`);
          console.log(`   Token: ${loginData.token?.substring(0, 50)}...`);
        } else {
          console.log(`❌ Doctor login failed`);
        }
      }
    }
  } catch (error) {
    console.log(`❌ Network error: ${error.message}`);
  }
}

createDoctor();
