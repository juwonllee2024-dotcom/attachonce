const enableButton = document.querySelector<HTMLButtonElement>("#enable");
const status = document.querySelector<HTMLElement>("#status");

enableButton?.addEventListener("click", async () => {
  enableButton.disabled = true;
  if (status) {
    status.textContent = "Opening the one-file picker on this tab…";
  }

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab.id) {
      throw new Error("No active tab.");
    }

    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["content.js"] });
    if (status) {
      status.textContent = "Picker opened on this tab.";
    }
  } catch (error) {
    enableButton.disabled = false;
    if (status) {
      status.textContent = error instanceof Error ? error.message : "Could not open on this tab.";
    }
  }
});

export {};
