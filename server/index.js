const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/contact', require('./routes/contact'));
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;

// Connect to PostgreSQL and sync models
sequelize.authenticate()
  .then(async () => {
    console.log('PostgreSQL connected successfully');
    
    // Sync all models (create tables)
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Server accessible at http://52.91.191.129:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
