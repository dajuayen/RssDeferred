/* 
 * 1- Mostramos los rss de la base
 * 2- buscamos nuevos rss
 * 3- comprobamos si hay nuevos.
 * 4- si hay nuevos los guardamos y mostramos.
 */

var baseD = null;
var FEED_URL = 'http://www.larioja.com/rss/2.0/?seccion=ultima-hora';
var descargados = [];
var guardados = [];
var timer;
var timer2;
var descarga;
var guardado;

function mostrarLista2() {
    document.addEventListener("deviceready", crearBD
//    function() {
//        crearBD();
//        descarga = descargaRSS(FEED_URL);
//        descarga.done(function() {
//            //guardarNuevos(descargados);
//            guardado = guardarRSS(descargados);
//            guardado.done(function (){
//                enviaFeedsAFuncion2(mostrarLista());
//            });
//        });
//    }
            , false);
}

function proceso() {
    alert("Entro en proceso()");
    descarga = descargaRSS(FEED_URL);
    descarga.done(function() {
        //guardarNuevos(descargados);
        guardado = guardarRSS(descargados);
        guardado.done(function() {
            enviaFeedsAFuncion2(mostrarListaRSS);
        });
    });
}

/**
 * 
 * @returns {undefined} 
 */
function crearBD() {
    alert("Entro en crearBD()");
    if (baseD == null) {
//        alert('vamos a crear la base datos');
        baseD = window.sqlitePlugin.openDatabase({name: 'misfeedsdeferred.db', location: 1}, function(transaction) {
//                alert('entro en crear la tabla');
            transaction.executeSql('CREATE TABLE IF NOT EXISTS tabla (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, guid TEXT NOT NULL, link TEXT NOT NULL, pubdate TEXT NOT NULL, description TEXT NOT NULL, leido INTEGER NOT NULL, borrado INTEGER NOT NULL)', [],
                    function(tx, result) {
                        alert("Table created successfully");
//                        enviaFeedsAFuncion2(mostrarListaRSS);
                        proceso();
                    },
                    function(error) {
                        alert("Error occurred while creating the table.");
                    });
        }, function(error) {
            alert('Error al crear miBD. \n Código : ' + error.code);
        });
    } else {
        alert('base de datos ya creada');
//        enviaFeedsAFuncion(mostrarListaRSS);
        proceso();
    }
}

function descargaRSS(url) {
    alert("Entro en descargarRSS()");
    var deferred = $.Deferred();

    timer = setInterval(function() {
        deferred.notify();
    }, 1000);

    buscarRSS(url, deferred);

    return deferred.promise();
}

function guardarRSS(nuevos) {
    alert("Entro en guardarRSS()");
    var deferred2 = $.Deferred();

    timer2 = setInterval(function() {
        deferred2.notify();
    }, 1000);

    guardarNuevos(nuevos,deferred2);
//    recuperarRSS(FEED_URL, deferred);

    return deferred2.promise();
}

function descargar() {
    $.when(buscarRSS()).then(function() {
        alert("Refresca la lista tras guardar los nuevos");
        $('#lista').listview("refresh");
    });
}

function buscarRSS(url, diferido) {
    alert('entro en buscarRSS');

    $.ajax({
        url: url,
        context: document.body,
        crossDomain: 'true',
        contentType: 'text/plain; charset=UTF-8',
        dataType: 'xml',
        // Code to run if the request succeeds;
        // the response is passed to the function
        success: function(res) {
//            alert('entro en success');

            $(res).find("item").each(function() { // or "item" or whatever suits your feed          

                var $this = $(this);

                var titulo = $this.find("title").text();
                var guid = $this.find("guid").text();
                var link = $this.find("link").text();
                var fecha = $this.find("pubDate").text();
                var desc = $this.find("description").text();
                feed = [titulo, guid, link, fecha, desc, 0, 0];
//                alert('feed: ' + feed);
                //exiteFeed(feed);
//                insertarFeed(feed);
                descargados.push(feed);

            });
//            alert('The End');
            //guardarNuevos(descargados);
            diferido.resolve();
            //enviaFeedsAFuncion2(mostrarListaRSS);

        },
        // Code to run if the request fails; the raw request and
        // status codes are passed to the function
        error: function(xhr, status, errorThrown) {
            alert("Sorry, there was a problem!");

        }
    });

//    $(document).ajaxSuccess(function(e, x, opc) {
//        alert("Solicitud completada satisfactoriamente.");
//        enviaFeedsFuncion(mostrarListaRSS);
//    });




//    $.when(buscarRSS()).then(enviaFeedsFuncion(mostrarListaRSS));
}

function recuperarRSS(diferido, recuperados) {
    baseD.transaction(function(tx) {

        tx.executeSql('SELECT * FROM tabla WHERE borrado=0', [], function(tx, rs) {
            alert('Filas guardadas en la tabla = ' + rs.rows.length);
            if (rs.rows.length == 0) {
                recuperados[0] = [0, 'Titulo', 'guid', 'link', 'fecha', 'description', 'no leido', 'no borrado'];
            } else {
                for (i = 0; i < rs.rows.length; i++) {
                    recuperados[i] = [rs.rows.item(i).id, rs.rows.item(i).title, rs.rows.item(i).guid, rs.rows.item(i).link, rs.rows.item(i).pubdate, rs.rows.item(i).description, rs.rows.item(i).leido, rs.rows.item(i).borrado];
                    //    id , title, guid, link, pubdate, description, leido, borrado;
//                    aux = [rs.rows.item(i).id, rs.rows.item(i).title, rs.rows.item(i).guid, rs.rows.item(i).link, rs.rows.item(i).pubdate, rs.rows.item(i).description, rs.rows.item(i).leido, rs.rows.item(i).borrado];
//                    feeds.push(aux);
//                    feeds.push([rs.rows.item(i).id, rs.rows.item(i).title, rs.rows.item(i).guid, rs.rows.item(i).link, rs.rows.item(i).pubdate, rs.rows.item(i).description, rs.rows.item(i).leido, rs.rows.item(i).borrado]);
                }
            }
        });
    }, function() {
    }, function() {
        diferido.resolve();

    });
}

function guardarNuevos(nuevos, diferido) {
    alert("entro en guardarNuevos()");
    var ultimoAGuardar = false;
    for (var i = nuevos.length - 1; i >= 0; i--) {
        var n = nuevos[i];
        if (i == 0) {
            ultimoAGuardar = true;
        }
        exiteFeed(n, ultimoAGuardar, diferido);
    }
    nuevos.length = 0;//vaciamos el array
}

/**
 * Método que recupera los feeds de la base de datos y 
 * se los pasa almacenados en un array a la 
 * función que recibe como parametro
 * @param {type} funcion que se 
 * @returns {enviaFeedsAFuncion2}
 */
function enviaFeedsAFuncion2(funcion) {
    alert('entro enviaFeedsFuncion2');
    feeds = [];

    baseD.transaction(function(tx) {
        tx.executeSql('SELECT * FROM tabla WHERE borrado=0', [], function(tx, rs) {
            alert('Filas guardadas en la tabla = ' + rs.rows.length);
            if (rs.rows.length == 0) {
                feeds[0] = [0, 'Titulo', 'guid', 'link', 'fecha', 'description', 'no leido', 'no borrado'];
            } else {
                for (i = 0; i < rs.rows.length; i++) {
                    feeds[i] = [rs.rows.item(i).id, rs.rows.item(i).title, rs.rows.item(i).guid, rs.rows.item(i).link, rs.rows.item(i).pubdate, rs.rows.item(i).description, rs.rows.item(i).leido, rs.rows.item(i).borrado];
                }
            }
        });
    }, function() {
    }, function() {
        funcion(feeds);
    });
}

function mostrarListaRSS(arrayFeeds) {

    alert('entro en mostrarListaRSS. Número de Feeds: ' + arrayFeeds.length);

    for (i = arrayFeeds.length - 1; i >= 0; i--) {

//        alert('Feed nº: ' + i + '\n' +arrayFeeds[i]);
        mostrarFeed(arrayFeeds[i]);
    }
    alert("Lista mostrada");
//    alert('Refresca la lista');
    $('#lista').listview("refresh"); //refresco la vista de la lista
}

function mostrarFeed(feed) {
//    alert("entro en mostrarFeed. Feed : \n" + feed);
    var html = "";
//    id , title, guid, link, pubdate, description, leido;
    if (feed[6] == 1) {
        html += '<li class=\"feed\" id=\"feed-' + feed[0] + '\">';
        html += '<a href="' + feed[3] + '"><h3><span style=\"color:red;\">' + feed[1] + '</span></h3></a>';
        html += '<p> id: ' + feed[0] + ' : ' + feed[4] + '</p>';
        html += '<form><input class=\"borrarFeed\" type=\"checkbox\">Borrar</form></li>';
    } else {
        html += '<li class=\"feed\" id=\"feed-' + feed[0] + '\">';
        html += '<a href="' + feed[3] + '"><h3>' + feed[1] + '</h3></a>';
        html += '<p> id: ' + feed[0] + ' : ' + feed[4] + '</p>';
        html += '<form><input class=\"borrarFeed\" type=\"checkbox\">Borrar</form></li>';
    }
//    alert(html);
    $('#lista').first().before(html);
//    $('#lista').append(html);

    $(".feed").on("click", function() {
        $(this).children('a').children('h3').css('color', 'red');
        leidoFeed($(this).attr("id").split("-")[1]);
        alert('Refresca la lista');
        $('#lista').listview("refresh"); //refresco la vista de la lista
    });
//    alert('Refresca la lista');
//    $('#lista').listview("refresh");
}

//***********************************************************************************************

function insertarFeed(feed, ultimoRegistro,diferido) {
    alert('Entro en guardarFeed. Feed : \n' + feed);
    var executeQuery = "INSERT INTO tabla (title, guid, link, pubdate, description, leido, borrado) VALUES (?,?,?,?,?,?,?)";

    baseD.transaction(function(tx) {
        tx.executeSql(executeQuery, feed,
                function(tx, res) {
                    alert("insertId: " + res.insertId);
                    alert("Feed a mostrar : " + feed);
//                    mostrarFeed(feed, res.insertId);
                    setServiceConfig(feed[3]);
//                    mostrarFeed(feed);
                    if (ultimoRegistro) {
                        diferido.resolve();
                        descargados.length = 0;//vaciamos el array
                    }
                }, function(e) {
            alert('Error insertarFila : ' + e);
        });
    });
}

function eliminarFeed(idFeed) {
//    alert('Entro en guardarFeed. Feed : \n' + feed);
    var executeQuery = "DELETE FROM tabla WHERE id=?";

    baseD.transaction(function(tx) {
        tx.executeSql(executeQuery, [idFeed],
                function(tx, res) {
//                    alert("insertId: " + res.insertId);
//                    mostrarFeed(feed, res.insertId);
                }, function(e) {
            alert('Error insertarFila : ' + e);
        });
    });
}

function borrarFeed(idFeed) {

    var executeQuery = "UPDATE tabla SET borrado=1 WHERE id=?";

    baseD.transaction(function(tx) {
        tx.executeSql(executeQuery, [1, idFeed],
                function(tx, res) {
                    alert('Feed borrado');
                }, function(e) {
            alert('Error marcar como leido : ' + e);
        });
    });
}

function leidoFeed(idFeed) {
//    alert('Entro en guardarFeed. Feed : \n' + feed);
    var executeQuery = "UPDATE tabla SET leido=? WHERE id=?";

    baseD.transaction(function(tx) {
        tx.executeSql(executeQuery, [1, idFeed],
                function(tx, res) {
//                    alert('Feed leido');
//                    alert("insertId: " + res.insertId);
//                    mostrarFeed(feed, res.insertId);
                }, function(e) {
            alert('Error marcar como leido : ' + e);
        });
    });
}

function exiteFeed(feed, ultimoregistro, diferido) {
//    alert('entro exiteFeed ' + feed);
    var exite = false;

    baseD.transaction(function(tx) {

        tx.executeSql('SELECT * FROM tabla WHERE title=? and pubdate=?', [feed[0], feed[3]], function(tx, rs) {
//            alert('Filas guardadas en la tabla = ' + rs.rows.length);
            if (rs.rows.length > 0) {
                exite = true;
            }
        });
    }, function() {
    }, function() {
        if (!exite) {
//            alert('nueva noticia');
            insertarFeed(feed, ultimoregistro, diferido);
        }

    });
}

function borrarSelecionados() {
    $('#lista').each(function() {
        var $this = $(this).text();
        alert('elemento : ' + $this.toArray());
        var ck = $this.children('form').children('checkbox').val();
//        $('input:checkbox[class=borrar]').attr('checked',false);
        alert('Marcado borrar = ' + ck);
        if (ck) {
            alert('Entro en previo para borrar');
            borrarFeed($(this).attr("id").split("-")[1]);
        }
    });
    alert('mostrar lista tras borrar');
    enviaFeedsAFuncion(mostrarListaRSS);
}

function enviaFeedsAFuncion(funcion) {
//    alert('entro enviaFeedsFuncion');
    feeds = [];

    baseD.transaction(function(tx) {

        tx.executeSql('SELECT * FROM tabla WHERE borrado=0', [], function(tx, rs) {
            alert('Filas guardadas en la tabla = ' + rs.rows.length);
            if (rs.rows.length == 0) {
                feeds[0] = [0, 'Titulo', 'guid', 'link', 'fecha', 'description', 'no leido', 'no borrado'];
            } else {
                for (i = 0; i < rs.rows.length; i++) {
                    feeds[i] = [rs.rows.item(i).id, rs.rows.item(i).title, rs.rows.item(i).guid, rs.rows.item(i).link, rs.rows.item(i).pubdate, rs.rows.item(i).description, rs.rows.item(i).leido, rs.rows.item(i).borrado];
                    //    id , title, guid, link, pubdate, description, leido, borrado;
//                    aux = [rs.rows.item(i).id, rs.rows.item(i).title, rs.rows.item(i).guid, rs.rows.item(i).link, rs.rows.item(i).pubdate, rs.rows.item(i).description, rs.rows.item(i).leido, rs.rows.item(i).borrado];
//                    feeds.push(aux);
//                    feeds.push([rs.rows.item(i).id, rs.rows.item(i).title, rs.rows.item(i).guid, rs.rows.item(i).link, rs.rows.item(i).pubdate, rs.rows.item(i).description, rs.rows.item(i).leido, rs.rows.item(i).borrado]);
                }
            }
        });
    }, function() {
    }, function() {
        funcion(feeds);
    });
}