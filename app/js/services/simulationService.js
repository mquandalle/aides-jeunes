'use strict';

/* global _ */

angular.module('ddsApp').service('SimulationService', function($http, $q, droitsDescription) {
    return {
        simulate: function(situation) {
            var that = this;

            return $http.get('/api/situations/' + situation._id + '/simulation').then(function(result) {
                return that.createDroitsFromApiResult(result.data);
            });
        },

        createDroitsFromApiResult: function(result) {
            var droits = [];
            droitsDescription.forEach(function(droit) {
                if (false === droit.isSimulated) {
                    return;
                }
                var value = result[droit.id];
                if (value) {
                    var target = { description: droit, isBaseRessourcesYearMoins2: droit.isBaseRessourcesYearMoins2 };
                    if (_.isNumber(value)) {
                        target.montant = value;
                    }
                    droits.push(target);
                }
            });

            return {
                droits: droits,
                droitsNonEligibles: this.getDroitsNonEligibles(droits)
            };
        },

        getDroitsNonEligibles: function(droitsEligibles) {
            return droitsDescription.filter(function(droit) {
                return !_.find(droitsEligibles, { description: {id: droit.id }}) && false !== droit.isSimulated;
            });
        }
    };
});
