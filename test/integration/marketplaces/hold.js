// Put a closure around every module to prevent global scope pollution

(function() {
    module('Balanced.Marketplaces.Holds.Hold', {
        setup: function () {
            Ember.run(function () {
                Testing.selectMarketplaceByName();
            });
            this.router = Balanced.__container__.lookup("router:main");
        }, teardown: function () {
        }
    });

    test("on the right path", function(assert){
        assert.strictEqual(this.router.get("url"), '/marketplaces/MP1/holds/1', 'route should have the correct url'); 
    });

    test("has the right page-title", function(assert){
        var $pageTitle = $(".page-title").text();
        assert.strictEqual($pageTitle, 'Hold', 'route should have the right page-title');
    });

    test("hold can be void", function(assert){
        var $voidAction = $(".user-actions.void");
        click($voidAction);
        
        assert.strictEqual(this.router.get("url"), '/marketplaces/MP1/holds/1/void', 'route should have the correct url');
    });

    test("hold can be captured", function(assert){
        var $captureAction = $(".user-actions.capture");
        $captureAction.click();
        assert.strictEqual(this.router.get("url"), '/marketplaces/MP1/holds/1/capture', 'route should have the correct url');
    });

    test("displays the hold's id", function(assert){
        var $holdId= $(".hold-id");
        assert.strictEqual($holdId.text(), '1', 'route should display the holds id');
    });

})();