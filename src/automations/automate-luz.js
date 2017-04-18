module.exports = (userName, password, codIdentLocal, leitura, cb) => {
    const USER_NAME = userName
    const PASSWORD = password
    const COD_IDENT_LOCAL = codIdentLocal
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
        .goto("https://edponline.edp.pt/Auth/Paginas/SignIn.aspx")
        //Login form fill up and submit
        .type('form .form-holder input[name="username"]', USER_NAME)
        .type('form .form-holder input[name="password"]', PASSWORD)
        .click('form .form-holder button[type="submit"')

        //+Contract list page
        .wait('form[action="/Contratos/Paginas/usercontracts.aspx"]')
        //wait for the contract list to load-up
        .wait("#contract-list-views .contract-list")
        //get the correct contract id and click in the 'details' btn
        .evaluate((codIdentLocal, done) => {
            let nodeList = document.querySelectorAll('#contract-list-views .contract-list .sec_bloc .infos ul li span[data-ng-bind="contract.idCode"]')
            let nodes = [...nodeList] //convert nodeList into an array (es6 way)
            let node = nodes.find(n => n.innerHTML == codIdentLocal)

            if (node == null)
                done(`Código Identificação inválido: ${codIdentLocal}`)

            let buttonDivisionNode = node.parentElement.parentElement.parentElement.parentElement //(.sec_bloc)
            let buttonElem = buttonDivisionNode.querySelector("div#linkDetaildiv a#linkDetail")

            setTimeout(() => { buttonElem.click(); done(null) }, 500)

        }, COD_IDENT_LOCAL)

        //+Contract Detail Page
        .wait("form[action='/Contratos/Paginas/PagamentosFaturas.aspx']")
        //go to the leituras tab
        .click(".plcd .menu_plcd a[href='/Contratos/Paginas/Leituras.aspx']")
         //wait comunicar button is available
        .wait("div#divLeituras table#leituras_Eletricidade")
        .wait(() => document.querySelector("#ctl00_PlaceHolderMain_LeiturasElectricidade_lblIdealReadingDate").style.display != 'none')
        
        //open comunicar leitura modal
        .click("div#comunicarleituras input[href='#myModalComunicar']")
        .wait(() => document.querySelector("div#myModalComunicar").style.display === 'block')
        .wait(600)
        //type leitura
        .type("div#myModalComunicar input#txtValorLeitura_S", LEITURA)
        .then(() => cb(null))

        //In case of any error
        .catch(error => {
            console.error(`Error: ${error}`)
            nightmare.end().then(() => cb(error))
        })
}
