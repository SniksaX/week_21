# API de Gestion Bancaire - Synthèse S21

## Description
Cette API permet à un utilisateur de gérer ses comptes bancaire et ses transactions.  
Elle est construite avec **Node.js**, **Express**, **MongoDB** et **Mongoose**.  
L'authentification repose sur **JWT** et les mots de passe sont hachés avec **bcrypt**.

## Prérequis
- Node.js (v18 ou supérieur)
- MongoDB (local ou Atlas)
- Un gestionnaire de paquets (npm)

## Installasion

1. Clonez le dépôt :
   ```bash
   git clone git@github.com:SniksaX/week_21.git
   cd week_21
Installez les dépendances :

bash
npm install
Créez un fichier .env à la racine avec les variables suivantes :

env
PORT=8080
MONGODB_URI=mongodb://localhost:27017/bank_app
JWT_SECRET=unSecretTresSecurise
Lancez le serveur :

bash
npm run dev
Configuration
Le serveur écoute sur le port défini dans .env (par défaut 8080).
La base de données bank_app sera créée automatiquement lors de la première connexion.

Routes disponibles
Authentification
POST /api/auth/register – Inscription d'un utilisateur
Corps : { "email": "...", "password": "..." }

POST /api/auth/login – Connexion – renvoie un token JWT

Comptes (nécessite authentification)
POST /api/accounts – Créer un compte

GET /api/accounts – Liste de ses comptes avec solde

GET /api/accounts/global-balance – Solde global

PUT /api/accounts/:accountId – Modifier un compte

DELETE /api/accounts/:accountId – Supprimer un compte (supprime aussi ses transactions)

Transactions (nécessite authentification)
POST /api/accounts/:accountId/transactions – Ajouter une transaction

GET /api/accounts/:accountId/transactions – Liste des transactions d'un compte

GET /api/accounts/:accountId/transactions/pending – Transactions en attente

GET /api/accounts/:accountId/transactions/populated – Transactions avec détails du compte

PUT /api/accounts/:accountId/transactions/:transactionId – Modifier une transaction

DELETE /api/accounts/:accountId/transactions/:transactionId – Supprimer une transaction

HATEOAS
Chaque réponse inclut des liens pour les actions disponibles (création, mise à jour, suppression, etc.) conformément au principe HATEOAS.

Exemple d'appel
bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"MotDePasse123!"}'