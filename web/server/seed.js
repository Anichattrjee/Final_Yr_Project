const mongoose = require('mongoose');
const User = require('./models/User');
const Election = require('./models/Election');
const dotenv = require('dotenv');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Election.deleteMany({});

    // Create admin user
    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      voterID: 'ADMIN001',
      role: 'admin'
    });

    // Create candidates
    const candidates = await User.create([
      {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password123',
        voterID: 'CAND001',
        role: 'candidate',
        candidateInfo: {
          party: 'Progressive Party',
          position: 'Governor',
          constituency: 'State A',
          approved: true
        }
      },
      {
        username: 'jane_smith',
        email: 'jane@example.com',
        password: 'password123',
        voterID: 'CAND002',
        role: 'candidate',
        candidateInfo: {
          party: 'Conservative Party',
          position: 'Governor',
          constituency: 'State A',
          approved: true
        }
      }
    ]);

    // Create voters
    const voters = await User.create([
      {
        username: 'voter1',
        email: 'voter1@example.com',
        password: 'voter123',
        voterID: 'VOTER001',
        role: 'voter'
      },
      {
        username: 'voter2',
        email: 'voter2@example.com',
        password: 'voter123',
        voterID: 'VOTER002',
        role: 'voter'
      }
    ]);

    // Create election
    const election = await Election.create({
      title: 'State A Gubernatorial Election 2025',
      description: 'Election for the next governor of State A',
      constituency: 'State A',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-01-02'),
      candidates: candidates.map(c => c._id),
      status: 'upcoming'
    });

    console.log('Seed data created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();