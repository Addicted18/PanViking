param(
  [string]$DataFile = "..\\data\\cities-coverage.json",
  [int]$DelayMs = 850
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$dataPath = Resolve-Path (Join-Path $scriptDir $DataFile)
$payload = Get-Content $dataPath -Raw | ConvertFrom-Json

$cityAliases = @{
  "biala podlaska" = "Biała Podlaska"
  "bialystok" = "Białystok"
  "bielsko-biala" = "Bielsko-Biała"
  "belchatow" = "Bełchatów"
  "boleslawiec" = "Bolesławiec"
  "czestochowa" = "Częstochowa"
  "dabrowa gornicza" = "Dąbrowa Górnicza"
  "glogow" = "Głogów"
  "gorzow wielkopolski" = "Gorzów Wielkopolski"
  "jastrzebie-zdroj" = "Jastrzębie-Zdrój"
  "kedzierzyn-kozle" = "Kędzierzyn-Koźle"
  "kolobrzeg" = "Kołobrzeg"
  "myslowice" = "Mysłowice"
  "ostroleka" = "Ostrołęka"
  "ostrowiec swietokrzyski" = "Ostrowiec Świętokrzyski"
  "piekary slaskie" = "Piekary Śląskie"
  "piotrkow trybunalski" = "Piotrków Trybunalski"
  "plock" = "Płock"
  "pulawy" = "Puławy"
  "ruda slaska" = "Ruda Śląska"
  "siemianowice slaskie" = "Siemianowice Śląskie"
  "slupsk" = "Słupsk"
  "swietochlowice" = "Świętochłowice"
  "walbrzych" = "Wałbrzych"
  "wloclawek" = "Włocławek"
  "wodzislaw slaski" = "Wodzisław Śląski"
  "wroclaw" = "Wrocław"
  "zory" = "Żory"
  "zyrardow" = "Żyrardów"
}

function Resolve-CityCoords {
  param([string]$CityName)

  $query = $CityName
  $cityKey = $CityName.ToLowerInvariant()
  if ($cityAliases.ContainsKey($cityKey)) {
    $query = $cityAliases[$cityKey]
  }

  $openMeteoQuery = [Uri]::EscapeDataString($query)
  $openMeteoUrl = "https://geocoding-api.open-meteo.com/v1/search?name=$openMeteoQuery&count=8&language=pl&format=json"
  try {
    $meteo = Invoke-RestMethod -Uri $openMeteoUrl -Method Get -TimeoutSec 20
    $candidates = @($meteo.results) | Where-Object { $_.country_code -eq "PL" }
    if (-not $candidates -or $candidates.Count -eq 0) {
      $candidates = @($meteo.results)
    }
    if ($candidates -and $candidates.Count -gt 0) {
      $best = $candidates | Sort-Object @{ Expression = { if ($_.population) { [int64]$_.population } else { 0 } }; Descending = $true } | Select-Object -First 1
      if ($best.latitude -and $best.longitude) {
        return [pscustomobject]@{
          lon = [double]$best.longitude
          lat = [double]$best.latitude
        }
      }
    }
  } catch {
  }

  $nominatimQuery = [Uri]::EscapeDataString("$query, Polska")
  $nominatimUrl = "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=pl&q=$nominatimQuery"
  try {
    $nom = Invoke-RestMethod -Uri $nominatimUrl -Method Get -TimeoutSec 20 -Headers @{ "User-Agent" = "PanVikingSiteMapBot/1.0 (local dev)" }
    if ($nom -and $nom.Count -gt 0) {
      return [pscustomobject]@{
        lon = [double]$nom[0].lon
        lat = [double]$nom[0].lat
      }
    }
  } catch {
  }

  return $null
}

$highlights = @($payload.highlights)
$points = New-Object System.Collections.Generic.List[object]
$missing = New-Object System.Collections.Generic.List[string]

foreach ($city in @($payload.cities)) {
  $cityName = $city.ToString().Trim()
  if (-not $cityName) { continue }
  $coords = Resolve-CityCoords -CityName $cityName
  Start-Sleep -Milliseconds $DelayMs

  if (-not $coords) {
    $missing.Add($cityName) | Out-Null
    continue
  }

  $points.Add([pscustomobject][ordered]@{
      city = $cityName
      lon = [math]::Round([double]$coords.lon, 6)
      lat = [math]::Round([double]$coords.lat, 6)
      priority = if ($highlights -contains $cityName) { "highlight" } else { "standard" }
    }) | Out-Null
}

$payload.mapPoints = $points
$payload.meta.updatedAt = (Get-Date).ToString("yyyy-MM-dd")
$payload | ConvertTo-Json -Depth 8 | Set-Content -Path $dataPath -Encoding UTF8

Write-Host "Map points generated: $($points.Count) / $(@($payload.cities).Count)"
if ($missing.Count -gt 0) {
  Write-Host "Missing cities:"
  $missing
}
