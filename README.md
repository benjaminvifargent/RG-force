# 🎾 RG-Force : Tennis Power Meter

RG-Force est une interface de borne interactive premium conçue pour mesurer et afficher la force de préhension (grip) des joueurs de tennis. Inspirée par l'esthétique des jeux vidéo de tennis modernes (comme Top Spin) et les codes visuels de la performance sportive (Nike Volt, Slate Black), elle offre une expérience utilisateur dynamique et compétitive.

## ✨ Caractéristiques

- **Interface Action/Classement (60/40) :** Un découpage clair entre la zone de test en temps réel et le tableau des records.
- **Visualisation Dynamique :** Une jauge circulaire interactive avec effets de lueur ("glow") et dégradés de performance.
- **Système de Leaderboard :** Un classement des 10 meilleures performances avec distinction pour le podium (Or, Argent, Bronze).
- **Design Premium :** Utilisation du "Glassmorphism", de typographies modernes (Rajdhani, Inter) et de micro-animations fluides.
- **Formulaire d'Inscription :** Collecte du pseudo et de l'email pour personnaliser l'expérience.

## 🛠️ Stack Technique

- **Structure :** HTML5 Sémantique.
- **Styles :** Vanilla CSS3 (Variables, Flexbox, Grid, Animations).
- **Back-end :** Python Flask.
- **Communication :** Socket.IO (temps réel).
- **Icônes :** SVG inline (optimisé offline).

## 🚀 Installation & Utilisation

1. **Clonez le dépôt :**
   ```bash
   git clone https://github.com/benjaminvifargent/RG-force.git
   ```

2. **Lancer la machine sur Raspberry pi5:**
   Ouvre ton terminal sur le Pi et fais ceci :
   - Navigue dans ton dossier : `cd /chemin/vers/RG-force`
   - Lance le serveur : `python app.py --break-system-packages`
   - Laisse le terminal ouvert ! S'il affiche des lignes de log, c'est que le moteur tourne.

3. **Accéder au jeu :**
   Maintenant, n'ouvre plus ton fichier `index.html` en double-cliquant dessus. Ouvre Chromium et tape simplement :
   `http://localhost:5000`

## 🎨 Design & Esthétique

Le projet suit une charte graphique stricte :
- **Couleurs :** Fond `#101015`, accent `#DFFF00` (Volt Yellow).
- **Effets :** Flou d'arrière-plan (backdrop-filter), ombres portées profondes et animations de clignotement pour les alertes.
- **Texture :** Une texture subtile de terre battue (`clay_court_texture.png`) renforce l'immersion dans l'univers du tennis.

## 📝 Licence

Ce projet est réalisé à des fins de démonstration pour une borne interactive de tennis.
