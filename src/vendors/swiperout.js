/*===============================================================================
************   Swipeout Actions (Swipe to delete)   ************
===============================================================================*/
/*===========================
Framework 7
===========================*/
window.Framework7 = function (params) {
    // App
    var app = this;

    // Version
    app.version = '1.5.0';

    // Default Parameters
    app.params = {
        //
        root: 'body',
        //
        cache: true,
        cacheIgnore: [],
        cacheIgnoreGetParameters: false,
        cacheDuration: 1000 * 60 * 10, // Ten minutes
        preloadPreviousPage: true,
        uniqueHistory: false,
        uniqueHistoryIgnoreGetParameters: false,
        dynamicPageUrl: 'content-{{index}}',
        allowDuplicateUrls: false,
        router: true,
        routerRemoveTimeout: false,
        routerRemoveWithTimeout: false,
        // Push State
        pushState: false,
        pushStateRoot: undefined,
        pushStateNoAnimation: false,
        pushStateSeparator: '#!/',
        pushStateOnLoad: true,
        // Fast clicks
        fastClicks: true,
        fastClicksDistanceThreshold: 10,
        fastClicksDelayBetweenClicks: 50,
        fastClicksExclude: '', // CSS selector
        // Tap Hold
        tapHold: false,
        tapHoldDelay: 750,
        tapHoldPreventClicks: true,
        // Active State
        activeState: true,
        activeStateElements: 'a, button, label, span',
        // Animate Nav Back Icon
        animateNavBackIcon: false,
        // Swipe Back
        swipeBackPage: true,
        swipeBackPageThreshold: 0,
        swipeBackPageActiveArea: 30,
        swipeBackPageAnimateShadow: true,
        swipeBackPageAnimateOpacity: true,
        // Ajax
        ajaxLinks: undefined, // or CSS selector
        // External Links
        externalLinks: '.external', // CSS selector
        // Sortable
        sortable: true,
        // Scroll toolbars
        hideNavbarOnPageScroll: false,
        hideToolbarOnPageScroll: false,
        hideTabbarOnPageScroll: false,
        showBarsOnPageScrollEnd: true,
        showBarsOnPageScrollTop: true,
        // Swipeout
        swipeout: true,
        swipeoutActionsNoFold: false,
        swipeoutNoFollow: false,
        swipeoutRemoveWithTimeout: false,
        // Smart Select Back link template
        smartSelectOpenIn: 'page', // or 'popup' or 'picker'
        smartSelectBackText: 'Back',
        smartSelectPopupCloseText: 'Close',
        smartSelectPickerCloseText: 'Done',
        smartSelectSearchbar: false,
        smartSelectBackOnSelect: false,
        // Tap Navbar or Statusbar to scroll to top
        scrollTopOnNavbarClick: false,
        scrollTopOnStatusbarClick: false,
        // Panels
        swipePanel: false, // or 'left' or 'right'
        swipePanelActiveArea: 0,
        swipePanelCloseOpposite: true,
        swipePanelOnlyClose: false,
        swipePanelNoFollow: false,
        swipePanelThreshold: 0,
        panelsCloseByOutside: true,
        // Modals
        modalButtonOk: 'OK',
        modalButtonCancel: 'Cancel',
        modalUsernamePlaceholder: 'Username',
        modalPasswordPlaceholder: 'Password',
        modalTitle: 'Framework7',
        modalCloseByOutside: false,
        actionsCloseByOutside: true,
        popupCloseByOutside: true,
        modalPreloaderTitle: 'Loading... ',
        modalStack: true,
        // Lazy Load
        imagesLazyLoadThreshold: 0,
        imagesLazyLoadSequential: true,
        // Name space
        viewClass: 'view',
        viewMainClass: 'view-main',
        viewsClass: 'views',
        // Notifications defaults
        notificationCloseOnClick: false,
        notificationCloseIcon: true,
        notificationCloseButtonText: 'Close',
        // Animate Pages
        animatePages: true,
        // Template7
        templates: {},
        template7Data: {},
        template7Pages: false,
        precompileTemplates: false,
        // Material
        material: false,
        materialPageLoadDelay: 0,
        materialPreloaderSvg: '<svg xmlns="http://www.w3.org/2000/svg" height="75" width="75" viewbox="0 0 75 75"><circle cx="37.5" cy="37.5" r="33.5" stroke-width="8"/></svg>',
        materialPreloaderHtml:
            '<span class="preloader-inner">' +
                '<span class="preloader-inner-gap"></span>' +
                '<span class="preloader-inner-left">' +
                    '<span class="preloader-inner-half-circle"></span>' +
                '</span>' +
                '<span class="preloader-inner-right">' +
                    '<span class="preloader-inner-half-circle"></span>' +
                '</span>' +
            '</span>',
        materialRipple: true,
        materialRippleElements: '.ripple, a.link, a.item-link, .button, .modal-button, .tab-link, .label-radio, .label-checkbox, .actions-modal-button, a.searchbar-clear, a.floating-button, .floating-button > a, .speed-dial-buttons a',
        // Auto init
        init: true,
    };

    // Extend defaults with parameters
    for (var param in params) {
        app.params[param] = params[param];
    }

    // DOM lib
    // var $ = Dom7;

    // Template7 lib
    // var t7 = Template7;
    app._compiledTemplates = {};

    // App Root
    app.root = $(app.params.root);
    app.root.eq(0).addClass('framework7-root');

    // Touch events
    app.touchEvents = {
        start: app.support.touch ? 'touchstart' : 'mousedown',
        move: app.support.touch ? 'touchmove' : 'mousemove',
        end: app.support.touch ? 'touchend' : 'mouseup'
    };

    // Link to local storage
    app.ls = window.localStorage;

    // RTL
    app.rtl = $('body').css('direction') === 'rtl';
    if (app.rtl) $('html').attr('dir', 'rtl');

    // Overwrite statusbar overlay
    if (typeof app.params.statusbarOverlay !== 'undefined') {
        if (app.params.statusbarOverlay) $('html').addClass('with-statusbar-overlay');
        else $('html').removeClass('with-statusbar-overlay');
    }
app.swipeoutOpenedEl = undefined;
app.allowSwipeout = true;
app.initSwipeout = function (swipeoutEl) {
    var isTouched, isMoved, isScrolling, touchesStart = {}, touchStartTime, touchesDiff, swipeOutEl, swipeOutContent, actionsRight, actionsLeft, actionsLeftWidth, actionsRightWidth, translate, opened, openedActions, buttonsLeft, buttonsRight, direction, overswipeLeftButton, overswipeRightButton, overswipeLeft, overswipeRight, noFoldLeft, noFoldRight;
    $(document).on(app.touchEvents.start, function (e) {
        if (app.swipeoutOpenedEl) {
            var target = $(e.target);
            if (!(
                app.swipeoutOpenedEl.is(target[0]) ||
                target.parents('.swipeout').is(app.swipeoutOpenedEl) ||
                target.hasClass('modal-in') ||
                target.hasClass('modal-overlay') ||
                target.hasClass('actions-modal') ||
                target.parents('.actions-modal.modal-in, .modal.modal-in').length > 0
                )) {
                app.swipeoutClose(app.swipeoutOpenedEl);
            }
        }
    });

    function handleTouchStart(e) {
        if (!app.allowSwipeout) return;
        isMoved = false;
        isTouched = true;
        isScrolling = undefined;
        touchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
        touchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
        touchStartTime = (new Date()).getTime();
    }
    function handleTouchMove(e) {
        if (!isTouched) return;
        var pageX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
        var pageY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
        if (typeof isScrolling === 'undefined') {
            isScrolling = !!(isScrolling || Math.abs(pageY - touchesStart.y) > Math.abs(pageX - touchesStart.x));
        }
        if (isScrolling) {
            isTouched = false;
            return;
        }

        if (!isMoved) {
            if ($('.list-block.sortable-opened').length > 0) return;
            /*jshint validthis:true */
            swipeOutEl = $(this);
            swipeOutContent = swipeOutEl.find('.swipeout-content');
            actionsRight = swipeOutEl.find('.swipeout-actions-right');
            actionsLeft = swipeOutEl.find('.swipeout-actions-left');
            actionsLeftWidth = actionsRightWidth = buttonsLeft = buttonsRight = overswipeRightButton = overswipeLeftButton = null;
            noFoldLeft = actionsLeft.hasClass('swipeout-actions-no-fold') || app.params.swipeoutActionsNoFold;
            noFoldRight = actionsRight.hasClass('swipeout-actions-no-fold') || app.params.swipeoutActionsNoFold;
            if (actionsLeft.length > 0) {
                actionsLeftWidth = actionsLeft.outerWidth();
                buttonsLeft = actionsLeft.children('a');
                overswipeLeftButton = actionsLeft.find('.swipeout-overswipe');
            }
            if (actionsRight.length > 0) {
                actionsRightWidth = actionsRight.outerWidth();
                buttonsRight = actionsRight.children('a');
                overswipeRightButton = actionsRight.find('.swipeout-overswipe');
            }
            opened = swipeOutEl.hasClass('swipeout-opened');
            if (opened) {
                openedActions = swipeOutEl.find('.swipeout-actions-left.swipeout-actions-opened').length > 0 ? 'left' : 'right';
            }
            swipeOutEl.removeClass('transitioning');
            if (!app.params.swipeoutNoFollow) {
                swipeOutEl.find('.swipeout-actions-opened').removeClass('swipeout-actions-opened');
                swipeOutEl.removeClass('swipeout-opened');
            }
        }
        isMoved = true;
        e.preventDefault();

        touchesDiff = pageX - touchesStart.x;
        translate = touchesDiff;

        if (opened) {
            if (openedActions === 'right') translate = translate - actionsRightWidth;
            else translate = translate + actionsLeftWidth;
        }

        if (translate > 0 && actionsLeft.length === 0 || translate < 0 && actionsRight.length === 0) {
            if (!opened) {
                isTouched = isMoved = false;
                swipeOutContent.transform('');
                if (buttonsRight && buttonsRight.length > 0) {
                    buttonsRight.transform('');
                }
                if (buttonsLeft && buttonsLeft.length > 0) {
                    buttonsLeft.transform('');
                }
                return;
            }
            translate = 0;
        }

        if (translate < 0) direction = 'to-left';
        else if (translate > 0) direction = 'to-right';
        else {
            if (direction) direction = direction;
            else direction = 'to-left';
        }

        var i, buttonOffset, progress;

        e.f7PreventPanelSwipe = true;
        if (app.params.swipeoutNoFollow) {
            if (opened) {
                if (openedActions === 'right' && touchesDiff > 0) {
                    app.swipeoutClose(swipeOutEl);
                }
                if (openedActions === 'left' && touchesDiff < 0) {
                    app.swipeoutClose(swipeOutEl);
                }
            }
            else {
                if (touchesDiff < 0 && actionsRight.length > 0) {
                    app.swipeoutOpen(swipeOutEl, 'right');
                }
                if (touchesDiff > 0 && actionsLeft.length > 0) {
                    app.swipeoutOpen(swipeOutEl, 'left');
                }
            }
            isTouched = false;
            isMoved = false;
            return;
        }
        overswipeLeft = false;
        overswipeRight = false;
        var $button;
        if (actionsRight.length > 0) {
            // Show right actions
            progress = translate / actionsRightWidth;
            if (translate < -actionsRightWidth) {
                translate = -actionsRightWidth - Math.pow(-translate - actionsRightWidth, 0.8);
                if (overswipeRightButton.length > 0) {
                    overswipeRight = true;
                }
            }
            for (i = 0; i < buttonsRight.length; i++) {
                if (typeof buttonsRight[i]._buttonOffset === 'undefined') {
                    buttonsRight[i]._buttonOffset = buttonsRight[i].offsetLeft;
                }
                buttonOffset = buttonsRight[i]._buttonOffset;
                $button = $(buttonsRight[i]);
                if (overswipeRightButton.length > 0 && $button.hasClass('swipeout-overswipe')) {
                    $button.css({left: (overswipeRight ? -buttonOffset : 0) + 'px'});
                }
                $button.transform('translate3d(' + (translate - buttonOffset * (1 + Math.max(progress, -1))) + 'px,0,0)');
            }
        }
        if (actionsLeft.length > 0) {
            // Show left actions
            progress = translate / actionsLeftWidth;
            if (translate > actionsLeftWidth) {
                translate = actionsLeftWidth + Math.pow(translate - actionsLeftWidth, 0.8);
                if (overswipeLeftButton.length > 0) {
                    overswipeLeft = true;
                }
            }
            for (i = 0; i < buttonsLeft.length; i++) {
                if (typeof buttonsLeft[i]._buttonOffset === 'undefined') {
                    buttonsLeft[i]._buttonOffset = actionsLeftWidth - buttonsLeft[i].offsetLeft - buttonsLeft[i].offsetWidth;
                }
                buttonOffset = buttonsLeft[i]._buttonOffset;
                $button = $(buttonsLeft[i]);
                if (overswipeLeftButton.length > 0 && $button.hasClass('swipeout-overswipe')) {
                    $button.css({left: (overswipeLeft ? buttonOffset : 0) + 'px'});
                }
                if (buttonsLeft.length > 1) {
                    $button.css('z-index', buttonsLeft.length - i);
                }
                $button.transform('translate3d(' + (translate + buttonOffset * (1 - Math.min(progress, 1))) + 'px,0,0)');
            }
        }
        swipeOutContent.transform('translate3d(' + translate + 'px,0,0)');
    }
    function handleTouchEnd(e) {
        if (!isTouched || !isMoved) {
            isTouched = false;
            isMoved = false;
            return;
        }

        isTouched = false;
        isMoved = false;
        var timeDiff = (new Date()).getTime() - touchStartTime;
        var action, actionsWidth, actions, buttons, i, noFold;

        noFold = direction === 'to-left' ? noFoldRight : noFoldLeft;
        actions = direction === 'to-left' ? actionsRight : actionsLeft;
        actionsWidth = direction === 'to-left' ? actionsRightWidth : actionsLeftWidth;

        if (
            timeDiff < 300 && (touchesDiff < -10 && direction === 'to-left' || touchesDiff > 10 && direction === 'to-right') ||
            timeDiff >= 300 && Math.abs(translate) > actionsWidth / 2
        ) {
            action = 'open';
        }
        else {
            action = 'close';
        }
        if (timeDiff < 300) {
            if (Math.abs(translate) === 0) action = 'close';
            if (Math.abs(translate) === actionsWidth) action = 'open';
        }

        if (action === 'open') {
            app.swipeoutOpenedEl = swipeOutEl;
            swipeOutEl.trigger('open');
            swipeOutEl.addClass('swipeout-opened transitioning');
            var newTranslate = direction === 'to-left' ? -actionsWidth : actionsWidth;
            swipeOutContent.transform('translate3d(' + newTranslate + 'px,0,0)');
            actions.addClass('swipeout-actions-opened');
            buttons = direction === 'to-left' ? buttonsRight : buttonsLeft;
            if (buttons) {
                for (i = 0; i < buttons.length; i++) {
                    $(buttons[i]).transform('translate3d(' + newTranslate + 'px,0,0)');
                }
            }
            if (overswipeRight) {
                actionsRight.find('.swipeout-overswipe')[0].click();
            }
            if (overswipeLeft) {
                actionsLeft.find('.swipeout-overswipe')[0].click();
            }
        }
        else {
            swipeOutEl.trigger('close');
            app.swipeoutOpenedEl = undefined;
            swipeOutEl.addClass('transitioning').removeClass('swipeout-opened');
            swipeOutContent.transform('');
            actions.removeClass('swipeout-actions-opened');
        }

        var buttonOffset;
        if (buttonsLeft && buttonsLeft.length > 0 && buttonsLeft !== buttons) {
            for (i = 0; i < buttonsLeft.length; i++) {
                buttonOffset = buttonsLeft[i]._buttonOffset;
                if (typeof buttonOffset === 'undefined') {
                    buttonsLeft[i]._buttonOffset = actionsLeftWidth - buttonsLeft[i].offsetLeft - buttonsLeft[i].offsetWidth;
                }
                $(buttonsLeft[i]).transform('translate3d(' + (buttonOffset) + 'px,0,0)');
            }
        }
        if (buttonsRight && buttonsRight.length > 0 && buttonsRight !== buttons) {
            for (i = 0; i < buttonsRight.length; i++) {
                buttonOffset = buttonsRight[i]._buttonOffset;
                if (typeof buttonOffset === 'undefined') {
                    buttonsRight[i]._buttonOffset = buttonsRight[i].offsetLeft;
                }
                $(buttonsRight[i]).transform('translate3d(' + (-buttonOffset) + 'px,0,0)');
            }
        }
        swipeOutContent.transitionEnd(function (e) {
            if (opened && action === 'open' || closed && action === 'close') return;
            swipeOutEl.trigger(action === 'open' ? 'opened' : 'closed');
            if (opened && action === 'close') {
                if (actionsRight.length > 0) {
                    buttonsRight.transform('');
                }
                if (actionsLeft.length > 0) {
                    buttonsLeft.transform('');
                }
            }
        });
    }
    if (swipeoutEl) {
        $(swipeoutEl).on(app.touchEvents.start, handleTouchStart);
        $(swipeoutEl).on(app.touchEvents.move, handleTouchMove);
        $(swipeoutEl).on(app.touchEvents.end, handleTouchEnd);
    }
    else {
        $(document).on(app.touchEvents.start, '.list-block li.swipeout', handleTouchStart);
        $(document).on(app.touchEvents.move, '.list-block li.swipeout', handleTouchMove);
        $(document).on(app.touchEvents.end, '.list-block li.swipeout', handleTouchEnd);
    }

};
app.swipeoutOpen = function (el, dir, callback) {
    el = $(el);
    if (arguments.length === 2) {
        if (typeof arguments[1] === 'function') {
            callback = dir;
        }
    }

    if (el.length === 0) return;
    if (el.length > 1) el = $(el[0]);
    if (!el.hasClass('swipeout') || el.hasClass('swipeout-opened')) return;
    if (!dir) {
        if (el.find('.swipeout-actions-right').length > 0) dir = 'right';
        else dir = 'left';
    }
    var swipeOutActions = el.find('.swipeout-actions-' + dir);
    if (swipeOutActions.length === 0) return;
    var noFold = swipeOutActions.hasClass('swipeout-actions-no-fold') || app.params.swipeoutActionsNoFold;
    el.trigger('open').addClass('swipeout-opened').removeClass('transitioning');
    swipeOutActions.addClass('swipeout-actions-opened');
    var buttons = swipeOutActions.children('a');
    var swipeOutActionsWidth = swipeOutActions.outerWidth();
    var translate = dir === 'right' ? -swipeOutActionsWidth : swipeOutActionsWidth;
    var i;
    if (buttons.length > 1) {
        for (i = 0; i < buttons.length; i++) {
            if (dir === 'right') {
                $(buttons[i]).transform('translate3d(' + (- buttons[i].offsetLeft) + 'px,0,0)');
            }
            else {
                $(buttons[i]).css('z-index', buttons.length - i).transform('translate3d(' + (swipeOutActionsWidth - buttons[i].offsetWidth - buttons[i].offsetLeft) + 'px,0,0)');
            }
        }
        var clientLeft = buttons[1].clientLeft;
    }
    el.addClass('transitioning');
    for (i = 0; i < buttons.length; i++) {
        $(buttons[i]).transform('translate3d(' + (translate) + 'px,0,0)');
    }
    el.find('.swipeout-content').transform('translate3d(' + translate + 'px,0,0)').transitionEnd(function () {
        el.trigger('opened');
        if (callback) callback.call(el[0]);
    });
    app.swipeoutOpenedEl = el;
};
app.swipeoutClose = function (el, callback) {
    el = $(el);
    if (el.length === 0) return;
    if (!el.hasClass('swipeout-opened')) return;
    var dir = el.find('.swipeout-actions-opened').hasClass('swipeout-actions-right') ? 'right' : 'left';
    var swipeOutActions = el.find('.swipeout-actions-opened').removeClass('swipeout-actions-opened');
    var noFold = swipeOutActions.hasClass('swipeout-actions-no-fold') || app.params.swipeoutActionsNoFold;
    var buttons = swipeOutActions.children('a');
    var swipeOutActionsWidth = swipeOutActions.outerWidth();
    app.allowSwipeout = false;
    el.trigger('close');
    el.removeClass('swipeout-opened').addClass('transitioning');

    var closeTO;
    function onSwipeoutClose() {
        app.allowSwipeout = true;
        buttons.transform('');
        el.trigger('closed');
        if (callback) callback.call(el[0]);
        if (closeTO) clearTimeout(closeTO);
    }
    el.find('.swipeout-content').transform('translate3d(' + 0 + 'px,0,0)').transitionEnd(onSwipeoutClose);
    closeTO = setTimeout(onSwipeoutClose, 500);

    for (var i = 0; i < buttons.length; i++) {
        if (dir === 'right') {
            $(buttons[i]).transform('translate3d(' + (-buttons[i].offsetLeft) + 'px,0,0)');
        }
        else {
            $(buttons[i]).transform('translate3d(' + (swipeOutActionsWidth - buttons[i].offsetWidth - buttons[i].offsetLeft) + 'px,0,0)');
        }
        $(buttons[i]).css({left:0 + 'px'});
    }
    if (app.swipeoutOpenedEl && app.swipeoutOpenedEl[0] === el[0]) app.swipeoutOpenedEl = undefined;
};
app.swipeoutDelete = function (el, callback) {
    el = $(el);
    if (el.length === 0) return;
    if (el.length > 1) el = $(el[0]);
    app.swipeoutOpenedEl = undefined;
    el.trigger('delete');
    el.css({height: el.outerHeight() + 'px'});
    var clientLeft = el[0].clientLeft;
    el.css({height: 0 + 'px'}).addClass('deleting transitioning').transitionEnd(function () {
        el.trigger('deleted');
        if (callback) callback.call(el[0]);
        if (el.parents('.virtual-list').length > 0) {
            var virtualList = el.parents('.virtual-list')[0].f7VirtualList;
            var virtualIndex = el[0].f7VirtualListIndex;
            if (virtualList && typeof virtualIndex !== 'undefined') virtualList.deleteItem(virtualIndex);
        }
        else {
            el.remove();
        }
    });
    var translate = '-100%';
    el.find('.swipeout-content').transform('translate3d(' + translate + ',0,0)');
};
}
Framework7.prototype.support = (function () {
        var support = {
            touch: !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch),
            passiveListener: (function () {
                var supportsPassive = false;
                try {
                    var opts = Object.defineProperty({}, 'passive', {
                        get: function() {
                            supportsPassive = true;
                        }
                    });
                    window.addEventListener('testPassiveListener', null, opts);
                } catch (e) {}
                return supportsPassive;
            })()
        };

        // Export object
        return support;
    })();

$.fn.is = function (selector) {
    if (!this[0] || typeof selector === 'undefined') return false;
    var compareWith, i;
    if (typeof selector === 'string') {
        var el = this[0];
        if (el === document) return selector === document;
        if (el === window) return selector === window;

        if (el.matches) return el.matches(selector);
        else if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
        else if (el.mozMatchesSelector) return el.mozMatchesSelector(selector);
        else if (el.msMatchesSelector) return el.msMatchesSelector(selector);
        else {
            compareWith = $(selector);
            for (i = 0; i < compareWith.length; i++) {
                if (compareWith[i] === this[0]) return true;
            }
            return false;
        }
    }
    else if (selector === document) return this[0] === document;
    else if (selector === window) return this[0] === window;
    else {
        if (selector.nodeType || selector instanceof Zepto) {
            compareWith = selector.nodeType ? [selector] : selector;
            for (i = 0; i < compareWith.length; i++) {
                if (compareWith[i] === this[0]) return true;
            }
            return false;
        }
        return false;
    }

}
