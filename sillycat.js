/**
 ***************PROJECT NOTES
 *
 *
 *implemented assets and methods
 *
 * private scope:
 *
 * @method databinder
 * @method binddata
 * @method bindMouseActions
 * @method eventdispatch
 * @method digest
 *
 * global scope:
 * @method router
 *
 *
 * Framework scope:
 * @method each
 * @method toString
 * @method css
 * @method html
 * @method closest
 * @method router
 *
 *
 *
 *
 *
 */
/*******************************************************************************
 * 
 * UNDER THE HOOD
 * 
 * FRAMEWORK: The framework consists of controller, directives and services. These are 
 * created when building the application. When the application is started, the javascript 
 * is run an dthe controllers are created. After that the page is sacanned for controller 
 * attributes "data-controller". When one is found, the related controller is initiated 
 * and the scope of teh controller is available.
 * 
 * 
 * BINDS: To speed up development, the framework offers data binding is multiple ways, 
 * meaning that it also applies element value, image src attribute, link href attribute.
 * 
 * 
 * METHODS: Next to a structured MVC framework there are also methods available to 
 * assist for a fast and flexible development of the application.
 * 
 *******************************************************************************/

/**
 * 
 * @param object
 *            window
 * @return {undefined}
 */
(function (window) {
    "use strict";
      // ..................................................................................
    // .............. SILLYCAT CONFIGURATION
    // ...............................
    
    
    
    /** !!!!!!!!!!!!!!!!! THIS IS NOT YET IMPLEMENTED !!!!!!!!**/
    var config = {
        
        // prefix for html5 attributes (default data)
        prefix : 'data'
    }
    
    
    // ..................................................................................
    // .............. SILLYCAT VARIABLES AND ATTRIBUTES
    // ...............................
    var _controller = {}, // controller object
            _directive = {}, // directives
            _services = {}, // global functions as services injected into controller
            _formdata = {}; // dedicated form data object;
    var _private = {},
            _global = {};
    var _bind = {},
            _model = {}, // bind data
            _view = {}; // bind page sections

    // Browser Test
 
    var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
    _private = {
        oDatabind: ["data-bind", "data-image"], // data binder attribute
        oModelbind: ["data-model"],
        oViewbind: ["data-view"], // view binder attribute
        oCssbind: ["data-css", "data-style"], // css binder attribute
        oHrefbind: ["data-href"], // href binder for a-tags
        mouseActions: [
            "data-click", "data-dblclick", "data-mouseover", "data-mouseout", "data-mouseenter",
            "data-mouseleave", "data-keypress", "data-keydown", "data-keyup",
            "data-submit", "data-change", "data-mousemove", "data-hover"
        ],
        // data and attribute binding objects

        /*-------------------------------------------------------------------------------------
         
         DATA AND ATTRIBUTE BINDERS
         
         Configuration of the objects that are used
         for two way binding.
         
         -------------------------------------------------------------------------------------*/

        element_type: function (elem) {
            var form_elem = ["input", "textarea", "select"];
            var bool_elem = ["checkbox", "radio"];
            var img_elem = ["img"];
            var nodename = elem.nodeName.toLowerCase();
            var type = elem.type;
            if (form_elem.includes(nodename)) {
                return 1;
            }

            if (bool_elem.includes(type)) {
                return 2;
            }
            if (img_elem.includes(nodename)) {
                return 3;
            }
            return 4;
        },
        viewbinder: function (obj, elem, prop) {

            Object.defineProperty(obj, prop, {

                set: function (val) {
                    elem.innerHTML = val;
                    // activate directives
                    $priv.oPrivate.digest(elem);
                },
                configurable: true

            });
        },
        /**
         * 
         * @param object
         *            obj
         * @param HTMLObject
         *            elem
         * @param string
         *            prop
         * @param string
         *            piggy
         * @return {undefined}
         * 
         * piggy is the equivalent for a second bind property.
         */
        databinder: function (obj, elem, prop, piggy) {
            var elemtype = this.element_type(elem);
            Object.defineProperty(obj, prop, {
                set: function (val) {
                    switch (elemtype) {
                        case 1: // [input, textarea]
                            elem.value = val;
                            break;
                        case 2: // [radio, checkbox]
                            elem.checked = val;
                            break
                        case 3: // [img]
                            elem.src = val;
                            break
                        default: // [ HTML Element ]
                            elem.innerHTML = val;
                            _private.digest(elem);
                            break;
                    }
                },
                get: function () {

                    switch (elemtype) {
                        case 1:
                            return elem.value;
                        case 2:
                            return elem.checked;
                        case 3:
                            return elem.src;
                        default:
                            return elem.innerHTML;
                    }
                },
                configurable: true
            });
        },
        // binding model data to databinder object
        modelbinder: function (obj, elem, prop) {
            var elemtype = this.element_type(elem);
            Object.defineProperty(obj, prop, {
                set: function (val) {

                    switch (elemtype) {
                        case 1: // [input, textarea]
                            elem.value = val;
                            break;
                        case 2: // [radio, checkbox]
                            elem.checked = val;
                            break;
                        case 3: // [img]
                            elem.src = val;
                            break
                        default: // [ HTML Element ]
                            elem.innerHTML = val;
                            _private.digest(elem);
                            break;
                    }
                },
                get: function () {

                    switch (elemtype) {
                        case 1:
                            return elem.value;
                        case 2:
                            return elem.checked;
                        case 3:
                            return elem.src;
                        default:
                            return elem.value;
                    }
                },
                configurable: true
            });
            _model[prop] = _bind[prop];
            this.bind_model_to_data(elem, prop);
        },
        modelbinder_: function (obj, elem, prop) {
            var form_elem = ["input", "textarea", "select"];
            var bool_elem = ["checkbox", "radio"];
            var by_nodename = elem.nodeName.toLowerCase();
            var by_type = elem.type;
            var formElem = form_elem.indexOf(by_nodename);
            var boolElem = bool_elem.indexOf(by_type);
            Object.defineProperty(obj, prop, {
                set: function (val) {
                    if (formElem !== -1) {
                        if (boolElem !== -1) {
                            elem.checked = val;
                        } else {
                            elem.value = val;
                        }
                    }
                },
                get: function () {
                    if (formElem !== -1) {
                        if (boolElem !== -1) {
                            return elem.checked;
                        } else {
                            return elem.value;
                        }
                    }
                },
                configurable: true
            });
            _model[prop] = _bind[prop];
            this.bind_model_to_data(elem, prop);
        },
        // binding href object
        hrefbinder: function (obj, elem, prop) {
            Object.defineProperty(obj, prop, {
                set: function (val) {
                    elem.href = val;
                },
                get: function () {
                    return elem.href;
                },
                configurable: true
            });
        },
        // binding css object
        cssbinder: function (obj, elem, prop) {
            Object.defineProperty(obj, prop, {
                set: function (obj) {
                    Object.keys(obj).forEach(function (property) {
                        elem.style[property] = obj[property];
                    });
                },
                get: function () {
                    return elem.style;
                },
                configurable: true
            });
        },
        /*-------------------------------------------------------------------------------------
         
         BIND ATTRIBUTES
         
         Scans page within the scope of the controllers
         and directives for binding attributes
         
         
         -------------------------------------------------------------------------------------*/

        binddata: function (scope, obj) {
            obj.forEach(function (databind) {
                var binders = scope.querySelectorAll("[" + databind + "]");
                var i, length = binders.length,
                        prop, piggy;
                for (i = 0; i < length; i += 1) {
                    prop = binders[i].getAttribute(databind);
                    piggy = null;
                    if (_bind.hasOwnProperty(prop)) {
                        piggy = prop + "01";
                    }
                    _private.databinder(_bind, binders[i], prop, piggy);
                }
            });
        },
        bindmodel: function (scope, obj) {
            obj.forEach(function (modelbind) {
                var models = scope.querySelectorAll("[" + modelbind + "]");
                var i, length = models.length,
                        prop;
                for (i = 0; i < length; i += 1) {
                    prop = models[i].getAttribute(modelbind);
                    _private.modelbinder(_model, models[i], prop);
                }




            });
        },
        bindview: function (scope, obj) {
            obj.forEach(function (dataview) {
                var prop, i;
                var viewbinds = scope.querySelectorAll("[" + dataview + "]");
                var length = viewbinds.length;
                for (i = 0; i < length; i += 1) {
                    prop = viewbinds[i].getAttribute(dataview);
                    _private.viewbinder(_view, viewbinds[i], prop);
                }
            });
        },
        bindcss: function (scope, obj) {
            obj.forEach(function (datacss) {
                var prop, i;
                var cssbinds = scope.querySelectorAll("[" + datacss + "]");
                var length = cssbinds.length;
                for (i = 0; i < length; i += 1) {
                    prop = cssbinds[i].getAttribute(datacss);
                    _private.cssbinder(_bind, cssbinds[i], prop);
                }
            });
        },
        bindhref: function (scope, obj) {
            obj.forEach(function (datahref) {
                var prop, i;
                var hrefbinds = scope.querySelectorAll("[" + datahref + "]");
                var length = hrefbinds.length;
                for (i = 0; i < length; i += 1) {
                    prop = hrefbinds[i].getAttribute(datahref);
                    _private.hrefbinder(_bind, hrefbinds[i], prop);
                }
            });
        },
        bind_model_to_data(elem, prop) {
            var elemtype = this.element_type(elem);
            try {
                switch (elemtype) {
                    case 1:
                        elem.addEventListener("keyup", function (event) {
                            _model[prop] = event.target.value;
                            _bind[prop] = _model[prop];
                        });
                        _model[prop] = _bind[prop];
                        break;
                    case 2:
                        elem.addEventListener("change", function (event) {
                            _model[prop] = event.target.checked;
                            _bind[prop] = _model[prop];
                        });
                        _model[prop] = _bind[prop];
                        break;
                    default:
                        throw new Error("element type is not found in");
                        break;

                }
            } catch (e) {
                console.log("error: thrown in method: bind_model_to_data()\n" +
                        "message: " + e.message + "\n" + "line number: " +
                        e.lineNumber + "\n" + "element: " + elem + "\n" + "prop: " + prop);
                alert("An fatal error has occured. Unable to continue!");
            }

        },
        /*-------------------------------------------------------------------------------------
         
         MOUSE ACTIONS AND DISPATCH
         
         Scans page within the scope of the controllers
         and directives for mouse bindings and dispatches
         to the assigned methods.
         
         
         -------------------------------------------------------------------------------------*/

        bindMouseActions: function (scope, controller) {
            _private.mouseActions.forEach(function (datamouse) {
                var evtype, i;
                var mousebinds = scope.querySelectorAll("[" + datamouse + "]");
                var length = mousebinds.length;
                evtype = datamouse.split("-").pop();
                for (i = 0; i < length; i += 1) {
                    mousebinds[i].addEventListener(evtype, _private.eventdispatch, false);
                    mousebinds[i].controller = controller;
                    mousebinds[i].methods = mousebinds[i].getAttribute(datamouse).split(",");
                }
            });
        },
        eventdispatch: function (event) {
            var obj = event.currentTarget;
            if (obj.methods) {
                obj.methods.forEach(function (method) {
                    try {
                        if (typeof _controller[obj.controller][method.trim()] === 'function') {
                            _controller[obj.controller][method.trim()](event);
                        } else {
                            throw new Error("call to unknow method '" + method.trim() + "' in '" + obj.ctrl + "' controller");
                        }
                    } catch (e) {
                        console.log("error: thrown in eventdispatch\n" +
                                "message: " + e.message + "\n" + "line number: " +
                                e.lineNumber + "\n" + "caller: " + method);
                        alert("An fatal error has occured. Unable to continue!");
                    }
                });
            }
        },
        /*-------------------------------------------------------------------------------------
         
         DIGEST NEW CONTENT
         
         Scan newly injected content for new controller and directives
         to intialize them
         
         
         -------------------------------------------------------------------------------------*/

        digest: function (elem, ctrl) {
            var elems, length, i;
            Object.keys(_directive).forEach(function (directive) {
                elems = elem.querySelectorAll("[" + directive + "] , [data-directive=" + directive + "]");
                length = elems.length;
                for (i = 0; i < length; i += 1) {
                    if (elems[i]) {
                        _directive[directive](_directive[directive], elems[i], $);
                    }
                }
            });
            if (ctrl !== undefined) {
                _private.bindMouseActions(elem, ctrl);
                _private.binddata(elem, _private.oDatabind);
                _private.bindhref(elem, _private.oHrefbind);
                _private.bindcss(elem, _private.oCssbind);
                _private.bindmodel(elem, _private.oModelbind);
            }
        },
        /*-------------------------------------------------------------------------------------
         
         AJAX COMMUNICATION LOGIC
         
         Perform the xmlHttpRequest to the back-end
         
         
         -------------------------------------------------------------------------------------*/

        xhrcall: function (xhr) {
            var promise = new Promise(function (resolve, reject) {
                var request = new XMLHttpRequest();
                request.onload = function () {
                    if (request.status === 200) {
                        if (request.responseType === "json") {
                            resolve(request.response);
                            return;
                        }
                        if (xhr.dataType === "json" && !request.responseType) {
                            resolve(JSON.parse(request.responseText));
                            return;
                        } else {
                            resolve(request.responseText);
                            return;
                        }
                    } else {
                        reject(new Error(request.statusText));
                    }
                };
                request.open(xhr.method, xhr.url, true);
                request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                request.responseType = xhr.dataType;
                if (xhr.beforesend && typeof xhr.beforesend === "function") {
                    xhr.beforesend(request);
                }
                request.send(xhr.data);
            });
            return promise;
        },
        /*-------------------------------------------------------------------------------------
         
         EXTENDING THE FRAMEWORK
         
         The framework can be extended with services/plugins that
         may be developed for multiple use.
         
         
         -------------------------------------------------------------------------------------*/

        extend: function () {
            this[arguments[0]] = arguments[1];
        },
        /*-------------------------------------------------------------------------------------
         
         CSS ANIMATION HELPER
         
         Animations through CSS becomes a problem when the target property
         values are unknow. The CSS animation helper calculates the target
         values by quicly changing the state of the element anf back. Returning
         the calculated values.
         
         
         -------------------------------------------------------------------------------------*/

        getCssProperties: function (elem, props, callback, args) {
            var result, name, old = {};
            // store original styles in old
            for (name in props) {
                old[name] = elem.style[name];
                elem.style[name] = props[name];
            }

            result = callback.apply(elem, args || []);
            // Revert to old
            for (name in props) {
                elem.style[name] = old[name];
            }

            return result;
        }

    };
    /*-------------------------------------------------------------------------------------
     
     GLOBAL ROUTER / INITIALIZER
     
     After the page is loaded, it needs to be scanned for attributes and
     controller to initialize. The router will be initialized on the
     document scope and can be reused to intialize on element scope
     to activate injected content.
     
     NOTE:
     
     For initializing local content within the scope of a controller, the
     digest can be used. When larger content is exchanged, teh router must
     be used to also reinitialize the page.
     
     -------------------------------------------------------------------------------------*/

    _global = {
        // router - initializes injected content into the framework
        router: function (element) {

            var scope = element || document;
            _private.binddata(scope, _private.oDatabind);
            _private.bindview(scope, _private.oViewbind);
            _private.bindhref(scope, _private.oHrefbind);
            _private.bindcss(scope, _private.oCssbind);
            _private.bindmodel(scope, _private.oModelbind);
            var _datacontrollers = scope.querySelectorAll("[data-controller]");
            [].forEach.call(_datacontrollers, function (datacrtl) {
                var _datacontroller_attr = datacrtl.getAttribute("data-controller").split(",");
                [].forEach.call(_datacontroller_attr, function (item) {
                    var crtl_attr = item.trim();
                    if (!_controller[crtl_attr]) {
                        alert("Controller " + crtl_attr + " not found!");
                    } else {
                        _controller[crtl_attr].ignite(_controller[crtl_attr], datacrtl, $);
                        _private.bindMouseActions(datacrtl, crtl_attr);
                    }
                });
            });
        }
    };
    /***********************************************************************************************************************************************************
     * ...................... SILLYCAT LOGIC / ENGINE AND METHODS ........................
     * 
     * The $ function is injected into the controller and directives as the third parameter. The $ has no reference to jQuery !!!!
     * 
     * 
     **********************************************************************************************************************************************************/
    var $ = (function () {
        function doCSS(prop, val) {
            if (typeof (prop) === 'string') {
                this.each(function (node) {
                    node.style[prop] = val;
                });
            }
            if (typeof (prop) === 'object') {
                this.each(function (node) {
                    Object.keys(prop).forEach(function (property) {
                        node.style[property] = prop[property];
                    });
                });
            }
            return this;
        }
        //
        function findClosestParent(val) {
            var isSet = Boolean(val);
            if (isSet) {
                var replace = [];
                this.each(function (node) {
                    function find_matching(element) {

                        // if (!Element.prototype.matches) {
                        // Element.prototype.matches =
                        // Element.prototype.matchesSelector ||
                        // Element.prototype.mozMatchesSelector ||
                        // Element.prototype.msMatchesSelector ||
                        // Element.prototype.oMatchesSelector ||
                        // Element.prototype.webkitMatchesSelector ||
                        // function(s) {
                        // var matches = (this.document ||
                        // this.ownerDocument).querySelectorAll(s),
                        // i = matches.length;
                        // while (--i >= 0 && matches.item(i) !== this) {}
                        // return i > -1;
                        // };
                        // }

                        if (element.matches(val)) {
                            replace.push(element);
                        } else {
                            find_matching(element.parentElement);
                        }
                    }
                    find_matching(node);
                });
                this.nodeList = replace;
                return this;
            } else {
                return this;
            }
        }
        //
        function doHTML(val) {
            var isSet = Boolean(val);
            if (isSet) {
                this.each(function (item) {
                    item.innerHTML = val;
                });
                return this;
            } else {
                return this.nodes[0].innerHTML;
            }
        }
        //
        function doVal(val) {
            var isSet = Boolean(val);
            if (isSet) {
                this.each(function (item) {
                    item.value = val;
                });
                return this;
            } else {
                return this.nodes[0].innerHTML;
            }
        }

        function getShapeProperties() {
            var boundRect = this.nodeList[0].getBoundingClientRect();
            boundRect.x = boundRect.x ? boundRect.x : boundRect.left;
            boundRect.y = boundRect.y ? boundRect.y : boundRect.top;
            return boundRect;
        }

        function getNodeList(selector, ctx) {

            var context = ctx || document;
            var pattern = new RegExp(/^(#?[\w-]+|\.[\w-.]+)$/);
            var nodelist;
            if (typeof selector === 'object') {

                return [selector];
            }

            if (typeof selector === 'string') {

                if (pattern.test(selector)) {
                    switch (selector.charAt(0)) {
                        case "#":
                        {
                            nodelist = [document.getElementById(selector.substr(1))];
                            break;
                        }
                        case ".":
                        {
                            nodelist = context.getElementsByClassName(selector.substr(1));
                            break;
                        }
                        default:
                            nodelist = context.getElementsByTagName(selector);
                    }
                } else {
                    // nodelist = context.querySelectorAll(selector);
                }
                return [].slice.call(nodelist);
            }

        }
        //
        // chaining of methods
        return function (selector, context) {
            var element = context || window.document;
            return {
                selector: selector,
                nodeList: getNodeList.call(this, selector, context),
                each: function (action) {
                    [].forEach.call(this.nodeList, function (item, i) {
                        action(item, i);
                    });
                    return this;
                },
                click: function (action) {
                    [].forEach.call(this.nodeList, function (item) {
                        item.addEventListener("click", action, false);
                    });
                    return this;
                },
                toString: function () {
                    return selector;
                },
                css: function (prop, val) {
                    return doCSS.call(this, prop, val);
                },
                html: function (val) {
                    return doHTML.call(this, val);
                },
                val: function (val) {
                    return doVal.call(this, val);
                },
                closest: function (val) {
                    return findClosestParent.call(this, val);
                },
                rect: function () {
                    return getShapeProperties.call(this);
                },
                // Router is taking care of initializing the element that is in
                // scope
                router: function (element) { // controller router
                    var scope = element || window.document;
                    _private.router(scope);
                }
            };
        };
    }());
    /***********************************************************************************************************************************************************
     * .............................. SILLYCAT METHODS ...................................
     * 
     * The $ function is extended with methods that have no reference to html element
     * 
     * 
     **********************************************************************************************************************************************************/
    /**
     * 
     * @param {object}  dest
     * @param {object} source
     * @return {object}
     */
    $.extend = function (dest, source) {
        Object.keys(source).forEach(function (property) {
            if (source[property] && source[property].constructor && source[property].constructor.name === "Object") {
                dest[property] = dest[property] || {};
                $.extend(dest[property], source[property]);
            } else {
                dest[property] = source[property];
            }
        });
        return dest;
    };
    // AJAX XHR FUNCTIONALITY
    $.get = function (obj) {
        var xhr = {
            method: "get",
            dataType: "text"
        };
        if (typeof obj === "object") {
            $.extend(xhr, obj);
        }
        if (typeof obj === "string") {
            $.extend(xhr, {
                url: obj
            });
        }
        var promise = new Promise(function (resolve, reject) {
            resolve(_private.xhrcall(xhr));
            reject(new Error("fail")).then(function (error) {
                console.log(error);
            });
        });
        return promise;
    };
    $.post = function (obj, data) {
        var xhr = {
            method: "post",
            dataType: "text"
        };
        if (typeof obj === "object") {
            $.extend(xhr, obj);
        }
        if (typeof obj === "string") {
            $.extend(xhr, {
                url: obj,
                data: data
            });
        }
        var promise = new Promise(function (resolve, reject) {
            resolve(_private.xhrcall(xhr));
            reject(new Error("fail")).then(function (error) {
                console.log(error);
            });
        });
        return promise;
    };
    // PUSHSTATE BROWSER HISTORY
    $.pushState = function (_popstate, path) {
        var i;
        path = path || window.location.pathname;
        if (_popstate.view === undefined) {
            _popstate.view = {};
            _private.oViewbind.forEach(function (view) {
                var current = document.querySelectorAll('[' + view + ']');
                var attr, length = current.length;
                for (i = 0; i < length; i += 1) {
                    attr = current[i].getAttribute(view);
                    _popstate.view[attr] = current[i].innerHTML;
                }
            });
        }
        _private.oPrivate.reset();
        history.pushState(_popstate, null, path);
    };
    // Data object for communication with back-end
    $.getFormData = function (form) {
        var formData = new FormData(form);
        Object.keys(_formdata).forEach(function (property) {
            formData.append(property, JSON.stringify(_formdata[property]).replace(/"/g, ''));
        });
        return formData;
    };

    $.resetFormData = function () {
        for (var name in _formdata) {
            delete _formdata[name];
        }
    };

    // Router is taking care of initializing the element that is in scope
    $.router = function (element) { // controller router
        var scope = element || window.document;
        _private.router(scope);
    };
    // Feed an element to the cat. Activate a specific controller
    $.digest = function (elem, ctrl) {
        _private.digest(elem, ctrl);
    };
    $.getAutoDimensions = function (elem, options) {

        var options = {
            width: "auto",
            height: "auto"
        }
        var callback = function () {
            return this.offsetHeight;
        }
        return _private.getCssProperties(elem, options, callback);
        // });
    };
    // DELAY
    $.delay = function (time) {
        new Promise(function (resolve) {
            setTimeout(function () {
                resolve(true);
            }, time);
        });
    };
    /***********************************************************************************************************************************************************
     * ................................ DEFINE SILLYCAT ...................................
     * 
     * The SillyCat farame work is first initialized with assigning all the controllers, directives and services. After pageload the controller, dircetives and
     * services are initialized. If a controller is found within the page it is initialized, the rest is dorment.
     * 
     * 
     **********************************************************************************************************************************************************/
    function define_SillyCat() {
        var SillyCat = function () {
            // extend the sillycat object with services
            this.service = function (service, fn) {
                _private.extend.apply($, [service, fn]);
                return;
            };
            // public method controller
            this.controller = function (controller, fn) {
                // ........... START FINDING CONTROLLERS IN THE DOCUMENT
                if (typeof fn === "function") {
                    _controller[controller] = Object.create(_bind);
                    _controller[controller].ignite = fn;
                }
                // add services to the scope of this controller
                if (typeof fn === "object") {
                    var func = fn.pop();
                    _controller[controller] = Object.create(_bind);
                    fn.map(function (service) {
                        _controller[controller][service] = _services[service];
                    });
                    _controller[controller].ignite = func;
                }
            };
            // register directives
            this.directive = function (directive, fn) {
                if (typeof fn === "function") {
                    _directive[directive] = fn;
                }
            };
            return this;
        };
        return SillyCat;
    }
    // initiate directives on pageload
    window.onload = function () {
        $.digest(window.document);
    };
    // ***
    if (typeof (SillyCat) === 'undefined') {
        window.SillyCat = define_SillyCat();
        window.SillyCat_init = _global.router;
        window.$formdata = _formdata;
        window.Silly = new SillyCat();
        window.addEventListener("load", function (event) {
            SillyCat_init();
        });
    } else {
        console.log("SillyCat already defined.");
    }

})(window);