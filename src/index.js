/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict';
const Fetch = require('./fetch');
const BuildOutput = require('./buildoutput');
const Alexa = require('alexa-sdk');
const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

const languageStrings = {
    'de-DE': {
        translation: {
            SKILL_NAME: 'Wasserstandinfo',
            HELP_MESSAGE: 'Ich kann dir Informationen zum aktuellen Wasserstand in deutschen Städten geben. Du kannst zum Beispiel fragen: "Wasserstandinfo Wie hoch ist der Wasserstand in Düsseldorf?"',
            LAUNCH_MESSAGE: 'Willkommen beim Wasserstandinfo.',
            HELP_REPROMPT: 'Wie kann ich dir helfen?',
            STOP_MESSAGE: 'Auf Wiedersehen!',
            HELP_CANNOT_GIVE_OUTPUT: 'Ich kann dir gerade nicht helfen. Versuche es später nochmal!'
        },
    }
};

const handlers = {
    'LaunchRequest': function () {
        // this.emit('AMAZON.HelpIntent');
        const speechOutput = this.t('LAUNCH_MESSAGE');
        this.emit(':ask', speechOutput, speechOutput);
    },
    'GetWatermark': function () {
        const self = this;

        Fetch.handler( function (error, result) {
            const speechOutput = BuildOutput.build(error, result, self.t.bind(self));
            console.log("Speechoutput", speechOutput)


            self.emit(':tell', speechOutput.speech, self.t('SKILL_NAME'), speechOutput.raw);
        });
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
