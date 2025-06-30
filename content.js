chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "start-select-mode") {
    const historyBlock = document.getElementById("history");
    const menuItems = historyBlock.querySelectorAll(".__menu-item");

    menuItems.forEach((el, idx) => {
      if (!el.querySelector("input.chat-select")) {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "chat-select";
        checkbox.dataset.chatIndex = idx;
        checkbox.style.marginRight = "10px";

        checkbox.addEventListener("click", (event) => {
          event.stopPropagation(); // 여기가 핵심!
        });

        el.prepend(checkbox);
      }
    });
  }
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "upload-result") {
    alert(msg.result);
  }
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "collect-selected") {
    const selectedHrefs = [];

    document
      .querySelectorAll("input.chat-select:checked")
      .forEach((checkbox) => {
        const aTag = checkbox.closest("a.__menu-item");
        if (aTag && aTag.href) {
          selectedHrefs.push(aTag.href);
        }
      });

    alert(JSON.stringify(selectedHrefs, null, 2));

    // background로 메시지 전송
    chrome.runtime.sendMessage({
      action: "fetch-and-upload",
      hrefs: selectedHrefs,
    });
  }
});

function fetchHtml(url) {
  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      console.log(html);
      return html;
      // 원하는 데이터를 파싱하거나 DOMParser로 DOM 변환 가능
    })
    .catch((err) => console.error(err));
}
