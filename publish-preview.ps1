$ErrorActionPreference = 'Stop'
$expectedBranch = 'preview/daria-local'
$expectedRemote = 'github.com[:/]DaddyKross/DariaKrapivaNachisPortfolio(\.git)?$'

$branch = (git branch --show-current).Trim()
if ($LASTEXITCODE -ne 0) { throw 'Не удалось определить текущую Git-ветку.' }
if ($branch -ne $expectedBranch) {
    throw "Сейчас выбрана ветка '$branch'. Переключись на '$expectedBranch' и запусти скрипт снова."
}

$remote = (git remote get-url origin).Trim()
if ($LASTEXITCODE -ne 0 -or $remote -notmatch $expectedRemote) {
    throw "Удалённый репозиторий origin не совпадает с DaddyKross/DariaKrapivaNachisPortfolio: $remote"
}

Write-Host 'Добавляю файлы сайта...' -ForegroundColor Cyan
git add index.html portfolio.html css/style.css js/script.js images/main-artwork.webp README-V8.txt publish-preview.ps1 portfolio/characters portfolio/illustrations portfolio/materials portfolio/animation
if ($LASTEXITCODE -ne 0) { throw 'Не удалось добавить файлы в Git.' }

git diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
    Write-Host 'Изменений для отправки нет. GitHub уже содержит эту версию.' -ForegroundColor Yellow
    exit 0
}

Write-Host 'Создаю коммит...' -ForegroundColor Cyan
git commit -m 'Update Daria portfolio: main artwork and denser forest canopy'
if ($LASTEXITCODE -ne 0) { throw 'Не удалось создать коммит.' }

Write-Host 'Отправляю обновление на GitHub...' -ForegroundColor Cyan
git push origin $expectedBranch
if ($LASTEXITCODE -ne 0) { throw 'Не удалось отправить изменения. Проверь авторизацию и подключение к GitHub.' }

Write-Host 'Готово! Обновление отправлено в preview/daria-local.' -ForegroundColor Green
Write-Host 'После успешной публикации GitHub Pages сайт будет доступен по адресу:'
Write-Host 'https://daddykross.github.io/DariaKrapivaNachisPortfolio/' -ForegroundColor Green
