export function bytesToGigabytesText(bytes: number, rounding: number): string {
	if (bytes == 0) return "0"

	let gb = Math.round(bytes / 1000000000).toFixed(rounding)
	return gb == "0.0" ? "0" : gb
}
