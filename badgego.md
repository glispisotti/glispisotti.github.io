---
layout: progetto
title: "BadgeGO"
description: "Una piccola web app interna, costruita intorno alle esigenze di chi la usa."
permalink: /progetti/badgego/
image: /images/progetti/badgego/collage.png
position: "30"
cover: "/images/progetti/badgego/preview.png"
---

<p class="project-lead">
Tutto è partito da un'esigenza interna piuttosto semplice: avevamo bisogno di uno strumento per gestire le presenze del personale.<br>

Naturalmente esistono decine di gestionali che fanno questo mestiere. Il problema è che fanno anche moltissime altre cose, non necessariamente quelle che servivano a noi, e spesso richiedono di adattare il proprio modo di lavorare al funzionamento del software.<br>

E poi c'era un'altra questione: perché pagare un canone per sempre per uno strumento che non sarebbe comunque stato esattamente quello che volevamo?<br>

A un certo punto la domanda è venuta quasi da sola: <strong>e se provassimo a costruircelo?</strong><br>

Così è nato BadgeGO.
</p>


<div class="project-grid">

  <div class="project">
    <img
      src="{{ '/images/progetti/badgego/badge.png' | relative_url }}"
      alt="La schermata principale di BadgeGO">
  </div>

  <div class="project">
    <img
      src="{{ '/images/progetti/badgego/comunicazioni.png' | relative_url }}"
      alt="La sezione comunicazioni di BadgeGO">
  </div>

  <div class="project">
    <img
      src="{{ '/images/progetti/badgego/calendario.png' | relative_url }}"
      alt="Il calendario di BadgeGO">
  </div>

</div>


## L'idea

L'obiettivo iniziale non era creare un gestionale.

Anzi, era quasi il contrario: costruire uno strumento molto piccolo, che facesse poche cose e le facesse nel modo che serviva a noi.

La prima esigenza era quella di avere un **badge virtuale**, utilizzabile anche da telefono, attraverso il quale registrare in modo semplice l'entrata e l'uscita dal lavoro.

Niente software da installare sui computer, niente terminale fisico da acquistare e soprattutto niente piattaforma sovradimensionata rispetto alle nostre necessità.

Una piccola web app interna era più che sufficiente.


<div class="cards">

  <div class="card">
    <h3>Semplice</h3>
    <p>
      Le operazioni utilizzate ogni giorno devono richiedere
      il minor numero possibile di passaggi.
    </p>
  </div>

  <div class="card">
    <h3>Su misura</h3>
    <p>
      Non adattare il lavoro al software, ma costruire
      il software intorno al modo in cui lavoriamo.
    </p>
  </div>

</div>


## Il primo BadgeGO

La prima versione faceva sostanzialmente una cosa: il badge.

Ogni operatore aveva il proprio accesso e, una volta effettuato il login, poteva registrare l'entrata e l'uscita attraverso un pulsante.

L'idea era quella di riprodurre il gesto più semplice possibile: arrivare, aprire BadgeGO e timbrare.

Da qui è nata anche la scelta di trasformarlo in una **Progressive Web App (PWA)**: BadgeGO può essere aggiunto alla schermata principale del telefono e utilizzato come una normale app, pur rimanendo una web app.


<!--
Qui starebbe bene uno screenshot grande della schermata Badge.

<img
  src="{{ '/images/progetti/badgego/badge-home.png' | relative_url }}"
  alt="Il badge virtuale di BadgeGO">
-->


## Poi ha cominciato a crescere

Una volta costruita la struttura di base, è successo quello che succede spesso con gli strumenti fatti in casa.

È venuta voglia di aggiungere qualcosa.

Poi qualcos'altro.

E, soprattutto, sono emerse nuove esigenze nell'uso quotidiano.

BadgeGO ha così iniziato a trasformarsi da semplice badge virtuale in un piccolo punto di accesso agli strumenti interni.


<div class="cards">

  <div class="card">
    <h3>Badge</h3>
    <p>
      Registrazione delle entrate e delle uscite attraverso
      un'interfaccia pensata soprattutto per lo smartphone.
    </p>
  </div>

  <div class="card">
    <h3>Comunicazioni</h3>
    <p>
      Uno spazio nel quale raccogliere avvisi e informazioni
      utili per il personale.
    </p>
  </div>

  <div class="card">
    <h3>Calendario</h3>
    <p>
      Gli appuntamenti e le attività condivise diventano
      consultabili direttamente dall'app.
    </p>
  </div>

</div>


## Costruirlo mentre lo usiamo

Probabilmente questa è la caratteristica più importante di BadgeGO.

Non esiste un progetto iniziale che stabilisce tutto quello che l'app dovrà fare.

Le funzioni vengono aggiunte quando emerge un'esigenza reale.

Se qualcosa nell'utilizzo quotidiano risulta scomodo, si prova a cambiarlo. Se manca uno strumento che potrebbe essere utile a tutti, si valuta se inserirlo. Se una funzione non serve, semplicemente non c'è.

BadgeGO cresce insieme alle persone che lo utilizzano.


<!--
Qui potremmo mettere una sequenza di schermate o una piccola
timeline visuale:

01 — Badge
02 — PWA
03 — Comunicazioni
04 — Calendario
05 — ...
-->


## Sotto il cofano

BadgeGO è volutamente costruito con strumenti semplici.

La parte applicativa utilizza **Google Apps Script**, mentre l'interfaccia è realizzata in **HTML, CSS e JavaScript**.

I servizi Google già utilizzati dall'organizzazione possono essere integrati direttamente nell'applicazione: è il caso, per esempio, di **Google Calendar**.

La struttura come PWA permette inoltre di utilizzare BadgeGO da smartphone in maniera molto simile a un'app tradizionale, senza dover sviluppare e distribuire un'applicazione attraverso gli store.


<div class="cards">

  <div class="card">
    <h3>Google Apps Script</h3>
    <p>
      La logica dell'applicazione e il collegamento
      con gli strumenti Google.
    </p>
  </div>

  <div class="card">
    <h3>HTML + CSS + JavaScript</h3>
    <p>
      Un'interfaccia costruita da zero e adattata
      progressivamente all'utilizzo da desktop e smartphone.
    </p>
  </div>

</div>


## Non serviva un gestionale

Alla fine BadgeGO nasce soprattutto da questo.

Non dalla voglia di sviluppare un'app, ma da un problema molto concreto per il quale le soluzioni esistenti sembravano troppo grandi, troppo rigide o semplicemente poco adatte.

Costruirne una nostra ha significato poter partire esattamente da ciò che ci serviva, senza sapere necessariamente fin dall'inizio dove saremmo arrivati.

E BadgeGO, in effetti, non è ancora arrivato da nessuna parte.

Continua a cambiare ogni volta che ci viene in mente qualcosa che potrebbe renderlo un po' più utile.