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
    compilaInfos()
};

function closeInfoExport(){
    infoExport.checked = false
}
function compilaInfos(){
    const all = [
        ...document.querySelectorAll("mr-rf"),
        ...document.querySelectorAll("mr-rnf"),
        ...document.querySelectorAll("mr-rn")
    ]

    const infoAll = all.map(item => item.getInfos({type: "full"}))

    const infoAllSepareted = {}
    const regExpRF = /(RF[0-9]+)/g
    const regExpRNF = /(RNF[0-9]+)/g
    const regExpRN = /(RN[0-9]+)/g

    infoAllSepareted.RF = infoAll.filter(item => item.id.match(regExpRF))
    infoAllSepareted.RNF = infoAll.filter(item => item.id.match(regExpRNF))
    infoAllSepareted.RN = infoAll.filter(item => item.id.match(regExpRN))

    const formatExport = (stringFinal, currentItem, index, array) => {
        const depAndCon = (anterior, item, index, array) =>  anterior + item + (index < array.length-1 ? ", " : "")
            
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

    const exportedRF = infoAllSepareted.RF.reduce(formatExport, "============RF============\n\n")
    const exportedRNF = infoAllSepareted.RNF.reduce(formatExport, "============RNF===========\n\n")
    const exportedRN = infoAllSepareted.RN.reduce(formatExport, "============RN============\n\n")
    
    document.querySelector(".infoExport > pre").textContent = exportedRF+exportedRNF+exportedRN
}
async function copyToClipboard(event){
    const txtExportCompiled = document.querySelector(".infoExport > pre").textContent
    await navigator.clipboard.writeText(txtExportCompiled)
    event.target.classList.toggle("clicado")
    event.target.textContent = "Copiado..."
    setTimeout(() => {
        event.target.classList.toggle("clicado")
        event.target.textContent = "Copiar"
    }, 1500)
}

(() => {
    const divInfoExport = document.querySelector(".infoExport")
    const btnFechar = document.querySelector(".infoExport > button#fechar")
    const btnCopiar = document.querySelector(".infoExport > button#copiar")
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
    btnCopiar.onclick = (event) => copyToClipboard(event)
    
    iconExport.onclick = (event) => callExport()
    iconConfig.onclick = (event) => callConfig()
})()