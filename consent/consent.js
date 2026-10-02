/* =========================================================
   SPISOTTI CONSENT
   Gestione consensi per servizi esterni
========================================================= */

(function () {

    "use strict";

    const STORAGE_KEY = "spisottiConsent";


    /* =====================================================
       LETTURA CONSENSI
    ===================================================== */

    function getConsent() {

        const saved = localStorage.getItem(STORAGE_KEY);

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

    function hasConsent(service) {

        const consent = getConsent();

        return consent[service] === true;

    }


    function setConsent(service, value) {

        const consent = getConsent();

        consent[service] = value === true;

        saveConsent(consent);

    }


    /* =====================================================
    YOUTUBE
    ===================================================== */

    function initYouTube() {

        const videos = document.querySelectorAll(
            ".spisotti-youtube"
        );

        videos.forEach(function (video) {

            const videoId = video.dataset.video;

            if (!videoId) {
                console.warn(
                    "Spisotti Consent: video YouTube senza data-video."
                );
                return;
            }

            console.log(
                "Spisotti Consent: trovato video YouTube:",
                videoId
            );

            const button = video.querySelector("button");

            if (!button) {
                return;
            }

            button.addEventListener("click", function () {

                if (hasConsent("youtube")) {

                    console.log(
                        "Spisotti Consent: YouTube autorizzato."
                    );

                } else {

                    console.log(
                        "Spisotti Consent: YouTube NON autorizzato."
                    );

                }

            });

        });

    }

    /* =====================================================
       API PUBBLICA
    ===================================================== */

    window.SpisottiConsent = {

        get: getConsent,

        has: hasConsent,

        set: setConsent

    };

    document.addEventListener(
        "DOMContentLoaded",
        function () {
            initYouTube();
        }
    );

})();