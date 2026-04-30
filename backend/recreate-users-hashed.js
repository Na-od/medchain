/**
 * Delete existing users and recreate with hashed passwords
 * Run: node recreate-users-hashed.js
 */

import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';

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

async function recreateUsers() {
  console.log("🔄 Recreating users with hashed passwords...");
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  
  // First, delete all existing test users
  console.log("🗑️  Deleting existing users...");
  for (const user of testUsers) {
    try {
      await supabase
        .from('users')
        .delete()
        .eq('email', user.email);
      console.log(`   Deleted ${user.email}`);
    } catch (error) {
      console.log(`   No user ${user.email} to delete`);
    }
  }
  
  // Now create users with hashed passwords
  console.log("👥 Creating users with hashed passwords...");
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
        console.log(`❌ Failed to create ${user.email}: ${error.message}`);
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
  
  console.log("\n🎯 Users recreated! You can now login with:");
  console.log("📋 Doctor: doctor@medchain.et / demo1234");
  console.log("📋 Patient: selam.tadesse@patient.et / Patient123!");
  console.log("📋 Pharmacist: pharmacist@medchain.et / demo1234");
  console.log("📋 Admin: admin@medchain.et / admin123");
}

recreateUsers();
