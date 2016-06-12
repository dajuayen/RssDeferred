var myService;
var timerArrancarServicio;
var timerActivarTimer;

var timerRegistrarArranque;
var timerActivarEscuchador;

function iniciarServicio() {
    document.addEventListener('deviceready', function() {
        myService = cordova.plugins.myService;
        arrancar();
    }, true);
}


/**
 * Método que arranca el servicio
 * habilita el Timer
 * registra al servicio para que se inicie con el arranque del dispositivo
 * registra el servicio para escuchar cambios. 
 */
function arrancar() {
    myService.getStatus(function(info) {
        //alert('Iniciamos el arranque');
        handleSuccess(info);
        if (!info.ServiceRunning) {
            arrancarTodo();
        } else {
//            alert("servicio.TimerEnabled = " + info.TimerEnabled);
            if (!info.TimerEnabled) {
                myService.enableTimer(60 * 1000,
                        function(r) {
                            handleSuccess(r);
                            alert('Timer activado');
                        }, handleError(e));
            }

//            alert("servicio.RegisteredForUpdates = " + info.RegisteredForUpdates);
            if (!info.RegisteredForUpdates) {
                myService.registerForBootStart(function(r) {
                    handleSuccess(r);
                    alert('Updates escuchando 2');
                }, handleError(e));
            }

//            alert("servicio.RegisteredForBootStart = " + info.RegisteredForBootStart);
            if (!info.RegisteredForBootStart) {
                myService.registerForBootStart(function(r) {
                    handleSuccess(r);
                    alert('Boot registrado 2');
                }, handleError(e));
            }

        }
    });
}


function arrancarTodo() {
    miservicio = arrancarServicio();
    miservicio.done(function() {
        temporizador = activarTimer();
        temporizador.done(function() {
            arranque = registrarArranque();
            arranque.done(function() {
                registerForUpdates();
            });
        });
    });
}

function arrancarServicio() {
    var deferredStart = $.Deferred();

    timerArrancarServicio = setInterval(function() {
        deferredStart.notify();
    }, 5000);

    startService(deferredStart);

    return deferredStart.promise();
}

function activarTimer() {
    var deferredTimer = $.Deferred();

    timerActivarTimer = setInterval(function() {
        deferredTimer.notify();
    }, 5000);

    enableTimer(deferredTimer);

    return deferredTimer.promise();
}

function registrarArranque() {
    var deferredArranque = $.Deferred();

    timerRegistrarArranque = setInterval(function() {
        deferredArranque.notify();
    }, 5000);

    registerForUpdates(deferredArranque);

    return deferredArranque.promise();
}

function activarEscuchador() {
    var deferredEscuchador = $.Deferred();

    timerActivarEscuchador = setInterval(function() {
        deferredEscuchador.notify();
    }, 5000);

    registerForUpdates(deferredEscuchador);

    return deferredEscuchador.promise();
}

//******************************************************************************
function startService(diferido) {
    myService.startService(function(r) {
//        handleSuccess(r);
        diferido.resolve();

    },
            function(e) {
                handleError(e);
            });
}

function enableTimer(diferido) {
    myService.enableTimer(60 * 1000,
            function(r) {
//                handleSuccess(r);
                diferido.resolve();
            },
            function(e) {
                handleError(e);
            });
}

function registerForBootStart(diferido) {
    myService.registerForBootStart(function(r) {
//        handleSuccess(r);
        diferido.resolve();
    },
            function(e) {
                handleError(e)
            });
}

function registerForUpdates() {
    myService.registerForUpdates(function(r) {
        handleSuccess(r)
        
    },
            function(e) {
                handleError(e)
            });
}
//*********************************************************************************
/*
 * Button Handlers
 */
function getStatus() {
    myService.getStatus(function(r) {
        handleSuccess(r)
    }, handleError(e));
}

/**
 * 
 * @param {type} servicio
 * @returns {undefined}
 */
function handleSuccess(servicio) {
    estadoServicio(servicio);
}

/**
 * 
 * @param {cordova.plugins.myService} servicio
 */
function handleError(servicio) {
    alert("Error service: " + servicio.ErrorMessage);
    alert('SERVICE : ' + JSON.stringify(servicio));
    estadoServicio(servicio);
}


/**
 * Método que recibe como parametro un string FECHA 
 * y lo pasa al servicio para que lo guarde como la ultima fecha .
 * @param {type} fecha
 */
function setServiceConfig(fecha) {
//    var fechaToTxt = document.getElementById("fechaTxt");
//    var fechaToString = fechaToTxt.value;
    var config = {
        "fecha": fecha
    };
    myService.setConfiguration(config,
//            alert('Noticia guardada y fecha pasada al servicio'),
            function(r) {
                estadoServicio(r);
            },
            function(e) {
                handleError(e);
            });
}

/**
 * Metodo que actualiza la información del estado del servicio que
 * recibe como parametro.
 * @param {type} servicio
 */
function estadoServicio(servicio) {
    var serviceStatus = document.getElementById("serviceStatus");
    var timerStatus = document.getElementById("timerStatus");
    var bootStatus = document.getElementById("bootStatus");
    var listenStatus = document.getElementById("listenStatus");
//Si el servicio esta corriendo
    if (servicio.ServiceRunning) {
        serviceStatus.innerHTML = "Activo";
//si el timer esta habilitado
        if (servicio.TimerEnabled) {
            timerStatus.innerHTML = "Enabled";
//sino
        } else {
            timerStatus.innerHTML = "Disabled";
        }
//Si el servicio esta apagado
    } else {
        serviceStatus.innerHTML = "Not running";
//El timer debe estar desactivado
        servicio.TimerEnabled = false;
    }

//Si el servicio esta registrado para activarse en el arranque del dispositivo
    if (servicio.RegisteredForBootStart) {
        bootStatus.innerHTML = "Registered";
    } else {
        bootStatus.innerHTML = "Not registered";
    }

//Si el servicio esta registrado para recibir actualizaciones
    if (servicio.RegisteredForUpdates) {
//        alert("Entro en servicio escuchando");
        listenStatus.innerHTML = "Registered";
    } else {
//        alert("el servicio no escucha");
        listenStatus.innerHTML = "Not registered";
    }

    /* si el servicio tiene datos de configuración se los paso a la etiqueta correspondiente
     * 
     */
    if (servicio.Configuration != null)
    {
        try {
            var fechaToTxt = document.getElementById("fechaTxt");
            var conf = servicio.Configuration.fecha;
            fechaToTxt.innerHTML = conf;
        } catch (err) {
        }
    }

    /*Cuando recibimos el mensaje del servicio del resultado de la ultima busqueda
     al servicioRSS se lo pasamos al div "resultMessage" para que lo muestre*/
    if (servicio.LatestResult != null)
    {
        try {
            var resultMessage = document.getElementById("resultMessage");
            var aux = servicio.LatestResult.Message;
            resultMessage.innerHTML = aux;
        } catch (err) {
        }
    }
}
