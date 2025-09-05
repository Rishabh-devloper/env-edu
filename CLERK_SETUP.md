# Clerk Authentication Setup

## Getting Started with Clerk

To enable authentication in your EcoLearning app, you need to set up a Clerk account and configure the environment variables.

### 1. Create a Clerk Account

1. Go to [clerk.com](https://clerk.com) and sign up for a free account
2. Create a new application
3. Choose "Next.js" as your framework

### 2. Get Your API Keys

1. In your Clerk dashboard, go to "API Keys"
2. Copy your "Publishable key" and "Secret key"

### 3. Update Environment Variables

1. Open the `.env.local` file in your project root
2. Replace the placeholder values with your actual Clerk keys:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### 4. Configure Clerk Settings

In your Clerk dashboard:

1. Go to "User & Authentication" → "Email, Phone, Username"
2. Enable the authentication methods you want (email, username, etc.)
3. Go to "User & Authentication" → "Social Connections"
4. Enable any social providers you want (Google, GitHub, etc.)

### 5. Test the Authentication

1. Start your development server: `npm run dev`
2. Visit `http://localhost:3000`
3. Click "Get Started" to test the sign-up flow
4. Click "Sign In" to test the sign-in flow

## Features Included

- ✅ Modal-based sign-in/sign-up
- ✅ User profile management
- ✅ Protected routes (dashboard)
- ✅ Personalized welcome messages
- ✅ Responsive design
- ✅ Custom styling to match your brand

## Next Steps

- Customize the sign-in/sign-up forms in Clerk dashboard
- Add more protected routes as needed
- Implement user-specific data storage
- Add role-based access control if needed
