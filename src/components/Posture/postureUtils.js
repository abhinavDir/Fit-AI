export const calculateAngle = (A, B, C) => {
  const AB = [A.x - B.x, A.y - B.y];
  const CB = [C.x - B.x, C.y - B.y];

  const dot = AB[0] * CB[0] + AB[1] * CB[1];
  const magAB = Math.sqrt(AB[0] ** 2 + AB[1] ** 2);
  const magCB = Math.sqrt(CB[0] ** 2 + CB[1] ** 2);

  return Math.acos(dot / (magAB * magCB)) * (180 / Math.PI);
};

export const checkPushupPosture = (landmarks) => {
  const shoulder = landmarks[11];
  const elbow = landmarks[13];
  const wrist = landmarks[15];

  const angle = calculateAngle(shoulder, elbow, wrist);

  if (angle > 160) {
    return "Arms Straight ✅";
  } else if (angle < 90) {
    return "Good Push-up Depth 🔥";
  } else {
    return "Adjust Your Form ❌";
  }
};