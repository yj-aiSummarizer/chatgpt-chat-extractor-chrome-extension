// window.addEventListener("start-select-mode", () => {
//   console.log("test");
//   const blocks = document.querySelectorAll(".group__menu-item");
//   blocks.forEach((el, idx) => {
//     if (!el.querySelector("input.chat-select")) {
//       const checkbox = document.createElement("input");
//       checkbox.type = "checkbox";
//       checkbox.className = "chat-select";
//       checkbox.dataset.chatIndex = idx;
//       checkbox.style.marginRight = "10px";
//       el.prepend(checkbox);
//     }
//   });
// });

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
  if (msg.action === "collect-selected") {
    const selectedHrefs = [];

    // 체크박스 선택된 것들만 골라서
    document
      .querySelectorAll("input.chat-select:checked")
      .forEach((checkbox) => {
        // checkbox가 들어있는 <a> 태그 찾기
        const aTag = checkbox.closest("a.__menu-item");
        if (aTag && aTag.href) {
          selectedHrefs.push(aTag.href);
        }
      });
    selectedHrefs.forEach((el, idx) => {
      fetchHtml(el);
    });

    alert(JSON.stringify(selectedHrefs, null, 2));

    fetch("https://your-server.com/api/save-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hrefs: selectedHrefs }),
    })
      .then((res) => alert(res.ok ? "전송 성공!" : "전송 실패"))
      .catch(() => alert("네트워크 오류"));
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
