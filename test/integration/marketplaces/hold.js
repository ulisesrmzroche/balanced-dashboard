(function() {
    module('Balanced.Marketplaces.Holds.Hold', {
        setup: function () {
            this.router = Balanced.__container__.lookup("router:main");
        }, teardown: function () {
            $(".modal").modal("hide").remove();
        }
    });

    test("is built successfully", function(assert){
        expect(4);
        var $pageTitle, $voidAction, $modal;
        visit("/marketplaces/MP1/holds/1").then(function(){
            $pageTitle = find(".page-title");
            assert.equal($pageTitle.text(), 'Hold', 'route should have the right page-title');
        }).then(function(){
            $voidAction = find(".user-actions.void");
            assert.ok($voidAction.length, 'should render a void button');
        }).then(function(){
            $voidAction.click().promise().then(function(){
                $modal = find(".modal");
                assert.ok($modal.length, 'should render a modal');
                assert.equal($modal.find(".modal-header").find("h3").text(), "Void Hold", 'modal should have the right heading');
            });
        });
     });

})();