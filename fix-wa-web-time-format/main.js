const fixFormat = (text) =>
  text.replace(/(\d?\d):(\d\d) ([ap])m/i, (match, h, min, ap) => {
    h = parseInt(h);
    const pm = ap.toLowerCase() == "p";
    if (pm && h != 12) h += 12;
    else if (!pm && h == 12) h = 0;
    return String(h).padStart(2, "0") + ":" + min;
  });

const fixTextNode = (textNode) => {
  const fixed = fixFormat(textNode.textContent);
  if (fixed !== textNode.textContent) {
    textNode.textContent = fixed;
  }
  const obs = new MutationObserver((mutations) => {
    mutations.forEach(
      (mutation) =>
        mutation.type === "characterData" && fixTextNode(mutation.target)
    );
  });
  obs.observe(textNode, {
    characterData: true,
  });
};

const fixNode = (node) =>
  node.nodeType === Node.ELEMENT_NODE &&
  node
    .querySelectorAll(
      [
        ".fewfhwl7", // message
        "._1i_wG", // last message (on the left)
        "._2YPr_", // last seen
        "._1qB8f", // status (from other people), message read, message delivered
        ".fVMYC", // status (own)
        "._5SjOa", // status being displayed
        "._2XN6O", // last status (own)
        "._1qB8f span", // status read
      ].join(",")
    )
    .forEach((e) => {
      if (
        e.childNodes.length == 1 &&
        e.childNodes[0].nodeType == Node.TEXT_NODE
      ) {
        fixTextNode(e.childNodes[0]);
      }
    });

const observer = new MutationObserver((mutations) =>
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach(fixNode);
  })
);
observer.observe(document.body, { childList: true, subtree: true });
