let Fuse = require('fuse.js');
let worldCountries = require('world-countries');
let countries = [];

worldCountries.forEach(function(country) {
    if (country.hasOwnProperty('demonyms')) {
        countries.push({
            code: country.cca2,
            commonName: country.translations.fra.common,
            demonym: country.demonyms.fra.f,
            officialName: country.translations.fra.official,
        });
    }
});

let fuseOptions = {
    shouldSort: true,
    threshold: 0.5,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
        "commonName",
        "demonym",
        "officialName"
    ]
};
let fuse = new Fuse(countries, fuseOptions);

let ZONE_LABEL = {
    'fr': 'française',
    'ue': 'UE',
    'autre': 'hors UE'
};

let EEE_COUNTRY_CODES = [
    'AT',
    'BE',
    'BG',
    'CY',
    'CZ',
    'DE',
    'DK',
    'EE',
    'ES',
    'FI',
    'FR',
    'GR',
    'HR',
    'HU',
    'IE',
    'IS',
    'IT',
    'LI',
    'LU',
    'LV',
    'MT',
    'NL',
    'NO',
    'PL',
    'PT',
    'RO',
    'SE',
    'SI',
    'SK',
    'UK',
];

function getZone(countryCode) {

    countryCode = countryCode.toUpperCase();

    if (countryCode === 'FR') {
        return 'fr';
    }
    if (EEE_COUNTRY_CODES.includes(countryCode) || countryCode === 'CH') {
        return 'ue';
    }

    return 'autre';
}

const Nationality = {
    toArray: function() {
        return countries;
    },
    getLabel: function(nationality) {
        return ZONE_LABEL[getZone(nationality)];
    },
    getZone: getZone,
    getCountryCodeByNationality: function(nationality) {

        switch (nationality) {
        case 'ue':
            return 'DE';
        case 'autre':
            return 'AF';
        }

        return 'FR';
    },
    search: function(q) {
        return fuse.search(q).slice(0, 10);
    }
}

export default Nationality
