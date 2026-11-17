package com.nvaritia;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.JavascriptInterface;
import android.content.SharedPreferences;
import androidx.appcompat.app.AppCompatActivity;
import com.google.firebase.messaging.FirebaseMessaging;

public class MainActivity extends AppCompatActivity {
    private WebView webview1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        webview1 = new WebView(this);
        setContentView(webview1);

        WebSettings settings = webview1.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);

        FirebaseMessaging.getInstance().getToken()
            .addOnCompleteListener(task -> {
                if (task.isSuccessful() && task.getResult() != null) {
                    String token = task.getResult();
                    getSharedPreferences("app_prefs", MODE_PRIVATE)
                        .edit().putString("fcm_token", token).apply();
                }
            });

        webview1.addJavascriptInterface(new Object() {
            @JavascriptInterface
            public String getFcmToken() {
                SharedPreferences sp = getSharedPreferences("app_prefs", MODE_PRIVATE);
                return sp.getString("fcm_token", "");
            }
        }, "AndroidBridge");

        webview1.setWebViewClient(new WebViewClient());
        webview1.loadUrl("https://nvaritia.online");
    }
}
