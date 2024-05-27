const articles = [];

// Ajout d'un tableau pour suivre les éléments masqués
const hiddenItems = new Set(); // Utilisation d'un Set pour suivre les indices des articles masqués

// Fonction pour afficher les articles de la liste de courses
function displayItems() {
    const listeCourse = document.getElementById('listeCourse'); // Récupère l'élément HTML où afficher la liste
    listeCourse.innerHTML = ''; // Réinitialise le contenu de la liste
    articles.forEach((item, index) => { // Parcourt chaque article
        const li = document.createElement('li'); // Crée un élément de liste
        // Ajoute le nom de l'article, le prix, et les boutons d'actions (masquer/démasquer et supprimer)
        li.innerHTML = `
        <span onclick="toggleItem(${index})">
            ${hiddenItems.has(index) ? '[Démasqué]' : '[X]'}
            <span style="color:#000">
                ${item.name} - ${item.price}€
            </span>
        </span>
        <button onclick="removeItem(${index})" ${hiddenItems.has(index) ? 'disabled' : ''}>
            Supprimer
        </button>`;
        if (hiddenItems.has(index)) { // Si l'article est masqué
            li.classList.add('hidden'); // Ajoute une classe CSS pour masquer l'article
        }
        listeCourse.appendChild(li); // Ajoute l'élément à la liste
    });
    updateItemsDisplay(); // Met à jour l'affichage des articles masqués
    updateTotalPrice(); // Met à jour le prix total
    showEmptyMessage(); // Affiche le message si la liste est vide
}

// Fonction pour basculer l'état d'affichage d'un article (masquer/démasquer)
function toggleItem(index) {
    if (hiddenItems.has(index)) {
        hiddenItems.delete(index); // Si l'article est masqué, le retirer de hiddenItems
    } else {
        hiddenItems.add(index); // Sinon, l'ajouter à hiddenItems
    }
    displayItems(); // Réafficher la liste mise à jour
}

// Fonction pour ajouter un nouvel article
function addItem() {
    const newItemName = document.getElementById('newItem').value; // Récupère la valeur de l'input pour le nom
    const newItemPrice = parseFloat(document.getElementById('newItemPrice').value); // Récupère la valeur de l'input pour le prix
    if (newItemName && !isNaN(newItemPrice)) { // Si les inputs ne sont pas vides
        articles.push({ name: newItemName, price: newItemPrice }); // Ajoute le nouvel article à la liste
        displayItems(); // Réaffiche la liste mise à jour
        document.getElementById('newItem').value = ''; // Vide l'input pour le nom
        document.getElementById('newItemPrice').value = ''; // Vide l'input pour le prix
    }
}

// Fonction pour supprimer un article
function removeItem(index) {
    if (!hiddenItems.has(index)) { // Vérifie si l'élément est masqué, s'il l'est, ne pas le supprimer
        articles.splice(index, 1); // Supprime l'article de la liste
        // Mise à jour des indices dans hiddenItems
        const newHiddenItems = new Set();
        hiddenItems.forEach((i) => {
            if (i > index) {
                newHiddenItems.add(i - 1); // Ajuste les indices des éléments masqués
            } else if (i < index) {
                newHiddenItems.add(i);
            }
        });
        hiddenItems.clear(); // Vide l'ancien set
        newHiddenItems.forEach((i) => hiddenItems.add(i)); // Met à jour hiddenItems
        displayItems(); // Réaffiche la liste mise à jour
    }
}

// Fonction pour mettre à jour l'affichage des articles
function updateItemsDisplay() {
    const itemsDisplay = document.getElementById('itemsDisplay'); // Récupère l'élément HTML où afficher les articles
    itemsDisplay.innerHTML = `<h1>Contenu de la liste :</h1><hr>`; // Initialise l'affichage
    articles.forEach((item, index) => { // Parcourt chaque article
        const span = document.createElement('span'); // Crée un élément de span
        span.innerText = `${item.name}`; // Ajoute le nom de l'article et le prix
        if (hiddenItems.has(index)) { // Si l'article est masqué
            span.style.textDecoration = 'line-through'; // Ajoute un style de texte barré
            span.style.color = 'red'; // Change la couleur du texte
            span.style.opacity = '0.25'; // Diminue l'opacité du texte
        }
        itemsDisplay.appendChild(span); // Ajoute l'article à l'affichage
    });
    itemsDisplay.innerHTML += '<hr>'; // Ajoute une ligne de séparation
}

// Fonction pour mettre à jour le prix total
function updateTotalPrice() {
    const visibleItems = articles.filter((item, index) => !hiddenItems.has(index)); // Filtre les articles visibles
    const totalPrice = visibleItems.reduce((sum, item) => sum + item.price, 0); // Calcule le prix total
    const totalPriceDisplay = document.getElementById('totalPriceDisplay'); // Récupère l'élément HTML pour afficher le prix total
    totalPriceDisplay.innerHTML = `Prix total: ${totalPrice.toFixed(2)}€`; // Met à jour l'affichage du prix total
}

// Fonction pour filtrer les articles
function filterItems() {
    const filterValue = document.getElementById('filter').value.toLowerCase(); // Récupère la valeur du filtre
    const filteredArticles = articles.map((item, index) => ({ ...item, visible: item.name.toLowerCase().includes(filterValue) })); // Filtre les articles
    const listeCourse = document.getElementById('listeCourse'); // Récupère l'élément HTML où afficher la liste
    listeCourse.innerHTML = ''; // Réinitialise le contenu de la liste
    filteredArticles.forEach((item, index) => { // Parcourt chaque article
        if (item.visible) { // Si l'article est visible
            const li = document.createElement('li'); // Crée un élément de liste
            // Ajoute le nom de l'article, le prix, et les boutons d'actions (masquer/démasquer et supprimer)
            li.innerHTML = `
            <span onclick="toggleItem(${index})">
                ${hiddenItems.has(index) ? '[Démasqué]' : '[X]'}
                <span style="color:#000">
                    ${item.name} - ${item.price}€
                </span>
            </span>
            <button onclick="removeItem(${index})" ${hiddenItems.has(index) ? 'disabled' : ''}>
                Supprimer
            </button>`;
            if (hiddenItems.has(index)) { // Si l'article est masqué
                li.classList.add('hidden'); // Ajoute une classe CSS pour masquer l'article
            }
            listeCourse.appendChild(li); // Ajoute l'élément à la liste
        }
    });
    updateTotalPrice(); // Met à jour le prix total pour les articles visibles
    showEmptyMessage(); // Affiche le message si la liste est vide
}

// Fonction pour afficher un message lorsque la liste est vide
function showEmptyMessage() {
    const listeCourse = document.getElementById('listeCourse');
    if (listeCourse.innerHTML === '') {
        const li = document.createElement('li');
        li.innerText = 'Aucun élément dans la liste';
        listeCourse.appendChild(li);
    }
}

// Initialise la liste au chargement de la page
window.onload = displayItems; // Appelle displayItems() lorsque la page est chargée
