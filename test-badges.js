const https = require('http');

async function testBadgeAPI() {
  try {
    console.log('Testing badge API...');
    
    // Test the basic badge API endpoint
    const response = await fetch('http://localhost:3000/api/badges?action=all');
    const data = await response.json();
    
    console.log('Badge API Response:', {
      status: response.status,
      ok: response.ok,
      dataKeys: Object.keys(data),
      success: data.success,
      badgeCount: data.badges?.length || 0
    });
    
    if (data.badges?.length > 0) {
      console.log('Sample badge:', data.badges[0]);
    }
    
  } catch (error) {
    console.error('Error testing badge API:', error.message);
  }
}

async function seedDatabase() {
  try {
    console.log('Attempting to seed database...');
    
    const response = await fetch('http://localhost:3000/api/seed', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer seed-token',
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    console.log('Seed API Response:', {
      status: response.status,
      ok: response.ok,
      data: data
    });
    
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
}

async function main() {
  await testBadgeAPI();
  await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
  await seedDatabase();
  await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second  
  await testBadgeAPI(); // Test again after seeding
}

main().catch(console.error);
