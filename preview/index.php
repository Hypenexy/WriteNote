<link rel="stylesheet" href="style.css">
<app>
    <notearea style="overflow: hidden" contenteditable="true"></notearea>
    <header class="headeractive">
    <c tabindex="0">
    <svg width="32" height="32" viewBox="0 0 64 64">
        <rect x="4" y="8" width="56" height="8" rx="4" ry="4"></rect>
        <rect x="4" y="28" width="56" height="8" rx="4" ry="4"></rect>
        <rect x="4" y="48" width="56" height="8" rx="4" ry="4"></rect>
    </svg>
    </c>
    <a tabindex="0">Note</a>
    <a tabindex="0">Edit</a>
    <a tabindex="0">View</a>
    <button class="mobilebutton" tabindex="0">Untitled-2 <p class="m-i">web</p> • 16:53  <p class="m-i">wifi_off</p> <p class="m-i">mark_email_unread</p></button></header>
</app>
<script>
    var notearea = document.getElementsByTagName("notearea")[0]

    var i = 0,
    txt = '<?php
        $texts = [
            "Hey there!",
            "Hello world!",
            "Supports images!",
            "Invite your friends for a collab!",
        ];
        echo $texts[array_rand($texts)];
    ?>',
    speed = 50;

    function typeEffect(){
        if(i < txt.length){
            notearea.innerHTML += txt.charAt(i);
            i++;
            setTimeout(typeEffect, speed);
        }
    }

    typeEffect()
<?php

?>
</script>