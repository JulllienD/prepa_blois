document.addEventListener("DOMContentLoaded", () => {
    // 1. Sélectionner toutes les lignes de vocabulaire de la table
    const lignes = document.querySelectorAll(".vocab-table tbody tr");
    
    lignes.forEach((ligne) => {
        // Récupérer les cellules Anglais (2ème colonne) et Français (3ème colonne)
        const celluleAnglais = ligne.cells[1];
        const celluleFrancais = ligne.cells[2];
        
        if (!celluleAnglais || !celluleFrancais) return;

        const texteAnglais = celluleAnglais.innerText.trim();
        const texteFrancais = celluleFrancais.innerText.trim();
        
        // Sauvegarder la bonne réponse dans les attributs de la ligne pour la vérification
        ligne.setAttribute("data-reponse-en", texteAnglais);
        ligne.setAttribute("data-reponse-fr", texteFrancais);

        // Pile ou face (50% de chance) : déterminer quelle langue masquer
        const masquerAnglais = Math.random() < 0.5;
        
        if (masquerAnglais) {
            ligne.setAttribute("data-mode-masque", "en");
            celluleAnglais.innerHTML = `
                <input type="text" class="input-revision" placeholder="Traduire en anglais..." 
                    style="width: 90%; padding: 6px; border: 2px solid #ced4da; border-radius: 4px; font-size: 0.95rem;">
            `;
        } else {
            ligne.setAttribute("data-mode-masque", "fr");
            celluleFrancais.innerHTML = `
                <input type="text" class="input-revision" placeholder="Traduire en français..." 
                    style="width: 90%; padding: 6px; border: 2px solid #ced4da; border-radius: 4px; font-size: 0.95rem;">
            `;
        }
    });

    // 2. Ajouter un bouton de validation tout en bas de la table si non présent
    const table = document.querySelector(".vocab-table");
    if (table) {
        const conteneurBouton = document.createElement("div");
        conteneurBouton.style = "text-align: center; margin-top: 30px; margin-bottom: 30px;";
        conteneurBouton.innerHTML = `
            <button onclick="verifierReponsesVocab()" class="exos-btn-link" style="cursor: pointer; border: none;">
                Valider mes réponses
            </button>
        `;
        table.parentNode.insertBefore(conteneurBouton, table.nextSibling);
    }
});

// Fonctions de validation globale au clic sur le bouton
function verifierReponsesVocab() {
    const lignes = document.querySelectorAll(".vocab-table tbody tr");
    
    lignes.forEach((ligne) => {
        const mode = ligne.getAttribute("data-mode-masque");
        const input = ligne.querySelector(".input-revision");
        if (!input) return;
        
        const reponseUser = input.value.trim().toLowerCase();
        
        // Récupérer la solution attendue (en enlevant les espaces et en minuscules)
        const solutionAttendue = mode === "en" ? ligne.getAttribute("data-reponse-en") : ligne.getAttribute("data-reponse-fr");
        
        // Gestion des synonymes / variantes séparés par un slash "/" ou une virgule ","
        const solutionsPossibles = solutionAttendue.split(/[\/,;]/).map(s => s.trim().toLowerCase());
        
        // Supprimer les petits styles de correction précédents s'ils existent
        const indicationPrecedente = input.parentNode.querySelector(".correction-texte");
        if (indicationPrecedente) indicationPrecedente.remove();

        if (solutionsPossibles.includes(reponseUser) && reponseUser !== "") {
            // Bonne réponse : Vert
            input.style.borderColor = "#28a745";
            input.style.backgroundColor = "#e8f5e9";
            input.style.color = "#155724";
        } else {
            // Mauvaise réponse : Rouge
            input.style.borderColor = "#dc3545";
            input.style.backgroundColor = "#ffebee";
            input.style.color = "#721c24";
            
            // Afficher la solution juste en dessous de l'input en rouge pour aider l'élève
            const feedback = document.createElement("div");
            feedback.className = "correction-texte";
            feedback.style = "color: #dc3545; font-size: 0.85rem; font-weight: bold; margin-top: 4px; text-align: left;";
            feedback.textContent = `Attendu : ${solutionAttendue}`;
            input.parentNode.appendChild(feedback);
        }
    });
}