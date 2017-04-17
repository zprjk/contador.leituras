module.exports = {
    SetValue: (storageKey, value) => localStorage.setItem(storageKey, value),
    GetValue: (storageKey) => localStorage.getItem(storageKey),
    UpdateInputValue: e => module.exports.SetValue(e.srcElement.id, e.srcElement.value)
}
