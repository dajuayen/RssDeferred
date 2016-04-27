

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        iniciarServicio();
        mostrarLista();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

var myService;

function iniciarServicio() {
    document.addEventListener('deviceready', function() {
        alert('Entro en iniciarServicio');
        myService = cordova.plugins.myService;
        mostrarLista();
        
    }, true);
    $.when().then(arrancar);
    
}

/**
 * 
 * @param {type} servicio
 * @returns {undefined}
 */
function handleSuccess(servicio) {
//    estadoServicio(servicio);
//    alert('Entro en handleSuccess');
    alert('Info : \n Servicio >>>> ' + servicio.ServiceRunning
            + '\n Timer >>>> ' + servicio.TimerEnabled
            + '\n Boot >>>> ' + servicio.RegisteredForBootStart
            + '\n Updates >>>> ' + servicio.RegisteredForUpdates
            + '\n Configuration >>>> ' + servicio.Configuration.fecha
            + '\n LatestResult  >>>> ' + servicio.LatestResult.Message);
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

/*
 * Button Handlers
 */
function getStatus() {
    alert('Entro en getStatus');
    myService.getStatus(function(r) {
        handleSuccess(r);
        estadoServicio(r);
    }, handleError(e));
}

/**
 * Método que arranca el servicio
 * habilita el Timer
 * registra al servicio para que se inicie con el arranque del dispositivo
 * registra el servicio para escuchar cambios. 
 */
function arrancar() {
    alert('Entro en arrancar');
    myService.getStatus(function(info) {
        alert('Iniciamos el arranque en arrancar')
        handleSuccess(info);
        if (!info.ServiceRunning) {
            alert('arrancamos el servicio');
            myService.startService(function(r) {
                handleSuccess(r);
                alert('servicio arrancado');
                myService.enableTimer(60 * 1000,
                        function(r) {
                            handleSuccess(r);
                            alert('Timer activado');
                            myService.registerForBootStart(function(r) {
                                alert('Boot registrado'); /*
                                 myService.registerForUpdates(
                                 handleSuccess(r),
                                 handleError(e));*/
                            }, handleError(e));
                        }, handleError(e));
            }, handleError(e));
//            alert('ok servicio');
        } else {
            alert("servicio.TimerEnabled = " + info.TimerEnabled);
            if (!info.TimerEnabled) {
                myService.enableTimer(60 * 1000,
                        function(r) {
                            alert('Timer activado');
                        }, handleError(e));
            }
            alert("servicio.RegisteredForBootStart = " + info.RegisteredForBootStart);
            if (!info.RegisteredForBootStart) {
                myService.registerForBootStart(function(r) {
                    alert('Boot registrado 2');
                }, handleError(e));
            }
            //servicio.RegisteredForUpdates registerForUpdates
            alert("servicio.RegisteredForUpdates = " + info.RegisteredForUpdates);
            /*alert("servicio.registeredForUpdates = " + info.registeredForUpdates);
             if (!info.RegisteredForUpdates) {
             myService.registerForUpdates(function(r) {
             handleSuccess(r);
             alert('Updates activadas 2');
             }, handleError(e));
             }*/
        }
    });
}

function arrancar2() {
    alert('Entro en arrancar2');
    myService.getStatus(function(r) {
        startService()
    },
            function(e) {
                handleError(e)
            });
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
            alert('Noticia guardada y fecha pasada al servicio'),
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
    alert('Actualizamos la información del servicio');
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
        alert("Entro en servicio escuchando");
        listenStatus.innerHTML = "Registered";
    } else {
        alert("el servicio no escucha");
        listenStatus.innerHTML = "Not registered";
    }

    /* si el servicio tiene datos de configuración se los paso a la etiqueta correspondiente
     * 
     */
    if (servicio.Configuration != null)
    {
        alert('entro en configuración');
        try {
            var fechaToTxt = document.getElementById("fechaTxt");
            var conf = servicio.Configuration.fecha;
            alert('Configuracion : ' + conf);
            fechaToTxt.innerHTML = conf;
        } catch (err) {
        }
    }

    /*Cuando recibimos el mensaje del servicio del resultado de la ultima busqueda
     al servicioRSS se lo pasamos al div "resultMessage" para que lo muestre*/
    if (servicio.LatestResult != null)
    {
        alert('entro en LatestResult');
        try {
            var resultMessage = document.getElementById("resultMessage");
            var aux = servicio.LatestResult.Message;
            alert('LatestResult.Message :' + aux);
            resultMessage.innerHTML = aux;
        } catch (err) {
        }
    }
}

/* ************************************************************************** */
function startService() {
    myService.startService(function(r) {
        handleSuccess(r);
    },
            function(e) {
                handleError(e);
            });
}

function enableTimer() {
    myService.enableTimer(60 * 1000,
            function(r) {
                handleSuccess(r);
            },
            function(e) {
                handleError(e);
            });
}

function registerForBootStart() {
    myService.registerForBootStart(function(r) {
        handleSuccess(r)
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
