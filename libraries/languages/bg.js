
function theallelementsmethod(){
    var all = document.getElementsByTagName("*");

    for (let i = 0; i < all.length; i++) {
        console.log(all[i].innerText)
        var n = all[i].innerText
        //console.log(i)
        if(n=="Appearance"){
            all[i].innerText = "Изглед"
        }
        if(n=="Sidepanel"){
            all[i].innerText = "Страничен панел"
        }
        if(n=="Change options for the sidepanel."){
            all[i].innerText = "Промени опцийте за страничният панел."
        }
        if(n=="Language"){
            all[i].innerText = "Език"
        }
        if(n=="Switch to your prefered language."){
            all[i].innerText = "Смени на предпочитаният ти език."
        }
        if(n=="Theme"){
            all[i].innerText = "Тема"
        }
        if(n=="Change to your prefered theme."){
            all[i].innerText = "Смени на предпочитанията ти тема."
        }
        if(n=="Change the size, boldness and font of the text."){
            all[i].innerText = "Промени големината, дебелината и стила на текста."
        }
        if(n=="Note"){
            all[i].innerText = "Ноут"
        }
        if(n=="Edit"){
            all[i].innerText = "Едит"
        }
        if(n=="View"){
            all[i].innerText = "Виел"
        }
        if(n=="Profile"){
            all[i].innerText = "Профил"
        }
        if(n=="About"){
            all[i].innerText = "Относно"
        }
        if(n=="Version"){
            all[i].innerText = "Версия"
        }

        console.log(all.length)
    }
}

function replaceHTML(){
    document.getElementsByTagName("app")[0].innerHTML = `
  <div id="settingsbrowser">
    <span onclick="closesettings()" class="x m-i">close</span>
    <div class="settings">
      <div class="account">
        <img src="IMG_2363.jpg">
        <user>Hypenexy</user>
      </div>
      <input placeholder="Потърси настройка">
      <a onclick="opensetting('account', event)"><span class="m-i">person</span>Акаунт</a>
      <a onclick="opensetting('appearance', event)"><span class="m-i">style</span>Изглед</a>
      <a onclick="opensetting('about', event)"><span class="m-i">info</span>Относно</a>
      <a style="color: #c54848;"><span class="m-i">logout</span>Излез от профил</a>
    </div>
    <div id="selectedsettings">Хей там!</div>
  </div>
  <div id="notepreview"></div>
  <div id="profilepanel"></div>
  <div id="notifications"></div>
  <div id="modal">
    <div id="welcome">
      <span onclick="closeHome()" class="x m-i">close</span>
      <div id="unsigned">
        <div class="mainWelcomeLogo"><img width="64px" height="64px" src="writenotepearl.ico"><a href="http://midelight.net/WriteNote"><h1>WriteNote</h1></a></div>

        <div class="mainWelcomesidebarUnsigned">
          <h2>Прави повече с акаунт</h2>
          <li>Запазвай и зареждай бележки изцяло онлайн</li>
          <li>Споделай файлове с други</li>
          <li>Персонализирай по твое харесване</li>
        </div>

        <img class="key" width="512px" src="img/ui/signinlight.png">

        <div class="unsignedbtn">
          <button onclick="hideWelcome()">Не, Благодаря</button> 
          <button class="blue" onclick="hideWelcome();login()">
            <svg stroke="#c8c8c8" viewBox="0 0 185.5 185.5" width="185.5" height="185.5" xmlns="http://www.w3.org/2000/svg">
              <g>
                <ellipse ry="87.5" rx="87.5" cy="92.5" cx="93" stroke-width="7"/>
                <ellipse stroke-width="7" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" stroke-dashoffset="0" ry="28" rx="28" cy="61" cx="92.5"/>
                <path stroke-width="7" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" d="m43.5,146l98.5,0m-98.5,0a49.5,42.5 0 0 1 0,-3.5a49.57,42.5 0 0 1 49.5,-42.5a49.5,42.5 0 0 1 49.5,42.5l0,0a49.5,42.5 0 0 1 0,3.5"/>
              </g>
           </svg>
           Впиши се
          </button>
        </div>
      </div>
      <div id="options">
        <h1>Лека вечер, Hypenexy</h1>
        <div class="flex">
          <div class="creativity">
            <a onclick="createproject()"><span class="m-i">add</span> Създай Проект</a>
            <a onclick="openproject()"><span class="m-i">file_open</span> Отвори Проект</a>
          </div>
          <div id="files">
            <input id="searchfiles" placeholder="Търси из проекти">
            <filters>
              <span class="op m-i">sort</span>
              <select><option>Последно отворени</option><option>Най-рано отворени</option><option>Азбучно</option><option>Големина</option></select>
              <span id="gridview" class="o m-i">grid_view</span>
              <span id="lineview" class="o m-i">view_headline</span>
            </filters>
            <div>
              <type><span class="m-i">description</span> Бележка</type>
              <span onclick="fileoptions('My summer diary', event)" class="more m-i">more_vert</span>
              <ti>My summer diary</ti>
              <p>Welcome to the only place i feel okay. In todays note...</p>
            </div>
            <div>
              <type><span class="m-i">web</span> Уеб Сайт</type>
              <span onclick="fileoptions('cool site', event)" class="more m-i">more_vert</span>
              <ti>cool site</ti>
              <p>imagine an html text here</p>
            </div>
            <div>
              <type><span class="m-i">article</span> Тескт</type>
              <span onclick="fileoptions('pari', event)" class="more m-i">more_vert</span>
              <ti>pari</ti>
              <p><- nqkoi: 10 lv kiko: 1.20 - 2 lv</p>
            </div>
          </div>
        </div>
      </div>
      <div id="create">
        <div class="name">
          <p>Найменувай твоя проект</p>
          <input id="createname"  placeholder="Untitled">
          <p>Store your project</p>
          <button id="createcloud"><span class="m-i">cloud</span> Cloud</button>
          <button id="createbrowser"><span class="m-i">web</span> Browser</button>
          <button id="createdevice"><span class="m-i">desktop_windows</span> Device</button>
          <div id="createcloudfolder">
            <p style="margin-top: 9px">Folder</p>
            <select style="margin:0" id="createcloudfolderselect">
              <option></option>
              <option>folderche</option>
              <option>homework</option>
            </select>
            <div class="flex"><input id="createaddfoldername" style="border-left: 1px solid #bbb;" placeholder="Folder name"><button id="createaddfolder" style="width:180px;height: 39px;padding:0;border-top:0">Add folder</button></div>
          </div>
          <div class="bottom">
            <!-- <p>Create the project</p> -->
            <button class="blue"><span class="m-i">add</span> Create</button> <button onclick="openhome()"><span class="m-i">close</span> Cancel</button>
          </div>
        </div>
        <div class="type">
          <p>Select a project type</p>
          <div class="types">
            <div id="createnote">
              <span class="m-i">description</span>
              Note
              <p>A normal text file with images and text styling.</p>
            </div>

            <div id="createtext">
              <span class="m-i">article</span>
              Text
              <p>A text only file.</p>
            </div>

            <div id="createtodo">
              <span class="m-i">checklist</span>
              To-Do
              <p>A to-do list with reminders.</p>
            </div>

            <div id="createimage">
              <span class="m-i">image</span>
              Image
              <p>An image editing environment.</p>
            </div>

            <div id="createweb">
              <span class="m-i">web</span>
              Web Site
              <p>Web builder for creating web sites.</p>
            </div>

            <div id="createjavascript">
              <span class="m-i">javascript</span>
              JavaScript Development
              <p>A debugger for JavaScript code.</p>
            </div>

            <div id="createcalculator">
              <span class="m-i">calculate</span>
              Calculator
              <p>Calculating focused editor.</p>
            </div>

          </div>
        </div>
      </div>
      <div id="open">
        <p>Store your project</p>
        <button id="createcloud"><span class="m-i">cloud</span> Cloud</button>
        <button id="createbrowser"><span class="m-i">web</span> Browser</button>
        <button id="createdevice"><span class="m-i">desktop_windows</span> Device</button>
        <div class="bottom">
          <!-- <p>Create the project</p> -->
          <button class="blue"><span class="m-i">add</span> Create</button> <button onclick="openhome()"><span class="m-i">close</span> Cancel</button>
        </div>
      </div>
    </div>
  </div>

    <header>
        <c id="navBtn" onclick="openNav()">
            <svg width="32" height="32" viewBox="0 0 64 64">
                <rect x="4" y="8" width="56" height="8" rx="4" ry="4"></rect>
                <rect x="4" y="28" width="56" height="8" rx="4" ry="4"></rect>
                <rect x="4" y="48" width="56" height="8" rx="4" ry="4"></rect>
            </svg>
        </c>
        <div class="dropdown">
            <a id="notebtn">Бележка</a>
            <div id="notedrp">
                <v onclick="newNote()"><span class="m-i">note_add</span> Нова</v>
                <hr>
                <v onclick="openNote()"><span class="m-i">file_open</span> Отвори</v>
                <v onclick="saveNote()"><span class="m-i">save</span> Запази</v>
                <v id="saveasbtn" onclick="saveAsNote()"><span class="m-i">save_as</span> Запази Като</v>
                <v onclick="shareNote()"><span class="m-i">share</span> Сподели</v>
                <hr>
                <v onclick="fileHistory()"><span class="m-i">history</span> Файл История</v>
            </div>
        </div>
        <div class="dropdown">
            <a id="editbtn">Редакция</a>
            <div id="editdrp">
                <v onclick="showfind()"><span class="m-i">search</span> Търси</v>
                <hr>
                <v onclick="undo()"><span class="m-i">undo</span> Отмяна</v>
                <v onclick="redo()"><span class="m-i">redo</span> Преправи</v>
                <hr>
                <v onclick="cut()"><span class="m-i">cut</span> Одрежи</v>
                <v onclick="copy()"><span class="m-i">copy</span> Копирай</v>
                <v onclick="paste()"><span class="m-i">paste</span> Постави</v>
                <v id="pastewoformat" onclick="paste()"><span class="m-i">content_paste_go</span> Постави Текст</v>
                <hr>
                <v onclick="selectText()"><span class="m-i">select_all</span> Избери Всичко</v>
            </div>
        </div>
        <div class="dropdown">
            <a id="viewbtn">Изглед</a>
            <div id="viewdrp">
                <v onclick="toggleCounter()"><span class="m-i">pin</span> Думо Брояч<tick id="wordcountercheckmark"></tick></v>
                <v onclick="toggleCalculator()"><span class="m-i">calculate</span> Калкулатор<tick id="calculatorcheckmark"></tick></v>
                <v onclick="toggleTimer()"><span class="m-i">timer</span> Таймер<tick id="timercheckmark"></tick></v>
                <hr>
                <v onclick="togglefullscreen()"><span class="m-i">fullscreen</span> Цял Екран<tick id="fullscreencheckmark"></tick></v>
                <!-- <v onclick="togglespellcheck()"><span class="m-i">spellcheck</span>Проверка на Правописа<tick id="spellcheckcheckmark"></tick></v> -->
                <v onclick="togglewordwrap()"><span class="m-i">wrap_text</span> Word Wrap<tick id="wordwrapcheckmark"></tick></v>
                <v onclick="showdirection()" class="writingdirection"><span class="m-i">format_textdirection_l_to_r</span> Дирекция на Писан<span style="float: right" class="m-i">chevron_right</span>е</v>
                <div id="directions" class="extmenu writingdirectionmenu">
                  <v onclick="direction(false)">От Ляво на Дясно<tick id="ltrcheckmark"></tick></v>
                  <v onclick="direction(true)">От Дясно на Ляво<tick id="rtlcheckmark"></tick></v>
                </div>
                <v onclick="openotherwindow('font')" class="writingdirection"><span class="m-i">text_fields</span> Промени Фонта</v>
                <v onclick="openotherwindow('theme')"><span class="m-i">style</span> Тема</v>
            </div>
        </div>
        <svg id="profilepanelbtn" width="50" height="50" viewBox="0 0 185.5 185.5" xmlns="http://www.w3.org/2000/svg">
          <g>
            <ellipse ry="87.5" rx="87.5" cy="92.5" cx="93" stroke-width="7" fill="none"/>
            <ellipse fill="none" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" stroke-dashoffset="0" ry="28" rx="28" cy="61" cx="92.5"/>
            <path fill="none" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" d="m43.5,146l98.5,0m-98.5,0a49.5,42.5 0 0 1 0,-3.5a49.57,42.5 0 0 1 49.5,-42.5a49.5,42.5 0 0 1 49.5,42.5l0,0a49.5,42.5 0 0 1 0,3.5"/>
          </g>
        </svg>
        <svg id="notificationsbtn" xmlns="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 611.999 611.999">
          <path d="M570.107,500.254c-65.037-29.371-67.511-155.441-67.559-158.622v-84.578c0-81.402-49.742-151.399-120.427-181.203
            C381.969,34,347.883,0,306.001,0c-41.883,0-75.968,34.002-76.121,75.849c-70.682,29.804-120.425,99.801-120.425,181.203v84.578
            c-0.046,3.181-2.522,129.251-67.561,158.622c-7.409,3.347-11.481,11.412-9.768,19.36c1.711,7.949,8.74,13.626,16.871,13.626
            h164.88c3.38,18.594,12.172,35.892,25.619,49.903c17.86,18.608,41.479,28.856,66.502,28.856
            c25.025,0,48.644-10.248,66.502-28.856c13.449-14.012,22.241-31.311,25.619-49.903h164.88c8.131,0,15.159-5.676,16.872-13.626
            C581.586,511.664,577.516,503.6,570.107,500.254z M484.434,439.859c6.837,20.728,16.518,41.544,30.246,58.866H97.32
            c13.726-17.32,23.407-38.135,30.244-58.866H484.434z M306.001,34.515c18.945,0,34.963,12.73,39.975,30.082
            c-12.912-2.678-26.282-4.09-39.975-4.09s-27.063,1.411-39.975,4.09C271.039,47.246,287.057,34.515,306.001,34.515z
             M143.97,341.736v-84.685c0-89.343,72.686-162.029,162.031-162.029s162.031,72.686,162.031,162.029v84.826
            c0.023,2.596,0.427,29.879,7.303,63.465H136.663C143.543,371.724,143.949,344.393,143.97,341.736z M306.001,577.485
            c-26.341,0-49.33-18.992-56.709-44.246h113.416C355.329,558.493,332.344,577.485,306.001,577.485z"/>
        </svg>
    </header>

    <header id="documenttools">
      <a><span class="m-i">format_color_fill</span></a>
      <a><span class="m-i">format_color_text</span></a>
      <a><span class="m-i">format_color_reset</span></a>
    </header>

    
    <div id="menuPanel" class="sidepanel">
      <input id="notename" value="Untitled"><p id="notenametext" style="display: none">Name is already taken.</p>
      <a class="closebtn" onclick="closeNav()">×</a>
      <div class="smallMenuPanelElements">
        <a onclick="dropdown('note');closeNav()">Note</a>
        <a onclick="dropdown('edit');closeNav()">Edit</a>
        <a onclick="dropdown('view');closeNav()">View</a>
        <a id="anotherloginbtn" onclick="login(); closeNav()">Sign In</a>
        <hr style="width: 80%;">
      </div>
      <a onclick="openotherwindow('account')">Профил</a>
      <a onclick="openotherwindow('theme')">Тема</a>
      <a onclick="openotherwindow('about')">Относно</a>
      <a onclick="openotherwindow('info')">Версия</a>

      <div id="weather">
        <div id="weatherinfo">
          <a class="link" onclick="openotherwindow('sidepanel')">Настройки</a>
        </div>
      </div>

      <div class="unsignedAnnotation" id="unsignedAnnotation">
        <h2>Не си вписан.</h2>
        <h3>WriteNote е по-добър с акаунт!</h3>
        <button onclick="loginannotation()">Впиши се</button> <button onclick="noplzno()">Отхвърляне</button>
      </div>

      <div id="spaceleft" class="prograssdiv">
        <spacey id="spacetext">0 GB of 5 GB used.</spacey>
        <div class="progress">
          <div id="spacepercentage" class="progress-bar" style="width: 0%"></div>
        </div>
      </div>

      <div class="logo" onclick="logo()"><a><img width="64px" height="64px" src="lowpolyc.png"></a><h2>Midelight</h2></div>
    </div>
    
    <div id="wordCountdiv"><a id="wordCount"> Думи 0 • Символи 0</a><span onclick="hideCounter()" class="x m-i">close</span><span class="x o m-i">open_in_new</span></div>

    <div id="apps"></div>

    <div contenteditable id="notearea"></div>`
}

replaceHTML()