export default function reload_extension() {
    chrome.commands.onCommand.addListener((shortcut) => {
        console.log(shortcut);
        if (shortcut.includes("Reload_Extension")) {
            chrome.runtime.reload();
        }
    });
}
