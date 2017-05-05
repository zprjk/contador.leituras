const myStorage = require('./storage')
const { ipcRenderer } = require('electron')

const username = document.getElementById("gas-username")
const password = document.getElementById("gas-password")
const numFornecimento = document.getElementById("gas-numFornecimento")
const leitura = document.getElementById("gas-leitura")
const submit = document.getElementById('gas-submit')
const error = document.getElementById('gas-error-found')

username.value = myStorage.GetValue(username.id)
password.value = myStorage.GetValue(password.id)
numFornecimento.value = myStorage.GetValue(numFornecimento.id)
leitura.value = myStorage.GetValue(leitura.id)

username.oninput = myStorage.UpdateInputValue
password.oninput = myStorage.UpdateInputValue
numFornecimento.oninput = myStorage.UpdateInputValue
leitura.oninput = myStorage.UpdateInputValue

submit.onclick = () => {
    error.style.display = 'none'
    error.innerHTML = ''

    ipcRenderer.send('run-automate-gas',
        username.value,
        password.value,
        numFornecimento.value,
        leitura.value
    )
}

ipcRenderer.on('run-automate-gas', (event, err) => {
    if (err) {
        console.log(err)
        error.style.display = 'block'
        error.innerHTML = err
    }
})
