// Copyright 2010 Google Inc. All Rights Reserved.


/**
 * Alias for {@code document.getElementById}.
 * @param {string} id DOM ID of the element to return.
 * @return {Element} DOM element with the given ID (undefined if not found).
 */
function $(id) {
    return document.getElementById(id);
}


/**
 * Returns all descendants of the element with the given class name as a NodeList.
 * @param {Element} element Parent element.
 * @param {string} className CSS class name.
 * @return {NodeList} Descendant elements with the given class name (may be empty).
 */
function $$(element, className) {
    return element.getElementsByClassName(className);
}


/**
 * Returns the first descendant of the element with the given class name.
 * @param {Element} element Parent element.
 * @param {string} className CSS class name.
 * @return {Element} First descendant element with the given class name (undefined if none).
 */
function $$$(element, className) {
    return element.getElementsByClassName(className)[0];
}

function up(element, className) {
    var parent = element.parentNode;
    while (parent != null) {
        var classList = parent.className.split(/\s+/);
        for (i = 0; i < classList.length; i++) {
           if (classList[i] == className) {
               return parent;
           }
        }
        parent = parent.parentNode;
    }
}

/**
 * Returns the class names applied to the given element as an array of strings.
 * @param {Element} element Element whose class names are to be returned.
 * @return {Array.<string>} (Possibly empty) array of class name strings.
 */
function getClassNames(element) {
    return element.className ? element.className.split(/\s+/) : [];
}

/**
 * Called from Java to dispatch dpad key events to javascript when accessibility
 * is enabled.
 */
function handleDPadEvent(keyCode) {
    // Enter key or center dpad.
    if (keyCode == 13 || keyCode == 23) {
        var node = cvox.ChromeVox.navigationManager.getCurrentNode();
        if (node && node.activate) {
            node.activate(node);
        }
        return;
    }
    var functionName = cvox.ChromeVoxKbHandler.keyToFunctionsTable["#"+keyCode][0];
    cvox.ChromeVoxUserCommands.commands[functionName]();
}

function speakBody(id) {
   if(window.parent == window) {
        var div = window.document.getElementById(id);
        var divs = div.getElementsByTagName("div");
        var toFocus;
        for (var i = 0;i < divs.length;i++){
            if (divs[i].getAttribute("name")=="gm-message-content") {
                toFocus = divs[i];
            }
        }
        var activeElem = toFocus;
        cvox.DomUtil.setFocus(activeElem);
        cvox.ChromeVox.navigationManager.syncToNode(activeElem);
        cvox.ChromeVox.navigationManager.setFocus();
   }
   cvox.ChromeVoxUserCommands.finishNavCommand("");
}

/**
 * Applies the class name to the element. Does nothing if the element already has that class name.
 * @param {Element} element Element.
 * @param {string} className Class name to add.
 */
function addClassName(element, className) {
    var classNames = getClassNames(element);
    if (classNames.indexOf(className) == -1) {
        classNames.push(className);
        element.className = classNames.join(' ');
    }
}


/**
 * Removes the class name from the element. Does nothing if the element doesn't have that class
 * name.
 * @param {Element} element Element.
 * @param {string} className Class name to remove.
 */
function removeClassName(element, className) {
    var classNames = getClassNames(element);
    var index = classNames.indexOf(className);
    if (index != -1) {
        classNames.splice(index, 1);
        element.className = classNames.join(' ');
    }
}


/**
 * Adds or removes the class name based on the value of the {@code enable} parameter.
 * @param {Element} element Element.
 * @param {string} className Class name to add or remove.
 * @param {boolean} enable Whether to add or remove the class name.
 */
function enableClassName(element, className, enable) {
    if (enable) {
        addClassName(element, className);
    } else {
        removeClassName(element, className);
    }
}


/**
 * Determines whether or not an element has a given class.
 * @param {Element} element Element.
 * @param {string} className The class name to query.
 * @return {boolean} Whether or not the provided element has the class.
 */
function hasClassName(element, className) {
    return getClassNames(element).indexOf(className) != -1;
}


/**
 * Returns a function closure binding the given function to the given context object.  The function
 * will be invoked as a method on the object.
 * @param {Function} fn Function to bind.
 * @param {Object} context Object on which the function is to be called as a method.
 */
function bind(fn, context) {
    return function() {
        return fn.apply(context, arguments);
    };
}


/**
 * Returns the computed style of the element.
 * @return {CSSStyleDeclaration} The computed style of the element.
 */
function getComputedStyle_(element) {
  return document.defaultView.getComputedStyle(element, '');
}


/**
 * Returns the page offset of an element.
 *
 * @param {Element} element The element to return the page offset for.
 * @return {left: number, top: number} A tuple including a left and top value representing
 *     the page offset of the element.
 */
function getPageOffset(element) {
    var left = -element.ownerDocument.defaultView.scrollX;
    var top = -element.ownerDocument.defaultView.scrollY;
    var walk = element;
    do {
        left += walk.offsetLeft;
        top += walk.offsetTop;
        if (getComputedStyle_(walk).position == 'fixed') {
            left += element.ownerDocument.defaultView.scrollX + walk.clientLeft;
            top += element.ownerDocument.defaultView.scrollY + walk.clientTop;
            break;
        }
        walk = walk.offsetParent;
    } while (walk != null);

    return {left: left, top: top};
}


// Gmail JS namespace.
var gm = {};


/**
 * The one and only conversation.
 * @type {gm.Conversation}
 */
gm.conversation = null;


/**
 * Conversation class.  Serves as the model and controller for the conversation view.
 * @constructor
 */
gm.Conversation = function() {
    // The fixed header widget.
    this.fixedHeader = new gm.FixedHeader();
    var blockImages = true;

    // Map of message IDs to gm.Message objects.
    this.messages = {};

    // Discover messages and wrap them in gm.Message objects.
    var messageElements = $$(document.body, 'gm-message');
    for (var i = 0, messageElement; messageElement = messageElements[i]; i++) {
        this.addMessage(messageElement);
    }

    // Array of email addresses. presence, and photo information.  Initialized asynchronously.
    this.contactInfo = [];

    // Array of expanded messages, sorted by index.
    this.expandedMessages = [];
    this.updateExpandedMessages();

    // For each expanded message, process any elided text blocks and inline images.
    for (var j = 0, message; message = this.expandedMessages[j]; j++) {
        message.initializeBody();
        blockImages = !message.showImages && blockImages;
    }
    window.gmail.setBlockNetworkImages(blockImages);
};


/**
 * Wraps a single message element in a gm.Message object and adds it to the map.
 * @param {Element} messageElement Message root element.
 */
gm.Conversation.prototype.addMessage = function(messageElement) {
    var id = messageElement.id;
    if (id) {
        var index = parseInt(messageElement.index, 10);
        this.messages[id] = new gm.Message(messageElement, id, index);
    }
};


/**
 * Rebuilds the array of expanded messages.  Must be called each time the user expands or collapses
 * messages or blocks of super-collapsed messages, as well as on any global events that cause
 * message dimensions to change (e.g. device orientation changes).
 */
gm.Conversation.prototype.updateExpandedMessages = function() {
    var fixedHeader = this.fixedHeader;
    this.expandedMessages.length = 0;
    var expandedMessageElements = $$(document.body, 'gm-expanded');
    var borderDiff = gm.Message.borderTopWidth - fixedHeader.borderTopWidth;

    for (var i = 0, messageElement; messageElement = expandedMessageElements[i]; i++) {
        var id = messageElement.id;
        var message = this.messages[id];
        if (message) {
            this.expandedMessages[i] = message;

            // message.offsetTop is the distance from the top of the page to the top edge of the
            // message header.  As soon as the top edge of the message header touches the top edge
            // of the viewport, the snap header appears.
            message.offsetTop = message.element.offsetTop + borderDiff;

            // message.offsetBottom is the distance from the top of the page to the bottom edge of
            // the message.  By the time the bottom edge of the message scrolls above the viewport,
            // the snap header is completely hidden.
            message.offsetBottom = message.offsetTop + message.element.offsetHeight;

            // message.footerOffsetBottom is the distance from the top of the page to the position
            // where the snap header starts to slide off screen as the message scrolls above the
            // viewport.
            message.footerOffsetBottom = message.offsetBottom - fixedHeader.fixedHeight;
        }
    }

    // Used to optimize scrolling.
    this.currentOffsetTop = this.currentFooterOffsetBottom = this.currentOffsetBottom = -1;

    // The cache is now valid.
    this.isCacheValid = true;
};


/**
 * Invalidates the geometry cache.  The cache will be rebuilt the next time the user starts
 * scrolling.
 */
gm.Conversation.prototype.invalidateGeometryCache = function() {
    this.isCacheValid = false;
};


/**
 * Handles window scroll events.
 */
gm.Conversation.prototype.handleScroll = function() {
    // Collapse the currently expanded action strip (if any).
    if (gm.ActionStrip.expandedActionStrip) {
        gm.ActionStrip.expandedActionStrip.setExpanded(false);
    }

    // Only exectue the rest of the (expensive!) scroll handler logic if the snap header is enabled.
    if (!window.USE_SNAP_HEADER) {
        this.fixedHeader.hide(/* immediately */ true);
        return;
    }

    if (this.scrollTimeout) {
        window.clearTimeout(this.scrollTimeout);
        this.scrollTimeout = 0;
    }

    if (!this.isCacheValid) {
        this.lastScrollTime = 0;
        this.updateExpandedMessages();
    }

    var scrollTop = document.body.scrollTop;
    var now = Date.now();
    var speed = 0;
    if (this.lastScrollTime) {
        // Scroll speed in kilopixels per second (kpx/s).  That's right, it's the metric system!
        speed = (scrollTop - this.scrollTop) / (now - this.lastScrollTime);
    }
    this.scrollTop = scrollTop;
    this.lastScrollTime = now;
    this.speed = speed;

    this.updateUi();

    // Update the UI one last time 100ms after the user has finished scrolling.
    var self = this;
    this.scrollTimeout = window.setTimeout(function() {
        self.scrollTop = document.body.scrollTop;
        self.lastScrollTime = 0;
        self.speed = 0;
        self.updateUi();
    }, 100);
};


/**
 * Updates the snap header UI based on the current scroll speed and position.
 */
gm.Conversation.prototype.updateUi = function() {
    var scrollTop = this.scrollTop;

    // "Slow scrolling" is defined as under 1 kpx/s in either direction.
    var isScrollingSlowly = (-1 <= this.speed && this.speed <= 1);

    if (this.fixedHeader.isVisible) {
        if (this.currentOffsetTop <= scrollTop && scrollTop < this.currentFooterOffsetBottom) {
            // The user is just scrolling around the current message.  Make sure the snap header
            // is fully visible.
            this.fixedHeader.element.style.top = '0';
            return;
        }
        if (isScrollingSlowly && this.currentFooterOffsetBottom <= scrollTop &&
                scrollTop < this.currentOffsetBottom) {
            // The user is in the "danger zone" where the current message has mostly scrolled above
            // the viewport.  Only part of the snap header is visible.  We slide the snap header
            // at 150% of the scrolling speed to minimize the "rubber banding" effect.
            this.fixedHeader.element.style.top =
                    (this.currentFooterOffsetBottom - scrollTop) * 1.5 + 'px';
            return;
        }
    }

    for (var i = this.expandedMessages.length - 1; i >= 0; i--) {
        var message = this.expandedMessages[i];
        if (message.offsetTop <= scrollTop && scrollTop < message.offsetBottom) {
            this.currentOffsetTop = message.offsetTop;
            this.currentFooterOffsetBottom = message.footerOffsetBottom;
            this.currentOffsetBottom = message.offsetBottom;
            this.fixedHeader.attach(message);
            this.fixedHeader.show();
            return;
        }
        if (i == 0 && scrollTop < message.offsetTop) {
            // The user is scrolling above the topmost expanded message; dismiss the snap header
            // immediately.
            this.fixedHeader.hide(/* immediately */ true);
            return;
        }
    }

    // If the user is scrolling slowy (at under 1 kpx/s), dismiss the snap header immediately.
    this.fixedHeader.hide(/* immediately */ isScrollingSlowly);
};


/**
 * Updates the presence and photo of senders appearing in the conversation.
 */
gm.Conversation.prototype.updateContactInfo = function() {
    for (var i = 0, len = this.contactInfo.length; i < len; i += 3) {
        var email = this.contactInfo[i];
        var className = this.contactInfo[i + 1];
        var src = this.contactInfo[i + 2] || 'file:///android_res/drawable/ic_contact_picture.png';

        var contactElements = document.getElementsByName(email + '_photo');
        for (var j = 0, contactElement; contactElement = contactElements[j]; j++) {
            contactElement.src = src;
        }

        var presenceElements = document.getElementsByName(email + '_presence');
        for (var k = 0, presenceElement; presenceElement = presenceElements[k]; k++) {
            presenceElement.className = 'gm-presence-icon ' + (className ? ' ' + className : '');
        }
    }
};


/**
 * Class representing the fixed message header shown during scrolling.
 * @constructor
 */
gm.FixedHeader = function() {
    this.element = $('gm_fixed_header');
    this.fixedHeight = this.element.offsetHeight;

    var headerElement = $$$(this.element, 'gm-header');
    var style = getComputedStyle_(headerElement);

    // Keep a cached value of the border top width for snapping computation.
    this.borderTopWidth = parseFloat(style.borderTopWidth);

    this.contactImage = $$$(this.element, 'gm-contact');
    this.senderNameElement = $$$(this.element, 'gm-sender-name');
    this.senderEmailElement = $$$(this.element, 'gm-sender-email');
    this.presenceElement = $$$(this.element, 'gm-presence-icon');
    this.actionStripElement = $$$(this.element, 'gm-action-strip');
    this.actionStrip = new gm.ActionStrip(this.actionStripElement);
    var contactWrapper = $$$(this.element, 'gm-contact-wrapper');
    contactWrapper.onclick = bind(this.handleClickContact, this);
    contactWrapper.activate = bind(this.contactSender, this);

    // We must attach a click handler to a leaf node, otherwise WebView won't highlight it.
    $$$(headerElement, 'gm-top-header').onclick = this.senderNameElement.onclick =
            bind(this.collapse, this);

    this.isVisible = true;
    this.element.style.visibility = '';
    this.hide(/* immediately */ true);
};

gm.FixedHeader.prototype.handleClickContact = function(e) {
    if (this.message) {
        this.message.handleClickContact(e);
    }
};
/**
 * Contacts the sender of the attached message.
 * @param {Event} e Click event to handle.
 */
gm.FixedHeader.prototype.contactSender = function() {
    if (this.message) {
        this.message.contactSender();
    }
};


/**
 * Toggles the star state of the attached message.
 * @param {Event} e Click event to handle.
 */
gm.FixedHeader.prototype.toggleStar = function(e) {
    if (this.message) {
        this.message.toggleStar(e);
    }
};


/**
 * Scrolls up to the top of the attached message and collapses its body.
 * @param {Event} e Click event to handle.
 */
gm.FixedHeader.prototype.collapse = function(e) {
    var message = this.message;
    if (message) {
        message.element.scrollIntoView(true);
        if (message.isExpanded) {
            message.handleHeaderTap(e);
        }
    }
};


/**
 * Attaches the fixed header to the given message.  While attached, the fixed header will update
 * its state to reflect changes in the underlying message.  If the fixed header is already attached
 * to another message, it is detached first.
 * @param {gm.Message} message Message to attach to the fixed header
 */
gm.FixedHeader.prototype.attach = function(message) {
    if (message != this.message) {
        if (this.message) {
            this.message.setOnChangeListener(null);
        }

        this.message = message;

        // The following message properties can never change after the fact, so we can set them
        // here:
        this.contactImage.className = message.contactImage.className;
        this.contactImage.name = message.contactImage.name;
        this.contactImage.src = message.contactImage.src;
        this.contactImage.title = message.contactImage.title;
        this.presenceElement.className = message.presenceElement.className;
        this.presenceElement.name = message.presenceElement.name;
        enableClassName(this.element, 'gm-attachment', message.hasAttachment);
        enableClassName(this.element, 'gm-draft', message.isDraft);
        this.actionStrip.attachToMessage(message);

        this.message.setOnChangeListener(bind(this.sync, this));
        this.sync();
    }
};


/**
 * Updates the state of the fixed header based on the state of the attached message.
 */
gm.FixedHeader.prototype.sync = function() {
    var message = this.message;
    if (message) {
        // The following message properties can change dynamically, so we may need to update them
        // in response to a change event:
        this.senderNameElement.style.color = message.senderNameElement.style.color;
        this.senderNameElement.innerHTML = message.senderNameElement.innerHTML;
        this.senderEmailElement.innerHTML = message.senderEmailElement.innerHTML;
        enableClassName(this.element, 'gm-starred', message.isStarred);
    }
};


/**
 * Shows the fixed header.
 */
gm.FixedHeader.prototype.show = function() {
    // Ensure the snap header is fully visible; it's possible this method is called if the snap
    // header is partially offscreen and hte user starts scrolling fast.
    this.element.style.top = '0';

    if (this.hideTimeout) {
        window.clearTimeout(this.hideTimeout);
        this.hideTimeout = 0;
    }

    if (!this.isVisible) {
        this.element.style.visibility = '';
        this.isVisible = true;
    }
};


/**
 * Hides the fixed header, either immediately or after a short delay.
 * @param {boolean} immediately Whether to hide the fixed header immediately.
 */
gm.FixedHeader.prototype.hide = function(immediately) {
    if (this.isVisible) {
        if (immediately) {
            if (this.hideTimeout) {
                window.clearTimeout(this.hideTimeout);
                this.hideTimeout = 0;
            }
            this.element.style.visibility = 'hidden';
            this.isVisible = false;
        } else if (!this.hideTimeout) {
            var self = this;
            this.hideTimeout = window.setTimeout(function() {
                self.hide(/* immediately */ true);
            }, 500);
        }
    }
};


/**
 * Class representing a single message in a conversation.
 * @param {Element} messageElement Root element for the message.
 * @param {string} id Message ID.
 * @param {number} index 0-based message index within the conversation.
 */
gm.Message = function(messageElement, id, index) {
    this.element = messageElement;
    this.id = id;
    this.index = index;

    var classNames = getClassNames(messageElement);
    for (var i = 0, className; className = classNames[i]; i++) {
        switch (className) {
            case 'gm-attachment':
                this.hasAttachment = true;
                break;
            case 'gm-expanded':
                this.isExpanded = true;
                break;
            case 'gm-starred':
                this.isStarred = true;
                break;
            case 'gm-draft':
                this.isDraft = true;
                break;
            case 'gm-sending':
                this.isSending = true;
                break;
        }
    }

    this.bodyElement = $$$(this.element, 'gm-body');

    this.contactImage = $$$(this.element, 'gm-contact');
    this.presenceElement = $$$(this.element, 'gm-presence-icon');
    this.senderNameElement = $$$(this.element, 'gm-sender-name');
    this.senderEmailElement = $$$(this.element, 'gm-sender-email');

    // Note: if the sender name is unknown, the e-mail is used in the sender name element, instead,
    // and the e-mail element is empty.
    var emailElementHtml = this.senderEmailElement.innerHTML;
    var senderNameHtml = this.senderNameElement.innerHTML;
    this.senderName = emailElementHtml ? senderNameHtml : '';
    this.senderEmail = gm.revertClickSafeEmail(emailElementHtml || senderNameHtml);

    this.recipientsElement = $$$(this.element, 'gm-recipients') ||
            $$$(this.element, 'gm-recipients-collapsible');
    this.dateTimeElement = $$$($$$(this.element, 'gm-bottom-header'), 'gm-date-time');
    this.isShowDetails = false;
    this.starElement = $$$(this.element, 'gm-star-icon');

    // Keep a cached copy of the top border width for scroll computations.
    // This assumes all messages have the same top border width.
    if (gm.Message.borderTopWidth == null) {
        var headerElement = $$$(this.element, 'gm-header');
        var style = getComputedStyle_(headerElement);
        gm.Message.borderTopWidth = parseFloat(style.borderTopWidth);
    }

    if (!this.isSending) {
        this.attachClickHandlers();
    }
};


/**
 * A cached value of the top border width of all message headers.
 * @type {?number}
 */
gm.Message.borderTopWidth = null;


/**
 * Sets a change listener function that gets called each time the message is updated.
 * @param {Function} fn Change listener function.
 */
gm.Message.prototype.setOnChangeListener = function(fn) {
    this.onChangeListener = fn;
};


/**
 * Calls the registered change listener function (if any).
 */
gm.Message.prototype.notifyChangeListener = function() {
    if (this.onChangeListener) {
        this.onChangeListener();
    }
};


/**
 * Handles taps on the message header.  Calls {@code toggleBody}.
 * @param {Event} e Click event to handle.
 */
gm.Message.prototype.handleHeaderTap = function(e) {
    e.stopPropagation();
    this.toggleBody();
};


/**
 * Toggles the visibility of the message body.
 */
gm.Message.prototype.toggleBody = function() {
    this.isExpanded = !this.isExpanded;
    if (this.isExpanded && !this.bodyElement.firstChild) {
        // First time; fetch body.  This also marks the message as manually expanded.
        this.bodyElement.innerHTML = window.gmail.getMessageBody(this.id);
        this.initializeBody();
    } else {
        // Toggle the manually expanded/collapsed state of the message.  This can be done in the
        // background.
        var self = this;
        window.setTimeout(function() {
            window.gmail.setManualExpansionState(self.id, self.isExpanded);
        }, 0);
    }
    enableClassName(this.element, 'gm-expanded', this.isExpanded);
    gm.conversation.invalidateGeometryCache();
};

/**
 * Initializes the message body contents by processing inline images and quoted
 * text.
 */
gm.Message.prototype.initializeBody = function() {
    if (this.bodyInitialized_) {
        return;
    }

    this.bodyInitialized_ = true;

    gm.processElidedText(this.bodyElement);

    var messageElement = $$$(this.element, 'gm-message-content');
    this.showImages = hasClassName(messageElement, 'gm-show-images');

    if (!this.showImages) {
      var showPicturesButton = $$$(this.element, 'gm-show-pictures-button');
      if (showPicturesButton) {
          showPicturesButton.onclick = bind(this.showPictures, this);
      }
    }

    var imgElements = this.bodyElement.getElementsByTagName('img');
    for (var i = 0, imgElement; imgElement = imgElements[i]; i++) {
        gm.attachImageLoadListener(imgElement);
        gm.rewriteImageSrc(imgElement, !this.showImages);
    }
};


/**
 * Displays the pictures in this particular message.
 */
gm.Message.prototype.showPictures = function() {
    var button;
    var i;
    var imgElement;
    var blockedSrc;
    var imgElements = this.bodyElement.getElementsByTagName('img');
    for (i = 0; imgElement = imgElements[i]; i++) {
        blockedSrc = imgElement.getAttribute('gm-src');
        if (blockedSrc) {
            imgElement.src = blockedSrc;
            imgElement.removeAttribute('gm-src');
        }
    }
    window.gmail.showExternalResources(this.id);

    $$$(this.element, 'gm-show-pictures-prompt').innerHTML = CLICK_ALWAYS_SHOW_PICTURES_STRING;
    button = $$$(this.element, 'gm-show-pictures-button');
    button.innerHTML = ALWAYS_SHOW_PICTURES_STRING;
    button.onclick = bind(this.alwaysShowPictures, this);
};

/**
 * Saves this sender to the "show pictures" sender whitelist and hides the 'show pictures' UI.
 */
gm.Message.prototype.alwaysShowPictures = function() {
    $$$(this.element, 'gm-show-pictures').style.display = 'none';
    window.gmail.setDisplayImagesFromSender(this.id);
};


/**
 * Toggles recipient details.
 * @param {Event} e Click event to handle.
 */
gm.Message.prototype.toggleRecipients = function() {
    this.isShowDetails = !this.isShowDetails;
    if (this.isShowDetails && !this.recipientDetails) {
        // First time; save recipient summaries and fetch recipient details.
        this.recipientSummary = this.recipientsElement.innerHTML;
        this.recipientDetails = window.gmail.getRecipientDetails(this.id);
    }
    this.recipientsElement.title = this.isShowDetails ?
        COLLAPSE_DETAILS_STRING : EXPAND_DETAILS_STRING;
    this.recipientsElement.innerHTML = this.isShowDetails ?
            this.recipientDetails : this.recipientSummary;
    this.dateTimeElement.style.display = this.isShowDetails ? 'none' : '';
    gm.conversation.invalidateGeometryCache();
};

gm.Message.prototype.handleRecipientsClick = function(e) {
    e.stopPropagation();
    this.toggleRecipients();
};

/**
 * Resumes editing of a draft message.
 */
gm.Message.prototype.resumeDraft = function() {
    window.gmail.edit(this.id);
};


/**
 * Updates the sender's name and email address.  Called from HtmlConversationActivity when a
 * message in the Outbox is sent.
 *
 * @param {string} senderName Sender's display name (must be HTML-escaped).
 * @param {string} senderEmailHtml Sender's click-safe email address (contains extra span)
 * @param {string} color Display color for the email address.
 */
gm.Message.prototype.updateSender = function(senderName, senderEmailHtml, color) {
    this.senderNameElement.style.color = color;
    this.senderNameElement.innerHTML = this.senderName = senderName;
    this.senderEmailElement.innerHTML = senderEmailHtml;
    this.senderEmail = gm.revertClickSafeEmail(senderEmailHtml);
    this.attachClickHandlers();
    this.notifyChangeListener();
    // Auto-expand sent message.
    if (!this.isExpanded) {
        this.toggleBody();
    }
};


/**
 * Attaches click event handlers to various elements of the header.
 */
gm.Message.prototype.attachClickHandlers = function() {
    // We must attach a click handler to a leaf node, otherwise WebView won't highlight it.
    $$$(this.element, 'gm-top-header').onclick = this.senderNameElement.onclick =
            bind(this.handleHeaderTap, this);
    var contactWrapper = $$$(this.element, 'gm-contact-wrapper');
    contactWrapper.onclick = bind(this.handleClickContact, this);
    contactWrapper.activate = bind(this.contactSender, this);
    this.actionStrip = new gm.ActionStrip($$$(this.element, 'gm-action-strip'), this);
    if (hasClassName(this.recipientsElement, 'gm-recipients-collapsible')) {
        this.recipientsElement.onclick = bind(this.handleRecipientsClick, this);
        this.recipientsElement.activate = bind(this.toggleRecipients, this);
    }
};


/**
 * Handles clicks on the sender's contact image.
 * @param {Event} e Click event to handle.
 */
gm.Message.prototype.handleClickContact = function(e) {
    e.stopPropagation();
    this.contactSender(e.target);
};

gm.Message.prototype.contactSender = function(element) {
    // Find the dimensions of the on-screen element adjusted to scrolling
    var pageOffset = getPageOffset(element);
    var right = pageOffset.left + element.offsetWidth;
    var bottom = pageOffset.top + element.offsetHeight;
    window.gmail.contactSender(this.senderName, this.senderEmail,
            pageOffset.left, pageOffset.top, right, bottom);
}

/**
 * Toggles the starred state of the message.
 * @param {Event} e Click event to handle.
 */
gm.Message.prototype.toggleStar = function(e) {
    if (e) {
        e.stopPropagation();
    }
    this.setStarred(!this.isStarred);
    // We can update the database in the background (bug 2715439).
    var self = this;
    this.starElement.title = this.isStarred ?
        REMOVE_STAR_STRING : ADD_STAR_STRING;
    window.setTimeout(function() {
        window.gmail.setStarred(self.id, self.isStarred);
    }, 0);
};


/**
 * Updates the starred state of the message.
 * @param {boolean} isStarred Whether to star or unstar the message.
 */
gm.Message.prototype.setStarred = function(isStarred) {
    this.isStarred = isStarred;
    enableClassName(this.element, 'gm-starred', isStarred);
    this.notifyChangeListener();
};


/**
 * A regular expression used to convert click safe e-mails to normal e-mails.
 * @type {RegExp}
 */
gm.REVERT_CLICK_SAFE_EMAIL_RE_ = /<span[^>]*>@<\/span>/;


/**
 * Reverts a click safe e-mail to a normal e-mail.
 * @param {string} clickSafeEmail The click safe e-mail which contains HTML.
 * @param {string} The raw e-mail string with HTML removed.
 */
gm.revertClickSafeEmail = function(clickSafeEmail) {
    return clickSafeEmail.replace(gm.REVERT_CLICK_SAFE_EMAIL_RE_, '@');
};

/**
 * Updates the starred state of the given message.
 * @param {string} messageId Message ID
 * @param {boolean} starValue Whether to star or unstar the message.
 */
gm.setStar = function(messageId, starValue) {
    var message = gm.conversation.messages[messageId];
    if (message) {
        message.setStarred(starValue);
    }
};


/**
 * A controller for an expandable strip of HTML that contain action buttons in a table.
 * @param {Element} el The root action strip table element.
 * @param {gm.Message} opt_message The message the actions are associated with.
 */
gm.ActionStrip = function(el, opt_message) {
    this.rootElement = el;
    this.message = opt_message;
    this.isExpanded = false;

    var actionButtons = $$(el, 'gm-action-button');
    var clickHandler = bind(this.handleClick, this);
    var activate = bind(this.activate, this);
    for (var i = 0, button; button = actionButtons[i]; i++) {
        button.onclick = clickHandler;
        button.activate = activate;
    }
};


/**
 * The one and only currently expanded action strip (if any).
 * @type {gm.ActionStrip}
 */
gm.ActionStrip.expandedActionStrip = null;


/**
 * Attaches the action strip actions to the specified message.
 * @param {gm.Message} message The message to attach to.
 */
gm.ActionStrip.prototype.attachToMessage = function(message) {
    this.message = message;
};


/**
 * Toggles the expanded state of the action strip.
 */
gm.ActionStrip.prototype.toggle = function() {
    this.setExpanded(!this.isExpanded);
};


/**
 * Sets the expanded state of the action strip.  If the strip is being expanded, collapses the
 * previously expanded action strip, ensuring that only one action strip is expanded at any time.
 * Does nothing if the action strip is already in the requested state.
 * @param {boolean} isExpanded Whether to expand or collapse the action strip.
 */
gm.ActionStrip.prototype.setExpanded = function(isExpanded) {
    if (isExpanded != this.isExpanded) {
        var actionStrip = this.rootElement;
        if (isExpanded) {
            // If there's already an expanded action strip, collapse it.
            if (gm.ActionStrip.expandedActionStrip) {
                gm.ActionStrip.expandedActionStrip.setExpanded(false);
            }
            // Expand.
            addClassName(actionStrip, 'gm-action-strip-expanded');
            this.isExpanded = true;
            // This is now the one and only expanded action strip.
            gm.ActionStrip.expandedActionStrip = this;
        } else {
            // Collapse.
            removeClassName(actionStrip, 'gm-action-strip-expanded');
            this.isExpanded = false;
            // If this was the one and only expanded action strip, clear the global reference.
            if (this == gm.ActionStrip.expandedActionStrip) {
                gm.ActionStrip.expandedActionStrip = null;
            }
        }
    }
};


/**
 * Handles a click on the action strip.
 * @param {Event} e The click event.
 */
gm.ActionStrip.prototype.activate = function(currentTarget) {
    if (!this.message) {
        return;
    }

    var arrayContains = function(arr, item) {
        return arr.indexOf(item) != -1;
    };

    var classes = getClassNames(currentTarget);
    if (arrayContains(classes, 'gm-strip-more')) {
        this.toggle();
    } else if (arrayContains(classes, 'gm-reply-action')) {
        window.gmail.reply(this.message.id);
    } else if (arrayContains(classes, 'gm-replyall-action')) {
        window.gmail.replyAll(this.message.id);
    } else if (arrayContains(classes, 'gm-forward-action')) {
        window.gmail.forward(this.message.id);
    } else if (arrayContains(classes, 'gm-star-icon')) {
        this.message.toggleStar();
    } else if (arrayContains(classes, 'gm-draft-action')) {
        this.message.resumeDraft();
    }
};

gm.ActionStrip.prototype.handleClick = function(e) {
    e.stopPropagation();
    this.activate(e.currentTarget);
};


/**
 * Expands a block of super-collapsed messages.
 * @param {Element} clickElement The click overlay for the super collapsed block.
 * @param {number} firstIndex 0-based index of the first message in the block.
 * @param {number} lastIndex 0-based index of the last message in the block.
 */
gm.uncollapse = function(clickElement, firstIndex, lastIndex) {
    var rootDiv = clickElement.parentNode;
    $$$(rootDiv, 'gm-super-collapsed-label').innerHTML = MSG_LOADING;
    // Doing the rest on a setTimeout() allows WebCore to repaint the UI, so it shows "Loading..."
    window.setTimeout(function() {
        clickElement.onclick = null; // Bug 2620101
        rootDiv.innerHTML = window.gmail.getMessageHeaders(firstIndex, lastIndex);
        var parent = rootDiv.parentNode;
        var child;
        while ((child = rootDiv.firstChild)) {
            parent.insertBefore(child, rootDiv);
            gm.conversation.addMessage(child);
        }
        gm.conversation.invalidateGeometryCache();
        gm.conversation.updateContactInfo();
    }, 0);
};


/**
 * Updates the labels shown just below the conversation subject in the view.
 * @param {string} html New label HTML.
 */
gm.setLabels = function(html) {
    $('gm_labels').innerHTML = html;
};


/**
 * Updates the sender's name and email address for the given message, and hooks up click handlers
 * for the message header.  Called from HtmlConversationActivity when a message in the Outbox is
 * sent.
 *
 * @param {string} messageId Message ID.
 * @param {string} senderName Sender's display name (must be HTML-escaped).
 * @param {string} senderEmailHtml Sender's click-safe email address (contains extra span)
 * @param {string} color Display color for the email address.
 */
gm.updateSender = function(messageId, senderName, senderEmailHtml, color) {
    var message = gm.conversation.messages[messageId];
    if (message) {
        message.updateSender(senderName, senderEmailHtml, color);
    }
};


/**
 * Updates the presence and photo of senders appearing in the conversation.  The argument is an
 * array of the following form:
 * <pre>
 *   ['email1@domain.com', 'gm-offline', 'content://com.android.contacts/contacts/111/photo',
 *    'email2@domain.com', 'gm-busy', 'content://com.android.contacts/contacts/112/photo',
 *    ...]
 * </pre>

 * @param {Array.<string>} contactInfo Array of email addresses, presence class names, and contact
 *     photo URIs.
 */
gm.updateContactInfo = function(contactInfo) {
    if (gm.conversation) {
        gm.conversation.contactInfo = contactInfo;
        gm.conversation.updateContactInfo();
    }
};


/**
 * Toggles landscape mode.  Called from Java each time the device orientation changes.  Since at
 * the time this is executed, WebView may not have finished its internal layout pass, this method
 * may call itself asynchronously up to 10 times to attempt to recompute the page geometry and
 * update the UI.
 *
 * @param {boolean} isLandscape Whether the device is entering landscape mode.
 * @param {number=} opt_attempt Number of previous attempts to recompute geometry after an
 *      orientation change.  Will abort after 10 attempts.
 */
gm.setLandscape = function(isLandscape, opt_attempt) {
    var attempt = opt_attempt || 0;

    if (isLandscape && window.DISABLE_SNAP_HEADER) {
        window.USE_SNAP_HEADER = false;
        gm.conversation.fixedHeader.hide(/* immediately */ true);
    } else if (window.DISABLE_SNAP_HEADER) {
        window.USE_SNAP_HEADER = true;
    }
    if (!window.USE_SNAP_HEADER) {
        return;
    }

    if (gm.layoutTimeout) {
        window.clearTimeout(gm.layoutTimeout);
        gm.layoutTimeout = 0;
    }

    // Hide the fixed header and invalidate the expanded message cache.  We'll rebuild the cache
    // and update the UI after WebView finishes the layout pass.
    gm.conversation.fixedHeader.hide(/* immediately */ true);
    gm.conversation.invalidateGeometryCache();

    if (isLandscape == window.innerHeight < window.innerWidth) {
        // We query window.innerHeight and window.innerWidth, because it appears that WebView only
        // updates these once its internal layout pass is complete.  Therefore, once the relative
        // sizes of window.innerHeight and window.innerWidth match the known orientation, we can
        // reasonably infer that WebView is done laying out the page.
        gm.conversation.handleScroll();
    } else if (attempt < 10) {
        // WebView is still busy doing layout; try again later up to 10 times (bug 2851876).
        gm.layoutTimeout = window.setTimeout(function() {
            gm.setLandscape(isLandscape, attempt + 1);
        }, 200);
    }
};


/**
 * Attaches an onload event listener to the image element, called when the image is fully loaded,
 * used to invalidate the cached snap header geometry cache (bug 2709571).
 * @param {Element} imageElement Image element.
 */
gm.attachImageLoadListener = function(imageElement) {
    // Reset the src attribute to the empty string because onload will only fire if the src
    // attribute is set after the onload listener.
    var originalSrc = imageElement.src;
    imageElement.src = '';
    imageElement.onload = function() {
        gm.conversation.invalidateGeometryCache();
    };
    imageElement.src = originalSrc;
};

/**
 * Changes relative paths to absolute path by pre-pending the account uri, as
 * well as making the {@code src} of the image element blank, saving it in a
 * custom attribute so that it can be retrieved later.
 * @param {Element} imgElement Image for which the src path will be updated.
 * @param {boolean} blockImage Whether or not to block the image.
 */
gm.rewriteImageSrc = function(imgElement, blockImage) {
    var src = imgElement.src;
    if (src.indexOf('x-thread://') == 0) {
        // A typical relative url looks like:
        // x-thread://NUMBER?view=KEYVALUES
        // This changes it to:
        // http://gmail.com/g/?view=KEYVALUES
        var position = src.indexOf('?');
        if (position != -1) {
            src = src.substring(position);
        }
        src = ACCOUNT_URI + src;
    }

    // Only block external images.
    if (blockImage && ((src.indexOf('http://') == 0) || src.indexOf('https://') == 0)) {
      imgElement.setAttribute('gm-src', src);
      imgElement.src = 'data:';
    } else {
      imgElement.src = src;
    }
};



/**
 * Discovers and handles elided text blocks in the given element (assumed to be a message body).
 * @param {Element} parentElement Parent element in which to look for elided text blocks.
 */
gm.processElidedText = function(parentElement) {
    var elidedTextElements = $$(parentElement, 'elided-text');
    for (var i = 0, elidedTextElement; elidedTextElement = elidedTextElements[i]; i++) {
        var toggleElement = document.createElement('div');
        toggleElement.className = 'gm-elided-text';
        toggleElement.innerHTML = MSG_SHOW_ELIDED;
        toggleElement.onclick = gm.toggleElidedText;
        elidedTextElement.parentNode.insertBefore(toggleElement, elidedTextElement);
    }
};


/**
 * Handles click events on the toggle control for an elided text block.  The event target is
 * assumed to be the toggle control element, and the elided text block is assumed to be its next
 * sibling.
 * @param {Event} e Click event to handle.
 */
gm.toggleElidedText = function(e) {
    var toggleElement = e.target;
    var elidedTextElement = toggleElement.nextSibling;
    var isHidden = getComputedStyle_(elidedTextElement).display == 'none';
    toggleElement.innerHTML = isHidden ? MSG_HIDE_ELIDED : MSG_SHOW_ELIDED;
    elidedTextElement.style.display = isHidden ? 'block' : 'none';
    gm.conversation.invalidateGeometryCache();
};


/**
 * Initializes the page by creating the one and only {@code gm.Conversation} instance and restoring
 * the previous scroll position (if any).
 */
gm.init = function(isLandscape) {
    window.setTimeout(function() {
        gm.conversation = new gm.Conversation();
        window.onscroll = bind(gm.conversation.handleScroll, gm.conversation);
        window.gmail.restoreScrollPosition();
        gm.conversation.invalidateGeometryCache();
        gm.disableSelects();
        gm.setLandscape(isLandscape);
    }, 0);
};


/**
 * Disables SELECT tag's as they cause the WebView that Gmail uses to crash.
 */
gm.disableSelects = function() {
    var selectEls = document.body.getElementsByTagName('SELECT');
    for (var i = 0, el; el = selectEls[i]; ++i) {
        el.disabled = true;
    }
};


// TODO(attila): Clean up the legacy JS code below this line.


// nodeType values
var ELEMENT_NODE = 1;
var TEXT_NODE = 3

function highlightInMessageBodies(data) {
    highlightStrings = data;

    if (highlightStrings.length == 0) {
        return;
    }

    var divs = document.getElementsByTagName("div");
    for (var i = 0; i < divs.length; i++) {
        if (divs[i].className == "gm-message-content") {
            internalHighlight(divs[i]);
        }
    }
}

function internalHighlight(node) {
    var children = node.childNodes;
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (child.nodeType == ELEMENT_NODE) {
            internalHighlight(child);
        } else if (child.nodeType == TEXT_NODE) {
            for (var j = 0; j < highlightStrings.length; j++) {
                var highlightString = highlightStrings[j];
                var pos = getFirstMatchIndex(child, highlightString);
                if (pos >= 0) {
                    var highlightedSpanNode = document.createElement("span");
                    highlightedSpanNode.className = "highlight";
                    var patternNode = child.splitText(pos);
                    patternNode.splitText(highlightString.length);
                    highlightedSpanNode.appendChild(patternNode.cloneNode(true));
                    node.replaceChild(highlightedSpanNode, patternNode);
                    // Skip ahead one, since we just added a child
                    i++;
                }
            }
        }
    }
}

function getFirstMatchIndex(node, highlightString) {
    // Since lookbehind isn't supported we need to check both possibilities
    var pos1 = node.data.search(new RegExp("\\W" + highlightString + "(?!\\w)", "gi"));
    // Move position to beginning of highlightString (don't count \W).
    if (pos1 >= 0) {
        pos1++;
    }

    var pos2 = node.data.search(new RegExp("^" + highlightString + "(?!\\w)", "gim"));

    // Decide which comes first
    var pos = pos2;
    if (pos < 0 || (pos1 < pos && pos1 >= 0)) {
        pos = pos1;
    }
    return pos;
}
