const { Sequelize } = require('sequelize');

async function initializeDatabase() {
  try {
    // Connect to postgres database to create our app database
    const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/postgres');
    
    await sequelize.query('CREATE DATABASE mindcare;');
    console.log('Database created successfully');
    
  } catch (error) {
    if (error.message.includes('database "mindcare" already exists')) {
      console.log('Database already exists');
    } else {
      console.error('Error creating database:', error);
    }
  } finally {
    process.exit(0);
  }
}

initializeDatabase();
