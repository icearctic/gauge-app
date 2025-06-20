export function getFormattedVolume(value: number) {
  if (value > 10) {
    return Math.round(value);
  } else if (value > 1) {
    return +value.toFixed(1);
  } else if (value > 0) {
    return +value.toFixed(2);
  } else {
    return 0;
  }
}

export function getFormattedPercent(value: number) {
  if (value > 0) {
    return +value.toFixed(1);
  } else {
    return 0;
  }
}

export function getNormalizedPercentage(percentage?: number) {
  return percentage ? Math.min(100, Math.max(0, percentage)) : 0;
}

export function getNormalizedVolume(volume?: number) {
  return volume ? Math.max(0, volume) : 0;
}

export function convertMlToL(volume: number) {
  return volume ? Math.max(0, volume / 1000) : 0;
}

export function convertLToMl(volume: number) {
  return volume ? Math.max(0, volume * 1000) : 0;
}
