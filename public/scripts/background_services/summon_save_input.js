export function summonSaveInput() {
    chrome.commands.onCommand.addListener(async (shortcut) => {
        console.log(shortcut);
        if (shortcut.includes("Summon_Save_Input")) {
            await chrome.runtime.sendMessage({ action: 'injectComponent' });
        }
    });
}