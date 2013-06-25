QUnit.testStart(function (test) {

    var setupTest = function () {
       logModuleDetails();
       Ember.testing = true;
       setupFakeServer();
       buildTestingContainer();
       Ember.run(Balanced, Balanced.advanceReadiness);
       window.Balanced.onLoad();
       logSetupComplete();
    };

    var setupFakeServer = function(){
        Ember.ENV.BALANCED.WWW = 'http://example.org';
    };

    var setupTestingContainer = function() {
        Ember.run(function () {
            window.setupBalanced('#ember-testing');
            Balanced.Adapter = Balanced.FixtureAdapter.create();
            window.setupTestFixtures();

            Balanced.THROTTLE = 0;
            Balanced.setupForTesting();
        });

    };

    var setupEmberAuth = function(){
         Ember.run(function () {
            var userId = '/users/USeb4a5d6ca6ed11e2bea6026ba7db2987';
            Balanced.Auth.setAuthProperties(
                true,
                Balanced.User.find(userId),
                userId,
                userId,
                false
            );
        });
    };

    var buildTestingContainer = function(){
        Ember.$('<style>#ember-testing-container { position: absolute; background: white; bottom: 0; right: 0; width: 640px; height: 600px; overflow: auto; z-index: 9999; border: 1px solid #ccc; } #ember-testing { zoom: 50%; }</style>').appendTo('head');
        Ember.$('<div id="ember-testing-container"><div id="ember-testing"></div></div>').appendTo('body');
        setupTestingContainer();
        setupEmberAuth();
        Balanced.injectTestHelpers();
    };

    var logModuleDetails = function(){
         var module = test.module ? test.module : '';
         console.log('#' + module + " " + test.name + ": starting setup.");
    };

    var logSetupComplete = function() {
         var module = test.module ? test.module : '';
        console.log('#' + module + " " + test.name + ": setup complete. Starting test");
    };

    setupTest();

});

QUnit.testDone(function (test) {
    var teardownTest = function () {
        logModuleDetails();
        resetEmber();
        teardownComplete();
    }

    var logModuleDetails = function(){
        var module = getModule();
        message = '#' + module + " " + test.name + ": tearing down."
        console.log(message);
    };

    var getModule = function(){
        var module = test.module ? test.module : '';
        return module;
    };

    var resetEmber = function() {
        Balanced.removeTestHelpers();
        Ember.$('#ember-testing-container, #ember-testing').remove();
        Ember.run(Balanced, Balanced.destroy);
        Balanced = null;
        Ember.testing = false;
    };

    var teardownComplete = function() {
        var module = getModule();
        console.log('#' + module + " " + test.name + ": done.");
    };

    teardownTest();
});