/*!
 *
 * Angle - Bootstrap Admin App + AngularJS
 *
 * Author: @themicon_co
 * Website: http://themicon.co
 * License: http://support.wrapbootstrap.com/knowledge_base/topics/usage-licenses
 *
 */
if (typeof $ === 'undefined') {
    throw new Error('This application\'s JavaScript requires jQuery');
}

// APP START
// -----------------------------------
var App = angular.module('app', [
    'LocalStorageModule',
    'ngRoute',
    'ngAnimate',
    'ngStorage',
    'ngCookies',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
    'oc.lazyLoad',
    'cfp.loadingBar',
    'ngSanitize',
    'ngResource',
    'tmh.dynamicLocale',
    'ui.utils'
]);

App.run(["$rootScope", "$state", '$translate', "$stateParams", '$window', '$templateCache', '$timeout', 'Auth', 'Principal', 'cfpLoadingBar', function ($rootScope, $state, $translate, $stateParams, $window, $templateCache, $timeout, Auth, Principal, cfpLoadingBar) {
    // Set reference to access them from any scope
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$storage = $window.localStorage;

    // Scope Globals
    // -----------------------------------
    $rootScope.app = {
        name: 'Angle',
        description: 'Angular Bootstrap Admin Template',
        year: ((new Date()).getFullYear()),
        layout: {
            isFixed: true,
            isCollapsed: false,
            isBoxed: false,
            isRTL: false,
            horizontal: false,
            isFloat: false,
            asideHover: false,
            theme: null
        },
        useFullLayout: false,
        hiddenFooter: false,
        viewAnimation: 'ng-fadeInUp'
    };

    var updateTitle = function (titleKey) {
        if (!titleKey && $state.$current && $state.$current.title) {
            titleKey = $state.$current.title;
        }
        $translate(titleKey || 'title.global').then(function (title) {
            title = $rootScope.app.name + ' - ' + (title || $rootScope.app.description);
            $window.document.title = title;
        });
    };


    var thBar;
    $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams, fromState, fromParams) {
        $rootScope.toState = toState;
        $rootScope.toStateParams = toStateParams;

        if (Principal.isIdentityResolved()) {
            Auth.authorize();
        }

        if ($('.wrapper > section').length) // check if bar container exists
            thBar = $timeout(function () {
                cfpLoadingBar.start();
            }, 0); // sets a latency Threshold
    });

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

        event.targetScope.$watch("$viewContentLoaded", function () {
            $timeout.cancel(thBar);
            cfpLoadingBar.complete();
        });

        $window.scrollTo(0, 0);
        var titleKey = 'title.global';
        if (toState.name != 'login' && $rootScope.previousStateName) {
            $rootScope.previousStateName = fromState.name;
            $rootScope.previousStateParams = fromParams;
        }

        if (toState.title) {
            titleKey = toState.title;
        }
        updateTitle(titleKey);
    });

    // if the current translation changes, update the window title
    $rootScope.$on('$translateChangeSuccess', function () {
        updateTitle();
    });

    // Hook not found
    $rootScope.$on('$stateNotFound',
        function (event, unfoundState, fromState, fromParams) {
            console.log(unfoundState.to); // "lazy.state"
            console.log(unfoundState.toParams); // {a:1, b:2}
            console.log(unfoundState.options); // {inherit:false} + default options
        });

    // Hook error
    $rootScope.$on('$stateChangeError',
        function (event, toState, toParams, fromState, fromParams, error) {
            console.log(error);
        });

    $rootScope.back = function () {
        // If previous state is 'activate' or do not exist go to 'home'
        if ($rootScope.previousStateName === 'activate' || $state.get($rootScope.previousStateName) === null) {
            $state.go('home');
        } else {
            $state.go($rootScope.previousStateName, $rootScope.previousStateParams);
        }
    };


    $rootScope.user = {
        name: 'Zhaobo',
        job: 'ng-developer',
        picture: 'img/user/02.jpg'
    };
}]);

/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/

App
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('site', {
                'abstract': true,
                resolve: {
                    authorize: ['Auth',
                        function (Auth) {
                            return Auth.authorize();
                        }
                    ],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('global');
                    }]
                }
            })
            .state('account', {
                abstract: true,
                parent: 'site'
            });
    }])
    .config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider', function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        'use strict';

        // Set the following to true to enable the HTML5 Mode
        // You may have to set <base> tag in index and a routing configuration in your server
        $locationProvider.html5Mode(false);

        // defaults to dashboard
        $urlRouterProvider.otherwise('/app/index');

        $stateProvider
            .state('app', {
                parent: 'account',
                url: '/app',
                abstract: true,
                templateUrl: helper.basepath('app.html'),
                controller: 'AppController',
                resolve: {
                    //RouteHelpers: ['fastclick', 'modernizr', 'icons', 'screenfull', helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull')],
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('sidbar');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.index', {
                url: '/index',
                title: 'index',
                data: {
                    authorities: ['ROLE_ADMIN']
                },
                controller: function () {
                    console.info('index')
                },
                templateUrl: helper.basepath('index.html')
            }).state('page', {
                url: '/page',
                templateUrl: 'app/pages/page.html',
                resolve: helper.resolveFor('modernizr', 'icons'),
                controller: ["$rootScope", function ($rootScope) {
                    $rootScope.app.layout.isBoxed = false;
                }]
            }).state('page.lock', {
                url: '/lock',
                title: "Lock",
                templateUrl: 'app/pages/lock.html'
            }).state('page.login', {
                url: '/login',
                title: "title.login",
                data: {
                    authorities: []
                },
                templateUrl: 'app/pages/login.html'
            }).state('page.404', {
                url: '/404',
                title: "Not Found",
                templateUrl: 'app/pages/404.html'
            }).state('page.register', {
                url: '/register',
                title: "Register",
                templateUrl: 'app/pages/register.html'
            })
            .state('page.recover', {
                url: '/recover',
                title: "Recover",
                templateUrl: 'app/pages/recover.html'
            })
            .state('error', {
                parent: 'page',
                url: '/error',
                title: 'title.error',
                data: {
                    authorities: []
                },
                templateUrl: '/app/pages/error.html',
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('error');
                        return $translate.refresh();
                    }]
                }
            })
            .state('accessdenied', {
                parent: 'page',
                url: '/accessdenied',
                data: {
                    authorities: []
                },
                templateUrl: '/app/pages/accessdenied.html',
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('error');
                        return $translate.refresh();
                    }]
                }
            });

    }]).config(['$ocLazyLoadProvider', 'APP_REQUIRES', function ($ocLazyLoadProvider, APP_REQUIRES) {
        'use strict';

        // Lazy Load modules configuration
        $ocLazyLoadProvider.config({
            debug: false,
            events: true,
            modules: APP_REQUIRES.modules
        });

    }])
    .config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
        function ($controllerProvider, $compileProvider, $filterProvider, $provide) {
            'use strict';
            // registering components after bootstrap
            App.controller = $controllerProvider.register;
            App.directive = $compileProvider.directive;
            App.filter = $filterProvider.register;
            App.factory = $provide.factory;
            App.service = $provide.service;
            App.constant = $provide.constant;
            App.value = $provide.value;

        }])
    .config(['$translateProvider', 'tmhDynamicLocaleProvider', function ($translateProvider, tmhDynamicLocaleProvider) {

        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: 'i18n/{lang}/{part}.json'
        });

        $translateProvider.preferredLanguage('en');
        $translateProvider.useCookieStorage();
        $translateProvider.useSanitizeValueStrategy('escaped');
        $translateProvider.addInterpolation('$translateMessageFormatInterpolation');

        tmhDynamicLocaleProvider.localeLocationPattern('/webjars/angular-i18n/1.5.2/angular-locale_{{locale}}.js');
        tmhDynamicLocaleProvider.useCookieStorage();
        tmhDynamicLocaleProvider.storageKey('NG_TRANSLATE_LANG_KEY');

    }]);


/**=========================================================
 * Module: toggle-state.js
 * Services to share toggle state functionality
 =========================================================*/

App.service('toggleStateService', ['$rootScope', function ($rootScope) {

    var storageKeyName = 'toggleState';

    // Helper object to check for words in a phrase //
    var WordChecker = {
        hasWord: function (phrase, word) {
            return new RegExp('(^|\\s)' + word + '(\\s|$)').test(phrase);
        },
        addWord: function (phrase, word) {
            if (!this.hasWord(phrase, word)) {
                return (phrase + (phrase ? ' ' : '') + word);
            }
        },
        removeWord: function (phrase, word) {
            if (this.hasWord(phrase, word)) {
                return phrase.replace(new RegExp('(^|\\s)*' + word + '(\\s|$)*', 'g'), '');
            }
        }
    };

    // Return service public methods
    return {
        // Add a state to the browser storage to be restored later
        addState: function (classname) {
            var data = angular.fromJson($rootScope.$storage[storageKeyName]);

            if (!data) {
                data = classname;
            }
            else {
                data = WordChecker.addWord(data, classname);
            }

            $rootScope.$storage[storageKeyName] = angular.toJson(data);
        },

        // Remove a state from the browser storage
        removeState: function (classname) {
            var data = $rootScope.$storage[storageKeyName];
            // nothing to remove
            if (!data) return;

            data = WordChecker.removeWord(data, classname);

            $rootScope.$storage[storageKeyName] = angular.toJson(data);
        },

        // Load the state string and restore the classlist
        restoreState: function ($elem) {
            var data = angular.fromJson($rootScope.$storage[storageKeyName]);

            // nothing to restore
            if (!data) return;
            $elem.addClass(data);
        }

    };

}]);


/**=========================================================
 * Module: browser.js
 * Browser detection
 =========================================================*/

App.service('browser', function () {
    "use strict";

    var matched, browser;

    var uaMatch = function (ua) {
        ua = ua.toLowerCase();

        var match = /(opr)[\/]([\w.]+)/.exec(ua) ||
            /(chrome)[ \/]([\w.]+)/.exec(ua) ||
            /(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(ua) ||
            /(webkit)[ \/]([\w.]+)/.exec(ua) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
            /(msie) ([\w.]+)/.exec(ua) ||
            ua.indexOf("trident") >= 0 && /(rv)(?::| )([\w.]+)/.exec(ua) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
            [];

        var platform_match = /(ipad)/.exec(ua) ||
            /(iphone)/.exec(ua) ||
            /(android)/.exec(ua) ||
            /(windows phone)/.exec(ua) ||
            /(win)/.exec(ua) ||
            /(mac)/.exec(ua) ||
            /(linux)/.exec(ua) ||
            /(cros)/i.exec(ua) ||
            [];

        return {
            browser: match[3] || match[1] || "",
            version: match[2] || "0",
            platform: platform_match[0] || ""
        };
    };

    matched = uaMatch(window.navigator.userAgent);
    browser = {};

    if (matched.browser) {
        browser[matched.browser] = true;
        browser.version = matched.version;
        browser.versionNumber = parseInt(matched.version);
    }

    if (matched.platform) {
        browser[matched.platform] = true;
    }

    // These are all considered mobile platforms, meaning they run a mobile browser
    if (browser.android || browser.ipad || browser.iphone || browser["windows phone"]) {
        browser.mobile = true;
    }

    // These are all considered desktop platforms, meaning they run a desktop browser
    if (browser.cros || browser.mac || browser.linux || browser.win) {
        browser.desktop = true;
    }

    // Chrome, Opera 15+ and Safari are webkit based browsers
    if (browser.chrome || browser.opr || browser.safari) {
        browser.webkit = true;
    }

    // IE11 has a new token so we will assign it msie to avoid breaking changes
    if (browser.rv) {
        var ie = "msie";

        matched.browser = ie;
        browser[ie] = true;
    }

    // Opera 15+ are identified as opr
    if (browser.opr) {
        var opera = "opera";

        matched.browser = opera;
        browser[opera] = true;
    }

    // Stock Android browsers are marked as Safari on Android.
    if (browser.safari && browser.android) {
        var android = "android";

        matched.browser = android;
        browser[android] = true;
    }

    // Assign the name and platform variable
    browser.name = matched.browser;
    browser.platform = matched.platform;


    return browser;

});


/**=========================================================
 * Module: colors.js
 * Services to retrieve global colors
 =========================================================*/

App.factory('colors', ['APP_COLORS', function (colors) {

    return {
        byName: function (name) {
            return (colors[name] || '#fff');
        }
    };

}]);

/**=========================================================
 * Module: main.js
 * Main Application Controller
 =========================================================*/
App.controller('AppController',
    ['$rootScope', '$scope', '$state', '$translate', '$window', '$localStorage', '$timeout', 'toggleStateService', 'colors', 'browser', 'cfpLoadingBar',
        function ($rootScope, $scope, $state, $translate, $window, $localStorage, $timeout, toggle, colors, browser, cfpLoadingBar) {
            "use strict";
            $rootScope.app.layout.horizontal = ( $rootScope.$stateParams.layout == 'app-h');

            $rootScope.$watch('app.layout.isCollapsed', function (newValue, oldValue) {
                if (newValue === false)
                    $rootScope.$broadcast('closeSidebarMenu');
            });

            if (angular.isDefined($localStorage.layout))
                $scope.app.layout = $localStorage.layout;
            else
                $localStorage.layout = $scope.app.layout;

            $rootScope.$watch("app.layout", function () {
                $localStorage.layout = $scope.app.layout;
            }, true);

            $scope.colorByName = colors.byName;

            $scope.toggleUserBlock = function () {
                $scope.$broadcast('toggleUserBlock');
            };

            $scope.language = {
                listIsOpen: false,
                available: {
                    'en': 'English',
                    'es_AR': 'Español'
                },
                init: function () {
                    var proposedLanguage = $translate.proposedLanguage() || $translate.use();
                    var preferredLanguage = $translate.preferredLanguage(); // we know we have set a preferred one in app.config
                    $scope.language.selected = $scope.language.available[(proposedLanguage || preferredLanguage)];
                },
                set: function (localeId, ev) {
                    $translate.use(localeId);
                    $scope.language.selected = $scope.language.available[localeId];
                    $scope.language.listIsOpen = !$scope.language.listIsOpen;
                }
            };

            $scope.language.init();

            toggle.restoreState($(document.body));

            $rootScope.cancel = function ($event) {
                $event.stopPropagation();
            };
        }
    ]);


App
    .constant('APP_COLORS', {
        'primary': '#5d9cec',
        'success': '#27c24c',
        'info': '#23b7e5',
        'warning': '#ff902b',
        'danger': '#f05050',
        'inverse': '#131e26',
        'green': '#37bc9b',
        'pink': '#f532e5',
        'purple': '#7266ba',
        'dark': '#3a3f51',
        'yellow': '#fad732',
        'gray-darker': '#232735',
        'gray-dark': '#3a3f51',
        'gray': '#dde6e9',
        'gray-light': '#e4eaec',
        'gray-lighter': '#edf1f2'
    })
    .constant('APP_MEDIAQUERY', {
        'desktopLG': 1200,
        'desktop': 992,
        'tablet': 768,
        'mobile': 480
    })
    .constant('APP_REQUIRES', {
        scripts: {
            'sparklines': ['/webjars/jquery.sparkline/2.1.2/jquery.sparkline.min.js'],
            'screenfull': ['/webjars/screenfulljs/1.1.0/screenfull.min.js'],
            'fastclick': ['/webjars/fastclick/1.0.6/fastclick.js'],
            'modernizr': ['/webjars/modernizr/2.8.3/modernizr.min.js'],
            'icons': ['vendor/skycons/skycons.js',
                '/webjars/font-awesome/4.5.0/css/font-awesome.min.css',
                'vendor/simple-line-icons/css/simple-line-icons.css',
                '/webjars/weather-icons/1.3.2/css/weather-icons.min.css']
        },
        // Angular based script (use the right module name)
        modules: []
    })
;

/**=========================================================
 * Module: helpers.js
 * Provides helper functions for routes definition
 =========================================================*/

App.provider('RouteHelpers', ['APP_REQUIRES', function (appRequires) {
    "use strict";

    // Set here the base of the relative path
    // for all app views
    this.basepath = function (uri) {
        return 'app/views/' + uri;
    };

    // Generates a resolve object by passing script names
    // previously configured in constant.APP_REQUIRES
    this.resolveFor = function () {
        var _args = arguments;
        return {
            deps: ['$ocLazyLoad', '$q', function ($ocLL, $q) {
                // Creates a promise chain for each argument
                var promise = $q.when(1); // empty promise
                for (var i = 0, len = _args.length; i < len; i++) {
                    promise = andThen(_args[i]);
                }
                return promise;

                // creates promise to chain dynamically
                function andThen(_arg) {
                    // also support a function that returns a promise
                    if (typeof _arg == 'function')
                        return promise.then(_arg);
                    else
                        return promise.then(function () {
                            // if is a module, pass the name. If not, pass the array
                            var whatToLoad = getRequired(_arg);
                            // simple error check
                            if (!whatToLoad) return $.error('Route resolve: Bad resource name [' + _arg + ']');
                            // finally, return a promise
                            return $ocLL.load(whatToLoad);
                        });
                }

                // check and returns required data
                // analyze module items with the form [name: '', files: []]
                // and also simple array of script files (for not angular js)
                function getRequired(name) {
                    if (appRequires.modules)
                        for (var m in appRequires.modules)
                            if (appRequires.modules[m].name && appRequires.modules[m].name === name)
                                return appRequires.modules[m];
                    return appRequires.scripts && appRequires.scripts[name];
                }

            }]
        };
    }; // resolveFor

    // not necessary, only used in config block for routes
    this.$get = function () {
        return {
            basepath: this.basepath
        }
    };

}]);


/**=========================================================
 * Module: sidebar-menu.js
 * Handle sidebar collapsible elements
 =========================================================*/

App.controller('SidebarController', ['$rootScope', '$scope', '$state', '$http', '$timeout', 'Utils',
    function ($rootScope, $scope, $state, $http, $timeout, Utils) {

        var collapseList = [];

        // demo: when switch from collapse to hover, close all items
        $rootScope.$watch('app.layout.asideHover', function (oldVal, newVal) {
            if (newVal === false && oldVal === true) {
                closeAllBut(-1);
            }
        });

        // Check item and children active state
        var isActive = function (item) {

            if (!item) return;

            if (!item.sref || item.sref == '#') {
                var foundActive = false;
                angular.forEach(item.submenu, function (value, key) {
                    if (isActive(value)) foundActive = true;
                });
                return foundActive;
            }
            else
                return $state.is(item.sref) || $state.includes(item.sref);
        };

        // Load menu from json file
        // -----------------------------------

        $scope.getMenuItemPropClasses = function (item) {
            return (item.heading ? 'nav-heading' : '') +
                (isActive(item) ? ' active' : '');
        };

        $scope.loadSidebarMenu = function () {

            var menuJson = 'server/sidebar-menu.json',
                menuURL = menuJson + '?v=' + (new Date().getTime()); // jumps cache
            $http.get(menuURL)
                .success(function (items) {
                    $scope.menuItems = items;
                })
                .error(function (data, status, headers, config) {
                    alert('Failure loading menu');
                });
        };

        $scope.loadSidebarMenu();

        // Handle sidebar collapse items
        // -----------------------------------

        $scope.addCollapse = function ($index, item) {
            collapseList[$index] = $rootScope.app.layout.asideHover ? true : !isActive(item);
        };

        $scope.isCollapse = function ($index) {
            return (collapseList[$index]);
        };

        $scope.toggleCollapse = function ($index, isParentItem) {


            // collapsed sidebar doesn't toggle drodopwn
            if (Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover) return true;

            // make sure the item index exists
            if (angular.isDefined(collapseList[$index])) {
                if (!$scope.lastEventFromChild) {
                    collapseList[$index] = !collapseList[$index];
                    closeAllBut($index);
                }
            }
            else if (isParentItem) {
                closeAllBut(-1);
            }

            $scope.lastEventFromChild = isChild($index);

            return true;

        };

        function closeAllBut(index) {
            index += '';
            for (var i in collapseList) {
                if (index < 0 || index.indexOf(i) < 0)
                    collapseList[i] = true;
            }
        }

        function isChild($index) {
            return (typeof $index === 'string') && !($index.indexOf('-') < 0);
        }

    }]);


/**=========================================================
 * Module: utils.js
 * Utility library to use across the theme
 =========================================================*/

App.service('Utils', ["$window", "APP_MEDIAQUERY", function ($window, APP_MEDIAQUERY) {
    'use strict';

    var $html = angular.element("html"),
        $win = angular.element($window),
        $body = angular.element('body');

    return {
        // DETECTION
        support: {
            transition: (function () {
                var transitionEnd = (function () {

                    var element = document.body || document.documentElement,
                        transEndEventNames = {
                            WebkitTransition: 'webkitTransitionEnd',
                            MozTransition: 'transitionend',
                            OTransition: 'oTransitionEnd otransitionend',
                            transition: 'transitionend'
                        }, name;

                    for (name in transEndEventNames) {
                        if (element.style[name] !== undefined) return transEndEventNames[name];
                    }
                }());

                return transitionEnd && {end: transitionEnd};
            })(),
            animation: (function () {

                var animationEnd = (function () {

                    var element = document.body || document.documentElement,
                        animEndEventNames = {
                            WebkitAnimation: 'webkitAnimationEnd',
                            MozAnimation: 'animationend',
                            OAnimation: 'oAnimationEnd oanimationend',
                            animation: 'animationend'
                        }, name;

                    for (name in animEndEventNames) {
                        if (element.style[name] !== undefined) return animEndEventNames[name];
                    }
                }());

                return animationEnd && {end: animationEnd};
            })(),
            requestAnimationFrame: window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            },
            touch: (
                ('ontouchstart' in window && navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
                (window.DocumentTouch && document instanceof window.DocumentTouch) ||
                (window.navigator['msPointerEnabled'] && window.navigator['msMaxTouchPoints'] > 0) || //IE 10
                (window.navigator['pointerEnabled'] && window.navigator['maxTouchPoints'] > 0) || //IE >=11
                false
            ),
            mutationobserver: (window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || null)
        },
        // UTILITIES
        isInView: function (element, options) {

            var $element = $(element);

            if (!$element.is(':visible')) {
                return false;
            }

            var window_left = $win.scrollLeft(),
                window_top = $win.scrollTop(),
                offset = $element.offset(),
                left = offset.left,
                top = offset.top;

            options = $.extend({topoffset: 0, leftoffset: 0}, options);

            if (top + $element.height() >= window_top && top - options.topoffset <= window_top + $win.height() &&
                left + $element.width() >= window_left && left - options.leftoffset <= window_left + $win.width()) {
                return true;
            } else {
                return false;
            }
        },
        langdirection: $html.attr("dir") == "rtl" ? "right" : "left",
        isTouch: function () {
            return $html.hasClass('touch');
        },
        isSidebarCollapsed: function () {
            return $body.hasClass('aside-collapsed');
        },
        isSidebarToggled: function () {
            return $body.hasClass('aside-toggled');
        },
        isMobile: function () {
            return $win.width() < APP_MEDIAQUERY.tablet;
        }
    };
}]);


/**=========================================================
 * Module: 头像显示隐藏.js
 * Wraps the sidebar and handles collapsed state
 =========================================================*/
App.controller('UserBlockController', ['$scope', function ($scope) {

    $scope.userBlockVisible = true;

    $scope.$on('toggleUserBlock', function (event, args) {

        $scope.userBlockVisible = !$scope.userBlockVisible;

    });

}]);


/**=========================================================
 * Module: sidebar.js
 * Wraps the sidebar and handles collapsed state
 =========================================================*/

App.directive('sidebar', ['$rootScope', '$window', 'Utils', function ($rootScope, $window, Utils) {

    var $win = $($window);
    var $body = $('body');
    var $scope;
    var $sidebar;
    var currentState = $rootScope.$state.current.name;

    return {
        restrict: 'EA',
        template: '<nav class="sidebar" ng-transclude></nav>',
        transclude: true,
        replace: true,
        link: function (scope, element, attrs) {

            $scope = scope;
            $sidebar = element;

            var eventName = Utils.isTouch() ? 'click' : 'mouseenter';
            var subNav = $();
            $sidebar.on(eventName, '.nav > li', function () {

                if (Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover) {

                    subNav.trigger('mouseleave');
                    subNav = toggleMenuItem($(this));

                    // Used to detect click and touch events outside the sidebar
                    sidebarAddBackdrop();

                }

            });

            scope.$on('closeSidebarMenu', function () {
                removeFloatingNav();
            });

            // Normalize state when resize to mobile
            $win.on('resize', function () {
                if (!Utils.isMobile())
                    $body.removeClass('aside-toggled');
            });

            // Adjustment on route changes
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                currentState = toState.name;
                // Hide sidebar automatically on mobile
                $('body.aside-toggled').removeClass('aside-toggled');

                $rootScope.$broadcast('closeSidebarMenu');
            });

            // Allows to close
            if (angular.isDefined(attrs.sidebarAnyclickClose)) {

                $('.wrapper').on('click.sidebar', function (e) {
                    // don't check if sidebar not visible
                    if (!$body.hasClass('aside-toggled')) return;

                    // if not child of sidebar
                    if (!$(e.target).parents('.aside').length) {
                        $body.removeClass('aside-toggled');
                    }

                });
            }

        }
    };

    function sidebarAddBackdrop() {
        var $backdrop = $('<div/>', {'class': 'dropdown-backdrop'});
        $backdrop.insertAfter('.aside-inner').on("click mouseenter", function () {
            removeFloatingNav();
        });
    }

    // Open the collapse sidebar submenu items when on touch devices
    // - desktop only opens on hover
    function toggleTouchItem($element) {
        $element
            .siblings('li')
            .removeClass('open')
            .end()
            .toggleClass('open');
    }

    // Handles hover to open items under collapsed menu
    // -----------------------------------
    function toggleMenuItem($listItem) {

        removeFloatingNav();

        var ul = $listItem.children('ul');

        if (!ul.length) return $();
        if ($listItem.hasClass('open')) {
            toggleTouchItem($listItem);
            return $();
        }

        var $aside = $('.aside');
        var $asideInner = $('.aside-inner'); // for top offset calculation
        // float aside uses extra padding on aside
        var mar = parseInt($asideInner.css('padding-top'), 0) + parseInt($aside.css('padding-top'), 0);
        var subNav = ul.clone().appendTo($aside);

        toggleTouchItem($listItem);

        var itemTop = ($listItem.position().top + mar) - $sidebar.scrollTop();
        var vwHeight = $win.height();

        subNav
            .addClass('nav-floating')
            .css({
                position: $scope.app.layout.isFixed ? 'fixed' : 'absolute',
                top: itemTop,
                bottom: (subNav.outerHeight(true) + itemTop > vwHeight) ? 0 : 'auto'
            });

        subNav.on('mouseleave', function () {
            toggleTouchItem($listItem);
            subNav.remove();
        });

        return subNav;
    }

    function removeFloatingNav() {
        $('.dropdown-backdrop').remove();
        $('.sidebar-subnav.nav-floating').remove();
        $('.sidebar li.open').removeClass('open');
    }

}]);

/**=========================================================
 * Module: fullscreen.js
 * Toggle the fullscreen mode on/off
 =========================================================*/
App.directive('toggleFullscreen', function () {
    'use strict';

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            element.on('click', function (e) {
                e.preventDefault();

                if (screenfull.enabled) {

                    screenfull.toggle();

                    // Switch icon indicator
                    if (screenfull.isFullscreen)
                        $(this).children('em').removeClass('fa-expand').addClass('fa-compress');
                    else
                        $(this).children('em').removeClass('fa-compress').addClass('fa-expand');

                } else {
                    $.error('Fullscreen not enabled');
                }

            });
        }
    };

});


/**=========================================================
 * Module: toggle-state.js
 * Toggle a classname from the BODY Useful to change a state that
 * affects globally the entire layout or more than one item
 * Targeted elements must have [toggle-state="CLASS-NAME-TO-TOGGLE"]
 * User no-persist to avoid saving the sate in browser storage
 =========================================================*/

App.directive('toggleState', ['toggleStateService', function (toggle) {
    'use strict';

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            var $body = $('body');

            $(element)
                .on('click', function (e) {
                    e.preventDefault();
                    var classname = attrs.toggleState;

                    if (classname) {
                        if ($body.hasClass(classname)) {
                            $body.removeClass(classname);
                            if (!attrs.noPersist)
                                toggle.removeState(classname);
                        }
                        else {
                            $body.addClass(classname);
                            if (!attrs.noPersist)
                                toggle.addState(classname);
                        }

                    }

                });
        }
    };

}]);


/**=========================================================
 * Module: access-login.js
 * Demo for login api
 =========================================================*/

App.controller('LoginFormController', ['$scope', '$http', '$state', function ($scope, $http, $state) {

    // bind here all data from the form
    $scope.account = {};
    // place the message if something goes wrong
    $scope.authMsg = '';

    $scope.login = function () {
        $scope.authMsg = '';

        if ($scope.loginForm.$valid) {

            $http
                .post('api/account/login', {email: $scope.account.email, password: $scope.account.password})
                .then(function (response) {
                    // assumes if ok, response is an object with some data, if not, a string with error
                    // customize according to your api
                    if (!response.account) {
                        $scope.authMsg = 'Incorrect credentials.';
                    } else {
                        $state.go('app.dashboard');
                    }
                }, function (x) {
                    $scope.authMsg = 'Server Request Error';
                });
        }
        else {
            // set as dirty if the user click directly to login so we show the validation messages
            $scope.loginForm.account_email.$dirty = true;
            $scope.loginForm.account_password.$dirty = true;
        }
    };

}]);


/**=========================================================
 * Module: access-register.js
 * Demo for register account api
 =========================================================*/

App.controller('RegisterFormController', ['$scope', '$http', '$state', function ($scope, $http, $state) {

    // bind here all data from the form
    $scope.account = {};
    // place the message if something goes wrong
    $scope.authMsg = '';

    $scope.register = function () {
        $scope.authMsg = '';

        if ($scope.registerForm.$valid) {

            $http
                .post('api/account/register', {email: $scope.account.email, password: $scope.account.password})
                .then(function (response) {
                    // assumes if ok, response is an object with some data, if not, a string with error
                    // customize according to your api
                    if (!response.account) {
                        $scope.authMsg = response;
                    } else {
                        $state.go('app.dashboard');
                    }
                }, function (x) {
                    $scope.authMsg = 'Server Request Error';
                });
        }
        else {
            // set as dirty if the user click directly to login so we show the validation messages
            $scope.registerForm.account_email.$dirty = true;
            $scope.registerForm.account_password.$dirty = true;
            $scope.registerForm.account_agreed.$dirty = true;

        }
    };

}]);












