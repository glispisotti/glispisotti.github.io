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
       Catalogo dei servizi che Spisotti Consent
       è in grado di gestire.

       ATTENZIONE:
       questo NON significa che tutti questi servizi
       siano utilizzati dal sito.
    */

    const SERVICES = {

        youtube: {
            name: "YouTube",
            category: "external",
            description: "Video incorporati da YouTube"
        }

    };


    /* =====================================================
       CONFIGURAZIONE DEL SITO
    ===================================================== */

    /*
       Ogni sito deve dichiarare i servizi che utilizza:

       window.SpisottiConsentConfig = {
           services: [
               "youtube"
           ]
       };

       La configurazione deve essere dichiarata PRIMA
       del caricamento di consent.js.
    */

    const CONFIG =
        window.SpisottiConsentConfig || {};


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

            return JSON.parse(saved);

        } catch (error) {

            console.warn(
                "Spisotti Consent: impossibile leggere i consensi salvati.",
                error
            );

            return {};

        }

    }


    /* =====================================================
       SALVATAGGIO CONSENSI
    ===================================================== */

    function saveConsent(consent) {

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
            "https://www.youtube.com/embed/" +
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
                    class="spisotti-consent-allow-youtube">

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

        /*
           Se questo sito non utilizza YouTube,
           non facciamo nulla.
        */

        if (
            !ACTIVE_SERVICES.includes(
                "youtube"
            )
        ) {
            return;
        }


        const videos =
            document.querySelectorAll(
                ".spisotti-youtube"
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
       GENERAZIONE ELENCO SERVIZI
    ===================================================== */

    function createServicesHtml() {

        let html = "";


        ACTIVE_SERVICES.forEach(
            function (serviceId) {

                const service =
                    SERVICES[serviceId];


                /*
                   Se il sito dichiara un servizio
                   che il manager non conosce,
                   lo ignoriamo e segnaliamo
                   il problema in console.
                */

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

                        <input
                            type="checkbox"
                            data-consent-service="${serviceId}">

                        <span>

                            <strong>
                                ${service.name}
                            </strong>

                            <span>
                                ${service.description}
                            </span>

                        </span>

                    </label>

                `;

            }
        );


        return html;

    }


    /* =====================================================
       BANNER CONSENSO
    ===================================================== */

    function showConsentBanner(
        force = false
    ) {

        /*
           Se il sito non utilizza alcun servizio
           soggetto al nostro consent manager,
           il banner non deve comparire.
        */

        if (
            ACTIVE_SERVICES.length === 0
        ) {
            return;
        }


        /*
           Se tutti i servizi hanno già
           una scelta salvata,
           non mostrare automaticamente
           il banner.
        */

        if (
            !force &&
            !hasMissingConsent()
        ) {
            return;
        }


        /*
           Evita banner duplicati.
        */

        if (
            document.getElementById(
                "spisotti-consent-banner"
            )
        ) {
            return;
        }


        const banner =
            document.createElement(
                "div"
            );


        banner.id =
            "spisotti-consent-banner";


        const servicesHtml =
            createServicesHtml();


        banner.innerHTML = `

            <div
                class="spisotti-consent-banner-content">

                <h2>
                    Preferenze privacy
                </h2>

                <p>
                    Questo sito utilizza servizi esterni
                    che possono comportare il trattamento
                    di dati da parte di terze parti.
                </p>


                <div
                    class="spisotti-consent-services">

                    ${servicesHtml}

                </div>


                <div
                    class="spisotti-consent-buttons">

                    <button
                        type="button"
                        id="spisotti-consent-reject">

                        Rifiuta tutto

                    </button>


                    <button
                        type="button"
                        id="spisotti-consent-save">

                        Salva preferenze

                    </button>


                    <button
                        type="button"
                        id="spisotti-consent-accept">

                        Accetta tutto

                    </button>

                </div>

            </div>

        `;


        document.body.appendChild(
            banner
        );


        /* =================================================
           CARICA PREFERENZE ESISTENTI
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
           RIFIUTA TUTTO
        ================================================= */

        banner
            .querySelector(
                "#spisotti-consent-reject"
            )
            .addEventListener(
                "click",
                function () {

                    rejectAll();

                    banner.remove();

                }
            );


        /* =================================================
           SALVA PREFERENZE
        ================================================= */

        banner
            .querySelector(
                "#spisotti-consent-save"
            )
            .addEventListener(
                "click",
                function () {

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


                                setConsent(
                                    service,
                                    checkbox.checked
                                );

                            }
                        );


                    banner.remove();

                }
            );


        /* =================================================
           ACCETTA TUTTO
        ================================================= */

        banner
            .querySelector(
                "#spisotti-consent-accept"
            )
            .addEventListener(
                "click",
                function () {

                    acceptAll();

                    banner.remove();

                }
            );

    }


    /* =====================================================
       PULSANTE PREFERENZE PRIVACY
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
            function () {

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

            showConsentBanner();

            initConsentSettings();

        }
    );


})();