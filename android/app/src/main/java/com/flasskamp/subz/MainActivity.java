package com.flasskamp.OpenSubz;

import android.content.res.Configuration;
import android.view.WindowManager;
import android.webkit.WebSettings;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onStart() {
    super.onStart();


    //getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FORCE_NOT_FULLSCREEN);
    //getWindow().setFlags(WindowManager.LayoutParams.FLAG, WindowManager.LayoutParams.FLAG_FORCE_NOT_FULLSCREEN);


    // Android fix for enabling dark mode
    int nightModeFlags = getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK;
    WebSettings webSettings = this.bridge.getWebView().getSettings();
    if (nightModeFlags == Configuration.UI_MODE_NIGHT_YES) {
      String userAgent = webSettings.getUserAgentString();
      userAgent = userAgent + " AndroidDarkMode";
      webSettings.setUserAgentString(userAgent);
    }
  }
}
