// Put a closure around every module to prevent global scope pollution

(function() {
    module('Balanced.Marketplaces.hold_transaction', {
        setup: function () {
            Ember.run(function () {
                var marketplace = Balanced.Marketplace.find('/v1/marketplaces/MP1');
                var router = Balanced.Router.create();

                router.transitionTo('marketplace.hold_transaction', marketplace);

            });
            this.$modal_dialog_component = $("#marketplace-hold-transaction").find(".modal-dialog-component");    
        }, teardown: function () {
            Ember.run(function(){
                Balanced.reset();    
            });
        }
    });

    test('renders a modal dialog', function (assert) {
        assert.ok(this.$modal_dialog_component.length, ".modal-dialog-component exists"); 
        assert.ok(this.$modal_dialog_component.hasClass("modal"), ".modal-dialog-component should be a modal");
    });

    test("modal dialog renders the header succesfully", function (assert) {
        var $modal_dialog_header = this.$modal_dialog_component.find("header");

        assert.ok($modal_dialog_header.hasClass("modal-header"), "modal-dialog-component should render successfully");
    });

    test('modal dialog renders the heading successfully', function (assert) {
        var $modal_dialog_heading= this.$modal_dialog_component.find(".heading");

        assert.ok($modal_dialog_heading.length, 'the heading exists');
        assert.strictEqual($modal_dialog_heading.text(), "Void Hold",  "the heading has the right text");
        assert.strictEqual($modal_dialog_heading.css("color"), "rgb(255, 255, 255)",  "the heading should be white");
    });

    test('modal dialog renders the body copy successfully', function(assert){
        var $modal_dialog_body_copy= this.$modal_dialog_component.find(".body-copy");

        assert.ok($modal_dialog_body_copy.length, 'The body copy exists');
        assert.strictEqual($modal_dialog_body_copy.text(), "Are you sure you want to cancel this hold?",  "The body copy has the right text");
        assert.strictEqual($modal_dialog_body_copy.css("font-weight"), 400, "The body copy should be bold");
        assert.strictEqual($modal_dialog_body_copy.css("color"), "rgb(0, 0, 0)", "The body copy should be black");
        assert.strictEqual($modal_dialog_body_copy.css("font-size"), "18px", "The font size should be large");
    });

    test('modal dialog can be confirmed', function(assert){
        var $success_action = this.$modal_dialog_component.find(".user-actions").find(".btn").not(".danger");

        assert.ok($success_action.length, 'The confirm action exists');
        assert.strictEqual($success_action.text(), "Yes", "The confirm action has the right text");
    });

    test('modal dialog can be closed', function(assert){
        var $close_action = this.$modal_dialog_component.find(".user-actions").find(".danger");

        assert.ok($close_action.length, 'Close action exists');
        assert.strictEqual($close_action.text(), "No", "The close action has the right text");
    });
})();