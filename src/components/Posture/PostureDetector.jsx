import { useEffect, useRef, useState } from "react";
import "./Posture.css";

const PostureDetector = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [feedback, setFeedback] = useState("System Ready");
    const [postureStatus, setPostureStatus] = useState("Neutral");
    const [activeExercise, setActiveExercise] = useState("SENSING...");
    const [muscleFocus, setMuscleFocus] = useState("INITIALIZING...");
    const [accuracy, setAccuracy] = useState(0);
    const [holdTime, setHoldTime] = useState(0);
    const [isSafetyStop, setIsSafetyStop] = useState(false);

    const pose = useRef(null);
    const camera = useRef(null);
    const timerRef = useRef(null);

    const loadMediaPipe = async () => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js";
        script.onload = () => initPose();
        document.head.appendChild(script);

        const cameraScript = document.createElement("script");
        cameraScript.src = "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js";
        document.head.appendChild(cameraScript);

        const drawingScript = document.createElement("script");
        drawingScript.src = "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js";
        document.head.appendChild(drawingScript);
    };

    const initPose = () => {
        const { Pose } = window;
        pose.current = new Pose({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
        });

        pose.current.setOptions({
            modelComplexity: 0,
            smoothLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });

        pose.current.onResults(onResults);
    };

    const calculateDistance = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

    const calculateAngle = (a, b, c) => {
        const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
        let angle = Math.abs((radians * 180.0) / Math.PI);
        if (angle > 180.0) angle = 360 - angle;
        return angle;
    };

    const onResults = (results) => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        if (!results.poseLandmarks) return;

        const { drawConnectors, drawLandmarks } = window;
        const { POSE_CONNECTIONS } = window;

        ctx.shadowBlur = 10;
        ctx.shadowColor = "#22c55e";
        drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, { color: '#22c55e', lineWidth: 4 });
        ctx.shadowBlur = 0;
        drawLandmarks(ctx, results.poseLandmarks, { color: '#FF0000', lineWidth: 2, radius: 1 });

        // HAND SIGNAL PRIORITY ANALYSIS
        identifyGesturesWorkouts(results.poseLandmarks);
    };

    const identifyGesturesWorkouts = (landmarks) => {
        const nose = landmarks[0], sL = landmarks[11], sR = landmarks[12], eL = landmarks[13], eR = landmarks[14], wL = landmarks[15], wR = landmarks[16];
        const hL = landmarks[23], hR = landmarks[24], kL = landmarks[25], kR = landmarks[26], aL = landmarks[27], aR = landmarks[28];
        const pinkyL = landmarks[17], indexL = landmarks[19], thumbL = landmarks[21];
        const pinkyR = landmarks[18], indexR = landmarks[20], thumbR = landmarks[22];

        let errors = [];
        let moveName = "READY / IDLE";
        let focus = "INITIALIZING";

        // 1. HAND SIGNAL (TOP PRIORITY)
        const handRaisedL = wL.visibility > 0.8 && wL.y < sL.y;
        const handRaisedR = wR.visibility > 0.8 && wR.y < sR.y;

        if (handRaisedL || handRaisedR) {
            // Check Hand-Spread distance (Open Palm vs Fist)
            const activeHand = handRaisedL ? { pinky: pinkyL, index: indexL } : { pinky: pinkyR, index: indexR };
            const handWidth = calculateDistance(activeHand.pinky, activeHand.index);

            if (handWidth > 0.05) {
                moveName = "PALM DETECTED 🖐️";
                focus = "HAND SIGNALING";
            } else {
                moveName = "FIST DETECTED ✊";
                focus = "FINGERS CLOSED";
            }
        }

        // 2. ONLY CHECK EXERCISES IF NO SIGNAL IS SHOWN (Fixes Bicep-Palm confusion)
        if (moveName === "READY / IDLE") {
            const activeL = Math.abs(wL.y - sL.y) > 0.05 && wL.visibility > 0.6;
            const activeR = Math.abs(wR.y - sR.y) > 0.05 && wR.visibility > 0.6;
            const ebAngleL = calculateAngle(sL, eL, wL);
            const ebAngleR = calculateAngle(sR, eR, wR);

            if (activeL || activeR) {
                const isSingle = (activeL && !activeR) || (!activeL && activeR);
                if (wL.y < sL.y || wR.y < sR.y) {
                    if (ebAngleL < 90 || ebAngleR < 90) {
                        moveName = `${isSingle ? "SINGLE" : "DOUBLE"} TRICEP EXT`;
                        focus = "TRICEPS 🦾";
                    } else {
                        moveName = `${isSingle ? "SINGLE" : "DOUBLE"} SHOULDERS`;
                        focus = "SHOULDERS ⚖️";
                    }
                } else {
                    moveName = `${isSingle ? "SINGLE" : "DOUBLE"} BICEP CURL`;
                    focus = "BICEPS 🦾";
                    if (Math.abs(eL.x - sL.x) > 0.15) errors.push("Keep Elbow Pinned 🥊");
                }
            }

            // Legs
            const hipKneeDepth = Math.abs(hL.y - kL.y);
            const lungeStep = Math.abs(aL.x - aR.x);
            if (hipKneeDepth < 0.2 && hL.visibility > 0.6) {
                focus = "LEGS 🦵";
                moveName = (lungeStep > 0.35) ? "LUNGES" : "SQUATS";
            }
        }

        setActiveExercise(moveName);
        setMuscleFocus(focus);

        // FORM FEEDBACK
        if (errors.length > 0) {
            setPostureStatus("Bad");
            setFeedback(errors[0].toUpperCase());
            setAccuracy(68);
        } else if (landmarks[23].visibility > 0.6) {
            setPostureStatus("Perfect");
            setFeedback("FORM: PERFECT! ✅");
            setAccuracy(100);
        } else {
            setPostureStatus("Good");
            setFeedback("Detection Active 🟢");
            setAccuracy(92);
        }
    };

    useEffect(() => {
        if (isCameraOn && !isSafetyStop) {
            timerRef.current = setInterval(() => {
                setHoldTime(prev => {
                    const next = prev + 1;
                    if (next >= 120) {
                        setIsSafetyStop(true);
                        setFeedback("🛑 EXERTION LIMIT: PLEASE STOP");
                        return 120;
                    }
                    return next;
                });
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isCameraOn, isSafetyStop]);

    const startCamera = async () => {
        if (isCameraOn || isSafetyStop) return;
        try {
            const { Camera } = window;
            camera.current = new Camera(videoRef.current, {
                onFrame: async () => {
                    await pose.current.send({ image: videoRef.current });
                },
                width: 1280,
                height: 720,
            });
            camera.current.start();
            setIsCameraOn(true);
            setHoldTime(0);
        } catch (err) {
            setFeedback("Camera Denied!");
        }
    };

    const stopCamera = () => {
        if (camera.current) camera.current.stop();
        setIsCameraOn(false);
        setHoldTime(0);
        setIsSafetyStop(false);
        setFeedback("System Offline");
    };

    useEffect(() => {
        loadMediaPipe();
        return () => stopCamera();
    }, []);

    return (
        <div className={`posture-container ${postureStatus === "Bad" ? "bad-alert" : ""} ${isSafetyStop ? "safety-halt" : ""}`}>
            <div className="video-wrapper">
                <video ref={videoRef} playsInline className="video" />
                <canvas ref={canvasRef} className="skeleton-canvas" width={1280} height={720} />
            </div>

            <div className="hud-overlay">
                <div className="hud-header">
                    <div className="hud-title">
                        <h2>FITAI • HAND + MUSCLE</h2>
                    </div>
                    <div className="muscle-focus-badge">
                        <span>{muscleFocus}</span>
                    </div>
                </div>

                <div className="hud-stats">
                    <div className="stat-box">
                        {/* <span className="stat-label">Detected Status</span>
                        <span className="stat-value" style={{ fontSize: '0.9rem', color: '#22c55e' }}>{activeExercise}</span> */}
                    </div>
                    <div className="stat-box">
                        <span className="stat-label">Total Stability</span>
                        <span className="stat-value">{accuracy}%</span>
                    </div>
                </div>

                <div className={`feedback-banner ${postureStatus === "Bad" || isSafetyStop ? "bad" : ""}`}>
                    <h2 className="feedback-text">{isSafetyStop ? "🛑 SAFETY HALT" : feedback}</h2>
                </div>

                <div className="hud-controls">
                    {!isCameraOn ? (
                        <button className="btn-hud active" onClick={startCamera}>Start Hand + Muscle Sense</button>
                    ) : (
                        <button className="btn-hud" onClick={stopCamera}>Reset Training</button>
                    )}
                    <button className="btn-hud" onClick={() => window.history.back()}>Exit</button>
                </div>
            </div>

            {isSafetyStop && (
                <div className="stop-alert-overlay">
                    <h1>SAFETY HALT 🛑</h1>
                    <p>Held for 120s. Stop and Rest.</p>
                    <button className="btn-hud active" onClick={stopCamera}>Reset Session</button>
                </div>
            )}
        </div>
    );
};

export default PostureDetector;