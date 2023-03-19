<?php
function recurseCopy(
    string $sourceDirectory,
    string $destinationDirectory,
    string $childFolder = ''
): void {
    $directory = opendir($sourceDirectory);

    if (is_dir($destinationDirectory) === false) {
        mkdir($destinationDirectory);
    }

    if ($childFolder !== '') {
        if (is_dir("$destinationDirectory/$childFolder") === false) {
            mkdir("$destinationDirectory/$childFolder");
        }

        while (($file = readdir($directory)) !== false) {
            if ($file === '.' || $file === '..') {
                continue;
            }

            if (is_dir("$sourceDirectory/$file") === true) {
                recurseCopy("$sourceDirectory/$file", "$destinationDirectory/$childFolder/$file");
            } else {
                copy("$sourceDirectory/$file", "$destinationDirectory/$childFolder/$file");
            }
        }

        closedir($directory);

        return;
    }

    while (($file = readdir($directory)) !== false) {
        if ($file === '.' || $file === '..') {
            continue;
        }

        if (is_dir("$sourceDirectory/$file") === true) {
            recurseCopy("$sourceDirectory/$file", "$destinationDirectory/$file");
        }
        else {
            copy("$sourceDirectory/$file", "$destinationDirectory/$file");
        }
    }

    closedir($directory);
}

function minifyHtml($html){
    $body = $html->getBody(); //actually returns both HEAD and BODY

    //remove redundant (white-space) characters
    $replace = array(
        //remove tabs before and after HTML tags
        '/\>[^\S ]+/s'   => '>',
        '/[^\S ]+\</s'   => '<',
        //shorten multiple whitespace sequences; keep new-line characters because they matter in JS!!!
        '/([\t ])+/s'  => ' ',
        //remove leading and trailing spaces
        '/^([\t ])+/m' => '',
        '/([\t ])+$/m' => '',
        // remove JS line comments (simple only); do NOT remove lines containing URL (e.g. 'src="http://server.com/"')!!!
        '~//[a-zA-Z0-9 ]+$~m' => '',
        //remove empty lines (sequence of line-end and white-space characters)
        '/[\r\n]+([\t ]?[\r\n]+)+/s'  => "\n",
        //remove empty lines (between HTML tags); cannot remove just any line-end characters because in inline JS they can matter!
        '/\>[\r\n\t ]+\</s'    => '><',
        //remove "empty" lines containing only JS's block end character; join with next line (e.g. "}\n}\n</script>" --> "}}</script>"
        '/}[\r\n\t ]+/s'  => '}',
        '/}[\r\n\t ]+,[\r\n\t ]+/s'  => '},',
        //remove new-line after JS's function or condition start; join with next line
        '/\)[\r\n\t ]?{[\r\n\t ]+/s'  => '){',
        '/,[\r\n\t ]?{[\r\n\t ]+/s'  => ',{',
        //remove new-line after JS's line end (only most obvious and safe cases)
        '/\),[\r\n\t ]+/s'  => '),',
        //remove quotes from HTML attributes that does not contain spaces; keep quotes around URLs!
        '~([\r\n\t ])?([a-zA-Z0-9]+)="([a-zA-Z0-9_/\\-]+)"([\r\n\t ])?~s' => '$1$2=$3$4', //$1 and $4 insert first white-space character found before/after attribute
    );
    $body = preg_replace(array_keys($replace), array_values($replace), $body);

    //remove optional ending tags (see http://www.w3.org/TR/html5/syntax.html#syntax-tag-omission )
    $remove = array(
        '</option>', '</li>', '</dt>', '</dd>', '</tr>', '</th>', '</td>'
    );
    $body = str_ireplace($remove, '', $body);

    $html->setBody($body);
}


function everything_in_tags($string, $tagname)
{
    $pattern = "#<\s*?$tagname\b[^>]*>(.*?)</$tagname\b[^>]*>#s";
    preg_match($pattern, $string, $matches);
    if(!isset($matches[1])){
        return "";
    }
    return $matches[1];
}

function rmTree($dir) {
    $files = array_diff(scandir($dir), array('.','..'));
     foreach ($files as $file) {
       (is_dir("$dir/$file")) ? rmTree("$dir/$file") : unlink("$dir/$file");
    }
    return rmdir($dir);
}

function getDir($version){
    global $error;
    if($version==""){
        $error = "Version cannot be empty";
    }
    if(str_contains($version, "../")){
        $error = 'Version cannot contain "../"';
    }
    if(!isset($error)){
        return "releases\\" . $version;
    }
}

function finishTask(){
    $url = (empty($_SERVER['HTTPS']) ? 'http' : 'https') . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
    $url = strtok($url, '?');
    header("Location: $url");
}


if(isset($_GET["open"])){
    $outputDir = getDir($_GET["open"]);
    $dirToOpen = dirname(__FILE__) . '\\' . $outputDir;
    shell_exec("explorer /n, /e, $dirToOpen");

    finishTask();
}
if(isset($_GET["rm"])){
    $outputDir = getDir($_GET["rm"]);
    rmTree($outputDir);

    finishTask();
}
if(isset($_GET["renFrom"]) && isset($_GET["renTo"])){
    $outputDirFrom = getDir($_GET["renFrom"]);
    $outputDirTo = getDir($_GET["renTo"]);
    if(is_dir($outputDirTo)){
        $error = "Version already exists";
    }
    else{
        if(!isset($error)){
            rename($outputDirFrom, $outputDirTo);

            finishTask();
        }
    }
}
if(isset($_GET["ver"])){
    $outputDir = getDir($_GET["ver"]);

    if(!is_dir("releases")){
        mkdir("releases");
    }
    if(is_dir($outputDir)){
        $error = "Version already exists";
    }
    if(!isset($error)){
        mkdir($outputDir);
        mkdir("$outputDir/dist");


        $index = file_get_contents("../index.html");
        
        preg_match_all('/src=(["\'])(.*?)\1/', $index, $srcMatches);
        
        preg_match_all('/href=(["\'])(.*?)\1/', $index, $hrefMatches);
        
        $styles = array();
        
        foreach($hrefMatches[0] as $href){
            if(str_contains($href, "style/")){
                array_push($styles, substr($href, 6, -1));
            }
        }

        // $styleDir = new DirectoryIterator("../img/style/");
        // foreach($styleDir as $fileinfo){
        //     if(!$fileinfo->isDot()){
        //         $file = file_get_contents("../img/style/" . $fileinfo->getFilename());
        //         $file = str_replace("\n", "", $file);
        //         $style .= $file;
        //     }
        // }

        $style = "";

        foreach($styles as $stylefile){
            $file = file_get_contents("../$stylefile");
            $file = str_replace("\n", "", $file);
            $style .= $file;
        }

        file_put_contents($outputDir . "/dist/style.css", $style);

        $codes = array();
        
        foreach($srcMatches[0] as $src){
            array_push($codes, substr($src, 5, -1));
        }

        $code = "";

        foreach($codes as $codefile){
            $file = file_get_contents("../$codefile");
            $code .= "\n" . $file;
        }

        file_put_contents($outputDir . "/dist/code.js", $code);

        recurseCopy("../img/", "$outputDir/img/");

        // $assets = new DirectoryIterator("../img/");
        // foreach($assets as $fileinfo){
        //     if(!$fileinfo->isDot()){
        //         $subfolder = $fileinfo->getFilename();
        //         mkdir("$outputDir/$subfolder");
        //         if($subfolder!="style"){
        //             $subfolder = new DirectoryIterator("../img/".$subfolder);
        //             foreach($subfolder as $file){
        //                 if(!$file->isDot()){
        //                     $fileToTransfer = $file->getFilename();
        //                     $fileTransfer = file_get_contents("../img/$fileinfo/".$fileToTransfer);
        //                     file_put_contents($outputDir.'/'.$fileinfo.'/'.$fileToTransfer, $fileTransfer);
        //                 }
        //             }
        //         }
        //     }
        // }

        $app = '<!DOCTYPE html>
        <html style="background: #111" lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>WriteNote</title>
          <link rel="stylesheet" href="dist/style.css">
        </head>
        <body>
          <app></app>
          <script src="dist/code.js"></script>
        </body>
        </html>
        ';

        file_put_contents($outputDir . "/index.html", $app);

        finishTask();
    }
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WriteNote Package</title>
    <link rel="stylesheet" href="../style/app.css">
    <style>
        :root{
            --color: #000;
            --background: #fff;
            --lighterBg: #eee;
            --elementBg: #d3d3d3;
            --borderColor: #bbb;
            --borderColorH: #666;

            --accentC: #eee;
            --accent: #56635a;
        }
        :root{
            --color: #fff;
            --background: #080808;
            --lighterBg: #1c1c1c;
            --elementBg: #333;
            --bgColor: #eee;
            --borderColor: #666;
            --borderColorH: #eee;
        }
        body{
            overflow: auto;
            color: var(--color);
            background: var(--background);
        }
        h1, h2{
            font-weight: 400;
            margin: 20px;
        }
        form{
            margin: 20px;
            display: block;
            background: var(--lighterBg);
            border-radius: 12px;
            padding: 12px;
            max-width: 400px;
        }
        label{
            display: block;
            margin: 10px 0;
        }
        p{
            font-size: 18px;
        }
        input{
            display: block;
            width: 100%;
            border: 2px solid var(--borderColor);
            border-radius: 4px;
            padding: 4px;
            transition: .2s;
        }
        input:hover{
            border: 2px solid var(--borderColorH);
        }
        input:focus{
            border: 2px solid var(--accent);
        }
        button, .releases a{
            color: inherit;
            text-decoration: none;
            width: 100%;
            display: block;
            background: var(--elementBg);
            border: 2px solid var(--borderColor);
            border-radius: 4px;
            padding: 7px;
            margin-top: 10px;
            transition: .2s;
        }
        button:hover, .releases a:hover{
            border: 2px solid var(--borderColorH);
        }
        button:active, .releases a:active{
            border: 2px solid var(--accent);
            background: var(--accent);
            color: var(--accentC);
        }

        .releases{
            margin: 20px;
            max-width: 400px;
        }
        .releases div{
            background: var(--lighterBg);
            border-radius: 12px;
            margin: 20px 0;
            padding: 12px;
        }
    </style>
</head>
<body>
    <h1>WriteNote Web App Packager</h1>
    <form>
        <?php
            if(isset($error)){
                echo "<div class='error'>".$error."</div>";
            }
        ?>
        <label>
            <p>Version</p>
            <input placeholder="1.0.0" name="ver">
        </label>
        <button>Package</button>
    </form>
    <h2>Releases</h2>
    <div class="releases">
    <?php
        $noReleasesErr = "<div><p>There are no releases yet.</p></div>";
        if(is_dir("releases")){
            $styleDir = new DirectoryIterator("releases");
            $n = 0;
            foreach($styleDir as $fileinfo){
                if(!$fileinfo->isDot()){
                    $n++;
                    $version = $fileinfo->getFilename();
                    echo "<div><input value='$version'><a href='?open=$version'>Open</a><a href='?rm=$version'>Delete</a></div>";
                }
            }
            if($n == 0){
                echo $noReleasesErr;
            }
        }
        else{
            echo $noReleasesErr;
        }
    ?>
    </div>

    <script>
        var releases = document.getElementsByClassName("releases")[0];
        var renameInputs = releases.getElementsByTagName("input");
        for (let i = 0; i < renameInputs.length; i++) {
            const element = renameInputs[i];
            element.setAttribute("ogValue", element.value);
            element.addEventListener("change", function(){
                var ogValue = element.getAttribute("ogValue");
                if(ogValue != element.value){
                    window.location.href = window.location.href + "?renFrom="+ogValue+"&renTo="+element.value
                }
            })
        }
    </script>
</body>
</html>