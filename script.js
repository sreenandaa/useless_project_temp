/* ================================= */
/* GET HTML ELEMENTS */
/* ================================= */

const introScreen =
    document.getElementById("introScreen");

const scannerScreen =
    document.getElementById("scannerScreen");

const startButton =
    document.getElementById("startButton");

const backButton =
    document.getElementById("backButton");

const camera =
    document.getElementById("camera");

const canvas =
    document.getElementById("canvas");

const scanStatus =
    document.getElementById("scanStatus");

const pinkPercentage =
    document.getElementById("pinkPercentage");

const ctx =
    canvas.getContext("2d");


/* ================================= */
/* CAMERA STREAM */
/* ================================= */

let cameraStream = null;


/* ================================= */
/* START BUTTON */
/* ================================= */

startButton.addEventListener(
    "click",
    startScanner
);


/* ================================= */
/* START SCANNER */
/* ================================= */

async function startScanner() {

    /* Hide first screen */

    introScreen.classList.add("hidden");

    /* Show scanner */

    scannerScreen.classList.remove("hidden");


    try {

        /* Ask browser for camera */

        cameraStream =
            await navigator.mediaDevices
                .getUserMedia({

                    video: {
                        facingMode: "environment"
                    },

                    audio: false

                });


        /* Put camera inside video */

        camera.srcObject =
            cameraStream;


        /* Start looking for pink */

        detectPink();


    } catch (error) {

        console.error(error);

        scanStatus.textContent =
            "CAMERA ACCESS DENIED";

        pinkPercentage.textContent =
            "0%";

    }

}


/* ================================= */
/* PINK DETECTION */
/* ================================= */

function detectPink() {

    /* Draw current camera frame
       onto invisible canvas */

    ctx.drawImage(
        camera,
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* Get all pixels */

    const imageData =
        ctx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
        );


    const pixels =
        imageData.data;


    let pinkPixels = 0;

    let totalPixels = 0;


    /*
        We don't need to inspect
        every single pixel.

        Checking every 4th pixel
        is enough and faster.
    */

    for (
        let i = 0;
        i < pixels.length;
        i += 16
    ) {

        const red =
            pixels[i];

        const green =
            pixels[i + 1];

        const blue =
            pixels[i + 2];


        /*
            Convert RGB to HSV
        */

        const hsv =
            rgbToHsv(
                red,
                green,
                blue
            );


        const hue =
            hsv.h;

        const saturation =
            hsv.s;

        const value =
            hsv.v;


        /*
            Detect pink.

            This includes:
            - light pink
            - hot pink
            - rose
            - magenta-ish pink
            - darker pink
        */

        const isPink =
            (
                (
                    hue >= 300 ||
                    hue <= 15
                )
                &&
                saturation >= 0.20
                &&
                value >= 0.35
            );


        if (isPink) {

            pinkPixels++;

        }

        totalPixels++;

    }


    /* Calculate percentage */

    const percentage =
        Math.round(
            (pinkPixels / totalPixels) * 100
        );


    pinkPercentage.textContent =
        percentage + "%";


    /*
        If enough pink is visible,
        pink has been found.
    */

    if (percentage >= 8) {

        pinkFound();

        return;

    }


    /*
        Keep scanning.
    */

    requestAnimationFrame(
        detectPink
    );

}


/* ================================= */
/* RGB → HSV */
/* ================================= */

function rgbToHsv(r, g, b) {

    r /= 255;
    g /= 255;
    b /= 255;


    const max =
        Math.max(r, g, b);

    const min =
        Math.min(r, g, b);

    const difference =
        max - min;


    let h = 0;

    let s = 0;

    const v = max;


    if (difference !== 0) {

        s =
            difference / max;


        switch (max) {

            case r:

                h =
                    60 *
                    (
                        ((g - b) / difference)
                        % 6
                    );

                break;


            case g:

                h =
                    60 *
                    (
                        ((b - r) / difference)
                        + 2
                    );

                break;


            case b:

                h =
                    60 *
                    (
                        ((r - g) / difference)
                        + 4
                    );

                break;

        }

    }


    if (h < 0) {

        h += 360;

    }


    return {
        h: h,
        s: s,
        v: v
    };

}


/* ================================= */
/* PINK FOUND */
/* ================================= */

function pinkFound() {

    scanStatus.textContent =
        "✨ PINK FOUND ✨";


    pinkPercentage.textContent =
        "DETECTED";


    /*
        Stop camera.
    */

    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(
                track => track.stop()
            );

    }


    /*
        For now, wait 2 seconds
        and show an alert.

        We'll replace this with
        the MAGIC ONION screen next.
    */

    setTimeout(() => {

        alert(
            "You found something pink! 🩷\n\nMagic onion coming next..."
        );

    }, 1000);

}


/* ================================= */
/* BACK BUTTON */
/* ================================= */

backButton.addEventListener(
    "click",
    goBack
);


function goBack() {

    /* Stop camera */

    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(
                track => track.stop()
            );

        cameraStream = null;

    }


    /* Hide scanner */

    scannerScreen
        .classList
        .add("hidden");


    /* Show intro */

    introScreen
        .classList
        .remove("hidden");

}