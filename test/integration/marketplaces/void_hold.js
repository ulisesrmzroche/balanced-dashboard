// Put a closure around every module to prevent global scope pollution

(function() {
    module('Balanced.Marketplaces.Hold.void', {
        setup: function () {
            Ember.run(function () {
                var marketplace = Balanced.Marketplace.find('/v1/marketplaces/MP1');
                var hold = Balanced.Marketplace.find('/v1/marketplaces/MP1/holds/1');
                var router = Balanced.Router.create();

                router.transitionTo('marketplace', marketplace);
                router.transitionTo("hold.void", hold);
                
            });
            this.router = Balanced.__container__.lookup("router:main");
            this.$modal = $(".modal");
        }, teardown: function () {
            Ember.run(function () {
                Balanced.reset();
            });
            
        }
    });

    test("on the right path", function(assert){
        assert.strictEqual(this.router.get("url"), '/marketplaces/MP1/holds/1/void', 'route should have the correct url');
    });
    
    test('renders a modal dialog', function (assert) {
        assert.ok(this.$modal.length, ".modal exists"); 
        assert.ok(this.$modal.hasClass("modal"), "modal should have class .modal");
    });

    test('modal has the right heading', function (assert) {
        var $modalHeading= this.$modal.find(".modal-header").find(".heading");

        assert.ok($modalHeading.length, 'the heading should render successfully');
        assert.strictEqual($modalHeading.text(), "Void Hold",  "the heading should have the right text");
    });

    test('modal has the right prompt', function(assert){
        var $prompt = this.$modal.find(".modal-body").find("h3");
        var $text = $.trim($prompt.text());

        assert.strictEqual($text, "Are you sure you want to cancel this hold?",  "The modal-body should render the right text");
    });

    test('modal dialog can be confirmed', function(assert){
        var $successAction = this.$modal.find(".user-actions").find(".btn").not(".danger");

        assert.ok($successAction.length, 'The confirm action exists');
        assert.strictEqual($successAction.text(), "Yes", "The confirm action has the right text");
    });

    test('modal dialog can be closed', function(assert){
        var $closeAction = this.$modal.find(".user-actions").find(".danger");

        assert.ok($closeAction.length, 'Close action exists');
        assert.strictEqual($closeAction.text(), "No", "The close action has the right text");
    });
})();