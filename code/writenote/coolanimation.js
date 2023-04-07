var app = document.getElementsByTagName("app")[0]
app.style.background = "radial-gradient(circle, rgba(239,183,229,1) 0%, rgba(34,34,66,1) 11%, rgba(112,91,128,1) 76%, rgba(101,186,255,1) 91%)"
function thisshit(ia){
    // ia = ia*1.5-10
    if(ia<11){
        app.style.background = "radial-gradient(circle, rgba(239,183,229,1) "+ia+"%, rgba(34,34,66,1) 11%, rgba(112,91,128,1) 76%, rgba(101,186,255,1) 91%)"
    }
    else{
        if(ia<76){
            app.style.background = "radial-gradient(circle,rgba(34,34,66,1) 11%,  rgba(239,183,229,1) "+ia+"%, rgba(112,91,128,1) 76%, rgba(101,186,255,1) 91%)"
        }
        else{
            if(ia<91){
                app.style.background = "radial-gradient(circle,rgba(34,34,66,1) 11%, rgba(112,91,128,1) 76%, rgba(101,186,255,1) 91%,  rgba(239,183,229,1) "+ia+"%)"
            }
        }
    }
}

var arartshit = []
var i=0
while(i!=80){
    arartshit.push(i)
    i++
}

setTimeout(() => {
    foreachDelayed(arartshit, thisshit, 20, true)
}, 2000);