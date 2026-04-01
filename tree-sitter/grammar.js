/// <reference types="tree-sitter-cli/dsl" />

module.exports = grammar({
  name: "wispy",

  extras: ($) => [/\s/],

  externals: ($) => [$._html_content],

  conflicts: ($) => [
    [$.identifier, $.filter_name],
  ],

  rules: {
    template: ($) =>
      repeat(
        choice(
          $.comment,
          $.raw_block,
          $.tag_statement,
          $.output_statement,
          $._html_content,
        ),
      ),

    // {# ... #}
    comment: ($) =>
      seq(
        choice("{#", "{#-"),
        /[^]*?/,
        choice("#}", "-#}"),
      ),

    // {% raw %} ... {% endraw %}
    raw_block: ($) =>
      seq(
        $.raw_open_tag,
        alias(/[^]*?(?=\{%-?\s*endraw)/, $.raw_content),
        $.raw_close_tag,
      ),

    raw_open_tag: ($) =>
      seq(
        choice("{%", "{%-"),
        "raw",
        choice("%}", "-%}"),
      ),

    raw_close_tag: ($) =>
      seq(
        choice("{%", "{%-"),
        "endraw",
        choice("%}", "-%}"),
      ),

    // {% ... %}
    tag_statement: ($) =>
      seq(
        choice("{%", "{%-"),
        $._tag_body,
        choice("%}", "-%}"),
      ),

    _tag_body: ($) =>
      choice(
        $.if_statement,
        $.elif_statement,
        $.else_statement,
        $.endif_statement,
        $.unless_statement,
        $.endunless_statement,
        $.for_statement,
        $.empty_statement,
        $.endfor_statement,
        $.set_statement,
        $.with_statement,
        $.endwith_statement,
        $.capture_statement,
        $.endcapture_statement,
        $.macro_statement,
        $.endmacro_statement,
        $.call_statement,
        $.endcall_statement,
        $.extends_statement,
        $.block_statement,
        $.endblock_statement,
        $.include_statement,
        $.render_statement,
        $.import_statement,
        $.component_statement,
        $.endcomponent_statement,
        $.props_statement,
        $.slot_statement,
        $.endslot_statement,
        $.fill_statement,
        $.endfill_statement,
        $.asset_statement,
        $.endasset_statement,
        $.meta_statement,
        $.hoist_statement,
        $.endhoist_statement,
      ),

    // Conditionals
    if_statement: ($) => seq("if", $.expression),
    elif_statement: ($) => seq("elif", $.expression),
    else_statement: (_$) => "else",
    endif_statement: (_$) => "endif",
    unless_statement: ($) => seq("unless", $.expression),
    endunless_statement: (_$) => "endunless",

    // Loops
    for_statement: ($) =>
      seq("for", $.identifier, "in", $.expression),
    empty_statement: (_$) => "empty",
    endfor_statement: (_$) => "endfor",

    // Assignment
    set_statement: ($) =>
      seq("set", $.identifier, "=", $.expression),
    with_statement: ($) =>
      seq("with", repeat($.named_argument)),
    endwith_statement: (_$) => "endwith",
    capture_statement: ($) => seq("capture", $.identifier),
    endcapture_statement: (_$) => "endcapture",

    // Macros
    macro_statement: ($) =>
      seq("macro", $.identifier, "(", optional($.parameter_list), ")"),
    endmacro_statement: (_$) => "endmacro",
    call_statement: ($) =>
      seq("call", $.identifier, "(", optional($.argument_list), ")"),
    endcall_statement: (_$) => "endcall",

    // Composition
    extends_statement: ($) => seq("extends", $.string),
    block_statement: ($) => seq("block", $.identifier),
    endblock_statement: (_$) => "endblock",
    include_statement: ($) =>
      seq("include", $.string, optional(seq("with", repeat($.named_argument))), optional("isolated")),
    render_statement: ($) =>
      seq("render", $.string, optional(seq("with", repeat($.named_argument))), optional("isolated")),
    import_statement: ($) =>
      seq("import", $.string, "as", $.identifier),

    // Components
    component_statement: ($) =>
      seq("component", $.string, optional(repeat($.named_argument))),
    endcomponent_statement: (_$) => "endcomponent",
    props_statement: ($) => seq("props", repeat($.named_argument)),
    slot_statement: ($) => seq("slot", optional($.identifier)),
    endslot_statement: (_$) => "endslot",
    fill_statement: ($) => seq("fill", $.identifier),
    endfill_statement: (_$) => "endfill",

    // Web
    asset_statement: ($) => seq("asset", $.string),
    endasset_statement: (_$) => "endasset",
    meta_statement: ($) => seq("meta", repeat($.named_argument)),
    hoist_statement: ($) => seq("hoist", optional($.identifier)),
    endhoist_statement: (_$) => "endhoist",

    // {{ ... }}
    output_statement: ($) =>
      seq(
        choice("{{", "{{-"),
        $.expression,
        choice("}}", "-}}"),
      ),

    // Expressions
    expression: ($) =>
      choice(
        $.ternary_expression,
        $._primary_expression,
      ),

    ternary_expression: ($) =>
      prec.right(1, seq(
        $._primary_expression,
        "if",
        $._primary_expression,
        "else",
        $._primary_expression,
      )),

    _primary_expression: ($) =>
      choice(
        $.binary_expression,
        $.unary_expression,
        $.filter_expression,
        $._atom,
      ),

    binary_expression: ($) =>
      choice(
        ...["==", "!=", "<", "<=", ">", ">="].map((op) =>
          prec.left(3, seq($._primary_expression, op, $._primary_expression)),
        ),
        ...["and", "or"].map((op) =>
          prec.left(2, seq($._primary_expression, op, $._primary_expression)),
        ),
        ...["+", "-", "~"].map((op) =>
          prec.left(4, seq($._primary_expression, op, $._primary_expression)),
        ),
        ...["*", "/", "%"].map((op) =>
          prec.left(5, seq($._primary_expression, op, $._primary_expression)),
        ),
      ),

    unary_expression: ($) =>
      prec(6, seq("not", $._primary_expression)),

    filter_expression: ($) =>
      prec.left(7, seq(
        $._primary_expression,
        "|",
        $.filter_name,
        optional(seq("(", optional($.argument_list), ")")),
      )),

    _atom: ($) =>
      choice(
        $.string,
        $.number,
        $.boolean,
        $.nil,
        $.function_call,
        $.member_expression,
        $.subscript_expression,
        $.identifier,
        seq("(", $.expression, ")"),
      ),

    string: (_$) =>
      choice(
        seq('"', /[^"\\]*(?:\\.[^"\\]*)*/, '"'),
        seq("'", /[^'\\]*(?:\\.[^'\\]*)*/, "'"),
      ),

    number: (_$) => /\d+(\.\d+)?/,

    boolean: (_$) => choice("true", "false"),

    nil: (_$) => choice("nil", "null"),

    identifier: (_$) => /[a-zA-Z_][a-zA-Z0-9_]*/,

    filter_name: (_$) => /[a-zA-Z_][a-zA-Z0-9_]*/,

    member_expression: ($) =>
      prec.left(8, seq($._atom, ".", $.identifier)),

    subscript_expression: ($) =>
      prec.left(8, seq($._atom, "[", $.expression, "]")),

    function_call: ($) =>
      prec(9, seq($.identifier, "(", optional($.argument_list), ")")),

    argument_list: ($) =>
      seq(
        choice($.expression, $.named_argument),
        repeat(seq(",", choice($.expression, $.named_argument))),
      ),

    parameter_list: ($) =>
      seq(
        $.identifier,
        repeat(seq(",", $.identifier)),
      ),

    named_argument: ($) =>
      seq($.identifier, "=", $.expression),
  },
});
