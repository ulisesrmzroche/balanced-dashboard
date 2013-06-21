Balanced.ModalDialogComponent = Balanced.View.extend({
    tagName: 'div',
    classNames: "modal-dialog-component modal hide".w(),
    templateName: "components/modal_dialog_component",

    didInsertElement: function(){
        Balanced.$(this.get("element")).modal('show');
    },

    willDestroyElement: function(){
        Balanced.$(this.get("element")).modal('hide');
    },

    heading: null,
    bodyCopy: null
});