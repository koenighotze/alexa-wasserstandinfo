const safe = function (string) {
   return string.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\>/g, "&gt;").replace(/ Uhr /g, " ").replace(/0(\d)\./g, "$1.");
};

const build = function (error, result, t) {
    console.log('Building output');
    if (error) {
        const speechOutput = t('HELP_CANNOT_GIVE_OUTPUT');
        return;
    }

// { timestamp: '2018-01-06T15:00:00+01:00',
//   value: 749,
//   trend: 1,
//   stateMnwMhw: 'high',
//   stateNswHsw: 'normal' }


    const when = new Date(Date.parse(result.timestamp))
    const centimeter = result.value
    const trend = result.trend
    // const

    // let out = result.map( news => {
    //     const date = 'Am <say-as interpret-as="date" format="dmy">' + news.date.replace(/0(\d)\./g, "$1.") + "</say-as>";

    //     return date + " in " + safe(news.location) + "<s>" + safe(news.title) + "</s><p>" + safe(news.summary) + "</p>";
    // }).join(' ');
    const out = "Um 14:00 Uhr war der Wasserstand " + centimeter + " centimeter hoch."

    return { speech: out, raw: out };
}

module.exports = {
    'build': build
};