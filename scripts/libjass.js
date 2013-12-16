/**
* libjass
*
* https://github.com/Arnavion/libjass
*
* Copyright 2013 Arnav Singh
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
///<reference path="libjass.ts" />
"use strict";

var global = (0, eval)("this");

var libjass;

(function(libjass) {
    /**
    * Set implementation for browsers that don't support it. Only supports Number and String elements.
    *
    * Elements are stored as properties of an object, with names derived from their type.
    *
    * @constructor
    * @template T
    *
    * @private
    * @memberof libjass
    */
    var SimpleSet = function() {
        function SimpleSet() {
            this.clear();
        }
        /**
        * @param {T} value
        * @return {libjass.Set.<T>} This set
        */
        SimpleSet.prototype.add = function(value) {
            var property = this._toProperty(value);
            if (property === null) {
                throw new Error("This Set implementation only supports Number and String values.");
            }
            this._data[property] = value;
            return this;
        };
        SimpleSet.prototype.clear = function() {
            this._data = Object.create(null);
        };
        /**
        * @param {T} value
        * @return {boolean}
        */
        SimpleSet.prototype.has = function(value) {
            var property = this._toProperty(value);
            if (property === null) {
                return false;
            }
            return property in this._data;
        };
        /**
        * @param {function(T, T, libjass.Set.<T>)} callbackfn A function that is called with each value in the set.
        */
        SimpleSet.prototype.forEach = function(callbackfn, thisArg) {
            var _this = this;
            Object.keys(this._data).map(function(property) {
                var value = _this._data[property];
                callbackfn.call(thisArg, value, value, _this);
            });
        };
        SimpleSet.prototype.delete = function() {
            throw new Error("This Set implementation doesn't support delete().");
        };
        Object.defineProperty(SimpleSet.prototype, "size", {
            get: function() {
                throw new Error("This Set implementation doesn't support size.");
            },
            enumerable: true,
            configurable: true
        });
        SimpleSet.prototype._toProperty = function(value) {
            if (typeof value == "number") {
                return "#" + value;
            } else if (typeof value == "string") {
                return "'" + value;
            }
            return null;
        };
        return SimpleSet;
    }();
    libjass.Set;
    // Use this browser's implementation of Set if it has one
    if (typeof global.Set !== "undefined" && typeof global.Set.prototype.forEach === "function") {
        libjass.Set = global.Set;
    } else {
        libjass.Set = SimpleSet;
    }
    /**
    * Map implementation for browsers that don't support it. Only supports Number and String keys.
    *
    * Keys and values are stored as properties of an object, with property names derived from the key type.
    *
    * @constructor
    * @template K, V
    *
    * @private
    * @memberof libjass
    */
    var SimpleMap = function() {
        function SimpleMap() {
            this.clear();
        }
        /**
        * @param {K} key
        * @return {V}
        */
        SimpleMap.prototype.get = function(key) {
            var property = this._keyToProperty(key);
            if (property === null) {
                return undefined;
            }
            return this._values[property];
        };
        /**
        * @param {K} key
        * @return {boolean}
        */
        SimpleMap.prototype.has = function(key) {
            var property = this._keyToProperty(key);
            if (property === null) {
                return false;
            }
            return property in this._keys;
        };
        /**
        * @param {K} key
        * @param {V} value
        * @return {libjass.Map.<K, V>} This map
        */
        SimpleMap.prototype.set = function(key, value) {
            var property = this._keyToProperty(key);
            if (property === null) {
                throw new Error("This Map implementation only supports Number and String keys.");
            }
            this._keys[property] = key;
            this._values[property] = value;
            return this;
        };
        /**
        * @param {K} key
        * @return {boolean} true if the key was present before being deleted, false otherwise
        */
        SimpleMap.prototype.delete = function(key) {
            var property = this._keyToProperty(key);
            if (property === null) {
                return false;
            }
            var result = property in this._keys;
            if (result) {
                delete this._keys[property];
                delete this._values[property];
            }
            return result;
        };
        SimpleMap.prototype.clear = function() {
            this._keys = Object.create(null);
            this._values = Object.create(null);
        };
        /**
        * @param {function(V, K, libjass.Map.<K, V>)} callbackfn A function that is called with each key and value in the map.
        */
        SimpleMap.prototype.forEach = function(callbackfn, thisArg) {
            var keysArray = Object.keys(this._keys);
            for (var i = 0; i < keysArray.length; i++) {
                var property = keysArray[i];
                callbackfn.call(thisArg, this._values[property], this._keys[property], this);
            }
        };
        Object.defineProperty(SimpleMap.prototype, "size", {
            get: function() {
                throw new Error("This Map implementation doesn't support size.");
            },
            enumerable: true,
            configurable: true
        });
        SimpleMap.prototype._keyToProperty = function(key) {
            if (typeof key == "number") {
                return "#" + key;
            } else if (typeof key == "string") {
                return "'" + key;
            }
            return null;
        };
        return SimpleMap;
    }();
    libjass.Map;
    // Use this browser's implementation of Map if it has one
    if (typeof global.Map !== "undefined" && typeof global.Map.prototype.forEach === "function") {
        libjass.Map = global.Map;
    } else {
        libjass.Map = SimpleMap;
    }
})(libjass || (libjass = {}));

var module;

if (module && module.exports) {
    module.exports = libjass;
}

var __extends = this.__extends || function(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    __.prototype = b.prototype;
    d.prototype = new __();
};

(function(libjass) {
    (function(parts) {
        /**
        * Represents a CSS color with red, green, blue and alpha components.
        *
        * Instances of this class are immutable.
        *
        * @constructor
        * @param {number} red
        * @param {number} green
        * @param {number} blue
        * @param {number=1} alpha
        *
        * @memberof libjass.parts
        */
        var Color = function() {
            function Color(_red, _green, _blue, _alpha) {
                if (typeof _alpha === "undefined") {
                    _alpha = 1;
                }
                this._red = _red;
                this._green = _green;
                this._blue = _blue;
                this._alpha = _alpha;
            }
            Object.defineProperty(Color.prototype, "red", {
                get: function() {
                    return this._red;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Color.prototype, "green", {
                get: function() {
                    return this._green;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Color.prototype, "blue", {
                get: function() {
                    return this._blue;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Color.prototype, "alpha", {
                get: function() {
                    return this._alpha;
                },
                enumerable: true,
                configurable: true
            });
            /**
            * @param {?number} value The new alpha. If null, the existing alpha is used.
            * @return {!libjass.parts.Color} Returns a new Color instance with the same color but the provided alpha.
            */
            Color.prototype.withAlpha = function(value) {
                if (value !== null) {
                    return new Color(this._red, this._green, this._blue, value);
                }
                return this;
            };
            /**
            * @return {string} The CSS representation "rgba(...)" of this color.
            */
            Color.prototype.toString = function() {
                return "rgba(" + this._red + ", " + this._green + ", " + this._blue + ", " + this._alpha + ")";
            };
            return Color;
        }();
        parts.Color = Color;
        /**
        * The base class of the ASS tag classes.
        *
        * @constructor
        *
        * @param {string} name
        * @param {...string} propertyNames
        *
        * @abstract
        * @memberof libjass.parts
        */
        var PartBase = function() {
            function PartBase(_name) {
                var _propertyNames = [];
                for (var _i = 0; _i < arguments.length - 1; _i++) {
                    _propertyNames[_i] = arguments[_i + 1];
                }
                this._name = _name;
                this._propertyNames = _propertyNames;
            }
            /**
            * @return {string} A simple representation of this tag's name and properties.
            */
            PartBase.prototype.toString = function() {
                var _this = this;
                return this._name + " { " + this._propertyNames.map(function(name) {
                    return name + ": " + _this[name];
                }).join(", ") + (this._propertyNames.length > 0 ? " " : "") + "}";
            };
            return PartBase;
        }();
        parts.PartBase = PartBase;
        /**
        * A comment, i.e., any text enclosed in {} that is not understood as an ASS tag.
        *
        * @constructor
        * @param {string} value The text of this comment
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var Comment = function(_super) {
            __extends(Comment, _super);
            function Comment(_value) {
                _super.call(this, "Comment", "value");
                this._value = _value;
            }
            Object.defineProperty(Comment.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return Comment;
        }(PartBase);
        parts.Comment = Comment;
        /**
        * A block of text, i.e., any text not enclosed in {}. Also includes \h and \N.
        *
        * @constructor
        * @param {string} value The content of this block of text
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var Text = function(_super) {
            __extends(Text, _super);
            function Text(_value) {
                _super.call(this, "Text", "value");
                this._value = _value;
            }
            Object.defineProperty(Text.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            Text.prototype.toString = function() {
                return "Text { value: " + this._value.replace(/\u00A0/g, "\\h").replace(/\n/g, "\\N") + " }";
            };
            return Text;
        }(PartBase);
        parts.Text = Text;
        /**
        * An italic tag {\i}
        *
        * @constructor
        * @param {?boolean} value {\i1} -> true, {\i0} -> false, {\i} -> null
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var Italic = function(_super) {
            __extends(Italic, _super);
            function Italic(_value) {
                _super.call(this, "Italic", "value");
                this._value = _value;
            }
            Object.defineProperty(Italic.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return Italic;
        }(PartBase);
        parts.Italic = Italic;
        /**
        * A bold tag {\b}
        *
        * @constructor
        * @param {*} value {\b1} -> true, {\b0} -> false, {\b###} -> weight of the bold (number), {\b} -> null
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var Bold = function(_super) {
            __extends(Bold, _super);
            function Bold(_value) {
                _super.call(this, "Bold", "value");
                this._value = _value;
            }
            Object.defineProperty(Bold.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return Bold;
        }(PartBase);
        parts.Bold = Bold;
        /**
        * An underline tag {\u}
        *
        * @constructor
        * @param {?boolean} value {\u1} -> true, {\u0} -> false, {\u} -> null
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var Underline = function(_super) {
            __extends(Underline, _super);
            function Underline(_value) {
                _super.call(this, "Underline", "value");
                this._value = _value;
            }
            Object.defineProperty(Underline.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return Underline;
        }(PartBase);
        parts.Underline = Underline;
        /**
        * A strike-through tag {\s}
        *
        * @constructor
        * @param {?boolean} value {\s1} -> true, {\s0} -> false, {\s} -> null
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var StrikeThrough = function(_super) {
            __extends(StrikeThrough, _super);
            function StrikeThrough(_value) {
                _super.call(this, "StrikeThrough", "value");
                this._value = _value;
            }
            Object.defineProperty(StrikeThrough.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return StrikeThrough;
        }(PartBase);
        parts.StrikeThrough = StrikeThrough;
        /**
        * A border tag {\bord}
        *
        * @constructor
        * @param {?number} value {\bord###} -> width (number), {\bord} -> null
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var Border = function(_super) {
            __extends(Border, _super);
            function Border(_value) {
                _super.call(this, "Border", "value");
                this._value = _value;
            }
            Object.defineProperty(Border.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return Border;
        }(PartBase);
        parts.Border = Border;
        /**
        * A horizontal border tag {\xbord}
        *
        * @constructor
        * @param {?number} value {\xbord###} -> width (number), {\xbord} -> null
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var BorderX = function(_super) {
            __extends(BorderX, _super);
            function BorderX(_value) {
                _super.call(this, "BorderX", "value");
                this._value = _value;
            }
            Object.defineProperty(BorderX.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return BorderX;
        }(PartBase);
        parts.BorderX = BorderX;
        /**
        * A vertical border tag {\ybord}
        *
        * @constructor
        * @param {?number} value {\ybord###} -> height (number), {\ybord} -> null
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var BorderY = function(_super) {
            __extends(BorderY, _super);
            function BorderY(_value) {
                _super.call(this, "BorderY", "value");
                this._value = _value;
            }
            Object.defineProperty(BorderY.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return BorderY;
        }(PartBase);
        parts.BorderY = BorderY;
        /**
        * A shadow tag {\shad}
        *
        * @constructor
        * @param {?number} value {\shad###} -> depth (number), {\shad} -> null
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var Shadow = function(_super) {
            __extends(Shadow, _super);
            function Shadow(_value) {
                _super.call(this, "Shadow", "value");
                this._value = _value;
            }
            Object.defineProperty(Shadow.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return Shadow;
        }(PartBase);
        parts.Shadow = Shadow;
        /**
        * A horizontal shadow tag {\xshad}
        *
        * @constructor
        * @param {?number} value {\xshad###} -> depth (number), {\xshad} -> null
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var ShadowX = function(_super) {
            __extends(ShadowX, _super);
            function ShadowX(_value) {
                _super.call(this, "ShadowX", "value");
                this._value = _value;
            }
            Object.defineProperty(ShadowX.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return ShadowX;
        }(PartBase);
        parts.ShadowX = ShadowX;
        /**
        * A vertical shadow tag {\yshad}
        *
        * @constructor
        * @param {?number} value {\yshad###} -> depth (number), {\yshad} -> null
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var ShadowY = function(_super) {
            __extends(ShadowY, _super);
            function ShadowY(_value) {
                _super.call(this, "ShadowY", "value");
                this._value = _value;
            }
            Object.defineProperty(ShadowY.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return ShadowY;
        }(PartBase);
        parts.ShadowY = ShadowY;
        /**
        * A blur tag {\be}
        *
        * @constructor
        * @param {?number} value {\be###} -> strength (number), {\be} -> null
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var Blur = function(_super) {
            __extends(Blur, _super);
            function Blur(_value) {
                _super.call(this, "Blur", "value");
                this._value = _value;
            }
            Object.defineProperty(Blur.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return Blur;
        }(PartBase);
        parts.Blur = Blur;
        /**
        * A Gaussian blur tag {\blur}
        *
        * @constructor
        * @param {?number} value {\blur###} -> strength (number), {\blur} -> null
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var GaussianBlur = function(_super) {
            __extends(GaussianBlur, _super);
            function GaussianBlur(_value) {
                _super.call(this, "Blur", "value");
                this._value = _value;
            }
            Object.defineProperty(GaussianBlur.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return GaussianBlur;
        }(PartBase);
        parts.GaussianBlur = GaussianBlur;
        /**
        * A font name tag {\fn}
        *
        * @constructor
        * @param {?string} value {\fn###} -> name (string), {\fn} -> null
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var FontName = function(_super) {
            __extends(FontName, _super);
            function FontName(_value) {
                _super.call(this, "FontName", "value");
                this._value = _value;
            }
            Object.defineProperty(FontName.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return FontName;
        }(PartBase);
        parts.FontName = FontName;
        /**
        * A font size tag {\fs}
        *
        * @constructor
        * @param {?number} value {\fs###} -> size (number), {\fs} -> null
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var FontSize = function(_super) {
            __extends(FontSize, _super);
            function FontSize(_value) {
                _super.call(this, "FontSize", "value");
                this._value = _value;
            }
            Object.defineProperty(FontSize.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return FontSize;
        }(PartBase);
        parts.FontSize = FontSize;
        /**
        * A horizontal font scaling tag {\fscx}
        *
        * @constructor
        * @param {?number} value {\fscx###} -> scale (number), {\fscx} -> null
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var FontScaleX = function(_super) {
            __extends(FontScaleX, _super);
            function FontScaleX(_value) {
                _super.call(this, "FontScaleX", "value");
                this._value = _value;
            }
            Object.defineProperty(FontScaleX.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return FontScaleX;
        }(PartBase);
        parts.FontScaleX = FontScaleX;
        /**
        * A vertical font scaling tag {\fscy}
        *
        * @constructor
        * @param {?number} value {\fscy###} -> scale (number), {\fscy} -> null
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var FontScaleY = function(_super) {
            __extends(FontScaleY, _super);
            function FontScaleY(_value) {
                _super.call(this, "FontScaleX", "value");
                this._value = _value;
            }
            Object.defineProperty(FontScaleY.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return FontScaleY;
        }(PartBase);
        parts.FontScaleY = FontScaleY;
        /**
        * A letter spacing tag {\fsp}
        *
        * @constructor
        * @param {?number} value {\fsp###} -> spacing (number), {\fsp} -> null
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var LetterSpacing = function(_super) {
            __extends(LetterSpacing, _super);
            function LetterSpacing(_value) {
                _super.call(this, "LetterSpacing", "value");
                this._value = _value;
            }
            Object.defineProperty(LetterSpacing.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return LetterSpacing;
        }(PartBase);
        parts.LetterSpacing = LetterSpacing;
        /**
        * An X-axis rotation tag {\frx}
        *
        * @constructor
        * @param {?number} value {\frx###} -> angle (number), {\frx} -> null
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var RotateX = function(_super) {
            __extends(RotateX, _super);
            function RotateX(_value) {
                _super.call(this, "RotateX", "value");
                this._value = _value;
            }
            Object.defineProperty(RotateX.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return RotateX;
        }(PartBase);
        parts.RotateX = RotateX;
        /**
        * A Y-axis rotation tag {\fry}
        *
        * @constructor
        * @param {?number} value {\fry###} -> angle (number), {\fry} -> null
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var RotateY = function(_super) {
            __extends(RotateY, _super);
            function RotateY(_value) {
                _super.call(this, "RotateY", "value");
                this._value = _value;
            }
            Object.defineProperty(RotateY.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return RotateY;
        }(PartBase);
        parts.RotateY = RotateY;
        /**
        * A Z-axis rotation tag {\fr} or {\frz}
        *
        * @constructor
        * @param {?number} value {\frz###} -> angle (number), {\frz} -> null
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var RotateZ = function(_super) {
            __extends(RotateZ, _super);
            function RotateZ(_value) {
                _super.call(this, "RotateZ", "value");
                this._value = _value;
            }
            Object.defineProperty(RotateZ.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return RotateZ;
        }(PartBase);
        parts.RotateZ = RotateZ;
        /**
        * An X-axis shearing tag {\fax}
        *
        * @constructor
        * @param {?number} value {\fax###} -> angle (number), {\fax} -> null
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var SkewX = function(_super) {
            __extends(SkewX, _super);
            function SkewX(_value) {
                _super.call(this, "SkewX", "value");
                this._value = _value;
            }
            Object.defineProperty(SkewX.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return SkewX;
        }(PartBase);
        parts.SkewX = SkewX;
        /**
        * A Y-axis shearing tag {\fay}
        *
        * @constructor
        * @param {?number} value {\fay###} -> angle (number), {\fay} -> null
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var SkewY = function(_super) {
            __extends(SkewY, _super);
            function SkewY(_value) {
                _super.call(this, "SkewY", "value");
                this._value = _value;
            }
            Object.defineProperty(SkewY.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return SkewY;
        }(PartBase);
        parts.SkewY = SkewY;
        /**
        * A primary color tag {\c} or {\1c}
        *
        * @constructor
        * @param {libjass.parts.Color} value {\1c###} -> color (Color), {\1c} -> null
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var PrimaryColor = function(_super) {
            __extends(PrimaryColor, _super);
            function PrimaryColor(_value) {
                _super.call(this, "PrimaryColor", "value");
                this._value = _value;
            }
            Object.defineProperty(PrimaryColor.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return PrimaryColor;
        }(PartBase);
        parts.PrimaryColor = PrimaryColor;
        /**
        * A secondary color tag {\2c}
        *
        * @constructor
        * @param {libjass.parts.Color} value {\2c###} -> color (Color), {\2c} -> null
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var SecondaryColor = function(_super) {
            __extends(SecondaryColor, _super);
            function SecondaryColor(_value) {
                _super.call(this, "SecondaryColor", "value");
                this._value = _value;
            }
            Object.defineProperty(SecondaryColor.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return SecondaryColor;
        }(PartBase);
        parts.SecondaryColor = SecondaryColor;
        /**
        * An outline color tag {\3c}
        *
        * @constructor
        * @param {libjass.parts.Color} value {\3c###} -> color (Color), {\3c} -> null
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var OutlineColor = function(_super) {
            __extends(OutlineColor, _super);
            function OutlineColor(_value) {
                _super.call(this, "OutlineColor", "value");
                this._value = _value;
            }
            Object.defineProperty(OutlineColor.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return OutlineColor;
        }(PartBase);
        parts.OutlineColor = OutlineColor;
        /**
        * A shadow color tag {\4c}
        *
        * @constructor
        * @param {libjass.parts.Color} value {\4c###} -> color (Color), {\4c} -> null
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var ShadowColor = function(_super) {
            __extends(ShadowColor, _super);
            function ShadowColor(_value) {
                _super.call(this, "ShadowColor", "value");
                this._value = _value;
            }
            Object.defineProperty(ShadowColor.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return ShadowColor;
        }(PartBase);
        parts.ShadowColor = ShadowColor;
        /**
        * An alpha tag {\alpha}
        *
        * @constructor
        * @param {?number} value {\alpha###} -> alpha (number), {\alpha} -> null
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var Alpha = function(_super) {
            __extends(Alpha, _super);
            function Alpha(_value) {
                _super.call(this, "Alpha", "value");
                this._value = _value;
            }
            Object.defineProperty(Alpha.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return Alpha;
        }(PartBase);
        parts.Alpha = Alpha;
        /**
        * A primary alpha tag {\1a}
        *
        * @constructor
        * @param {?number} value {\1a###} -> alpha (number), {\1a} -> null
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var PrimaryAlpha = function(_super) {
            __extends(PrimaryAlpha, _super);
            function PrimaryAlpha(_value) {
                _super.call(this, "PrimaryAlpha", "value");
                this._value = _value;
            }
            Object.defineProperty(PrimaryAlpha.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return PrimaryAlpha;
        }(PartBase);
        parts.PrimaryAlpha = PrimaryAlpha;
        /**
        * A secondary alpha tag {\2a}
        *
        * @constructor
        * @param {?number} value {\2a###} -> alpha (number), {\2a} -> null
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var SecondaryAlpha = function(_super) {
            __extends(SecondaryAlpha, _super);
            function SecondaryAlpha(_value) {
                _super.call(this, "SecondaryAlpha", "value");
                this._value = _value;
            }
            Object.defineProperty(SecondaryAlpha.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return SecondaryAlpha;
        }(PartBase);
        parts.SecondaryAlpha = SecondaryAlpha;
        /**
        * An outline alpha tag {\3a}
        *
        * @constructor
        * @param {?number} value {\3a###} -> alpha (number), {\3a} -> null
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var OutlineAlpha = function(_super) {
            __extends(OutlineAlpha, _super);
            function OutlineAlpha(_value) {
                _super.call(this, "OutlineAlpha", "value");
                this._value = _value;
            }
            Object.defineProperty(OutlineAlpha.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return OutlineAlpha;
        }(PartBase);
        parts.OutlineAlpha = OutlineAlpha;
        /**
        * A shadow alpha tag {\4a}
        *
        * @constructor
        * @param {?number} value {\4a###} -> alpha (number), {\4a} -> null
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var ShadowAlpha = function(_super) {
            __extends(ShadowAlpha, _super);
            function ShadowAlpha(_value) {
                _super.call(this, "ShadowAlpha", "value");
                this._value = _value;
            }
            Object.defineProperty(ShadowAlpha.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return ShadowAlpha;
        }(PartBase);
        parts.ShadowAlpha = ShadowAlpha;
        /**
        * An alignment tag {\an} or {\a}
        *
        * @constructor
        * @param {number} value {\an###} -> alignment (number)
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var Alignment = function(_super) {
            __extends(Alignment, _super);
            function Alignment(_value) {
                _super.call(this, "Alignment", "value");
                this._value = _value;
            }
            Object.defineProperty(Alignment.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return Alignment;
        }(PartBase);
        parts.Alignment = Alignment;
        /**
        * A color karaoke tag {\k}
        *
        * @constructor
        * @param {number} duration {\k###} -> duration (number)
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var ColorKaraoke = function(_super) {
            __extends(ColorKaraoke, _super);
            function ColorKaraoke(_duration) {
                _super.call(this, "ColorKaraoke", "duration");
                this._duration = _duration;
            }
            Object.defineProperty(ColorKaraoke.prototype, "duration", {
                get: function() {
                    return this._duration;
                },
                enumerable: true,
                configurable: true
            });
            return ColorKaraoke;
        }(PartBase);
        parts.ColorKaraoke = ColorKaraoke;
        /**
        * A sweeping color karaoke tag {\K} or {\kf}
        *
        * @constructor
        * @param {number} duration {\kf###} -> duration (number)
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var SweepingColorKaraoke = function(_super) {
            __extends(SweepingColorKaraoke, _super);
            function SweepingColorKaraoke(_duration) {
                _super.call(this, "SweepingColorKaraoke", "duration");
                this._duration = _duration;
            }
            Object.defineProperty(SweepingColorKaraoke.prototype, "duration", {
                get: function() {
                    return this._duration;
                },
                enumerable: true,
                configurable: true
            });
            return SweepingColorKaraoke;
        }(PartBase);
        parts.SweepingColorKaraoke = SweepingColorKaraoke;
        /**
        * An outline karaoke tag {\ko}
        *
        * @constructor
        * @param {number} duration {\ko###} -> duration (number)
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var OutlineKaraoke = function(_super) {
            __extends(OutlineKaraoke, _super);
            function OutlineKaraoke(_duration) {
                _super.call(this, "OutlineKaraoke", "duration");
                this._duration = _duration;
            }
            Object.defineProperty(OutlineKaraoke.prototype, "duration", {
                get: function() {
                    return this._duration;
                },
                enumerable: true,
                configurable: true
            });
            return OutlineKaraoke;
        }(PartBase);
        parts.OutlineKaraoke = OutlineKaraoke;
        /**
        * A wrapping style tag {\q}
        *
        * @constructor
        * @param {number} value {\q###} -> style (number)
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var WrappingStyle = function(_super) {
            __extends(WrappingStyle, _super);
            function WrappingStyle(_value) {
                _super.call(this, "WrappingStyle", "value");
                this._value = _value;
            }
            Object.defineProperty(WrappingStyle.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return WrappingStyle;
        }(PartBase);
        parts.WrappingStyle = WrappingStyle;
        /**
        * A style reset tag {\r}
        *
        * @constructor
        * @param {?string} value {\r###} -> style name (string), {\r} -> null
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var Reset = function(_super) {
            __extends(Reset, _super);
            function Reset(_value) {
                _super.call(this, "Reset", "value");
                this._value = _value;
            }
            Object.defineProperty(Reset.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return Reset;
        }(PartBase);
        parts.Reset = Reset;
        /**
        * A position tag {\pos}
        *
        * @constructor
        * @param {number} x
        * @param {number} y
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var Position = function(_super) {
            __extends(Position, _super);
            function Position(_x, _y) {
                _super.call(this, "Position", "x", "y");
                this._x = _x;
                this._y = _y;
            }
            Object.defineProperty(Position.prototype, "x", {
                get: function() {
                    return this._x;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Position.prototype, "y", {
                get: function() {
                    return this._y;
                },
                enumerable: true,
                configurable: true
            });
            return Position;
        }(PartBase);
        parts.Position = Position;
        /**
        * A movement tag {\move}
        *
        * @constructor
        * @param {number} x1
        * @param {number} y1
        * @param {number} x2
        * @param {number} y2
        * @param {number} t1
        * @param {number} t2
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var Move = function(_super) {
            __extends(Move, _super);
            function Move(_x1, _y1, _x2, _y2, _t1, _t2) {
                _super.call(this, "Move", "x1", "y1", "x2", "y2", "t1", "t2");
                this._x1 = _x1;
                this._y1 = _y1;
                this._x2 = _x2;
                this._y2 = _y2;
                this._t1 = _t1;
                this._t2 = _t2;
            }
            Object.defineProperty(Move.prototype, "x1", {
                get: function() {
                    return this._x1;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Move.prototype, "y1", {
                get: function() {
                    return this._y1;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Move.prototype, "x2", {
                get: function() {
                    return this._x2;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Move.prototype, "y2", {
                get: function() {
                    return this._y2;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Move.prototype, "t1", {
                get: function() {
                    return this._t1;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Move.prototype, "t2", {
                get: function() {
                    return this._t2;
                },
                enumerable: true,
                configurable: true
            });
            return Move;
        }(PartBase);
        parts.Move = Move;
        /**
        * A rotation origin tag {\org}
        *
        * @constructor
        * @param {number} x
        * @param {number} y
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var RotationOrigin = function(_super) {
            __extends(RotationOrigin, _super);
            function RotationOrigin(_x, _y) {
                _super.call(this, "RotationOrigin", "x", "y");
                this._x = _x;
                this._y = _y;
            }
            Object.defineProperty(RotationOrigin.prototype, "x", {
                get: function() {
                    return this._x;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RotationOrigin.prototype, "y", {
                get: function() {
                    return this._y;
                },
                enumerable: true,
                configurable: true
            });
            return RotationOrigin;
        }(PartBase);
        parts.RotationOrigin = RotationOrigin;
        /**
        * A simple fade tag {\fad}
        *
        * @constructor
        * @param {number} start
        * @param {number} end
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var Fade = function(_super) {
            __extends(Fade, _super);
            function Fade(_start, _end) {
                _super.call(this, "Fade", "start", "end");
                this._start = _start;
                this._end = _end;
            }
            Object.defineProperty(Fade.prototype, "start", {
                get: function() {
                    return this._start;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Fade.prototype, "end", {
                get: function() {
                    return this._end;
                },
                enumerable: true,
                configurable: true
            });
            return Fade;
        }(PartBase);
        parts.Fade = Fade;
        /**
        * A complex fade tag {\fade}
        *
        * @constructor
        * @param {number} a1
        * @param {number} a2
        * @param {number} a3
        * @param {number} t1
        * @param {number} t2
        * @param {number} t3
        * @param {number} t4
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var ComplexFade = function(_super) {
            __extends(ComplexFade, _super);
            function ComplexFade(_a1, _a2, _a3, _t1, _t2, _t3, _t4) {
                _super.call(this, "ComplexFade", "a1", "a2", "a3", "t1", "t2", "t3", "t4");
                this._a1 = _a1;
                this._a2 = _a2;
                this._a3 = _a3;
                this._t1 = _t1;
                this._t2 = _t2;
                this._t3 = _t3;
                this._t4 = _t4;
            }
            Object.defineProperty(ComplexFade.prototype, "a1", {
                get: function() {
                    return this._a1;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComplexFade.prototype, "a2", {
                get: function() {
                    return this._a2;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComplexFade.prototype, "a3", {
                get: function() {
                    return this._a3;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComplexFade.prototype, "t1", {
                get: function() {
                    return this._t1;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComplexFade.prototype, "t2", {
                get: function() {
                    return this._t2;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComplexFade.prototype, "t3", {
                get: function() {
                    return this._t3;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComplexFade.prototype, "t4", {
                get: function() {
                    return this._t4;
                },
                enumerable: true,
                configurable: true
            });
            return ComplexFade;
        }(PartBase);
        parts.ComplexFade = ComplexFade;
        /**
        * A transform tag {\t}
        *
        * @constructor
        * @param {number} start
        * @param {number} end
        * @param {number} accel
        * @param {Array.<libjass.parts.Tag>} tags
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var Transform = function(_super) {
            __extends(Transform, _super);
            function Transform(_start, _end, _accel, _tags) {
                _super.call(this, "Transform", "start", "end", "accel", "tags");
                this._start = _start;
                this._end = _end;
                this._accel = _accel;
                this._tags = _tags;
            }
            Object.defineProperty(Transform.prototype, "start", {
                get: function() {
                    return this._start;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Transform.prototype, "end", {
                get: function() {
                    return this._end;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Transform.prototype, "accel", {
                get: function() {
                    return this._accel;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Transform.prototype, "tags", {
                get: function() {
                    return this._tags;
                },
                enumerable: true,
                configurable: true
            });
            return Transform;
        }(PartBase);
        parts.Transform = Transform;
        /**
        * A rectangular clip tag {\clip} or {\iclip}
        *
        * @constructor
        * @param {number} x1
        * @param {number} y1
        * @param {number} x2
        * @param {number} y2
        * @param {boolean} inside
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var RectangularClip = function(_super) {
            __extends(RectangularClip, _super);
            function RectangularClip(_x1, _y1, _x2, _y2, _inside) {
                _super.call(this, "RectangularClip", "x1", "y1", "x2", "y2", "inside");
                this._x1 = _x1;
                this._y1 = _y1;
                this._x2 = _x2;
                this._y2 = _y2;
                this._inside = _inside;
            }
            Object.defineProperty(RectangularClip.prototype, "x1", {
                get: function() {
                    return this._x1;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RectangularClip.prototype, "y1", {
                get: function() {
                    return this._y1;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RectangularClip.prototype, "x2", {
                get: function() {
                    return this._x2;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RectangularClip.prototype, "y2", {
                get: function() {
                    return this._y2;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RectangularClip.prototype, "inside", {
                get: function() {
                    return this._inside;
                },
                enumerable: true,
                configurable: true
            });
            return RectangularClip;
        }(PartBase);
        parts.RectangularClip = RectangularClip;
        /**
        * A vector clip tag {\clip} or {\iclip}
        *
        * @constructor
        * @param {number} scale
        * @param {string} commands
        * @param {boolean} inside
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var VectorClip = function(_super) {
            __extends(VectorClip, _super);
            function VectorClip(_scale, _commands, _inside) {
                _super.call(this, "VectorClip", "scale", "commands", "inside");
                this._scale = _scale;
                this._commands = _commands;
                this._inside = _inside;
            }
            Object.defineProperty(VectorClip.prototype, "scale", {
                get: function() {
                    return this._scale;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(VectorClip.prototype, "commands", {
                get: function() {
                    return this._commands;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(VectorClip.prototype, "inside", {
                get: function() {
                    return this._inside;
                },
                enumerable: true,
                configurable: true
            });
            return VectorClip;
        }(PartBase);
        parts.VectorClip = VectorClip;
        /**
        * A drawing mode tag {\p}
        *
        * @constructor
        * @param {number} value
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var DrawingMode = function(_super) {
            __extends(DrawingMode, _super);
            function DrawingMode(_value) {
                _super.call(this, "DrawingMode", "value");
                this._value = _value;
            }
            Object.defineProperty(DrawingMode.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return DrawingMode;
        }(PartBase);
        parts.DrawingMode = DrawingMode;
        /**
        * A drawing mode baseline offset tag {\pbo}
        *
        * @constructor
        * @param {number} value
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var DrawingBaselineOffset = function(_super) {
            __extends(DrawingBaselineOffset, _super);
            function DrawingBaselineOffset(_value) {
                _super.call(this, "DrawingBaselineOffset", "value");
                this._value = _value;
            }
            Object.defineProperty(DrawingBaselineOffset.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return DrawingBaselineOffset;
        }(PartBase);
        parts.DrawingBaselineOffset = DrawingBaselineOffset;
        /**
        * A pseudo-part representing text interpreted as drawing instructions
        *
        * @constructor
        * @param {string} value
        *
        * @extends {libjass.parts.TagBase}
        * @memberof libjass.parts
        */
        var DrawingInstructions = function(_super) {
            __extends(DrawingInstructions, _super);
            function DrawingInstructions(_value) {
                _super.call(this, "DrawingInstructions", "value");
                this._value = _value;
            }
            Object.defineProperty(DrawingInstructions.prototype, "value", {
                get: function() {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return DrawingInstructions;
        }(PartBase);
        parts.DrawingInstructions = DrawingInstructions;
    })(libjass.parts || (libjass.parts = {}));
})(libjass || (libjass = {}));

(function(libjass) {
    ///<reference path="libjass.ts" />
    (function(parser) {
        /**
        * Parses a given string with the specified rule.
        *
        * @param {string} input
        * @param {string="dialogueParts"} startRule
        * @return {*}
        */
        function parse(input, rule) {
            if (typeof rule === "undefined") {
                rule = "dialogueParts";
            }
            var run = new ParserRun(input, rule);
            if (run.result === null || run.result.end !== input.length) {
                throw new Error("Parse failed.");
            }
            return run.result.value;
        }
        parser.parse = parse;
        var ParserRun = function() {
            function ParserRun(_input, rule) {
                this._input = _input;
                this._parseTree = new ParseNode(null);
                this._result = rules.get(rule).call(this, this._parseTree);
            }
            Object.defineProperty(ParserRun.prototype, "result", {
                get: function() {
                    return this._result;
                },
                enumerable: true,
                configurable: true
            });
            ParserRun.prototype.parse_script = function(parent) {
                var current = new ParseNode(parent);
                current.value = Object.create(null);
                while (this._haveMore()) {
                    var scriptSectionNode = this.parse_scriptSection(current);
                    if (scriptSectionNode !== null) {
                        current.value[scriptSectionNode.value.name] = scriptSectionNode.value.contents;
                    } else if (this.read(current, "\n") === null) {
                        parent.pop();
                        return null;
                    }
                }
                return current;
            };
            ParserRun.prototype.parse_scriptSection = function(parent) {
                var current = new ParseNode(parent);
                current.value = Object.create(null);
                current.value.contents = null;
                var sectionHeaderNode = this.parse_scriptSectionHeader(current);
                if (sectionHeaderNode === null) {
                    parent.pop();
                    return null;
                }
                current.value.name = sectionHeaderNode.value;
                var formatSpecifier = null;
                while (this._haveMore() && this._peek() !== "[") {
                    var propertyNode = this.parse_scriptProperty(current);
                    if (propertyNode !== null) {
                        var property = propertyNode.value;
                        if (property.key === "Format") {
                            formatSpecifier = property.value.split(",").map(function(formatPart) {
                                return formatPart.trim();
                            });
                        } else if (formatSpecifier !== null) {
                            if (current.value.contents === null) {
                                current.value.contents = [];
                            }
                            var template = Object.create(null);
                            var value = property.value.split(",");
                            if (value.length > formatSpecifier.length) {
                                value[formatSpecifier.length - 1] = value.slice(formatSpecifier.length - 1).join(",");
                            }
                            formatSpecifier.forEach(function(formatKey, index) {
                                template[formatKey] = value[index];
                            });
                            current.value.contents.push({
                                type: property.key,
                                template: template
                            });
                        } else {
                            if (current.value.contents === null) {
                                current.value.contents = Object.create(null);
                            }
                            current.value.contents[property.key] = property.value;
                        }
                    } else if (this.parse_scriptComment(current) === null && this.read(current, "\n") === null) {
                        parent.pop();
                        return null;
                    }
                }
                return current;
            };
            ParserRun.prototype.parse_scriptSectionHeader = function(parent) {
                var current = new ParseNode(parent);
                if (this.read(current, "[") === null) {
                    parent.pop();
                    return null;
                }
                var nameNode = new ParseNode(current, "");
                for (var next = this._peek(); this._haveMore() && next !== "]" && next !== "\n"; next = this._peek()) {
                    nameNode.value += next;
                }
                if (nameNode.value.length === 0) {
                    parent.pop();
                    return null;
                }
                current.value = nameNode.value;
                if (this.read(current, "]") === null) {
                    parent.pop();
                    return null;
                }
                return current;
            };
            ParserRun.prototype.parse_scriptProperty = function(parent) {
                var current = new ParseNode(parent);
                current.value = Object.create(null);
                var keyNode = new ParseNode(current, "");
                var next;
                for (next = this._peek(); this._haveMore() && next !== ":" && next !== "\n"; next = this._peek()) {
                    keyNode.value += next;
                }
                if (keyNode.value.length === 0) {
                    parent.pop();
                    return null;
                }
                if (this.read(current, ":") === null) {
                    parent.pop();
                    return null;
                }
                var spacesNode = new ParseNode(current, "");
                for (next = this._peek(); next === " "; next = this._peek()) {
                    spacesNode.value += next;
                }
                var valueNode = new ParseNode(current, "");
                for (next = this._peek(); this._haveMore() && next !== "\n"; next = this._peek()) {
                    valueNode.value += next;
                }
                current.value.key = keyNode.value;
                current.value.value = valueNode.value;
                return current;
            };
            ParserRun.prototype.parse_scriptComment = function(parent) {
                var current = new ParseNode(parent);
                if (this.read(current, ";") === null) {
                    parent.pop();
                    return null;
                }
                var valueNode = new ParseNode(current, "");
                for (var next = this._peek(); this._haveMore() && next !== "\n"; next = this._peek()) {
                    valueNode.value += next;
                }
                current.value = valueNode.value;
                return current;
            };
            ParserRun.prototype.parse_dialogueParts = function(parent) {
                var current = new ParseNode(parent);
                current.value = [];
                var inDrawingMode = false;
                while (this._haveMore()) {
                    var enclosedTagsNode = this.parse_enclosedTags(current);
                    if (enclosedTagsNode !== null) {
                        enclosedTagsNode.value.forEach(function(tag) {
                            if (tag instanceof libjass.parts.DrawingMode) {
                                inDrawingMode = tag.value !== 0;
                            }
                        });
                        current.value.push.apply(current.value, enclosedTagsNode.value);
                    } else {
                        var textNode = this.parse_newline(current) || this.parse_hardspace(current) || this.parse_text(current);
                        if (textNode !== null) {
                            if (!inDrawingMode) {
                                if (current.value[current.value.length - 1] instanceof libjass.parts.Text) {
                                    // Merge consecutive text parts into one part
                                    current.value[current.value.length - 1] = new libjass.parts.Text(current.value[current.value.length - 1].value + textNode.value.value);
                                } else {
                                    current.value.push(textNode.value);
                                }
                            } else {
                                var drawingInstructions = textNode.value.value;
                                if (current.value[current.value.length - 1] instanceof libjass.parts.DrawingInstructions) {
                                    // Merge consecutive drawing instructions parts into one part
                                    current.value[current.value.length - 1] = new libjass.parts.DrawingInstructions(current.value[current.value.length - 1].value + drawingInstructions);
                                } else {
                                    current.value.push(new libjass.parts.DrawingInstructions(textNode.value.value));
                                }
                            }
                        } else {
                            parent.pop();
                            return null;
                        }
                    }
                }
                return current;
            };
            ParserRun.prototype.parse_enclosedTags = function(parent) {
                var current = new ParseNode(parent);
                current.value = [];
                if (this.read(current, "{") === null) {
                    parent.pop();
                    return null;
                }
                for (var next = this._peek(); this._haveMore() && next !== "}"; next = this._peek()) {
                    var childNode = null;
                    if (this.read(current, "\\") !== null) {
                        childNode = this.parse_tag_alpha(current) || this.parse_tag_iclip(current) || this.parse_tag_xbord(current) || this.parse_tag_ybord(current) || this.parse_tag_xshad(current) || this.parse_tag_yshad(current) || this.parse_tag_blur(current) || this.parse_tag_bord(current) || this.parse_tag_clip(current) || this.parse_tag_fade(current) || this.parse_tag_fscx(current) || this.parse_tag_fscy(current) || this.parse_tag_move(current) || this.parse_tag_shad(current) || this.parse_tag_fad(current) || this.parse_tag_fax(current) || this.parse_tag_fay(current) || this.parse_tag_frx(current) || this.parse_tag_fry(current) || this.parse_tag_frz(current) || this.parse_tag_fsp(current) || this.parse_tag_org(current) || this.parse_tag_pbo(current) || this.parse_tag_pos(current) || this.parse_tag_an(current) || this.parse_tag_be(current) || this.parse_tag_fn(current) || this.parse_tag_fr(current) || this.parse_tag_fs(current) || this.parse_tag_kf(current) || this.parse_tag_ko(current) || this.parse_tag_1a(current) || this.parse_tag_1c(current) || this.parse_tag_2a(current) || this.parse_tag_2c(current) || this.parse_tag_3a(current) || this.parse_tag_3c(current) || this.parse_tag_4a(current) || this.parse_tag_4c(current) || this.parse_tag_a(current) || this.parse_tag_b(current) || this.parse_tag_c(current) || this.parse_tag_i(current) || this.parse_tag_k(current) || this.parse_tag_K(current) || this.parse_tag_p(current) || this.parse_tag_q(current) || this.parse_tag_r(current) || this.parse_tag_s(current) || this.parse_tag_t(current) || this.parse_tag_u(current);
                        if (childNode === null) {
                            current.pop();
                        }
                    }
                    if (childNode === null) {
                        childNode = this.parse_comment(current);
                    }
                    if (childNode !== null) {
                        if (childNode.value instanceof libjass.parts.Comment && current.value[current.value.length - 1] instanceof libjass.parts.Comment) {
                            // Merge consecutive comment parts into one part
                            current.value[current.value.length - 1] = new libjass.parts.Comment(current.value[current.value.length - 1].value + childNode.value.value);
                        } else {
                            current.value.push(childNode.value);
                        }
                    } else {
                        parent.pop();
                        return null;
                    }
                }
                if (this.read(current, "}") === null) {
                    parent.pop();
                    return null;
                }
                return current;
            };
            ParserRun.prototype.parse_newline = function(parent) {
                var current = new ParseNode(parent);
                if (this.read(current, "\\N") === null) {
                    parent.pop();
                    return null;
                }
                current.value = new libjass.parts.Text("\n");
                return current;
            };
            ParserRun.prototype.parse_hardspace = function(parent) {
                var current = new ParseNode(parent);
                if (this.read(current, "\\h") === null) {
                    parent.pop();
                    return null;
                }
                current.value = new libjass.parts.Text(" ");
                return current;
            };
            ParserRun.prototype.parse_text = function(parent) {
                var value = this._peek();
                var current = new ParseNode(parent);
                var valueNode = new ParseNode(current, value);
                current.value = new libjass.parts.Text(valueNode.value);
                return current;
            };
            ParserRun.prototype.parse_comment = function(parent) {
                var value = this._peek();
                var current = new ParseNode(parent);
                var valueNode = new ParseNode(current, value);
                current.value = new libjass.parts.Comment(valueNode.value);
                return current;
            };
            ParserRun.prototype.parse_tag_a = function(parent) {
                var current = new ParseNode(parent);
                if (this.read(current, "a") === null) {
                    parent.pop();
                    return null;
                }
                var next = this._peek();
                switch (next) {
                  case "1":
                    var next2 = this._peek(2);
                    switch (next2) {
                      case "10":
                      case "11":
                        next = next2;
                        break;
                    }
                    break;

                  case "2":
                  case "3":
                  case "5":
                  case "6":
                  case "7":
                  case "9":
                    break;

                  default:
                    parent.pop();
                    return null;
                }
                var valueNode = new ParseNode(current, next);
                var value = null;
                switch (valueNode.value) {
                  case "1":
                    value = 1;
                    break;

                  case "2":
                    value = 2;
                    break;

                  case "3":
                    value = 3;
                    break;

                  case "5":
                    value = 7;
                    break;

                  case "6":
                    value = 8;
                    break;

                  case "7":
                    value = 9;
                    break;

                  case "9":
                    value = 4;
                    break;

                  case "10":
                    value = 5;
                    break;

                  case "11":
                    value = 6;
                    break;
                }
                current.value = new libjass.parts.Alignment(value);
                return current;
            };
            ParserRun.prototype.parse_tag_alpha = function() {
                throw new Error("Method not implemented.");
            };
            ParserRun.prototype.parse_tag_an = function(parent) {
                var current = new ParseNode(parent);
                if (this.read(current, "an") === null) {
                    parent.pop();
                    return null;
                }
                var next = this._peek();
                if (next < "1" || next > "9") {
                    parent.pop();
                    return null;
                }
                var valueNode = new ParseNode(current, next);
                current.value = new libjass.parts.Alignment(parseInt(valueNode.value));
                return current;
            };
            ParserRun.prototype.parse_tag_b = function(parent) {
                var current = new ParseNode(parent);
                if (this.read(current, "b") === null) {
                    parent.pop();
                    return null;
                }
                var valueNode = null;
                var next = this._peek();
                if (next >= "1" && next <= "9") {
                    next = this._peek(3);
                    if (next.substr(1) === "00") {
                        valueNode = new ParseNode(current, next);
                        valueNode.value = parseInt(valueNode.value);
                    }
                }
                if (valueNode === null) {
                    valueNode = this.parse_enableDisable(current);
                }
                if (valueNode !== null) {
                    current.value = new libjass.parts.Bold(valueNode.value);
                } else {
                    current.value = new libjass.parts.Bold(null);
                }
                return current;
            };
            ParserRun.prototype.parse_tag_be = function() {
                throw new Error("Method not implemented.");
            };
            ParserRun.prototype.parse_tag_blur = function() {
                throw new Error("Method not implemented.");
            };
            ParserRun.prototype.parse_tag_bord = function() {
                throw new Error("Method not implemented.");
            };
            ParserRun.prototype.parse_tag_c = function() {
                throw new Error("Method not implemented.");
            };
            ParserRun.prototype.parse_tag_clip = function(parent) {
                var current = new ParseNode(parent);
                if (this.read(current, "clip") === null) {
                    parent.pop();
                    return null;
                }
                var x1Node = null;
                var x2Node = null;
                var y1Node = null;
                var y2Node = null;
                var scaleNode = null;
                var commandsNode = null;
                var firstNode = this.parse_decimal(current);
                if (firstNode !== null) {
                    if (this.read(current, ",") === null) {
                        parent.pop();
                        return null;
                    }
                    var secondNode = this.parse_decimal(current);
                    if (secondNode !== null) {
                        x1Node = firstNode;
                        y1Node = secondNode;
                    } else {
                        scaleNode = firstNode;
                    }
                }
                if (x1Node !== null && y1Node !== null) {
                    if (this.read(current, ",") === null) {
                        parent.pop();
                        return null;
                    }
                    x2Node = this.parse_decimal(current);
                    if (this.read(current, ",") === null) {
                        parent.pop();
                        return null;
                    }
                    y2Node = this.parse_decimal(current);
                    current.value = new libjass.parts.RectangularClip(x1Node.value, y1Node.value, x2Node.value, y2Node.value, true);
                } else {
                    commandsNode = new ParseNode(current, "");
                    for (var next = this._peek(); this._haveMore() && next !== ")" && next !== "}"; next = this._peek()) {
                        commandsNode.value += next;
                    }
                    current.value = new libjass.parts.VectorClip(scaleNode !== null ? scaleNode.value : 1, commandsNode.value, true);
                }
                if (this.read(current, ")") === null) {
                    parent.pop();
                    return null;
                }
                return current;
            };
            ParserRun.prototype.parse_tag_fad = function(parent) {
                var current = new ParseNode(parent);
                if (this.read(current, "fad") === null) {
                    parent.pop();
                    return null;
                }
                if (this.read(current, "(") === null) {
                    parent.pop();
                    return null;
                }
                var startNode = this.parse_decimal(current);
                if (startNode === null) {
                    parent.pop();
                    return null;
                }
                if (this.read(current, ",") === null) {
                    parent.pop();
                    return null;
                }
                var endNode = this.parse_decimal(current);
                if (endNode === null) {
                    parent.pop();
                    return null;
                }
                if (this.read(current, ")") === null) {
                    parent.pop();
                    return null;
                }
                current.value = new libjass.parts.Fade(startNode.value / 1e3, endNode.value / 1e3);
                return current;
            };
            ParserRun.prototype.parse_tag_fade = function(parent) {
                var current = new ParseNode(parent);
                if (this.read(current, "fade") === null) {
                    parent.pop();
                    return null;
                }
                if (this.read(current, "(") === null) {
                    parent.pop();
                    return null;
                }
                var a1Node = this.parse_decimal(current);
                if (a1Node === null) {
                    parent.pop();
                    return null;
                }
                if (this.read(current, ",") === null) {
                    parent.pop();
                    return null;
                }
                var a2Node = this.parse_decimal(current);
                if (a2Node === null) {
                    parent.pop();
                    return null;
                }
                if (this.read(current, ",") === null) {
                    parent.pop();
                    return null;
                }
                var a3Node = this.parse_decimal(current);
                if (a3Node === null) {
                    parent.pop();
                    return null;
                }
                if (this.read(current, ",") === null) {
                    parent.pop();
                    return null;
                }
                var t1Node = this.parse_decimal(current);
                if (t1Node === null) {
                    parent.pop();
                    return null;
                }
                if (this.read(current, ",") === null) {
                    parent.pop();
                    return null;
                }
                var t2Node = this.parse_decimal(current);
                if (t2Node === null) {
                    parent.pop();
                    return null;
                }
                if (this.read(current, ",") === null) {
                    parent.pop();
                    return null;
                }
                var t3Node = this.parse_decimal(current);
                if (t3Node === null) {
                    parent.pop();
                    return null;
                }
                if (this.read(current, ",") === null) {
                    parent.pop();
                    return null;
                }
                var t4Node = this.parse_decimal(current);
                if (t4Node === null) {
                    parent.pop();
                    return null;
                }
                if (this.read(current, ")") === null) {
                    parent.pop();
                    return null;
                }
                current.value = new libjass.parts.ComplexFade(1 - a1Node.value / 255, 1 - a2Node.value / 255, 1 - a3Node.value / 255, t1Node.value / 1e3, t2Node.value / 1e3, t3Node.value / 1e3, t4Node.value / 1e3);
                return current;
            };
            ParserRun.prototype.parse_tag_fax = function() {
                throw new Error("Method not implemented.");
            };
            ParserRun.prototype.parse_tag_fay = function() {
                throw new Error("Method not implemented.");
            };
            ParserRun.prototype.parse_tag_fn = function(parent) {
                var current = new ParseNode(parent);
                if (this.read(current, "fn") === null) {
                    parent.pop();
                    return null;
                }
                var valueNode = new ParseNode(current, "");
                for (var next = this._peek(); this._haveMore() && next !== "\\" && next !== "}"; next = this._peek()) {
                    valueNode.value += next;
                }
                if (valueNode.value.length > 0) {
                    current.value = new libjass.parts.FontName(valueNode.value);
                } else {
                    current.value = new libjass.parts.FontName(null);
                }
                return current;
            };
            ParserRun.prototype.parse_tag_fr = function() {
                throw new Error("Method not implemented.");
            };
            ParserRun.prototype.parse_tag_frx = function() {
                throw new Error("Method not implemented.");
            };
            ParserRun.prototype.parse_tag_fry = function() {
                throw new Error("Method not implemented.");
            };
            ParserRun.prototype.parse_tag_frz = function() {
                throw new Error("Method not implemented.");
            };
            ParserRun.prototype.parse_tag_fs = function() {
                throw new Error("Method not implemented.");
            };
            ParserRun.prototype.parse_tag_fscx = function(parent) {
                var current = new ParseNode(parent);
                if (this.read(current, "fscx") === null) {
                    parent.pop();
                    return null;
                }
                var valueNode = this.parse_decimal(current);
                if (valueNode === null) {
                    parent.pop();
                    return null;
                }
                current.value = new libjass.parts.FontScaleX(valueNode.value / 100);
                return current;
            };
            ParserRun.prototype.parse_tag_fscy = function(parent) {
                var current = new ParseNode(parent);
                if (this.read(current, "fscy") === null) {
                    parent.pop();
                    return null;
                }
                var valueNode = this.parse_decimal(current);
                if (valueNode === null) {
                    parent.pop();
                    return null;
                }
                current.value = new libjass.parts.FontScaleY(valueNode.value / 100);
                return current;
            };
            ParserRun.prototype.parse_tag_fsp = function() {
                throw new Error("Method not implemented.");
            };
            ParserRun.prototype.parse_tag_i = function() {
                throw new Error("Method not implemented.");
            };
            ParserRun.prototype.parse_tag_iclip = function(parent) {
                var current = new ParseNode(parent);
                if (this.read(current, "iclip") === null) {
                    parent.pop();
                    return null;
                }
                var x1Node = null;
                var x2Node = null;
                var y1Node = null;
                var y2Node = null;
                var scaleNode = null;
                var commandsNode = null;
                var firstNode = this.parse_decimal(current);
                if (firstNode !== null) {
                    if (this.read(current, ",") === null) {
                        parent.pop();
                        return null;
                    }
                    var secondNode = this.parse_decimal(current);
                    if (secondNode !== null) {
                        x1Node = firstNode;
                        y1Node = secondNode;
                    } else {
                        scaleNode = firstNode;
                    }
                }
                if (x1Node !== null && y1Node !== null) {
                    if (this.read(current, ",") === null) {
                        parent.pop();
                        return null;
                    }
                    x2Node = this.parse_decimal(current);
                    if (this.read(current, ",") === null) {
                        parent.pop();
                        return null;
                    }
                    y2Node = this.parse_decimal(current);
                    current.value = new libjass.parts.RectangularClip(x1Node.value, y1Node.value, x2Node.value, y2Node.value, false);
                } else {
                    commandsNode = new ParseNode(current, "");
                    for (var next = this._peek(); this._haveMore() && next !== ")" && next !== "}"; next = this._peek()) {
                        commandsNode.value += next;
                    }
                    current.value = new libjass.parts.VectorClip(scaleNode !== null ? scaleNode.value : 1, commandsNode.value, false);
                }
                if (this.read(current, ")") === null) {
                    parent.pop();
                    return null;
                }
                return current;
            };
            ParserRun.prototype.parse_tag_k = function() {
                throw new Error("Method not implemented.");
            };
            ParserRun.prototype.parse_tag_K = function() {
                throw new Error("Method not implemented.");
            };
            ParserRun.prototype.parse_tag_kf = function() {
                throw new Error("Method not implemented.");
            };
            ParserRun.prototype.parse_tag_ko = function() {
                throw new Error("Method not implemented.");
            };
            ParserRun.prototype.parse_tag_move = function(parent) {
                var current = new ParseNode(parent);
                if (this.read(current, "move") === null) {
                    parent.pop();
                    return null;
                }
                if (this.read(current, "(") === null) {
                    parent.pop();
                    return null;
                }
                var x1Node = this.parse_decimal(current);
                if (x1Node === null) {
                    parent.pop();
                    return null;
                }
                if (this.read(current, ",") === null) {
                    parent.pop();
                    return null;
                }
                var y1Node = this.parse_decimal(current);
                if (y1Node === null) {
                    parent.pop();
                    return null;
                }
                if (this.read(current, ",") === null) {
                    parent.pop();
                    return null;
                }
                var x2Node = this.parse_decimal(current);
                if (x2Node === null) {
                    parent.pop();
                    return null;
                }
                if (this.read(current, ",") === null) {
                    parent.pop();
                    return null;
                }
                var y2Node = this.parse_decimal(current);
                if (y2Node === null) {
                    parent.pop();
                    return null;
                }
                var t1Node = null;
                var t2Node = null;
                if (this.read(current, ",") !== null) {
                    t1Node = this.parse_decimal(current);
                    if (t1Node === null) {
                        parent.pop();
                        return null;
                    }
                    if (this.read(current, ",") === null) {
                        parent.pop();
                        return null;
                    }
                    t2Node = this.parse_decimal(current);
                    if (t2Node === null) {
                        parent.pop();
                        return null;
                    }
                }
                if (this.read(current, ")") === null) {
                    parent.pop();
                    return null;
                }
                current.value = new libjass.parts.Move(x1Node.value, y1Node.value, x2Node.value, y2Node.value, t1Node !== null ? t1Node.value / 1e3 : null, t2Node !== null ? t2Node.value / 1e3 : null);
                return current;
            };
            ParserRun.prototype.parse_tag_org = function(parent) {
                var current = new ParseNode(parent);
                if (this.read(current, "org") === null) {
                    parent.pop();
                    return null;
                }
                if (this.read(current, "(") === null) {
                    parent.pop();
                    return null;
                }
                var xNode = this.parse_decimal(current);
                if (xNode === null) {
                    parent.pop();
                    return null;
                }
                if (this.read(current, ",") === null) {
                    parent.pop();
                    return null;
                }
                var yNode = this.parse_decimal(current);
                if (yNode === null) {
                    parent.pop();
                    return null;
                }
                if (this.read(current, ")") === null) {
                    parent.pop();
                    return null;
                }
                current.value = new libjass.parts.RotationOrigin(xNode.value, yNode.value);
                return current;
            };
            ParserRun.prototype.parse_tag_p = function() {
                throw new Error("Method not implemented.");
            };
            ParserRun.prototype.parse_tag_pbo = function() {
                throw new Error("Method not implemented.");
            };
            ParserRun.prototype.parse_tag_pos = function(parent) {
                var current = new ParseNode(parent);
                if (this.read(current, "pos") === null) {
                    parent.pop();
                    return null;
                }
                if (this.read(current, "(") === null) {
                    parent.pop();
                    return null;
                }
                var xNode = this.parse_decimal(current);
                if (xNode === null) {
                    parent.pop();
                    return null;
                }
                if (this.read(current, ",") === null) {
                    parent.pop();
                    return null;
                }
                var yNode = this.parse_decimal(current);
                if (yNode === null) {
                    parent.pop();
                    return null;
                }
                if (this.read(current, ")") === null) {
                    parent.pop();
                    return null;
                }
                current.value = new libjass.parts.Position(xNode.value, yNode.value);
                return current;
            };
            ParserRun.prototype.parse_tag_q = function(parent) {
                var current = new ParseNode(parent);
                if (this.read(current, "q") === null) {
                    parent.pop();
                    return null;
                }
                var next = this._peek();
                if (next < "0" || next > "3") {
                    parent.pop();
                    return null;
                }
                var valueNode = new ParseNode(current, next);
                current.value = new libjass.parts.WrappingStyle(parseInt(valueNode.value));
                return current;
            };
            ParserRun.prototype.parse_tag_r = function(parent) {
                var current = new ParseNode(parent);
                if (this.read(current, "r") === null) {
                    parent.pop();
                    return null;
                }
                var valueNode = new ParseNode(current, "");
                for (var next = this._peek(); this._haveMore() && next !== "\\" && next !== "}"; next = this._peek()) {
                    valueNode.value += next;
                }
                if (valueNode.value.length > 0) {
                    current.value = new libjass.parts.Reset(valueNode.value);
                } else {
                    current.value = new libjass.parts.Reset(null);
                }
                return current;
            };
            ParserRun.prototype.parse_tag_s = function() {
                throw new Error("Method not implemented.");
            };
            ParserRun.prototype.parse_tag_shad = function() {
                throw new Error("Method not implemented.");
            };
            ParserRun.prototype.parse_tag_t = function(parent) {
                var current = new ParseNode(parent);
                if (this.read(current, "t") === null) {
                    parent.pop();
                    return null;
                }
                if (this.read(current, "(") === null) {
                    parent.pop();
                    return null;
                }
                var startNode = null;
                var endNode = null;
                var accelNode = null;
                var firstNode = this.parse_decimal(current);
                if (firstNode !== null) {
                    if (this.read(current, ",") === null) {
                        parent.pop();
                        return null;
                    }
                    var secondNode = this.parse_decimal(current);
                    if (secondNode !== null) {
                        startNode = firstNode;
                        endNode = secondNode;
                        if (this.read(current, ",") === null) {
                            parent.pop();
                            return null;
                        }
                        var thirdNode = this.parse_decimal(current);
                        if (thirdNode !== null) {
                            accelNode = thirdNode;
                            if (this.read(current, ",") === null) {
                                parent.pop();
                                return null;
                            }
                        }
                    } else {
                        accelNode = firstNode;
                        if (this.read(current, ",") === null) {
                            parent.pop();
                            return null;
                        }
                    }
                }
                var transformTags = [];
                for (var next = this._peek(); this._haveMore() && next !== ")" && next !== "}"; next = this._peek()) {
                    var childNode = null;
                    if (this.read(current, "\\") !== null) {
                        childNode = this.parse_tag_alpha(current) || this.parse_tag_iclip(current) || this.parse_tag_xbord(current) || this.parse_tag_ybord(current) || this.parse_tag_xshad(current) || this.parse_tag_yshad(current) || this.parse_tag_blur(current) || this.parse_tag_bord(current) || this.parse_tag_clip(current) || this.parse_tag_fscx(current) || this.parse_tag_fscy(current) || this.parse_tag_shad(current) || this.parse_tag_fax(current) || this.parse_tag_fay(current) || this.parse_tag_frx(current) || this.parse_tag_fry(current) || this.parse_tag_frz(current) || this.parse_tag_fsp(current) || this.parse_tag_be(current) || this.parse_tag_fr(current) || this.parse_tag_fs(current) || this.parse_tag_1a(current) || this.parse_tag_1c(current) || this.parse_tag_2a(current) || this.parse_tag_2c(current) || this.parse_tag_3a(current) || this.parse_tag_3c(current) || this.parse_tag_4a(current) || this.parse_tag_4c(current) || this.parse_tag_c(current);
                        if (childNode === null) {
                            current.pop();
                        }
                    }
                    if (childNode === null) {
                        childNode = this.parse_comment(current);
                    }
                    if (childNode !== null) {
                        if (childNode.value instanceof libjass.parts.Comment && transformTags[transformTags.length - 1] instanceof libjass.parts.Comment) {
                            // Merge consecutive comment parts into one part
                            transformTags[transformTags.length - 1] = new libjass.parts.Comment(transformTags[transformTags.length - 1].value + childNode.value.value);
                        } else {
                            transformTags.push(childNode.value);
                        }
                    } else {
                        parent.pop();
                        return null;
                    }
                }
                this.read(current, ")");
                current.value = new libjass.parts.Transform(startNode !== null ? startNode.value / 1e3 : null, endNode !== null ? endNode.value / 1e3 : null, accelNode !== null ? accelNode.value / 1e3 : null, transformTags);
                return current;
            };
            ParserRun.prototype.parse_tag_u = function() {
                throw new Error("Method not implemented.");
            };
            ParserRun.prototype.parse_tag_xbord = function() {
                throw new Error("Method not implemented.");
            };
            ParserRun.prototype.parse_tag_xshad = function() {
                throw new Error("Method not implemented.");
            };
            ParserRun.prototype.parse_tag_ybord = function() {
                throw new Error("Method not implemented.");
            };
            ParserRun.prototype.parse_tag_yshad = function() {
                throw new Error("Method not implemented.");
            };
            ParserRun.prototype.parse_tag_1a = function() {
                throw new Error("Method not implemented.");
            };
            ParserRun.prototype.parse_tag_1c = function() {
                throw new Error("Method not implemented.");
            };
            ParserRun.prototype.parse_tag_2a = function() {
                throw new Error("Method not implemented.");
            };
            ParserRun.prototype.parse_tag_2c = function() {
                throw new Error("Method not implemented.");
            };
            ParserRun.prototype.parse_tag_3a = function() {
                throw new Error("Method not implemented.");
            };
            ParserRun.prototype.parse_tag_3c = function() {
                throw new Error("Method not implemented.");
            };
            ParserRun.prototype.parse_tag_4a = function() {
                throw new Error("Method not implemented.");
            };
            ParserRun.prototype.parse_tag_4c = function() {
                throw new Error("Method not implemented.");
            };
            ParserRun.prototype.parse_decimal = function(parent) {
                var current = new ParseNode(parent);
                var negative = this.read(current, "-") !== null;
                var numericalPart = this.parse_unsignedDecimal(current);
                if (numericalPart === null) {
                    parent.pop();
                    return null;
                }
                current.value = numericalPart.value;
                if (negative) {
                    current.value = -current.value;
                }
                return current;
            };
            ParserRun.prototype.parse_unsignedDecimal = function(parent) {
                var current = new ParseNode(parent);
                var characteristicNode = new ParseNode(current, "");
                var mantissaNode = null;
                var next;
                for (next = this._peek(); this._haveMore() && next >= "0" && next <= "9"; next = this._peek()) {
                    characteristicNode.value += next;
                }
                if (characteristicNode.value.length === 0) {
                    parent.pop();
                    return null;
                }
                if (this.read(current, ".") !== null) {
                    mantissaNode = new ParseNode(current, "");
                    for (next = this._peek(); this._haveMore() && next >= "0" && next <= "9"; next = this._peek()) {
                        mantissaNode.value += next;
                    }
                    if (mantissaNode.value.length === 0) {
                        parent.pop();
                        return null;
                    }
                }
                current.value = parseFloat(characteristicNode.value + (mantissaNode !== null ? "." + mantissaNode.value : ""));
                return current;
            };
            ParserRun.prototype.parse_enableDisable = function(parent) {
                var next = this._peek();
                if (next === "0" || next === "1") {
                    var result = new ParseNode(parent, next);
                    result.value = result.value === "1";
                    return result;
                }
                return null;
            };
            ParserRun.prototype.parse_hex = function(parent) {
                var next = this._peek();
                if (next >= "0" && next <= "9" || next >= "a" && next <= "f" || next >= "A" && next <= "F") {
                    return new ParseNode(parent, next);
                }
                return null;
            };
            ParserRun.prototype.parse_color = function(parent) {
                var current = new ParseNode(parent);
                if (this.read(current, "&") === null) {
                    parent.pop();
                    return null;
                }
                this.read(current, "H");
                var digitNodes = Array(6);
                for (var i = 0; i < digitNodes.length; i++) {
                    var digitNode = this.parse_hex(current);
                    if (digitNode === null) {
                        parent.pop();
                        return null;
                    }
                    digitNodes[i] = digitNode;
                }
                // Optional extra 00 at the end
                if (this.read(current, "0") !== null) {
                    if (this.read(current, "0") === null) {
                        parent.pop();
                        return null;
                    }
                }
                if (this.read(current, "&") === null) {
                    parent.pop();
                    return null;
                }
                current.value = new libjass.parts.Color(parseInt(digitNodes[4].value + digitNodes[5].value, 16), parseInt(digitNodes[2].value + digitNodes[3].value, 16), parseInt(digitNodes[0].value + digitNodes[1].value, 16));
                return current;
            };
            ParserRun.prototype.parse_alpha = function(parent) {
                var current = new ParseNode(parent);
                if (this.read(current, "&") !== null) {
                    this.read(current, "H");
                }
                var firstDigitNode = this.parse_hex(current);
                if (firstDigitNode === null) {
                    parent.pop();
                    return null;
                }
                var secondDigitNode = this.parse_hex(current);
                this.read(current, "&");
                current.value = 1 - parseInt(firstDigitNode.value + (secondDigitNode !== null ? secondDigitNode : firstDigitNode).value, 16) / 255;
                return current;
            };
            ParserRun.prototype.parse_colorWithAlpha = function(parent) {
                var current = new ParseNode(parent);
                if (this.read(current, "&H") === null) {
                    parent.pop();
                    return null;
                }
                var digitNodes = Array(8);
                for (var i = 0; i < digitNodes.length; i++) {
                    var digitNode = this.parse_hex(current);
                    if (digitNode === null) {
                        parent.pop();
                        return null;
                    }
                    digitNodes[i] = digitNode;
                }
                current.value = new libjass.parts.Color(parseInt(digitNodes[6].value + digitNodes[7].value, 16), parseInt(digitNodes[4].value + digitNodes[5].value, 16), parseInt(digitNodes[2].value + digitNodes[3].value, 16), 1 - parseInt(digitNodes[0].value + digitNodes[1].value, 16) / 255);
                return current;
            };
            ParserRun.prototype._peek = function(count) {
                if (typeof count === "undefined") {
                    count = 1;
                }
                return this._input.substr(this._parseTree.end, count);
            };
            ParserRun.prototype.read = function(parent, next) {
                if (this._peek(next.length) !== next) {
                    return null;
                }
                return new ParseNode(parent, next);
            };
            ParserRun.prototype._haveMore = function() {
                return this._parseTree.end < this._input.length;
            };
            return ParserRun;
        }();
        function makeTagParserFunction(tagName, tagConstructor, valueParser, required) {
            ParserRun.prototype["parse_tag_" + tagName] = function(parent) {
                var self = this;
                var current = new ParseNode(parent);
                if (self.read(current, tagName) === null) {
                    parent.pop();
                    return null;
                }
                var valueNode = valueParser.call(self, current);
                if (valueNode !== null) {
                    current.value = new tagConstructor(valueNode.value);
                } else if (required) {
                    current.value = new tagConstructor(null);
                } else {
                    parent.pop();
                    return null;
                }
                return current;
            };
        }
        makeTagParserFunction("alpha", libjass.parts.Alpha, ParserRun.prototype.parse_alpha, false);
        makeTagParserFunction("be", libjass.parts.Blur, ParserRun.prototype.parse_decimal, false);
        makeTagParserFunction("blur", libjass.parts.GaussianBlur, ParserRun.prototype.parse_decimal, false);
        makeTagParserFunction("bord", libjass.parts.Border, ParserRun.prototype.parse_decimal, false);
        makeTagParserFunction("c", libjass.parts.PrimaryColor, ParserRun.prototype.parse_color, false);
        makeTagParserFunction("fax", libjass.parts.SkewX, ParserRun.prototype.parse_decimal, false);
        makeTagParserFunction("fay", libjass.parts.SkewY, ParserRun.prototype.parse_decimal, false);
        makeTagParserFunction("fr", libjass.parts.RotateZ, ParserRun.prototype.parse_decimal, false);
        makeTagParserFunction("frx", libjass.parts.RotateX, ParserRun.prototype.parse_decimal, false);
        makeTagParserFunction("fry", libjass.parts.RotateY, ParserRun.prototype.parse_decimal, false);
        makeTagParserFunction("frz", libjass.parts.RotateZ, ParserRun.prototype.parse_decimal, false);
        makeTagParserFunction("fs", libjass.parts.FontSize, ParserRun.prototype.parse_decimal, false);
        makeTagParserFunction("fsp", libjass.parts.LetterSpacing, ParserRun.prototype.parse_decimal, false);
        makeTagParserFunction("i", libjass.parts.Italic, ParserRun.prototype.parse_enableDisable, false);
        makeTagParserFunction("k", libjass.parts.ColorKaraoke, ParserRun.prototype.parse_decimal, true);
        makeTagParserFunction("K", libjass.parts.SweepingColorKaraoke, ParserRun.prototype.parse_decimal, true);
        makeTagParserFunction("kf", libjass.parts.SweepingColorKaraoke, ParserRun.prototype.parse_decimal, true);
        makeTagParserFunction("ko", libjass.parts.OutlineKaraoke, ParserRun.prototype.parse_decimal, true);
        makeTagParserFunction("p", libjass.parts.DrawingMode, ParserRun.prototype.parse_decimal, true);
        makeTagParserFunction("pbo", libjass.parts.DrawingBaselineOffset, ParserRun.prototype.parse_decimal, true);
        makeTagParserFunction("s", libjass.parts.StrikeThrough, ParserRun.prototype.parse_enableDisable, false);
        makeTagParserFunction("shad", libjass.parts.Shadow, ParserRun.prototype.parse_decimal, false);
        makeTagParserFunction("u", libjass.parts.Underline, ParserRun.prototype.parse_enableDisable, false);
        makeTagParserFunction("xbord", libjass.parts.BorderX, ParserRun.prototype.parse_decimal, false);
        makeTagParserFunction("xshad", libjass.parts.ShadowX, ParserRun.prototype.parse_decimal, false);
        makeTagParserFunction("ybord", libjass.parts.BorderY, ParserRun.prototype.parse_decimal, false);
        makeTagParserFunction("yshad", libjass.parts.ShadowY, ParserRun.prototype.parse_decimal, false);
        makeTagParserFunction("1a", libjass.parts.PrimaryAlpha, ParserRun.prototype.parse_alpha, false);
        makeTagParserFunction("1c", libjass.parts.PrimaryColor, ParserRun.prototype.parse_color, false);
        makeTagParserFunction("2a", libjass.parts.SecondaryAlpha, ParserRun.prototype.parse_alpha, false);
        makeTagParserFunction("2c", libjass.parts.SecondaryColor, ParserRun.prototype.parse_color, false);
        makeTagParserFunction("3a", libjass.parts.OutlineAlpha, ParserRun.prototype.parse_alpha, false);
        makeTagParserFunction("3c", libjass.parts.OutlineColor, ParserRun.prototype.parse_color, false);
        makeTagParserFunction("4a", libjass.parts.ShadowAlpha, ParserRun.prototype.parse_alpha, false);
        makeTagParserFunction("4c", libjass.parts.ShadowColor, ParserRun.prototype.parse_color, false);
        var rules = new libjass.Map();
        Object.keys(ParserRun.prototype).forEach(function(key) {
            if (key.indexOf("parse_") === 0 && typeof ParserRun.prototype[key] === "function") {
                rules.set(key.substr("parse_".length), ParserRun.prototype[key]);
            }
        });
        var ParseNode = function() {
            function ParseNode(_parent, value) {
                if (typeof value === "undefined") {
                    value = null;
                }
                this._parent = _parent;
                this._children = [];
                if (_parent !== null) {
                    _parent._children.push(this);
                }
                this._start = _parent !== null ? _parent.end : 0;
                if (value !== null) {
                    this.value = value;
                } else {
                    this._setEnd(this._start);
                }
            }
            Object.defineProperty(ParseNode.prototype, "start", {
                get: function() {
                    return this._start;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ParseNode.prototype, "end", {
                get: function() {
                    return this._end;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ParseNode.prototype, "parent", {
                get: function() {
                    return this._parent;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ParseNode.prototype, "children", {
                get: function() {
                    return this._children;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ParseNode.prototype, "value", {
                get: function() {
                    return this._value;
                },
                set: function(newValue) {
                    this._value = newValue;
                    if (this._value.constructor === String && this._children.length === 0) {
                        this._setEnd(this._start + this._value.length);
                    }
                },
                enumerable: true,
                configurable: true
            });
            ParseNode.prototype.pop = function() {
                this._children.splice(this._children.length - 1, 1);
                if (this._children.length > 0) {
                    this._setEnd(this._children[this._children.length - 1].end);
                } else {
                    this._setEnd(this.start);
                }
            };
            ParseNode.prototype._setEnd = function(newEnd) {
                this._end = newEnd;
                if (this._parent !== null && this._parent.end !== this._end) {
                    this._parent._setEnd(this._end);
                }
            };
            return ParseNode;
        }();
    })(libjass.parser || (libjass.parser = {}));
})(libjass || (libjass = {}));

(function(libjass) {
    ///<reference path="libjass.ts" />
    (function(renderers) {
        /**
        * A renderer implementation that doesn't output anything.
        *
        * @constructor
        *
        * @param {!HTMLVideoElement} video
        * @param {!libjass.ASS} ass
        * @param {!libjass.RendererSettings} settings
        *
        * @memberof libjass.renderers
        */
        var NullRenderer = function() {
            function NullRenderer(_video, _ass, _settings) {
                var _this = this;
                this._video = _video;
                this._ass = _ass;
                this._settings = _settings;
                this._timeUpdateIntervalHandle = null;
                RendererSettings.prototype.initializeUnsetProperties.call(this._settings);
                // Sort the dialogues array by start time and then by their original position in the script (id)
                this._dialogues = this._ass.dialogues.slice(0);
                this._dialogues.sort(function(dialogue1, dialogue2) {
                    var result = dialogue1.start - dialogue2.start;
                    if (result === 0) {
                        result = dialogue1.id - dialogue2.id;
                    }
                    return result;
                });
                this._endTimes = this._dialogues.map(function(dialogue) {
                    return dialogue.end;
                });
                this._video.addEventListener("timeupdate", function() {
                    return _this._onVideoTimeUpdate();
                }, false);
                this._video.addEventListener("seeking", function() {
                    return _this._onVideoSeeking();
                }, false);
                this._video.addEventListener("pause", function() {
                    return _this._onVideoPause();
                }, false);
                this._video.addEventListener("playing", function() {
                    return _this._onVideoPlaying();
                }, false);
            }
            Object.defineProperty(NullRenderer.prototype, "video", {
                get: function() {
                    return this._video;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NullRenderer.prototype, "ass", {
                get: function() {
                    return this._ass;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NullRenderer.prototype, "settings", {
                get: function() {
                    return this._settings;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NullRenderer.prototype, "currentTime", {
                get: function() {
                    return this._currentTime;
                },
                enumerable: true,
                configurable: true
            });
            NullRenderer.prototype.onVideoTimeUpdate = function() {
                this._currentTime = this._video.currentTime;
                if (libjass.debugMode) {
                    console.log("NullRenderer.onVideoTimeUpdate: " + this._getVideoStateLogString());
                }
                var searchStart = 0;
                var searchEnd = this._endTimes.length;
                while (searchStart !== searchEnd) {
                    var mid = (searchStart + searchEnd) / 2 | 0;
                    if (this._endTimes[mid] < this._currentTime) {
                        searchStart = mid + 1;
                    } else {
                        searchEnd = mid;
                    }
                }
                for (var i = searchStart; i < this._endTimes.length; i++) {
                    var dialogue = this._dialogues[i];
                    if (dialogue.start <= this._currentTime) {
                        // This dialogue is visible right now. Draw it.
                        this.draw(dialogue);
                    } else if (dialogue.start <= this._currentTime + this._settings.preRenderTime) {
                        // This dialogue will be visible soon. Pre-render it.
                        this.preRender(dialogue);
                    } else {
                        break;
                    }
                }
            };
            NullRenderer.prototype.onVideoSeeking = function() {
                if (libjass.debugMode) {
                    console.log("NullRenderer.onVideoSeeking: " + this._getVideoStateLogString());
                }
            };
            NullRenderer.prototype.onVideoPause = function() {
                if (libjass.debugMode) {
                    console.log("NullRenderer.onVideoPause: " + this._getVideoStateLogString());
                }
                if (this._timeUpdateIntervalHandle !== null) {
                    clearInterval(this._timeUpdateIntervalHandle);
                    this._timeUpdateIntervalHandle = null;
                }
            };
            NullRenderer.prototype.onVideoPlaying = function() {
                var _this = this;
                if (libjass.debugMode) {
                    console.log("NullRenderer.onVideoPlaying: " + this._getVideoStateLogString());
                }
                if (this._timeUpdateIntervalHandle === null) {
                    this._timeUpdateIntervalHandle = setInterval(function() {
                        return _this._onVideoTimeChange();
                    }, NullRenderer._highResolutionTimerInterval);
                }
            };
            NullRenderer.prototype.preRender = function() {};
            NullRenderer.prototype.draw = function() {};
            NullRenderer.prototype._onVideoTimeUpdate = function() {
                if (this._state === 2) {
                    if (this._currentTime !== this._video.currentTime) {
                        this._onVideoPlaying();
                    }
                }
            };
            NullRenderer.prototype._onVideoTimeChange = function() {
                if (this._currentTime !== this._video.currentTime) {
                    if (this._state !== 0) {
                        this._onVideoPlaying();
                    }
                    this.onVideoTimeUpdate();
                }
            };
            NullRenderer.prototype._onVideoSeeking = function() {
                if (this._state !== 2) {
                    this._onVideoPause();
                    this._state = 2;
                }
                if (this._currentTime !== this._video.currentTime) {
                    this._currentTime = this._video.currentTime;
                    this.onVideoSeeking();
                }
            };
            NullRenderer.prototype._onVideoPause = function() {
                this._state = 1;
                this.onVideoPause();
            };
            NullRenderer.prototype._onVideoPlaying = function() {
                this._state = 0;
                this.onVideoPlaying();
            };
            NullRenderer.prototype._getVideoStateLogString = function() {
                return "video.currentTime = " + this._video.currentTime + ", video.paused = " + this._video.paused + ", video.seeking = " + this._video.seeking;
            };
            NullRenderer._highResolutionTimerInterval = 41;
            return NullRenderer;
        }();
        renderers.NullRenderer = NullRenderer;
        var VideoState;
        (function(VideoState) {
            VideoState[VideoState["Playing"] = 0] = "Playing";
            VideoState[VideoState["Paused"] = 1] = "Paused";
            VideoState[VideoState["Seeking"] = 2] = "Seeking";
        })(VideoState || (VideoState = {}));
        /**
        * A default renderer implementation.
        *
        * @constructor
        * @extends {libjass.renderers.NullRenderer}
        *
        * @param {!HTMLVideoElement} video
        * @param {!libjass.ASS} ass
        * @param {!libjass.RendererSettings} settings
        *
        * @memberof libjass.renderers
        */
        var DefaultRenderer = function(_super) {
            __extends(DefaultRenderer, _super);
            function DefaultRenderer(video, ass, settings) {
                var _this = this;
                _super.call(this, video, ass, settings);
                this._layerAlignmentWrappers = [];
                this._currentSubs = new libjass.Map();
                this._preRenderedSubs = new libjass.Map();
                this._videoIsFullScreen = false;
                this._eventListeners = new libjass.Map();
                this._videoSubsWrapper = document.createElement("div");
                video.parentElement.replaceChild(this._videoSubsWrapper, video);
                this._videoSubsWrapper.className = "libjass-wrapper";
                this._videoSubsWrapper.appendChild(video);
                this._subsWrapper = document.createElement("div");
                this._videoSubsWrapper.appendChild(this._subsWrapper);
                this._subsWrapper.className = "libjass-subs";
                // Create layer wrapper div's and the alignment div's inside each layer div
                var wrappersMap = new libjass.Map();
                this.ass.dialogues.forEach(function(dialogue) {
                    wrappersMap.set(dialogue.layer + "," + dialogue.alignment, [ dialogue.layer, dialogue.alignment ]);
                });
                var wrappersArray = [];
                wrappersMap.forEach(function(pair) {
                    wrappersArray.push(pair);
                });
                wrappersArray.sort(function(a, b) {
                    var result = a[0] - b[0];
                    if (result !== 0) {
                        return result;
                    }
                    return a[1] - b[1];
                }).forEach(function(pair) {
                    var layer = pair[0];
                    var alignment = pair[1];
                    if (_this._layerAlignmentWrappers[layer] === undefined) {
                        _this._layerAlignmentWrappers[pair[0]] = new Array(9 + 1);
                        // + 1 because alignments are 1-indexed (1 to 9)
                        // 0 is for absolutely-positioned subs
                        var layerAlignmentWrapper = document.createElement("div");
                        layerAlignmentWrapper.className = "layer" + layer + " an" + 0;
                        _this._subsWrapper.appendChild(layerAlignmentWrapper);
                        _this._layerAlignmentWrappers[layer][0] = layerAlignmentWrapper;
                    }
                    var layerAlignmentWrapper = document.createElement("div");
                    layerAlignmentWrapper.className = "layer" + layer + " an" + alignment;
                    _this._subsWrapper.appendChild(layerAlignmentWrapper);
                    _this._layerAlignmentWrappers[layer][alignment] = layerAlignmentWrapper;
                });
                if (!this.settings.preLoadFonts) {
                    setTimeout(function() {
                        return _this._ready();
                    }, 0);
                } else {
                    var allFonts = new libjass.Set();
                    Object.keys(this.ass.styles).map(function(name) {
                        return _this.ass.styles[name];
                    }).forEach(function(style) {
                        allFonts.add(style.fontName);
                    });
                    this.ass.dialogues.forEach(function(dialogue) {
                        dialogue.parts.forEach(function(part) {
                            if (part instanceof libjass.parts.FontName) {
                                allFonts.add(part.value);
                            }
                        });
                    });
                    var urlsToPreload = [];
                    this.settings.fontMap.forEach(function(src, name) {
                        if (allFonts.has(name)) {
                            urlsToPreload.unshift.apply(urlsToPreload, src);
                        }
                    });
                    var urlsLeftToPreload = urlsToPreload.length;
                    if (libjass.debugMode) {
                        console.log("Preloading fonts...");
                    }
                    urlsToPreload.forEach(function(url) {
                        var xhr = new XMLHttpRequest();
                        xhr.open("GET", url, true);
                        xhr.addEventListener("readystatechange", function() {
                            if (xhr.readyState === XMLHttpRequest.DONE) {
                                if (libjass.debugMode) {
                                    console.log("Preloaded " + url + ".");
                                }
                                --urlsLeftToPreload;
                                if (libjass.debugMode) {
                                    console.log(urlsLeftToPreload + " fonts left to preload.");
                                }
                                if (urlsLeftToPreload === 0) {
                                    if (libjass.debugMode) {
                                        console.log("All fonts have been preloaded.");
                                    }
                                    _this._ready();
                                }
                            }
                        }, false);
                        xhr.send(null);
                        return xhr;
                    });
                    if (libjass.debugMode) {
                        console.log(urlsLeftToPreload + " fonts left to preload.");
                    }
                    if (urlsLeftToPreload === 0) {
                        setTimeout(function() {
                            if (libjass.debugMode) {
                                console.log("All fonts have been preloaded.");
                            }
                            _this._ready();
                        }, 0);
                    }
                }
                this._eventListeners.set("ready", []);
                this._eventListeners.set("fullScreenChange", []);
            }
            /**
            * Add a listener for the given event.
            *
            * The "ready" event is fired when fonts have been preloaded if settings.preLoadFonts is true, or in the next tick after the DefaultRenderer object is constructed otherwise.
            *
            * The "fullScreenChange" event is fired when the browser's fullscreenchange event is fired for the video element.
            *
            * @param {string} type The type of event to attach the listener for. One of "ready" and "fullScreenChange".
            * @param {!Function} listener The listener
            */
            DefaultRenderer.prototype.addEventListener = function(type, listener) {
                var listeners = this._eventListeners.get(type);
                if (listeners !== null) {
                    listeners.push(listener);
                }
            };
            /**
            * Resize the video element and subtitles to the new dimensions.
            *
            * @param {number} width
            * @param {number} height
            */
            DefaultRenderer.prototype.resizeVideo = function(width, height) {
                this._removeAllSubs();
                this.video.style.width = width.toFixed(3) + "px";
                this.video.style.height = height.toFixed(3) + "px";
                var ratio = Math.min(width / this.ass.resolutionX, height / this.ass.resolutionY);
                var subsWrapperWidth = this.ass.resolutionX * ratio;
                var subsWrapperHeight = this.ass.resolutionY * ratio;
                this._subsWrapper.style.width = subsWrapperWidth.toFixed(3) + "px";
                this._subsWrapper.style.height = subsWrapperHeight.toFixed(3) + "px";
                this._subsWrapper.style.left = ((width - subsWrapperWidth) / 2).toFixed(3) + "px";
                this._subsWrapper.style.top = ((height - subsWrapperHeight) / 2).toFixed(3) + "px";
                this.ass.scaleTo(subsWrapperWidth, subsWrapperHeight);
                // Any dialogues which have been pre-rendered will need to be pre-rendered again.
                this._preRenderedSubs.clear();
                if (DefaultRenderer._animationStyleElement !== null) {
                    while (DefaultRenderer._animationStyleElement.firstChild !== null) {
                        DefaultRenderer._animationStyleElement.removeChild(DefaultRenderer._animationStyleElement.firstChild);
                    }
                }
                if (DefaultRenderer._svgFiltersElement !== null) {
                    while (DefaultRenderer._svgFiltersElement.firstChild !== null) {
                        DefaultRenderer._svgFiltersElement.removeChild(DefaultRenderer._svgFiltersElement.firstChild);
                    }
                }
                this.onVideoTimeUpdate();
            };
            DefaultRenderer.prototype.onVideoSeeking = function() {
                _super.prototype.onVideoSeeking.call(this);
                this._removeAllSubs();
            };
            DefaultRenderer.prototype.onVideoTimeUpdate = function() {
                var _this = this;
                _super.prototype.onVideoTimeUpdate.call(this);
                this._currentSubs.forEach(function(sub, dialogueId) {
                    var dialogue = _this.ass.dialogues[dialogueId];
                    if (dialogue.start > _this.currentTime || dialogue.end < _this.currentTime) {
                        _this._currentSubs.delete(dialogueId);
                        _this._removeSub(sub);
                    }
                });
            };
            DefaultRenderer.prototype.onVideoPause = function() {
                _super.prototype.onVideoPause.call(this);
                DefaultRenderer._addClass(this._subsWrapper, "paused");
            };
            DefaultRenderer.prototype.onVideoPlaying = function() {
                _super.prototype.onVideoPlaying.call(this);
                DefaultRenderer._removeClass(this._subsWrapper, "paused");
            };
            /**
            * The magic happens here. The subtitle div is rendered and stored. Call draw() to get a clone of the div to display.
            */
            DefaultRenderer.prototype.preRender = function(dialogue) {
                var _this = this;
                if (this._preRenderedSubs.has(dialogue.id)) {
                    return;
                }
                var sub = document.createElement("div");
                var scaleX = this.ass.scaleX;
                var scaleY = this.ass.scaleY;
                var dpi = this.ass.dpi;
                sub.style.marginLeft = scaleX * dialogue.style.marginLeft + "px";
                sub.style.marginRight = scaleX * dialogue.style.marginRight + "px";
                sub.style.marginTop = sub.style.marginBottom = scaleY * dialogue.style.marginVertical + "px";
                switch (dialogue.alignment) {
                  case 1:
                  case 4:
                  case 7:
                    sub.style.textAlign = "left";
                    break;

                  case 2:
                  case 5:
                  case 8:
                    sub.style.textAlign = "center";
                    break;

                  case 3:
                  case 6:
                  case 9:
                    sub.style.textAlign = "right";
                    break;
                }
                var animationCollection = new AnimationCollection(dialogue.id, dialogue.start, dialogue.end);
                var divTransformStyle = "";
                if (DefaultRenderer._svgFiltersElement === null) {
                    DefaultRenderer._svgFiltersElement = document.querySelector("#svg-filters");
                }
                var currentSpan = null;
                var currentSpanStyles = new SpanStyles(dialogue.id, dialogue.style, dialogue.transformOrigin, scaleX, scaleY, dpi, DefaultRenderer._svgFiltersElement);
                var startNewSpan = function() {
                    if (currentSpan !== null) {
                        currentSpanStyles.setStylesOnSpan(currentSpan);
                        sub.appendChild(currentSpan);
                    }
                    currentSpan = document.createElement("span");
                };
                startNewSpan();
                dialogue.parts.forEach(function(part) {
                    if (part instanceof libjass.parts.Italic) {
                        currentSpanStyles.italic = part.value;
                    } else if (part instanceof libjass.parts.Bold) {
                        currentSpanStyles.bold = part.value;
                    } else if (part instanceof libjass.parts.Underline) {
                        currentSpanStyles.underline = part.value;
                    } else if (part instanceof libjass.parts.StrikeThrough) {
                        currentSpanStyles.strikeThrough = part.value;
                    } else if (part instanceof libjass.parts.Border) {
                        currentSpanStyles.outlineWidthX = part.value;
                        currentSpanStyles.outlineWidthY = part.value;
                    } else if (part instanceof libjass.parts.BorderX) {
                        currentSpanStyles.outlineWidthX = part.value;
                    } else if (part instanceof libjass.parts.BorderY) {
                        currentSpanStyles.outlineWidthY = part.value;
                    } else if (part instanceof libjass.parts.GaussianBlur) {
                        currentSpanStyles.blur = part.value;
                    } else if (part instanceof libjass.parts.FontName) {
                        currentSpanStyles.fontName = part.value;
                    } else if (part instanceof libjass.parts.FontSize) {
                        currentSpanStyles.fontSize = part.value;
                    } else if (part instanceof libjass.parts.FontScaleX) {
                        currentSpanStyles.fontScaleX = part.value;
                    } else if (part instanceof libjass.parts.FontScaleY) {
                        currentSpanStyles.fontScaleY = part.value;
                    } else if (part instanceof libjass.parts.LetterSpacing) {
                        currentSpanStyles.letterSpacing = part.value;
                    } else if (part instanceof libjass.parts.RotateX) {
                        divTransformStyle += " rotateX(" + part.value + "deg)";
                    } else if (part instanceof libjass.parts.RotateY) {
                        divTransformStyle += " rotateY(" + part.value + "deg)";
                    } else if (part instanceof libjass.parts.RotateZ) {
                        divTransformStyle += " rotateZ(" + -1 * part.value + "deg)";
                    } else if (part instanceof libjass.parts.SkewX) {
                        divTransformStyle += " skewX(" + 45 * part.value + "deg)";
                    } else if (part instanceof libjass.parts.SkewY) {
                        divTransformStyle += " skewY(" + 45 * part.value + "deg)";
                    } else if (part instanceof libjass.parts.PrimaryColor) {
                        currentSpanStyles.primaryColor = part.value;
                    } else if (part instanceof libjass.parts.OutlineColor) {
                        currentSpanStyles.outlineColor = part.value;
                    } else if (part instanceof libjass.parts.Alpha) {
                        currentSpanStyles.primaryAlpha = part.value;
                        currentSpanStyles.outlineAlpha = part.value;
                    } else if (part instanceof libjass.parts.PrimaryAlpha) {
                        currentSpanStyles.primaryAlpha = part.value;
                    } else if (part instanceof libjass.parts.OutlineAlpha) {
                        currentSpanStyles.outlineAlpha = part.value;
                    } else if (part instanceof libjass.parts.Alignment) {} else if (part instanceof libjass.parts.Reset) {
                        var newStyleName = part.value;
                        var newStyle = null;
                        if (newStyleName !== null) {
                            newStyle = _this.ass.styles[newStyleName];
                        }
                        currentSpanStyles.reset(newStyle);
                    } else if (part instanceof libjass.parts.Position) {
                        var positionPart = part;
                        sub.style.position = "absolute";
                        sub.style.left = (scaleX * positionPart.x).toFixed(3) + "px";
                        sub.style.top = (scaleY * positionPart.y).toFixed(3) + "px";
                    } else if (part instanceof libjass.parts.Move) {
                        var movePart = part;
                        sub.style.position = "absolute";
                        animationCollection.addCustom("linear", new Animation(0, {
                            left: (scaleX * movePart.x1).toFixed(3) + "px",
                            top: (scaleY * movePart.y1).toFixed(3) + "px"
                        }), new Animation(movePart.t1, {
                            left: (scaleX * movePart.x1).toFixed(3) + "px",
                            top: (scaleY * movePart.y1).toFixed(3) + "px"
                        }), new Animation(movePart.t2, {
                            left: (scaleX * movePart.x2).toFixed(3) + "px",
                            top: (scaleY * movePart.y2).toFixed(3) + "px"
                        }), new Animation(dialogue.end - dialogue.start, {
                            left: (scaleX * movePart.x2).toFixed(3) + "px",
                            top: (scaleY * movePart.y2).toFixed(3) + "px"
                        }));
                    } else if (part instanceof libjass.parts.Fade) {
                        var fadePart = part;
                        if (fadePart.start !== 0) {
                            animationCollection.addFadeIn(0, fadePart.start);
                        }
                        if (fadePart.end !== 0) {
                            animationCollection.addFadeOut(dialogue.end - dialogue.start - fadePart.end, fadePart.end);
                        }
                    } else if (part instanceof libjass.parts.ComplexFade) {
                        var complexFadePart = part;
                        animationCollection.addCustom("linear", new Animation(0, {
                            opacity: String(complexFadePart.a1)
                        }), new Animation(complexFadePart.t1, {
                            opacity: String(complexFadePart.a1)
                        }), new Animation(complexFadePart.t2, {
                            opacity: String(complexFadePart.a2)
                        }), new Animation(complexFadePart.t3, {
                            opacity: String(complexFadePart.a2)
                        }), new Animation(complexFadePart.t4, {
                            opacity: String(complexFadePart.a3)
                        }), new Animation(dialogue.end, {
                            opacity: String(complexFadePart.a3)
                        }));
                    } else if (part instanceof libjass.parts.Text || libjass.debugMode && part instanceof libjass.parts.Comment) {
                        currentSpan.appendChild(document.createTextNode(part.value));
                        startNewSpan();
                    }
                });
                dialogue.parts.some(function(part) {
                    if (part instanceof libjass.parts.Position || part instanceof libjass.parts.Move) {
                        var translateX = -dialogue.transformOriginX;
                        var translateY = -dialogue.transformOriginY;
                        divTransformStyle = "translate(" + translateX + "%, " + translateY + "%) translate(-" + sub.style.marginLeft + ", -" + sub.style.marginTop + ") " + divTransformStyle;
                        return true;
                    }
                    return false;
                });
                if (divTransformStyle !== "") {
                    sub.style.webkitTransform = divTransformStyle;
                    sub.style.webkitTransformOrigin = dialogue.transformOrigin;
                    sub.style.transform = divTransformStyle;
                    sub.style.transformOrigin = dialogue.transformOrigin;
                }
                if (DefaultRenderer._animationStyleElement === null) {
                    var existingStyleElement = document.querySelector("#libjass-animation-styles");
                    if (existingStyleElement === null) {
                        existingStyleElement = document.createElement("style");
                        existingStyleElement.id = "libjass-animation-styles";
                        existingStyleElement.type = "text/css";
                        document.querySelector("head").appendChild(existingStyleElement);
                    }
                    DefaultRenderer._animationStyleElement = existingStyleElement;
                }
                DefaultRenderer._animationStyleElement.appendChild(document.createTextNode(animationCollection.cssText));
                sub.style.webkitAnimation = animationCollection.animationStyle;
                sub.style.animation = animationCollection.animationStyle;
                sub.setAttribute("data-dialogue-id", String(dialogue.id));
                this._preRenderedSubs.set(dialogue.id, sub);
            };
            /**
            * Returns the subtitle div for display. The currentTime is used to shift the animations appropriately, so that at the time the
            * div is inserted into the DOM and the animations begin, they are in sync with the video time.
            *
            * @param {!libjass.Dialogue} dialogue
            */
            DefaultRenderer.prototype.draw = function(dialogue) {
                var _this = this;
                if (this._currentSubs.has(dialogue.id)) {
                    return;
                }
                if (libjass.debugMode) {
                    console.log(dialogue.toString());
                }
                var preRenderedSub = this._preRenderedSubs.get(dialogue.id);
                if (preRenderedSub === undefined) {
                    if (libjass.debugMode) {
                        console.warn("This dialogue was not pre-rendered. Call preRender() before calling draw() so that draw() is faster.");
                    }
                    this.preRender(dialogue);
                    preRenderedSub = this._preRenderedSubs.get(dialogue.id);
                }
                var result = preRenderedSub.cloneNode(true);
                var defaultAnimationDelay = result.style.webkitAnimationDelay;
                if (defaultAnimationDelay === undefined) {
                    defaultAnimationDelay = result.style.animationDelay;
                }
                if (defaultAnimationDelay !== "") {
                    var animationDelay = defaultAnimationDelay.split(",").map(function(delay) {
                        return (parseFloat(delay) + dialogue.start - _this.currentTime).toFixed(3) + "s";
                    }).join(",");
                    result.style.webkitAnimationDelay = animationDelay;
                    result.style.animationDelay = animationDelay;
                }
                if (result.style.position === "absolute") {
                    this._layerAlignmentWrappers[dialogue.layer][0].appendChild(result);
                } else {
                    this._layerAlignmentWrappers[dialogue.layer][dialogue.alignment].appendChild(result);
                }
                this._currentSubs.set(dialogue.id, result);
            };
            DefaultRenderer.prototype._ready = function() {
                var _this = this;
                document.addEventListener("webkitfullscreenchange", function() {
                    return _this._onFullScreenChange();
                }, false);
                document.addEventListener("mozfullscreenchange", function() {
                    return _this._onFullScreenChange();
                }, false);
                document.addEventListener("fullscreenchange", function() {
                    return _this._onFullScreenChange();
                }, false);
                this.resizeVideo(parseInt(this.video.style.width), parseInt(this.video.style.height));
                this._dispatchEvent("ready");
            };
            DefaultRenderer.prototype._onFullScreenChange = function() {
                var fullScreenElement = document.fullscreenElement;
                if (fullScreenElement === undefined) {
                    fullScreenElement = document.mozFullScreenElement;
                }
                if (fullScreenElement === undefined) {
                    fullScreenElement = document.msFullscreenElement;
                }
                if (fullScreenElement === undefined) {
                    fullScreenElement = document.webkitFullscreenElement;
                }
                if (fullScreenElement === this.video) {
                    DefaultRenderer._addClass(this._videoSubsWrapper, "libjass-full-screen");
                    this.resizeVideo(screen.width, screen.height);
                    this._videoIsFullScreen = true;
                    this._dispatchEvent("fullScreenChange", this._videoIsFullScreen);
                } else if (fullScreenElement === null && this._videoIsFullScreen) {
                    DefaultRenderer._removeClass(this._videoSubsWrapper, "libjass-full-screen");
                    this._videoIsFullScreen = false;
                    this._dispatchEvent("fullScreenChange", this._videoIsFullScreen);
                }
            };
            /**
            * @param {string} type
            * @param {...*} args
            *
            * @private
            */
            DefaultRenderer.prototype._dispatchEvent = function(type) {
                var args = [];
                for (var _i = 0; _i < arguments.length - 1; _i++) {
                    args[_i] = arguments[_i + 1];
                }
                var _this = this;
                var listeners = this._eventListeners.get(type);
                if (listeners !== null) {
                    listeners.forEach(function(listener) {
                        listener.apply(_this, args);
                    });
                }
            };
            DefaultRenderer.prototype._removeSub = function(sub) {
                sub.parentNode.removeChild(sub);
            };
            DefaultRenderer.prototype._removeAllSubs = function() {
                var _this = this;
                this._currentSubs.forEach(function(sub) {
                    return _this._removeSub(sub);
                });
                this._currentSubs.clear();
            };
            DefaultRenderer.makeFontMapFromStyleElement = function(styleElement) {
                var map = new libjass.Map();
                var styleSheet = styleElement.sheet;
                var rules = Array.prototype.filter.call(styleSheet.cssRules, function(rule) {
                    return rule.type === CSSRule.FONT_FACE_RULE;
                });
                rules.forEach(function(rule) {
                    var src = rule.style.getPropertyValue("src");
                    var urls = [];
                    if (!src) {
                        src = rule.cssText.split("\n").map(function(line) {
                            return line.match(/src: ([^;]+);/);
                        }).filter(function(matches) {
                            return matches !== null;
                        }).map(function(matches) {
                            return matches[1];
                        })[0];
                    }
                    urls = src.split(/,\s*/).map(function(url) {
                        return url.match(/^url\((.+)\)$/)[1];
                    });
                    if (urls.length > 0) {
                        var name = DefaultRenderer._stripQuotes(rule.style.getPropertyValue("font-family"));
                        var existingList = map.get(name);
                        if (existingList === undefined) {
                            existingList = [];
                            map.set(name, existingList);
                        }
                        existingList.unshift.apply(existingList, urls.map(DefaultRenderer._stripQuotes));
                    }
                });
                return map;
            };
            DefaultRenderer._stripQuotes = function(str) {
                return str.match(/^["']?(.*?)["']?$/)[1];
            };
            DefaultRenderer._addClass = function(element, className) {
                var classNames = element.className.split(" ").map(function(className) {
                    return className.trim();
                }).filter(function(className) {
                    return !!className;
                });
                if (classNames.indexOf(className) === -1) {
                    element.className += " " + className;
                }
            };
            DefaultRenderer._removeClass = function(element, className) {
                var classNames = element.className.split(" ").map(function(className) {
                    return className.trim();
                }).filter(function(className) {
                    return !!className;
                });
                var existingIndex = classNames.indexOf(className);
                if (existingIndex !== -1) {
                    element.className = classNames.slice(0, existingIndex).join(" ") + " " + classNames.slice(existingIndex + 1).join(" ");
                }
            };
            DefaultRenderer._animationStyleElement = null;
            DefaultRenderer._svgFiltersElement = null;
            return DefaultRenderer;
        }(NullRenderer);
        renderers.DefaultRenderer = DefaultRenderer;
        /**
        * Settings for the default renderer.
        *
        * @constructor
        *
        * @memberof libjass.renderers
        */
        var RendererSettings = function() {
            function RendererSettings() {}
            RendererSettings.prototype.initializeUnsetProperties = function() {
                if (this.preLoadFonts === undefined) {
                    this.preLoadFonts = false;
                }
                if (this.fontMap === undefined) {
                    this.fontMap = null;
                }
                if (this.preRenderTime === undefined) {
                    this.preRenderTime = 5;
                }
            };
            return RendererSettings;
        }();
        renderers.RendererSettings = RendererSettings;
        var Animation = function() {
            function Animation(_time, _properties) {
                this._time = _time;
                this._properties = _properties;
            }
            Object.defineProperty(Animation.prototype, "time", {
                get: function() {
                    return this._time;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Animation.prototype, "properties", {
                get: function() {
                    return this._properties;
                },
                enumerable: true,
                configurable: true
            });
            return Animation;
        }();
        /**
        * This class represents a collection of keyframes. Each keyframe contains one or more CSS properties.
        * The collection can then be converted to a CSS3 representation.
        *
        * @constructor
        * @param {number} id The ID of the dialogue that this keyframe is associated with
        * @param {number} start The start time of the dialogue that this keyframe is associated with
        * @param {number} end The end time of the dialogue that this keyframe is associated with
        *
        * @private
        * @memberof libjass.renderers
        */
        var AnimationCollection = function() {
            function AnimationCollection(_id, _start, _end) {
                this._id = _id;
                this._start = _start;
                this._end = _end;
                this._cssText = "";
                this._animationStyle = "";
                this._numAnimations = 0;
            }
            Object.defineProperty(AnimationCollection.prototype, "cssText", {
                get: function() {
                    return this._cssText;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AnimationCollection.prototype, "animationStyle", {
                get: function() {
                    return this._animationStyle;
                },
                enumerable: true,
                configurable: true
            });
            /**
            * Add a fade-in animation.
            *
            * @param {number} start The time from the dialogue start to start the fade-in
            * @param {number} duration The duration of the fade-in
            */
            AnimationCollection.prototype.addFadeIn = function(start, duration) {
                if (this._animationStyle !== "") {
                    this._animationStyle += ",";
                }
                this._animationStyle += "fade-in " + duration.toFixed(3) + "s linear " + start.toFixed(3) + "s";
            };
            /**
            * Add a fade-out animation.
            *
            * @param {number} start The time from the dialogue start to start the fade-out
            * @param {number} duration The duration of the fade-out
            */
            AnimationCollection.prototype.addFadeOut = function(start, duration) {
                if (this._animationStyle !== "") {
                    this._animationStyle += ",";
                }
                this._animationStyle += "fade-out " + duration.toFixed(3) + "s linear " + start.toFixed(3) + "s";
            };
            /**
            * Add a new custom animation.
            *
            * @param {string} timingFunction
            * @param {Array.<!{time: number, properties: Object.<string, string>}>} animations
            */
            AnimationCollection.prototype.addCustom = function(timingFunction) {
                var animations = [];
                for (var _i = 0; _i < arguments.length - 1; _i++) {
                    animations[_i] = arguments[_i + 1];
                }
                var _this = this;
                var startTime = null;
                var endTime = null;
                var ruleCssText = "";
                animations.forEach(function(animation) {
                    if (startTime === null) {
                        startTime = animation.time;
                    }
                    endTime = animation.time;
                    ruleCssText += "	" + (100 * animation.time / (_this._end - _this._start)).toFixed(3) + "% {\n";
                    Object.keys(animation.properties).forEach(function(propertyName) {
                        ruleCssText += "		" + propertyName + ": " + animation.properties[propertyName] + ";\n";
                    });
                    ruleCssText += "	}\n";
                });
                var animationName = "dialogue-" + this._id + "-" + this._numAnimations++;
                this._cssText += "@-webkit-keyframes " + animationName + " {\n" + ruleCssText + "}\n\n" + "@keyframes " + animationName + " {\n" + ruleCssText + "}\n\n";
                if (this._animationStyle !== "") {
                    this._animationStyle += ",";
                }
                this._animationStyle += animationName + " " + (endTime - startTime).toFixed(3) + "s " + timingFunction + " " + startTime.toFixed(3) + "s";
            };
            return AnimationCollection;
        }();
        /**
        * This class represents the style attribute of a span.
        * As a Dialogue's div is rendered, individual parts are added to span's, and this class is used to maintain the style attribute of those.
        *
        * @constructor
        * @param {!libjass.Style} style The default style for the dialogue this object is associated with
        * @param {string} transformOrigin The transform origin of the dialogue this object is associated with
        * @param {number} scaleX The horizontal scaling of the dialogue this object is associated with
        * @param {number} scaleY The vertical scaling of the dialogue this object is associated with
        * @param {number} dpi The DPI of the ASS script this object is associated with
        *
        * @private
        * @memberof libjass.renderers
        */
        var SpanStyles = function() {
            function SpanStyles(_id, _style, _transformOrigin, _scaleX, _scaleY, _dpi, _svgFiltersElement) {
                this._id = _id;
                this._style = _style;
                this._transformOrigin = _transformOrigin;
                this._scaleX = _scaleX;
                this._scaleY = _scaleY;
                this._dpi = _dpi;
                this._svgFiltersElement = _svgFiltersElement;
                this._nextFilterId = 0;
                this.reset(null);
            }
            /**
            * Resets the styles to the defaults provided by the argument.
            *
            * @param {!libjass.Style=} newStyle The new defaults to reset the style to. If unspecified, the new style is the original style this object was created with.
            */
            SpanStyles.prototype.reset = function(newStyle) {
                if (newStyle === undefined || newStyle === null) {
                    newStyle = this._style;
                }
                this.italic = newStyle.italic;
                this.bold = newStyle.bold;
                this.underline = newStyle.underline;
                this.strikeThrough = newStyle.strikeThrough;
                this.outlineWidthX = newStyle.outlineWidth;
                this.outlineWidthY = newStyle.outlineWidth;
                this.fontName = newStyle.fontName;
                this.fontSize = newStyle.fontSize;
                this.fontScaleX = newStyle.fontScaleX;
                this.fontScaleY = newStyle.fontScaleY;
                this.letterSpacing = newStyle.letterSpacing;
                this.primaryColor = newStyle.primaryColor;
                this.outlineColor = newStyle.outlineColor;
                this.primaryAlpha = null;
                this.outlineAlpha = null;
                this.blur = null;
            };
            /**
            * Sets the style attribute on the given span element.
            *
            * @param {!HTMLSpanElement} span
            */
            SpanStyles.prototype.setStylesOnSpan = function(span) {
                var fontStyleOrWeight = "";
                if (this._italic) {
                    fontStyleOrWeight += "italic ";
                }
                if (this._bold === true) {
                    fontStyleOrWeight += "bold ";
                } else if (this._bold !== false) {
                    fontStyleOrWeight += this._bold + " ";
                }
                var fontSize = (72 / this._dpi * this._scaleY * this._fontSize).toFixed(3);
                span.style.font = fontStyleOrWeight + fontSize + "px/" + fontSize + 'px "' + this._fontName + '"';
                var textDecoration = "";
                if (this._underline) {
                    textDecoration = "underline";
                }
                if (this._strikeThrough) {
                    textDecoration += " line-through";
                }
                span.style.textDecoration = textDecoration.trim();
                var transform = "";
                if (this._fontScaleX != 1) {
                    transform += "scaleX(" + this._fontScaleX + ") ";
                }
                if (this._fontScaleY != 1) {
                    transform += "scaleY(" + this._fontScaleY + ")";
                }
                if (transform !== "") {
                    span.style.webkitTransform = transform;
                    span.style.webkitTransformOrigin = this._transformOrigin;
                    span.style.transform = transform;
                    span.style.transformOrigin = this._transformOrigin;
                    span.style.display = "inline-block";
                }
                span.style.letterSpacing = (this._scaleX * this._letterSpacing).toFixed(3) + "px";
                span.style.color = this._primaryColor.withAlpha(this._primaryAlpha).toString();
                var outlineColor = this._outlineColor.withAlpha(this._outlineAlpha);
                var outlineWidthX = this._scaleX * this._outlineWidthX;
                var outlineWidthY = this._scaleY * this._outlineWidthY;
                var filterId = "svg-filter-" + this._id + "-" + this._nextFilterId++;
                var points = [];
                var mergeNodes = [];
                var outlineFilter = "";
                if (outlineWidthX === 0 && outlineWidthY === 0) {
                    outlineFilter = '	<feGaussianBlur stdDeviation="' + this._blur + '" in="outlineColor" result="outline" />\n';
                } else {
                    /* Lay out text-shadows in an ellipse with horizontal radius = this._scaleX * this._outlineWidthX
                    * and vertical radius = this._scaleY * this._outlineWidthY
                    * Shadows are laid inside the region of the ellipse, separated by 1px
                    *
                    * The below loop is an unrolled version of the above algorithm that only roams over one quadrant and adds
                    * four shadows at a time.
                    */
                    var a = this._scaleX * this._outlineWidthX;
                    var b = this._scaleY * this._outlineWidthY;
                    var mergeNodeNumber = 0;
                    for (var x = 0; x < a; x++) {
                        for (var y = 0; y < b && x / a * (x / a) + y / b * (y / b) <= 1; y++) {
                            points.push([ x, y ]);
                            if (x !== 0) {
                                points.push([ -x, y ]);
                            }
                            if (x !== 0 && y !== 0) {
                                points.push([ -x, -y ]);
                            }
                            if (y !== 0) {
                                points.push([ x, -y ]);
                            }
                        }
                    }
                    // Make sure the four corner shadows exist
                    points.push([ a, 0 ]);
                    points.push([ 0, b ]);
                    points.push([ -a, 0 ]);
                    points.push([ 0, -b ]);
                    points.forEach(function(pair) {
                        outlineFilter += '	<feOffset dx="' + pair[0] + 'px" dy="' + pair[1] + 'px" in="outlineColor" result="outline' + mergeNodeNumber + '" />\n';
                        mergeNodes.push("outline" + mergeNodeNumber);
                        mergeNodeNumber++;
                    });
                    outlineFilter += '	<feMerge result="outlines">' + mergeNodes.map(function(mergeNode) {
                        return '		<feMergeNode in="' + mergeNode + '" />\n';
                    }).join("") + "	</feMerge>\n" + '	<feGaussianBlur stdDeviation="' + this._blur + '" in="outlines" result="outline" />\n';
                }
                var filterString = '<filter xmlns="http://www.w3.org/2000/svg" id="' + filterId + '">\n' + '	<feComponentTransfer in="SourceAlpha" result="outlineColor">\n' + '		<feFuncR type="linear" slope="' + (outlineColor.red / 255 * outlineColor.alpha).toFixed(3) + '" />\n' + '		<feFuncG type="linear" slope="' + (outlineColor.green / 255 * outlineColor.alpha).toFixed(3) + '" />\n' + '		<feFuncB type="linear" slope="' + (outlineColor.blue / 255 * outlineColor.alpha).toFixed(3) + '" />\n' + "	</feComponentTransfer>\n" + outlineFilter + "	<feMerge>\n" + '		<feMergeNode in="outline" />\n' + '		<feMergeNode in="SourceGraphic" />\n' + "	</feMerge>\n" + "</filter>";
                if (SpanStyles._domParser === null) {
                    SpanStyles._domParser = new DOMParser();
                }
                var filterElement = SpanStyles._domParser.parseFromString(filterString, "image/svg+xml").childNodes[0];
                this._svgFiltersElement.appendChild(filterElement);
                span.style.webkitFilter = 'url("#' + filterId + '")';
                span.style.filter = 'url("#' + filterId + '")';
            };
            Object.defineProperty(SpanStyles.prototype, "italic", {
                /**
                * Sets the italic property. null defaults it to the style's original value.
                *
                * @type {?boolean}
                */
                set: function(value) {
                    this._italic = SpanStyles._valueOrDefault(value, this._style.italic);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SpanStyles.prototype, "bold", {
                /**
                * Sets the bold property. null defaults it to the style's original value.
                *
                * @type {(?number|?boolean)}
                */
                set: function(value) {
                    this._bold = SpanStyles._valueOrDefault(value, this._style.bold);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SpanStyles.prototype, "underline", {
                /**
                * Sets the underline property. null defaults it to the style's original value.
                *
                * @type {?boolean}
                */
                set: function(value) {
                    this._underline = SpanStyles._valueOrDefault(value, this._style.underline);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SpanStyles.prototype, "strikeThrough", {
                /**
                * Sets the strike-through property. null defaults it to the style's original value.
                *
                * @type {?boolean}
                */
                set: function(value) {
                    this._strikeThrough = SpanStyles._valueOrDefault(value, this._style.strikeThrough);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SpanStyles.prototype, "outlineWidthX", {
                /**
                * Sets the outline width property. null defaults it to the style's original outline width value.
                *
                * @type {?number}
                */
                set: function(value) {
                    this._outlineWidthX = SpanStyles._valueOrDefault(value, this._style.outlineWidth);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SpanStyles.prototype, "outlineWidthY", {
                /**
                * Sets the outline height property. null defaults it to the style's original outline width value.
                *
                * @type {?number}
                */
                set: function(value) {
                    this._outlineWidthY = SpanStyles._valueOrDefault(value, this._style.outlineWidth);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SpanStyles.prototype, "blur", {
                /**
                * Sets the blur property. null defaults it to 0.
                *
                * @type {?number}
                */
                set: function(value) {
                    this._blur = SpanStyles._valueOrDefault(value, 0);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SpanStyles.prototype, "fontName", {
                /**
                * Sets the font name property. null defaults it to the style's original value.
                *
                * @type {?string}
                */
                set: function(value) {
                    this._fontName = SpanStyles._valueOrDefault(value, this._style.fontName);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SpanStyles.prototype, "fontSize", {
                /**
                * Sets the font size property. null defaults it to the style's original value.
                *
                * @type {?number}
                */
                set: function(value) {
                    this._fontSize = SpanStyles._valueOrDefault(value, this._style.fontSize);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SpanStyles.prototype, "fontScaleX", {
                /**
                * Sets the horizontal font scaling property. null defaults it to the style's original value.
                *
                * @type {?number}
                */
                set: function(value) {
                    this._fontScaleX = SpanStyles._valueOrDefault(value, this._style.fontScaleX);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SpanStyles.prototype, "fontScaleY", {
                /**
                * Sets the vertical font scaling property. null defaults it to the style's original value.
                *
                * @type {?number}
                */
                set: function(value) {
                    this._fontScaleY = SpanStyles._valueOrDefault(value, this._style.fontScaleY);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SpanStyles.prototype, "letterSpacing", {
                /**
                * Sets the letter spacing property. null defaults it to the style's original value.
                *
                * @type {?number}
                */
                set: function(value) {
                    this._letterSpacing = SpanStyles._valueOrDefault(value, this._style.letterSpacing);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SpanStyles.prototype, "primaryColor", {
                /**
                * Sets the primary color property. null defaults it to the style's original value.
                *
                * @type {libjass.parts.Color}
                */
                set: function(value) {
                    this._primaryColor = SpanStyles._valueOrDefault(value, this._style.primaryColor);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SpanStyles.prototype, "outlineColor", {
                /**
                * Sets the outline color property. null defaults it to the style's original value.
                *
                * @type {libjass.parts.Color}
                */
                set: function(value) {
                    this._outlineColor = SpanStyles._valueOrDefault(value, this._style.outlineColor);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SpanStyles.prototype, "primaryAlpha", {
                /**
                * Sets the primary alpha property.
                *
                * @type {?number}
                */
                set: function(value) {
                    this._primaryAlpha = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SpanStyles.prototype, "outlineAlpha", {
                /**
                * Sets the outline alpha property.
                *
                * @type {?number}
                */
                set: function(value) {
                    this._outlineAlpha = value;
                },
                enumerable: true,
                configurable: true
            });
            SpanStyles._domParser = null;
            SpanStyles._valueOrDefault = function(newValue, defaultValue) {
                return newValue !== null ? newValue : defaultValue;
            };
            return SpanStyles;
        }();
    })(libjass.renderers || (libjass.renderers = {}));
})(libjass || (libjass = {}));

(function(libjass) {
    /**
    * This class represents an ASS script. It contains information about the script, an array of Styles, and an array of Dialogues.
    *
    * @constructor
    * @param {string} rawASS The raw text of the ASS script.
    *
    * @memberof libjass
    */
    var ASS = function() {
        function ASS(rawASS) {
            var _this = this;
            this._styles = Object.create(null);
            this._dialogues = [];
            rawASS = rawASS.replace(/\r$/gm, "");
            var script = libjass.parser.parse(rawASS, "script");
            // Get the script info template
            var infoTemplate = script["Script Info"];
            if (libjass.verboseMode) {
                console.log("Read script info: " + JSON.stringify(infoTemplate), infoTemplate);
            }
            // Parse the horizontal script resolution
            this._resolutionX = parseInt(infoTemplate["PlayResX"]);
            // Parse the vertical script resolution
            this._resolutionY = parseInt(infoTemplate["PlayResY"]);
            // Get styles from the styles section
            script["V4+ Styles"].forEach(function(line) {
                if (line.type === "Style") {
                    var styleTemplate = line.template;
                    if (libjass.verboseMode) {
                        console.log("Read style: " + JSON.stringify(styleTemplate), styleTemplate);
                    }
                    // Create the style and add it to the styles map
                    var newStyle = new Style(styleTemplate);
                    _this._styles[newStyle.name] = newStyle;
                }
            });
            // Get dialogues from the events section
            script["Events"].forEach(function(line) {
                if (line.type === "Dialogue") {
                    var dialogueTemplate = line.template;
                    if (libjass.verboseMode) {
                        console.log("Read dialogue: " + JSON.stringify(dialogueTemplate), dialogueTemplate);
                    }
                    // Create the dialogue and add it to the dialogues array
                    _this._dialogues.push(new Dialogue(dialogueTemplate, _this));
                }
            });
        }
        Object.defineProperty(ASS.prototype, "resolutionX", {
            /**
            * The horizontal script resolution.
            *
            * @type {number}
            */
            get: function() {
                return this._resolutionX;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ASS.prototype, "resolutionY", {
            /**
            * The vertical script resolution.
            *
            * @type {number}
            */
            get: function() {
                return this._resolutionY;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ASS.prototype, "scaleX", {
            /**
            * After calling ASS.scaleTo(), this is the multiplicative factor to scale horizontal script resolution to video resolution.
            *
            * @type {number}
            */
            get: function() {
                return this._scaleX;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ASS.prototype, "scaleY", {
            /**
            * After calling ASS.scaleTo(), this is the multiplicative factor to scale vertical script resolution to video resolution.
            *
            * @type {number}
            */
            get: function() {
                return this._scaleY;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ASS.prototype, "dpi", {
            /**
            * The DPI of the target device.
            *
            * @type {number}
            */
            get: function() {
                return this._dpi;
            },
            set: function(value) {
                this._dpi = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ASS.prototype, "styles", {
            /**
            * The styles in this script.
            *
            * @type {!Object.<string, !libjass.Style>}
            */
            get: function() {
                return this._styles;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ASS.prototype, "dialogues", {
            /**
            * The dialogues in this script.
            *
            * @type {!Array.<!libjass.Dialogue>}
            */
            get: function() {
                return this._dialogues;
            },
            enumerable: true,
            configurable: true
        });
        /**
        * This method takes in the actual video height and width and prepares the scaleX and scaleY
        * properties according to the script resolution.
        *
        * @param {number} videoWidth The width of the video, in pixels
        * @param {number} videoHeight The height of the video, in pixels
        */
        ASS.prototype.scaleTo = function(videoWidth, videoHeight) {
            this._scaleX = videoWidth / this._resolutionX;
            this._scaleY = videoHeight / this._resolutionY;
        };
        return ASS;
    }();
    libjass.ASS = ASS;
    /**
    * This class represents a single global style declaration in an ASS script. The styles can be obtained via the ASS.styles property.
    *
    * @constructor
    * @param {!Object} template The template object that contains the style's properties. It is a map of the string values read from the ASS file.
    * @param {string} template["Name"] The name of the style
    * @param {string} template["Italic"] -1 if the style is italicized
    * @param {string} template["Bold"] -1 if the style is bold
    * @param {string} template["Underline"] -1 if the style is underlined
    * @param {string} template["StrikeOut"] -1 if the style is struck-through
    * @param {string} template["OutlineWidth"] The outline width
    * @param {string} template["Fontname"] The name of the font
    * @param {string} template["Fontsize"] The size of the font
    * @param {string} template["ScaleX"] The horizontal scaling of the font
    * @param {string} template["ScaleY"] The vertical scaling of the font
    * @param {string} template["Spacing"] The letter spacing of the font
    * @param {string} template["PrimaryColor"] The primary color
    * @param {string} template["OutlineColor"] The outline color
    * @param {string} template["Outline"] The outline width
    * @param {string} template["Alignment"] The alignment number
    * @param {string} template["MarginL"] The left margin
    * @param {string} template["MarginR"] The right margin
    * @param {string} template["MarginV"] The vertical margin
    *
    * @memberof libjass
    */
    var Style = function() {
        function Style(template) {
            this._name = template["Name"];
            this._italic = template["Italic"] === "-1";
            this._bold = template["Bold"] === "-1";
            this._underline = template["Underline"] === "-1";
            this._strikeThrough = template["StrikeOut"] === "-1";
            this._fontName = template["Fontname"];
            this._fontSize = parseFloat(template["Fontsize"]);
            this._fontScaleX = parseFloat(template["ScaleX"]) / 100;
            this._fontScaleY = parseFloat(template["ScaleY"]) / 100;
            this._letterSpacing = parseFloat(template["Spacing"]);
            this._primaryColor = libjass.parser.parse(template["PrimaryColour"], "colorWithAlpha");
            this._outlineColor = libjass.parser.parse(template["OutlineColour"], "colorWithAlpha");
            this._outlineWidth = parseFloat(template["Outline"]);
            this._alignment = parseInt(template["Alignment"]);
            this._marginLeft = parseFloat(template["MarginL"]);
            this._marginRight = parseFloat(template["MarginR"]);
            this._marginVertical = parseFloat(template["MarginV"]);
        }
        Object.defineProperty(Style.prototype, "name", {
            /**
            * The name of this style.
            *
            * @type {string}
            */
            get: function() {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Style.prototype, "italic", {
            /**
            * Whether this style is italicized or not.
            *
            * @type {string}
            */
            get: function() {
                return this._italic;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Style.prototype, "bold", {
            /**
            * Whether this style is bold or not.
            *
            * @type {boolean}
            */
            get: function() {
                return this._bold;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Style.prototype, "underline", {
            /**
            * Whether this style is underlined or not.
            *
            * @type {boolean}
            */
            get: function() {
                return this._underline;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Style.prototype, "strikeThrough", {
            /**
            * Whether this style is struck-through or not.
            *
            * @type {boolean}
            */
            get: function() {
                return this._strikeThrough;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Style.prototype, "fontName", {
            /**
            * The name of this style's font.
            *
            * @type {string}
            */
            get: function() {
                return this._fontName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Style.prototype, "fontSize", {
            /**
            * The size of this style's font.
            *
            * @type {number}
            */
            get: function() {
                return this._fontSize;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Style.prototype, "fontScaleX", {
            /**
            * The horizontal scaling of this style's font.
            *
            * @type {number}
            */
            get: function() {
                return this._fontScaleX;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Style.prototype, "fontScaleY", {
            /**
            * The vertical scaling of this style's font.
            *
            * @type {number}
            */
            get: function() {
                return this._fontScaleY;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Style.prototype, "letterSpacing", {
            /**
            * The letter spacing scaling of this style's font.
            *
            * @type {number}
            */
            get: function() {
                return this._letterSpacing;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Style.prototype, "primaryColor", {
            /**
            * The color of this style's font.
            *
            * @type {!libjass.parts.Color}
            */
            get: function() {
                return this._primaryColor;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Style.prototype, "outlineColor", {
            /**
            * The color of this style's outline.
            *
            * @type {!libjass.parts.Color}
            */
            get: function() {
                return this._outlineColor;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Style.prototype, "outlineWidth", {
            /**
            * The width of this style's outline.
            *
            * @type {number}
            */
            get: function() {
                return this._outlineWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Style.prototype, "alignment", {
            /**
            * The alignment of dialogues of this style.
            *
            * @type {number}
            */
            get: function() {
                return this._alignment;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Style.prototype, "marginLeft", {
            /**
            * The left margin of dialogues of this style.
            *
            * @type {number}
            */
            get: function() {
                return this._marginLeft;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Style.prototype, "marginRight", {
            /**
            * The right margin of dialogues of this style.
            *
            * @type {number}
            */
            get: function() {
                return this._marginRight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Style.prototype, "marginVertical", {
            /**
            * The vertical margin of dialogues of this style.
            *
            * @type {number}
            */
            get: function() {
                return this._marginVertical;
            },
            enumerable: true,
            configurable: true
        });
        return Style;
    }();
    libjass.Style = Style;
    /**
    * This class represents a dialogue in an ASS script.
    *
    * @constructor
    * @param {!Object} template The template object that contains the dialogue's properties. It is a map of the string values read from the ASS file.
    * @param {string} template["Style"] The name of the default style of this dialogue
    * @param {string} template["Start"] The start time
    * @param {string} template["End"] The end time
    * @param {string} template["Layer"] The layer number
    * @param {string} template["Text"] The text of this dialogue
    * @param {ASS} ass The ASS object to which this dialogue belongs
    *
    * @memberof libjass
    */
    var Dialogue = function() {
        function Dialogue(template, ass) {
            var _this = this;
            this._sub = null;
            this._id = ++Dialogue._lastDialogueId;
            this._style = ass.styles[template["Style"]];
            this._start = Dialogue._toTime(template["Start"]);
            this._end = Dialogue._toTime(template["End"]);
            this._layer = Math.max(parseInt(template["Layer"]), 0);
            this._alignment = this._style.alignment;
            this._parts = libjass.parser.parse(template["Text"], "dialogueParts");
            this._parts.forEach(function(part, index) {
                if (part instanceof libjass.parts.Alignment) {
                    _this._alignment = part.value;
                } else if (part instanceof libjass.parts.Move) {
                    var movePart = part;
                    if (movePart.t1 === null || movePart.t2 === null) {
                        _this._parts[index] = new libjass.parts.Move(movePart.x1, movePart.y1, movePart.x2, movePart.y2, 0, _this._end - _this._start);
                    }
                } else if (part instanceof libjass.parts.Transform) {
                    var transformPart = part;
                    if (transformPart.start === null || transformPart.end === null || transformPart.accel === null) {
                        _this._parts[index] = new libjass.parts.Transform(transformPart.start === null ? 0 : transformPart.start, transformPart.end === null ? _this._end - _this._start : transformPart.end, transformPart.accel === null ? 1 : transformPart.accel, transformPart.tags);
                    }
                }
            });
            this._setTransformOrigin();
            if (libjass.debugMode) {
                var possiblyIncorrectParses = this._parts.filter(function(part) {
                    return part instanceof libjass.parts.Comment && part.value.indexOf("\\") !== -1;
                });
                if (possiblyIncorrectParses.length > 0) {
                    console.warn("Possible incorrect parse:\n" + template["Text"] + "\n" + "was parsed as\n" + this.toString() + "\n" + "The possibly incorrect parses are:\n" + possiblyIncorrectParses.join("\n"));
                }
            }
        }
        Object.defineProperty(Dialogue.prototype, "id", {
            /**
            * The unique ID of this dialogue. Auto-generated.
            *
            * @type {number}
            */
            get: function() {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dialogue.prototype, "start", {
            /**
            * The start time of this dialogue.
            *
            * @type {number}
            */
            get: function() {
                return this._start;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dialogue.prototype, "end", {
            /**
            * The end time of this dialogue.
            *
            * @type {number}
            */
            get: function() {
                return this._end;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dialogue.prototype, "style", {
            get: function() {
                return this._style;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dialogue.prototype, "alignment", {
            /**
            * The alignment number of this dialogue.
            *
            * @type {number}
            */
            get: function() {
                return this._alignment;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dialogue.prototype, "transformOriginX", {
            get: function() {
                return this._transformOriginX;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dialogue.prototype, "transformOriginY", {
            get: function() {
                return this._transformOriginY;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dialogue.prototype, "transformOrigin", {
            get: function() {
                return this._transformOrigin;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dialogue.prototype, "layer", {
            /**
            * The layer number of this dialogue.
            *
            * @type {number}
            */
            get: function() {
                return this._layer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dialogue.prototype, "parts", {
            /**
            * The parts of this dialogue.
            *
            * @type {!Array.<!libjass.parts.Tag>}
            */
            get: function() {
                return this._parts;
            },
            enumerable: true,
            configurable: true
        });
        /**
        * @return {string} A simple representation of this dialogue's properties and tags.
        */
        Dialogue.prototype.toString = function() {
            return "#" + this._id + " [" + this._start.toFixed(3) + "-" + this._end.toFixed(3) + "] " + this._parts.join(", ");
        };
        /**
        * Converts this string into the number of seconds it represents. This string must be in the form of hh:mm:ss.MMM
        *
        * @param {string} string
        * @return {number}
        *
        * @private
        */
        Dialogue._toTime = function(str) {
            return str.split(":").reduce(function(previousValue, currentValue) {
                return previousValue * 60 + parseFloat(currentValue);
            }, 0);
        };
        Dialogue.prototype._setTransformOrigin = function() {
            switch (this._alignment) {
              case 1:
                this._transformOriginX = 0;
                this._transformOriginY = 100;
                break;

              case 2:
                this._transformOriginX = 50;
                this._transformOriginY = 100;
                break;

              case 3:
                this._transformOriginX = 100;
                this._transformOriginY = 100;
                break;

              case 4:
                this._transformOriginX = 0;
                this._transformOriginY = 50;
                break;

              case 5:
                this._transformOriginX = 50;
                this._transformOriginY = 50;
                break;

              case 6:
                this._transformOriginX = 100;
                this._transformOriginY = 50;
                break;

              case 7:
                this._transformOriginX = 0;
                this._transformOriginY = 0;
                break;

              case 8:
                this._transformOriginX = 50;
                this._transformOriginY = 0;
                break;

              case 9:
                this._transformOriginX = 100;
                this._transformOriginY = 0;
                break;
            }
            this._transformOrigin = this._transformOriginX + "% " + this._transformOriginY + "%";
        };
        Dialogue._lastDialogueId = -1;
        return Dialogue;
    }();
    libjass.Dialogue = Dialogue;
    /**
    * Debug mode. When true, libjass logs some debug messages.
    *
    * @type {boolean}
    */
    libjass.debugMode = false;
    /**
    * Verbose debug mode. When true, libjass logs some more debug messages. This setting is independent of debugMode.
    *
    * @type {boolean}
    */
    libjass.verboseMode = false;
})(libjass || (libjass = {}));
//# sourceMappingURL=libjass.js.map