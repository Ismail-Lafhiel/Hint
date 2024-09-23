# Commentaire System with Likes

A feature-rich comment system that allows users to add, view, and delete their own comments on articles, with the ability to like comments. This project is built using **Node.js**, **Express.js**, **MySQL**, and **Sequelize** for the backend, with a clean frontend using **EJS** templates and **TailwindCSS**.

## Features

### 1. Comment System
- **Add Comments**: Users can post comments under an article.
- **View Comments**: All comments related to a particular article are displayed in a structured format.
- **Delete Comments**: Users can delete only their own comments.

### 2. Like System
- **Like Comments**: Users can like or unlike comments. The total number of likes for each comment is displayed.

---

## Tech Stack

### Backend
- **Node.js** with **Express.js**: Backend framework for handling routes and requests.
- **MySQL** with **Sequelize**: Database for storing articles, comments, users, and likes.

### Frontend
- **EJS**: Template engine to dynamically render HTML with data from the backend.
- **CSS & TailwindCSS**: For a clean, responsive design.

### Frontend Features
- **CLEAN DESIGN** The frontend is styled using TailwindCSS for an elegant and intuitive user experience.
- **Responsive Layout** Fully responsive design that works on all devices.
- **Interactive Elements** Users can interact with buttons for liking, posting, and deleting comments.
---

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/comment-system.git
cd comment-system

### 2. Clone the repository

npm install

### 3. Configure Environment Variables

DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

### 4. DataBase Setup

npx sequelize-cli db:migrate

### 5. Start the Server

node app.js

Contribuer:

Les contributions sont les bienvenues ! Pour contribuer, veuillez forker ce dépôt, créer une branche pour votre fonctionnalité ou correction de bug, et soumettre une pull request.

Auteur:

Nada Elmahfoudi - https://github.com/nadaelmahfoudi.