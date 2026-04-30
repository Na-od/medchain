/**
 * Create test patients for prescription testing
 * Run with: npx ts-node scripts/create-test-patients.ts
 */

import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Import after compilation
const { User } = await import("../src/models/User.js");
const { config } = await import("../src/config/index.js");

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

async function createTestPatients() {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(config.database.uri);
    console.log("✅ Connected to MongoDB");

    // Clear existing test patients
    await User.deleteMany({ role: "patient" });
    console.log("🗑️  Cleared existing test patients");

    // Hash passwords and create patients
    const patients = [];
    for (const patientData of testPatients) {
      const hashedPassword = await bcrypt.hash(patientData.password, 12);
      
      const patient = new User({
        ...patientData,
        password: hashedPassword,
      });
      
      await patient.save();
      patients.push({
        name: patient.name,
        email: patient.email,
        id: patient._id.toString(),
      });
    }

    console.log("✅ Created test patients:");
    patients.forEach((patient, index) => {
      console.log(`   ${index + 1}. ${patient.name} (${patient.email})`);
      console.log(`      ID: ${patient.id}`);
    });

    console.log("\n🎯 Use these Patient IDs in the Doctor dashboard:");
    patients.forEach((patient, index) => {
      console.log(`   ${index + 1}. ${patient.name}: ${patient.id}`);
    });

    console.log("\n📝 Login credentials for testing:");
    console.log("   Email: selam.tadesse@patient.et");
    console.log("   Password: Patient123!");
    console.log("   (Same password for all test patients)");

  } catch (error) {
    console.error("❌ Error creating test patients:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

// Run the script
createTestPatients();
