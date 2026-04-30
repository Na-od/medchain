/**
 * Create test users in Supabase
 * Run: node create-supabase-users.js
 */

import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';

// Your Supabase credentials - UPDATE THESE
// Your Supabase credentials
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const testUsers = [
  {
    name: "Dr. Hanna Bekele",
    email: "doctor@medchain.et",
    password: "demo1234",
    role: "doctor",
    approved: true,
  },
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
    name: "Dr. Alem Kassa",
    email: "pharmacist@medchain.et",
    password: "demo1234",
    role: "pharmacist",
    approved: true,
  },
  {
    name: "Admin User",
    email: "admin@medchain.et",
    password: "admin123",
    role: "admin",
    approved: true,
  },
];

async function createUsers() {
  console.log("🔄 Creating test users in Supabase...");
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  
  for (const user of testUsers) {
    try {
      // Hash the password before storing
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      const { data, error } = await supabase
        .from('users')
        .insert({
          ...user,
          password: hashedPassword
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          console.log(`⚠️  User ${user.email} already exists`);
        } else {
          console.log(`❌ Failed to create ${user.email}: ${error.message}`);
        }
      } else {
        console.log(`✅ Created user: ${user.name}`);
        console.log(`   ID: ${data.id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
      }
    } catch (error) {
      console.log(`❌ Error creating ${user.email}: ${error.message}`);
    }
  }
  
  console.log("\n🎯 Test users created! You can now login with:");
  console.log("📋 Doctor: doctor@medchain.et / demo1234");
  console.log("📋 Patient: selam.tadesse@patient.et / Patient123!");
  console.log("📋 Pharmacist: pharmacist@medchain.et / demo1234");
  console.log("📋 Admin: admin@medchain.et / admin123");
}

createUsers();
