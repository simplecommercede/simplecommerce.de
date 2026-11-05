<?php
declare(strict_types=1);
// No session or third-party service is needed by the static contact page.
header('Content-Type: text/html; charset=UTF-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header("Content-Security-Policy: default-src 'none'; style-src 'self'; img-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");
function finish(int $status, string $title, string $message): never {
    http_response_code($status);
    if (str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json')) {
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode(['ok' => $status >= 200 && $status < 300, 'title' => $title, 'message' => $message], JSON_UNESCAPED_UNICODE);
        exit;
    }
    $title = htmlspecialchars($title, ENT_QUOTES, 'UTF-8');
    $message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
    $label = $status >= 400 ? 'KONTAKT · BITTE PRÜFEN' : 'KONTAKT · IHRE ANFRAGE';
    echo '<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>'.$title.' | simplecommerce</title><link rel="stylesheet" href="/assets/site.css"></head><body><header class="header"><a href="/" class="brand" aria-label="simplecommerce – Startseite"><img src="/assets/logo.jpg" width="309" height="78" alt="simplecommerce"></a><nav aria-label="Hauptnavigation"><a href="/shopsystem/">Shop</a><a href="/leistungen/">Leistungen</a><a href="/hilfe/">Hilfe</a><a href="/kontakt/">Kontakt</a></nav></header><main class="wrap contact-result"><article class="contact-result-card"><p class="eyebrow">'.$label.'</p><h1>'.$title.'</h1><p>'.$message.'</p><div class="actions"><a class="button" href="/kontakt/">Zur Kontaktseite</a><a class="text-link" href="mailto:info@simplecommerce.de">Direkt per E-Mail schreiben →</a></div></article><p class="fine">simplecommerce · Persönlich für Sie da.</p></main></body></html>';
    exit;
}
// The PHP development server on loopback is a preview, never an implicit mail sender.
$localHost = $_SERVER['HTTP_HOST'] ?? '';
$isLocalServer = PHP_SAPI === 'cli-server'
    && in_array($_SERVER['REMOTE_ADDR'] ?? '', ['127.0.0.1', '::1'], true)
    && preg_match('/^(127\.0\.0\.1|localhost|\[::1\]):[0-9]{1,5}$/D', $localHost) === 1;
$isLocalPreview = $isLocalServer && getenv('CONTACT_TRANSPORT') === false;
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    finish(405, 'Bitte nutzen Sie das Kontaktformular.', 'Diese Adresse nimmt nur abgesendete Kontaktanfragen entgegen.');
}
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 20000) {
    finish(413, 'Die Nachricht ist zu lang.', 'Bitte kürzen Sie Ihre Nachricht und senden Sie sie erneut.');
}
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = ['https://simplecommerce.de', 'https://www.simplecommerce.de'];
if (getenv('CONTACT_ENV') === 'development') {
    $allowed[] = 'http://127.0.0.1:1890';
    $allowed[] = 'http://127.0.0.1:1893';
    $allowed[] = 'http://localhost:1890';
    $allowed[] = 'http://localhost:1893';
}
if ($isLocalServer) $allowed[] = 'http://'.$localHost;
if (!in_array($origin, $allowed, true)) {
    finish(403, 'Bitte öffnen Sie das Formular neu.', 'Die Anfrage konnte nicht zugeordnet werden. Ihre Nachricht wurde nicht versendet. Öffnen Sie die Kontaktseite über die Website-Adresse und versuchen Sie es erneut.');
}
$fields = [];
foreach (['name', 'email', 'thema', 'nachricht', 'website'] as $key) {
    $value = $_POST[$key] ?? '';
    if (!is_string($value) || !preg_match('//u', $value)) {
        finish(422, 'Bitte prüfen Sie Ihre Angaben.', 'Die Formularwerte haben ein ungültiges Format.');
    }
    $fields[$key] = trim($value);
}
if ($fields['website'] !== '') {
    // Honeypot submissions are never delivered.
    finish(200, 'Vielen Dank.', 'Ihre Anfrage wurde entgegengenommen.');
}
$topics = ['Shopsystem','Webseitenerstellung','IT-Beratung','IT-Projekt','KI-Anwendungen','Service','Sonstiges'];
if ($fields['name'] === '' || strlen($fields['name']) > 480 || preg_match('/[\r\n\x00-\x1f]/', $fields['name'])
    || strlen($fields['email']) > 254 || !filter_var($fields['email'], FILTER_VALIDATE_EMAIL)
    || preg_match('/[\r\n]/', $fields['email']) || !in_array($fields['thema'], $topics, true)
    || strlen($fields['nachricht']) < 10 || strlen($fields['nachricht']) > 10000 || str_contains($fields['nachricht'], "\0")) {
    finish(422, 'Bitte prüfen Sie Ihre Angaben.', 'Name, eine gültige E-Mail-Adresse und eine Nachricht mit 10 bis 10.000 Zeichen sind erforderlich. Nutzen Sie die Zurück-Funktion Ihres Browsers, um Ihre Eingaben zu korrigieren.');
}
if ($isLocalPreview) finish(200, 'Formulartest erfolgreich.', 'Sie sind in der lokalen Vorschau. Ihre Angaben wurden geprüft; es wurde keine E-Mail versendet.');
$to = getenv('CONTACT_TO') ?: '';
$from = getenv('CONTACT_FROM') ?: '';
$transport = getenv('CONTACT_TRANSPORT') ?: 'mail';
$testFile = getenv('CONTACT_TEST_FILE') ?: '';
$isFileTest = $transport === 'file' && getenv('CONTACT_ENV') === 'development' && $testFile !== '';
if (!$isFileTest && (!filter_var($to, FILTER_VALIDATE_EMAIL) || !filter_var($from, FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n]/', $to.$from) || $transport !== 'mail')) {
    finish(503, 'Bitte kontaktieren Sie uns per E-Mail.', 'Der Formularversand ist derzeit nicht verfügbar. Ihre Nachricht wurde nicht versendet.');
}
$state = getenv('CONTACT_STATE_DIR') ?: dirname(__DIR__, 2).'/var/contact';
if (!is_dir($state) && !@mkdir($state, 0700, true) && !is_dir($state)) {
    finish(503, 'Bitte versuchen Sie es später erneut.', 'Ihre Nachricht konnte nicht versendet werden.');
}
// Store only keyed rate-limit identifiers, never IP addresses or submitted messages.
$saltFile = $state.'/salt';
$saltHandle = @fopen($saltFile, 'c+');
if (!$saltHandle || !flock($saltHandle, LOCK_EX)) finish(503, 'Bitte versuchen Sie es später erneut.', 'Ihre Nachricht wurde nicht versendet.');
$salt = stream_get_contents($saltHandle);
if (!$salt) { $salt = bin2hex(random_bytes(32)); rewind($saltHandle); fwrite($saltHandle, $salt); fflush($saltHandle); @chmod($saltFile, 0600); }
flock($saltHandle, LOCK_UN); fclose($saltHandle);
$key = hash_hmac('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown', $salt);
$path = $state.'/'.$key.'.json';
$handle = @fopen($path, 'c+');
if (!$handle || !flock($handle, LOCK_EX)) finish(503, 'Bitte versuchen Sie es später erneut.', 'Ihre Nachricht wurde nicht versendet.');
$now = time();
$times = json_decode(stream_get_contents($handle), true);
$times = is_array($times) ? array_values(array_filter($times, fn($t) => is_int($t) && $t > $now - 3600)) : [];
if (count($times) >= 5) { flock($handle, LOCK_UN); fclose($handle); header('Retry-After: 3600'); finish(429, 'Bitte warten Sie einen Moment.', 'Es wurden bereits mehrere Anfragen gesendet. Versuchen Sie es später erneut oder kontaktieren Sie uns per E-Mail.'); }
$times[] = $now;
ftruncate($handle, 0); rewind($handle); fwrite($handle, json_encode($times)); fflush($handle); @chmod($path, 0600);
flock($handle, LOCK_UN); fclose($handle);
foreach (glob($state.'/*.json') ?: [] as $old) { if (filemtime($old) < $now - 7200) @unlink($old); }
$subject = 'Website-Anfrage: '.$fields['thema'];
$body = 'Name: '.$fields['name']."\nE-Mail: ".$fields['email']."\nThema: ".$fields['thema']."\n\n".$fields['nachricht'];
if ($isFileTest) {
    $sent = file_put_contents($testFile, json_encode(['subject'=>$subject,'body'=>$body], JSON_UNESCAPED_UNICODE)."\n", FILE_APPEND | LOCK_EX) !== false;
} else {
    $headers = ['From'=>$from, 'Reply-To'=>$fields['email'], 'MIME-Version'=>'1.0', 'Content-Type'=>'text/plain; charset=UTF-8'];
    $sent = @mail($to, '=?UTF-8?B?'.base64_encode($subject).'?=', $body, $headers);
}
if (!$sent) finish(503, 'Der Versand hat nicht funktioniert.', 'Ihre Nachricht wurde nicht versendet. Bitte versuchen Sie es später erneut oder schreiben Sie uns direkt per E-Mail.');
finish(200, 'Vielen Dank für Ihre Nachricht.', 'Ihre Anfrage wurde an den Mailversand übergeben. Wir melden uns bei Ihnen.');
