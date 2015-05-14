import Ember from "ember";
import BaseAuthenticator from 'simple-auth/authenticators/base';
import BaseAuthorizer from 'simple-auth/authorizers/base';

let Authenticator = BaseAuthenticator.extend({

    store: Ember.inject.service("store:main"),
    baseUrl : '/api',

    restore: function (data) {
        console.log("in restore!!!");
        return new Ember.RSVP.Promise(function (resolve, reject) {
            if (!Ember.isEmpty(data.username) && !Ember.isEmpty(data.email)) {

                // TODO potentially make a call to the server
                // to see if the server sesesion is active

                console.log("resolving!");
                resolve(data);
            } else {
                console.log("could not resolve");
                reject();
            }
        });
    },

    authenticate: function (options) {
        let url = [this.get("baseUrl"), 'login'].join('/');

        return new Ember.RSVP.Promise(function (resolve, reject) {
            Ember.$.ajax({
                url: url,
                type: 'POST',
                data: {
                    username: options.identification,
                    password: options.password
                }
            }).then(function (response) {
                Ember.run(function () {
                    resolve(response.data);
                });
            }, function (xhr) {
                var response = xhr.responseText;
                try {
                    response = JSON.parse(response).errors || response;
                } catch(e){}
                Ember.run(function () {
                    reject(response);
                });
            });
        });
    },

    invalidate: function (data) {
        let url = [this.get("baseUrl"), 'logout'].join('/');

        return new Ember.RSVP.Promise(function (resolve, reject) {
            Ember.$.ajax({
                url: url,
                type: 'POST'
            }).then(function (response) {
                Ember.run(function () {
                    resolve();
                });
            }, function (xhr) {
                var response = xhr.responseText;
                Ember.run(function () {
                    reject(response);
                });
            });
        });
    }
});

let Authorizer = BaseAuthorizer.extend({

    authorize: function(jqXHR, requestOptions){
        // TODO does nothing for now...
    }
});


export function initialize(container, application) {
    container.register('authenticator:custom', Authenticator);
    container.register('authorizer:custom', Authorizer);
}

export default {
    name: 'inject-auth',
    before: 'simple-auth',
    initialize: initialize
};
