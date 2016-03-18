# GameGridService

## Initialisation

Pour permettre à l'application d'afficher la grille, il est necessaire de l'initialiser.

Appeler le service POST : /api/map/ avec ou sans paramètres.
puis appeler le service GET : /api/localtiles/#gridemapid#/1/1/0/0/ pour visualiser les 4 premieres tuiles de la grille.

Le gridemapid sera donné comme retour à l'appel de /map/
Dans l'application il est necessaire de modifier le controller SquareGridController avec le bon gridemapid.
