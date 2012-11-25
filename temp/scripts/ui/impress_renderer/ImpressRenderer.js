(function() {

  define(["vendor/amd/Handlebars", "./Templates", "common/Math2"], function(Handlebars, Templates, Math2) {
    var ImpressRenderer;
    ImpressRenderer = (function() {

      function ImpressRenderer() {
        var _this = this;
        Handlebars.registerHelper("renderComponent", function(componentModel) {
          var result;
          result = "";
          switch (componentModel.get("type")) {
            case "ImageModel":
              if (componentModel.get("imageType") === "SVG") {
                result = Templates.SVGImage(componentModel.attributes);
              } else {
                result = Templates.Image(componentModel.attributes);
              }
              break;
            case "TextBox":
              result = Templates.TextBox(_this.convertTextBoxData(componentModel.attributes));
              break;
            case "Video":
              if (componentModel.get("videoType") === "html5") {
                result = Templates.Video(componentModel.attributes);
              } else {
                result = Templates.Youtube(componentModel.attributes);
              }
              break;
            case "WebFrame":
              result = Templates.WebFrame(componentModel.attributes);
          }
          return new Handlebars.SafeString(result);
        });
        Handlebars.registerHelper("scaleX", function(x) {
          return x * slideConfig.size.width / 150;
        });
        Handlebars.registerHelper("scaleY", function(y) {
          return y * slideConfig.size.width / 150;
        });
        Handlebars.registerHelper("toDeg", function(v) {
          return v * 180 / Math.PI;
        });
        Handlebars.registerHelper("negate", function(v) {
          return -1 * v;
        });
        Handlebars.registerHelper("round", function(v) {
          return Math2.round(v, 2);
        });
        Handlebars.registerHelper("extractBG", function(styles) {
          var browsers, prefix, result, style, _i, _len;
          if ((styles != null) && styles.length > 0) {
            result = "";
            style = styles[0];
            browsers = ["-moz-", "-webkit-", "-o-", "-ms-", ""];
            for (_i = 0, _len = browsers.length; _i < _len; _i++) {
              prefix = browsers[_i];
              result += "background-image: " + prefix + style + "; ";
            }
            return result;
          } else {
            return "";
          }
        });
        Handlebars.registerPartial("ComponentContainer", Templates.ComponentContainer);
        Handlebars.registerPartial("TransformContainer", Templates.TransformContainer);
        Handlebars.registerPartial("SVGContainer", Templates.SVGContainer);
      }

      ImpressRenderer.prototype.render = function(deckAttrs) {
        var cnt, colCnt, slides,
          _this = this;
        slides = deckAttrs.slides;
        colCnt = 6;
        cnt = 0;
        slides.each(function(slide) {
          var x;
          x = slide.get("x");
          if (!(x != null)) {
            slide.set("x", cnt * 160 + 30);
            slide.set("y", ((cnt / colCnt) | 0) * 160 + 80);
          }
          return ++cnt;
        });
        return Templates.ImpressTemplate(deckAttrs);
      };

      ImpressRenderer.prototype.convertTextBoxData = function(attrs) {
        var copy;
        copy = _.extend({}, attrs);
        copy.text = new Handlebars.SafeString(attrs.text);
        return copy;
      };

      return ImpressRenderer;

    })();
    return new ImpressRenderer();
  });

}).call(this);
