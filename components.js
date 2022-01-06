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
    #divSpanDepenID{
    font-size: small;
    background-color: #6eda2c;
    border-radius: 10%;
    max-width: fit-content;
    padding: 5px 5px;
    margin: 5px
    }
    #divDepenID{
    display: flex;
    flex-wrap: wrap;
    }
    
    #divSpanConfliID{
    font-size: small;
    background-color: #da0001;
    border-radius: 10%;
    max-width: fit-content;
    padding: 5px 5px;
    margin: 5px
    }
    #divConfliID{
    display: flex;
    flex-wrap: wrap;
    }
        `
        return style
    }

    fill(type){
        const createRF = (id) => {
            var div = document.createElement("div")
            if(id) div.id = id
            return div;
        }
        
        const createID = (ID) => {
            var h3 = document.createElement("h3")
            h3.textContent = ID
            h3.id = "id"
            return h3;    
        }
        
        const createName = () => {
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
            return div
        }
        
        const createDescription = () => {
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
            return div
        }
        
        const createOrigin = () => {
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
        }
        
        const createResponsible = () => {
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
        }
        
        const createInterested = () => {
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
        }
        
        const createPriority = () => {
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
        }
        
        const createDependencie = (_) => {
            console.log("Criando dependência do: ", _)
            var div = document.createElement("div")
            div.id = "divSpanDepenID"
            var span = document.createElement("span")
            span.textContent = "{ID 0}"
            div.appendChild(span)
            return div
        }
        const createDependenciesBox = () => {
            var fieldset = document.createElement("fieldset")
            var legend = document.createElement("legend")
            legend.innerText = "Dependências:"
            var div = document.createElement("div")
            div.classList.add("test")
            div.id = "divDepenID"
            // div.appendChild(createDependencie())
        
            var input = document.createElement("input")
            input.type = "text"
            input.name = "dependencia"
            input.id = "dependenciaINPUT"
            input.onkeydown = (e) => {
                if(e.keyCode == 13) {
                    // this == r-f OU r-n-f OU r-n
                    const div = this.shadowRoot.getElementById("divDepenID")
                    div.appendChild(createDependencie("RF1"))
                }
            }

            fieldset.appendChild(legend)
            fieldset.appendChild(div)
            fieldset.appendChild(input)
            return fieldset
        }
        
        const createConflict = (_) => {
            console.log("Criando conflito com: ", _)
            var div = document.createElement("div")
            div.id = "divSpanConfliID"
            var span = document.createElement("span")
            span.textContent = "{ID 0}"
            div.appendChild(span)
            return div
        }

        const createConflictsBox = () => {
            var fieldset = document.createElement("fieldset")
            var legend = document.createElement("legend")
            legend.innerText = "Dependências:"
            var div = document.createElement("div")
            div.classList.add("test")
            div.id = "divConfliID"
            // div.appendChild(createConflict())
        
            var input = document.createElement("input")
            input.type = "text"
            input.name = "conflitos"
            input.id = "conflitosINPUT"
            input.onkeydown = (e) => {
                if(e.keyCode == 13) {
                    // this == r-f OU r-n-f OU r-n
                    const div = this.shadowRoot.getElementById("divConfliID")
                    div.appendChild(createConflict("RF1"))
                }
            }
        
            fieldset.appendChild(legend)
            fieldset.appendChild(div)
            fieldset.appendChild(input)
        
            return fieldset
        }

        const createRemoveButton = () => {
            var button = document.createElement("button")
            button.innerText = "Remover"
            button.onclick = () => {
                // console.log(this.parentElement)
                var node = document.getElementById(this.parentElement.id);
                node.removeChild(this);
                const tagNames = {
                    "RF": "r-f",
                    "RNF": "r-n-f",
                    "RN": "r-n"
                }
                const boxes = node.querySelectorAll(tagNames[type])
                boxes.forEach((item, id) => {
                    item.id = `${type}${id+1}`
                })
            }
            return button
        }
        
        var div = createRF(`${type}1`)
        div.classList.add("requisito_regra")
        div.classList.add(type)
        div.appendChild(createID("{ID}"))
        div.appendChild(createName())
        div.appendChild(createDescription())
        div.appendChild(createOrigin())
        div.appendChild(createResponsible())
        div.appendChild(createInterested())
        div.appendChild(createPriority())
        div.appendChild(createDependenciesBox())
        div.appendChild(createConflictsBox())
        div.appendChild(createRemoveButton())
        return div
    }

    update(){
        const setID = () => {
            this.shadowRoot.getElementById("id").textContent = this.idd
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

customElements.define("r-f", RequisitoFuncional)
customElements.define("r-n-f", RequisitoNaoFuncional)
customElements.define("r-n", RegraDeNegocio)