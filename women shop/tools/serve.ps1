# VĀNE — zero-dependency static server for Windows PowerShell.
# Usage: powershell -ExecutionPolicy Bypass -File tools/serve.ps1 [-Port 5500]
param([int]$Port = 5500, [string]$Root = (Split-Path -Parent $PSScriptRoot))
$mime = @{ '.html'='text/html; charset=utf-8'; '.css'='text/css; charset=utf-8'; '.js'='text/javascript; charset=utf-8'; '.json'='application/json'; '.svg'='image/svg+xml'; '.png'='image/png'; '.jpg'='image/jpeg'; '.ico'='image/x-icon'; '.xml'='application/xml'; '.txt'='text/plain'; '.md'='text/plain; charset=utf-8'; '.webmanifest'='application/manifest+json' }
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Serving $Root on http://localhost:$Port/"
while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $path = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath.TrimStart('/'))
  if ($path -eq '') { $path = 'index.html' }
  $file = Join-Path $Root $path
  if ((Test-Path $file -PathType Container)) { $file = Join-Path $file 'index.html' }
  $res = $ctx.Response
  if (Test-Path $file -PathType Leaf) {
    $ext = [IO.Path]::GetExtension($file).ToLower()
    $res.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
    $res.Headers.Add('Cache-Control','no-store')
    $bytes = [IO.File]::ReadAllBytes($file)
    $res.ContentLength64 = $bytes.Length
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
  } else {
    $res.StatusCode = 404
    $nf = Join-Path $Root '404.html'
    if (Test-Path $nf) { $bytes = [IO.File]::ReadAllBytes($nf); $res.ContentType = 'text/html; charset=utf-8'; $res.OutputStream.Write($bytes,0,$bytes.Length) }
  }
  $res.Close()
  Write-Host "$($res.StatusCode) /$path"
}
