// --- FONCTIONS DE TOLÉRANCE ET NETTOYAGE ---

/**
 * Nettoie une chaîne de caractères : enlève la ponctuation, 
 * les accents, met en minuscules et supprime les espaces doubles.
 */
function normaliserTexte(texte) {
    if (!texte) return "";
    return texte
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Enlève les accents
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"’]/g, " ")  // Enlève la ponctuation
        .replace(/\s+/g, " ")                             // Enlève les espaces multiples
        .trim();                                          // FIX : Utilise .trim() à la place de .strip()
}

/**
 * Calcule la distance de Levenshtein (nombre de modifications nécessaires 
 * pour passer d'une chaîne A à une chaîne B).
 */
function calculerDistance(a, b) {
    const matrice = [];
    for (let i = 0; i <= b.length; i++) matrice[i] = [i];
    for (let j = 0; j <= a.length; j++) matrice[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrice[i][j] = matrice[i - 1][j - 1];
            } else {
                matrice[i][j] = Math.min(
                    matrice[i - 1][j - 1] + 1, // Substitution
                    matrice[i][j - 1] + 1,     // Insertion
                    matrice[i - 1][j] + 1      // Suppression
                );
            }
        }
    }
    return matrice[b.length][a.length];
}

/**
 * Vérifie si la réponse utilisateur est acceptable par rapport à la solution.
 * Accepte 1 faute de frappe pour les mots de 5 à 7 lettres, et 2 fautes au-delà.
 */
function estReponseValide(reponseUser, solutionAttendue) {
    const userClean = normaliserTexte(reponseUser);
    const solClean = normaliserTexte(solutionAttendue);

    if (userClean === "") return false;
    if (userClean === solClean) return true; // Correspondance parfaite après nettoyage

    const distance = calculerDistance(userClean, solClean);
    
    // Définition du seuil de tolérance selon la longueur du mot
    let toleranceMax = 0;
    if (solClean.length >= 5 && solClean.length <= 8) {
        toleranceMax = 1; // 1 lettre d'écart max
    } else if (solClean.length > 8) {
        toleranceMax = 2; // 2 lettres d'écart max (utile pour les phrases de TRAD)
    }

    return distance <= toleranceMax;
}


// --- FONCTIONS DE GESTION DES EXERCICES ---

function basculerIndication(index) {
    const panel = document.getElementById(`indication-${index}`);
    if (panel) {
        panel.classList.toggle("hidden");
    }
}

function verifierExercice(index) {
    const card = document.querySelector(`.exo-card[data-index="${index}"]`);
    if (!card) return;

    const type = card.getAttribute("data-type");
    const rawClean = card.getAttribute("data-reponses-clean");
    const rawBrutes = card.getAttribute("data-reponses-brutes"); 
    const feedbackBox = document.getElementById(`feedback-${index}`);
    const explicationPanel = document.getElementById(`explication-${index}`);

    const listeReponsesAttendues = rawClean.split(",").map(r => r.trim());
    let completementJuste = true;

    /*if (type === "TROU") {*/
    const inputs = card.querySelectorAll(".input-exo-trou");
    inputs.forEach((input, i) => {
        const reponseUser = input.value.trim();
        
        if (!listeReponsesAttendues[i]) {
            completementJuste = false;
            return;
        }

        const alternatives = listeReponsesAttendues[i].split("/");
        
        // On vérifie si la saisie matche avec au moins une des alternatives (ex: journalist ou reporter)
        const matchTrouve = alternatives.some(solution => estReponseValide(reponseUser, solution));

        if (matchTrouve) {
            input.className = "input-exo-trou juste";
        } else {
            input.className = "input-exo-trou faux";
            completementJuste = false;
        }
    });
    /*
    }*/
    /*
    else if (type === "TRAD") {
        const textarea = card.querySelector(".input-exo-long");
        const reponseUser = textarea.value.trim();
        
        const alternatives = listeReponsesAttendues[0].split("/");
        const matchTrouve = alternatives.some(solution => estReponseValide(reponseUser, solution));

        if (matchTrouve) {
            textarea.className = "input-exo-long juste";
        } else {
            textarea.className = "input-exo-long faux";
            completementJuste = false;
        }
    }*/

    // Affichage du résultat final
    if (completementJuste) {
        feedbackBox.className = "exo-feedback-box feedback-juste";
        feedbackBox.innerHTML = `🎉 Félicitations ! Réponse validée. <br><span style="font-size:0.95rem; font-weight:normal;">Solution idéale : <em>${rawBrutes}</em></span>`;
    } else {
        feedbackBox.className = "exo-feedback-box feedback-faux";
        feedbackBox.innerHTML = `❌ Ce n'est pas tout à fait ça. <br><strong>Solution attendue :</strong> ${rawBrutes}`;
    }

    if (explicationPanel) {
        explicationPanel.classList.remove("hidden");
    }
}