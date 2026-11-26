<?php
/* Makros website: sends every form straight to the hello inbox. No email app on the visitor's side. */
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$TO   = 'hello@makrossolutions.com';
$FROM = 'website@makrossolutions.com';

function out($ok, $code = 200) { http_response_code($code); echo json_encode(['ok' => $ok]); exit; }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') out(false, 405);

/* only accept posts from our own pages */
$origin = $_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
$host   = parse_url($origin, PHP_URL_HOST) ?: '';
if ($host !== '' && !preg_match('/(^|\.)makrossolutions\.com$|(^|\.)mks\.lk$/i', $host)) out(false, 403);

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) $data = $_POST;

/* bots fill the hidden field; we pretend it worked and drop it */
if (!empty($data['_honey'])) out(true);

/* a light limit: five messages per address per ten minutes */
$ip  = $_SERVER['REMOTE_ADDR'] ?? 'x';
$dir = sys_get_temp_dir() . '/mks_rate';
if (!is_dir($dir)) @mkdir($dir, 0700, true);
$f   = $dir . '/' . md5($ip);
$now = time();
$hits = array_filter(@file($f, FILE_IGNORE_NEW_LINES) ?: [], function ($t) use ($now) { return $now - (int)$t < 600; });
if (count($hits) >= 5) out(false, 429);
$hits[] = $now; @file_put_contents($f, implode("\n", $hits));

function clean($v, $max = 2000) { $v = trim(strip_tags((string)$v)); $v = str_replace(["\r", "\0"], '', $v); return mb_substr($v, 0, $max); }

$name = clean($data['Name'] ?? '', 120);
if ($name === '') out(false, 422);

$fields = ['Name', 'Company', 'Email', 'Phone', 'Interested_in', 'Message', 'Source', 'Page'];
$lines = [];
foreach ($fields as $k) {
  if (!empty($data[$k])) $lines[] = str_replace('_', ' ', $k) . ': ' . clean($data[$k], $k === 'Message' ? 5000 : 300);
}
$lines[] = 'Sent: ' . date('j M Y, g:i a') . ' (server time)';

$email   = filter_var(clean($data['Email'] ?? '', 200), FILTER_VALIDATE_EMAIL);
$subject = 'Makros website lead: ' . preg_replace('/[\r\n]+/', ' ', $name);
$headers = [
  'From: Makros website <' . $FROM . '>',
  'Content-Type: text/plain; charset=UTF-8',
  'X-Mailer: makrossolutions.com',
];
if ($email) $headers[] = 'Reply-To: ' . preg_replace('/[\r\n]+/', '', $name) . ' <' . $email . '>';

$sent = @mail($TO, '=?UTF-8?B?' . base64_encode($subject) . '?=', implode("\n", $lines), implode("\r\n", $headers), '-f' . $FROM);
out((bool)$sent, $sent ? 200 : 500);
