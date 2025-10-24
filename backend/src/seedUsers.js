const bcrypt = require('bcryptjs');
const { sequelize } = require('./models');
const User = require('./models/User');

async function seedUsers() {
  try {
    // Sync database (alter: true will add new columns)
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully');

    // Check if users already exist
    const count = await User.count();
    if (count > 0) {
      console.log(`Database already has ${count} users. Updating existing users with default password...`);

      // Update all users without passwords
      const users = await User.findAll();
      const defaultPassword = await bcrypt.hash('password123', 10);

      for (const user of users) {
        if (!user.password) {
          await user.update({
            password: defaultPassword,
            approvalStatus: 'approved'
          });
          console.log(`Updated user: ${user.email} with default password`);
        }
      }

      console.log('All existing users updated!');
      return;
    }

    // Create sample users
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

    await User.bulkCreate(sampleUsers);
    console.log('Sample users created successfully!');
    console.log('\nLogin credentials:');
    console.log('1. Admin - admin@example.com / admin123');
    console.log('2. Manager - manager@example.com / manager123');
    console.log('3. Viewer - viewer@example.com / viewer123 (read-only)');
    console.log('4. Developer - developer@example.com / dev123');
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await sequelize.close();
  }
}

seedUsers();
