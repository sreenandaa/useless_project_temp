/* ================================= */
/* GET HTML ELEMENTS */
/* ================================= */

const introScreen =
    document.getElementById("introScreen");

const scannerScreen =
    document.getElementById("scannerScreen");

const onionScreen =
    document.getElementById("onionScreen");

const continueButton =
    document.getElementById("continueButton");

const peelSelectScreen =
    document.getElementById("peelSelectScreen");

const minusButton =
    document.getElementById("minusButton");

const plusButton =
    document.getElementById("plusButton");

const peelCountElement =
    document.getElementById("peelCount");

const peelMessage =
    document.getElementById("peelMessage");

const peelStartButton =
    document.getElementById("peelStartButton");


/* ================================= */
/* SCREEN 5 ELEMENTS */
/* ================================= */

const prepareScreen =
    document.getElementById("prepareScreen");

const loadingProgress =
    document.getElementById("loadingProgress");

const loadingPercent =
    document.getElementById("loadingPercent");

const loadingStatus =
    document.getElementById("loadingStatus");

const beginPeelingButton =
    document.getElementById("beginPeelingButton");


/* ================================= */
/* SCREEN 6 ELEMENTS */
/* ================================= */

const peelingScreen =
    document.getElementById("peelingScreen");

const peelButton =
    document.getElementById("peelButton");

const currentPeel =
    document.getElementById("currentPeel");

const totalPeels =
    document.getElementById("totalPeels");

const peelingInstruction =
    document.getElementById("peelingInstruction");

const onionAnimation =
    document.getElementById("onionAnimation");

const peelAudio =
    document.getElementById("peelAudio");


/* ================================= */
/* SCREEN 7 ELEMENTS */
/* ================================= */

const finalScreen =
    document.getElementById("finalScreen");

const finalPeels =
    document.getElementById("finalPeels");

const timeWasted =
    document.getElementById("timeWasted");

const leaveButton =
    document.getElementById("leaveButton");


/* ================================= */
/* EXIT PROTOCOL ELEMENTS */
/* ================================= */

const exitOverlay =
    document.getElementById("exitOverlay");

const exitSmallText =
    document.getElementById("exitSmallText");

const exitTitle =
    document.getElementById("exitTitle");

const exitMessage =
    document.getElementById("exitMessage");

const exitConfirmButton =
    document.getElementById(
        "exitConfirmButton"
    );


/* ================================= */
/* CAMERA ELEMENTS */
/* ================================= */

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
/* TIMER */
/* ================================= */

let uselessStartTime =
    Date.now();


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

    introScreen.classList.add(
        "hidden"
    );

    scannerScreen.classList.remove(
        "hidden"
    );


    try {

        cameraStream =
            await navigator.mediaDevices
                .getUserMedia({

                    video: {
                        facingMode: "environment"
                    },

                    audio: false

                });


        camera.srcObject =
            cameraStream;


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

    ctx.drawImage(
        camera,
        0,
        0,
        canvas.width,
        canvas.height
    );


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


    const percentage =
        Math.round(
            (pinkPixels / totalPixels) * 100
        );


    pinkPercentage.textContent =
        percentage + "%";


    if (percentage >= 8) {

        pinkFound();

        return;

    }


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


    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(
                track => track.stop()
            );

        cameraStream = null;

    }


    setTimeout(() => {

        showOnionScreen();

    }, 1200);

}


/* ================================= */
/* SHOW MAGIC ONION */
/* ================================= */

function showOnionScreen() {

    scannerScreen
        .classList
        .add("hidden");


    onionScreen
        .classList
        .remove("hidden");

}


/* ================================= */
/* BACK BUTTON */
/* ================================= */

backButton.addEventListener(
    "click",
    goBack
);


function goBack() {

    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(
                track => track.stop()
            );

        cameraStream = null;

    }


    scannerScreen
        .classList
        .add("hidden");


    introScreen
        .classList
        .remove("hidden");

}


/* ================================= */
/* SCREEN 3 → SCREEN 4 */
/* ================================= */

continueButton.addEventListener(
    "click",
    showPeelSelection
);


function showPeelSelection() {

    onionScreen
        .classList
        .add("hidden");


    peelSelectScreen
        .classList
        .remove("hidden");


    peelCount = 4;

    updatePeelSelection();

}


/* ================================= */
/* PEEL COUNT */
/* ================================= */

let peelCount = 4;

const MIN_PEELS = 1;

const MAX_PEELS = 6;


minusButton.addEventListener(
    "click",
    function () {

        if (peelCount > MIN_PEELS) {

            peelCount--;

            updatePeelSelection();

        }

    }
);


plusButton.addEventListener(
    "click",
    function () {

        if (peelCount < MAX_PEELS) {

            peelCount++;

            updatePeelSelection();

        }

    }
);


function updatePeelSelection() {

    peelCountElement.textContent =
        peelCount;


    const messages = {

        1: {
            main: "1 peel?",
            sub: "You're keeping it simple."
        },

        2: {
            main: "2 peels?",
            sub: "Okay. We can work with that."
        },

        3: {
            main: "3 peels?",
            sub: "Now we're getting somewhere."
        },

        4: {
            main: "4 peels?",
            sub: "That's... ambitious."
        },

        5: {
            main: "5 peels?",
            sub: "You really don't trust this onion."
        },

        6: {
            main: "6 peels?",
            sub: "This is getting unnecessarily serious."
        }

    };


    peelMessage.innerHTML = `

        ${messages[peelCount].main}

        <span>
            ${messages[peelCount].sub}
        </span>

    `;


    const dots =
        document.querySelectorAll(
            ".peel-dots .dot"
        );


    dots.forEach(
        (dot, index) => {

            if (index < peelCount) {

                dot.classList.add("active");

            } else {

                dot.classList.remove("active");

            }

        }
    );

}


/* ================================= */
/* SCREEN 4 → SCREEN 5 */
/* ================================= */

peelStartButton.addEventListener(
    "click",
    startPreparation
);


function startPreparation() {

    peelSelectScreen
        .classList
        .add("hidden");


    prepareScreen
        .classList
        .remove("hidden");


    loadingProgress.style.width =
        "0%";

    loadingPercent.textContent =
        "0";


    beginPeelingButton
        .classList
        .add("hidden");


    runPreparation();

}


/* ================================= */
/* SCREEN 5 LOADING */
/* ================================= */

function runPreparation() {

    let progress = 0;


    const statuses = [

        "Initialising unnecessary technology...",

        "Locating the onion...",

        "Consulting onion specialists...",

        "Measuring onion dimensions...",

        "Calculating peel trajectory...",

        "Establishing peel protocol...",

        "Checking onion compatibility...",

        "Overthinking everything...",

        "Finalising completely unnecessary procedure..."

    ];


    const interval =
        setInterval(() => {

            progress += 1;


            loadingProgress.style.width =
                progress + "%";


            loadingPercent.textContent =
                progress;


            const statusIndex =
                Math.floor(
                    progress /
                    (100 / statuses.length)
                );


            if (
                statuses[statusIndex]
            ) {

                loadingStatus.textContent =
                    statuses[statusIndex];

            }


            if (progress >= 100) {

                clearInterval(interval);

                preparationComplete();

            }

        }, 50);

}


/* ================================= */
/* PREPARATION COMPLETE */
/* ================================= */

function preparationComplete() {

    loadingStatus.textContent =
        "The onion is ready.";


    loadingPercent.textContent =
        "100";


    beginPeelingButton
        .classList
        .remove("hidden");

}


/* ================================= */
/* SCREEN 6 : FRAME ANIMATION */
/* ================================= */

const TOTAL_FRAMES = 16;

const FRAME_TIME = 100;


/* ================================= */
/* PEEL VARIABLES */
/* ================================= */

let currentPeelNumber = 0;

let currentFrame = 1;

let isPeeling = false;


/* ================================= */
/* PRELOAD ONION FRAMES */
/* ================================= */

const onionFrames = [];


for (
    let i = 1;
    i <= TOTAL_FRAMES;
    i++
) {

    const image =
        new Image();


    image.src =
        `assets/onion/onion_${String(i).padStart(2, "0")}.png`;


    onionFrames.push(image);

}


/* ================================= */
/* AUDIO SETUP */
/* ================================= */

peelAudio.src =
     "assets/audio/anime-wow-sound-effect.mp3";

peelAudio.preload =
    "auto";


/* ================================= */
/* SCREEN 5 → SCREEN 6 */
/* ================================= */

beginPeelingButton.addEventListener(
    "click",
    startPeeling
);


function startPeeling() {

    prepareScreen
        .classList
        .add("hidden");


    peelingScreen
        .classList
        .remove("hidden");


    currentPeelNumber = 0;

    currentFrame = 1;

    isPeeling = false;


    currentPeel.textContent =
        "0";


    totalPeels.textContent =
        peelCount;


    peelingInstruction.textContent =
        "One click. One peel.";


    peelButton
        .classList
        .remove("disabled");


    onionAnimation.src =
        onionFrames[0].src;

}


/* ================================= */
/* PEEL BUTTON */
/* ================================= */

peelButton.addEventListener(
    "click",
    performPeel
);


function performPeel() {

    if (isPeeling) {

        return;

    }


    if (
        currentPeelNumber >=
        peelCount
    ) {

        return;

    }


    isPeeling = true;


    /* Play sound */

    playPeelSound();


    /* Move to next peel */

    currentPeelNumber++;


    currentPeel.textContent =
        currentPeelNumber;


    /*
        Divide 16 animation frames
        according to selected peels.

        4 peels:
        1 → 4
        4 → 8
        8 → 12
        12 → 16
    */

    const targetFrame =
        Math.round(
            (
                currentPeelNumber /
                peelCount
            ) *
            TOTAL_FRAMES
        );


    /* Change text */

    if (
        currentPeelNumber <
        peelCount
    ) {

        peelingInstruction.textContent =
            "Peeling...";

    } else {

        peelingInstruction.textContent =
            "Something is happening...";

    }


    /* Tiny movement */

    onionAnimation
        .classList
        .add("peeling");


    /* Animate */

    animateToFrame(
        targetFrame
    );

}


/* ================================= */
/* ANIMATE FRAMES */
/* ================================= */

function animateToFrame(
    targetFrame
) {

    const startFrame =
        currentFrame;


    const totalSteps =
        targetFrame -
        startFrame;


    let step = 0;


    if (totalSteps <= 0) {

        finishPeel();

        return;

    }


    const frameInterval =
        setInterval(
            function () {

                step++;


                currentFrame =
                    startFrame +
                    step;


                if (
                    currentFrame >
                    TOTAL_FRAMES
                ) {

                    currentFrame =
                        TOTAL_FRAMES;

                }


                onionAnimation.src =
                    onionFrames[
                        currentFrame - 1
                    ].src;


                if (
                    step >=
                    totalSteps
                ) {

                    clearInterval(
                        frameInterval
                    );


                    finishPeel();

                }

            },

            FRAME_TIME
        );

}


/* ================================= */
/* FINISH ONE PEEL */
/* ================================= */

function finishPeel() {

    onionAnimation
        .classList
        .remove("peeling");


    setTimeout(
        function () {

            isPeeling = false;


            /*
                All selected peels complete.
            */

            if (
                currentPeelNumber >=
                peelCount
            ) {

                peelButton
                    .classList
                    .add("disabled");


                peelingInstruction.textContent =
                    "The onion has been peeled.";


                /*
                    Move to Screen 7.
                */

                setTimeout(
                    showFinalScreen,
                    1200
                );

            }

        },

        150
    );

}


/* ================================= */
/* PLAY PEEL SOUND */
/* ================================= */

function playPeelSound() {

    if (!peelAudio) {

        return;

    }


    peelAudio.currentTime =
        0;


    const playPromise =
        peelAudio.play();


    if (
        playPromise !== undefined
    ) {

        playPromise.catch(
            function (error) {

                console.error(
                    "Audio could not play:",
                    error
                );

            }
        );

    }

}


/* ================================= */
/* SCREEN 7 : FINAL SCREEN */
/* ================================= */

function showFinalScreen() {

    /*
        Hide peeling screen.
    */

    peelingScreen
        .classList
        .add("hidden");


    /*
        Show final screen.
    */

    finalScreen
        .classList
        .remove("hidden");


    /*
        Show number of peels.
    */

    finalPeels.textContent =
        peelCount;


    /*
        Calculate wasted time.
    */

    const elapsed =
        Math.floor(
            (
                Date.now() -
                uselessStartTime
            ) / 1000
        );


    if (elapsed < 60) {

        timeWasted.textContent =
            elapsed +
            " SECONDS";

    } else {

        const minutes =
            Math.floor(
                elapsed / 60
            );


        const seconds =
            elapsed % 60;


        timeWasted.textContent =
            minutes +
            "M " +
            seconds +
            "S";

    }

}


/* ================================= */
/* FINAL SCREEN → EXIT PROTOCOL */
/* ================================= */

leaveButton.addEventListener(
    "click",
    startExitProtocol
);


/* ================================= */
/* EXIT PROTOCOL */
/* ================================= */

let exitStep = 0;


function startExitProtocol() {

    exitStep = 1;


    exitSmallText.textContent =
        "EXIT PROTOCOL";


    exitTitle.textContent =
        "ARE YOU SURE?";


    exitMessage.innerHTML =
        `
        You are about to leave<br>
        the onion behind.
        `;


    exitConfirmButton.textContent =
        "YES, TAKE ME BACK";


    exitConfirmButton.disabled =
        false;


    exitOverlay
        .classList
        .remove("hidden");

}


/* ================================= */
/* EXIT CONFIRM BUTTON */
/* ================================= */

exitConfirmButton.addEventListener(
    "click",
    nextExitStep
);


function nextExitStep() {


    /* ================================= */
    /* STEP 1 */
    /* ================================= */

    if (exitStep === 1) {

        exitStep = 2;


        exitSmallText.textContent =
            "EXIT PROTOCOL 02";


        exitTitle.textContent =
            "WAIT.";


        exitMessage.innerHTML =
            `
            We need to make sure<br>
            you actually want to leave.
            `;


        exitConfirmButton.textContent =
            "YES";


        return;

    }


    /* ================================= */
    /* STEP 2 */
    /* ================================= */

    if (exitStep === 2) {

        exitStep = 3;


        exitSmallText.textContent =
            "EXIT PROTOCOL 03";


        exitTitle.textContent =
            "ONE LAST THING.";


        exitMessage.innerHTML =
            `
            Was the onion<br>
            worth it?
            `;


        exitConfirmButton.textContent =
            "YES, OBVIOUSLY";


        return;

    }


    /* ================================= */
    /* STEP 3 */
    /* ================================= */

    if (exitStep === 3) {

        exitStep = 4;


        exitSmallText.textContent =
            "PROCESSING";


        exitTitle.textContent =
            "INTERESTING.";


        exitMessage.innerHTML =
            `
            Your answer has been recorded.<br>
            It changes nothing.
            `;


        exitConfirmButton.textContent =
            "OK";


        return;

    }


    /* ================================= */
    /* STEP 4 */
/* ================================= */

    if (exitStep === 4) {

        exitSmallText.textContent =
            "PLEASE WAIT";


        exitTitle.textContent =
            "RETURNING...";


        exitMessage.innerHTML =
            `
            Taking you back to<br>
            where this all began.
            `;


        exitConfirmButton.disabled =
            true;


        setTimeout(
            returnToBeginning,
            1800
        );

    }

}


/* ================================= */
/* RETURN TO FRONT PAGE */
/* ================================= */

function returnToBeginning() {

    /*
        Hide final screen.
    */

    finalScreen
        .classList
        .add("hidden");


    /*
        Hide exit overlay.
    */

    exitOverlay
        .classList
        .add("hidden");


    /*
        Show front page.
    */

    introScreen
        .classList
        .remove("hidden");


    /*
        Reset exit protocol.
    */

    exitStep = 0;


    exitConfirmButton.disabled =
        false;


    /*
        Reset timer.
    */

    uselessStartTime =
        Date.now();

}