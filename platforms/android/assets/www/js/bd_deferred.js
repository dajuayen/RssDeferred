var baseD = null;
var FEED_URL = 'http://www.larioja.com/rss/2.0/?seccion=ultima-hora';
var descargados = []; //array temporal feeds descargados
var guardados = [];
var borrados = []; // array (indice) con los ids de los feeds borrados 
var favoritos = []; // array (indice) con los ids de los feeds favoritos
var normales = []; //array (indice) con los ids de los feeds en estado normal
var recuperados = []; //array con los feeds a mostrar 
var timer;
var timer2;
var timer3;
var descarga;
var guardado;
var clasificados;
var elfeed = new Feed(0, "", "", "", "", "", "");
var valor = -1;


function mostrarLista2() {
    document.addEventListener("deviceready", crearBD, false);
}

/**
 * 
 * @returns {undefined} 
 */
function crearBD() {

    if (baseD == null) {
        baseD = window.sqlitePlugin.openDatabase({name: 'misfeedsdeferred.db', location: 1}, function(transaction) {
            transaction.executeSql('CREATE TABLE IF NOT EXISTS tabla (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, guid TEXT NOT NULL, link TEXT NOT NULL, pubdate TEXT NOT NULL, description TEXT NOT NULL, leido INTEGER NOT NULL, borrado INTEGER NOT NULL)', [],
                    function(tx, result) {
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
        proceso();
    }
}

function create() {
    baseD = window.sqlitePlugin.openDatabase({name: 'misfeedsdeferred.db', location: 1});
    baseD.executeSql('CREATE TABLE IF NOT EXISTS tabla (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, guid TEXT NOT NULL, link TEXT NOT NULL, pubdate TEXT NOT NULL, description TEXT NOT NULL, leido INTEGER NOT NULL, borrado INTEGER NOT NULL)');

}

function getBD() {
    if (baseD == null) {
        create();
    }
    return baseD;
}

function proceso() {
    //alert('proceso()');
    descarga = descargaRSS(FEED_URL);
    descarga.done(function() {
        guardado = guardarRSS(descargados);
        guardado.done(function() {
            clasificados = clasificarRSS();
            clasificados.done(function() {
                //alert('previo a enviaFeedsAFuncion2');
                //enviaFeedsAFuncion2(mostrarSeleccionRSS);
                losPrimeros();
            });
        });
    });
}

function descargaRSS(url) {
//alert('descargasRRS()');
    var deferred = $.Deferred();
    feed = new Feed("", "", "", "", "", "", "");
    timer = setInterval(function() {
        deferred.notify();
    }, 500);
    buscarRSS(url, deferred);
    return deferred.promise();
}

function guardarRSS(nuevos) {
//alert('guardarRSS()');
    var deferred2 = $.Deferred();
    timer2 = setInterval(function() {
        deferred2.notify();
    }, 500);
    guardarNuevos(nuevos, deferred2);
    return deferred2.promise();
}

function clasificarRSS() {
//alert('clasificarRSS()');
    var deferred3 = $.Deferred();
    timer3 = setInterval(function() {
        deferred3.notify();
    }, 500);
    clasificarFeeds(deferred3);
    return deferred3.promise();
}

/* ************************* Metodos de los Deferred ***************************************** */
function buscarRSS(url, diferido) {

    $.ajax({
        url: url,
        context: document.body,
        crossDomain: 'true',
        contentType: 'text/plain; charset=UTF-8',
        dataType: 'xml',
        success: function(res) {
            $(res).find("item").each(function() { // or "item" or whatever suits your feed          

                var $this = $(this);
                var titulo = $this.find("title").text();
                var guid = $this.find("guid").text();
                var link = $this.find("link").text();
                var fecha = $this.find("pubDate").text();
                var desc = $this.find("description").text();
                feed = [titulo, guid, link, fecha, desc, 0, 0];
                descargados.push(feed);
            });
            diferido.resolve();
        },
        error: function(xhr, status, errorThrown) {
            alert("Sorry, there was a problem!");
        }
    });
}

function guardarNuevos(nuevos, diferido) {
//alert("Nuevos feeds = " + nuevos.length);
    var ultimoAGuardar = false;
    if (nuevos.length == 0) {
        alert('no hay Feeds nuevos que guardar');
        diferido.resolve();
    } else {
        for (var i = nuevos.length - 1; i >= 0; i--) {
            var n = nuevos[i];
            if (i == 0) {
                ultimoAGuardar = true;
            }
            exiteFeed(n, ultimoAGuardar, diferido);
        }
    }
//alert('Fin de guardarNuevos()');
    nuevos.length = 0; //vaciamos el array
}

//'CREATE TABLE IF NOT EXISTS tabla (id, title, guid, link, pubdate, description, leido, borrado)'
function clasificarFeeds(diferido) {
//alert('clasificarFeeds()');
    baseD.transaction(function(tx) {
        tx.executeSql('SELECT id, borrado FROM tabla ORDER BY id DESC', [], function(tx, rs) {
//alert('Filas guardadas en la tabla = ' + rs.rows.length);
            if (rs.rows.length == 0) {
                feeds[0] = [0, 'Titulo', 'guid', 'link', 'fecha', 'description', 'no leido', 'no borrado'];
            } else {

                for (i = 0; i < rs.rows.length; i++) {
                    if (rs.rows.item(i).borrado == 1) {
                        borrados.push(rs.rows.item(i).id);
                    } else {
                        normales.push(rs.rows.item(i).id);
                    }
                }
//alert('Normales = ' + normales.length + ' borrados = ' + borrados.length);
            }
        });
    }, function() {
    }, function() {
//alert('hecho');
        diferido.resolve();
    });
}

function recuperarRSS(diferido, recuperados) {
    baseD.transaction(function(tx) {

        tx.executeSql('SELECT * FROM tabla WHERE borrado=0', [], function(tx, rs) {
            if (rs.rows.length == 0) {
                recuperados[0] = [0, 'Titulo', 'guid', 'link', 'fecha', 'description', 'no leido', 'no borrado'];
            } else {
                for (i = 0; i < rs.rows.length; i++) {
                    recuperados[i] = [rs.rows.item(i).id, rs.rows.item(i).title, rs.rows.item(i).guid, rs.rows.item(i).link, rs.rows.item(i).pubdate, rs.rows.item(i).description, rs.rows.item(i).leido, rs.rows.item(i).borrado];
                }
            }
        });
    }, function() {
    }, function() {
        diferido.resolve();
    });
}

/**
 * Método que recupera los feeds de la base de datos y 
 * se los pasa almacenados en un array a la 
 * función que recibe como parametro
 * @param {type} funcion que se 
 * @returns {enviaFeedsAFuncion2}
 */
function enviaFeedsAFuncion2(funcion) {
    alert('enviaFeedsAFuncion2()');
    feeds = [];
    baseD.transaction(function(tx) {
        tx.executeSql('SELECT * FROM tabla WHERE borrado = 0 ORDER BY id DESC LIMIT 6', [], function(tx, rs) {
            alert('Filas guardadas en la tabla = ' + rs.rows.length);
            if (rs.rows.length == 0) {
                feeds[0] = [0, 'Titulo', 'guid', 'link', 'fecha', 'description', 'no leido', 'no borrado'];
            } else {

                // 1- guardo los indices

                //muestro le número determinado de feeds 
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
    for (i = arrayFeeds.length - 1; i >= 0; i--) {
        mostrarFeed(arrayFeeds[i]);
    }
    $('#lista').listview("refresh"); //refresco la vista de la lista
}

function mostrarSeleccionRSS(arrayFeeds) {
    alert('mostrarSeleccionRSS');
    for (i = 0; i < arrayFeeds.length; i++) {
//alert(arrayFeeds[i]);
        mostrarFeed2(arrayFeeds[i]);
    }
    $('#lista').listview("refresh"); //refresco la vista de la lista
}

function mostrarFeed(feed) {
//alert('mostrarFeed');
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
    $('#lista').first().before(html);
    $(".feed").on("click", function() {
        $(this).children('a').children('h3').css('color', 'red');
        leidoFeed($(this).attr("id").split("-")[1]);
        $('#lista').listview("refresh"); //refresco la vista de la lista
    });
}

/*
 * Método que muestra el feed
 * Esta versión inserta los feeds sin el enlace
 * si se pulsa sobre el botón envía a otro html 
 */
function mostrarFeed2(arrayfeed) {
//alert('mostrarFeed2');
    var html = "";
//    id , title, pubdate, leido;
    if (arrayfeed[3] == 1) {        
        html += '<li class=\"feed\" id=\"feed-' + arrayfeed[0] + '\">';
        html += '<a href="prueba.html" onclick ="pasarFeed(' + arrayfeed[0] + ')"><h3><span style=\"color:red;\">' + arrayfeed[1] + '</span></h3></a>';
        html += '</li>';
    } else {

        html += '<li class=\"feed\" id=\"feed-' + arrayfeed[0] + '\">';
        html += '<a href="prueba.html" onclick ="pasarFeed(' + arrayfeed[0] + ')"><h3>' + arrayfeed[1] + '</h3></a>';
        html += '</li>';
    }
//alert('mostrarFeed2: insertado');
    $('#lista').first().before(html);
    $(".feed").on("click", function() {
        $(this).children('a').children('h3').css('color', 'red');
        leidoFeed($(this).attr("id").split("-")[1]);
        $('#lista').listview("refresh"); //refresco la vista de la lista
    });
}

//************************************** Usados ****************************************************
function exiteFeed(feed, ultimoregistro, diferido) {
//alert('entro exiteFeed ' + feed);
    var existe = false;
    baseD.transaction(function(tx) {

        tx.executeSql('SELECT * FROM tabla WHERE title=? and pubdate=?', [feed[0], feed[3]], function(tx, rs) {
//            alert('Filas guardadas en la tabla = ' + rs.rows.length);
            if (rs.rows.length > 0) {
                existe = true;
            }
        });
    }, function() {
    }, function() {
        if (!existe) {
//            alert('nueva noticia');
            insertarFeed(feed, ultimoregistro, diferido);
        } else if (existe && ultimoregistro) {
            diferido.resolve();
        }

    });
}

function insertarFeed(feed, ultimoRegistro, diferido) {
    var executeQuery = "INSERT INTO tabla (title, guid, link, pubdate, description, leido, borrado) VALUES (?,?,?,?,?,?,?)";
    baseD.transaction(function(tx) {
        tx.executeSql(executeQuery, feed,
                function(tx, res) {
                    setServiceConfig(feed[3]);
                    if (ultimoRegistro) {
                        //alert('ultimo guardado');
                        diferido.resolve();
                        descargados.length = 0; //vaciamos el array
                    }
                }, function(e) {
            alert('Error insertarFila : ' + e);
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

function pasarFeed(id) {
    var stringId = id.toString();
    localStorage.setItem("feedId", stringId);
}

function buscarFeed(idFeed, funcion) {
    var arrayfeed = [];
    alert('buscarFeed. IdFeed = ' + idFeed);
    baseD = getBD();
    if (baseD == null) {
        alert('La base de datos es null en este punto');
    }
    baseD.transaction(function(tx) {
//tx.executeSql('SELECT id,title,pubdate, leido FROM tabla WHERE id=' + idFeed + ' and borrado = 0', [], function(tx, rs) {
        tx.executeSql('SELECT * FROM tabla WHERE id=' + idFeed, [], function(tx, rs) {

            if (rs.rows.length == 0) {
                alert('Paso 2 A');
                arrayfeed = [0, 'Titulo', 'guid', 'link', 'fecha', 'description', 'no leido', 'no borrado'];
            } else {
                alert('rs.rows.length = ' + rs.rows.length);
                for (i = 0; i < rs.rows.length; i++) {
                    arrayfeed = [rs.rows.item(i).id, rs.rows.item(i).title, rs.rows.item(i).guid, rs.rows.item(i).link, rs.rows.item(i).pubdate, rs.rows.item(i).description, rs.rows.item(i).leido, rs.rows.item(i).borrado];
                    alert('arrayfeed[i] : \n' + arrayfeed);
//    id , title, guid, link, pubdate, description, leido, borrado;
//                    aux = [rs.rows.item(i).id, rs.rows.item(i).title, rs.rows.item(i).guid, rs.rows.item(i).link, rs.rows.item(i).pubdate, rs.rows.item(i).description, rs.rows.item(i).leido, rs.rows.item(i).borrado];
//                    feeds.push(aux);
//                    feeds.push([rs.rows.item(i).id, rs.rows.item(i).title, rs.rows.item(i).guid, rs.rows.item(i).link, rs.rows.item(i).pubdate, rs.rows.item(i).description, rs.rows.item(i).leido, rs.rows.item(i).borrado]);
                }
            }
        });
    }, function() {
    }, function() {
        alert(arrayfeed);
        funcion(arrayfeed);
    });
}

function getPrimero(funcion) {
    arrayfeed = [];
    alert('getPrimero()');
    baseD = getBD();
    if (baseD == null) {
        alert('La base de datos es null en este punto');
    }
    baseD.transaction(function(tx) {
        tx.executeSql('SELECT * FROM tabla WHERE borrado = 0 and MAX(id)', [], function(tx, rs) {
            alert('Filas guardadas en la tabla = ' + rs.rows.length);
            if (rs.rows.length == 0) {
                arrayfeed = [0, 'Titulo', 'guid', 'link', 'fecha', 'description', 'no leido', 'no borrado'];
            } else {
                // 1- guardo los indices

                //muestro le número determinado de feeds 
                for (i = 0; i < rs.rows.length; i++) {
                    arrayfeed = [rs.rows.item(i).id, rs.rows.item(i).title, rs.rows.item(i).guid, rs.rows.item(i).link, rs.rows.item(i).pubdate, rs.rows.item(i).description, rs.rows.item(i).leido, rs.rows.item(i).borrado];
                }
            }
        });
    }, function() {
    }, function() {
        funcion(arrayfeed);
    });
}

function getUltimo(funcion) {
    arrayfeed = [];
    alert('getUltimo()');
    baseD = getBD();
    if (baseD == null) {
        alert('La base de datos es null en este punto');
    }
    baseD.transaction(function(tx) {
        tx.executeSql('SELECT * FROM tabla WHERE borrado = 0 and MIN(id)', [], function(tx, rs) {
            alert('Filas guardadas en la tabla = ' + rs.rows.length);
            if (rs.rows.length == 0) {
                arrayfeed = [0, 'Titulo', 'guid', 'link', 'fecha', 'description', 'no leido', 'no borrado'];
            } else {
                // 1- guardo los indices

                //muestro le número determinado de feeds 
                for (i = 0; i < rs.rows.length; i++) {
                    arrayfeed = [rs.rows.item(i).id, rs.rows.item(i).title, rs.rows.item(i).guid, rs.rows.item(i).link, rs.rows.item(i).pubdate, rs.rows.item(i).description, rs.rows.item(i).leido, rs.rows.item(i).borrado];
                }
            }
        });
    }, function() {
    }, function() {
        funcion(arrayfeed);
    });
}

//************************************** Sin Usar ****************************************************

function eliminarFeed(idFeed) {
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

function totalFeeds() {
    var executeQuery = "Select id from tabla WHERE borrado=0";
    alert('totalFeeds()');
    baseD.transaction(function(tx) {
        tx.executeSql(executeQuery, [], function(tx, rs) {
            var total = rs.rows.length;
            alert('Filas guardadas en la tabla = ' + total);
            if (total == 0) {
                feeds[0] = [0, 'Titulo', 'guid', 'link', 'fecha', 'description', 'no leido', 'no borrado'];
            } else {
                // 1- guardo los indices

                //muestro le número determinado de feeds 
                for (i = 0; i < rs.rows.length; i++) {
                    if ((i + feedsAMostrar) % feedsAMostrar == 0) {
                        indices.push(rs.rows.item(i).id);
                    }
                }
            }
        });
    }, function() {
    }, function() {
        funcion(feeds);
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
    alert('enviaFeedsAFuncion');
    baseD.transaction(function(tx) {

        tx.executeSql('SELECT * FROM tabla WHERE borrado=0 ORDER BY id LIMIT 6', [], function(tx, rs) {
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
