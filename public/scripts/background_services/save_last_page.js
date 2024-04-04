const STORAGE_KEY = "lastPageUrl";
let lastPageUrl;

export default function saveLastPage() {
  chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status !== "complete") return;

    lastPageUrl = tabId && changeInfo.url;
    console.log(`Last visited page: ${lastPageUrl}`);

    if (getLastPageSave() !== lastPageUrl)
      chrome.storage.local.set({ [STORAGE_KEY]: lastPageUrl });
    else
      console.log("page is already saved")
  });
}

export function getLastPageSave() {
  chrome.storage.local.get([STORAGE_KEY], (data) => {
    if (data[STORAGE_KEY]) {
      console.log(`Previously visited page: ${data[STORAGE_KEY]}`);
      return data[STORAGE_KEY];
    }
  });
}
