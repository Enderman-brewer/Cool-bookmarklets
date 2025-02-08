const conversionRates = {
    "beardMonth": 2.54,    // 1 beard month = 2.54 cm
    "daywalk": 120000,      // 1 daywalk = 120 km
    "weekwalk": 840000,     // 1 weekwalk = 840 km
    "fortwalk": 1680000,    // 1 fortwalk = 1,680 km
    "monthwalk": 3600000,   // 1 monthwalk = 3,600 km
    "yearwalk": 43800000,   // 1 yearwalk = 43,800 km
    "metre": 1,             // 1 metre = 1 metre
    "kilometre": 1000,      // 1 km = 1000 metres
    "centimetre": 0.01,     // 1 cm = 0.01 metres
    "millimetre": 0.001,    // 1 mm = 0.001 metres
    "smoot": 1.7018,        // 1 Smoot = 1.7018 metres
    "banana": 0.18,         // 1 banana = 0.18 metres
    "doubleDeckerBus": 4.38, // 1 double-decker bus = 4.38 metres
    "footballField": 100,   // 1 football field = 100 metres
    "lightYear": 9.461e15   // 1 light-year = 9.461 × 10^15 metres
};


function convertFromUnit(value, unit) {
    if (!conversionRates[unit]) {
        return "Invalid unit";
    }
    let results = {};
    let baseValue = value * conversionRates[unit];
    for (let key in conversionRates) {
        let convertedValue = baseValue / conversionRates[key];
        results[key] = Number.isInteger(convertedValue) ? convertedValue : convertedValue.toFixed(8);
    }
    return results;
}

// Example usage with alert popups
const inputValue = prompt("Enter a value to convert (Please don't add unit):");
const inputUnit = prompt("Enter the unit to convert from (e.g., metre, kilometre, fortwalk, etc.):");

const conversions = convertFromUnit(parseFloat(inputValue), inputUnit);
if (typeof conversions === "string") {
    alert(conversions);
} else {
    let message = `${inputValue} ${inputUnit} is approximately:\n`;
    for (let key in conversions) {
        message += `${conversions[key]} ${key}\n`;
    }
    alert(message);
}
