
/*
@author Matt Crinklaw-Vogt
*/


(function() {

  define(["vendor/amd/backbone", "./TransitionSlideSnapshot", "../Templates", "./TransitionEditorButtonBarView", "model/editor/transition_editor/TransitionEditorButtonBarModel", "vendor/amd/keymaster", "ui/interactions/CutCopyPasteBindings", "../SlideCopyPaste", "model/system/Clipboard", "css!../css/TransitionEditor.css"], function(Backbone, TransitionSlideSnapshot, Templates, ButtonBarView, ButtonBarModel, Keymaster, CutCopyPasteBindings, SlideCopyPaste, Clipboard, empty) {
    return Backbone.View.extend({
      className: "transitionEditor",
      events: {
        "click": "clicked"
      },
      scale: window.slideConfig.size.width / 150,
      initialize: function() {
        this.name = "Transition Editor";
        this._snapshots = [];
        this._clipboard = new Clipboard();
        _.extend(this, SlideCopyPaste);
        return CutCopyPasteBindings.applyTo(this, "transitionEditor");
      },
      show: function() {
        this.hidden = false;
        this.$el.removeClass("disp-none");
        Keymaster.setScope("transitionEditor");
        return this._partialRender();
      },
      resized: function() {},
      hide: function() {
        this.hidden = true;
        this._disposeOldView();
        return this.$el.addClass("disp-none");
      },
      clicked: function() {
        return this.model.get("slides").forEach(function(slide) {
          if (slide.get("selected")) {
            return slide.set("selected", false);
          }
        });
      },
      backgroundChanged: function(newBG) {},
      _disposeOldView: function() {
        this._snapshots.forEach(function(snapshot) {
          return snapshot.remove();
        });
        return this._snapshots = [];
      },
      render: function() {
        this.$el.html(Templates.TransitionEditor());
        this.buttonBarView = new ButtonBarView({
          model: new ButtonBarModel({
            deck: this.model
          }),
          el: this.$el.find(".navbar")
        });
        this.buttonBarView.render();
        this._partialRender();
        return this.$el;
      },
      _partialRender: function() {
        var $container, cnt, colCnt, slides,
          _this = this;
        this.buttonBarView.partialRender();
        $container = this.$el.find(".transitionSlides");
        $container.html("");
        slides = this.model.get("slides");
        colCnt = 6;
        cnt = 0;
        return slides.each(function(slide) {
          var snapshot, x;
          x = slide.get("x");
          if (!(x != null)) {
            slide.set("x", cnt * 160 + 30);
            slide.set("y", ((cnt / colCnt) | 0) * 160 + 80);
          }
          ++cnt;
          snapshot = new TransitionSlideSnapshot({
            model: slide
          });
          _this._snapshots.push(snapshot);
          return $container.append(snapshot.render());
        });
      }
    });
  });

}).call(this);
