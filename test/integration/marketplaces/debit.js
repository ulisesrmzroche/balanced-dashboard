(function() {
    var debit;

    module('Balanced.MarketplaceDebitsDebit', {
        setup: function () {
            Ember.run(function () {
                var marketplace = Balanced.Marketplace.find('/v1/marketplaces/MP1');
                var router = Balanced.Router.create();
                debit = Balanced.Debit.find("/v1/marketplaces/MP1/debits/1")
                router.transitionTo('marketplace', marketplace);
                router.transitionTo("debits.debit", debit);

            });

        }, teardown: function () {
            Ember.run(function(){
                Balanced.reset();    
            });
        }
    });

    test("on the correct url", function (assert) {
        var router = Balanced.__container__.lookup("router:main");
        assert.strictEqual(router.get("url"), '/marketplaces/MP1/debits/1', 'route should have the correct url')
    });
    
})();