customElements.define(`menu-plugins`, class extends HTMLElement {

    constructor() {
        super();
        this.parent = this;
        this.root = this.attachShadow({ mode: `open` });
        this.params = {
            url: (this.getAttribute(`url`) || `urlTest`)
        };
        this.data = {};
        this._pluginsJSON = this.loadJSONPlugins();
    }

    static get observedAttributes() { return ['url']; }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`attributeChangedCallback`);
        console.log(name, oldValue, newValue);
    }

    connectedCallback() {
        // css+html
        this.css = `
        *{
            border:0px;
            margin:0px;
            padding: 0px;
        
            border-collapse: collapse;
            box-sizing: border-box;
            font-family: helvetica;
        }
        *:focus {
            outline: 0;
        }

        /* ***** ***** */
        body{
            background: #eee;
        }

        #titleSection{
            color:rgb(255, 255, 255);
        }

        .hidden{
            display: none;
        }

        .deleteButtonAmp{
            font-size: 20px;
            position: absolute;
            left:190px;
            top:6px;
            background: rgb(230,70,0);
            color: white;
            border-radius: 30px;
            width: 30px;
            height: 30px;
        }

        .deleteButton{
            font-size: 20px;
            position: absolute;
            left:80px;
            top:6px;
            background: rgb(230,70,0);
            color: white;
            border-radius: 30px;
            width: 30px;
            height: 30px;
        }

        .leftButton{
            font-size: 20px;
            position: absolute;
            left:30px;
            top:6px;
            background: rgb(220,220,220);
            color: black;
            border-radius: 30px;
            width: 30px;
            height: 30px;
        }

        .rightButton{
            font-size: 20px;
            position: absolute;
            left:130px;
            top:6px;
            background: rgb(220,220,220);
            color: black;
            border-radius: 30px;
            width: 30px;
            height: 30px;
        }

        #div_menu{
            background: #333;
            box-shadow:0px 3px 4px #111;

            width:1200px;
            height:700px;

            overflow:hidden;

        }
        #div_menu ul{
            list-style:none;
            display:flex;
            flex-direction:row;
            overflow:scroll;
        }
        #ampSimsList{
            height:230px;
        }
        
        #pluginsList{
            height:500px;
            flex-wrap:wrap;
        }
        #pluginsList li img{

            height:200px;
        }
        #div_menu ul li{
            margin:5px;
        }
        #div_menu ul li img{
            box-shadow:0px 3px 4px #111;
            
            object-fit:cover;
            border:3px dashed transparent;
            cursor:pointer;
            vertical-align:top;
        }

        #div_menu select{
            background: #222;
            color:#eee;

            font-size:20px;
        }

        #div_menu ul li img[dropActive=true]{
            box-shadow:0px 3px 10px #000;
            border:3px dashed lightgreen;
        }

        #addAmp{
            font-size: 100px;
            width: 300px;
            height: 140px;
            border: 3px dashed white;
            border-radius: 10px;
            color: white;
            text-align: center;
            line-height: 120px;
            margin-left: 30px;
        }

        #addPlugin{
            font-size:100px;
            width:150px;
            height:200px;
            border: 3px dashed white;
            border-radius: 10px;
            color:white;
            text-align: center;
            line-height: 160px;
            margin-left: 30px;
        }

        #Amp{
            font-size:40px;
            width:300px;
            height:140px;
            border: 3px solid white;
            border-radius: 10px;
            color:white;
            text-align: center;
            margin-left: 30px;
        }


        #Plugin, #Plugin2{
            font-size:40px;
            width:150px;
            height:200px;
            border: 3px solid white;
            border-radius: 10px;
            color:white;
            text-align: center;
            margin-left: 30px;
            overflow: scroll;
        }

        #Plugin3{
            font-size:20px;
            width:150px;
            height:200px;
            border: 3px solid white;
            border-radius: 10px;
            color:white;
            text-align: center;
            margin-left: 30px;
        }

        .optionMenuAmp{
            position: absolute;
            top: 200px;
            width: 450px;
            height: 50px;
            border: 3px solid white;
            border-radius: 10px;
        }

        .optionMenu{
            position: absolute;
            top:550px;
            width: 200px;
            height: 50px;
            border: 3px solid white;
            border-radius:10px;
        }

        .invokedPlugin{
            width: 200px;
            height: 273px;
            margin: 10px;
        }

        .family{
            font-size:12px;
            width: 144px;
            height: 16px;
            border: 1px solid white;
        }

        .family:hover{
            color:black;
            background-color:white;
        }
        `;
        this.html = `
        <div id='div_menu'>
        <audio src="./assets/audio/BasketCaseGreendayriffDI.mp3" id="soundSample" controls loop></audio>
            <h1 id="titleSection">AmpSimulator</h1>
            <ul id='ampSimsList'>
                <div id="addAmp">+</div>
            </ul>
            <h1 id="titleSection">Plugins</h1>
            <ul id='pluginsList'>
                <div id="addPlugin">+</div>
            </ul>
        </div>
        `;
        this.root.innerHTML = `<style>${this.css}</style><div id='wrapper'>${this.html}</div>`;

        //Audio context
        this.ctx = new AudioContext();
        this.player= this.shadowRoot.querySelector("#soundSample");
        this.mediaSource=this.ctx.createMediaElementSource(this.player);

        this.audioPluginConnexion = []; 

        //Création des éléments au chargement du site
        this.categoryPlugins;
        this.ampList;

        this._pluginsJSON.then(d => this.buildMenuPlugins(d));

        this.choiceCategoryPlugin = this.shadowRoot.querySelector("#choiceCategoryPlugin")
        this.div_menu = this.shadowRoot.querySelector(`#div_menu`);
        this.pluginsList = this.shadowRoot.querySelector(`#pluginsList`);
        this.addAmp = this.shadowRoot.querySelector("#addAmp");
        this.addPlugin = this.shadowRoot.querySelector("#addPlugin");
        this.ampSimsList = this.shadowRoot.querySelector(`#ampSimsList`);

        this.familyChoosen = [];
        this.ampChoosen = [];

        this.deleteButton;

        this.choiceFamily;
        this.choiceAmp;
        this.pluginListJson;

        this.limitPlugin = 0;
        this.instanciation = 0;

        this.addAmp.addEventListener("click", (e) => this.chooseAmp(e));
        this.addPlugin.addEventListener("click", (e) => this.chooseFamily(e));


        //Chargement des plugins depuis le repo et classement par famille
        const _pathJSON = `https://mainline.i3s.unice.fr/WebAudioPluginBank/repository.json`;
        let _amp = []
        let _pluginsCategory = [];
        let _index, _count;
        _index = _count = 0;
        let _li;
        this.fetchJSON(_pathJSON).then((_d) => {
            for (const p in _d.plugs) {
                this.fetchJSON(`${_d.plugs[p]}/main.json`).then((_p) => {
                    _count++;
                    let option = document.createElement("option");
                    if (_p.category != "AmpSim" && !_pluginsCategory.includes(_p.category)) {
                        _pluginsCategory.push(_p.category);
                        option.text = _p.category;
                    }
                    if (_p.category == "AmpSim") {
                        //this.ampSimsList.insertAdjacentElement(`beforeEnd`, this.createItem(_count, _d, _p, p));
                        _amp.push(_p.name);
                    }
                    else {
                        _p.url = _d.plugs[p];
                        //this.pluginsList.insertAdjacentElement(`beforeEnd`, this.createItem(_count, _d, _p, p));
                    }
                });
                //if (_index == Object.keys(_d.plugs).length - 1) 
                _index++;
            }
            this.categoryPlugins = _pluginsCategory;
            this.ampList = _amp;
        })





    }

    //lien: https://jsbin.com/zelepix/edit?html,js,console,output

    // 1) Gérer déplacemennt pédale
    // 2) Faire précédent dans le menu des choix des plugins
    // 3) faire la connexionn de chaque plugin
    // 4) Faire du rack une wap


    /*      CHARGEMENT DU REPO DE PLUGINS A L'ININTIALISATION DE LA PAGE    */
    //Chargement des scripts des plugins
    loadJSONPlugins() {
        return new Promise((resolve, reject) => {
            let _index = 0;
            const _pathJSON = `https://mainline.i3s.unice.fr/WebAudioPluginBank/repository.json`;
            let _pluginsCategory = [];
            let _pluginsJSON = [];
            let _plugins = []
            this.fetchJSON(_pathJSON).then((_d) => {
                for (const p in _d.plugs) {
                    this.fetchJSON(`${_d.plugs[p]}/main.json`).then((_p) => {
                        _plugins.push(_p);
                        if (!_pluginsCategory.includes(_p.category)) {
                            _pluginsCategory.push(_p.category);

                            _pluginsJSON[_p.category] = [];
                            this.pluginListJson = _plugins;
                        }
                        _p.url = _d.plugs[p];
                        _pluginsJSON[_p.category].push(_p);
                    })
                    if (_index == Object.keys(_d.plugs).length - 1) resolve(_pluginsJSON);
                    _index++;
                }
            });
        });
    }

    fetchJSON(_url) {
        return new Promise((resolve, reject) => {
            fetch(_url)
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
                    return response.json();
                })
                .then(_json => {
                    resolve(_json);
                })
                .catch(error => {
                    throw new Error(`HTTP error ${error}`);
                })
        });
    }

    buildMenuPlugins(_pluginsJSON) {
        for (const p in _pluginsJSON) {
            console.log(_pluginsJSON[p]);
        }

        Object.keys(_pluginsJSON).map(
            (elem, index) => {
                console.log(_pluginsJSON[elem]);
            }
        )
    }

    /*      GESTION DU MENU DU CHOIX DE PLUGIN ET DE LA CREATION DU PLUGIN   */

    //Après avoir choisi l'ampli dans la liste de selection, charge l'ampli
    chooseAmp(e) {
        e.currentTarget.remove();
        let amp = document.createElement("div");
        amp.id = "Amp";
        this.ampSimsList.append(amp);
        for (let i = 0; i < this.ampList.length; i++) {
            let ampListChoose = document.createElement("div");
            ampListChoose.className = "ampListChoose";
            ampListChoose.id = this.ampList[i];
            ampListChoose.innerText = this.ampList[i];
            amp.append(ampListChoose);

            this.choiceAmp = this.shadowRoot.querySelectorAll(".ampListChoose");
            this.choiceAmp[i].addEventListener("click", (e) => this.loadAmp(e));
        }
    }

    //Après avoir cliqué sur '+', affiche la liste de famille de plugins
    chooseFamily(e) {
        e.currentTarget.remove();
        let plugin = document.createElement("div");
        plugin.id = "Plugin";
        this.pluginsList.append(plugin);
        for (let i = 0; i < this.categoryPlugins.length; i++) {
            let family = document.createElement("div");
            family.className = "family";
            family.id = this.categoryPlugins[i];
            family.innerText = this.categoryPlugins[i];
            plugin.append(family);
            this.choiceFamily = this.shadowRoot.querySelectorAll(".family");
            this.choiceFamily[i].addEventListener("click", (e) => this.choosePlugin(e));
        }
    }

    //Après avoir choisi la famille, affiche la liste de plugin faisant partie de la famille
    choosePlugin(e) {
        e.currentTarget.parentNode.remove();
        let plugin2 = document.createElement("div");
        plugin2.id = "Plugin2";
        this.pluginsList.append(plugin2);
        for (let i = 0; i < this.pluginListJson.length; i++) {
            if (e.currentTarget.innerText == this.pluginListJson[i].category) {
                this.familyChoosen.push(this.pluginListJson[i]);
                let family = document.createElement("div");
                family.className = "family";
                family.id = this.pluginListJson[i].name;
                family.innerText = this.pluginListJson[i].name;
                plugin2.append(family);
            }
        }
        this.choiceFamily = this.shadowRoot.querySelectorAll(".family");
        for (let j = 0; j < this.choiceFamily.length; j++) {
            this.choiceFamily[j].addEventListener("click", (e) => this.loadPlugin(e));
        }
    }

    loadAmp(e) {
        for (let i = 0; i < this.pluginListJson.length; i++) {
            if (e.currentTarget.innerText == this.pluginListJson[i].name) {
                let className = this.pluginListJson[i].vendor + this.pluginListJson[i].name;
                this.loadPluginFromWasabi(className, this.pluginListJson[i].url, this.pluginListJson[i].category);
            }
        }
    }
    //Après avoir choisi le plugin, charge le plugin demandé auprès du repo  
    loadPlugin(e) {
        for (let i = 0; i < this.familyChoosen.length; i++) {
            if (e.currentTarget.innerText == this.familyChoosen[i].name) {
                let className = this.familyChoosen[i].vendor + this.familyChoosen[i].name;
                this.loadPluginFromWasabi(className, this.familyChoosen[i].url, this.pluginListJson[i].category);
            }
        }
    }

    deleteAmp(e){
        e.currentTarget.parentNode.parentNode.remove();
        let addAmp = document.createElement("div");
        addAmp.id = "addAmp";
        addAmp.innerText="+";
        this.ampSimsList.append(addAmp);
        this.addAmp = this.shadowRoot.querySelector("#addAmp");
        this.addAmp.addEventListener("click", (e) => this.chooseAmp(e));
    }

    //Supprimer un plugin chargé
    deletePlugin(e) {
        e.currentTarget.parentNode.parentNode.remove();
        if (this.limitPlugin >= 5) {
            let addElement = document.createElement("div");
            addElement.id = "addPlugin";
            addElement.innerText = "+";
            this.pluginsList.append(addElement);
            this.addPlugin = this.shadowRoot.querySelector("#addPlugin");
            this.addPlugin.addEventListener("click", (e) => this.chooseFamily(e));
        }
        this.limitPlugin--;
    }

    //Affiche la case '+' pour pouvoir ajouter un plugin, sauf si la limite de plugin est atteinte
    addPluginElement() {
        if (this.limitPlugin < 5) {
            let addElement = document.createElement("div");
            addElement.id = "addPlugin";
            addElement.innerText = "+";
            this.pluginsList.append(addElement);
            this.addPlugin = this.shadowRoot.querySelector("#addPlugin");
            this.addPlugin.addEventListener("click", (e) => this.chooseFamily(e));
            this.limitPlugin++;
        }
        if (this.limitPlugin == 5) {
            this.addPlugin.id = "hidden";
            this.addPlugin.innerText = "";
        }
    }

    //Requete et chargement du plugin auprès du repo
    loadPluginFromWasabi(className, baseURL, category) {
        let scriptURL = baseURL + "/main.js";

        if (this.scriptExists(scriptURL)) {
            //script exists
            console.log("SCRIPT EXISTS WE JUST INSTANCIATE THE PLUGIN");
            this.buildPlugin(className, baseURL, category);
            return;
        }

        console.log("SCRIPT DOES NOT EXIST, ADD A SCRIPT SRC=, THEN INSTANCIATE PLUGIN")

        // if we are here this means that the script is not present. Add it to the document
        let script = document.createElement("script");
        script.src = scriptURL;

        let parent = this;
        script.onload = function () {
            // Once the script has been loaded instanciate the plugin
            parent.buildPlugin(className, baseURL, category);
        }

        // will be executed before the onload above...
        document.head.appendChild(script);
    }

    scriptExists(url) {
        return document.querySelectorAll(`script[src="${url}"]`).length > 0;
    }

    buildPlugin(className, baseURL, category) {

        var plugin = new window[className](this.ctx, baseURL);
        console.log(plugin);
        let parent = this;

        plugin.load().then((node) => {
            // loads and initialize the audio processor part
            // Then use the factory to create the HTML custom elem that holds the GUI
            // The loadGUI method takes care of inserting the link rel=import part,
            // not doing it twice, and associate the node with its GUI.
            if(category=="AmpSim"){
                node.type="amp";
            }else{
                node.type="plugin";
            }
            this.audioConnexion(node);
            plugin.loadGui().then((elem) => {
                console.log("ADDING PLUGIN");
                // show the GUI of the plugn, the audio part is ready to be used
                if (category != "AmpSim") {
                    parent.addDivWithPlugin(elem);
                } else {
                    parent.addDivWithAmp(elem);
                }
               
            });
        });

    }

    audioConnexion(node){
        let lastConnexion;
        let lastIndex=this.audioPluginConnexion.length-1;
        if(node.type!="amp"){
            if(this.audioPluginConnexion.length>0 && this.audioPluginConnexion[lastIndex].type!="amp"){
                this.audioPluginConnexion.push(node);
            }else{
                this.audioPluginConnexion.splice(lastIndex-2, 0, node);
            }
            
        }
        else{
            //L'audioNode de l'ampli est forcément dernier s'il est invoqué
            this.audioPluginConnexion.push(node);
        }

        this.mediaSource.connect(this.audioPluginConnexion[0]);
        if(this.audioPluginConnexion.length>1){
            for(let i = 0; i<this.audioPluginConnexion.length-1; i++){
                console.log("plug1: ", this.audioPluginConnexion[i]);
                console.log("plug2: ", this.audioPluginConnexion[i+1]);
                this.audioPluginConnexion[i].connect(this.audioPluginConnexion[i+1]);
                lastConnexion=this.audioPluginConnexion[i+1];
            }
        }else if(this.audioPluginConnexion.length==1){
            lastConnexion=this.audioPluginConnexion[0];
        }
        console.log(this.audioPluginConnexion);
        console.log(lastConnexion);
        lastConnexion.connect(this.ctx.destination);
    }

    addDivWithAmp(elem) {
        this.root.querySelector("#Amp").remove();
        let mainDiv = document.createElement("div");
        mainDiv.id = elem.localName + "_" + this.instanciation;
        mainDiv.className = "invokedAmp";

        let optionAmp = document.createElement("div");
        optionAmp.id = "optionMenuAmp_" + elem.localName + this.instanciation;
        optionAmp.className = "optionMenuAmp";

        let deleteButton = document.createElement("button");
        deleteButton.className = "deleteButtonAmp";
        deleteButton.id = "delete_" + elem.localName + "_" + this.instanciation;
        deleteButton.innerText = "X";

        this.ampSimsList.append(mainDiv);
        mainDiv.append(elem);
        mainDiv.append(optionAmp);
        optionAmp.append(deleteButton);

        elem.style.position = "absolute";
        elem.style.transformOrigin = "left top";

        this.deleteButton = this.root.querySelector("#delete_" + elem.localName + "_" + this.instanciation).addEventListener("click", (e) => this.deleteAmp(e));
    }

    addDivWithPlugin(elem) {

        this.root.querySelector("#Plugin2").remove();
        let mainDiv = document.createElement("div");
        mainDiv.id = elem.localName + "_" + this.instanciation;
        mainDiv.className = "invokedPlugin";

        let optionPlugin = document.createElement("div");
        optionPlugin.id = "optionMenu_" + elem.localName + this.instanciation;
        optionPlugin.className = "optionMenu";

        let deleteButton = document.createElement("button");
        deleteButton.className = "deleteButton";
        deleteButton.id = "delete_" + elem.localName + "_" + this.instanciation;
        deleteButton.innerText = "X";


        this.pluginsList.append(mainDiv);
        mainDiv.append(elem);
        mainDiv.append(optionPlugin);
        optionPlugin.append(deleteButton);
        elem.style.position = "absolute";
        elem.style.transformOrigin = "left top";

        this.deleteButton = this.root.querySelector("#delete_" + elem.localName + "_" + this.instanciation).addEventListener("click", (e) => this.deletePlugin(e));
    
        let w = elem.offsetWidth;
        let h = elem.offsetHeight;
        let scale = 1;
        if (w > h) {
            console.log("w > h on contraint la largeur")
            console.log("largeur : " + w + " on veut contraindre à 150px")

            scale = 150 / w;
        } else {
            console.log("h > w on contraint la hauteur")
            console.log("hauteur : " + h + " on veut contraindre à 200px")
            scale = 200 / h;
        }
        console.log("scale = " + scale)
        elem.style.transform = "scale(" + scale + "," + scale + ")";
        this.addPluginElement();
        this.instanciation++;
    }

    /*createItemLI(_name) {
        let _li = document.createElement(`li`);
        _li.id = `li_${_name}`;
        _li.innerText = _name;
        return _li;
    }*/

    /*      GESTION DE L'AFFICHAGE ET DE LA CREATION DES AMPS      */

    createItem(_count, _d, _p, p) {
        let _li, _img;

        _li = document.createElement(`li`);
        if (_p.category != "AmpSim") _li.className = `hidden`;
        _li.id = `li_${_count}`;
        _li.setAttribute(`data-category`, _p.category);

        _img = document.createElement(`img`);
        _img.id = `img_${_count}`;
        _img.title = _p.name;
        _img.setAttribute(`draggable`, true);
        _img.src = `${_d.plugs[p]}/${_p.thumbnail}`;
        _li.insertAdjacentElement(`beforeEnd`, _img);

        _li.ondrop = (e) => this.drop(e);
        _li.ondragover = (e) => this.allowDrop(e);
        _li.ondragleave = (e) => this.leaveDropZone(e);
        _img.ondragstart = (e) => this.drag(e);

        return _li;
    }

    // PERMET DE SWITCHER ENTRE LES PLUGINS
    allowDrop(ev) {
        ev.target.setAttribute(`dropActive`, true);
        ev.preventDefault();
    }

    leaveDropZone(ev) {
        ev.target.removeAttribute(`dropActive`);
    }

    drop(ev) {
        ev.preventDefault();
        ev.target.removeAttribute(`dropActive`);
        var src = this.shadowRoot.querySelector(`#${ev.dataTransfer.getData("src")}`);
        var srcParent = src.parentNode;
        var tgt = ev.currentTarget.firstElementChild;

        ev.currentTarget.replaceChild(src, tgt);
        srcParent.appendChild(tgt);
        console.log('drop =>', ev.currentTarget.id);
    }

    drag(ev) {
        console.log('drag =>', ev.target.id);
        ev.dataTransfer.setData("src", ev.target.id);
    }

    /*
    selectedPlugings(e) {
        this.pluginsList.querySelectorAll("li").forEach(li => {
            if (li.getAttribute(`data-category`) == e.target.value) {
                li.classList.remove(`hidden`);
            } else {
                if (!li.classList.contains(`hidden`)) li.classList.add(`hidden`);
            }
        })
    }*/
})