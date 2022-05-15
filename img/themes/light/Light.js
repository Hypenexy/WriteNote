white = "#000"
black = "#fff"

var head = document.getElementsByTagName('head')[0]
var link = document.createElement('link')
link.id = 'usedtheme'
link.rel = 'stylesheet'
link.type = 'text/css'
link.href = "img/ui/themes/light/Light.css"
link.media = 'all'
head.appendChild(link)