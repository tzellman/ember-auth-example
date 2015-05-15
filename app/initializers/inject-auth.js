import Ember from "ember";
import BaseAuthenticator from 'simple-auth/authenticators/base';
import BaseAuthorizer from 'simple-auth/authorizers/base';

let Authenticator = BaseAuthenticator.extend({

    baseUrl: '/api',

    restore: function (data) {
        return new Ember.RSVP.Promise(function (resolve, reject) {
            if (!Ember.isEmpty(data.username)) {
                resolve(data);
            } else {
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
                    resolve(response.user);
                });
            }, function (xhr) {
                var response = xhr.responseText;
                try {
                    response = JSON.parse(response).errors || response;
                } catch (e) {
                }
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

    authorize: function (jqXHR, requestOptions) {
        if (this.get('session.isAuthenticated') && !Ember.isEmpty(this.get('session.secure.username'))) {
            // TODO potentially set a header
        }
    }
});


export function initialize(container, application) {
    application.register('authenticator:custom', Authenticator);
    application.register('authorizer:custom', Authorizer);
}

export default {
    name: 'inject-auth',
    before: 'simple-auth',
    initialize: initialize
};
