const socket = io("http://localhost:5000"); // Se connecte au serveur Flask (adapter l'IP si besoin)
let isTesting = false; // Pour savoir si on enregistre le record
let maxForceDetected = 0; // Stocke la valeur max pendant l'effort

document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const registrationZone = document.getElementById('registration-zone');
    const testZone = document.getElementById('test-zone');
    const gaugePath = document.getElementById('gauge-path');
    const currentScoreEl = document.getElementById('current-score');
    const rankList = document.getElementById('rank-list');
    const userRankEl = document.getElementById('user-rank');
    const userRankContainer = document.getElementById('user-rank-container');
    const testInstruction = document.getElementById('test-instruction');
    const alertMsg = document.getElementById('alert-msg');
    const pseudoInput = document.getElementById('pseudo');
    const ageInput = document.getElementById('age');
    const keyboard = document.getElementById('virtual-keyboard');
    const podiumModal = document.getElementById('podium-modal');
    const modalPseudo = document.getElementById('modal-pseudo');
    const modalRank = document.getElementById('modal-rank');
    const closeModalBtn = document.getElementById('close-modal');
    let activeInput = null;

    // Données de simulation pour le classement
    let leaderboardData = [
        { pseudo: "Rafa_Grip", score: 98.5 },
        { pseudo: "Djoko_Fan", score: 95.2 },
        { pseudo: "FedEx_Force", score: 92.8 },
        { pseudo: "TennisMaster", score: 88.1 },
        { pseudo: "AlcarazUnit", score: 85.0 },
        { pseudo: "AceKing", score: 82.4 },
        { pseudo: "BackhandBeast", score: 79.9 },
        { pseudo: "NetRushing", score: 75.3 },
        { pseudo: "BaselinePro", score: 71.2 },
        { pseudo: "ClayWarrior", score: 68.5 }
    ];

    // Initialiser le classement au chargement
    renderLeaderboard();

    startBtn.addEventListener('click', () => {
        const pseudo = pseudoInput.value.trim() || 'Visiteur';
        startTest(pseudo);
        keyboard.classList.add('hidden');
    });

    // Gestion du clavier virtuel
    const keys = [
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
        ['W', 'X', 'C', 'V', 'B', 'N', '\'', '-', '(', ')'],
        ['Effacer', 'Espace', 'Valider']
    ];

    function initKeyboard() {
        keys.forEach((row, rowIndex) => {
            const rowEl = document.querySelector(`.keyboard-row[data-row="${rowIndex}"]`);
            row.forEach(key => {
                const button = document.createElement('div');
                button.className = 'key';
                button.textContent = key;

                if (key === 'Effacer') button.classList.add('wide', 'backspace');
                if (key === 'Valider') button.classList.add('wide', 'enter');
                if (key === 'Espace') button.classList.add('wide', 'space');

                button.addEventListener('mousedown', (e) => {
                    e.preventDefault(); // Empêche la perte de focus
                    handleKeyPress(key);
                });

                rowEl.appendChild(button);
            });
        });
    }

    function handleKeyPress(key) {
        if (!activeInput) return;

        if (key === 'Effacer') {
            activeInput.value = activeInput.value.slice(0, -1);
        } else if (key === 'Valider') {
            keyboard.classList.add('hidden');
            activeInput.blur();
        } else if (key === 'Espace') {
            activeInput.value += ' ';
        } else {
            activeInput.value += key;
        }

        // Déclencher l'événement input pour d'éventuels listeners
        activeInput.dispatchEvent(new Event('input'));
    }

    [pseudoInput, ageInput].forEach(input => {
        input.addEventListener('focus', () => {
            activeInput = input;
            keyboard.classList.remove('hidden');
        });

        // Empêcher l'ouverture du clavier natif si possible sur certains navigateurs
        // input.setAttribute('readonly', 'readonly'); 
        // Note: readonly empêche la saisie, on l'enlève juste après le focus ou on gère différemment
    });

    // Cacher le clavier si on clique ailleurs
    document.addEventListener('mousedown', (e) => {
        if (!keyboard.contains(e.target) && e.target !== pseudoInput && e.target !== ageInput) {
            keyboard.classList.add('hidden');
        }
    });

    initKeyboard();





    function startTest(pseudo) {
        registrationZone.style.display = 'none';
        testZone.style.display = 'flex';

        isTesting = true;
        maxForceDetected = 0;
        alertMsg.textContent = 'SERREZ !!!';

        // Durée du test : 5 secondes
        setTimeout(() => {
            isTesting = false;
            saveAndReset(pseudo, maxForceDetected);
        }, 5000);
    }




    // Écoute les données envoyées par Python (app.py)
    socket.on('force_update', function (data) {
        if (isTesting) {
            let currentForce = data.value; // Valeur reçue du ADS1115

            // On garde uniquement la force maximale atteinte
            if (currentForce > maxForceDetected) {
                maxForceDetected = currentForce;
            }

            updateUI(currentForce); // Met à jour la jauge en temps réel
        }
    });







    function updateUI(force) {
        // Mettre à jour le texte
        currentScoreEl.textContent = force.toFixed(1);

        // Mettre à jour la jauge (stroke-dashoffset)
        // Rayon = 140, Circonférence = 2 * PI * 140 = 879.64
        const circumference = 879.64;
        const maxDisplayForce = 120; // On considère 120kg comme le max de la jauge
        const offset = circumference - (Math.min(force, maxDisplayForce) / maxDisplayForce) * circumference;
        gaugePath.style.strokeDashoffset = offset;
    }

    function saveAndReset(pseudo, finalScore) {
        // Ajouter au classement
        leaderboardData.push({ pseudo: pseudo, score: parseFloat(finalScore.toFixed(1)) });
        leaderboardData.sort((a, b) => b.score - a.score);

        // Trouver le rang de l'utilisateur
        const rank = leaderboardData.findIndex(p => p.pseudo === pseudo && p.score === parseFloat(finalScore.toFixed(1))) + 1;
        userRankEl.textContent = `#${rank}`;

        // Mettre à jour l'alerte
        alertMsg.textContent = 'RELACHEZ LA RAQUETTE !';
        alertMsg.style.color = 'var(--accent-green)'; // Optionnel: passer en vert pour signifier la fin

        // Afficher le rang en gros
        testInstruction.classList.add('hidden');
        userRankContainer.classList.remove('hidden');

        // Gérer la modal de podium si top 3
        if (rank <= 3) {
            showPodiumModal(pseudo, rank);
        }

        renderLeaderboard();

        // Réinitialisation après un délai pour le prochain utilisateur
        setTimeout(() => {
            testZone.style.display = 'none';
            registrationZone.style.display = 'flex';

            // Reset visibility
            testInstruction.classList.remove('hidden');
            userRankContainer.classList.add('hidden');
            alertMsg.textContent = 'SERREZ LA RAQUETTE !';
            alertMsg.style.color = ''; // Reset couleur

            currentScoreEl.textContent = '0.0';
            gaugePath.style.strokeDashoffset = '879.64';
            pseudoInput.value = '';
            document.getElementById('age').value = '';
        }, 8000); // Laisser un peu plus de temps pour admirer le score
    }

    function renderLeaderboard() {
        rankList.innerHTML = '';
        leaderboardData.forEach((item, index) => {
            const rank = index + 1;
            const li = document.createElement('li');
            li.className = `rank-item top-${rank <= 3 ? rank : 'normal'}`;

            const truncatedPseudo = item.pseudo.length > 13 ? item.pseudo.substring(0, 10) + '...' : item.pseudo;

            li.innerHTML = `
                <div class="rank-number">#${rank}</div>
                <div class="rank-info">
                    <div class="rank-name">${truncatedPseudo}</div>
                    <div class="rank-score">${item.score.toFixed(1)} KG</div>
                </div>
            `;
            rankList.appendChild(li);
        });
    }

    function showPodiumModal(pseudo, rank) {
        modalPseudo.textContent = pseudo;
        const labels = ['PREMIERE PLACE', 'DEUXIEME PLACE', 'TROISIEME PLACE'];
        modalRank.textContent = labels[rank - 1];

        // Appliquer la classe de couleur
        podiumModal.classList.remove('rank-1', 'rank-2', 'rank-3');
        podiumModal.classList.add(`rank-${rank}`);

        podiumModal.classList.remove('hidden');
    }

    closeModalBtn.addEventListener('click', () => {
        podiumModal.classList.add('hidden');
    });
});
