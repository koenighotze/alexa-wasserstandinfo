/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict';
const Fetch = require('./fetch');
const BuildOutput = require('./buildoutput');
const Alexa = require('alexa-sdk');
const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).
const Stations = require('./stations')

const languageStrings = {
    'de-DE': {
        translation: {
            SKILL_NAME: 'Wasserstandinfo',
            HELP_MESSAGE: 'Ich kann dir Informationen zum aktuellen Wasserstand in deutschen Städten geben. Dazu nutze ich die Informationen von "www.pegelonline.wsv.de". Du kannst zum Beispiel fragen: "Wasserstandinfo Wie hoch ist der Wasserstand in Düsseldorf?"',
            LAUNCH_MESSAGE: 'Willkommen beim Wasserstandinfo.',
            HELP_REPROMPT: 'Wie kann ich dir helfen?',
            STOP_MESSAGE: 'Auf Wiedersehen!',
            HELP_CANNOT_GIVE_OUTPUT: 'Ich kann dir gerade nicht helfen. Versuche es später nochmal!',
            HELP_CANNOT_FIND_DATA_FOR_TOWN: 'Sorry, ich kann leider keine Wasserstände für diese Stadt finden.'
        },
    }
};

const handlers = {
    'LaunchRequest': function () {
        const speechOutput = this.t('LAUNCH_MESSAGE');
        this.emit(':ask', speechOutput, speechOutput);
    },
    'GetWatermark': function () {
        const self = this;

        const citySlot = this.event.request.intent.slots.CITY;
        let city = ""
        if (!citySlot || !citySlot.value) {
            self.emit(':tell', this.t('HELP_MESSAGE'), self.t('SKILL_NAME'), this.t('HELP_MESSAGE'));
            return
        }
        city = citySlot.value.toLowerCase();

        Stations.fetchStations()
                .then(stations => Stations.findStationData(city, stations))
                .then(cityStation => {
                    if (!cityStation) {
                        self.emit(':tell', self.t('HELP_CANNOT_FIND_DATA_FOR_TOWN'), self.t('SKILL_NAME'), self.t('HELP_CANNOT_FIND_DATA_FOR_TOWN'));
                        return;
                    }

                    Fetch.handler(cityStation.uuid, function (error, result) {
                        const speechOutput = BuildOutput.build(error, city, cityStation, result, self.t.bind(self));
                        self.emit(':tell', speechOutput.speech, self.t('SKILL_NAME'), speechOutput.raw);
                    });
                })
                .catch(err => {
                    console.log(err);
                    self.emit(':tell', self.t('HELP_CANNOT_GIVE_OUTPUT'), self.t('SKILL_NAME'), self.t('HELP_CANNOT_GIVE_OUTPUT'));
                })
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_REPROMPT');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'SessionEndedRequest': function () {
        this.emit('AMAZON.StopIntent');
    }

};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
