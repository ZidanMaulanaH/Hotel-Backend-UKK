const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('ukk_hotel', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

const db = {};
const basename = path.basename(__filename);

console.log('Current directory:', __dirname); // Log the current directory

// Read files from the models folder
fs.readdirSync(__dirname)
  .filter(file => {
    console.log('Checking file:', file); // Log each file being checked
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    console.log('Requiring model file:', file); // Log each file being required
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Check Sequelize associations (if any)
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;