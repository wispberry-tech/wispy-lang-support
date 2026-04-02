; Delimiters
["{{" "}}" "{{-" "-}}" "{%" "%}" "{%-" "-%}" "{#" "#}" "{#-" "-#}"] @punctuation.bracket

; Comments
(comment) @comment

; Raw blocks
(raw_block
  (raw_content) @string)

; Conditionals
["if" "elif" "else" "endif" "unless" "endunless"] @keyword.conditional

; Loops
["for" "in" "empty" "endfor"] @keyword.repeat

; Assignment
["set" "with" "endwith" "capture" "endcapture"] @keyword

; Macros
["macro" "endmacro" "call" "endcall"] @keyword.function

; Composition
["extends" "block" "endblock" "include" "render" "import" "as"] @keyword.import

; Components
["component" "endcomponent" "props" "slot" "endslot" "fill" "endfill"] @keyword

; Web
["asset" "endasset" "meta" "hoist" "endhoist"] @keyword

; Raw
["raw" "endraw"] @keyword

; Modifiers
["isolated"] @keyword.modifier

; Logical operators
["and" "or" "not"] @keyword.operator

; Literals
(string) @string
(number) @number
(boolean) @boolean
(nil) @constant.builtin

; Operators
["+" "-" "*" "/" "%" "~"] @operator
["==" "!=" "<" "<=" ">" ">="] @operator
["|"] @operator
["="] @operator

; Filters
(filter_name) @function.builtin

; Built-in functions
((identifier) @function.builtin
  (#any-of? @function.builtin "range" "caller" "super"))

; Function calls
(function_call
  (identifier) @function)

; Variables
(identifier) @variable
