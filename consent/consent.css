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
       API PUBBLICA
    ===================================================== */

    window.SpisottiConsent = {

        get: getConsent,

        has: hasConsent,

        set: setConsent

    };

})();