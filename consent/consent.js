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
    function getServiceConsent(service) {

        const consent = getConsent();

        if (!(service in consent)) {
            return null;
        }

        return consent[service] === true;

    }



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

    function loadYouTube(video, videoId) {

        const iframe = document.createElement("iframe");

        iframe.src =
            "https://www.youtube.com/embed/" +
            videoId +
            "?autoplay=1";

        iframe.title = "Video YouTube";

        iframe.allow =
            "accelerometer; autoplay; clipboard-write; " +
            "encrypted-media; gyroscope; picture-in-picture; web-share";

        iframe.referrerPolicy =
            "strict-origin-when-cross-origin";

        iframe.allowFullscreen = true;

        video.innerHTML = "";
        video.appendChild(iframe);

    }

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

                    loadYouTube(
                        video,
                        videoId
                    );

                } else {

                    video.innerHTML = `
                        <div class="spisotti-consent-placeholder">

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

                    const allowButton = video.querySelector(
                        ".spisotti-consent-allow-youtube"
                    );

                    allowButton.addEventListener("click", function () {

                        setConsent(
                            "youtube",
                            true
                        );

                        loadYouTube(
                            video,
                            videoId
                        );

                    });

                }
            });

        });

    }

    /* =====================================================
       API PUBBLICA
    ===================================================== */

    window.SpisottiConsent = {

        get: getConsent,

        status: getServiceConsent,

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