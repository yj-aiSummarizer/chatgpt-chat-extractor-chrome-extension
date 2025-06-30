// document.getElementById("activate").onclick = () => {
//   chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
//     chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       func: () => window.dispatchEvent(new Event("start-select-mode")),
//     });
//   });
// };

document.getElementById("activate").onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.tabs.sendMessage(tab.id, { action: "start-select-mode" });
  });
};

document.getElementById("submit").onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.tabs.sendMessage(tab.id, { action: "collect-selected" });
  });
};
