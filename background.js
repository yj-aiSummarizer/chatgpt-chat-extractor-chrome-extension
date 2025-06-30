chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.action === "fetch-and-upload") {
    const { hrefs } = msg;
    console.log(hrefs);
    Promise.all(hrefs.map(fetchHtml))
      .then((htmls) => {
        // 각 href + html 쌍에 대해 POST 요청 보내기
        const postPromises = hrefs.map((href, idx) => {
          console.log(href);
          return fetch("http://localhost:8081/api/chat/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sourceUrl: href,
              title: "", // TODO: title 추출 로직 추가하여 실제 title 전송 필요
              html: htmls[idx],
            }),
          });
        });
        return Promise.all(postPromises);
      })
      .then((responses) => {
        const allSuccess = responses.every((res) => res.ok);
        chrome.tabs.sendMessage(sender.tab.id, {
          action: "upload-result",
          result: allSuccess ? "모두 전송 성공!" : "일부 전송 실패",
        });
      })
      .catch((err) => {
        console.error("Upload failed:", err);
        chrome.tabs.sendMessage(sender.tab.id, {
          action: "upload-result",
          result: "네트워크 오류",
        });
      });
  }
});

function fetchHtml(url) {
  return fetch(url)
    .then((res) => res.text())
    .catch((err) => {
      console.error(`Failed to fetch ${url}:`, err);
      return "";
    });
}
