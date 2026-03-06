/* Lexer */
%lex
entero \d+
mantisa \.[0-9]+
exponente [eE][-+]?[0-9]+
%%
\s+                                     { /* skip whitespace */;            }
(\/\*)(.|\n)*?(\*\/)                    { /* skip multiple line comment */; }
\/\/[^\n]*                              { /* skip one line comment */;      }
{entero}{mantisa}?{exponente}?          { return 'NUMBER';                  }
"**"                                    { return 'OPOW';                    }
"!"                                     { return 'OPFAC';                   }
[*/]                                    { return 'OPMU';                    }
[-+]                                    { return 'OPAD';                    }
\(                                      { return 'OPENPAR';                 }
\)                                      { return 'CLOSEPAR';                }
<<EOF>>                                 { return 'EOF';                     }
.                                       { return 'INVALID';                 }
/lex

/* Parser */
%start expressions
%token NUMBER OPAD OPMU OPOW OPENPAR CLOSEPAR OPFAC
%%

expressions
    : expression EOF
        { return $expression; }
    ;

expression
    : expression OPAD term
        { $$ = operate($OPAD, $expression, $term); }
    | term
        { $$ = $term; }
    ;

term
    : term OPMU root
        { $$ = operate($OPMU, $term, $root); }
    | root
        { $$ = $root; }
    ;

root
    : factor OPOW root
        { $$ = operate($OPOW, $factor, $root); }
    | factor
        { $$ = $factor; }
    ;

factor
    : factor OPFAC
        { $$ = unaryOperate($OPFAC, $factor); }
    | primary
        { $$ = $primary; }
    ;

primary
    : NUMBER
        { $$ = Number(yytext); }
    | OPENPAR expression CLOSEPAR
        { $$ = $expression; }
    ;
%%

function computeFactorial(number) {
    if (number === 0) {
        return 1;
    }
    return number * computeFactorial(number - 1);
}

function unaryOperate(op, operand) {
    switch (op) {
        case '!': return computeFactorial(operand);
    }
}

function operate(op, left, right) {
    switch (op) {
        case '+': return left + right;
        case '-': return left - right;
        case '*': return left * right;
        case '/': return left / right;
        case '**': return Math.pow(left, right);
    }
}
