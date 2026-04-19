// ============================================================
//   API BANCAIRE — Système de Transactions Bancaires
//   Devoir 304
// ============================================================

const express = require('express');
const app = express();

// Permet à Express de lire le JSON envoyé dans les requêtes
app.use(express.json());

// ============================================================
// BASE DE DONNÉES TEMPORAIRE (stockée en mémoire)
// C'est un tableau qui contient tous nos comptes bancaires
// ============================================================
let comptes = [];
let prochainId = 1; // Compteur pour générer les IDs automatiquement


// ============================================================
// ROUTE 1 : Créer un nouveau compte bancaire
// Méthode : POST
// URL     : http://localhost:3000/api/comptes
// ============================================================
app.post('/api/comptes', (req, res) => {

  const { titulaire, soldeInitial } = req.body;

  // Vérification : le nom du titulaire est obligatoire
  if (!titulaire) {
    return res.status(400).json({
      erreur: "Le nom du titulaire est obligatoire."
    });
  }

  // Vérification : le solde initial ne peut pas être négatif
  if (soldeInitial < 0) {
    return res.status(400).json({
      erreur: "Le solde initial ne peut pas être négatif."
    });
  }

  // Création du nouveau compte
  const nouveauCompte = {
    id: prochainId++,
    titulaire: titulaire,
    solde: soldeInitial || 0,
    dateCreation: new Date().toLocaleString('fr-FR')
  };

  // On ajoute le compte dans notre tableau
  comptes.push(nouveauCompte);

  // On retourne le compte créé avec le code 201 (= créé avec succès)
  return res.status(201).json(nouveauCompte);
});


// ============================================================
// ROUTE 2 : Obtenir la liste de tous les comptes
// Méthode : GET
// URL     : http://localhost:3000/api/comptes
// ============================================================
app.get('/api/comptes', (req, res) => {

  // Si aucun compte n'existe encore
  if (comptes.length === 0) {
    return res.status(200).json({
      message: "Aucun compte bancaire enregistré pour l'instant.",
      comptes: []
    });
  }

  // On retourne la liste complète des comptes
  return res.status(200).json(comptes);
});


// ============================================================
// ROUTE 3 : Voir le détail d'un compte précis
// Méthode : GET
// URL     : http://localhost:3000/api/comptes/:id
// ============================================================
app.get('/api/comptes/:id', (req, res) => {

  const id = parseInt(req.params.id);
  const compte = comptes.find(c => c.id === id);

  // Si le compte n'existe pas
  if (!compte) {
    return res.status(404).json({
      erreur: "Compte introuvable. Vérifiez l'identifiant."
    });
  }

  return res.status(200).json({
  id: compte.id,
  titulaire: compte.titulaire,
  solde: `${compte.solde} FCFA`,
  dateCreation: compte.dateCreation,
  historique: compte.historique
   });
});


// ============================================================
// ROUTE 4 : Effectuer un dépôt sur un compte
// Méthode : POST
// URL     : http://localhost:3000/api/comptes/:id/depot
// ============================================================
app.post('/api/comptes/:id/depot', (req, res) => {

  const id = parseInt(req.params.id);
  const { montant } = req.body;
  const compte = comptes.find(c => c.id === id);

  // Si le compte n'existe pas
  if (!compte) {
    return res.status(404).json({
      erreur: "Compte introuvable. Vérifiez l'identifiant."
    });
  }

  // Le montant doit être positif
  if (!montant || montant <= 0) {
    return res.status(400).json({
      erreur: "Le montant du dépôt doit être supérieur à zéro."
    });
  }

  // On ajoute le montant au solde
  compte.solde += montant;

  return res.status(200).json({
    message: "Dépôt effectué avec succès.",
    titulaire: compte.titulaire,
    nouveauSolde: `${compte.solde} FCFA`,
    heureOperation: new Date().toLocaleString('fr-FR')
    });
});


// ============================================================
// ROUTE 5 : Effectuer un retrait sur un compte
// Méthode : POST
// URL     : http://localhost:3000/api/comptes/:id/retrait
// ============================================================
app.post('/api/comptes/:id/retrait', (req, res) => {

  const id = parseInt(req.params.id);
  const { montant } = req.body;
  const compte = comptes.find(c => c.id === id);

  // Si le compte n'existe pas
  if (!compte) {
    return res.status(404).json({
      erreur: "Compte introuvable. Vérifiez l'identifiant."
    });
  }

  // Le montant doit être positif
  if (!montant || montant <= 0) {
    return res.status(400).json({
      erreur: "Le montant du retrait doit être supérieur à zéro."
    });
  }

  // Vérification du solde
  if (montant > compte.solde) {
    return res.status(400).json({
      erreur: "Solde insuffisant pour effectuer ce retrait.",
      soldeActuel: compte.solde
    });
  }

  // On déduit le montant du solde
  compte.solde -= montant;

  return res.status(200).json({
    message: "Retrait effectué avec succès.",
    titulaire: compte.titulaire,
    nouveauSolde: `${compte.solde} FCFA`,
    heureOperation: new Date().toLocaleString('fr-FR')
  });
});


// ============================================================
// DÉMARRAGE DU SERVEUR
// ============================================================
const PORT = 3000;
app.listen(PORT, () => {
  console.log('');
  console.log('======================================');
  console.log('   Serveur bancaire démarré !');
  console.log(`   Adresse : http://localhost:${PORT}`);
  console.log('======================================');
  console.log('');
  console.log('Routes disponibles :');
  console.log('  POST   /api/comptes             => Créer un compte');
  console.log('  GET    /api/comptes             => Liste des comptes');
  console.log('  GET    /api/comptes/:id         => Détail d un compte');
  console.log('  POST   /api/comptes/:id/depot   => Faire un dépôt');
  console.log('  POST   /api/comptes/:id/retrait => Faire un retrait');
  console.log('');
});