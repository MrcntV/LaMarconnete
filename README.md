# La marcOnnête — Documentation technique

## Architecture

| Composant | Port | Description |
|---|---|---|
| Site principal | 43749 | React SPA + API Express |
| Panel admin | 43750 | React admin séparé |
| MongoDB | 27017 | Base de données utilisateurs/clients |

---

## Première installation sur un nouveau serveur (BacASable ou prod)

### 1. Pré-requis système

```bash
# Node.js 22 (via nvm recommandé)
nvm install 22 && nvm use 22

# PM2
npm install -g pm2

# MongoDB Community
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

### 2. Cloner le projet

```bash
git clone https://github.com/MrcntV/LaMarconnete /LaMarconnete
cd /LaMarconnete
```

### 3. Variables d'environnement

```bash
cp .env.example .env
nano .env   # remplir JWT_SECRET, MONGODB_URI, Stripe, EmailJS, Colissimo
```

Contenu minimal `.env` :
```
MONGODB_URI=mongodb://127.0.0.1:27017/marconnete
JWT_SECRET=changer-cette-valeur-en-prod
PORT=43749
ADMIN_PORT=43750
```

### 4. Installer les dépendances

```bash
# Site principal
npm install --legacy-peer-deps
npm install fork-ts-checker-webpack-plugin@6.5.3 --legacy-peer-deps

# Panel admin
cd admin && npm install --legacy-peer-deps
npm install fork-ts-checker-webpack-plugin@6.5.3 --legacy-peer-deps
cd ..
```

### 5. Build

```bash
# Site principal
npm run build

# Panel admin
cd admin && npm run build && cd ..
```

### 6. Migration des données JSON vers MongoDB

```bash
node scripts/migrate-to-mongo.js
```

### 7. Démarrer avec PM2

```bash
pm2 startOrRestart pm2.config.js --env production
pm2 save        # sauvegarder pour redémarrage automatique
pm2 startup     # configurer le démarrage au boot (copier/coller la commande affichée)
```

---

## Workflow Git — pousser depuis ta machine locale

### Chaque push déclenche un déploiement automatique sur BacASable

```bash
git add .
git commit -m "description du changement"
git push origin main
```

Le webhook GitHub reçoit le push et lance automatiquement sur BacASable :
1. `git pull origin main`
2. `npm install --legacy-peer-deps`
3. `npm run build`
4. `pm2 startOrRestart pm2.config.js` — démarre si absent, redémarre sinon

> **Note :** le panel admin (`admin/`) n'est PAS rebuild automatiquement par le webhook.
> Pour déployer l'admin sur BacASable, builder en local puis committer `admin/build/` :
>
> ```bash
> cd admin && npm run build && cd ..
> git add admin/build
> git commit -m "build admin"
> git push origin main
> ```

---

## Commandes utiles au quotidien

### PM2 — gérer les processus

```bash
pm2 list                          # état des deux serveurs
pm2 logs marconnete               # logs site principal
pm2 logs marconnete-admin         # logs panel admin
pm2 restart marconnete            # redémarrer le site principal
pm2 restart marconnete-admin      # redémarrer le panel admin
pm2 restart all                   # redémarrer les deux

# Démarrer les deux d'un coup (1ère fois ou après reboot)
pm2 startOrRestart pm2.config.js --env production
pm2 save
```

### Rebuild manuel

```bash
# Après une modif en dehors d'un push
npm run build && pm2 restart marconnete

# Admin uniquement
cd admin && npm run build && cd .. && pm2 restart marconnete-admin
```

### MongoDB

```bash
mongosh marconnete                # ouvrir le shell sur la base marconnete

# Dans mongosh :
show collections
db.customers.find()
db.adminusers.find()
db.customers.countDocuments()

# Gérer le service
brew services start mongodb/brew/mongodb-community
brew services stop mongodb/brew/mongodb-community
brew services restart mongodb/brew/mongodb-community
```

---

## Accès par défaut

| Accès | Valeur |
|---|---|
| Site principal | http://localhost:43749 |
| Panel admin | http://localhost:43750 |
| Admin email | admin@lamarconnete.fr |
| Admin mot de passe | admin123 *(changer en prod)* |
| MongoDB URI | mongodb://127.0.0.1:27017/marconnete |

---

## Structure du projet

```
LaMarconnete/
├── src/               # Frontend React (site public)
├── admin/             # Frontend React (panel admin)
│   └── build/         # Build servi par server-admin.js
├── api/
│   ├── config/mongoose.js     # Connexion MongoDB
│   ├── middleware/auth.js      # JWT middleware
│   ├── models/
│   │   ├── Customer.js        # Modèle Mongoose clients
│   │   └── AdminUser.js       # Modèle Mongoose admins
│   ├── routes/                # Routes API Express
│   └── db.js                  # Accès JSON (commandes, produits...)
├── data/              # Fichiers JSON (commandes, produits, stocks...)
├── scripts/
│   └── migrate-to-mongo.js   # Migration JSON -> MongoDB
├── build/             # Build React site public
├── server.js          # Serveur principal (port 43749)
├── server-admin.js    # Serveur admin (port 43750)
├── pm2.config.js      # Config PM2 (2 processus)
├── .env.example       # Variables d'environnement a copier
└── MarconneteAdmin.conf  # Config Nginx (a implanter)
```

---

## Changer le mot de passe du panel admin

```bash
node scripts/set-admin-password.js
``` 

Le script se connecte à MongoDB, liste les comptes admin disponibles, et te guide pas à pas :

```
========================================
   Modifier le mot de passe admin
======================================== 

Comptes admin :
  1. admin@lamarconnete.fr  (Admin marcOnnête — superadmin — ✓ actif)

Numéro du compte : 1

Compte : admin@lamarconnete.fr
Nouveau mot de passe : ********
Confirmer            : ********

✓ Mot de passe mis à jour pour admin@lamarconnete.fr
  Connectez-vous sur le panel admin avec ce nouveau mot de passe.
```

> **Important :** à faire obligatoirement après chaque installation sur un nouveau serveur.
> Le mot de passe par défaut `admin123` ne doit jamais rester en production.

---

## Domaines et configuration Nginx

### Domaines en production

| URL | Serveur |
|---|---|
| https://mrcntv.com | Site principal (port 43749) |
| https://admin.mrcntv.com | Panel admin (port 43750) |

Les domaines sont définis dans `.env` :
```
SITE_DOMAIN=mrcntv.com
ADMIN_DOMAIN=admin.mrcntv.com
```

`server.js` lit ces variables pour configurer le CORS automatiquement.

### Installer le fichier Nginx sur le serveur

```bash
# Copier le fichier de config
sudo cp /LaMarconnete/Marconnete.conf /etc/nginx/sites-available/Marconnete.conf

# Activer (supprimer l'ancien lien si nécessaire)
sudo rm -f /etc/nginx/sites-enabled/Marconnete.conf
sudo ln -s /etc/nginx/sites-available/Marconnete.conf /etc/nginx/sites-enabled/

# Tester et recharger
sudo nginx -t && sudo systemctl reload nginx
```

### Générer les certificats SSL (Let's Encrypt)

```bash
# Les 3 domaines en une commande
sudo certbot --nginx -d mrcntv.com -d www.mrcntv.com -d admin.mrcntv.com
```

### Changer de domaine

1. Modifier `.env` :
   ```
   SITE_DOMAIN=nouveaudomaine.com
   ADMIN_DOMAIN=admin.nouveaudomaine.com
   ```
2. Mettre à jour `Marconnete.conf` (remplacer `mrcntv.com` et `admin.mrcntv.com`)
3. Générer les nouveaux certificats SSL avec certbot
4. Recharger nginx + redémarrer pm2 :
   ```bash
   sudo systemctl reload nginx
   pm2 restart all
   ```
