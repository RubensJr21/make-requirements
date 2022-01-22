String.prototype.capitalize = function() {
    // Converte a primeira letra para maiúscula
	return this.charAt(0).toUpperCase() + this.substr(1);
}

var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === "attributes") {
            mutation.target.update()
        }
    });
});

class Box extends HTMLElement {
    constructor(){
        super()
        observer.observe(this, {
            attributes: true, //configure it to listen to attribute changes
        })
        this.dependencies = []
        this.conflicts = []

        this.dependents = []
        // conflitantes
        this.conflicting = []

        this.eventFunctions = {
            // Técnica de retornar uma outra função para ter valor "dinamicamente" estáticos
            curryingOnMouseMove: (borderColor, elementForFill) => {
                return (event) => {
                    const x = event.x
                    const y = event.y
                    const newX = x+5
                    const newY = y+10
                    const viewDC = document.querySelector(".viewDC")

                    const sizeBodyY = document.body.offsetHeight
                    if(y + viewDC.offsetHeight >= sizeBodyY && newY-viewDC.offsetHeight > 5){
                        viewDC.style.left = `${newX}px`
                        viewDC.style.top = `${newY-viewDC.offsetHeight}px`
                    } else{
                        viewDC.style.left = `${newX}px`
                        viewDC.style.top = `${newY+10}px`
                    }

                    const input = document.querySelector("#viewDC")
                    if (!input.checked){
                        input.checked = true
                        this.functions.fillPreview(viewDC, elementForFill)
                        viewDC.style.setProperty("--borderColor", borderColor)
                    }
                }
            }
        }
        this.functions = {
            createDivInput: ({id, title}) => {
                title = title.toLowerCase()

                var div = document.createElement("div")
                div.id = `div${(id ? id : title).capitalize()}`

                var label = document.createElement("label")
                label.for = id ? id : title
                label.innerText = `${title.capitalize()}:`

                var input = document.createElement("input")
                input.type = "text"
                input.name = id ? id :title
                input.id = id ? id : title

                div.appendChild(label)
                div.appendChild(input)
                return div;
            },

            createDependencieOrConflict: ({
                className, textContent, isPreview,
                getOnMouseMove, onMouseOut, onDblClick
            }) => {
                var div = document.createElement("div")
                // textContent não se repete
                div.id = textContent
                div.classList.add(className);
                div.textContent = textContent
                
                if(isPreview) return div
                
                div.title = "Clique duas vezes para deletar"
                div.onmousemove = getOnMouseMove(div)
                div.onmouseout = onMouseOut

                div.ondblclick = onDblClick
                return div
            },
            createDependencieBoxOrConflictBox: ({
                legendTitle, divId, isPreview,
                inputName, inputId, inputKeyDown
            }) => {
                var fieldset = document.createElement("fieldset")

                var legend = document.createElement("legend")
                legend.innerText = `${legendTitle}:`

                var div = document.createElement("div")
                div.id = divId

                fieldset.appendChild(legend)
                fieldset.appendChild(div)

                if(isPreview) return fieldset
            
                var input = document.createElement("input")
                input.type = "text"
                input.name = inputName
                input.id = inputId
                input.onkeydown = (e) => {
                    // Verifica se tecla pressionada foi enter
                    // && Se o é uma auto-referência de dependência
                    if(e.keyCode == 13 && e.target.value != this.id) {
                        // this == mr-rf OU mr-rnf OU mr-rn
                        inputKeyDown(document.getElementById(e.target.value))
                    }
                }
                fieldset.appendChild(input)
                return fieldset
            },

            createR: (id) => {
                var div = document.createElement("div")
                if(id) div.id = id
                return div;
            },
            
            createID: (ID) => {
                var h3 = document.createElement("h3")
                h3.textContent = ID
                h3.id = "id"
                return h3;    
            },
            
            createName: () => {
                return this.functions.createDivInput({title: "nome"});
            },
            
            createDescription: () => {
                var fieldset = document.createElement("fieldset")
                fieldset.id = "fieldsetDescricao"

                var legend = document.createElement("legend")
                legend.innerText = "Descrição:"

                var textarea = document.createElement("textarea")
                textarea.name = "descricao"
                textarea.id = "descricao"

                fieldset.appendChild(legend)
                fieldset.appendChild(textarea)

                return fieldset;
            },
            
            createOrigin: () => {
                return this.functions.createDivInput({title: "origem"})
            },
            
            createResponsible: () => {
                return this.functions.createDivInput({id: "responsavel", title: "Responsável"})
            },
            
            createInterested: () => {
                return this.functions.createDivInput({title: "interessados"})
            },
            
            createPriority: () => {
                var div = document.createElement("div")
                div.id = "divPrioridade"
                var label = document.createElement(label)
                label.for = "prioridade"
                label.innerText = "Prioridade:"
                var select = document.createElement("select")
                select.name = "prioridade"
                select.id = "prioridade"
                var op1 = document.createElement("option")
                var op2 = document.createElement("option")
                var op3 = document.createElement("option")
                op1.value = "Desejável"
                op1.innerText = "Desejável"
                op2.value = "Importante"
                op2.innerText = "Importante"
                op3.value = "Imprescindível"
                op3.innerText = "Imprescindível"
                op3.selected = true
                select.appendChild(op1)
                select.appendChild(op2)
                select.appendChild(op3)
                div.appendChild(label)
                div.appendChild(select)
                return div
            },
            
            createDependencie: (dependencie, config = {isPreview: false}) => {
                const getOnMouseMove = (div) => this.eventFunctions.curryingOnMouseMove("#6eda2c", div);
                const onMouseOut = () => document.querySelector("#viewDC").checked = false;
                const onDblClick = (e) => {
                    this.notifyAllDependencies({type: "destroy"})
                    const dependencie = document.getElementById(e.path[0].id)
                    this.removeDependencies(dependencie)
                    // Esconde o Preview após remoção
                    document.querySelector("#viewDC").checked = false
                }
                
                return this.functions.createDependencieOrConflict({
                    className: "divSpanDepenID",
                    textContent: dependencie,
                    isPreview: config.isPreview,
                    getOnMouseMove,
                    onMouseOut,
                    onDblClick,
                })
            },
            createDependenciesBox: (config = {isPreview: false}) => {
                const inputKeyDown = (element) => {
                    if(element && !this.dependencies.includes(element)) {
                        this.addDependencies(element)
                        element.addDependent(this)
                    }
                }

                return this.functions.createDependencieBoxOrConflictBox({
                    legendTitle: "Dependências",
                    divId: "divDepenID",
                    isPreview: config.isPreview,
                    inputName: "dependencia",
                    inputId: "dependenciaINPUT",
                    inputKeyDown,
                })
            },
            
            createConflict: (conflict, config = {isPreview: false}) => {
                const getOnMouseMove = (div) => this.eventFunctions.curryingOnMouseMove("#da0001", div);
                const onMouseOut = () => document.querySelector("#viewDC").checked = false;
                const onDblClick = (e) => {
                    this.notifyAllConflicts({type: "destroy"})
                    const conflict = document.getElementById(e.path[0].id)
                    this.removeConflicts(conflict)
                    // Esconde o Preview após remoção
                    document.querySelector("#viewDC").checked = false
                }
                
                return this.functions.createDependencieOrConflict({
                    className: "divSpanConfliID",
                    textContent: conflict,
                    isPreview: config.isPreview,
                    getOnMouseMove,
                    onMouseOut,
                    onDblClick,
                })
            },
    
            createConflictsBox: (config = {isPreview: false}) => {
                const inputKeyDown = (element) => {
                    if(element && !this.conflicts.includes(element)){
                        this.addConflicts(element)
                        element.addConflicting(this)
                    }
                }
                
                return this.functions.createDependencieBoxOrConflictBox({
                    legendTitle: "Conflitos",
                    divId: "divConfliID",
                    isPreview: config.isPreview,
                    inputName: "conflitos",
                    inputId: "conflitosINPUT",
                    inputKeyDown,
                })
            },
    
            createRemoveButton: (type) => {
                var button = document.createElement("button")
                button.id = "remover"
                button.innerText = "Remover"
                button.onclick = () => {
                    var node = document.getElementById(this.parentElement.id);
                    node.removeChild(this);
                    this.notifyAllDependencies({type: "destroy"})
                    this.notifyAllDependents({type: "destroy"})
                    this.notifyAllConflicts({type: "destroy"})
                    this.notifyAllConflicting({type: "destroy"})
                    updateBoxes(type, node)
                }
                return button
            },

            fillPreview: (v, currentElement) => {
                const element = document.querySelector(`#${currentElement.textContent}`)
                
                const info = element.getInfos({type: "short"})

                const id = document.createElement("h1")
                id.textContent = `ID: ${info.id}`
        
                const nome = document.createElement("h2")
                nome.textContent = `Nome: ${info.nome}`
        
                const descricao = document.createElement("h2")
                descricao.textContent = `Descrição: ${info["descrição"]}`

                const dependencies = this.functions.createDependenciesBox({ isPreview: true })
                const divDepenID = dependencies.querySelector("div#divDepenID")
                info["dependências"].forEach((element, index, array) => {
                    divDepenID.appendChild(this.functions.createDependencie(element.id, {isPreview: true}))
                })
                dependencies.appendChild(divDepenID)
        
                const conflitos = this.functions.createConflictsBox({ isPreview: true })
                var divConfliID = conflitos.querySelector("div#divConfliID")
                info.conflitos.forEach((element, index, array) => {
                    divConfliID.appendChild(this.functions.createConflict(element.id, { isPreview: true }))
                })
                conflitos.appendChild(divConfliID)
        
                v.innerHTML = ""
                v.appendChild(id)
                v.appendChild(nome)
                v.appendChild(descricao)
                v.appendChild(dependencies)
                v.appendChild(conflitos)
                const idPure = currentElement.id.replace(/[^A-Z]/g, "")
                const tagNames = {
                    "RF": "green",
                    "RNF": "orangered",
                    "RN": "indigo"
                }
                v.style.setProperty("--backgroundColor", tagNames[idPure])
            }
        }
    }

    getInfos(config = {type: "short"}){
        /*
            type: ("short" | "full")
        */
        const root = this.shadowRoot
        if(config.type === "short") {
            return {
                id: this.id,
                nome: root.getElementById("nome").value,
                "descrição": root.getElementById("descricao").value,
                "dependências": this.dependencies,
                conflitos: this.conflicts,
            }
        } else if(config.type === "full"){
            return {
                id: this.id,
                nome: root.getElementById("nome").value,
                "descrição": root.getElementById("descricao").value,
                origem: root.getElementById("origem").value,
                "responsável": root.getElementById("responsavel").value,
                interessados: root.getElementById("interessados").value,
                prioridade: root.getElementById("prioridade").value,
                "dependências": this.dependencies.map(item => item.id),
                conflitos: this.conflicts.map(item => item.id),
            }
        }
    }

    addDependencies(element){
        console.log(`${this.id}:`, this, "depende de", element)
        this.dependencies.push(element)
        this.updateDependencies()
    }
    removeDependencies(element){
        console.log(`${this.id}:`, this, "não depende mais de", element)
        const d = this.dependencies
        this.dependencies = d.filter((item, index, array) => {
            return item != element
        })
        this.updateDependencies()
    }
    updateDependencies(){
        console.log(`${this.id}:`, "Atualizando dependências do", this)
        console.log(`${this.id}:`, "dependencies:", this.dependencies)
        const div = this.shadowRoot.getElementById("divDepenID")
        div.innerHTML = ""
        this.dependencies.forEach((element, index, array) => {
            div.appendChild(this.functions.createDependencie(element.id))
        })
    }
    notifyAllDependencies({type}){
        /* type = (destroy | updateID) */
        if(type === "destroy"){
            this.dependencies.forEach((element, index, array) => {
                element.removeDependents(this)
            })
        }
    }
    addDependent(element){
        console.log(`${this.id}:`, "Adicionando", element, "como dependente")
        this.dependents.push(element)
        console.log(`${this.id}:`, "dependents", this.dependents)
    }
    removeDependents(element){
        console.log(`${this.id}:`, "Removendo", element, "como dependente")
        const d = this.dependents
        this.dependents = d.filter((item, index, array) => {
            return item != element
        })
        console.log(`${this.id}:`, "dependents", this.dependents)
    }
    notifyAllDependents({type}){
        /* type = (destroy | updateID) */
        if(type === "destroy"){
            this.dependents.forEach((element, index, array) => {
                element.removeDependencies(this)
            })
        } else if(type === "updateID"){
            this.dependents.forEach((element,index, array) => {
                element.updateDependencies()
            })
        }
    }


    addConflicts(element){
        console.log(`${this.id}:`, this, "conflita com", element)
        this.conflicts.push(element)
        this.updateConflicts()
    }
    removeConflicts(element){
        console.log(`${this.id}:`, this, "não conflita mais com", element)
        const c = this.conflicts
        this.conflicts = c.filter((item, index, array) => {
            return item != element
        })
        this.updateConflicts()
    }
    updateConflicts(){
        console.log(`${this.id}:`, "Atualizando conflitos do:", this)
        console.log(`${this.id}:`, "conflicts:", this.conflicts)
        const div = this.shadowRoot.getElementById("divConfliID")
        div.innerHTML = ""
        this.conflicts.forEach((element, index, array) => {
            div.appendChild(this.functions.createConflict(element.id))
        })
    }
    notifyAllConflicts({type}){
        /* type = (destroy | updateID) */
        if(type === "destroy"){
            this.conflicts.forEach((element, index, array) => {
                element.removeConflicting(this)
            })
        }
    }
    addConflicting(element){
        console.log(`${this.id}:`, "Adicionando", element, "como conflitante")
        this.conflicting.push(element)
        console.log(`${this.id}:`, "conflicting", this.conflicting)
    }
    removeConflicting(element){
        console.log(`${this.id}:`, "Removendo", element, "como conflitante")
        const c = this.conflicting
        this.conflicting = c.filter((item, index, array) => {
            return item != element
        })
        console.log(`${this.id}:`, "conflicting", this.conflicting)
    }
    notifyAllConflicting({type}){
        /* type = (destroy | updateID) */
        if(type === "destroy"){
            this.conflicting.forEach((element,index, array) => {
                element.removeConflicts(this)
            })
        } else if(type === "updateID"){
            this.conflicting.forEach((element,index, array) => {
                element.updateConflicts()
            })
        }
    }

    createStyle(type){
        var style = document.createElement("style")
        const types = {
            RF:  "\n.RF{\nborder-color: green;\n}\n",
            RNF: "\n.RNF{\nborder-color: orangered;\n}\n",
            RN:  "\n.RN{\nborder-color: indigo;\n}\n",
        }
        style.textContent = `
/* Objeto de BOX as caixas de requisitos e regras */
.requisito_regra {
    border-style: dashed;
    border-width: 2px;
    border-radius: 20px;
    padding: 0px 10px 10px 15px;
    margin-bottom: 10px;
}
${types[type] || ""}
fieldset#fieldsetDescricao > textarea#descricao
{
    width: -webkit-fill-available;
	height: 5.5vh;
    resize: none;
    font-size: 1.2em;
}

#fieldsetDescricao, #divNome, #divOrigem,
#divResponsavel, #divInteressados, #divPrioridade
{
    margin-inline-start: 2px;
    margin-inline-end: 2px;
    margin-bottom: 6px;
    display: flex;
}

#divNome > input, #divOrigem > input,
#divResponsavel > input, #divInteressados > input,
#divPrioridade > select
{
    flex-grow: 1;
    margin-left: 5px;
}

#divDepenID, #divConfliID {
    display: flex;
    flex-wrap: wrap;
}

.divSpanDepenID, .divSpanConfliID{
    font-size: small;
    border-radius: 7%;
    max-width: fit-content;
    padding: 7px 14px;
    margin: 5px;
    cursor: default
}
.divSpanDepenID{
    background-color: #6eda2c;
}
.divSpanConfliID{
    background-color: #da0001;
}
.divSpanDepenID:hover, .divSpanConfliID:hover{
    filter: brightness(85%);
}

.requisito_regra > button#remover {
    margin: 6px 0px;
}
        `
        return style
    }

    fill(type){
        var div = this.functions.createR(`${type}`)
        div.classList.add("requisito_regra")
        div.classList.add(type)
        div.appendChild(this.functions.createID("{ID}"))
        div.appendChild(this.functions.createName())
        div.appendChild(this.functions.createDescription())
        div.appendChild(this.functions.createOrigin())
        div.appendChild(this.functions.createResponsible())
        div.appendChild(this.functions.createInterested())
        div.appendChild(this.functions.createPriority())
        div.appendChild(this.functions.createDependenciesBox())
        div.appendChild(this.functions.createConflictsBox())
        div.appendChild(this.functions.createRemoveButton(type))
        return div
    }

    update(){
        const setID = () => {
            this.shadowRoot.getElementById("id").textContent = this.id
            this.shadowRoot.querySelector("div").id = this.id
        }
        setID()
    }

    
    build(type){
        const shadow = this.attachShadow({mode: "open"})
        var div = this.fill(type)
        shadow.appendChild(this.createStyle(type))
        shadow.appendChild(div)
    }
}

class RequisitoFuncional extends Box {
    constructor(){
        super()
        this.build("RF")
    }
}
class RequisitoNaoFuncional extends Box {
    constructor(){
        super()
        this.build("RNF")
    }
}
class RegraDeNegocio extends Box {
    constructor(){
        super()
        this.build("RN")
    }
}

customElements.define("mr-rf", RequisitoFuncional)
customElements.define("mr-rnf", RequisitoNaoFuncional)
customElements.define("mr-rn", RegraDeNegocio)