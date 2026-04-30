/**
 * Quick script to create test patients via API
 * Run: node create-patients.js
 */

const testPatients = [
  {
    name: "Selam Tadesse",
    email: "selam.tadesse@patient.et",
    password: "Patient123!",
    role: "patient",
    approved: true,
  },
  {
    name: "Bereket Mengistu", 
    email: "bereket.mengistu@patient.et",
    password: "Patient123!",
    role: "patient",
    approved: true,
  },
  {
    name: "Marta Kebede",
    email: "marta.kebede@patient.et", 
    password: "Patient123!",
    role: "patient",
    approved: true,
  },
  {
    name: "Abebe Bekele",
    email: "abebe.bekele@patient.et",
    password: "Patient123!", 
    role: "patient",
    approved: true,
  },
  {
    name: "Tigist Haile",
    email: "tigist.haile@patient.et",
    password: "Patient123!",
    role: "patient", 
    approved: true,
  }
];

async function createPatients() {
  const API_URL = "http://localhost:5000";
  
  console.log("🔄 Creating test patients via API...");
  
  for (const patient of testPatients) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patient)
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Created patient: ${patient.name}`);
        console.log(`   ID: ${data.user?.id || 'N/A'}`);
      } else {
        const error = await response.json();
        console.log(`❌ Failed to create ${patient.name}: ${error.error || error.message}`);
      }
    } catch (error) {
      console.log(`❌ Network error creating ${patient.name}: ${error.message}`);
    }
  }
  
  console.log("\n🎯 Test patients created! You can now use their IDs in the Doctor dashboard.");
  console.log("📝 All patients use password: Patient123!");
}

// Check if backend is running
async function checkBackend() {
  try {
    const response = await fetch("http://localhost:5000/health");
    if (response.ok) {
      console.log("✅ Backend is running");
      await createPatients();
    } else {
      console.log("❌ Backend health check failed");
    }
  } catch (error) {
    console.log("❌ Backend is not running on http://localhost:5000");
    console.log("Please start the backend first: cd backend && npm run dev");
  }
}

checkBackend();
