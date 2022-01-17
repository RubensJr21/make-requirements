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

        this.functions = {
            createRF: (id) => {
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
                var div = document.createElement("div")
                var label = document.createElement("label")
                label.for = "nome"
                label.innerText = "Nome:"
                var input = document.createElement("input")
                input.type = "text"
                input.name = "nome"
                input.id = "nome"
                div.appendChild(label)
                div.appendChild(input)
                return div;
            },
            
            createDescription: () => {
                var div = document.createElement("div")
                var label = document.createElement(label)
                label.for = "descricao"
                label.innerText = "Descrição:"
                var input = document.createElement("input")
                input.type = "text"
                input.name = "descricao"
                input.id = "descricao"
                div.appendChild(label)
                div.appendChild(input)
                return div;
            },
            
            createOrigin: () => {
                var div = document.createElement("div")
                var label = document.createElement(label)
                label.for = "origem"
                label.innerText = "Origem:"
                var input = document.createElement("input")
                input.type = "text"
                input.name = "origem"
                input.id = "origem"
                div.appendChild(label)
                div.appendChild(input)
                return div
            },
            
            createResponsible: () => {
                var div = document.createElement("div")
                var label = document.createElement(label)
                label.for = "responsavel"
                label.innerText = "Responsável:"
                var input = document.createElement("input")
                input.type = "text"
                input.name = "responsavel"
                input.id = "responsavel"
                div.appendChild(label)
                div.appendChild(input)
                return div
            },
            
            createInterested: () => {
                var div = document.createElement("div")
                var label = document.createElement(label)
                label.for = "interessados"
                label.innerText = "Interessados:"
                var input = document.createElement("input")
                input.type = "text"
                input.name = "interessados"
                input.id = "interessados"
                div.appendChild(label)
                div.appendChild(input)
                return div
            },
            
            createPriority: () => {
                var div = document.createElement("div")
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
                op1.selected = true
                op2.value = "Importante"
                op2.innerText = "Importante"
                op3.value = "Imprescindível"
                op3.innerText = "Imprescindível"
                select.appendChild(op1)
                select.appendChild(op2)
                select.appendChild(op3)
                div.appendChild(label)
                div.appendChild(select)
                return div
            },
            
            createDependencie: (dependencie) => {
                var div = document.createElement("div")
                div.id = "divSpanDepenID"

                var span = document.createElement("span")
                span.textContent = dependencie
                span.id = dependencie

                var button = document.createElement("button")
                button.textContent = "X"
                button.onclick = () => {
                    this.dependencies.forEach((element, index, array) => {
                        element.remDependents(this)
                    })
                    const dependencie = button.parentElement
                    const divDependencies = dependencie.parentElement
                    divDependencies.removeChild(dependencie)
                }
                
                div.appendChild(span)
                div.appendChild(button)
                return div
            },
            createDependenciesBox: () => {
                var fieldset = document.createElement("fieldset")
                var legend = document.createElement("legend")
                legend.innerText = "Dependências:"
                var div = document.createElement("div")
                div.id = "divDepenID"
            
                var input = document.createElement("input")
                input.type = "text"
                input.name = "dependencia"
                input.id = "dependenciaINPUT"
                input.onkeydown = (e) => {
                    // Verifica se tecla pressionada foi enter
                    // && Se o é uma auto-referência de dependência
                    if(e.keyCode == 13 && e.target.value != this.id) {
                        // this == mr-rf OU mr-rnf OU mr-rn
                        const element = document.getElementById(e.target.value)
                        if(element && !this.dependencies.includes(element)) {
                            this.addDependencies(element)
                            this.updateDependencies()
                            element.addDependent(this)
                        }
                    }
                }
    
                fieldset.appendChild(legend)
                fieldset.appendChild(div)
                fieldset.appendChild(input)
                return fieldset
            },
            
            createConflict: (conflict) => {
                var div = document.createElement("div")
                div.id = "divSpanConfliID"

                var span = document.createElement("span")
                span.textContent = conflict

                var button = document.createElement("button")
                button.textContent = "X"
                button.onclick = () => {
                    this.conflicts.forEach((element, index, array) => {
                        element.remConflicting(this)
                    })
                    const conflict = button.parentElement
                    const divConflicts = conflict.parentElement
                    divConflicts.removeChild(conflict)
                }

                div.appendChild(span)
                div.appendChild(button)
                return div
            },
    
            createConflictsBox: () => {
                var fieldset = document.createElement("fieldset")
                var legend = document.createElement("legend")
                legend.innerText = "Conflitos:"
                var div = document.createElement("div")
                div.id = "divConfliID"
            
                var input = document.createElement("input")
                input.type = "text"
                input.name = "conflitos"
                input.id = "conflitosINPUT"
                input.onkeydown = (e) => {
                    // Verifica se tecla pressionada foi enter
                    // && Se o é uma auto-referência de conflito
                    if(e.keyCode == 13 && e.target.value != this.id) {
                        // this == mr-rf OU mr-rnf OU mr-rn
                        const element = document.getElementById(e.target.value)
                        if(element && !this.conflicts.includes(element)){
                            this.addConflicts(element)
                            const div = this.shadowRoot.getElementById("divConfliID")
                            div.appendChild(this.functions.createConflict(e.target.value))
                            element.addConflicting(this)
                        }
                    }
                }
            
                fieldset.appendChild(legend)
                fieldset.appendChild(div)
                fieldset.appendChild(input)
            
                return fieldset
            },
    
            createRemoveButton: (type) => {
                var button = document.createElement("button")
                button.innerText = "Remover"
                button.onclick = () => {
                    // console.log(this.parentElement)
                    var node = document.getElementById(this.parentElement.id);
                    node.removeChild(this);
                    const tagNames = {
                        "RF": "mr-rf",
                        "RNF": "mr-rnf",
                        "RN": "mr-rn"
                    }
                    this.dependents.forEach((element,index, array) => {
                        element.remDependencies(this)
                    })
                    this.conflicting.forEach((element,index, array) => {
                        element.remConflicts(this)
                    })
                    const boxes = node.querySelectorAll(tagNames[type])
                    boxes.forEach((item, id) => {
                        item.id = `${type}${id+1}`
                        // Atualiza todas as dependências
                        item.dependents.forEach((item, index, array) => {
                            item.updateDependencies()
                            item.updateConflicts()
                        })
                        // Atualiza todos os conflitos
                        item.conflicts.forEach((item, index, array) => {
                            item.updateDependencies()
                            item.updateConflicts()
                        })
                    })
                }
                return button
            }
        }
    }

    addDependencies(element){
        console.log(`${this.id}:`, this, "depende de", element)
        this.dependencies.push(element)
    }
    remDependencies(element){
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
    addDependent(element){
        console.log(`${this.id}:`, "Adicionando", element, "como dependente")
        this.dependents.push(element)
        console.log(`${this.id}:`, "dependents", this.dependents)
    }
    remDependents(element){
        console.log(`${this.id}:`, "Removendo", element, "como dependente")
        const d = this.dependents
        this.dependents = d.filter((item, index, array) => {
            return item != element
        })
        console.log(`${this.id}:`, "dependents", this.dependents)
    }


    addConflicts(element){
        console.log(`${this.id}:`, this, "conflita com", element)
        this.conflicts.push(element)
    }
    remConflicts(element){
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
            // console.log(element.id)
        })
    }
    addConflicting(element){
        console.log(`${this.id}:`, "Adicionando", element, "como conflitante")
        this.conflicting.push(element)
        console.log(`${this.id}:`, "conflicting", this.conflicting)
    }
    remConflicting(element){
        console.log(`${this.id}:`, "Removendo", element, "como conflitante")
        const c = this.conflicting
        this.conflicting = c.filter((item, index, array) => {
            return item != element
        })
        console.log(`${this.id}:`, "conflicting", this.conflicting)
    }

    createStyle(type){
        var style = document.createElement("style")
        const RF =  ".RF{\nborder-color: green;\n}"
        const RNF = ".RNF{\nborder-color: orangered;\n}"
        const RN =  ".RN{\nborder-color: indigo;\n}"
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
#divSpanDepenID,
#divSpanConfliID{
    font-size: small;
    border-radius: 7%;
    max-width: fit-content;
    padding: 5px 5px;
    margin: 5px
}
#divSpanDepenID,
#divSpanDepenID > button{
    background-color: #6eda2c;
}
#divSpanConfliID,
#divSpanConfliID > button{
    background-color: #da0001;
}
#divSpanDepenID > button, 
#divSpanConfliID > button{
    /* background-color: transparent; */
    border: none !important;
    cursor: pointer;
    border-radius: 25%;
    margin-left: 5px
}
#divSpanDepenID > button:hover,
#divSpanConfliID > button:hover{
    /* Serve para escurecer cor aplicada */
    filter: brightness(75%);
}
#divDepenID{
    display: flex;
    flex-wrap: wrap;
}

#divConfliID{
    display: flex;
    flex-wrap: wrap;
}
        `
        return style
    }

    fill(type){
        var div = this.functions.createRF(`${type}`)
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
        // console.log(this)
        setID()
    }
}

class RequisitoFuncional extends Box {
    constructor(){
        super()
        this.build()
    }
    build(){
        const shadow = this.attachShadow({mode: "open"})
        var div = this.fill("RF")
        shadow.appendChild(this.createStyle("RF"))
        shadow.appendChild(div)
    }
}
class RequisitoNaoFuncional extends Box {
    constructor(){
        super()
        this.build()
    }
    build(){
        const shadow = this.attachShadow({mode: "open"})
        var div = this.fill("RNF")
        shadow.appendChild(this.createStyle("RNF"))
        shadow.appendChild(div)
    }
}
class RegraDeNegocio extends Box {
    constructor(){
        super()
        this.build()
    }

    build(){
        const shadow = this.attachShadow({mode: "open"})
        var div = this.fill("RN")
        shadow.appendChild(this.createStyle("RN"))
        shadow.appendChild(div)
    }
}

customElements.define("mr-rf", RequisitoFuncional)
customElements.define("mr-rnf", RequisitoNaoFuncional)
customElements.define("mr-rn", RegraDeNegocio)