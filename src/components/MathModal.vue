<template>
    <div>
        <h1>Math Modal</h1>
        <b-button v-b-modal.modal-1>Equation</b-button>

        <b-modal class="mathModal"  id="modal-1" 
                    title="BootstrapVue"
                    :scrollable=true
                    :hide-footer=true
                    :hide-header=true>
            
            <b-card no-body>
                <b-tabs content-class="mt-3" justified small card>
                    <b-tab title="Library" active>
                        <div class="items" v-html="libEquation"></div>
                    </b-tab>

                    <b-tab title="Symbols">
                        <div class="ui right aligned grid">
                            <div class="right floated right aligned six wide column">
                                <select class="ui dropdown symbols-dropdown">
                                    <option value="all" selected="selected">All Symbols</option>
                                    <option value="greek">Greek and Hebrew letters</option>
                                    <option value="binary">Binary Operation/Relation Symbols</option>
                                    <option value="arrow">Arrows</option>
                                    <option value="misc">Miscellaneous</option>
                                </select>
                            </div>
                        </div>
                        <div class="ui grid symbolGroup" id="symbolGreek">
                            <div>Greek and Hebrew letters</div>
                            <ul v-html="this.symbol.Greek"></ul>
                        </div>

                        <div class="ui grid symbolGroup" id="symbolBinary">
                            <div class="sixteen wide column">Binary Operation/Relation Symbols</div>
                            <ul v-html="this.symbol.Binary"></ul>
                        </div>
                        <div class="ui grid symbolGroup" id="symbolArrow">
                            <div class="sixteen wide column">Arrows</div>
                            <ul v-html="this.symbol.Arrow"></ul>
                        </div>
                        <div class="ui grid symbolGroup" id="symbolMisc">
                            <div class="sixteen wide column">Miscellaneous</div>
                            <ul v-html="this.symbol.Misc"></ul>
                        </div>
                    </b-tab>

                    <b-tab title="Equations">
                        <div class="right floated right aligned six wide column">
                            <select class="ui dropdown equations-dropdown">
                                <option value="all" selected="selected">All Equations</option>
                                <option value="trig">Trigonometric functions</option>
                                <option value="supsub">Superscripts and subscripts</option>
                                <option value="frac">Fractions</option>
                                <option value="misc">Miscellaneous</option>
                            </select>
                        </div>

                        <div class="ui grid equationGroup" id="equationTrig">
                            <div class="sixteen wide column">Trigonometric functions</div>
                            <ul v-html="this.equation.Trig"></ul>
                        </div>
                        <div class="ui grid equationGroup" id="equationSupsub">
                            <div class="sixteen wide column">Superscripts and subscripts</div>
                            <ul v-html="this.equation.Supsub"></ul>
                        </div>
                        <div class="ui grid equationGroup" id="equationRoot">
                            <div class="sixteen wide column">Roots</div>
                            <ul v-html="this.equation.Root"></ul>
                        </div>
                        <div class="ui grid equationGroup" id="equationFrac">
                            <div class="sixteen wide column">Fractions</div>
                            <ul v-html="this.equation.Frac"></ul>
                        </div>
                        <div class="ui grid equationGroup" id="equationMisc">
                            <div class="sixteen wide column">Miscellaneous</div>
                            <ul v-html="this.equation.Misc"></ul>
                        </div>
                    </b-tab>

                    <b-tab title="Advanced"><p>Advanced</p></b-tab>
                </b-tabs>
            </b-card>
            

            <slot modal-footer>
                <div class="actions math-footer">
                    <small id="text_hint" style="">Please switch to advanced tab to copy paste LaTeX</small>
                    <b-row>
                        <b-col cols="9"  id="advanceFieldMath" style="display: none;">
                            <span id="math-field" class="mq-editable-field mq-math-mode">
                                <span class="mq-textarea">
                                    <textarea autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" x-palm-disable-ste-all="true"></textarea>
                                    </span>
                                    <span class="mq-root-block mq-empty" mathquill-block-id="481"></span>
                                </span>
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
export default {
    name: 'MathModal',
    data() {
        return {
            libEquation: "",
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
            }
        }
    },
    mounted () {
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
        
        var mqSymbol = document.getElementsByClassName("mq-render");
        for(var i = 0; i < mqSymbol.length; i++){
            console.log(mqSymbol[i])
            //let element = mqSymbol[i]
            //MQ.StaticMath(element);
        }
    },

    methods: {
        generateLibraryView(equations, name) {
            let eqData = "";
            for (var index = 0; index < equations.length; index++) {
                var equation = equations[index];
                var equationHtml = this.renderToString(equation.latex);
                eqData += '<div class="item select list-items math-lib" onclick=\'latexToEquations(' + JSON.stringify(equation) + ')\'>' +
                    '<div class="middle aligned content">' +
                    '<div class="math-lib-header">' + equation.title + '</div>' +
                    '<div class="meta math-lib-meta" id="' + name + index + '">' + equationHtml + '</div>' +
                    '</div></div>';
            }
            this.libEquation = eqData;
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

        renderToString (string) {
            return katex.renderToString(string, {
                throwOnError: false
            });
        }
    },
    

}
</script>

<style>


/* Tab header */

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