Balanced.ModalView = Balanced.View.extend({
    layoutName: "_modal",
    classNames: "modal hide".w(),
    didInsertElement: function(){
        Balanced.$(this.get("element")).modal('show');
    },

    willDestroyElement: function(){
        Balanced.$(this.get("element")).modal('hide');
    },

    close: function() {
        this.remove();
    },

    heading: null,
});