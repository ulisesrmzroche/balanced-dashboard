module('Balanced.Marketplaces.hold_transaction', {
    setup: function () {
        Ember.run(function () {
            var marketplace = Balanced.Marketplace.find('/v1/marketplaces/MP1');
            var router = Balanced.Router.create();

            
            router.transitionTo('marketplace.hold_transaction', marketplace);
        });
    }, teardown: function () {

    }

});

test('renders a modal dialog', function (assert) {
    var $modal_dialog = $("#marketplace-hold-transaction");
    assert.ok($modal_dialog.hasClass("modal-dialog-component"), "modal dialog should have rendered");
});

test('modal dialog renders the heading successfully', function (assert) {
    var $dialog_heading= $(".modal-dialog-component").find(".heading");
    assert.ok($dialog_heading.length, 'the heading exists');
    assert.equal($dialog_heading.text(), "Void Hold",  "the heading has the right text");
});

test('modal dialog renders the body copy successfully', function(assert){
    var $body_copy = $(".modal-dialog-component").find(".body-copy");
    assert.ok($body_copy.length, 'The body copy exists');
    assert.equal($body_copy.text(), "Are you sure you want to cancel this hold?",  "The body copy has the right text");
});

test('modal dialog can be confirmed', function(assert){
    var $success_action = $(".modal-dialog-component").find(".user-actions").find(".confirm");
    assert.ok($success_action.length, 'The confirm action exists');
    assert.equal($success_action.text(), "Yes", "The confirm action has the right text");
});

test('modal dialog can be closed', function(assert){
    var $close_action = $(".modal-dialog-component").find(".user-actions").find(".close");
    assert.ok($close_action.length, 'Close action exists');
    assert.equal($close_action.text(), "No", "The close action has the right text");
});