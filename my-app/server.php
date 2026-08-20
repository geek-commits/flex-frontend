<?php

$publicPath = getcwd();

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '');

// Build assets are content-hashed and immutable. Serve them with an immutable
// cache lifetime and, when the client accepts it, a pre-compressed (brotli or
// gzip) sibling produced by `scripts/precompress.mjs`. This mirrors nginx
// gzip_static/brotli_static behaviour so it ports cleanly to a real web server.
if ($uri !== '/' && str_starts_with($uri, '/build/')) {
    $file = $publicPath.$uri;
    if (is_file($file)) {
        $extension = strtolower(pathinfo($uri, PATHINFO_EXTENSION));
        $compressible = in_array($extension, ['js', 'css'], true);

        $serveFile = $file;
        $encoding = null;

        if ($compressible) {
            $encodings = strtolower($_SERVER['HTTP_ACCEPT_ENCODING'] ?? '');
            if (str_contains($encodings, 'br') && is_file($file.'.br')) {
                $serveFile = $file.'.br';
                $encoding = 'br';
            } elseif (str_contains($encodings, 'gzip') && is_file($file.'.gz')) {
                $serveFile = $file.'.gz';
                $encoding = 'gzip';
            }
        }

        $mime = [
            'js' => 'application/javascript; charset=UTF-8',
            'css' => 'text/css; charset=UTF-8',
            'woff2' => 'font/woff2',
            'woff' => 'font/woff',
            'svg' => 'image/svg+xml',
        ][$extension] ?? (mime_content_type($file) ?: 'application/octet-stream');

        header('Content-Type: '.$mime);
        header('Cache-Control: public, max-age=31536000, immutable');
        header('Vary: Accept-Encoding');
        header('Content-Length: '.filesize($serveFile));

        if ($encoding !== null) {
            header('Content-Encoding: '.$encoding);
        }

        readfile($serveFile);

        return true;
    }
}

// Default: let the PHP built-in server serve existing static files directly,
// otherwise route into Laravel (mirrors the framework's bundled server.php).
if ($uri !== '/' && file_exists($publicPath.$uri)) {
    return false;
}

$formattedDateTime = date('D M j H:i:s Y');

$requestMethod = $_SERVER['REQUEST_METHOD'];
$remoteAddress = $_SERVER['REMOTE_ADDR'].':'.$_SERVER['REMOTE_PORT'];

file_put_contents('php://stdout', "[$formattedDateTime] $remoteAddress [$requestMethod] URI: $uri\n");

require_once $publicPath.'/index.php';
