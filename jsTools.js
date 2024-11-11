
// ***********************************************************************
//
// FUNCTIONS DEFINITIONS
//
// ***********************************************************************
//

// Creo questa funzione perché scrivere tutte le volte 'console.log()' è una palla!
// uso la lettera 'w', che sta anche per 'write', perché è poco usata negli esercizi
const _W = (param, param1) => {
    param1 ? console.log(`${param}`, param1) : console.log(param)
}


// Funzione per mostrare i valori di un array
// Spacchetto l'array così non mi frega più il consol.log dell'altra volta che non mi mostrava i valori
// in tempo reale ma solo al momento della valutazione dell'array alla pressione del |> per espanderlo
// SOV = Show Object Values
const _SOV = (obj, objName, keyLength = 20, valueLength = 60) => {
    const truncate = (str, len) => (str.length > len ? str.substring(0, len - 3) + '...' : str)

    _W(`+${'-'.repeat(keyLength + valueLength + 5)}+`)
    _W(`| ${objName.padEnd(keyLength + valueLength + 3)} |`)
    _W(`+${'-'.repeat(keyLength + valueLength + 5)}+`)
    _W(`| ${'Key'.padEnd(keyLength)} | ${'Value'.padEnd(valueLength)} |`)
    _W(`+${'-'.repeat(keyLength + valueLength + 5)}+`)

    for (let key in obj) {
        _W(`| ${truncate(key, keyLength).padEnd(keyLength)} | ${truncate(String(obj[key]), valueLength).padEnd(valueLength)} |`)
    }
    _W(`+${'-'.repeat(keyLength + valueLength + 5)}+`)
    _W('')
}


// Funzione per la gestione del DEBUG
// Il primo parametro della funzione è il livello di debug richiesto
// La funzione può ricevere più parametri, in tal caso li mostra tutti
// Se il secondo parametro è un oggetto lo mostra con la funzione _SOV e usa il terzo parametro come suo nome
const _D = (...whatToDebug) => {
    if (whatToDebug[0] <= debugLevel) {
        if (typeof whatToDebug[1] === 'object') {
            // Se il secondo parametro della funzione di debug è un oggetto
            // allora lo mostro con la funzione _SOV e se c'è un terzo parametro
            // lo uso come nome dell'oggetto, altrimenti uso 'Object'
            _SOV(whatToDebug[1], whatToDebug[2] ? whatToDebug[2] : 'Object')
        } else {
            // Parto da 1 perché il primo parametro è il livello di debug
            for (let i = 1; i < whatToDebug.length; i++) {
                _W(whatToDebug[i]) // Stampa tutti i parametri tranne il primo
            }
        }
    }
}


// Funzione che ripulisce l'innerHTML da eventuali caratteri speciali che possono far casino
function escapeHTML(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}


// Funzione che minimizza l'HTML rimuovendo spazi e righe vuote
const minifyHTML = (html) => {
    return html
        .replace(/\r\n/g, '') // Rimuove le righe vuote1
        .replace(/\n/g, '') // Rimuove le righe vuote2
        .replace(/\t/g, '') // Rimuove i tab
        .replace(/\s\s+/g, ' ') // Spazi multipli diventano uno solo
        .replace(/>\s+</g, '><') // Leva gli spacchi tra i tag
        .replace(/<!--.*?-->/g, '') // Rimuove i commenti
}


// La funzione restituisce una stringa formata da un numero preceduto da zeri
// in modo che la lunghezza totale della stringa sia pari a size
const pad = (num, size) => {
    var s = "000000000" + num
    return s.slice(- size)
}


//
// ***********************************************************************
//
// VARIABLE DEFINITIONS
//
// ***********************************************************************
//

// A true abilita la visualizzazione dei log di debug
// (Andrebbe anche inserito un livello di debig perché altrimenti diventa
// decisamente troppo verboso...)
// const debugLevel = 3 // 0 = no debug, 1 = info, 2 = objects, 3 = verbose

// ***********************************************************************


//
// ***********************************************************************
//
// MAIN ROUTINE
//
// ***********************************************************************
//

// ***********************************************************************
