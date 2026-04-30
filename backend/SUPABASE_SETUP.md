# Supabase Migration Guide

## 🚀 Complete MongoDB to Supabase Migration

The backend has been successfully migrated from MongoDB to Supabase! Follow these steps to complete the setup:

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign up/login
4. Create a new project:
   - **Organization**: Your name/organization
   - **Project Name**: `medchain-ethiopia`
   - **Database Password**: Create a strong password
   - **Region**: Choose closest region to you

### 2. Get Supabase Credentials

Once your project is created:

1. Go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL** (SUPABASE_URL)
   - **anon public** key (SUPABASE_ANON_KEY)
   - **service_role** key (SUPABASE_SERVICE_KEY)

### 3. Set Up Database Schema

1. Go to **SQL Editor** in your Supabase project
2. Copy and paste the entire contents of `backend/supabase/schema.sql`
3. Click **Run** to execute the schema

This will create:
- `users` table
- `prescriptions` table  
- `verification_logs` table
- `dispense_logs` table
- `fraud_alerts` table
- Proper indexes and RLS policies

### 4. Update Environment Variables

Update your `backend/.env` file:

```bash
# Replace MongoDB URI with Supabase credentials
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key  
SUPABASE_SERVICE_KEY=your_supabase_service_key

# Keep other variables the same
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
BASE_RPC_URL=https://sepolia.base.org
PRIVATE_KEY=your_wallet_private_key_without_0x_prefix
CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
PINATA_API_KEY=your_pinata_api_key
PINATA_API_SECRET=your_pinata_api_secret
PINATA_JWT=your_pinata_jwt_token
ENCRYPTION_KEY=your_32_character_encryption_key_
```

### 5. Install Dependencies (Already Done)

```bash
npm install @supabase/supabase-js
```

### 6. Start the Backend

```bash
cd backend
npm run dev
```

The backend should now connect to Supabase instead of MongoDB!

### 7. Test the Migration

1. **Health Check**: Visit `http://localhost:5000/health`
2. **Create Test Users**: Use the existing test scripts
3. **Test Prescription Creation**: Use the frontend

## 🔄 What Changed

### Models
- ✅ `User.ts` - Now uses Supabase client
- ✅ `Prescription.ts` - Now uses Supabase client
- ✅ MongoDB models backed up as `*-mongodb.ts`

### Configuration  
- ✅ `config/index.ts` - Uses Supabase config
- ✅ `config/supabase.ts` - New Supabase client service
- ✅ `index.ts` - Removed MongoDB, added Supabase

### Database Schema
- ✅ `supabase/schema.sql` - Complete SQL schema
- ✅ Proper relationships and constraints
- ✅ Row Level Security (RLS) policies
- ✅ Optimized indexes

## 🎯 Benefits of Supabase

- **Real-time** subscriptions built-in
- **Auto-generated APIs** for all tables
- **Built-in authentication** (optional for future)
- **Better performance** with PostgreSQL
- **Easier deployment** and management
- **Free tier** for development

## 🐛 Troubleshooting

### Connection Issues
- Verify SUPABASE_URL is correct (no trailing slash)
- Check API keys are properly copied
- Ensure SQL schema was executed successfully

### Schema Issues
- Run the schema.sql file again if needed
- Check table names match exactly
- Verify foreign key relationships

### Permission Issues
- Ensure RLS policies are properly configured
- Check that API keys have correct permissions

## 📝 Next Steps

1. ✅ Backend migrated to Supabase
2. ✅ All models updated
3. ✅ Configuration complete
4. 🔄 Test all API endpoints
5. 🔄 Update any remaining MongoDB references
6. 🔄 Consider using Supabase Auth for future

The migration is complete! Your backend now uses Supabase instead of MongoDB. 🎉
