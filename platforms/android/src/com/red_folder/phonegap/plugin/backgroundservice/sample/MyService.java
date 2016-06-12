package com.red_folder.phonegap.plugin.backgroundservice.sample;

import java.text.SimpleDateFormat;
import java.text.ParseException;
import java.util.Date;
import java.io.InputStream;
import java.util.Iterator;

import org.apache.cordova.CordovaArgs;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaResourceApi;
import org.apache.cordova.PluginResult;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;

import android.content.ContentResolver;
import android.content.res.AssetFileDescriptor;
import android.content.res.AssetManager;
import android.content.Context;
import android.content.Intent;
import android.content.res.Resources;
import android.content.SharedPreferences;

import android.provider.Settings;

import android.widget.Toast;

import android.os.Bundle;

import android.support.v4.app.*;
import android.support.v4.app.NotificationCompat;

import android.app.Notification;
import android.app.PendingIntent;
import android.app.NotificationManager;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;

import android.net.Uri;

import android.text.Html;

import com.red_folder.phonegap.plugin.backgroundservice.BackgroundService;

/* ********************************** ATENCIÓN **************************************** */
        /*
        Hay que cambiar el nombre del package para cada proyecto
         */
import com.prueba.basica.deferred.MainActivity;

public class MyService extends BackgroundService {

    private final static String TAG = MyService.class.getSimpleName();
    private final static int ID_NOTIFICATION_CREAR = 1;
    private static final String INTENT_PREFIX = "ChromeNotifications.";
    private static final String NOTIFICATION_CLICKED_ACTION = INTENT_PREFIX + "Click";
    private static final String NOTIFICATION_CLOSED_ACTION = INTENT_PREFIX + "Close";

    //******************************************************************************
    private String fechaGuardada = "";
    private FinderRSS finder = new FinderRSS();

    //**************************************************************************
    public static final String MyPREFERENCES = "MisPreferencias";
       

    @Override
    protected JSONObject doWork() {
        JSONObject result = new JSONObject();

        try {
            fechaGuardada = leerPreferencias();
        } catch (Exception e) {
            fechaGuardada = "Mon, 01 Mar 2016 00:00:02 +0100";
        }
        if (fechaGuardada == "") {
            fechaGuardada = "Mon, 01 Apr 2016 00:00:02 +0100";
        }

        try {
            StringBuilder msg = new StringBuilder();
            SimpleDateFormat df = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
            String now = df.format(new Date(System.currentTimeMillis()));
            String lastUpdated = finder.ultimoFeedPublicado();
            if (finder.isMoreUpdated(fechaGuardada, lastUpdated)) {
                //this.fechaGuardada = lastUpdated;
                int aux;
                aux = notificar();
                msg.append("Nuevo RSS a : (" + String.valueOf(aux) + ")");
                guardarPreferencias(lastUpdated);
            } else {
                msg.append("Ultimo RSS a : ");
            }

            msg.append(this.fechaGuardada);
            msg.append(" - revisada a: ");
            msg.append(now);

            result.put("Message", msg.toString());

            Log.d(TAG, msg.toString());
        } catch (ParseException e) {
        } catch (JSONException e) {
        }

        return result;
    }

    @Override
    protected JSONObject getConfig() {
        JSONObject result = new JSONObject();

        try {
            result.put("fecha", this.fechaGuardada);
        } catch (JSONException e) {
        }

        return result;
    }

    @Override
    protected void setConfig(JSONObject config) {
        try {
            if (config.has("fecha")) {
                this.fechaGuardada = config.getString("fecha");
            }
        } catch (JSONException e) {
        }

    }

    @Override
    protected JSONObject initialiseLatestResult() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    protected void onTimerEnabled() {
        // TODO Auto-generated method stub

    }

    @Override
    protected void onTimerDisabled() {
        // TODO Auto-generated method stub

    }

    private int notificar() {
       
        Resources resources;
        resources = getResources();
        /* ********************************** ATENCIÓN **************************************** */
        /*
        Hay que cambiar el nombre del package para cada proyecto
         */
        int smallIconId = resources.getIdentifier("icon", "drawable", "com.prueba.basica.deferred");
        if (smallIconId == 0) {
            smallIconId = resources.getIdentifier("icon", "drawable", "com.prueba.basica.deferred");
        }

        NotificationCompat.Builder notif = new NotificationCompat.Builder(this)
                .setContentTitle("ReaderRSS")
                .setSmallIcon(smallIconId)
                .setContentText("Hay rss nuevos sin leer.");               

        PendingIntent intencionPendiente = PendingIntent.getActivity(this, 0, new Intent(this, MainActivity.class
        ), 0);
        notif.setContentIntent(intencionPendiente);

        notif.setAutoCancel(
                true);
        NotificationManager nofificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

        nofificationManager.notify(ID_NOTIFICATION_CREAR, notif.build());
        return smallIconId;
    }

    private void guardarPreferencias(String str) {
        /* ************************************ ATENCIÓN **********************************************
        1- AÑADIR los siguientes import en la clase MainActivity.java
        import android.content.SharedPreferences;
        import android.content.Context;

        2 - añadir la propiedad estatica a la clase MainActivity.java:
            static Context context; 
            static SharedPreferences MISPREFS

        3 - AÑADIR EN EL MÉTODO ON CREATE de MainActivity :
         MainActivity.context = getApplicationContext(); 
         MISPREFS = getSharedPreferences("MisPrefencias", Context.MODE_PRIVATE);

        4 - AÑADIR A MainActivity.java EL MÉTODO:
        public static Context getAppContext() {
            return MainActivity.context;
        }
        ******************************************************************************************** */
        //Context contexto = MainActivity.getAppContext();
        SharedPreferences sharedpreferences = getSharedPreferences(MyPREFERENCES, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedpreferences.edit();
        editor.clear();
        editor.putString("fechaPref", str);
        editor.commit();
    }

    private String leerPreferencias() {
                /* ************************************ ATENCIÓN **********************************************
        1- AÑADIR los siguientes import en la clase MainActivity.java
        import android.content.SharedPreferences;
        import android.content.Context;

        2 - añadir la propiedad estatica a la clase MainActivity.java:
            static Context context; 

        3 - AÑADIR EN EL MÉTODO ON CREATE de MainActivity :
         MainActivity.context = getApplicationContext(); 

        4 - AÑADIR A MainActivity.java EL MÉTODO:
        public static Context getAppContext() {
            return MainActivity.context;
        }
        ******************************************************************************************** */
        //Context contexto = MainActivity.getAppContext();
        SharedPreferences sharedpreferences = getSharedPreferences(MyPREFERENCES, Context.MODE_PRIVATE);
        String fechaPref = sharedpreferences.getString("fechaPref", null);
        return fechaPref;
    }
}