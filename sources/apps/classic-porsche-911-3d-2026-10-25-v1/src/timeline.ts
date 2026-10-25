export const W = 430;
export const H = 887;
export const HOME_YAW = .90;
export const DETAIL_YAW = 3.55;
export const clamp = (v: number) => Math.max(0, Math.min(1, v));
export const smooth = (v: number) => { const p = clamp(v); return p * p * (3 - 2 * p); };
export const smoother = (v: number) => { const p = clamp(v); return p * p * p * (10 - 15 * p + 6 * p * p); };
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;
export const phase = (v: number, a: number, b: number) => smooth((v - a) / (b - a));

export type Touch = {x: number; y: number; opacity: number};
export type Pose = {p: number; yaw: number; pitch: number; inspection: number; favorite: boolean; view: number; touch: Touch | null; press: string | null; pressStrength: number; pulse: number};
export const initialPose = (): Pose => ({p: 0, yaw: 0, pitch: 0, inspection: 0, favorite: false, view: 1, touch: null, press: null, pressStrength: 0, pulse: 0});

// The same physical camera state is used by live navigation and the film.
export function cameraPose(pose: Pose) {
  const inspection = pose.inspection * pose.p;
  return {
    yaw: mix(HOME_YAW, DETAIL_YAW, pose.p) + pose.yaw,
    elevation: mix(mix(.12, .10, pose.p), .12, inspection) + pose.pitch,
    radius: mix(mix(18.3, 9.8, phase(pose.p, .40, 1)), 19.3, inspection),
    shiftX: mix(300 * phase(pose.p, .65, 1), 0, inspection),
    shiftY: mix(mix(-110, -195, pose.p), -120, inspection),
  };
}

function hermite(t: number, a: number, b: number, x: number, y: number, startVelocity: number, endVelocity: number) {
  const p = clamp((t - a) / (b - a)), p2 = p * p, p3 = p2 * p, d = b - a;
  return (2 * p3 - 3 * p2 + 1) * x + (p3 - 2 * p2 + p) * startVelocity * d + (-2 * p3 + 3 * p2) * y + (p3 - p2) * endVelocity * d;
}
function drag(t: number, a: number, b: number, end: number, from: number, to: number, settle: number) {
  const velocity = 2.5 * (settle - to) / (end - b);
  if (t < a) return from;
  if (t < b) return hermite(t, a, b, from, to, 0, velocity);
  if (t < end) return hermite(t, b, end, to, settle, velocity, 0);
  return settle;
}
function contact(t: number, a: number, b: number, x: number, y: number): Touch | null {
  if (t < a || t > b) return null;
  return {x, y, opacity: .75 * Math.min(1, (t - a) / .045, (b - t) / .06)};
}

// This is an authored touch walkthrough of the actual app scene, isolated from live storage.
export function demoPose(t: number): Pose {
  const state = initialPose();
  if (t >= 1.23 && t < 2.35) state.p = smoother((t - 1.23) / 1.12);
  else if (t >= 2.35 && t < 10.72) state.p = 1;
  else if (t >= 10.72 && t < 11.84) state.p = 1 - smoother((t - 10.72) / 1.12);
  let yaw = 0;
  if (t >= 3.25) yaw = drag(t, 3.25, 4.70, 5.02, 0, 1.55, 1.68);
  if (t >= 5.48) yaw = drag(t, 5.48, 6.85, 7.17, 1.68, -.18, -.31);
  if (t >= 8.62) yaw = mix(-.31, 0, smoother((t - 8.62) / .88));
  if (t >= 10.72) yaw = 0;
  state.yaw = yaw;
  state.inspection = phase(t, 3.25, 3.85) * (1 - phase(t, 8.62, 9.50));
  state.pitch = t >= 3.25 && t < 7.17 ? .035 * Math.sin(Math.PI * phase(t, 3.25, 7.17)) : 0;
  state.favorite = t >= 7.85;
  state.view = t >= 3.25 && t < 8.62 ? -1 : 1;
  state.touch = contact(t, 1.01, 1.22, 371, 594) || contact(t, 7.72, 7.94, 385, 47) || contact(t, 8.42, 8.63, 78, 375) || contact(t, 10.51, 10.72, 44, 46);
  if (t >= 3.25 && t <= 4.70) state.touch = {x: 330 - state.yaw * 106, y: 296 + 9 * Math.sin(Math.PI * (t - 3.25) / 1.45), opacity: .78};
  if (t >= 5.48 && t <= 6.85) state.touch = {x: 142 - (state.yaw - 1.68) * 104, y: 299 - 8 * Math.sin(Math.PI * (t - 5.48) / 1.37), opacity: .78};
  state.press = t >= 1.01 && t < 1.23 ? 'open' : t >= 7.72 && t < 7.98 ? 'save' : t >= 10.51 && t < 10.75 ? 'back' : null;
  state.pressStrength = state.press === 'open' ? Math.sin(Math.PI * clamp((t-1.01)/.22)) : state.press === 'save' ? Math.sin(Math.PI * clamp((t-7.72)/.26)) : state.press === 'back' ? Math.sin(Math.PI * clamp((t-10.51)/.24)) : 0;
  state.pulse = t >= 7.85 && t < 8.15 ? Math.sin(Math.PI * (t - 7.85) / .30) : 0;
  return state;
}
