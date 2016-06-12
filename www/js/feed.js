//var feed = {"id": "0" , "titulo":"titulo" , "enlace": "", "estado" : "0", "leido": "0"};

function Feed(id, titulo, enlace, estado, leido, fecha, descripcion) {
    this.id = id;
    this.titulo = titulo;
    this.enlace = enlace;
    this.estado = estado;
    this.leido = leido;
    this.fecha = fecha;
    this.descripcion = descripcion;

    this.getId = function() {
        return this.id;
    }

    this.getTitulo = function() {
        return this.titulo;
    }

    this.getEnlace = function() {
        return this.enlace;
    }

    this.getEstado = function() {
        return this.estado;
    }

    this.getLeido = function() {
        return this.leido;
    }

    this.getFecha = function() {
        return this.fecha;
    }

    this.getDescripcion = function() {
        return this.descripcion;
    }

    this.setId = function(id) {
        this.id = id;
    }

    this.setTitulo = function(titulo) {
        this.titulo = titulo;
    }

    this.setLeido = function(leido) {
        this.leido = leido;
    }

    this.setEstado = function(estado) {
        this.estado = estado;
    }

    this.setLeido = function(leido) {
        this.leido = leido;
    }

    this.setFecha = function(fecha) {
        this.fecha = fecha;
    }

    this.setDescripcion = function(descripcion) {
        this.descripcion = descripcion;
    }

    this.resetear = function() {
        this.id = "";
        this.titulo = "";
        this.enlace = "";
        this.estado = "";
        this.leido = "";
        this.fecha = "";
        this.descripcion = "";
    }

    this.rellenarFeed = function(arrayFeed) {
        //feeds[i] = [rs.rows.item(i).id, rs.rows.item(i).title, rs.rows.item(i).guid, rs.rows.item(i).link, rs.rows.item(i).pubdate, rs.rows.item(i).description, rs.rows.item(i).leido, rs.rows.item(i).borrado];
        this.id = arrayFeed[0];
        this.titulo = arrayFeed[1];
        this.enlace = arrayFeed[3];
        this.estado = arrayFeed[7];
        this.leido = arrayFeed[6];
        this.fecha = arrayFeed[4];
        this.descripcion = arrayFeed[5];
    }
}
function cargarDatos() {
    var elid = parseInt(localStorage.getItem("feedId"));
    buscarFeed(elid, mostrarInfo);
}

function mostrarInfo(arrayFeed) {
    elfeed.resetear();
    elfeed.rellenarFeed(arrayFeed);
    alert('Titutlo : ' + elfeed.getTitulo());
    //elfeed = [rs.rows.item(i).id, rs.rows.item(i).title, rs.rows.item(i).guid, rs.rows.item(i).link, rs.rows.item(i).pubdate, rs.rows.item(i).description, rs.rows.item(i).leido, rs.rows.item(i).borrado];
    $("#titulo").html("");
    $("#titulo").html(elfeed.getTitulo());
    $("#fecha").html("");
    $("#fecha").html(elfeed.getFecha());
    $("#descripcion").html("");
    $("#descripcion").html(elfeed.getDescripcion());
    $("#enlace").removeAttr('href');
    $("#enlace").attr('href', elfeed.getEnlace());
}



