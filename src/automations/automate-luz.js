module.exports = (userName, password, codIdentLocal, leitura, cb) => {
    const USER_NAME = userName
    const PASSWORD = password
    const COD_IDENT_LOCAL = codIdentLocal
    const LEITURA = leitura

    const Nightmare = require("nightmare")
    const nightmare = Nightmare({
        electronPath: require('../../node_modules/electron'),
        show: true,
        width: 1080,
        height: 920
    })

    nightmare
        //+Login Page
        .goto("https://edponline.edp.pt/login")
        //Login form fill up and submit
        .wait('div.tab-pane.active form .form-holder input[name="username"]')
        .type('div.tab-pane.active form .form-holder input[name="username"]', USER_NAME)
        .type('div.tab-pane.active form .form-holder input[name="password"]', PASSWORD)
        .click('div.tab-pane.active form .form-holder a.btn.btn-primary')
        //+Contract list page
        .wait('div.mainMenu li.contratos.active')
        //wait for the contract list to load-up
        .wait("ul.contractList edp-contract-item .contract-item")
        //get the correct contract id and click in the 'details' btn
        .evaluate((codIdentLocal, done) => {
            let nodeList = angular.element(
                document.querySelectorAll(
                    'ul.contractList .contract-item .contract-info-blocks .ibContract .contractAutomaticInfo .infoLine2 span[ng-hide]'
                )
            )
            let nodes = [...nodeList] //convert nodeList into an array (es6 way)
            let node = nodes.find(n => n.textContent.contains(codIdentLocal))

            // if (node == null)
            //     done(`Código Identificação inválido: ${codIdentLocal}`)

            if( node == null)
                done(JSON.stringify(nodeList, null, 2))

            let buttonNode = node.parentElement.parentElement.parentElement.parentElement
            let buttonElem = buttonNode.querySelector(".actionsList li.leituras a")

            setTimeout(() => { buttonElem.click(); done(null) }, 500)

        }, COD_IDENT_LOCAL)

        //+Enviar leitura de eletricidade Modal
        .wait(".modal-dialog .modal-body .contract-readings .consumption-name input#leiturasS")
        //type leitura
        .type(".modal-dialog .modal-body .contract-readings .consumption-name input#leiturasS", LEITURA)
        .then(() => cb(null))

        //In case of any error
        .catch(err => {
            console.error(`Error: ${err}`)
            nightmare.end().then(() => cb(err.toString()))
        })
}
