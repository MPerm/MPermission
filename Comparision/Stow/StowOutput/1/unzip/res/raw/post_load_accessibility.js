cvox.ChromeVox.getStringifiedAndroidKeyBindings = function() {
  return cvox.ChromeVoxJSON.stringify({"#17":["stopSpeech", "Stop speaking"], "#21":["backward", "Navigate backward"], "#19":["backward", "Navigate backward"], "#20":["forward", "Navigate forward"], "#22":["forward", "Navigate forward"], "Q":["backward", "Navigate backward"], "P":["forward", "Navigate forward"], "Shift+#38":["nop", ""], "Shift+#40":["nop", ""], "#37":["nop", ""], "#39":["nop", ""], "Shift+#37":["previousGranularity", "Decrease navigation granularity"], "Shift+#39":["nextGranularity", "Increase navigation granularity"], "#13":["actOnCurrentItem", "Take action on current item"], "#23":["actOnCurrentItem", "Take action on current item"], "Shift+#16":["nop", ""], "Ctrl+Alt+#191":["toggleSearchWidget", 
  "Toggle search widget"], "Ctrl+Alt+B":["showBookmarkManager", "Open bookmark manager"], "Ctrl+Alt+A":["nextTtsEngine", "Switch to next TTS engine"], "Ctrl+Alt+#189":["decreaseTtsRate", "Decreaste rate of speech"], "Ctrl+Alt+#187":["increaseTtsRate", "Increase rate of speech"], "Ctrl+Alt+Shift+#189":["decreaseTtsPitch", "Decrease pitch"], "Ctrl+Alt+Shift+#187":["increaseTtsPitch", "Increase pitch"], "Ctrl+Alt+#219":["decreaseTtsVolume", "Decrease speech volume"], "Ctrl+Alt+#221":["increaseTtsVolume", 
  "Increase speech volume"], "Ctrl+Alt+1":["nextHeading1", "Next level 1 heading"], "Ctrl+Alt+Shift+1":["previousHeading1", "Previous level 1 heading"], "Ctrl+Alt+2":["nextHeading2", "Next level 2 heading"], "Ctrl+Alt+Shift+2":["previousHeading2", "Previous level 2 heading"], "Ctrl+Alt+3":["nextHeading3", "Next level 3 heading"], "Ctrl+Alt+Shift+3":["previousHeading3", "Previous level 3 heading"], "Ctrl+Alt+4":["nextHeading4", "Next level 4 heading"], "Ctrl+Alt+Shift+4":["previousHeading4", "Previous level 4 heading"], 
  "Ctrl+Alt+5":["nextHeading5", "Next level 5 heading"], "Ctrl+Alt+Shift+5":["previousHeading5", "Previous level 5 heading"], "Ctrl+Alt+6":["nextHeading6", "Next level 6 heading"], "Ctrl+Alt+Shift+6":["previousHeading6", "Previous level 6 heading"], "Ctrl+Alt+C":["nextCheckbox", "Next checkbox"], "Ctrl+Alt+Shift+C":["previousCheckbox", "Previous checkbox"], "Ctrl+Alt+E":["nextEditText", "Next editable text area"], "Ctrl+Alt+Shift+E":["previousEditText", "Previous editable text area"], "Ctrl+Alt+F":["nextFormField", 
  "Next form field"], "Ctrl+Alt+Shift+F":["previousFormField", "Previous form field"], "Ctrl+Alt+G":["nextGraphic", "Next graphic"], "Ctrl+Alt+Shift+G":["previousGraphic", "Previous graphic"], "Ctrl+Alt+H":["nextHeading", "Next heading"], "Ctrl+Alt+Shift+H":["previousHeading", "Previous heading"], "Ctrl+Alt+I":["nextListItem", "Next list item"], "Ctrl+Alt+Shift+I":["previousListItem", "Previous list item"], "Ctrl+Alt+L":["nextLink", "Next link"], "Ctrl+Alt+Shift+L":["previousLink", "Previous link"], 
  "Ctrl+Alt+O":["nextList", "Next list"], "Ctrl+Alt+Shift+O":["previousList", "Previous list"], "Ctrl+Alt+Q":["nextBlockquote", "Next block quote"], "Ctrl+Alt+Shift+Q":["previousBlockquote", "Previous block quote"], "Ctrl+Alt+R":["nextRadio", "Next radio button"], "Ctrl+Alt+Shift+R":["previousRadio", "Previous radio button"], "Ctrl+Alt+S":["nextSlider", "Next slider"], "Ctrl+Alt+Shift+S":["previousSlider", "Previous slider"], "Ctrl+Alt+T":["nextTable", "Next table"], "Ctrl+Alt+Shift+T":["previousTable", 
  "Previous table"], "Ctrl+Alt+U":["nextButton", "Next button"], "Ctrl+Alt+Shift+U":["previousButton", "Previous button"], "Ctrl+Alt+X":["nextComboBox", "Next combo box"], "Ctrl+Alt+Shift+X":["previousComboBox", "Previous combo box"]})
};

cvox.SmartDomWalker.prototype.isLeafNode = function(targetNode) {
  if(cvox.DomUtil.isLeafNode(targetNode)) {
    return true
  }
  var content = cvox.DomUtil.getText(targetNode);
  if(content.length > cvox.SmartDomWalker.SMARTNAV_MAX_CHARCOUNT) {
    return false
  }

  if(content.replace(/\s/g, "") === "") {
    return false
  }

  for(var breakingNodes = cvox.XpathUtil.evalXPath(cvox.SmartDomWalker.SMARTNAV_BREAKOUT_XPATH, targetNode), i = 0, node;node = breakingNodes[i];i++) {
    if(cvox.DomUtil.hasContent(node)) {
      return false
    }
  }

  for (var children = targetNode.childNodes,i=0;i<children.length;i++) {
    if (children[i].nodeType != 3) { //TextNode
      return false
    }
  }
  return true
};
cvox.ChromeVoxUserCommands.finishNavCommand = function(messagePrefixStr) {
  cvox.ChromeVox.lens && cvox.ChromeVox.lens.updateText();
  var descriptionArray = cvox.ChromeVox.navigationManager.getCurrentDescription(), contentStr = descriptionArray[0], descriptionStr = descriptionArray[1], contentStr = contentStr.replace(/\s+/g, " ").replace(/^\s+|\s+$/g, ""), descriptionStr = descriptionStr.replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "");
  setTimeout(function() {
    cvox.ChromeVox.navigationManager.setFocus()
  }, 0);
  cvox.SelectionUtil.scrollToSelection(window.getSelection());
  cvox.ChromeVox.navigationManager.syncToSelection();
  messagePrefixStr != "" && descriptionStr != "" ?
    (cvox.ChromeVoxUserCommands.speakAtLowerPitch(messagePrefixStr), cvox.ChromeVox.tts.speak(contentStr, 1, null), cvox.ChromeVoxUserCommands.speakAtLowerPitch(descriptionStr, 1)) :
        messagePrefixStr != "" ? (cvox.ChromeVoxUserCommands.speakAtLowerPitch(messagePrefixStr), cvox.ChromeVox.tts.speak(contentStr, 1, null)) :
            descriptionStr != "" ? cvox.ChromeVox.tts.speak(contentStr, 0, null) : cvox.ChromeVox.tts.speak(contentStr, 0, null);
  cvox.ChromeVoxUserCommands.playEarcons()
};