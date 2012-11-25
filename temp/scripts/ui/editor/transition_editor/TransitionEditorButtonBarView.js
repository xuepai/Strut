(function() {

  define(["../button_bar/AbstractButtonBarView", "common/Math2"], function(AbstractButtonBarView, Math2) {
    var buttonBarOptions;
    buttonBarOptions = {
      rotateX: function(e) {
        var val;
        val = parseFloat(e.target.value);
        if (!isNaN(val)) {
          return this.model.changeSlideRotations(val);
        }
      },
      rotateY: function(e) {
        var val;
        val = parseFloat(e.target.value);
        if (!isNaN(val)) {
          return this.model.changeSlideRotations(null, val);
        }
      },
      rotateZ: function(e) {
        var val;
        val = parseFloat(e.target.value);
        if (!isNaN(val)) {
          return this.model.changeSlideRotations(null, null, val);
        }
      },
      interval: function(e) {
        var val;
        val = parseInt(e.target.value);
        if (!isNaN(val)) {
          return this.model.setInterval(val);
        }
      },
      slideEditor: function(e) {
        return this.$el.trigger("changePerspective", {
          perspective: "slideEditor"
        });
      },
      preview: function(e) {
        return this.$el.trigger("preview");
      },
      lookDownZ: function(e) {},
      lookDownY: function(e) {},
      lookDownX: function(e) {}
    };
    return AbstractButtonBarView.extend({
      events: function() {
        return {
          "keyup *[data-option]": "optionChosen",
          "paste *[data-option]": "optionChosen",
          "click .btn[data-option]": "optionChosen",
          "click": "clicked"
        };
      },
      initialize: function() {
        return AbstractButtonBarView.prototype.initialize.call(this, buttonBarOptions);
      },
      _slideRotationsChanged: function(model, slideRotations) {
        return this.partialRender(slideRotations);
      },
      clicked: function(e) {
        e.stopPropagation();
        return false;
      },
      partialRender: function(slideRotations, sceneRotations) {
        slideRotations || (slideRotations = this.model.slideRotations());
        if (slideRotations != null) {
          return this.updateRotationControls(this.$slideRotCtrls, slideRotations);
        }
      },
      updateRotationControls: function($which, rotations) {
        return $which.each(function(idx, elem) {
          var val;
          val = rotations[idx];
          if (!(val != null) || isNaN(val)) {
            val = 0;
          }
          return $(elem).val(Math2.round(val, 2));
        });
      },
      render: function() {
        this.$slideRotCtrls = this.$el.find(".slideRotations input");
        return this.partialRender();
      }
    });
  });

}).call(this);
