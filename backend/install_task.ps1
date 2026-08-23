# Windows Görev Zamanlayıcısı'na (Task Scheduler) her gün çalışan görev ekleme scripti
$taskName = "KoreliCeyiz_Supabase_KeepAlive"
$scriptPath = Join-Path $PSScriptRoot "run_keep_alive.bat"

# Eğer önceden eklenmişse kaldır
Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue

# Her gün saat 12:00'de ve bilgisayar açıldığında çalışacak tetikleyiciler
$triggerDaily = New-ScheduledTaskTrigger -Daily -At 12:00PM
$triggerStartup = New-ScheduledTaskTrigger -AtStartup

$action = New-ScheduledTaskAction -Execute $scriptPath -WorkingDirectory $PSScriptRoot

Register-ScheduledTask -TaskName $taskName -Trigger @($triggerDaily, $triggerStartup) -Action $action -Description "Supabase veritabaninin uyku moduna gecmesini onlemek icin her gun ping atar."

Write-Host "Basariyla Windows Gorev Zamanlayicisi'na eklendi: $taskName" -ForegroundColor Green
