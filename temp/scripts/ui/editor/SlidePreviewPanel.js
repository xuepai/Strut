
/*
@author Matt Crinklaw-Vogt
*/


(function() {

  define(["vendor/amd/backbone", "./SlideSnapshot", "vendor/amd/keymaster", "ui/interactions/CutCopyPasteBindings", "model/system/Clipboard", "./SlideCopyPaste", "css!./css/SlidePreviewPanel.css"], function(Backbone, SlideSnapshot, Keymaster, CutCopyPasteBindings, Clipboard, SlideCopyPaste, empty) {
    return Backbone.View.extend({
      className: "slidePreviewPanel",
      events: {
        "sortstop": "sortstop",
        "click": "clicked"
      },
      initialize: function() {
        var slideCollection;
        slideCollection = this.model.get("slides");
        slideCollection.on("add", this._slideCreated, this);
        slideCollection.on("reset", this._slidesReset, this);
        _.extend(this, SlideCopyPaste);
        CutCopyPasteBindings.applyTo(this, "slidePreviewPanel");
        return this._clipboard = new Clipboard();
      },
      _slideCreated: function(slide, collection, options) {
        var $children, snapshot;
        snapshot = new SlideSnapshot({
          model: slide,
          deck: this.model
        });
        snapshot.on("removeClicked", this.slideRemoveClicked, this);
        if (options != null) {
          $children = this.$el.children();
          if ($children.length > 0 && options.index < $children.length) {
            return $children.eq(options.index).before(snapshot.render());
          } else {
            return this.$el.append(snapshot.render());
          }
        } else {
          return this.$el.append(snapshot.render());
        }
      },
      _slidesReset: function(newSlides) {
        var _this = this;
        return newSlides.each(function(slide) {
          return _this._slideCreated(slide);
        });
      },
      _slideRemoved: function(slide, collection, options) {
        this.snapshots[options.index].remove();
        return this.snapshots.splice(options.index, 1);
      },
      slideRemoveClicked: function(snapshot) {
        return this.model.removeSlide(snapshot.model);
      },
      render: function() {
        var slides,
          _this = this;
        slides = this.model.get("slides");
        if (slides != null) {
          slides.each(function(slide) {
            return _this._slideCreated(slide);
          });
        }
        this.$el.sortable();
        return this.$el;
      },
      sortstop: function(e, ui) {
        var _this = this;
        this.$el.children().each(function(idx, elem) {
          return $(elem).data("jsView").model.set("num", idx);
        });
        return this.model.get("slides").sort({
          silent: true
        });
      },
      clicked: function() {
        if (Keymaster.getScope() !== "slidePreviewPanel") {
          return Keymaster.setScope("slidePreviewPanel");
        }
      },
      remove: function() {
        Backbone.View.prototype.remove.apply(this, arguments);
        return this.dispose();
      },
      dispose: function() {
        return this.snapshots.forEach(function(snapshot) {
          return snapshot.dispose();
        });
      }
    });
  });

}).call(this);
