# Sayna-TestBack-Node.js

## Description

C'est un API Node.js qui permet à des utilisateurs de consulter des musiques et utilisant comme base de données MongoDB.

## Installation
```bash
$ npm install

```

## Lancement
```bash
$ npm start

```

## Configuration

Editer le fichier `.env`

## Routes

### GET [/]

+ Affichage de la page `index.html`

### POST [/login]

+ Route d'authentification d'un utilisateur

### POST [/register]

+ Route d'insciption d'un utilisateur


### PUT [/subscription]

+ Route d'abonnement de l'utilisateur


### PUT [/user]

+Route de modification de l'utilisateur
    
   
### DELETE [/user/off]

+ Route de déconnections de l'utilisateur
  

### PUT [/user/cart]

+ Route d'ajout de carte bancaire    
       

### DELETE [/user]

+ Route de suppression du compte


### GET [/songs]

+ Route de listing des sources audios


### GET [/songs/:id]

+ Route de récupération d'une source audio


## Initiative

+ J'ai changé le nom de l'application en `Sayna-TestBack-Node.js` au lieu de `Sayna-TestFront-JS`

+ Pour le lien d'abonnement et l'ajout d'une carte, il faut modifier manuellement la réponse afin de bien simuler la fonctionnalité comme venant d'un autre API

+ La raison pour laquelle il faut les stocker, c'est que même si du côté client les tokens ont été supprimés, ils n'en reste pas moins valides. Donc, pour des raisons de sécurité, il faut les stocker et comparer les tokens qui sont nouvellement connecter à l'API. Voici est le lien pour effacer les "refreshToken" : 
Methode : `delete`
Route : `/refreshToken`