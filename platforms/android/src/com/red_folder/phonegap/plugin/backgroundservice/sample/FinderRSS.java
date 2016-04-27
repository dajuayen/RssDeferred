package com.red_folder.phonegap.plugin.backgroundservice.sample;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.text.ParseException;


public class FinderRSS {
	  
static final RssParserDom parser= new RssParserDom("http://www.larioja.com/rss/2.0/?seccion=ultima-hora");


	public String ultimoFeedPublicado () throws ParseException{
		List<Noticia> feeds = parser.parse();
		String lastUpdated = "";
		for (Noticia message : feeds) {
	      	if (lastUpdated == ""){
	      		lastUpdated = message.getFecha();
	      	}else{
	      		if (isMoreUpdated(lastUpdated, message.getFecha())) lastUpdated = message.getFecha();
	      	}
	    }
		return lastUpdated;
	} 
	    

	/**
	 * Si 
	 * @param  lastUpdated String con ultima fecha guardada
	 * @param  updated     String con la posible ultima fecha
	 * @return             retorna true si efectivamente updated es mas actual que la última fecha
	 * guardada o false si la última fecha guardada sigue siendo la más actual
	 */
	
	 public boolean isMoreUpdated(String lastUpdated, String updated ) throws ParseException{
	 	
		 	//Formato de fecha dependiendo del tipo de rss
	 		//SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'+'XX:XX");
		 	SimpleDateFormat formatter = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss zzz", Locale.ENGLISH);
	 		//SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd' 'HH:mm:ss");
		 	Date dateLast = formatter.parse(lastUpdated);
		 	Date dateUpdated = formatter.parse(updated);
		 		
		 	
		
		return dateUpdated.after(dateLast);
		
	 }

	
} 