const myStorage = require('./storage')
const { ipcRenderer } = require('electron')

const username = document.getElementById("agua-username")
const password = document.getElementById("agua-password")
const codCliente = document.getElementById("agua-codCliente")
const leitura = document.getElementById("agua-leitura")
const submit = document.getElementById('agua-submit')
const error = document.getElementById('agua-error-found')

username.value = myStorage.GetValue(username.id)
password.value = myStorage.GetValue(password.id)
codCliente.value = myStorage.GetValue(codCliente.id)
leitura.value = myStorage.GetValue(leitura.id)

username.oninput = myStorage.UpdateInputValue
password.oninput = myStorage.UpdateInputValue
codCliente.oninput = myStorage.UpdateInputValue
leitura.oninput = myStorage.UpdateInputValue

submit.onclick = () => {
    error.style.display = 'none'
    error.innerHTML = ''

    ipcRenderer.send('run-automate-agua',
        username.value,
        password.value,
        codCliente.value,
        leitura.value
    )
}

ipcRenderer.on('run-automate-agua', (event, err) => {
    if (err) {
        console.log(err)
        error.style.display = 'block'
        error.innerHTML = err
    }

})
