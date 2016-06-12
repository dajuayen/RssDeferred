var indicesMostrados = [];
var feedsAMostrar = 5;

function pasarVariables(pagina, nombres) {
    pagina += "?";
    nomVec = nombres.split(",");
    for (i = 0; i < nomVec.length; i++) {
        pagina += nomVec[i] + "=" + escape(eval(nomVec[i])) + "&";
        pagina = pagina.substring(0, pagina.length - 1);
        location.href = pagina;
    }
}

//cadVariables = location.search.substring(1,location.search.length);

function vaciarLista() {
    $('.feed').remove();
    $('#lista').listview("refresh");
}
function disable(i) {
    $("#" + i).prop("disabled", true);
}
function reable(i) {
    $("#" + i).prop("disabled", false);
}

function buscarFeed1(idFeed, funcion) {
    var arrayfeed = [];
    //alert('buscarFeed');
    baseD.transaction(function(tx) {

        tx.executeSql('SELECT id,title,pubdate, leido FROM tabla WHERE id=' + idFeed + ' and borrado = 0', [], function(tx, rs) {

            if (rs.rows.length == 0) {
                arrayfeed = [0, 'Titulo', 'guid', 'link', 'fecha', 'description', 'no leido', 'no borrado'];
            } else {
                for (i = 0; i < rs.rows.length; i++) {
                    arrayfeed = [rs.rows.item(i).id, rs.rows.item(i).title, rs.rows.item(i).pubdate, rs.rows.item(i).leido];
                }
            }
        });
    }, function() {
    }, function() {
        /*alert('Feed = '+feed + ' tamaño = '+feed.length);
         alert('Id = ' + feed[0]);
         alert('title = ' + feed[1]);
         alert('guid = ' + feed[2]);
         alert('link = ' + feed[3]);
         alert('pubdate = ' + feed[4]);
         alert('description = ' + feed[5]);
         alert('leido = ' + feed[6]);
         alert('borrado = ' + feed[7]);*/
        funcion(arrayfeed);
    });
}

// *********************** Métodos navegación lista de feeds ********************
function losPrimeros() {
    alert('Entro en losPrimeros()');
    indicesMostrados.length = 0;
    indicesMostrados = normales.slice(0, feedsAMostrar);
    vaciarLista();
    if (indicesMostrados.length > 0) {
        for (i = 0; i < indicesMostrados.length; i++) {
            buscarFeed1(indicesMostrados[i], mostrarFeed2);
        }
        //alert(indicesMostrados);
    }
    disable('losprimeros');
    disable('losanteriores');
    reable('lossiguientes');
    reable('losultimos');
}

function losSiguientes() {
    alert('Entro en losSiguientes()');

    if (indicesMostrados.length == 0) {
        alert('No hay más Feeds que mostrar');
    } else {
        var ultimoMostrado = indicesMostrados[indicesMostrados.length - 1];
        var indexUltimoMostrado = normales.indexOf(ultimoMostrado);
        indicesMostrados.length = 0;
        indicesMostrados = normales.slice(indexUltimoMostrado + 1, indexUltimoMostrado + 1 + feedsAMostrar);
        alert(indicesMostrados);
        vaciarLista();
        if (indicesMostrados.length > 0) {
            for (i = 0; i < indicesMostrados.length; i++) {
                buscarFeed1(indicesMostrados[i], mostrarFeed2);
            }
        }
    }
}

function losAnteriores() {
    alert('Entro en losAnteriores()');

    if (indicesMostrados.length == 0) {
        alert('No hay más Feeds que mostrar');
    } else {
        var primeroMostrado = indicesMostrados[0];
        var indexPrimeroMostrado = normales.indexOf(primeroMostrado);
        indicesMostrados.length = 0;
        indicesMostrados = normales.slice(indexPrimeroMostrado - feedsAMostrar, indexPrimeroMostrado);
        alert(indicesMostrados);
        vaciarLista();
        if (indicesMostrados.length > 0) {
            for (i = 0; i < indicesMostrados.length; i++) {
                buscarFeed1(indicesMostrados[i], mostrarFeed2);
            }
        }
    }
}

function losUltimos() {
    alert('Entro en losUltimos()');

    if (indicesMostrados.length == 0) {
        alert('No hay más Feeds que mostrar');
    } else {
        var total = normales.length;
        var resto = total % feedsAMostrar;
        indicesMostrados.length = 0;
        if (resto == 0) {

            indicesMostrados = normales.slice(total - feedsAMostrar, total);
        } else {
            indicesMostrados = normales.slice(total - resto, total);
        }
        alert('Total feed = ' + total + '\n resto = ' + resto
                + '\n feeds a mostrar = ' + indicesMostrados);
        vaciarLista();
        if (indicesMostrados.length > 0) {
            for (i = 0; i < indicesMostrados.length; i++) {
                buscarFeed1(indicesMostrados[i], mostrarFeed2);
            }
        }
    }
}

// ************************ Métodos navegación feed ***************************

function primero() {
    getPrimero(mostrarInfo);
}

function ultimo() {
    getUltimo(mostrarInfo);
}

function anterior() {
    var elid = parseInt(localStorage.getItem("feedId"));
    var indexUltimoMostrado = normales.indexOf(elid);
    var idBuscar = normales[indexUltimoMostrado+1];
    localStorage.removeItem("feedId");
    localStorage.setItem("feedId", idBuscar.toString());
    buscarFeed(idBuscar, mostrarInfo);
}

function siguiente() {
    var elid = parseInt(localStorage.getItem("feedId"));
    var indexUltimoMostrado = normales.indexOf(elid);
    var idBuscar = normales[indexUltimoMostrado-1];
    localStorage.removeItem("feedId");
    localStorage.setItem("feedId", idBuscar.toString());
    buscarFeed(idBuscar, mostrarInfo);
}
