const bcrypt = require('bcryptjs');
const { sequelize } = require('./models');
const User = require('./models/User');

async function createAdminUsers() {
  try {
    await sequelize.sync();
    console.log('Database connected');

    // Create sample users with different roles
    const sampleUsers = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'Admin',
        department: 'IT',
        status: 'active',
        approvalStatus: 'approved'
      },
      {
        name: 'Manager User',
        email: 'manager@example.com',
        password: await bcrypt.hash('manager123', 10),
        role: 'Manager',
        department: 'Sales',
        status: 'active',
        approvalStatus: 'approved'
      },
      {
        name: 'Viewer User',
        email: 'viewer@example.com',
        password: await bcrypt.hash('viewer123', 10),
        role: 'Viewer',
        department: 'Finance',
        status: 'active',
        approvalStatus: 'approved'
      },
      {
        name: 'Developer User',
        email: 'developer@example.com',
        password: await bcrypt.hash('dev123', 10),
        role: 'Developer',
        department: 'IT',
        status: 'active',
        approvalStatus: 'approved'
      }
    ];

    for (const userData of sampleUsers) {
      const existing = await User.findOne({ where: { email: userData.email } });
      if (existing) {
        console.log(`User ${userData.email} already exists`);
      } else {
        await User.create(userData);
        console.log(`Created user: ${userData.email}`);
      }
    }

    console.log('\n=== Login Credentials ===');
    console.log('1. Admin - admin@example.com / admin123 (Full access)');
    console.log('2. Manager - manager@example.com / manager123 (Can edit, no delete)');
    console.log('3. Viewer - viewer@example.com / viewer123 (Read-only)');
    console.log('4. Developer - developer@example.com / dev123 (Can edit, no delete)');
  } catch (error) {
    console.error('Error creating admin users:', error);
  } finally {
    await sequelize.close();
  }
}

createAdminUsers();
