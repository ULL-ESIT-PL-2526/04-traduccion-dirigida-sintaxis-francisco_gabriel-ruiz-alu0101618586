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
[*/]                                    { return 'OPMU';                    }
[-+]                                    { return 'OPAD';                    }
\(                                      { return 'OPENPARENTHESIS';         }
\)                                      { return 'CLOSEPARENTHESIS';        }
<<EOF>>                                 { return 'EOF';                     }
.                                       { return 'INVALID';                 }
/lex

/* Parser */
%start expressions
%token NUMBER OPAD OPMU OPOW OPENPARENTHESIS CLOSEPARENTHESIS
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
    : NUMBER
        { $$ = Number(yytext); }
    | OPENPARENTHESIS expression CLOSEPARENTHESIS
        { $$ = $expression; }
    ;
%%

function operate(op, left, right) {
    switch (op) {
        case '+': return left + right;
        case '-': return left - right;
        case '*': return left * right;
        case '/': return left / right;
        case '**': return Math.pow(left, right);
    }
}
