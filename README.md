# Contador.leituras
Aplicação criada em [Node.js](https://github.com/nodejs/node).  
Usa [Nightmare](https://github.com/segmentio/nightmare) e [Electron](https://github.com/electron/electron) para automatizar o processo de fazer um registo online das leituras dos contadores nos seguintes sites:  
[EDP - Luz](https://edponline.edp.pt/login)  
[EPAL - Água](https://www.epal.pt/epalnet/epalnet.aspx)  
[Galp - Gás](https://gn.galpenergia.com/balcaodigital)  

*Aplicação preenche os dados nos 3 sites mas nunca faz o envio da leitura. Utilizador apenas precisa clicar em submeter para assegurar que tudo correu bem*

# Instalação
```sh
npm install
npm start
```

# Gerar Build
```sh
npm run build
```
