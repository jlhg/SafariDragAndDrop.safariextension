// Store the position where the mouse is pressed.
var clickedPos = {x: 0, y: 0};
var minDistance = 30;

document.addEventListener('mousedown', function(event) {
  clickedPos.x = event.pageX;
  clickedPos.y = event.pageY;
}, false);

// Drop links to open and selected text to search.
document.addEventListener('dragover', cancel, false);
document.addEventListener('dragenter', cancel, false);
document.addEventListener('drop', function(event){
  var data = event.dataTransfer.getData('Text');
  var regex = /^(https?|ftp|gopher|telnet|file|notes|ms-help):\/\//;
  // console.log(data);
  var disX = event.pageX - clickedPos.x;
  var disY = event.pageY - clickedPos.y;
  // console.log("Dis X:" + disX + ", Dis Y:" + disY);
  var mask = calculateNewTabPositionMask(disX, disY);

  if (regex.test(data)) {
    // Is url, open it.

    safari.self.tab.dispatchMessage("openUrl",
                                    {url: data, posMask: mask, visibility: "background"});
  } else {
    // Search text.
    var serachedUrl = "http://www.google.com/search?q="
          + encodeURIComponent(data) + "&ie=utf-8&oe=utf-8";
    safari.self.tab.dispatchMessage("openUrl",
                                    {url: serachedUrl, posMask: mask, visibility: "foreground"}
                                   );
  }
}, false);

function calculateNewTabPositionMask(disX, disY) {
  // '^' means the current tab.
  var mask = 8; // 00^01
  if (disY < 0) {
    // Open tab at the previous or at the next tab.
    if (disX < 0) {
      // Open url at the previous tab.
      mask = 4; // 01^00
    } else {
      // Open url at the next tab.
      mask = 2; // 00^10
    }
  } else {
    // Open tab at the most left or at the most right tab.
    if (disX < 0) {
      // Open url at the most left tab.
      mask = 8; // 10^00
    } else {
      // Open url at most right tab.
      mask = 1; // 00^01
    }
  }

  return mask;
}

/**
 * Cancel the default behavior of the given event.
 */
function cancel(event) {
  if (event.preventDefault) {
    event.preventDefault();
  }

  return false;
}
