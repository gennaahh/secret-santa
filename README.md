# 🎅 Secret Santa

Sito con le regole del nostro Secret Santa, spiegate un passo alla volta.
Pensato soprattutto per il cellulare, ma funziona anche su tablet e PC.

- Fatto con [Vue 3](https://vuejs.org/) e [Vite](https://vite.dev/)
- Lo step a cui si è arrivati viene salvato nel browser (localStorage), quindi chiudendo e riaprendo la pagina si riparte da lì

## Avvio in locale

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Il risultato finisce nella cartella `dist/` e si può pubblicare su qualsiasi hosting statico (es. GitHub Pages, Netlify).

## Modificare gli step

Il testo degli step si trova in `src/data/steps.js`. Il testo tra `**doppi asterischi**` viene mostrato in grassetto.
