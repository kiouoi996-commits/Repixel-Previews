export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
export const coefficients = [0, 200, 125, 75, 43.75, 32, 24];
export function referenceState() {
  return { speed: 128, rpm: 5600, gear: 4, range: 310, coolant: 198, paused: false, throttle: false, brake: false };
}
export function canShift(state, direction) {
  const next = state.gear + direction;
  return next >= 1 && next <= 6 && state.speed * coefficients[next] <= 7600;
}
export function shift(state, direction) {
  return canShift(state, direction) ? { ...state, gear: state.gear + direction } : state;
}
export function step(state, dt, controls = state) {
  if (state.paused || dt <= 0) return state;
  const next = { ...state };
  const brake = Boolean(controls.brake), throttle = Boolean(controls.throttle) && !brake;
  const maximum = Math.min(200, 7600 / coefficients[next.gear]);
  if (brake) next.speed = Math.max(0, next.speed - 38 * dt);
  else if (throttle) next.speed = Math.min(maximum, next.speed + 18 * dt);
  const rpmTarget = clamp(next.speed * coefficients[next.gear], 900, 7600);
  next.rpm += (rpmTarget - next.rpm) * (1 - Math.exp(-dt / 0.18));
  next.range = Math.max(0, next.range - next.speed * dt / 3600);
  const thermalTarget = throttle ? 206 : 198;
  next.coolant += (thermalTarget - next.coolant) * (1 - Math.exp(-dt / 12));
  next.throttle = throttle; next.brake = brake;
  return next;
}
export const DEMO_DURATION = 16;
export const demoEvents = [
  [0, 'reference'],
  [1, 'accelerate'],
  [3, 'release'],
  [3.05, 'upshift'],
  [3.3, 'accelerate'],
  [4.3, 'release'],
  [6.3, 'brake'],
  [9.3, 'release'],
  [9.35, 'downshift'],
  [9.6, 'accelerate'],
  [12.933333333333334, 'release'],
  [14.8, 'reset'],
];
export function demoAt(seconds) {
  const t = clamp(seconds, 0, DEMO_DURATION);
  if (t >= 14.8) return { ...referenceState(), phase: 'Reference restored' };
  let state = referenceState(), time = 0, throttle = false, brake = false, event = 1, phase = 'Cruising';
  const apply = name => {
    if (name === 'accelerate') { throttle = true; brake = false; phase = 'Accelerating'; }
    if (name === 'brake') { throttle = false; brake = true; phase = 'Braking'; }
    if (name === 'release') { throttle = brake = false; phase = 'Cruising'; }
    if (name === 'upshift' || name === 'downshift') { state = shift(state, name === 'upshift' ? 1 : -1); phase = 'Shifting'; }
    if (name === 'reset') { state = referenceState(); throttle = brake = false; phase = 'Reference restored'; }
    state.throttle = throttle && !brake; state.brake = brake;
  };
  while (time < t - 1e-9) {
    while (event < demoEvents.length && demoEvents[event][0] <= time + 1e-9) apply(demoEvents[event++][1]);
    const boundary = event < demoEvents.length ? demoEvents[event][0] : t;
    const dt = Math.min(1/120, t - time, boundary - time);
    if (dt <= 1e-9) { time = boundary; continue; }
    state = step(state, dt, { throttle, brake }); time += dt;
  }
  while (event < demoEvents.length && demoEvents[event][0] <= t + 1e-9) apply(demoEvents[event++][1]);
  return { ...state, phase };
}
