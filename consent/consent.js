/* =========================================================
   SPISOTTI CONSENT

   Gestione consensi per servizi esterni
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       CONFIGURAZIONE GENERALE
    ===================================================== */

    const STORAGE_KEY = "spisottiConsent";


    /*
       Catalogo generale dei servizi che
       Spisotti Consent è in grado di gestire.
    */

    const SERVICES = {

        youtube: {
            name: "YouTube",
            category: "external",
            description: "Video incorporati da YouTube"
        },

        googlemaps: {
            name: "Google Maps",
            category: "external",
            description: "Mappe interattive fornite da Google Maps"
        }

    };


    /* =====================================================
       CONFIGURAZIONE DEL SITO
    ===================================================== */

    /*
       Il sito deve dichiarare i servizi utilizzati PRIMA
       di caricare consent.js.

       Esempio:

       window.SpisottiConsentConfig = {
           version: 1,
           services: [
               "youtube"
           ]
       };
    */

    const CONFIG =
        window.SpisottiConsentConfig || {};


    const CONFIG_VERSION =
        CONFIG.version || 1;


    const ACTIVE_SERVICES =
        Array.isArray(CONFIG.services)
            ? CONFIG.services
            : [];


    /* =====================================================
       LETTURA CONSENSI
    ===================================================== */

    function getConsent() {

        const saved =
            localStorage.getItem(
                STORAGE_KEY
            );


        if (!saved) {
            return {};
        }


        try {

            const consent =
                JSON.parse(saved);


            /*
               Vecchio formato:
               mancano timestamp o versione.

               Non possiamo sapere quando sia stata
               effettuata la scelta, quindi viene
               considerata non più valida.
            */

            if (
                !consent._timestamp ||
                consent._version === undefined
            ) {

                localStorage.removeItem(
                    STORAGE_KEY
                );

                return {};

            }


            /*
               La configurazione del sito è cambiata.
            */

            if (
                consent._version !==
                CONFIG_VERSION
            ) {

                localStorage.removeItem(
                    STORAGE_KEY
                );

                return {};

            }


            /*
               Calcola la scadenza:
               6 mesi di calendario dalla scelta.
            */

            const consentDate =
                new Date(
                    consent._timestamp
                );


            const expirationDate =
                new Date(
                    consentDate
                );


            expirationDate.setMonth(
                expirationDate.getMonth() + 6
            );


            /*
               Consenso scaduto.
            */

            if (
                new Date() >=
                expirationDate
            ) {

                localStorage.removeItem(
                    STORAGE_KEY
                );

                return {};

            }


            return consent;


        } catch (error) {

            console.warn(
                "Spisotti Consent: impossibile leggere i consensi salvati.",
                error
            );


            localStorage.removeItem(
                STORAGE_KEY
            );


            return {};

        }

    }


    /* =====================================================
       SALVATAGGIO CONSENSI
    ===================================================== */

    function saveConsent(consent) {

        consent._timestamp =
            Date.now();


        consent._version =
            CONFIG_VERSION;


        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(consent)
        );

    }


    /* =====================================================
       CONSENSO SINGOLO SERVIZIO
    ===================================================== */

    function getServiceConsent(service) {

        const consent =
            getConsent();


        if (!(service in consent)) {
            return null;
        }


        return consent[service] === true;

    }


    function hasConsent(service) {

        return (
            getServiceConsent(service) === true
        );

    }


    function setConsent(
        service,
        value
    ) {

        const consent =
            getConsent();


        consent[service] =
            value === true;


        saveConsent(consent);

    }


    /* =====================================================
       CONTROLLO CONSENSI MANCANTI
    ===================================================== */

    function hasMissingConsent() {

        return ACTIVE_SERVICES.some(
            function (service) {

                return (
                    getServiceConsent(service) === null
                );

            }
        );

    }


    /* =====================================================
       ACCETTA TUTTO
    ===================================================== */

    function acceptAll() {

        const consent =
            getConsent();


        ACTIVE_SERVICES.forEach(
            function (service) {

                consent[service] = true;

            }
        );


        saveConsent(consent);

    }


    /* =====================================================
       RIFIUTA TUTTO
    ===================================================== */

    function rejectAll() {

        const consent =
            getConsent();


        ACTIVE_SERVICES.forEach(
            function (service) {

                consent[service] = false;

            }
        );


        saveConsent(consent);

    }


    /* =====================================================
       YOUTUBE
    ===================================================== */

    function loadYouTube(
        video,
        videoId
    ) {

        const iframe =
            document.createElement(
                "iframe"
            );


        iframe.src =
            "https://www.youtube-nocookie.com/embed/" +
            videoId +
            "?autoplay=1";


        iframe.title =
            "Video YouTube";


        iframe.allow =
            "accelerometer; autoplay; clipboard-write; " +
            "encrypted-media; gyroscope; picture-in-picture; web-share";


        iframe.referrerPolicy =
            "strict-origin-when-cross-origin";


        iframe.allowFullscreen =
            true;


        video.innerHTML =
            "";


        video.appendChild(
            iframe
        );

    }


    function showYouTubeConsent(
        video,
        videoId
    ) {

        video.innerHTML = `

            <div
                class="spisotti-consent-placeholder">

                <p>
                    Per visualizzare questo video è necessario
                    consentire il caricamento di contenuti da YouTube.
                </p>

                <button
                    type="button"
                    class="spisotti-consent-content-button
                           spisotti-consent-allow-youtube">

                    Consenti YouTube e riproduci

                </button>

            </div>

        `;


        const allowButton =
            video.querySelector(
                ".spisotti-consent-allow-youtube"
            );


        allowButton.addEventListener(
            "click",
            function () {

                setConsent(
                    "youtube",
                    true
                );


                loadYouTube(
                    video,
                    videoId
                );

            }
        );

    }


    function initYouTube() {

        if (
            !ACTIVE_SERVICES.includes(
                "youtube"
            )
        ) {
            return;
        }


        const videos =
            document.querySelectorAll(
                ".spisotti-consent-youtube"
            );


        videos.forEach(
            function (video) {

                const videoId =
                    video.dataset.video;


                if (!videoId) {

                    console.warn(
                        "Spisotti Consent: video YouTube senza data-video."
                    );

                    return;

                }


                const button =
                    video.querySelector(
                        "button"
                    );


                if (!button) {
                    return;
                }


                button.addEventListener(
                    "click",
                    function () {

                        if (
                            hasConsent(
                                "youtube"
                            )
                        ) {

                            loadYouTube(
                                video,
                                videoId
                            );

                        } else {

                            showYouTubeConsent(
                                video,
                                videoId
                            );

                        }

                    }
                );

            }
        );

    }


    /* =====================================================
    GOOGLE MAPS
    ===================================================== */

    function loadGoogleMaps(
        map,
        mapUrl
    ) {

        const iframe =
            document.createElement(
                "iframe"
            );


        iframe.src =
            mapUrl;


        iframe.title =
            "Google Maps";


        iframe.loading =
            "lazy";


        iframe.referrerPolicy =
            "no-referrer-when-downgrade";


        iframe.allowFullscreen =
            true;


        map.innerHTML =
            "";


        map.appendChild(
            iframe
        );

    }


    function showGoogleMapsConsent(
        map,
        mapUrl
    ) {

        map.innerHTML = `

            <div
                class="spisotti-consent-placeholder">

                <p>
                    Per visualizzare questa mappa è necessario
                    consentire il caricamento di contenuti da Google Maps.
                </p>

                <button
                    type="button"
                    class="spisotti-consent-content-button
                        spisotti-consent-allow-googlemaps">

                    Consenti Google Maps e visualizza

                </button>

            </div>

        `;


        const allowButton =
            map.querySelector(
                ".spisotti-consent-allow-googlemaps"
            );


        allowButton.addEventListener(
            "click",
            function () {

                setConsent(
                    "googlemaps",
                    true
                );


                loadGoogleMaps(
                    map,
                    mapUrl
                );

            }
        );

    }


    function initGoogleMaps() {

        if (
            !ACTIVE_SERVICES.includes(
                "googlemaps"
            )
        ) {
            return;
        }


        const maps =
            document.querySelectorAll(
                ".spisotti-consent-googlemaps"
            );


        maps.forEach(
            function (map) {

                const mapUrl =
                    map.dataset.map;


                if (!mapUrl) {

                    console.warn(
                        "Spisotti Consent: mappa Google Maps senza data-map."
                    );

                    return;

                }


                const button =
                    map.querySelector(
                        "button"
                    );


                if (!button) {
                    return;
                }


                button.addEventListener(
                    "click",
                    function () {

                        if (
                            hasConsent(
                                "googlemaps"
                            )
                        ) {

                            loadGoogleMaps(
                                map,
                                mapUrl
                            );

                        } else {

                            showGoogleMapsConsent(
                                map,
                                mapUrl
                            );

                        }

                    }
                );

            }
        );

    }

    /* =====================================================
       GENERAZIONE ELENCO SERVIZI
    ===================================================== */

    function createServicesHtml() {

        let html = "";


        ACTIVE_SERVICES.forEach(
            function (serviceId) {

                const service =
                    SERVICES[serviceId];


                if (!service) {

                    console.warn(
                        "Spisotti Consent: servizio sconosciuto:",
                        serviceId
                    );

                    return;

                }


                html += `

                    <label
                        class="spisotti-consent-service">

                        <span
                            class="spisotti-consent-service-text">

                            <strong>
                                ${service.name}
                            </strong>

                            <span>
                                ${service.description}
                            </span>

                        </span>


                        <input
                            type="checkbox"
                            data-consent-service="${serviceId}">

                    </label>

                `;

            }
        );


        return html;

    }


    /* =====================================================
       CHIUSURA PANNELLO
    ===================================================== */

    function removeConsentPanel() {

        const panel =
            document.getElementById(
                "spisotti-consent-banner"
            );


        if (panel) {
            panel.remove();
        }

    }


    /* =====================================================
       PANNELLO INIZIALE COMPATTO
    ===================================================== */

    function showConsentBanner(
        forcePreferences = false
    ) {

        /*
           Nessun servizio configurato:
           nessun pannello necessario.
        */

        if (
            ACTIVE_SERVICES.length === 0
        ) {
            return;
        }


        /*
           Se non stiamo aprendo manualmente le preferenze
           e tutte le scelte sono già state effettuate,
           non mostrare nulla.
        */

        if (
            !forcePreferences &&
            !hasMissingConsent()
        ) {
            return;
        }


        /*
           Evita pannelli duplicati.
        */

        removeConsentPanel();


        const banner =
            document.createElement(
                "div"
            );


        banner.id =
            "spisotti-consent-banner";


        banner.className =
            "spisotti-consent-banner";


        document.body.appendChild(
            banner
        );


        if (forcePreferences) {

            showPreferences(
                banner
            );

        } else {

            showCompactBanner(
                banner
            );

        }

    }


    /* =====================================================
       VISTA COMPATTA
    ===================================================== */

    function showCompactBanner(
        banner
    ) {

        banner.innerHTML = `

            <div
                class="spisotti-consent-panel
                       spisotti-consent-panel-compact">

                <h2>
                    Preferenze privacy
                </h2>

                <p class="spisotti-consent-text">
                    Alcuni contenuti esterni richiedono il tuo consenso
                    prima di essere caricati.
                </p>

                <a
                    href="/privacy.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="spisotti-consent-privacy-link">
                    Informativa privacy
                </a>


                <div
                    class="spisotti-consent-actions
                           spisotti-consent-actions-compact">

                    <button
                        type="button"
                        class="spisotti-consent-button
                               spisotti-consent-button-primary"
                        data-action="reject">

                        Rifiuta

                    </button>


                    <button
                        type="button"
                        class="spisotti-consent-button
                               spisotti-consent-button-primary"
                        data-action="preferences">

                        Personalizza

                    </button>


                    <button
                        type="button"
                        class="spisotti-consent-button
                               spisotti-consent-button-primary"
                        data-action="accept">

                        Accetta

                    </button>

                </div>

            </div>

        `;


        /* RIFIUTA */

        banner
            .querySelector(
                '[data-action="reject"]'
            )
            .addEventListener(
                "click",
                function () {

                    rejectAll();

                    removeConsentPanel();

                }
            );


        /* PERSONALIZZA */

        banner
            .querySelector(
                '[data-action="preferences"]'
            )
            .addEventListener(
                "click",
                function () {

                    showPreferences(
                        banner
                    );

                }
            );


        /* ACCETTA */

        banner
            .querySelector(
                '[data-action="accept"]'
            )
            .addEventListener(
                "click",
                function () {

                    acceptAll();

                    removeConsentPanel();

                }
            );

    }


    /* =====================================================
       VISTA PREFERENZE
    ===================================================== */

    function showPreferences(
        banner
    ) {

        const servicesHtml =
            createServicesHtml();


        banner.innerHTML = `

            <div
                class="spisotti-consent-panel
                       spisotti-consent-panel-preferences">

                <div
                    class="spisotti-consent-header">

                    <h2>
                        Preferenze privacy
                    </h2>

                    <button
                        type="button"
                        class="spisotti-consent-close"
                        aria-label="Chiudi preferenze privacy">

                        ×

                    </button>

                </div>


                <p
                    class="spisotti-consent-intro">

                    Scegli quali servizi esterni
                    possono essere caricati.

                </p>


                <p
                    class="spisotti-consent-intro">

                    Alcuni contenuti esterni richiedono
                    il tuo consenso prima di essere caricati.
                    <a href="/privacy.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="spisotti-consent-privacy-link">
                        Informativa privacy
                    </a>

                </p>


                <div
                    class="spisotti-consent-services">

                    ${servicesHtml}

                </div>


                <div
                    class="spisotti-consent-actions">

                    <button
                        type="button"
                        class="spisotti-consent-button
                               spisotti-consent-button-primary"
                        data-action="reject">

                        Rifiuta tutto

                    </button>


                    <button
                        type="button"
                        class="spisotti-consent-button
                               spisotti-consent-button-primary"
                        data-action="save">

                        Salva preferenze

                    </button>


                    <button
                        type="button"
                        class="spisotti-consent-button
                               spisotti-consent-button-primary"
                        data-action="accept">

                        Accetta tutto

                    </button>

                </div>

            </div>

        `;


        /* =================================================
           RIPRISTINA SCELTE ESISTENTI
        ================================================= */

        banner
            .querySelectorAll(
                "[data-consent-service]"
            )
            .forEach(
                function (checkbox) {

                    const service =
                        checkbox.dataset
                            .consentService;


                    checkbox.checked =
                        getServiceConsent(
                            service
                        ) === true;

                }
            );


        /* =================================================
           CHIUDI
        ================================================= */

        banner
            .querySelector(
                ".spisotti-consent-close"
            )
            .addEventListener(
                "click",
                function () {

                    removeConsentPanel();

                }
            );


        /* =================================================
           RIFIUTA TUTTO
        ================================================= */

        banner
            .querySelector(
                '[data-action="reject"]'
            )
            .addEventListener(
                "click",
                function () {

                    rejectAll();

                    removeConsentPanel();

                }
            );


        /* =================================================
           SALVA
        ================================================= */

        banner
            .querySelector(
                '[data-action="save"]'
            )
            .addEventListener(
                "click",
                function () {

                    const consent =
                        getConsent();


                    banner
                        .querySelectorAll(
                            "[data-consent-service]"
                        )
                        .forEach(
                            function (
                                checkbox
                            ) {

                                const service =
                                    checkbox
                                        .dataset
                                        .consentService;


                                consent[service] =
                                    checkbox.checked;

                            }
                        );


                    saveConsent(
                        consent
                    );


                    removeConsentPanel();

                }
            );


        /* =================================================
           ACCETTA TUTTO
        ================================================= */

        banner
            .querySelector(
                '[data-action="accept"]'
            )
            .addEventListener(
                "click",
                function () {

                    acceptAll();

                    removeConsentPanel();

                }
            );

    }


    /* =====================================================
       PULSANTE / LINK PREFERENZE NEL FOOTER
    ===================================================== */

    function initConsentSettings() {

        const button =
            document.getElementById(
                "spisotti-consent-settings"
            );


        if (!button) {
            return;
        }


        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                showConsentBanner(
                    true
                );

            }
        );

    }


    /* =====================================================
       API PUBBLICA
    ===================================================== */

    window.SpisottiConsent = {

        get:
            getConsent,

        status:
            getServiceConsent,

        has:
            hasConsent,

        set:
            setConsent,

        acceptAll:
            acceptAll,

        rejectAll:
            rejectAll,

        settings:
            function () {

                showConsentBanner(
                    true
                );

            }

    };


    /* =====================================================
       AVVIO
    ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            initYouTube();

            initGoogleMaps();

            showConsentBanner();

            initConsentSettings();


        }
    );


})();