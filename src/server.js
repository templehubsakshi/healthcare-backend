const env = require('./config/env');
const app = require('./app');
const { sequelize } = require('./models');

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Database connected');

    app.listen(env.port, () => console.log(`Server running on port ${env.port}`));
  } catch (err) {
    console.error('Could not start server:', err.message);
    process.exit(1);
  }
};

start();
