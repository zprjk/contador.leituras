module.exports = (userName, password, numForn, leitura, cb) => {
    const USER_NAME = userName
    const PASSWORD = password
    const NUM_FORNECIMENTO = numForn
    const LEITURA = leitura

    const Nightmare = require("nightmare")
    const nightmare = Nightmare({
        electronPath: require('../../node_modules/nightmare/node_modules/electron'),
        show: true,
        width: 1080,
        height: 920
    })

    nightmare
        //+Login Page
        .goto("https://gn.galpenergia.com/balcaodigital/")
        //Login form fill up and submit
        .type('form#form1 table#Wizard1 input#Wizard1_login_UserName', USER_NAME)
        .type('form#form1 table#Wizard1 input#Wizard1_login_Password', PASSWORD)
        .click('form#form1 table#Wizard1 input#Wizard1_login_LoginButton1')

        //+User Land Page
        .wait('div#topo #ctl00_Lado_Direito_menu_principal_LabelNFor')
        //click comunicar leituras option menu
        .click('div.ColunaEsquerda a[href="Comunica_leituras.aspx"]')

        //Comunicar Leituras Page
        .wait('div#ctl00_Contentor_Painel_EnviarLeitura input#ctl00_Contentor_TextBox_LeituraComunicar')
        //type leitura
        .type('div#ctl00_Contentor_Painel_EnviarLeitura input#ctl00_Contentor_TextBox_LeituraComunicar', LEITURA)
        //.then(() => cb(null))
        //validate if is the correct NumFornecimento
        .wait('div.ColunaEsquerda a[href="Comunica_leituras.aspx"]')
        .evaluate((numFornecimento) => {
            let numFornecimentoStr = document.querySelector('div#topo #ctl00_Lado_Direito_menu_principal_LabelNFor').innerHTML
            numFornecimentoStr = numFornecimentoStr.replace('Nº fornecimento:', '')
            numFornecimentoStr = numFornecimentoStr.trim()

            return parseInt(numFornecimento) == parseInt(numFornecimentoStr)

        }, NUM_FORNECIMENTO)
        .then((isValidNumFornecimento) => {
            if (!isValidNumFornecimento)
                nightmare.end().then(cb(`Número de Fornecimento inválido: ${NUM_FORNECIMENTO}`))
            else
                cb(null)
        })

        //In case of any error
        .catch(error => {
            console.error(`Error: ${error}`)
            nightmare.end().then(() => cb(error))
        })
}
