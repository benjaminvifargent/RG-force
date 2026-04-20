document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const registrationZone = document.getElementById('registration-zone');
    const testZone = document.getElementById('test-zone');
    const gaugePath = document.getElementById('gauge-path');
    const currentScoreEl = document.getElementById('current-score');
    const rankList = document.getElementById('rank-list');
    const userRankEl = document.getElementById('user-rank');
    const pseudoInput = document.getElementById('pseudo');

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
    });

    function startTest(pseudo) {
        // Transition UI
        registrationZone.style.display = 'none';
        testZone.style.display = 'flex';

        // Simulation du test de force
        simulateTest(pseudo);
    }

    function simulateTest(pseudo) {
        let currentForce = 0;
        let targetForce = 40 + Math.random() * 60; // Max entre 40 et 100 kg
        let duration = 3000; // 3 secondes de montée
        let startTime = null;

        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            let progress = timestamp - startTime;
            let percentage = Math.min(progress / duration, 1);
            
            // Courbe de progression (ease out quad pour simuler la fatigue/limite)
            let easedPercentage = 1 - (1 - percentage) * (1 - percentage);
            currentForce = easedPercentage * targetForce;

            updateUI(currentForce);

            if (percentage < 1) {
                requestAnimationFrame(animate);
            } else {
                // Test terminé
                setTimeout(() => {
                    saveAndReset(pseudo, currentForce);
                }, 2000);
            }
        }

        requestAnimationFrame(animate);
    }

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

        renderLeaderboard();

        // Réinitialisation après un délai pour le prochain utilisateur
        setTimeout(() => {
            testZone.style.display = 'none';
            registrationZone.style.display = 'flex';
            currentScoreEl.textContent = '0.0';
            gaugePath.style.strokeDashoffset = '879.64';
            pseudoInput.value = '';
            document.getElementById('email').value = '';
        }, 5000);
    }

    function renderLeaderboard() {
        rankList.innerHTML = '';
        leaderboardData.slice(0, 10).forEach((item, index) => {
            const rank = index + 1;
            const li = document.createElement('li');
            li.className = `rank-item top-${rank <= 3 ? rank : 'normal'}`;
            
            li.innerHTML = `
                <div class="rank-number">#${rank}</div>
                <div class="rank-name">${item.pseudo}</div>
                <div class="rank-score">${item.score.toFixed(1)} KG</div>
            `;
            rankList.appendChild(li);
        });
    }
});
