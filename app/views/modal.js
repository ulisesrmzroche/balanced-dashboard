Balanced.ModalView = Balanced.View.extend({
    layoutName: "_modal",

    didInsertElement: function(){
        Balanced.$(this.get("element")).modal('show');
    },

    willDestroyElement: function(){
        Balanced.$(this.get("element")).modal('hide');
    },

    close: function() {
        this.router.transitionTo("marketplace");
    },

    heading: null,
});