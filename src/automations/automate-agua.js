module.exports = (userName, password, codClnt, leitura, cb) => {
    const USER_NAME = userName
    const PASSWORD = password
    const COD_CLIENTE = codClnt
    const LEITURA = leitura

    const Nightmare = require("nightmare")
    require('nightmare-iframe-manager')(Nightmare);

    const nightmare = Nightmare({
        electronPath: require('../../node_modules/electron'),
        show: true,
        width: 1080,
        height: 920
    })

    nightmare
        //+Login Page
        .goto("https://www.epal.pt/epalnet/epalnet.aspx")
        //Login form fill up and submit
        .enterIFrame('frame[src="login.aspx"]')
        .type('input#txt_UserName.formulario', USER_NAME)
        .type('input#txt_Password.formulario', PASSWORD)
        .click('input#btn_Submeter')
        .exitIFrame()

        //+Private Area page
        .enterIFrame('frame[src="login.aspx"]')
        .wait('frame[src="menu.aspx"]')

        //go to leituras do contador menu
        .enterIFrame('frame[src="menu.aspx"]')
        .wait('a[href="Leituras.aspx"]')
        .click('a[href="Leituras.aspx"]')
        .resetFrame()

        //go to comunicação leitura option
        .enterIFrame('frame[src="login.aspx"]')
        .wait('frame[src="MensagemInicial.aspx"]')
        .enterIFrame('frame[src="MensagemInicial.aspx"]')
        .wait('a[href="ComunicarLeitura.aspx"]')
        .click('a[href="ComunicarLeitura.aspx"]')
        .resetFrame()

        //enter leitura
        .enterIFrame('frame[src="login.aspx"]')
        .wait('frame[src="MensagemInicial.aspx"]')
        .enterIFrame('frame[src="MensagemInicial.aspx"]')
        .wait('input#txt_contadorPrincipal.formulario')
        .type('input#txt_contadorPrincipal.formulario', LEITURA)
        .resetFrame()

        .enterIFrame('frame[src="top.aspx"]')
        .wait(() => document.querySelector("span#lbl_cliente").innerHTML != '')
        .evaluate((codCliente) => {
            let codClienteStr = document.querySelector('span#lbl_cliente').innerHTML
            let validateStr = 'cód. ' + codCliente;

            let isValidCodCliente = codClienteStr.includes(validateStr)
            return isValidCodCliente

        }, COD_CLIENTE)
        .then((isValidCodCliente) => {
            if (!isValidCodCliente) {
                nightmare.end().then(cb(`Código cliente inválido: ${COD_CLIENTE}`))
            }
            else
                cb(null)
        })

        //In case of any error
        .catch(error => {
            console.error(`Error: ${error}`)
            cb(error)
            nightmare.end().then(() => cb(error))
        })
}
