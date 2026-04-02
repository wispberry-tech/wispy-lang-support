-- Register Grov filetype
vim.filetype.add({
  extension = {
    grov = "grov",
  },
})

-- Register tree-sitter parser
local parser_config = require("nvim-treesitter.parsers").get_parser_configs()

parser_config.grov = {
  install_info = {
    url = "https://github.com/wispy-lang/tree-sitter-grov",
    files = { "src/parser.c" },
    branch = "main",
    generate_requires_npm = true,
    requires_generate_from_grammar = true,
  },
  filetype = "grov",
}
