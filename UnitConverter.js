(function() {
    const conversionRates = {
        beardMonth: 2.54,
        daywalk: 120000,
        weekwalk: 840000,
        fortwalk: 1680000,
        monthwalk: 3600000,
        yearwalk: 43800000,
        metre: 1,
        kilometre: 1000,
        centimetre: 0.01,
        millimetre: 0.001,
        smoot: 1.7018,
        banana: 0.18,
        doubleDeckerBus: 4.38,
        footballField: 100,
        lightYear: 9.461e15,
        lightmonth = 7.77428473e14,
        lightweek = 1.81314479e14,
        lightday = 2.59020684e13,
        lighthour = 1.07925285e12,
        doorheight: 2.04,
        PopCornSets: 0.4,
        KateMetre: 0.656
    };

    function convertFromUnit(value, unit) {
        if (!conversionRates.hasOwnProperty(unit)) {
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

    let inputValue = prompt("Enter a value to convert (Please don't add unit):");
    if (!inputValue) return;
    inputValue = parseFloat(inputValue);
    if (isNaN(inputValue)) {
        alert("Invalid numeric value entered.");
        return;
    }

    let inputUnit = prompt("Enter the unit to convert from (e.g., metre, kilometre, fortwalk, etc.):");
    if (!inputUnit) return;
    inputUnit = inputUnit.trim();

    const conversions = convertFromUnit(inputValue, inputUnit);
    if (typeof conversions === "string") {
        alert(conversions);
    } else {
        let message = `${inputValue} ${inputUnit} is approximately:\n`;
        for (let key in conversions) {
            message += `${conversions[key]} ${key}\n`;
        }
        alert(message);
    }
})();
