import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Enable production mode unless running locally
if (environment.production) {
  enableProdMode();
}

// Configure global error handling
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  // You can send errors to a logging service here
});

// Configure unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // You can send errors to a logging service here
});

// Bootstrap the application
platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    // Enable dev mode for better error messages in development
    ngZoneEventCoalescing: true,
    ngZoneRunCoalescing: true
  })
  .catch(err => {
    console.error('Error starting application:', err);
    
    // Show user-friendly error message
    document.body.innerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-family: 'Roboto', Arial, sans-serif;
        text-align: center;
        padding: 20px;
      ">
        <div>
          <h1 style="font-size: 2rem; margin-bottom: 1rem;">Application Error</h1>
          <p style="font-size: 1.1rem; margin-bottom: 2rem; opacity: 0.9;">
            Unable to start the Vehicle Breakdown Assistance application.
          </p>
          <button onclick="window.location.reload()" style="
            background: rgba(255,255,255,0.2);
            border: 2px solid rgba(255,255,255,0.5);
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1rem;
          ">
            Retry
          </button>
        </div>
      </div>
    `;
  });
