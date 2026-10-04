# Paw Pal APK Builder Script
Write-Host "Building Paw Pal Android APK..." -ForegroundColor Cyan

# Set environment variables
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-21.0.12.8-hotspot"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:PATH = "C:\Program Files\nodejs;$env:JAVA_HOME\bin;$env:PATH"

# 1. Build web application
Write-Host "`n[1/3] Building web assets with Vite..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) { Write-Error "Vite build failed!"; exit $LASTEXITCODE }

# 2. Sync to Android project
Write-Host "`n[2/3] Syncing assets with Capacitor Android..." -ForegroundColor Yellow
npx cap sync android
if ($LASTEXITCODE -ne 0) { Write-Error "Capacitor sync failed!"; exit $LASTEXITCODE }

# 3. Assemble Debug APK
Write-Host "`n[3/3] Compiling APK with Gradle..." -ForegroundColor Yellow
Set-Location "android"
& "$env:JAVA_HOME\bin\java.exe" "-Dorg.gradle.appname=gradlew" -classpath "gradle\wrapper\gradle-wrapper.jar" org.gradle.wrapper.GradleWrapperMain assembleDebug
Set-Location ".."

if (Test-Path "android\app\build\outputs\apk\debug\app-debug.apk") {
    Copy-Item "android\app\build\outputs\apk\debug\app-debug.apk" -Destination "PawPal.apk" -Force
    Write-Host "`n🎉 SUCCESS! APK generated at: $(Get-Location)\PawPal.apk" -ForegroundColor Green
} else {
    Write-Error "APK file not found after build."
}
