const express =require('express');
const app =express();
const port=3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true}));



//Exercice 1
//middleware de journalisation
const loggerMiddleware = (req, res, next) => {
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    console.log(`[${date} ${time}] ${req.method} ${res.path}`);

    next();
};
//utiliser middleware dans l'application
app.use(loggerMiddleware);



//Exercice 2
const validatePostFields = (req, res, next) => {
    const { username, password } = req.body;
 
    if (!username || !password) {
      return res.status(400).send('Erreur: Les champs username et password sont requis.');
    }
    next();
  };
  
  module.exports = validatePostFields;


//Exercice 3
const validateAge = (req, res, next) => {
    const { age } = req.body;
  
    if (age !== undefined && age < 0) {
      const error = new Error("L'âge ne peut pas être négatif.");
      error.status = 400;
      return next(error);
    }
    next();
  };


//Exercice 4
// 2. Middleware pour valider les données du produit
const validateProductData = (req, res, next) => {
  const { name, price } = req.body;

  // Validation du champ name
  if (!name || typeof name !== 'string' || name.trim() === '') {
    const error = new Error('Le champ name est requis, doit être une chaîne de caractères non vide.');
    error.status = 400;
    return next(error);
  }

  // Validation du champ price
  if (price === undefined || typeof price !== 'number' || price <= 0) {
    const error = new Error('Le champ price est requis et doit être un nombre positif.');
    error.status = 400;
    return next(error);
  }

  // Passer au middleware suivant si tout est valide
  next();
};

// 3. Middleware de gestion des erreurs
const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message || 'Une erreur inconnue est survenue.',
  });
};

// 4. Route pour ajouter un produit
app.post('/add-product', validateProductData, (req, res) => {
  const { name, price } = req.body;
  res.status(201).json({
    message: 'Produit ajouté avec succès!',
    product: { name, price },
  });
});

// 3. Utilisation du middleware de gestion des erreurs
app.use(errorHandler);






app.listen(port, () =>{
    console.log(`Application exemple à l'ecoute sur le port 3000 ${port}`)
});