const xhr = new XMLHttpRequest()
const url = "https://www.googleapis.com/books/v1/volumes?q=";

function notUn(item, qtd){
    if(typeof item == "undefined") return("?")
    else{
        if(item.length > qtd) return item.substring(0, qtd) + "...";
        else return item;
    }
}
function loadDetails(link){
    let autores = "";
    let loop  = true;

    fetch(link.id).then(res => res.json()).then(livros => {
        for(let j = 0; j < livros.volumeInfo.authors.length; j++){
        if(j == 0) autores = livros.volumeInfo.authors[j];
    else if(j > 0){
        if(j != (livros.volumeInfo.authors.length - 1)) autores += ", " + livros.volumeInfo.authors[j];
        else autores += " e " + livros.volumeInfo.authors[j];
    }
}
        
        document.querySelector("header").innerHTML = "<div class='link_books'><table><tr><td align='center'><img src='" + livros.volumeInfo.imageLinks.thumbnail + "'><br></td></tr><tr><td><br></td></tr><tr><td><b>Título:</b> " + notUn(livros.volumeInfo.title, 100) + "</td></tr><tr><td><b>Autores:</b> " + notUn(autores, 100) + "</td></tr><tr><td><b>Editora:</b> " + livros.volumeInfo.publisher + "</td></tr><tr><td><b>Publicação:</b> " + livros.volumeInfo.publishedDate + "</td></tr><tr><td><b>Páginas:</b> " + livros.volumeInfo.pageCount + "</td></tr><tr><td>&nbsp;<br></td></tr><tr><td style='text-align: center'><a href='"+ livros.volumeInfo.infoLink +"' target='_blank'>Saiba mais</a>&nbsp;&nbsp;&nbsp;<a href='"+ livros.accessInfo.webReaderLink +"' target='_blank'>Preview</a></td></tr></table></div>";
    });
}

function submitForm(){
    let loop = true;
    let titulo = document.getElementById("titulo").value
    let autor = document.getElementById("autor").value
    let topico = document.getElementById("topico").value
    let params = "";

    if(titulo.length >= 1 || autor.length >= 1 || topico.length >= 1){
        if(titulo.length >= 1) params +="+intitle:" + titulo
        if(autor.length >= 1) params += "+inauthor:" + autor
        if(topico.length >= 1) params += "+subject:" + topico

        params += "&printType=books&orderBy=relevance"

        xhr.open("GET", url + params);
        xhr.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                let livros = JSON.parse(this.responseText)
                let autores = "";
                loop = false
                document.querySelector("header").innerHTML = "";

                if(typeof livros.items != "undefined"){
                    for(let i = 0; i < 10; i++){
                        for(let j = 0; j < livros.items[i].volumeInfo.authors.length; j++){
                            if(j == 0) autores = livros.items[i].volumeInfo.authors[j]
                            else if(j > 0){
                                if(j != (livros.items[i].volumeInfo.authors.length - 1)) autores += ", " + livros.items[i].volumeInfo.authors[j];
                                else autores += " e " + livros.items[i].volumeInfo.authors[j]
                            }
                        }
                        document.querySelector("header").innerHTML += "<div class='books'><table><tr><td rowspan='4'><img src='" + livros.items[i].volumeInfo.imageLinks.smallThumbnail + "' height='125px'></td><td rowspan='4'>&nbsp;</td><td><b>Título:</b> " + notUn(livros.items[i].volumeInfo.title, 65) + "</td></tr><tr><td><b>Autores:</b> " + notUn(autores, 35) + "</td></tr><tr><td><b>Editora:</b> " + notUn(livros.items[i].volumeInfo.publisher, 35) + "</td></tr><tr><td><b>Publicação:</b> " + notUn(livros.items[i].volumeInfo.publishedDate) + "</td></tr><tr><td align='center' colspan='3'><br><br><b><a href='#' id='"+ livros.items[i].selfLink +"' onclick='loadDetails(this)'>Detalhes</a></b></td></tr></table></div>";
                    }
                }
            }
        }

        xhr.send();
    }

    else{
        alert("!");
    }
}

document.getElementById("buscar").addEventListener("click", submitForm);
document.getElementById("titulo").onkeydown = function(e){ if(e.keyCode == 13) submitForm() }
document.getElementById("autor").onkeydown = function(e){ if(e.keyCode == 13) submitForm() }
document.getElementById("topico").onkeydown = function(e){ if(e.keyCode == 13) submitForm() }