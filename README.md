# Projet Alix

Ce projet est une application web distribuée et conteneurisée, utilisant Docker pour faciliter le développement, les tests et le déploiement. Ce fichier explique l'architecture du projet, les services impliqués et les méthodes de gestion des branches.

## Architecture du Projet

Le projet est composé de plusieurs services interconnectés via Docker Compose. Voici les principaux services :

### 1. **alix-pwa**

- **Rôle** : Application frontend (PWA - Progressive Web Application).
- **Port** : 3000 (accessible via http://localhost:3000).
- **Contexte** : Le dossier `./alix-pwa` contient le code source de l'application.

### 2. **alix-appweb**

- **Rôle** : Application web (interface utilisateur).
- **Port** : 3001 (accessible via http://localhost:3001).
- **Contexte** : Le dossier `./alix-appweb` contient le code source de l'application web.

### 3. **alix-api**

- **Rôle** : API backend qui gère la logique métier et les communications avec la base de données.
- **Port** : 3002 (accessible via http://localhost:3002).
- **Contexte** : Le dossier `./alix-api` contient le code source de l'API.
- **Dépendances** : Ce service dépend de la base de données PostgreSQL.

### 4. **postgres**

- **Rôle** : Base de données relationnelle PostgreSQL.
- **Port** : 5432 (accessible via localhost:5432).
- **Configuration** :
- Utilisateur : `admin`
- Mot de passe : `...`
- Base de données : `...`
- **Volumes** : Utilise un volume Docker persistant pour stocker les données (`postgres_data`).

### 5. **pgadmin**

- **Rôle** : Interface graphique pour administrer la base de données PostgreSQL.
- **Port** : 8080 (accessible via http://localhost:8080).
- **Utilisateur par défaut** : admin
- Email : `gaulardnathan@gmail.com`
- Mot de passe : `...`
- **Dépendances** : Ce service dépend de la base de données PostgreSQL.

### Réseau

Tous les services sont connectés via un réseau interne Docker appelé `app_network` pour assurer une communication fluide entre eux.

### Docker Compose

L’outil Docker Compose est utilisé pour orchestrer ces services. En exécutant la commande `docker-compose up`, Docker crée et configure tous les services de l'architecture décrite ci-dessus.

## Gestion des Branches

### 1. **Branche `dev`**

- **Objectif** : La branche de développement où tout le travail de code se fait. Elle est utilisée pour tester les nouvelles fonctionnalités, effectuer des correctifs et expérimenter.
- **Usage** : Les développeurs créent des branches dérivées de `dev` pour leurs fonctionnalités ou corrections spécifiques. Une fois le travail terminé, ils fusionnent ces branches dans `dev` après revue.

### 2. **Branche `main` (ou `staging`)**

- **Objectif** : La branche principale pour stocker les modifications qui sont prêtes pour la production, mais qui doivent encore être testées en pré-production ou sur des environnements de staging.
- **Usage** : Une fois qu'une fonctionnalité est validée sur `dev`, elle est fusionnée dans `main` pour un dernier test avant de passer en production. Les déploiements en pré-prod ou staging se font généralement à partir de cette branche.

### 3. **Branche `prod`**

- **Objectif** : La branche de production où seules les versions stables et validées du projet sont présentes. Cette branche contient le code prêt à être déployé sur l'environnement de production.
- **Usage** : Une fois que les tests en staging sont concluants, le code est fusionné dans `prod` et déployé sur l'environnement de production.
