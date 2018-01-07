const build = function (error, cityName, cityStation, result, t) {
    if (error) {
        const speechOutput = t('HELP_CANNOT_GIVE_OUTPUT');
        return { speech: speechOutput, raw: speechOutput };
    }

    const when = new Date(Date.parse(result.timestamp))
    const hours = when.getHours()
    const centimeter = result.value
    const trend = result.trend

    let out = "In " + cityName + " war um " + hours + " Uhr der Wasserstand des Flusses '" + cityStation.water + "' " + (centimeter + "").replace('.', ',') + " Zentimeter hoch."

    if (trend === 1) {
        out += " Dabei steigt zur Zeit der Pegel weiter an."
    }
    else if (trend === -1) {
        out += " Dabei sinkt zur Zeit der Pegel."
    }

    return { speech: out, raw: out };
}

module.exports = {
    'build': build
};