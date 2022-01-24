const testExportData = () => {
    document.querySelector("#addRF").click()
    document.querySelector("#addRF").click()
    document.querySelector("#addRNF").click()
    document.querySelector("#addRNF").click()
    document.querySelector("#addRN").click()
    document.querySelector("#addRN").click()


    document.querySelector("#RF1").shadowRoot.querySelector("#nome").value = 'Nome do meu RF'
    document.querySelector("#RF1").shadowRoot.querySelector("#descricao").value = 'Descrição do meu RF'
    document.querySelector("#RF1").shadowRoot.querySelector("#origem").value = 'Origem do meu RF'
    document.querySelector("#RF1").shadowRoot.querySelector("#responsavel").value = 'Responsável pelo meu RF'
    document.querySelector("#RF1").shadowRoot.querySelector("#interessados").value = 'Interessado pelo meu RF'

    document.querySelector("#RF1").shadowRoot.querySelector("#dependenciaINPUT").value = "RNF1"
    document.querySelector("#RF1").shadowRoot.querySelector("#dependenciaINPUT").dispatchEvent(new KeyboardEvent('keydown',{'keyCode':13}));
    document.querySelector("#RF1").shadowRoot.querySelector("#dependenciaINPUT").value = "RN1"
    document.querySelector("#RF1").shadowRoot.querySelector("#dependenciaINPUT").dispatchEvent(new KeyboardEvent('keydown',{'keyCode':13}));

    document.querySelector("#RF1").shadowRoot.querySelector("#conflitosINPUT").value = "RNF2"
    document.querySelector("#RF1").shadowRoot.querySelector("#conflitosINPUT").dispatchEvent(new KeyboardEvent('keydown',{'keyCode':13}));
    document.querySelector("#RF1").shadowRoot.querySelector("#conflitosINPUT").value = "RN2"
    document.querySelector("#RF1").shadowRoot.querySelector("#conflitosINPUT").dispatchEvent(new KeyboardEvent('keydown',{'keyCode':13}));

    document.querySelector("#export").onclick()

    console.clear()
}

function updateBoxes(type, node){
    const tagNames = {
        "RF": "mr-rf",
        "RNF": "mr-rnf",
        "RN": "mr-rn"
    }
    console.log(tagNames)
    const boxes = node.querySelectorAll(tagNames[type])
    boxes.forEach((boxElement, id) => {
        boxElement.id = `${type}${id+1}`
        // Atualiza todas as dependências
        boxElement.notifyAllDependents({type: "updateID"})
        // Atualiza todos os conflitos
        boxElement.notifyAllConflicting({type: "updateID"})
    })
}

function addRF() {
    const requisitosFuncionais = document.getElementById("requisitosFuncionais");
    const countId = requisitosFuncionais.childElementCount;
    const RF = document.createElement("mr-rf");
    RF.setAttribute("id", `RF${countId}`);
    requisitosFuncionais.appendChild(RF);
}
function addRNF() {
    const requisitosNaoFuncionais = document.getElementById("requisitosNaoFuncionais");
    const countId = requisitosNaoFuncionais.childElementCount;
    const RNF = document.createElement("mr-rnf");
    RNF.setAttribute("id", `RNF${countId}`);
    requisitosNaoFuncionais.appendChild(RNF);
}
function addRN() {
    const regrasDeNegocio = document.getElementById("regrasDeNegocio");
    const countId = regrasDeNegocio.childElementCount;
    const RN = document.createElement("mr-rn");
    RN.setAttribute("id", `RN${countId}`);
    regrasDeNegocio.appendChild(RN);
}
const callConfig = () => alert("Configuração");
const callExport = () => {
    infoExport.checked = true
    document.querySelector(".infoExport > pre").textContent = compilaInfos({type: "text"})
};

function closeInfoExport(){
    infoExport.checked = false
}
function compilaInfos({type}){
    const all = [
        ...document.querySelectorAll("mr-rf"),
        ...document.querySelectorAll("mr-rnf"),
        ...document.querySelectorAll("mr-rn")
    ]

    const infoAll = all.map(item => item.getInfos({type: "full"}))

    const depAndCon = (anterior, item, index, array) =>  anterior + item + (index < array.length-1 ? ", " : "")

    if(type === "text"){
        const infoAllSepareted = {}
        const regExpRF = /(RF[0-9]+)/g
        const regExpRNF = /(RNF[0-9]+)/g
        const regExpRN = /(RN[0-9]+)/g
    
        infoAllSepareted.RF = infoAll.filter(item => item.id.match(regExpRF))
        infoAllSepareted.RNF = infoAll.filter(item => item.id.match(regExpRNF))
        infoAllSepareted.RN = infoAll.filter(item => item.id.match(regExpRN))
    
        const formatExportText = (stringFinal, currentItem, index, array) => {
            // const depAndCon = (anterior, item, index, array) =>  anterior + item + (index < array.length-1 ? ", " : "")
                
            var tmp = `id: ${currentItem.id}\n`
            tmp += `nome: ${currentItem.nome}\n`
            tmp += `descrição: ${currentItem["descrição"]}\n`
            tmp += `origem: ${currentItem.origem}\n`
            tmp += `responsável: ${currentItem["responsável"]}\n`
            tmp += `interessados: ${currentItem.interessados}\n`
            tmp += `prioridade: ${currentItem.prioridade}\n`
            tmp += currentItem["dependências"].reduce(depAndCon, "dependências: ")
            tmp += "\n"
            tmp += currentItem["conflitos"].reduce(depAndCon, "conflitos: ")
            tmp += index < array.length-1 ? "\n- - - - - - - - - - - - - \n" : "\n\n"
            return stringFinal += tmp
        }
    
        const exportedRF = infoAllSepareted.RF.reduce(formatExportText, "============RF============\n\n")
        const exportedRNF = infoAllSepareted.RNF.reduce(formatExportText, "============RNF===========\n\n")
        const exportedRN = infoAllSepareted.RN.reduce(formatExportText, "============RN============\n\n")
        return exportedRF+exportedRNF+exportedRN
    }else if(type === "table"){
        return infoAll.reduce((stringFinal, currentItem) => {
            const openTable = (id) => `<table id="${id}">\n`
            const closeTable = () => `</table>\n`

            const openTr = (id) => `\t<tr id="${id}">\n`
            const closeTr = () => `\t</tr>\n`

            const thTd = (label, data) => `\t\t<th>${label}:</th>\n\t\t<td>${data}</td>\n`
            const thTdClass = (label, data) => `\t\t<th class="itemBrightness">${label}:</th>\n\t\t<td class="itemBrightness">${data}</td>\n`

            const id = (_id) => thTd("id", _id)
            const nome = (nome) => thTdClass("nome", nome)
            const descricao = (descricao) => thTd("descrição", descricao)
            const origem = (origem) => thTdClass("origem", origem)
            const responsavel = (responsavel) => thTd("responsável", responsavel)
            const interessados = (interessados) => thTdClass("interessados", interessados)
            const prioridade = (prioridade) => thTd("prioridade", prioridade)
            const dependencias = (dependencias) => thTdClass("dependências:", dependencias)
            const conflitos = (conflitos) => thTd("conflitos", conflitos.reduce(depAndCon, ""))

            var tmp = openTable(currentItem.id)
            tmp += openTr("id") + id(currentItem.id) + closeTr()
            tmp += openTr("nome") + nome(currentItem.nome) + closeTr()
            tmp += openTr("descricao") + descricao(currentItem["descrição"]) + closeTr()
            tmp += openTr("origem") + origem(currentItem.origem) + closeTr()
            tmp += openTr("responsavel") + responsavel(currentItem["responsável"]) + closeTr()
            tmp += openTr("interessados") + interessados(currentItem.interessados) + closeTr()
            tmp += openTr("prioridade") + prioridade(currentItem.prioridade) + closeTr()
            tmp += openTr("dependencias") + dependencias(currentItem["dependências"]) + closeTr()
            tmp += openTr("conflitos") + conflitos(currentItem.conflitos) + closeTr()
            tmp += closeTable()

            return stringFinal += tmp
        }, "")
    }
}
async function copyToClipboard({ target }){
    if(target.id === "text"){
        const txtExportCompiled = document.querySelector(".infoExport > pre").textContent
        await navigator.clipboard.writeText(txtExportCompiled)
    }else if(target.id == "word"){
        // var aux = document.createElement("div");
        var aux = document.getElementById("tables");
        aux.setAttribute("contentEditable", true);
        aux.innerHTML = compilaInfos({type: "table"});
        aux.setAttribute("onfocus", "document.execCommand('selectAll',false,null)");
        // document.body.appendChild(aux);
        aux.focus();
        document.execCommand("copy");
        // document.body.removeChild(aux);
        aux.setAttribute("contentEditable", false);
        aux.innerHTML = ""
        aux.removeAttribute("onfocus")
        // console.log(compilaInfos({type: "table"}))
    }
    const lastText = target.textContent
    target.classList.toggle("clicado")
    target.textContent = "Copiado..."
    setTimeout(() => {
        target.classList.toggle("clicado")
        target.textContent = lastText
    }, 1500)
}

(() => {
    const divInfoExport = document.querySelector(".infoExport")
    const btnFechar = document.querySelector(".infoExport > button#fechar")
    const btnCopiarText = document.querySelector(".infoExport > #fieldCopy > button#text")
    const btnCopiarWord = document.querySelector(".infoExport > #fieldCopy > button#word")
    const iconExport = document.querySelector("#export")
    const iconConfig = document.querySelector("#gear")

    const btnAddRF = document.querySelector("#addRF");
    const btnAddRNF = document.querySelector("#addRNF");
    const btnAddRN = document.querySelector("#addRN");

    btnAddRF.addEventListener("click", addRF)
    btnAddRNF.addEventListener("click", addRNF)
    btnAddRN.addEventListener("click", addRN)


    divInfoExport.onclick = (event) => {
        if(event.target === divInfoExport) closeInfoExport()
    }
    btnFechar.onclick = (event) => closeInfoExport()
    btnCopiarText.onclick = (event) => copyToClipboard(event)
    btnCopiarWord.onclick = (event) => copyToClipboard(event)
    
    iconExport.onclick = (event) => callExport()
    iconConfig.onclick = (event) => callConfig()
})()