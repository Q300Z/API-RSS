const mongoose = require('mongoose');

const db = 'API' // remplacer avec le nom de votre base de données
const uri = `mongodb://localhost:27017/${db}`; // remplacer avec l'URI de votre base de données MongoDB

async function connectDB() {
  try {
    await mongoose.connect(uri,{
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    console.log('Connexion à la base de données réussie');
  } catch (error) {
    console.error('Erreur de connexion à la base de données :', error);
  }
}

module.exports = connectDB;
