<template>
    <div>
        <h1>Math Modal</h1>
        <b-button v-b-modal.mathModal>Equation</b-button>

        <b-modal class="mathModal"  id="mathModal" 
                    title="BootstrapVue"
                    :scrollable=true
                    :hide-footer=true
                    :hide-header=true
                    ref="mathModal" >

            <slot modal-header>
                <b-button class="modal-close-btn" size="sm" @click="closeModal()">x</b-button>
            </slot>
            
            <b-card no-body>
                <b-tabs content-class="mt-3" justified small card   >
                    <b-tab title="Library" active  @click=changeTab>
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
                            <ul v-html="this.symbol.Greek"></ul>
                        </div>

                        <div class="ui grid symbolGroup" id="symbolBinary" v-show="symbolSelected == 'all' || symbolSelected == 'binary' ">
                            <div class="sixteen wide column">Binary Operation/Relation Symbols</div>
                            <ul v-html="this.symbol.Binary"></ul>
                        </div>
                        <div class="ui grid symbolGroup" id="symbolArrow" v-show="symbolSelected == 'all' || symbolSelected == 'arrow' ">
                            <div class="sixteen wide column">Arrows</div>
                            <ul v-html="this.symbol.Arrow"></ul>
                        </div>
                        <div class="ui grid symbolGroup" id="symbolMisc" v-show="symbolSelected == 'all' || symbolSelected == 'misc' ">
                            <div class="sixteen wide column">Miscellaneous</div>
                            <ul v-html="this.symbol.Misc"></ul>
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
                            <ul v-html="this.equation.Trig"></ul>
                        </div>
                        <div class="ui grid equationGroup" id="equationSupsub" v-show="equSelected == 'all' || equSelected == 'supsub' ">
                            <div class="sixteen wide column">Superscripts and subscripts</div>
                            <ul v-html="this.equation.Supsub"></ul>
                        </div>
                        <div class="ui grid equationGroup" id="equationRoot" v-show="equSelected == 'all' ">
                            <div class="sixteen wide column">Roots</div>
                            <ul v-html="this.equation.Root"></ul>
                        </div>
                        <div class="ui grid equationGroup" id="equationFrac" v-show="equSelected == 'all' || equSelected == 'frac' ">
                            <div class="sixteen wide column">Fractions</div>
                            <ul v-html="this.equation.Frac"></ul>
                        </div>
                        <div class="ui grid equationGroup" id="equationMisc" v-show="equSelected == 'all' || equSelected == 'misc' ">
                            <div class="sixteen wide column">Miscellaneous</div>
                            <ul v-html="this.equation.Misc"></ul>
                        </div>
                    </b-tab>

                    <b-tab title="Advanced" @click=changeTab>
                        <div class="sixteen wide column">Advanced symbols and equations
                            <a href="https://katex.org/docs/supported.html" target="_blank"><i class="info circle icon"></i>
                            </a>
                        </div>
                        <ul v-html="this.advancedSymbols"></ul>
                    </b-tab>

                </b-tabs>
            </b-card>
            

            <slot modal-footer>
                <div class="actions math-footer">
                    <small id="text_hint" style="">Please switch to advanced tab to copy paste LaTeX</small>
                    <b-row>
                        <b-col cols="9"  id="advanceFieldMath" style="display: none;">
                            <span id="math-field"></span>
                            <span id="latex"></span>
                        </b-col>
                        <b-col cols="9" id="advanceFieldInput">
                            <input id="advInput" type="textarea" class="latex-field">
                        </b-col>
                        <b-col cols="3">
                            <b-button block variant="outline-primary" class="math-add-button" onclick="loadImagetoCKEditor()" type="button">Add
                            </b-button>
                        </b-col>
                    </b-row>
                </div>
            </slot>
        </b-modal>
    </div>
</template>


<script>
import katex from 'katex';
import json from '../latexEquations.json'   
var MQ;
var mathField, latexSpan;
export default {
    name: 'MathModal',
    data() {
        return {
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
            valid: false
        }
    },
    mounted () {
        MQ = MathQuill.getInterface(2);
        
        this.generateLibraryView(json.libraryEquations, 'libFormula');
        this.generateSymbolView(json.symbols.greek, 'Greek');
        this.generateSymbolView(json.symbols.binary, 'Binary');
        this.generateSymbolView(json.symbols.arrow, 'Arrow');
        this.generateSymbolView(json.symbols.misc, 'Misc');
        this.generateEquationView(json.equations.trig, 'Trig');
        this.generateEquationView(json.equations.supsub, 'Supsub');
        this.generateEquationView(json.equations.root, 'Root');
        this.generateEquationView(json.equations.frac, 'Frac');
        this.generateEquationView(json.equations.misc, 'Misc');
        this.generateAdvancedSymbolsView(json.advancedSymbols, 'advancedSymbols');
        
        this.$root.$on('bv::modal::shown', () => {
            var mathFieldSpan = document.getElementById('math-field');
            latexSpan = document.getElementById('latex');
            //hiddenSpanArea = document.getElementById('hiddenSpan');
            mathField = MQ.MathField(mathFieldSpan, {
                spaceBehavesLikeTab: true,
                handlers: {
                    edit: function() {
                        latexSpan.textContent = mathField.latex();
                        $('#advInput').val(latexSpan.textContent);
                        this.valid = true;
                    }
                }
            });
            window.mathField = mathField;
            $(mathFieldSpan).keydown(function(e) {
                if (e.keyCode == 86 || e.keycode == 13) { //keycode value for "v"
                    setTimeout(function() {
                        if (!valid) { // checks if the pasted value is not valid
                            // ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                            //   title: 'Incorrect formula entered.',
                            //   position: 'topCenter',
                            // });
                            alert("Incorrect formula entered.");
                        }
                        valid = false;
                    }, 1);
                }
            });
        });

    },

    methods: {
        closeModal() {
            this.$refs['mathModal'].hide()
        },

        changeTab(evt) {
            if(evt.currentTarget.text == 'Symbols') {
                var mqSymbol = document.getElementsByClassName("mq-render");
                for(var i = 0; i < mqSymbol.length; i++){
                    let element = mqSymbol[i]
                    MQ.StaticMath(element);
                }
            }
        },
        
        generateLibraryView(equations, name) {
            //let eqData = "";
            let eqDataArray = []
            for (var index = 0; index < equations.length; index++) {
                var equation = equations[index];
                var equationHtml = this.renderToString(equation.latex);
                // eqData += '<div class="item select list-items math-lib" @click=\'latexToEquations(' + JSON.stringify(equation) + ')\'>' +
                //     '<div class="middle aligned content">' +
                //     '<div class="math-lib-header">' + equation.title + '</div>' +
                //     '<div class="meta math-lib-meta" id="' + name + index + '">' + equationHtml + '</div>' +
                //     '</div></div>';
                eqDataArray.push({
                    equation: JSON.stringify(equation),
                    title: equation.title,
                    id: name+index,
                    equationHtml: equationHtml
                })
            }
            this.libEquation = eqDataArray;
            //console.log(this.libEquation)
        },

        generateSymbolView(equations, name) {
            var html = '';
            var symbolHtml, mqClass, symbol = '';
            for (var index = 0; index < equations.length; index++) {
                symbol = equations[index];
                if (name == 'Greek') {
                    symbolHtml = this.renderToString(symbol.latexDisplay ? symbol.latexDisplay : symbol.latex);
                } else {
                    mqClass = 'mq-render'
                    symbolHtml = symbol.latexDisplay ? symbol.latexDisplay : symbol.latex;
                }
                html += '<li class=" math-symbols">' +
                    '<span class="symbol-div">' +
                    '<div class="math-symbol ' + mqClass + '" id="' + name + index + '" onclick=\'latexToEquations(' + JSON.stringify(symbol) + ')\' >' + symbolHtml + '</div>' +
                    '<span class="symbol-latex">' + symbol.latex + '</span>' +
                    '</span> </li>';
            }
            this.symbol[name] = html;
        },

        generateEquationView(equations, name) {
            var html = '';
            var symbolHtml, mqClass, symbol = '';
            for (var index = 0; index < equations.length; index++) {
                symbol = equations[index];
                if (name == 'Root') {
                    symbolHtml = this.renderToString(symbol.latexDisplay ? symbol.latexDisplay : symbol.latex);
                } else {
                    mqClass = 'mq-render'
                    symbolHtml = symbol.latexDisplay ? symbol.latexDisplay : symbol.latex;
                }
                html += '<li class="math-symbols">' +
                    '<span class="symbol-div">' +
                    '<div class="math-symbol ' + mqClass + '" id="' + name + index + '" onclick=\'latexToEquations(' + JSON.stringify(symbol) + ')\' >' + symbolHtml + '</div>' +
                    '<span class="symbol-latex">' + symbol.latex + '</span>' +
                    '</span> </li>';
            }
            this.equation[name] = html;
        },

        generateAdvancedSymbolsView(equations, name) {
            var advancedTabImageArray = [];
            equations.forEach(function(value) {
                let url;
                if (value.customImage) {
                    url = value.customImage;
                } else {
                    url = "https://latex.codecogs.com/gif.latex?" + encodeURIComponent(value.latexText);
                    console.log(url);
                }
                advancedTabImageArray.push(url);
            }); 
            
            var html = '';
            var equation = '';
            for (var index = 0; index < equations.length; index++) {
                equation = equations[index];
                html += '<li class="math-symbols"><span class="advanc-symbol-div">' +
                    '<div class="math-symbol" id="' + name + index + '" onclick=\'latexToEquations(' + JSON.stringify(equation) + ')\'>' +
                    '<img src="' + advancedTabImageArray[index] + '">' +
                    '</div> </span>' +
                    '</div></div></li>';
            }
            this.advancedSymbols = html;
        },

        renderToString (string) {
            return katex.renderToString(string, {
                throwOnError: false
            });
        },

        latexToEquations(object) {
            object = JSON.parse(object)
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
        }
    },
    

}
</script>

<style>

.modal-close-btn {
    position: absolute;
    z-index: 100;
    right: 10px;
    top: 9px;
    background-color: #615c5c;
    border-radius: 50%;
    padding: 0px 7px;
    line-height: 20px;
    vertical-align: middle;
    color: #fff;
    border-color: #615c5c;
}
.modal-dialog-scrollable .modal-body {
    overflow-y: hidden;
}
/* Tab header */

.modal-body .tab-content {
    height: 280px;
    overflow: auto;
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