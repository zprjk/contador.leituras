const myStorage = require('./storage')
const { ipcRenderer } = require('electron')

const username = document.getElementById("luz-username")
const password = document.getElementById("luz-password")
const codIdentLocal = document.getElementById("luz-codIdentLocal")
const leitura = document.getElementById("luz-leitura")
const submit = document.getElementById('luz-submit')
const error = document.getElementById('luz-error-found')

username.value = myStorage.GetValue(username.id)
password.value = myStorage.GetValue(password.id)
codIdentLocal.value = myStorage.GetValue(codIdentLocal.id)
leitura.value = myStorage.GetValue(leitura.id)

username.oninput = myStorage.UpdateInputValue
password.oninput = myStorage.UpdateInputValue
codIdentLocal.oninput = myStorage.UpdateInputValue
leitura.oninput = myStorage.UpdateInputValue

submit.onclick = () => {
    error.innerHTML = ''

    ipcRenderer.send('run-automate-luz',
        username.value,
        password.value,
        codIdentLocal.value,
        leitura.value
    )
}

ipcRenderer.on('run-automate-luz', (event, err) => {
    if (err) {
        console.log(err)
        error.innerHTML = err
    }
})