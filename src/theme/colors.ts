//
// https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
// @ts-ignore
export function HSVtoRGB(hsv) {
  const { r, g, b } = rawHSVtoRGB(hsv);

  return `rgb(${r}, ${g}, ${b})`;
}

//

export function rawHSVtoRGB(hsv) {
  const h = hsv.h;
  const s = hsv.s;
  const v = hsv.v;

  var r = 0,
    g = 0,
    b = 0,
    i,
    f,
    p,
    q,
    t;

  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

//

function singleColorToHex(rgb) {
  var hex = Number(rgb).toString(16);
  if (hex.length < 2) {
    hex = '0' + hex;
  }
  return hex;
}

//

export function rgbToHex(r, g, b) {
  var red = singleColorToHex(r);
  var green = singleColorToHex(g);
  var blue = singleColorToHex(b);
  return red + green + blue;
}

//

export function hsvToHex(hsv) {
  const { r, g, b } = rawHSVtoRGB(hsv);
  return rgbToHex(r, g, b);
}

//

export function isColorEqual(
  color1,
  color2
) {
  if (!color1 || !color2) {
    return false;
  }

  return (
    color1.h === color2.h && color1.s === color2.s && color1.v === color2.v
  );
}
