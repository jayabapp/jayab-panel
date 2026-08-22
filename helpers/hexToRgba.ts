function hexToRgbA(hex: string, alpha?: number) {
  if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) return "rgb(0,0,0)";

  var r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  } else {
    return "rgb(" + r + ", " + g + ", " + b + ")";
  }
}

export default hexToRgbA;
