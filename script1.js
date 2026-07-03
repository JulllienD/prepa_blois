document.getElementById('check-button').addEventListener('click', function() {
  // On récupère tous les champs de saisie
  const inputs = document.querySelectorAll('.user-input');

  inputs.forEach(input => {
    // .trim() enlève les espaces inutiles au début/fin, .toLowerCase() ignore les majuscules
    const userAnswer = input.value.trim().toLowerCase();
    const correctAnswer = input.getAttribute('data-answer').toLowerCase();
    const feedbackSpan = input.nextElementSibling; // Le span juste après l'input

    if (userAnswer === correctAnswer) {
      input.style.borderColor = "green";
      feedbackSpan.textContent = " ✅ Correct !";
      feedbackSpan.style.color = "green";
    } else {
      input.style.borderColor = "red";
      feedbackSpan.textContent = ` ❌ Faux (La réponse était : ${correctAnswer})`;
      feedbackSpan.style.color = "red";
    }
  });
});