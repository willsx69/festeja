param(
  [ValidateSet("start", "stop", "restart", "status")]
  [string]$Action = "status",
  [switch]$Build
)

$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$Port = 3000
$LogDir = Join-Path $ProjectRoot "logs"
$OutLog = Join-Path $LogDir "server.out.log"
$ErrLog = Join-Path $LogDir "server.err.log"
$PidFile = Join-Path $LogDir "server.pid"
$BaseUrl = "http://127.0.0.1:$Port/"
$NodeExe = (Get-Command node.exe -ErrorAction Stop).Source
$NextCli = Join-Path $ProjectRoot "node_modules\next\dist\bin\next"

function Get-PortListener {
  $connections = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
  if (-not $connections) {
    return $null
  }

  $processId = ($connections | Select-Object -First 1).OwningProcess
  $process = Get-CimInstance Win32_Process -Filter "ProcessId = $processId" -ErrorAction SilentlyContinue
  if (-not $process) {
    return $null
  }

  return [pscustomobject]@{
    Id = [int]$process.ProcessId
    Name = [string]$process.Name
    CommandLine = [string]$process.CommandLine
  }
}

function Test-FestejaProcess {
  param($Process)

  if (-not $Process -or -not $Process.CommandLine) {
    return $false
  }

  $command = $Process.CommandLine.Replace("/", "\")
  $root = $ProjectRoot.Replace("/", "\")

  $inProject = $command.IndexOf($root, [System.StringComparison]::OrdinalIgnoreCase) -ge 0
  if (-not $inProject) {
    return $false
  }

  $isNextStart =
    $command -match "(?i)next\\dist\\bin\\next.*\bstart\b" -or
    $command -match "(?i)next\\dist\\server\\lib\\start-server\.js"
  $isNpmStart = $command -match "(?i)npm.*\bstart:next\b"

  return ($isNextStart -or $isNpmStart)
}

function Get-FestejaProcesses {
  $processes = Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
    Where-Object { Test-FestejaProcess $_ }

  return @($processes)
}

function Get-FestejaProcessTree {
  $all = @()
  $roots = @(Get-FestejaProcesses)

  foreach ($process in $roots) {
    if (-not ($all | Where-Object { $_.ProcessId -eq $process.ProcessId })) {
      $all += $process
    }
  }

  foreach ($process in $roots) {
    $current = $process
    while ($current -and $current.ParentProcessId -ne 0) {
      $parent = Get-CimInstance Win32_Process -Filter "ProcessId = $($current.ParentProcessId)" -ErrorAction SilentlyContinue
      if (-not $parent) {
        break
      }

      $command = ([string]$parent.CommandLine).Replace("/", "\")
      $isRelated = ($command -match "(?i)next.*\bstart\b") -or ($command -match "(?i)npm.*\bstart:next\b")
      if (-not $isRelated) {
        break
      }

      if (-not ($all | Where-Object { $_.ProcessId -eq $parent.ProcessId })) {
        $all += $parent
      }
      $current = $parent
    }
  }

  return $all
}

function Wait-HttpOk {
  param([int]$TimeoutSeconds = 30)

  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)

  while ((Get-Date) -lt $deadline) {
    try {
      $response = Invoke-WebRequest -Uri $BaseUrl -UseBasicParsing -TimeoutSec 2
      if ($response.StatusCode -eq 200) {
        return $true
      }
    } catch {
    }

    Start-Sleep -Milliseconds 500
  }

  return $false
}

function Stop-FestejaProcesses {
  $processes = @(Get-FestejaProcessTree)
  if ($processes.Count -eq 0) {
    Remove-Item -LiteralPath $PidFile -Force -ErrorAction SilentlyContinue
    return $true
  }

  foreach ($process in $processes) {
    if (-not (Get-Process -Id $process.ProcessId -ErrorAction SilentlyContinue)) {
      continue
    }
    Write-Host "Encerrando processo Festeja PID $($process.ProcessId)..."
    & cmd.exe /c "taskkill.exe /PID $($process.ProcessId) /T /F >nul 2>&1" | Out-Null
  }

  for ($attempt = 0; $attempt -lt 30; $attempt++) {
    Start-Sleep -Milliseconds 500
    if (-not (Get-PortListener) -and @(Get-FestejaProcesses).Count -eq 0) {
      Remove-Item -LiteralPath $PidFile -Force -ErrorAction SilentlyContinue
      return $true
    }
  }

  Write-Warning "Alguns processos Festeja ainda estao ativos apos a tentativa de encerramento."
  return $false
}

function Show-Status {
  $listener = Get-PortListener

  if (-not $listener) {
    Write-Host "Festeja parado: porta $Port livre."
    return 1
  }

  if (-not (Test-FestejaProcess $listener)) {
    Write-Host "Porta $Port ocupada por outro processo (PID $($listener.Id), $($listener.Name))."
    return 1
  }

  Write-Host "Festeja ativo na porta $Port (PID $($listener.Id))."
  Write-Host "URL: $BaseUrl"
  Write-Host "Log: $OutLog"

  try {
    $response = Invoke-WebRequest -Uri $BaseUrl -UseBasicParsing -TimeoutSec 5
    Write-Host "HTTP: $($response.StatusCode)"
  } catch {
    Write-Warning "Porta aberta, mas a checagem HTTP falhou: $($_.Exception.Message)"
  }

  return 0
}

function Start-Festeja {
  $listener = Get-PortListener

  if ($listener) {
    if (Test-FestejaProcess $listener) {
      Write-Host "Festeja ja esta ativo na porta $Port (PID $($listener.Id)). Nenhuma nova instancia foi iniciada."
      return 0
    }

    Write-Host "A porta $Port esta ocupada por outro processo (PID $($listener.Id), $($listener.Name))."
    Write-Host "Encerre esse processo manualmente ou escolha outra porta. Nada foi alterado."
    return 1
  }

  $stale = @(Get-FestejaProcesses)
  if ($stale.Count -gt 0) {
    Write-Host "Encontrei $($stale.Count) processo(s) Festeja sem listener. Aguardando para evitar duplicidade..."
    Start-Sleep -Seconds 2
    $listener = Get-PortListener
    if ($listener -and (Test-FestejaProcess $listener)) {
      Write-Host "Festeja ja esta ativo na porta $Port (PID $($listener.Id)). Nenhuma nova instancia foi iniciada."
      return 0
    }
    Write-Host "Limpando instancias antigas antes de iniciar."
    if (-not (Stop-FestejaProcesses)) {
      return 1
    }
  }

  if (-not (Test-Path -LiteralPath (Join-Path $ProjectRoot ".next\BUILD_ID"))) {
    Write-Host "Build de producao ausente. Executando npm run build..."
    & npm.cmd run build | Out-Host
    if ($LASTEXITCODE -ne 0) {
      Write-Host "O build falhou. O servidor nao foi iniciado."
      return 1
    }
  }

  New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

  $commandLine = 'cmd.exe /d /s /c ""{0}" "{1}" start > "{2}" 2> "{3}""' -f `
    $NodeExe, $NextCli, $OutLog, $ErrLog

  $creation = Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{
    CommandLine = $commandLine
    CurrentDirectory = $ProjectRoot
  }

  if ($creation.ReturnValue -ne 0) {
    Write-Host "Nao foi possivel iniciar o processo do servidor (codigo $($creation.ReturnValue))."
    return 1
  }

  if (-not (Wait-HttpOk -TimeoutSeconds 30)) {
    Write-Host "O servidor nao respondeu HTTP 200 na porta $Port dentro de 30 segundos. Ultimas linhas do log:"
    if (Test-Path -LiteralPath $OutLog) {
      Get-Content -LiteralPath $OutLog -Tail 30 | Out-Host
    }
    if (Test-Path -LiteralPath $ErrLog) {
      Get-Content -LiteralPath $ErrLog -Tail 30 | Out-Host
    }
    Stop-FestejaProcesses | Out-Null
    return 1
  }

  $listener = Get-PortListener
  if ($listener) {
    Set-Content -LiteralPath $PidFile -Value $listener.Id
    Write-Host "Festeja iniciado na porta $Port (PID $($listener.Id))."
  } else {
    Write-Host "Festeja respondendo HTTP 200 na porta $Port (PID nao identificado)."
  }
  Write-Host "URL: $BaseUrl"
  Write-Host "HTTP: 200"
  Write-Host "Log: $OutLog"

  return 0
}

function Restart-Festeja {
  $listener = Get-PortListener
  if ($listener -and -not (Test-FestejaProcess $listener)) {
    Write-Host "A porta $Port esta ocupada por outro processo (PID $($listener.Id), $($listener.Name))."
    Write-Host "Nada foi alterado."
    return 1
  }

  Write-Host "Parando o Festeja..."
  if (-not (Stop-FestejaProcesses)) {
    return 1
  }

  if ($Build) {
    Write-Host "Executando build de producao..."
    & npm.cmd run build | Out-Host
    if ($LASTEXITCODE -ne 0) {
      Write-Host "O build falhou. O servidor nao foi reiniciado."
      return 1
    }
  }

  return Start-Festeja
}

switch ($Action) {
  "start" {
    exit (Start-Festeja)
  }
  "stop" {
    Write-Host "Parando o Festeja..."
    if (Stop-FestejaProcesses) {
      Write-Host "Festeja parado. Porta $Port livre."
      exit 0
    }
    exit 1
  }
  "restart" {
    exit (Restart-Festeja)
  }
  "status" {
    exit (Show-Status)
  }
}
