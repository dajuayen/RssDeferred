import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaInterface;
import android.util.Log;
import android.provider.Settings;
import android.widget.Toast;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.Toast;
 
import org.apache.cordova.CordovaPlugin; 
import org.apache.cordova.PluginResult;
import org.json.JSONArray;


public class SharedPref extends CordovaPlugin {
 
    public static final String TAG = "SharedPreferences Plugin";
    public static final String MyPREFERENCES = "MyPrefs" ;
    public static final String Name = "nameKey";
    SharedPreferences sharedpreferences;
    SharedPreferences.Editor editor;
 
/**
* Constructor.
*/
public SharedPref() {}
 
/**
* Sets the context of the Command. This can then be used to do things like
* get file paths associated with the Activity.
*
* @param cordova The context of the main Activity.
* @param webView The CordovaWebView Cordova is running in.
*/
public void initialize(CordovaInterface cordova, CordovaWebView webView) {
super.initialize(cordova, webView);
Log.v(TAG,"Init SharedPref");
}
 
public boolean execute(final String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
         
    final int duration = Toast.LENGTH_SHORT;
    JSONObject jo = new JSONObject();
    sharedpreferences = cordova.getActivity().getApplicationContext().getSharedPreferences(MyPREFERENCES, Context.MODE_PRIVATE);
    final String KEY = args.getString(0);
    final String STR = args.getString(1);
         
    if(action.equals("save")) {
        saveToPref(KEY,STR);
        jo.put(KEY, sharedpreferences.getString(KEY,null));
    }  
   else if(action.equals("get")) {
         jo.put(KEY, sharedpreferences.getString(KEY,null));
    }
    
    callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, jo));
    
    return true;
}
    
    private void saveToPref(String key,String str) {
        editor = sharedpreferences.edit();
        editor.putString(key, str);
        editor.commit();
    }
}