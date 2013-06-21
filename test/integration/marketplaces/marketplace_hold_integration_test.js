// Put a closure around every module to prevent global scope pollution

(function() {
    module('Balanced.Marketplaces.hold', {
        setup: function () {
            Ember.run(function () {
                var marketplace = Balanced.Marketplace.find('/v1/marketplaces/MP1');
                var router = Balanced.Router.create();

                router.transitionTo('marketplace.hold', marketplace);

            });
            this.$modal= $("#marketplace-hold-transaction").find(".modal");    
        }, teardown: function () {
            Ember.run(function(){
                Balanced.reset();    
            });
        }
    });

    test('renders a modal dialog', function (assert) {
        assert.ok(this.$modal.length, ".modal exists"); 
        assert.ok(this.$modal.hasClass("modal"), "modal should have class .modal");
    });

    test('modal has the right heading', function (assert) {
        var $modal_heading= this.$modal.find(".modal-header").find(".heading");

        assert.ok($modal_heading.length, 'the heading should render successfully');
        assert.strictEqual($modal_heading.text(), "Void Hold",  "the heading should have the right text");
    });

    test('modal has the right prompt', function(assert){
        var $prompt = this.$modal.find(".modal-body").find("h3");
        var $text = $.trim($prompt.text());

        assert.strictEqual($text, "Are you sure you want to cancel this hold?",  "The modal-body should render the right text");
    });

    test('modal dialog can be confirmed', function(assert){
        var $success_action = this.$modal.find(".user-actions").find(".btn").not(".danger");

        assert.ok($success_action.length, 'The confirm action exists');
        assert.strictEqual($success_action.text(), "Yes", "The confirm action has the right text");
    });

    test('modal dialog can be closed', function(assert){
        var $close_action = this.$modal.find(".user-actions").find(".danger");

        assert.ok($close_action.length, 'Close action exists');
        assert.strictEqual($close_action.text(), "No", "The close action has the right text");
    });
})();