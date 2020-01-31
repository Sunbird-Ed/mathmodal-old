<template>
    <div class="mathModalRoot">
        <!-- <h1>Math Modal</h1>
        <b-button v-b-modal.mathModal>Equation</b-button> -->

        <b-modal class="mathModal"  id="mathModal"
                    title="BootstrapVue"
                    :scrollable=true
                    :hide-footer=true
                    :hide-header=true
                    ref="mathModal" 
                    :no-fade=true
                    @shown="handleModalInitialization()">

            <slot modal-header>
                <b-button class="modal-close-btn close" size="sm" @click="closeModal()"><span aria-hidden="true">&times;</span></b-button>
            </slot>
            
            <b-card no-body>
                <b-tabs justified small card   >
                    <b-tab title="Library" active @click=changeTab>
                        <div class="item select list-items math-lib" 
                            @click=latexToEquations(item.equation)
                            v-for="item in this.libEquation" :key="item.id"
                            >
                            <div class="middle aligned content">
                                <div class="math-lib-header">{{item.title}}</div>
                                <div class="meta math-lib-meta" id="item.id" v-html="item.equationHtml"></div>
                            </div>
                        </div>
                    </b-tab>

                    <b-tab title="Symbols" @click=changeTab>
                        <div class="ui right aligned grid">
                            <div class="right floated right aligned six wide column">
                                <b-form-select v-model="symbolSelected" class="mb-3">
                                    <option value="all">All Symbols</option>
                                    <option value="greek">Greek and Hebrew letters</option>
                                    <option value="binary">Binary Operation/Relation Symbols</option>
                                    <option value="arrow">Arrows</option>
                                    <option value="misc">Miscellaneous</option>
                                </b-form-select>
                            </div>
                        </div>

                        <div class="ui grid symbolGroup" id="symbolGreek" v-show="symbolSelected == 'all' || symbolSelected == 'greek' ">
                            <div>Greek and Hebrew letters</div>
                            <ul>
                                <li class=" math-symbols" v-for="item in this.symbol.Greek" :key="item.id">
                                    <span class="symbol-div">
                                        <div class="math-symbol" :class="item.class" :id="item.id" @click=latexToEquations(item.symbol) v-html="item.symbolHtml"></div>
                                        <span class="symbol-latex">{{item.symbol.latex}}</span>
                                    </span> 
                                </li>
                            </ul>
                        </div>

                        <div class="ui grid symbolGroup" id="symbolBinary" v-show="symbolSelected == 'all' || symbolSelected == 'binary' ">
                            <div class="sixteen wide column">Binary Operation/Relation Symbols</div>
                            <ul>
                                <li class=" math-symbols" v-for="item in this.symbol.Binary" :key="item.id">
                                    <span class="symbol-div">
                                        <div class="math-symbol" :class="item.class" :id="item.id" @click=latexToEquations(item.symbol) v-html="item.symbolHtml"></div>
                                        <span class="symbol-latex">{{item.symbol.latex}}</span>
                                    </span> 
                                </li>
                            </ul>
                        </div>
                        <div class="ui grid symbolGroup" id="symbolArrow" v-show="symbolSelected == 'all' || symbolSelected == 'arrow' ">
                            <div class="sixteen wide column">Arrows</div>
                            <ul>
                                <li class=" math-symbols" v-for="item in this.symbol.Arrow" :key="item.id">
                                    <span class="symbol-div">
                                        <div class="math-symbol" :class="item.class" :id="item.id" @click=latexToEquations(item.symbol) v-html="item.symbolHtml"></div>
                                        <span class="symbol-latex">{{item.symbol.latex}}</span>
                                    </span> 
                                </li>
                            </ul>
                        </div>
                        <div class="ui grid symbolGroup" id="symbolMisc" v-show="symbolSelected == 'all' || symbolSelected == 'misc' ">
                            <div class="sixteen wide column">Miscellaneous</div>
                            <ul>
                                <li class=" math-symbols" v-for="item in this.symbol.Misc" :key="item.id">
                                    <span class="symbol-div">
                                        <div class="math-symbol" :class="item.class" :id="item.id" @click=latexToEquations(item.symbol) v-html="item.symbolHtml"></div>
                                        <span class="symbol-latex">{{item.symbol.latex}}</span>
                                    </span> 
                                </li>
                            </ul>
                        </div>
                    </b-tab>

                    <b-tab title="Equations" @click=changeTab>
                        <div class="right floated right aligned six wide column">
                            <b-form-select v-model="equSelected" class="mb-3">
                                <option value="all">All Equations</option>
                                <option value="trig">Trigonometric functions</option>
                                <option value="supsub">Superscripts and subscripts</option>
                                <option value="frac">Fractions</option>
                                <option value="misc">Miscellaneous</option>
                            </b-form-select>
                        </div>

                        <div class="ui grid equationGroup" id="equationTrig"  v-show="equSelected == 'all' || equSelected == 'trig' ">
                            <div class="sixteen wide column">Trigonometric functions</div>
                            <ul>
                                <li class=" math-symbols" v-for="item in this.equation.Trig" :key="item.id">
                                    <span class="symbol-div">
                                        <div class="math-symbol" :class="item.class" :id="item.id" @click=latexToEquations(item.symbol) v-html="item.symbolHtml"></div>
                                        <span class="symbol-latex">{{item.symbol.latex}}</span>
                                    </span> 
                                </li>
                            </ul>
                        </div>
                        <div class="ui grid equationGroup" id="equationSupsub" v-show="equSelected == 'all' || equSelected == 'supsub' ">
                            <div class="sixteen wide column">Superscripts and subscripts</div>
                            <ul>
                                <li class=" math-symbols" v-for="item in this.equation.Supsub" :key="item.id">
                                    <span class="symbol-div">
                                        <div class="math-symbol" :class="item.class" :id="item.id" @click=latexToEquations(item.symbol) v-html="item.symbolHtml"></div>
                                        <span class="symbol-latex">{{item.symbol.latex}}</span>
                                    </span> 
                                </li>
                            </ul>
                        </div>
                        <div class="ui grid equationGroup" id="equationRoot" v-show="equSelected == 'all' ">
                            <div class="sixteen wide column">Roots</div>
                            <ul>
                                <li class=" math-symbols" v-for="item in this.equation.Root" :key="item.id">
                                    <span class="symbol-div">
                                        <div class="math-symbol" :class="item.class" :id="item.id" @click=latexToEquations(item.symbol) v-html="item.symbolHtml"></div>
                                        <span class="symbol-latex">{{item.symbol.latex}}</span>
                                    </span> 
                                </li>
                            </ul>
                        </div>
                        <div class="ui grid equationGroup" id="equationFrac" v-show="equSelected == 'all' || equSelected == 'frac' ">
                            <div class="sixteen wide column">Fractions</div>
                            <ul>
                                <li class=" math-symbols" v-for="item in this.equation.Frac" :key="item.id">
                                    <span class="symbol-div">
                                        <div class="math-symbol" :class="item.class" :id="item.id" @click=latexToEquations(item.symbol) v-html="item.symbolHtml"></div>
                                        <span class="symbol-latex">{{item.symbol.latex}}</span>
                                    </span> 
                                </li>
                            </ul>
                        </div>
                        <div class="ui grid equationGroup" id="equationMisc" v-show="equSelected == 'all' || equSelected == 'misc' ">
                            <div class="sixteen wide column">Miscellaneous</div>
                            <ul>
                                <li class=" math-symbols" v-for="item in this.equation.Misc" :key="item.id">
                                    <span class="symbol-div">
                                        <div class="math-symbol" :class="item.class" :id="item.id" @click=latexToEquations(item.symbol) v-html="item.symbolHtml"></div>
                                        <span class="symbol-latex">{{item.symbol.latex}}</span>
                                    </span> 
                                </li>
                            </ul>
                        </div>
                    </b-tab>

                    <b-tab title="Advanced" @click=changeTab>
                        <div class="sixteen wide column">Advanced symbols and equations
                            <a href="https://katex.org/docs/supported.html" target="_blank"><i class="info circle icon"></i>
                            </a>
                        </div>
                        <ul>
                            <li class="math-symbols" v-for="item in this.advancedSymbols" :key="item.id">
                                <span class="advanc-symbol-div">
                                    <div class="math-symbol" :id="item.id" @click=latexToEquations(item.equation)>
                                        <img :src="item.imgsrc">
                                    </div> 
                                </span>
                            </li>
                        </ul>
                    </b-tab>
                </b-tabs>
            </b-card>
            
            <slot modal-footer>
                <div class="actions math-footer">
                    <small id="text_hint" v-show="text_hint">Please switch to advanced tab to copy paste LaTeX</small>
                    <b-row>
                        <b-col cols="9"  id="advanceFieldMath" v-show="!advanceField">
                            <span id="math-field"></span>
                            <span id="latex"></span>
                        </b-col>
                        <b-col cols="9" id="advanceFieldInput" v-show="advanceField">
                            <input id="advInput" type="textarea" class="latex-field">
                        </b-col>
                        <b-col cols="3">
                            <b-button block variant="outline-primary" class="math-add-button" @click="loadImagetoCKEditor()" type="button">Add
                            </b-button>
                        </b-col>
                    </b-row>
                </div>
            </slot>

            <div class="statusIndicator" v-show="statusIndication.show">
                <div class="text-center mb-12">
                    <b-spinner variant="primary" v-show="isProcessing"></b-spinner>
                    <div class="statusMsg" :class="statusIndication.textClass">
                        <span></span> {{statusIndication.statusMsg}}
                    </div>
                </div>
            </div>
            <div class="eventBlocker" v-show="isProcessing"></div>
        </b-modal>
    </div>
</template>


<script>
import json from '../latexEquations.json'   
import EventBus from '../eventBus';
import { BModal, BTabs, BTab, BCard, BButton, BSpinner, BRow, BCol, BFormSelect } from 'bootstrap-vue'

var MQ;
var mathField, latexSpan;

var mathtext_plugin = function() {
    this.callbackFn = undefined;
}
window.mathModal = {ckeditor: {}};
mathtext_plugin.prototype.init = function(obj) {
    EventBus.$emit('loadDataFromCkEditortoPopup', obj)
},

mathtext_plugin.prototype.modal = function(data) {
    this.init(data.detail);
    this.callbackFn = data.onInit;
},

window.mathModal.ckeditor.mathtext = new mathtext_plugin()
mathtext_plugin = undefined
const hostURL = window.origin || 'http://localhost:3000'

export default {
    name: 'MathModal',
    data() {
        return {
            modalClass: {
                'mainModal': ['myModalClass'],
                'modal-body': ['modal-body-custom']
            },
            libEquation: "",
            equSelected: 'all',
            symbolSelected: 'all',
            symbol: {
                Greek: "",
                Binary: "",
                Arrow: "",
                Misc: ""
            },
            equation: {
                Trig: "",
                Supsub: "",
                Root: "",
                Frac: "",
                Misc: ""
            },
            advancedSymbols: "",
            advanceField: false,
            valid: false,
            text_hint: true,
            activeTab: '',
            statusIndication: {
                statusMsg: 'Converting to image',
                textClass: 'text-dark',
                show: false
            },
            isProcessing: false,
            ckTomdlData: ''
        }
    },
    components: {
        BModal,
        BTabs,
        BTab,
        BButton,
        BCard,
        BSpinner,
        BRow,
        BCol,
        BFormSelect
    },
    mounted () {
        MQ = MathQuill.getInterface(2);
        
        this.generateEquationView(json.equations.trig, 'Trig');
        this.generateEquationView(json.equations.supsub, 'Supsub');
        this.generateEquationView(json.equations.root, 'Root');
        this.generateEquationView(json.equations.frac, 'Frac');
        this.generateEquationView(json.equations.misc, 'Misc');
        this.generateLibraryView(json.libraryEquations, 'libFormula');
        this.generateSymbolView(json.symbols.greek, 'Greek');
        this.generateSymbolView(json.symbols.binary, 'Binary');
        this.generateSymbolView(json.symbols.arrow, 'Arrow');
        this.generateSymbolView(json.symbols.misc, 'Misc');
        this.generateAdvancedSymbolsView(json.advancedSymbols, 'advancedSymbols');
        
        const that = this
        EventBus.$on('loadDataFromCkEditortoPopup', function(params) {
           that.loadDataFromCkEditortoPopup(params);
        });
    },
    methods: {
        
        loadDataFromCkEditortoPopup(data = '') {
            this.ckTomdlData = data
            this.openModel();
        },
        
        isDisabled() {
            return ($("#advInput").val() === '') ? true : false; 
        },

        openModel() {
            this.$refs['mathModal'].show();
        },

        handleModalInitialization() {
            const equationinfo = this.ckTomdlData
            var mathFieldSpan = document.getElementById('math-field');
                latexSpan = document.getElementById('latex');
                mathField = MQ.MathField(mathFieldSpan, {
                    spaceBehavesLikeTab: true,
                    handlers: {
                        edit: function() {
                            if(mathField) {
                                latexSpan.textContent = mathField.latex();
                                $('#advInput').val(latexSpan.textContent);
                                this.valid = true;
                            }
                        }
                    }
                });
                $("#advInput").val('');
                mathField.latex('');
                window.mathField = mathField;
                $(mathFieldSpan).keydown(function(e) {
                    if (e.keyCode == 86 || e.keycode == 13) { //keycode value for "v"
                        setTimeout(function() {
                            if (!valid) { // checks if the pasted value is not valid
                                alert("Incorrect formula entered.");
                            }
                            valid = false;
                        }, 1);
                    }
                });

                if(!equationinfo || equationinfo == '') return;
                this.advanceField = (equationinfo.advanced == 'false') ? false : true;
                this.latexToEquations({ 'latex': equationinfo.latex })
        },

        closeModal() {
            $("#advInput").val('');
            this.$refs['mathModal'].hide()
            this.advanceField = false
            this.valid = false
            this.text_hint = true
            this.activeTab = ''
            this.resetStatusIndicator()
        },

        changeTab(evt) {
            if(evt.currentTarget.text == 'Symbols') {
                var mqSymbol = document.getElementsByClassName("mq-render");
                for(var i = 0; i < mqSymbol.length; i++){
                    let element = mqSymbol[i]
                    MQ.StaticMath(element);
                }
            }

            if(evt.currentTarget.text == 'Advanced'){
                this.advanceField = true;
                this.text_hint = false;
            }else{
                this.text_hint = true;
            }
            // before tab swiched
            if(evt.currentTarget.text != 'Advanced' && this.activeTab == 'Advanced'){
                this.advanceField = false;
                var latexVal = $('#advInput').val();
                mathField.latex('');
                mathField.write(latexVal);
                if(mathField.latex() == ''){
                    $('#advInput').val(latexVal)            
                    this.advanceField = true;
                }
                else{
                    this.advanceField = false;
                }
            }
            this.activeTab = evt.currentTarget.text;
        },
        
        generateLibraryView(equations, name) {
            let eqDataArray = []
            for (var index = 0; index < equations.length; index++) {
                var equation = equations[index];
                var equationHtml = this.renderToString(equation.latex);
                eqDataArray.push({
                    equation: equation,
                    title: equation.title,
                    id: name+index,
                    equationHtml: equationHtml
                })
            }
            this.libEquation = eqDataArray;
        },

        generateSymbolView(equations, name) {
            let symbolDataArray = []
            var symbolHtml, mqClass, symbol = '';
            for (var index = 0; index < equations.length; index++) {
                symbol = equations[index];
                if (name == 'Greek') {
                    symbolHtml = this.renderToString(symbol.latexDisplay ? symbol.latexDisplay : symbol.latex);
                } else {
                    mqClass = 'mq-render'
                    symbolHtml = symbol.latexDisplay ? symbol.latexDisplay : symbol.latex;
                }
                symbolDataArray.push({
                    symbol: symbol,
                    id: name+index,
                    symbolHtml: symbolHtml,
                    latex: symbol.latex,
                    class: mqClass
                })
            }
            this.symbol[name] = symbolDataArray;
        },

        generateEquationView(equations, name) {
            var equaDataArray = [];
            var symbolHtml, mqClass, symbol = '';
            for (var index = 0; index < equations.length; index++) {
                symbol = equations[index];
                symbolHtml = this.renderToString(symbol.latexDisplay ? symbol.latexDisplay : symbol.latex);
                equaDataArray.push({
                    symbol: symbol,
                    id: name+index,
                    symbolHtml: symbolHtml,
                    latex: symbol.latex,
                    class: mqClass
                })
            }
            this.equation[name] = equaDataArray;
        },

        generateAdvancedSymbolsView(equations, name) {
            var advancedTabImageArray = [];
            equations.forEach(function(value) {
                let url;
                if (value.customImage) {
                    url = value.customImage;
                } else {
                    url = "https://latex.codecogs.com/gif.latex?" + encodeURIComponent(value.latexText);
                }
                advancedTabImageArray.push(url);
            }); 
            
            var advancedSymbData = [];
            var equation = '';
            for (var index = 0; index < equations.length; index++) {
                equation = equations[index];
                advancedSymbData.push({
                    equation: equation,
                    id: name+index,
                    imgsrc: advancedTabImageArray[index]
                })   
            }
            this.advancedSymbols = advancedSymbData;
        },

        renderToString (string) {
            return katex.renderToString(string, {
                throwOnError: false
            });
        },

        latexToEquations(object) {
            //object = JSON.parse(object)
            if (this.advanceField === true || this.advanceField === 'true') {
                if (object.latexCmd) {
                    this.insertTextAtCursor(object.latexValue);
                } else if (object.latex) {
                    this.insertTextAtCursor(object.latex);
                } else {
                    this.insertTextAtCursor(object.latexText);
                }
            } else {
                if (object.latexCmd) {
                    mathField.cmd(object.latexCmd);
                } else if (object.latex) {
                    mathField.write(object.latex);
                } else {
                    this.insertTextAtCursor(object.latexText);
                }
            }
        },

        insertTextAtCursor(text) {
            const input = document.getElementById('advInput')
            input.setRangeText(
                text,
                input.selectionStart,
                input.selectionEnd,
                'end'
            )
        },

        resetStatusIndicator() {
            this.statusIndication.show = false
            this.statusIndication.statusMsg = 'Converting to image',
            this.statusIndication.textClass = 'text-dark'
        },

        async loadImagetoCKEditor() {
            const that = this;
            let latexText = $("#advInput").val();
            if(latexText !== '') {
                this.statusIndication.show = true
                this.isProcessing = true
                var promiseimgUrl = await this.generateLatexToPng(latexText);
                let obj = {
                    imgURL: promiseimgUrl,
                    latexFrmla: latexText,
                    advanced: that.advanceField
                }
                window.mathModal.ckeditor.mathtext.callbackFn(obj);
                that.closeModal();
            }
        },

        async generateLatexToPng(latexText) {
            let that = this;
            return new Promise(function(resolve, reject) {
                var imgUrl = "";
                let url = `${hostURL}/latex/convert`;
                $.ajax({
                    url: url,
                    type: 'POST',
                    data: JSON.stringify({ 'equation': latexText+'.png' }),
                    async: false,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    success: function(data) {
                        let resultDataJSON = data
                        if (resultDataJSON && !data.error) {
                            imgUrl = resultDataJSON.data;
                            that.isProcessing = false;
                            that.statusIndication.statusMsg = "Image Converted Successfully"
                            that.statusIndication.textClass = 'text-success'
                            setTimeout(() => {
                                that.resetStatusIndicator()
                            }, 5000);
                            resolve(imgUrl);
                        }
                    },
                    error: function(e) {
                        that.isProcessing = false;
                        that.statusIndication.statusMsg = "Error while communicating server"
                        that.statusIndication.textClass = 'text-danger'
                        setTimeout(() => {
                            that.resetStatusIndicator()
                        }, 5000);

                        reject(e);
                    }
                    });
                });

        }
    }
}
</script>

<style scoped lang="scss">
/deep/ {
    @import '../assets/main'
}

.modal-close-btn {
    position: absolute;
    z-index: 90;
    right: 10px;
    top: 9px;
    background-color: transparent;
    border-radius: 50%;
    padding: 0px 7px;
    line-height: 20px;
    vertical-align: middle;
    color: #3e3e3e;
    border-color: transparent;
}
.modal-close-btn:hover,
.modal-close-btn:focus {
    background-color: transparent;
    border-color: transparent;
    box-shadow: none
}
.modal-dialog-scrollable .modal-body {
    overflow-y: hidden;
}
.statusIndicator {
    padding: 15px;
    background-color: #f1f1f1;
    border-top: 1px solid #eae8e8;
    position: relative;
    z-index: 100;
}
.statusMsg {
    display: block;
    font-size: 14px;
}
.eventBlocker {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    background-color: #f1f1f1c7;
    z-index: 90;
}
/* Tab header */

#math-field {
    max-width: 100%;
    min-width: 100%;
    padding: 2px 10px;
    border-radius: 3px;
    min-height: 40px;
}
#latex {
    display: none;
}
.items > .item {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    margin: 1em 0;
    width: 100%;
    min-height: 0;
    background: 0 0;
    padding: 0;
    border: none;
    border-radius: 0;
    -webkit-box-shadow: none;
    box-shadow: none;
    -webkit-transition: -webkit-box-shadow .1s ease;
    transition: -webkit-box-shadow .1s ease;
    transition: box-shadow .1s ease;
    transition: box-shadow .1s ease,-webkit-box-shadow .1s ease;
}
.item.math-lib {
    margin: 0;
    padding: 7px 0;
}
.item.math-lib, 
.math-symbol, 
.math-latex-div {
    border: 1px solid transparent;
}
.item.math-lib:hover, 
.math-symbol:hover, 
.math-latex-div:hover {
    border: 1px solid rgba(0, 0, 0, .57);
    border-radius: 3px;
}
.math-lib-header {
    color: rgba(0, 0, 0, .6);
    font-size: 13px;
    padding: 5px 05px;
}
.item .meta.math-lib-meta {
    margin: 10px 20px 0;
    font-weight: 800;
    font-size: 14px;
}

.symbolGroup ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

li.math-symbols {
    display: inline-block;
    width: 20%;
    text-align: center;
    padding: 10px;
}
li.math-symbols span.symbol-latex {
    display: none;
}

.math-symbols {
text-align: center;
}

.math-symbol {
padding: 5px 10px;
cursor: pointer;
}

.math-latex-symbols {
padding: 0 10px 0 0;
font-weight: 800;
}

.meta .katex-html {
text-align: left;
font-weight: 600;
color: rgba(0, 0, 0, .87);
}


#math-field .mq-root-block{
padding: 0;
font-size: 1.8em;
}
 

/* Footer */
.actions.math-footer {
    text-align: left;
    background: #fff;
    padding: 1rem 1rem;
    border-top: 1px solid rgba(34,36,38,.15);
}
.latex-field {
    max-width: 100%;
    min-width: 100%;
    padding: 5px 10px;
    border-radius: 3px;
    min-height: 35px;
    border: 1px solid rgb(128, 128, 128);
}
</style>

<style>
.modal-dialog {
    margin: 0px;
}
.modal-content {
    border: none;
    border-radius: 0px;
}
.modal-body {
    padding: 0 !important;
}
.tab-content {
    height: 300px !important;
    overflow: auto;
}
.modal-dialog-scrollable .modal-body {
    overflow-y: hidden !important;
}
</style>