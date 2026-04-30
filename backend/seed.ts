import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

// Load env
dotenv.config();

// Direct import of User model logic since we are in a standalone script
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: { type: String, select: false },
  role: String,
  license: String,
  patientCode: { type: String, unique: true, sparse: true },
  approved: Boolean,
  walletAddress: String,
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log("Connected!");

  const saltRounds = 12;
  const password = await bcrypt.hash("demo1234", saltRounds);

  const users = [
    {
      name: "Dr. Hanna Bekele",
      email: "doctor@medchain.et",
      password,
      role: "doctor",
      license: "ETH-MED-12345",
      approved: true,
    },
    {
      name: "Selam Tadesse",
      email: "patient@medchain.et",
      password,
      role: "patient",
      patientCode: "ETP-1001",
      approved: true,
    },
    {
      name: "Bereket Mengistu",
      email: "patient2@medchain.et",
      password,
      role: "patient",
      patientCode: "ETP-1002",
      approved: true,
    },
    {
      name: "Kena Pharmacy",
      email: "pharmacy@medchain.et",
      password,
      role: "pharmacist",
      license: "ETH-PHM-67890",
      approved: true,
    },
    {
      name: "Admin User",
      email: "admin@medchain.et",
      password,
      role: "admin",
      approved: true,
    }
  ];

  console.log("Clearing existing users...");
  await User.deleteMany({});

  console.log("Seeding users...");
  await User.insertMany(users);
  
  console.log("Seed complete! Demo accounts:");
  console.log("  Doctor:     doctor@medchain.et    / demo1234");
  console.log("  Patient 1:  patient@medchain.et   / demo1234  (ETP-1001)");
  console.log("  Patient 2:  patient2@medchain.et  / demo1234  (ETP-1002)");
  console.log("  Pharmacist: pharmacy@medchain.et  / demo1234");
  console.log("  Admin:      admin@medchain.et     / demo1234");
  process.exit(0);
}

seed().catch(console.error);
