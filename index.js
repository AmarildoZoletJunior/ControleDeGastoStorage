let $nome = document.querySelector(".nomeInput");
let $valor = document.querySelector(".valorInput");
let $data = document.querySelector(".dataInput");
let $submit = document.querySelector(".enviar");
let $historico = document.querySelector(".historico-corpo");
let balançototal = document.querySelector(".total-corpo");
let modalValor = document.querySelector(".nome-modal");
let modalData = document.querySelector(".data-modal");
let audioadd = document.querySelector(".audioadd")

let banco = {
    usuario: [
    ],
    add(nomes, valores, datas, ) {        //CREATE
        let newId = Date.now();
        let soma;
        let $historico = document.querySelector(".historico-corpo");
            banco.usuario.push({
                id:newId,
                nome: nomes,
                valor: valores,
                data: datas,
            });
            audioadd.play();
            this.adicionarLocal(banco.usuario);
        $historico.insertAdjacentHTML("afterbegin", `<div class="transacao" id="${newId}">
            <i class="fa-solid fa-xmark"></i>
            <i class="fa-solid fa-pen-to-square"></i>
            <div class="nome"><p>Nome:${nomes}</p></div>
            <div class="valor"><p>Valor:R$${valores} </p> </div>
           <div class="data"><p>Data:${datas}</p></div>
        </div>`);
        
        balançototal.innerHTML = `R$${soma}`;
    },
    converterArray() {
        let novo = localStorage.getItem("banco de dados")
        let nova = JSON.parse(novo);
        if(nova === null){
            return nova;
        }else{
            banco.usuario = nova;
            return nova;
        }
    },
    adicionarLocal(bancodados) {
        let conversao = JSON.stringify(bancodados);
        localStorage.setItem("banco de dados", conversao);
        return banco.converterArray();
    },
    leitura() {   //READ
        let $historico = document.querySelector(".historico-corpo");
        let salvei = this.converterArray()
        if (salvei === null) {
            return;
        } else {
            let leu = salvei.forEach((elemento) => {
                $historico.insertAdjacentHTML("afterbegin", `<div class="transacao" id="${elemento.id}">
                <i class="fa-solid fa-xmark"></i>
                <i class="fa-solid fa-pen-to-square"></i>
                <div class="nome"><p>Nome:${elemento.nome}</p></div>
                <div class="valor"><p>Valor:R$${elemento.valor} </p> </div>
               <div class="data"><p>Data:${elemento.data}</p></div>
            </div>`);
            });
            
            console.log(banco.usuario)
        }
    },
    deletar(evento){
        let idDelet;
        let deletado;
        let cliqueBotao = evento.target.className;
        if(cliqueBotao == "fa-solid fa-xmark"){
        let filho = evento.target;
        let pai = filho.parentNode;
        let idDelet = pai.getAttribute("id");
        let transformar = Number(idDelet);
        pai.remove();
        let deletado = banco.usuario.filter((elemento)=>{
            return elemento.id != transformar;
        })
        console.log(deletado);
        this.adicionarLocal(deletado);
        valorTotal();
        valorGasto();
        valorGanho();
    }
},
editar(evento){
        let idDelet;
        let deletado;
        let cliqueBotao = evento.target.className;
        if(cliqueBotao == "fa-solid fa-pen-to-square"){
        let editar = document.querySelector(".modal");
        editar.style.display = "flex";
        let sai = document.querySelector("#sair");
            sai.addEventListener("click", function () {
                editar.style.display = "none"
            })
        let submitModal = document.querySelector(".submit-modal");
            submitModal.addEventListener("click",function(eventos){  
            eventos.preventDefault();
            valorModal();
            dataModal()
        if(valorModal() == true && dataModal() == true){      
        let filho = evento.target;
        let pai = filho.parentNode;
        let idDelet = pai.getAttribute("id");
        let transformar = Number(idDelet);
        let mudado = banco.usuario.find((elemento)=>{
            if(elemento.id === transformar){
               pai.innerHTML = `<i class="fa-solid fa-xmark"></i>
               <i class="fa-solid fa-pen-to-square"></i>
               <div class="nome"><p>Nome:${elemento.nome}</p></div>
               <div class="valor"><p>Valor:R$${modalValor.value} </p> </div>
              <div class="data"><p>Data:${modalData.value}</p></div>
           </div>`
           elemento.valor = modalValor.value;
           elemento.data = modalData.value;
           editar.style.display = "none"
                     }
                     valorTotal();
                     valorGasto();
                     valorGanho();
                });  
                banco.adicionarLocal(banco.usuario)    //find 
            }
        });         //submit evento
    }   //if true valorModal
    
    } //if botao editar

    
        }//final evento editar

banco.leitura();
$submit.addEventListener("click", function (evento) {
    evento.preventDefault();
    data();
    valor();
    nome();
    if(data() && valor() && nome() == true){
    banco.add($nome.value, $valor.value, $data.value);
    }
    valorTotal();
    valorGasto();
    valorGanho();
});

valorTotal();
valorGasto();
valorGanho();
function valorTotal(){
    let corpo = document.querySelector(".total-receita")
        let nova = [];
    let total = banco.usuario.forEach((elementonovo)=>{
        return  nova.push(Number(elementonovo.valor))
    });
    let tot = nova.reduce((novo,arr)=>{
        return novo + arr;
    },0)
     if(tot === 0){
        corpo.className = "total-receita neutro base-receita";
        balançototal.innerHTML = `R$${tot}`
    }if(tot > 0){
        corpo.className = "total-receita positivo base-receita";
        balançototal.innerHTML = `R$${tot}`
     }else if(tot < 0){
        corpo.className = "total-receita negativo base-receita";
        balançototal.innerHTML = `R$${tot}`
    }
}
function valorGasto(){
    let gasto = document.querySelector(".gasto-corpo");
    let nova = [];
    let total = banco.usuario.forEach((elementonovo)=>{
        return  nova.push(Number(elementonovo.valor))
    });
    let totalFilter = nova.filter((elemento)=>{
        return elemento < 0;
    });
    let tot = totalFilter.reduce((novo,arr)=>{
        return novo + arr;
    },0)

    if(tot == 0){
    gasto.innerHTML = `R$${tot}`
    }else{
        gasto.innerHTML = `R$${tot}` 
    }
}
function valorGanho(){
    let ganho = document.querySelector(".ganhos-corpo");
    let nova = [];
    let total = banco.usuario.forEach((elementonovo)=>{
        return  nova.push(Number(elementonovo.valor))
    });
    let totalFilter = nova.filter((elemento)=>{
        return elemento > 0;
    });
    let tot = totalFilter.reduce((novo,arr)=>{
        return novo + arr;
    },0)
    ganho.innerHTML = `R$${tot}`
}

function data(){
    let regexData = /^(?:(?:31(\/)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/g;
    if(regexData.test($data.value) == false){
       return errado($data,"Digite a data no formato xx/xx/xxxx");
    }else if($data.value.length <= 7){
        return errado($data,"Esta faltando algo")
    }else{
        return certo($data);
    }
}
function valor(){
    let regexValor = /^((\-|\+)[1-9]\d{0,3}(\.\d{3})*\.\d{2})$/g
    if(regexValor.test($valor.value)== false){
        return errado($valor,"Digite o valor no padrão +xx,x ou -xx,x")
    }else{
       return certo($valor);
    }
}
function nome(){
    let regexName = /^([a-zA-Zà-úÀ-Ú]|-|_|\s)+$/g;
    if($nome.value.length <= 2){
        return errado($nome,"Digite no minimo 3 caracteres");
    } else if(regexName.test($nome.value)== false){
       return errado($nome,"Digite apenas letras");
    } else {
        return certo($nome);
    }
}
$historico.addEventListener("click",function(evento){
    banco.deletar(evento);
    banco.editar(evento);
    valorTotal();
    valorGasto();
    valorGanho();
});
modalValor.addEventListener("keyup",function(evento){
    valorModal();
})
modalData.addEventListener("keyup",function(evento){
    dataModal();
})


let errado = ((input,mensagem)=>{
    let pai = input.parentNode;
    let small = pai.querySelector("small");
    small.textContent = mensagem;

    pai.className = "cadastro-input error";
    return false;
})


let certo = ((input)=>{
    let pai = input.parentNode;

    pai.className = "cadastro-input sucess";
    return true;
});


let erradoModal = ((input,mensagem)=>{
    let pai = input.parentNode;
    let small = pai.querySelector("small");
    small.textContent = mensagem;

    pai.className = "modal-form error";
    return false;
});

let certoModal = ((input)=>{
    let pai = input.parentNode;

    pai.className = "modal-form sucess";
    return true;
});
function valorModal(){
    let regexValor = /^((\-|\+)[1-9]\d{0,2}(\.\d{3})*.\d{2})$/g;
if(regexValor.test(modalValor.value)== false){
    console.log("errou")
    return erradoModal(modalValor,"Digite o valor no padrão +xx,x ou -xx,x")
}else{
    console.log("acertou")
   return certoModal(modalValor);
    }
    }
    function dataModal(){
        let regexData = /^(?:(?:31(\/)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/g;
        if(regexData.test(modalData.value) == false){
           return erradoModal(modalData,"Digite a data no formato xx/xx/xxxx");
        }else if(modalData.length <= 7){
            return erradoModal(modalData,"Esta faltando algo")
        }else{
            return certoModal(modalData);
        }
        }




