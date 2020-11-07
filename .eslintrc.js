module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: [
    "import",
    '@typescript-eslint/eslint-plugin'
  ],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    "indent": ["error", 2, {
      "SwitchCase": 1
    }],
    "linebreak-style": ["error", "unix"],
    "space-before-blocks": [ "error", "always"],

    "quotes": [ "error",  "single", {
      "avoidEscape": true,
      "allowTemplateLiterals": true
    }],
    "semi": [ "error", "always"],
    "semi-spacing": "error",
    "comma-spacing": ["error"],
    "comma-dangle": ["error", {
      "arrays": "always-multiline",
      "objects": "always-multiline",
      "imports": "always-multiline",
      "exports": "always-multiline",
      "functions": "ignore"
    }],

    "prefer-const": "error",
    "prefer-rest-params": "error",

    "arrow-spacing": [ "error", {
      "before": true,
      "after": true
    }],
    "func-call-spacing": ["error", "never"],

    "class-methods-use-this": ["off", {
      "exceptMethods": ["componentDidMount"]
    }],

    "eqeqeq": "error",
    "no-this-before-super": "error",

    "space-before-function-paren": ["warn", "never"],

    "prefer-template": "warn",
    "template-curly-spacing": "warn",

    "block-spacing": ["warn", "always"],

    "array-bracket-spacing": ["warn", "never"],
    "arrow-parens": ["warn", "as-needed", {
      "requireForBlockBody": true
    }],

    "space-in-parens": ["warn", "never"],

    "key-spacing": ["warn", { "mode": "minimum" }],
    "keyword-spacing": "warn",

    "object-curly-newline": "off",
    "object-curly-spacing": ["error", "always"],
    "curly": ["error", "all"],

    "prefer-promise-reject-errors": "warn",
    "prefer-arrow-callback": "warn",

    "accessor-pairs": "error",

    "no-console": "warn",

    "no-fallthrough": "off",
    "camelcase": "off",

    "import/order": ["error",
      {
        "groups": [
          ["external", "builtin"],
          ["internal"],
          ["index", "sibling", "parent"]
        ],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }
    ],
    "no-mixed-operators": "error",
    "no-shadow": "error",

    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/ban-ts-comment": ["warn"],
    "@typescript-eslint/no-unused-vars": ["error", {
      "varsIgnorePattern": "^_+"
    }],
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/no-use-before-define": "off"
  },
};
