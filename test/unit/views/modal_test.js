(function() {

    var modal;

    module('Balanced.ModalView', {
        setup: function () {
            var modalDialogView = Balanced.View.extend({});

            modal = modalDialogView.create();
        }
    });

    test("renders the heading when given", function (assert) {
        modal.set("heading", "Heading Example");
        assert.strictEqual(modal.get("heading"), "Heading Example", "heading should have rendered successfully");
    });

    test("renders nothing when heading is null", function (assert) {
        modal.set("heading", null);
        assert.strictEqual(modal.get("heading"), null);
    });

})();