# Cadre du projet

Ce projet a été réalisé dans le cadre d'un exercice noté de cours, au sein de l'école MyDigitalSchool.
Il ne s'agit en aucun cas d'un projet exploitable puisque non complètement opérationnel.

# Consignes de l'exercice

Pour réaliser à bien le projet, il est demandé :
- Validate meta data (name, size, extension)
- Mime type validation
- Remove execution privilege
- Don’t keep file name

Les points ci-après cités étaient considérés comme bonus
- Protocol integrity (BONUS)
- Store file in non extern access possible (BONUS)
- File Analyse (BONUS)


# Pré-requis à l'utilisation du projet

- Installez les packages nécessaires (ceux-ci dont définis dans le fichier *package.json*) : **```npm install -S```** ou son écriture raccourcie ```npm i -S```
- Installez le certificat : **```mkcert [nom_du_certificat]```**. Ce nom est à utiliser ensuite pour accéder au site : par exemple, si votre certificat est 'myapp.dev', c'est par cette url que vous accéderez par la suite, en ajoutant le port d'utilisation
- Déterminez les variables d'environnement en créant un fichier **.env** à la racine du projet : pour cela, copiez le fichier **.env-sample** et modifiez-y les variables présentes en les adaptant à votre environnement
- Création d'un dossier 'uploads' à la racine du projet : celui-ci est destiné à recevoir les fichiers uploadés.
- Lancez le projet : ```node {nom_du_fichier_a_lire.js} ``` (le plus souvent, *index.js*)
