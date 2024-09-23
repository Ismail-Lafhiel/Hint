# Table des Matières
## VibeShare
### Aperçu
### Fonctionnalités
1. **Authentification**
2. **Gestion des articles**
3. **Commentaires**
4. **Profil utilisateur**
5. **Interface utilisateur**
### Spécifications Techniques
#### Backend
#### Frontend
#### Sécurité
### Installation
#### Instructions d'Installation
#### Packages
#### Base de Données
#### Style
### Contribuer
#### Guide de Contribution

### Aperçu
Infodev est une plateforme web permettant aux utilisateurs de s'enregistrer, de se connecter, de publier des articles, de laisser des commentaires et de gérer leur profil. L'application est développée en Node.js avec Express.js pour le backend, et utilise EJS comme moteur de template pour le rendu de l'interface.

### Fonctionnalités
1. **Authentification**
   - **Inscription** : Enregistrement d'un nouvel utilisateur.
   - **Connexion** : Identification des utilisateurs déjà enregistrés.
   - **Déconnexion** : Fin de session des utilisateurs.
2. **Gestion des articles**
   - **Création d'un article** : Les utilisateurs peuvent rédiger un nouvel article incluant un titre, du contenu et la date de création.
   - **Liste des articles** : Affichage de tous les articles disponibles.
   - **Détails d'un article** : Visualisation approfondie d'un article en particulier.
   - **Modification d'un article** : Les auteurs peuvent modifier leurs articles.
   - **Suppression d'un article** : Les auteurs peuvent retirer leurs propres articles.
3. **Commentaires**
   - **Ajout de commentaires** : Les utilisateurs peuvent publier des commentaires sur un article.
   - **Affichage des commentaires** : Visualisation de tous les commentaires associés à un article.
   - **Suppression de commentaires** : Les utilisateurs peuvent retirer leurs propres commentaires.
   - **Like de commentaires** : Les utilisateurs peuvent faire le (like) aux commentaires.
4. **Profil utilisateur**
   - **Consultation et mise à jour du profil** : Les utilisateurs peuvent visualiser et modifier leurs informations (nom, email, photo, etc.).
   - **Liste des articles créés** : Affichage des articles publiés par l'utilisateur.
5. **Interface utilisateur**
   - Utilisation de EJS comme moteur de templates pour afficher dynamiquement les données côté serveur.
   - Design adaptable pour une expérience fluide sur mobile et ordinateur.

### Spécifications Techniques
#### Backend
- **Framework** : Node.js avec Express.js.
- **Base de données** : MySQL utilisant l'ORM Sequelize pour la gestion des données.
- **Routes** : Mise en place de routes REST (GET, POST, PUT, DELETE) pour chaque fonctionnalité.

#### Frontend
- **Moteur de templates** : EJS pour la génération dynamique des pages HTML.
- **Design** : Utilisation de CSS pour un aspect soigné et intuitif, avec la possibilité d'intégrer un framework CSS comme Bootstrap ou TailwindCSS.

#### Sécurité
- Protection contre les injections SQL via Sequelize.
- Hachage des mots de passe avec bcrypt avant stockage dans la base de données.

### Installation
#### Prérequis
- Node.js
- MySQL

#### Instructions d'Installation
1. Cloner le projet :
   ```bash
   git clone https://github.com/zakaria-elkoh/infodev.git

### Packages
Voici une liste des principaux packages utilisés dans ce projet :

- **bcryptjs** : Utilisé pour sécuriser les mots de passe des utilisateurs.
- **body-parser** : Middleware pour analyser les corps des requêtes entrantes.
- **connect-flash** : Middleware pour gérer les messages temporaires entre requêtes.
- **dotenv** : Charge les variables d'environnement à partir d'un fichier `.env`.
- **ejs** : Moteur de templates pour générer du HTML dynamique.
- **express** : Framework web pour construire le backend.
- **express-flash** : Pour afficher des messages flash dans Express.
- **express-session** : Middleware pour gérer les sessions utilisateur.
- **mysql2** : Driver MySQL pour Node.js.
- **nodemon** : Outil qui redémarre le serveur lors des modifications.
- **sequelize** : ORM pour interagir avec la base de données MySQL.
- **sequelize-cli** : Interface en ligne de commande pour Sequelize.

### Base de Données
Le projet utilise l'ORM Sequelize pour l'interaction avec la base de données. Vous pouvez adapter les modèles dans le dossier `models` et configurer la base de données dans `config/config.json`.

### Style
Le projet est conçu avec HTML et CSS standards, en intégrant Tailwind CSS pour un style rapide et flexible. Les styles peuvent être modifiés en éditant les classes dans les vues EJS.

### Contribuer
Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request pour proposer des améliorations ou de nouvelles fonctionnalités.

#### Guide de Contribution
1. Forker le dépôt.
2. Créer une nouvelle branche :
   ```bash
   git checkout -b feature/nom-de-votre-fonctionnalité
3. Valider vos modifications :
    ```bash
    git commit -m 'Ajout d'une fonctionnalité'
4. Pousser vers la branche :
    ```bash
    git push origin feature/nom-de-votre-fonctionnalité
5. Ouvrir une pull request.
