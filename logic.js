// ***********************************************************************
//
// FUNCTIONS DEFINITIONS
//
// ***********************************************************************
//

// Funzione che restituisce l'HTML in base al template e ai dati passati
// Questa funzione è stata creata per generare l'HTML degli articoli ed eventualmente
// di altri elementi che potrebbero essere aggiunti in futuro
const getHTMLFromTemplate = (template, data, minify = true,) => {

    // Genera componenti dell'HTML non direttamente presenti nell'array dei dati.
    // li inserisce direttamente nll'array per poter essere utilizzati nel template
    // HTML finale

    // Vedo che cosa c'è dentro l'oggetto strano...

    let html = ''
    switch (template) {

        case 'genresDropDown': {

            html = `
            <!-------------------------------------------------------------------->
            <!-- genresDropDown ${pad(data.order, 2)} -->
            <!-------------------------------------------------------------------->
            <li>
                <a class="dropdown-item" href="${data.itemLink}">${data.itemTitle}</a>
            </li>
            <!-------------------------------------------------------------------->
            <!-- genresDropDown ${pad(data.order, 2)} -->
            <!-------------------------------------------------------------------->
            `
            break
        }

        case 'trendingNowCards':
        case 'watchItAgainCards':
        case 'newReleasesCards': {

            html = `
            <!-------------------------------------------------------------------->
            <!-- trendingNowCards ${pad(data.order, 2)} -->
            <!-------------------------------------------------------------------->
            <div class="d-inline-block me-2" data-bs-toggle="modal" data-bs-target="#cardInfoModal">
                <img id="${data.imgSrc}" width="300px" src="./assets/media/${data.imgSrc}" class="" alt="${data.title}">
            </div>
            <!-------------------------------------------------------------------->
            <!-- trendingNowCards ${pad(data.order, 2)} -->
            <!-------------------------------------------------------------------->
            `
            break
        }

        default:
            _D(1, `getHTMLFromTemplate - Template "${template}" non riconosciuto`)
            break
    }

    // Vedo l'html prima della minificazione
    _D(3, `getHTMLFromTemplate html:\r\n ${html}`)

    html = minify ? minifyHTML(html) : html // Minifica l'HTML se minify è true
    return html // Restituisce l'HTML generato alla fine della funzione
}


// Funzione per la generazione delle nav (non navbar)
// Prende in input l'id del padre a cui dovrà essere attaccata e un array di link con le relative classi e id
// altri input sono il tag di iniziao e il tag di chiusura (il default è '<ul class="nav">' e '</ul>')
const generateNavOrDropDown = (parentId, type, data, startingTag = `<ul class="${type}">`, closingTag = '</ul>') => {

    _D(1, `generateNavOrDropDown - generate navBar for ${parentId}`)

    const navItems = data.filter((item) => (item.type === type && item.parentId === parentId))

    // Se non ci sono record da eleborare esce dalla funzione
    if (navItems.length === 0) {
        _D(1, `generateNavOrDropDown - generate navBar for ${parentId}: NO ITEMS FOUND!`)
        return
    }


    if (navItems.length !== 0) {
        // Verifico se esiste un elemento con l'ID della navbar
        const navParent = document.getElementById(parentId)

        if (navParent) {

            // Se trova qualcosa..
            _D(3, navItems, `generateNavOrDropDown: navItems`)

            // Se esiste, chiamo la funzione per creare la navbar
            // partendo dall'elemento 'ul'
            let ulElement = startingTag
            // Ordino gli elementi in base alla chiave 'order'
            // Poi eseguo il loop per tutti gli elementi oramai ordinati
            navItems
                .sort((a, b) => a.order - b.order)
                .forEach((item, index) => {

                    // Vedo che cosa c'è dentro l'oggetto strano...
                    _D(2, `generateNavOrDropDown: item index ${index}`)
                    _D(3, item, `generateNavOrDropDown: item`)

                    // Minifico...
                    const liElement = minifyHTML(`
                        <li
                            ${item.itemId !== '' ? ` id="${item.itemId}"` : ''}
                            ${item.itemClass !== '' ? ` class="${item.itemClass}"` : ` class="${type}-item"`}
                            >
                            <a href="${item.itemLink !== '' ? item.itemLink : '#'}"
                                ${item.itemLinkId !== '' ? ` id="${item.itemLinkId}"` : ''}
                                ${item.itemLinkClass !== '' ? ` class="${item.itemLinkClass}"` : ` class="${type}-link"`}
                                ${item.itemTarget !== '' ? ` target="${item.itemTarget}"` : ''}
                            >${item.itemTitle}</a>
                        </li>
                        `)
                    _D(3, `generateNavOrDropDown: liElement`, liElement,)

                    // Aggiunge l'elemento 'li' all'elemento 'ul'
                    ulElement += liElement
                })

            // Chiude l'elemento 'ul'
            ulElement += closingTag

            // Visualizza l'oggetto strano...
            _D(2, `generateNavOrDropDown: ulElement`, ulElement)

            // Filtra gli elementi per 'article' e costruisce gli articoli
            _D(1, 'generateNavOrDropDown - fire children')
            navParent.innerHTML += ulElement
        }
        else {
            _D(1, `generateNavOrDropDown - generate navBar for ${parentId}: NO PARENT FOUND!`)
            return
        }
    }
}



// Questo è il contenuto che verrà utilizzato per creare le navbar e gli articoli
const createPageElements = (contents) => {
    // Inizializza l'array per raggruppare i contenuti per navbar
    const groupedByParent = {}

    contents.forEach((item) => {
        if (!groupedByParent[item.parentId]) {
            groupedByParent[item.parentId] = []
        }
        // Aggiunge l'elemento all'array raggruppato, in questo modo i contenuti sono raggruppati
        // sotto la stessa chiave che ha lo stesso nome dell'ID del parente di riferimento
        groupedByParent[item.parentId].push(item)
    })

    _D(3, groupedByParent, 'groupedByParent')

    // Creo la navBar vera e proprio concatenando una serie di metodi
    // Comincio eseguendo un loop sulle chiavi dell'oggetto raggruppato
    Object.entries(groupedByParent)
        .forEach(([parentId, childItems]) => {

            // Vedo chi è il padre
            _D(2, `createPageElements - parentId: ${parentId}`)
            _D(2, `createPageElements - childItems: ${childItems}`)


            // *************************************************************
            // CARDS
            // *************************************************************
            const cards = childItems.filter((item) => item.type === 'card')
            _D(1, 'createPageElements - generate cards')

            // Vedo che cosa c'è dentro l'oggetto strano...
            _D(3, cards, 'cards')

            if (cards.length !== 0) {
                // Verifico se esiste un elemento con l'ID della dropDown
                const elementParent = document.getElementById(parentId)
                _D(3, `elementParentInnerHTML: ${elementParent.innerHTML}`)

                let cardsHTML = ''
                if (elementParent) {
                    // Ordino gli elementi in base alla chiave 'order'
                    // Poi eseguo il loop per tutti gli elementi oramai ordinati
                    cardsHTML = ''//'<div class="card">'
                    cards
                        .sort((a, b) => a.order - b.order)
                        .forEach((item, index) => {

                            // Vedo che cosa c'è dentro l'oggetto strano...
                            _D(2, `createPageElements - cards index: ${index}`)

                            // Crea l'HTML del singolo articolo e lo aggiunge a quello esistente
                            cardsHTML += getHTMLFromTemplate(parentId, item)
                        })
                }
                // Chiude la navbar
                cardsHTML += '' //'</div>'

                _D(3, 'cardsHTML', cardsHTML)

                // Finito il ciclo lo attacca al parente accodandolo
                elementParent.innerHTML += cardsHTML
            } // End IF
        })
}

const addScrollEventHandlers = (section) => {

    _D(1, `addScrollEventHandlers - section: ${section}`);

    const leftArrow = document.getElementById(`${section}Previous`);
    const rightArrow = document.getElementById(`${section}Next`);
    const scrollBox = document.getElementById(`${section}Cards`);

    leftArrow.addEventListener('click', () => {
        _D(1, `scrollBox - section: ${section} left`);
        scrollBox.scrollLeft -= scrollAmount;
    });

    rightArrow.addEventListener('click', () => {
        _D(1, `scrollBox - section: ${section} right`);
        scrollBox.scrollLeft += scrollAmount;
    });
}


const addImageClickHandlers = () => {
    const images = document.querySelectorAll('img');
    images.forEach((image) => {
        image.addEventListener('click', () => {
            _D(1, `addImageClickHandlers - image clicked: ${image.id}`);

            const modalTitle = document.getElementById('modalTitle');
            const modalBody = document.getElementById('modalBody');

            // Recupera la card corrispondente all'immagine cliccata
            const card = CONTENTS.find((card) => card.imgSrc === image.id);
            _D(2, `addImageClickHandlers - card: ${card}`);

            // Crea il body del modal
            const modelBodyHTML = `
                <img id="${card.imgSrc}" width="100%" src="./assets/media/${card.imgSrc}" class="" alt="${card.title}">
                <h5 class="text-red-NF mt-3">Info</h5>
                <ul>
                    <li>Year: ${card.year}</li>
                    <li>IMDB: <a href="${card.imdbLink}" target="_blank">${card.imdbLink}</a></li>
                </ul>
                <h5 class="text-red-NF mt-3">Description</h5>
                <p>${card.description}</p>
                <h5 class="text-red-NF mt-3">Cast</h5>
                <p>${card.cast.join(', ')}</p>
                `
            // Carica l'html del modal
            modalTitle.innerHTML = card.title;
            modalBody.innerHTML = modelBodyHTML;
        });
    });
}

const addListTypeEventHandlers = () => {
    const cardsAsList = document.getElementById('cardsAsList');
    const cardsAsGrid = document.getElementById('cardsAsGrid');

    const cardsT = document.getElementById('trendingNowCards');
    const cardsW = document.getElementById('watchItAgainCards');
    const cardsN = document.getElementById('newReleasesCards');

    const chevrons = document.querySelectorAll('[id*="Previous"]>i, [id*="Next"]>i');

    cardsAsList.addEventListener('click', () => {
        _D(1, 'addListTypeEventHandlers - cardsAsList clicked');

        cardsT.classList.toggle('flex-wrap');
        cardsT.classList.toggle('justify-content-center');

        cardsW.classList.toggle('flex-wrap');
        cardsW.classList.toggle('justify-content-center');

        cardsN.classList.toggle('flex-wrap');
        cardsN.classList.toggle('justify-content-center');

        chevrons.forEach((chevron) => {
            chevron.classList.toggle('invisible');
        });
    });

    cardsAsGrid.addEventListener('click', () => {
        _D(1, 'addListTypeEventHandlers - cardsAsGrid clicked');

        cardsT.classList.toggle('flex-wrap');
        cardsT.classList.toggle('justify-content-center');

        cardsW.classList.toggle('flex-wrap');
        cardsW.classList.toggle('justify-content-center');

        cardsN.classList.toggle('flex-wrap');
        cardsN.classList.toggle('justify-content-center');

        chevrons.forEach((chevron) => {
            chevron.classList.toggle('invisible');
        });
    });
}

// ***********************************************************************


//
// ***********************************************************************
//
// VARIABLE DEFINITIONS
//
// ***********************************************************************
//
const debugLevel = 1;
const scrollAmount = 300; // Quantità  di scorrimento desiderata

// ***********************************************************************


//
// ***********************************************************************
//
// MAIN ROUTINE
//
// ***********************************************************************
//
if (window.location.pathname.endsWith('index.html')) {
    document.addEventListener('DOMContentLoaded', () => {

        const searchMagnifier = document.getElementById('searchMagnifier');
        _D(3, 'searchMagnifier', searchMagnifier);
        searchMagnifier.addEventListener('click', () => {
            _D(1, 'searchMagnifier clicked');
            const searchForm = document.getElementById('searchForm');
            searchForm.classList.toggle('d-none');
        });

        generateNavOrDropDown('topNavBar', 'nav', CONTENTS, '<ul class="navbar-nav">')
        generateNavOrDropDown('footerLinks1', 'nav', CONTENTS, '<ul class="nav flex-column">')
        generateNavOrDropDown('footerLinks2', 'nav', CONTENTS, '<ul class="nav flex-column">')
        generateNavOrDropDown('footerLinks3', 'nav', CONTENTS, '<ul class="nav flex-column">')
        generateNavOrDropDown('footerLinks4', 'nav', CONTENTS, '<ul class="nav flex-column">')

        generateNavOrDropDown('profileDropDown', 'dropdown', CONTENTS, '<ul class="dropdown-menu dropdown-menu-end">')
        generateNavOrDropDown('genresDropDown', 'dropdown', CONTENTS, '<ul class="dropdown-menu fs-7">')

        createPageElements(CONTENTS)

        addListTypeEventHandlers()

        addScrollEventHandlers('trendingNow')
        addScrollEventHandlers('watchItAgain')
        addScrollEventHandlers('newReleases')

        addImageClickHandlers()
    });
}

if (window.location.pathname.endsWith('profile.html')) {
    document.addEventListener('DOMContentLoaded', () => {

        const maturityRatingSettings = document.getElementById('maturityRatingSettings');
        _D(3, 'maturityRatingSettings', maturityRatingSettings);


        // Leggi il valore al caricamento della pagina
        const initialValue = maturityRatingSettings.value;
        _D(1, `maturityRatingSettings initial value: ${initialValue}`);

        const maturityRatingInfo = document.getElementById('maturityRatingInfo');
        maturityRatingInfo.innerText = parseInt(initialValue)
            ? `Show title for people older then ${initialValue} this profile`
            : 'Show title for all maturity ratings on this profile';

        maturityRatingSettings.addEventListener('change', () => {
            const selectedValue = maturityRatingSettings.value;
            _D(1, `maturityRatingSettings changed: ${selectedValue}`);
            maturityRatingInfo.innerText = parseInt(selectedValue)
                ? `Show title for people older then ${selectedValue} years on this profile`
                : 'Show title for all maturity ratings on this profile';
        });

        generateNavOrDropDown('footerLinks1', 'nav', CONTENTS, '<ul class="nav flex-column">')
        generateNavOrDropDown('footerLinks2', 'nav', CONTENTS, '<ul class="nav flex-column">')
        generateNavOrDropDown('footerLinks3', 'nav', CONTENTS, '<ul class="nav flex-column">')
        generateNavOrDropDown('footerLinks4', 'nav', CONTENTS, '<ul class="nav flex-column">')

    })
};
// ***********************************************************************