const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Resource = require('../models/Resource');
const Session = require('../models/Session');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Resource.deleteMany({});
    await Session.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create psychiatrists
    const psychiatrists = await User.create([
      {
        name: 'Dr. Maya Singh',
        email: 'maya.singh@mindcare.com',
        password: hashedPassword,
        role: 'psychiatrist',
        specialization: 'Anxiety Disorders',
        licenseNumber: 'PSY-2021-001',
        experience: 8,
        bio: 'Specialized in cognitive behavioral therapy and anxiety management. Passionate about helping patients overcome their fears and build confidence.',
        phone: '+1-555-0101',
        isActive: true
      },
      {
        name: 'Dr. Ali Tan',
        email: 'ali.tan@mindcare.com',
        password: hashedPassword,
        role: 'psychiatrist',
        specialization: 'Depression and Mood Disorders',
        licenseNumber: 'PSY-2021-002',
        experience: 12,
        bio: 'Expert in treating depression, bipolar disorder, and mood-related conditions. Believes in a holistic approach to mental health.',
        phone: '+1-555-0102',
        isActive: true
      },
      {
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@mindcare.com',
        password: hashedPassword,
        role: 'psychiatrist',
        specialization: 'Trauma and PTSD',
        licenseNumber: 'PSY-2021-003',
        experience: 15,
        bio: 'Specialized in trauma therapy and EMDR. Dedicated to helping survivors heal and rebuild their lives.',
        phone: '+1-555-0103',
        isActive: true
      }
    ]);

    // Create sample patients
    const patients = await User.create([
      {
        name: 'John Doe',
        email: 'john.doe@email.com',
        password: hashedPassword,
        role: 'patient',
        dateOfBirth: new Date('1990-05-15'),
        phone: '+1-555-0201',
        emergencyContact: {
          name: 'Jane Doe',
          phone: '+1-555-0202',
          relationship: 'Spouse'
        },
        isActive: true
      },
      {
        name: 'Alice Smith',
        email: 'alice.smith@email.com',
        password: hashedPassword,
        role: 'patient',
        dateOfBirth: new Date('1985-03-22'),
        phone: '+1-555-0203',
        emergencyContact: {
          name: 'Bob Smith',
          phone: '+1-555-0204',
          relationship: 'Partner'
        },
        isActive: true
      },
      {
        name: 'Mike Wilson',
        email: 'mike.wilson@email.com',
        password: hashedPassword,
        role: 'patient',
        dateOfBirth: new Date('1992-08-10'),
        phone: '+1-555-0205',
        emergencyContact: {
          name: 'Sarah Wilson',
          phone: '+1-555-0206',
          relationship: 'Sister'
        },
        isActive: true
      }
    ]);

    console.log('Created sample users');

    // Create sample resources
    const resources = await Resource.create([
      {
        title: 'Managing Anxiety: A Comprehensive Guide',
        description: 'Learn effective techniques to manage anxiety symptoms and improve your daily life.',
        link: 'https://example.com/anxiety-guide',
        type: 'guide',
        category: 'anxiety',
        author: psychiatrists[0]._id,
        tags: ['anxiety', 'coping', 'mindfulness'],
        difficulty: 'beginner',
        duration: 30,
        likes: 25,
        views: 150
      },
      {
        title: 'Mindfulness Meditation for Beginners',
        description: 'A 10-minute guided meditation to help you start your mindfulness journey.',
        link: 'https://example.com/meditation-video',
        type: 'video',
        category: 'mindfulness',
        author: psychiatrists[1]._id,
        tags: ['mindfulness', 'meditation', 'relaxation'],
        difficulty: 'beginner',
        duration: 10,
        likes: 42,
        views: 300
      },
      {
        title: 'Coping with Depression: Daily Strategies',
        description: 'Practical strategies and tools to help manage depression symptoms.',
        link: 'https://example.com/depression-article',
        type: 'article',
        category: 'depression',
        author: psychiatrists[1]._id,
        tags: ['depression', 'coping', 'self-care'],
        difficulty: 'intermediate',
        duration: 15,
        likes: 18,
        views: 85
      },
      {
        title: 'Self-Care Routine Builder',
        description: 'Interactive tool to help you create a personalized self-care routine.',
        link: 'https://example.com/self-care-tool',
        type: 'tool',
        category: 'self-care',
        author: psychiatrists[2]._id,
        tags: ['self-care', 'routine', 'wellness'],
        difficulty: 'beginner',
        duration: 20,
        likes: 36,
        views: 120
      },
      {
        title: 'Trauma Recovery: The Healing Journey',
        description: 'Understanding trauma and the path to recovery and healing.',
        link: 'https://example.com/trauma-podcast',
        type: 'podcast',
        category: 'general',
        author: psychiatrists[2]._id,
        tags: ['trauma', 'healing', 'recovery'],
        difficulty: 'intermediate',
        duration: 45,
        likes: 15,
        views: 60
      },
      {
        title: 'Stress Management Techniques',
        description: 'Learn evidence-based techniques to reduce and manage stress effectively.',
        link: 'https://example.com/stress-guide',
        type: 'guide',
        category: 'stress',
        author: psychiatrists[0]._id,
        tags: ['stress', 'management', 'techniques'],
        difficulty: 'beginner',
        duration: 25,
        likes: 31,
        views: 95
      }
    ]);

    console.log('Created sample resources');

    // Create sample sessions
    const currentDate = new Date();
    const futureDate1 = new Date(currentDate);
    futureDate1.setDate(currentDate.getDate() + 7);
    const futureDate2 = new Date(currentDate);
    futureDate2.setDate(currentDate.getDate() + 14);
    const futureDate3 = new Date(currentDate);
    futureDate3.setDate(currentDate.getDate() + 21);

    const sessions = await Session.create([
      {
        patient: patients[0]._id,
        psychiatrist: psychiatrists[0]._id,
        date: futureDate1,
        time: '10:00 AM',
        duration: 60,
        status: 'scheduled',
        sessionType: 'individual',
        notes: 'Initial consultation for anxiety management'
      },
      {
        patient: patients[0]._id,
        psychiatrist: psychiatrists[0]._id,
        date: futureDate2,
        time: '10:00 AM',
        duration: 60,
        status: 'scheduled',
        sessionType: 'individual',
        notes: 'Follow-up session'
      },
      {
        patient: patients[1]._id,
        psychiatrist: psychiatrists[1]._id,
        date: futureDate1,
        time: '2:00 PM',
        duration: 60,
        status: 'scheduled',
        sessionType: 'individual',
        notes: 'Depression therapy session'
      },
      {
        patient: patients[2]._id,
        psychiatrist: psychiatrists[2]._id,
        date: futureDate3,
        time: '11:00 AM',
        duration: 90,
        status: 'scheduled',
        sessionType: 'individual',
        notes: 'Trauma therapy session'
      },
      {
        patient: patients[1]._id,
        psychiatrist: psychiatrists[1]._id,
        date: new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        time: '2:00 PM',
        duration: 60,
        status: 'completed',
        sessionType: 'individual',
        notes: 'Patient showed good progress with coping strategies'
      }
    ]);

    console.log('Created sample sessions');

    console.log('Database seeded successfully!');
    console.log(`Created ${psychiatrists.length} psychiatrists`);
    console.log(`Created ${patients.length} patients`);
    console.log(`Created ${resources.length} resources`);
    console.log(`Created ${sessions.length} sessions`);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seeding script
seedData();
