# Zakup auta 🚗️

- [Polski 🇵🇱️](#polski-)
- [English 🇬🇧️](#english-)

## Polski 🇵🇱️

"Zakup auta" jest aplikacją demonstracyjną typu SPA (Single Page Application) służącą do zakupu auta. Aplikacja składa się z trzech stron:

- List (listy samochodów)
- Form (formularza do zakupu auta)
- Summary (podsumowania zamówienia)

Projekt jest napisany w czystym JavaScript i wykorzystuje:

- session storage (do zapamiętywania danych z formularza)
- form validation (w oparciu o constraint validation api)
- komponenty
- router ⚠️
- API ⚠️

⚠️ Projekt zakłada wykorzystanie Github Pages dlatego część funkcjonalności jest improwizowana np.:

- API składające się ze statycznych plików JSON (`src/api`)
- router wykonany w oparciu o query string (`?view="strona"`)

### Budowanie i uruchamianie

Aby zbudować i uruchomić aplikację należy:

1. Zainstalować zależności

```bash
npm install
```

2. Zbudować aplikację\*

```bash
npm run dev
```

lub

```bash
npm run prod
```

3. Uruchomić na dowolnym serwerze\*

\*Zamiast kroków 2. i 3. można zbudować i uruchomić aplikację wykorzystując serwer deweloperski:

```bash
npm run serve
```

a następnie w przeglądarce przejść pod adres:

```
http://localhost:8080/
```

## English 🇬🇧️

"Zakup auta" is an SPA (Single Page Application) style demo application for buying a car. The application consists of three pages:

- List (car list)
- Form (car order form)
- Summary (car order summary)

The project is written in vanilla JavaScript and uses:

- session storage (to persist form data)
- form validation (using constraint validation api)
- components
- router ⚠️
- API ⚠️

⚠️ The project assumes the use of Github Pages, therefore some of the functionality is improvised, e.g.:

- API which constists of static JSON files (`src/api`)
- router which makes use of query string (`?view="page"`)

### Build and run

To build and run:

1. Install dependencies

```bash
npm install
```

2. Build application\*

```bash
npm run dev
```

or

```bash
npm run prod
```

3. Run using preferred web server\*

\*Instead of steps 2. and 3. you can build and run application using dev server:

```bash
npm run serve
```

and using your browser of choice navigate to:

```
http://localhost:8080/
```
