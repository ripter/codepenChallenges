module.exports = {
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  env: {
    browser: true,
    es6: true,
  },
  globals: {
    anime: 'readonly',
    lighterhtml: 'readonly',
  },
  rules: {
    //
    // Best Practices
    //
    // get/set must be defined in pairs.
    'accessor-pairs': 2,
    // catch forgotten returns in array methods like map/reduce.
    'array-callback-return': 2,
    // var should be treated as block scope.
    'block-scoped-var': 2,
    // disable the check because it doesn't like guards
    complexity: [0, 10],
    // require return statements to either always or never specify values
    'consistent-return': 2,
    // specify curly brace conventions for all control statements
    curly: [2, 'all'],
    // require default case in switch statements
    'default-case': 2,
    // enforces consistent newlines before or after dots
    'dot-location': [2, 'property'],
    // encourages use of dot notation whenever possible
    // But allow for snakecase for external apis
    'dot-notation': [2, {'allowPattern': '^[a-z]+(_[a-z]+)+$'}],
    // require the use of === and !== except when checking null/undefined.
    eqeqeq: [2, 'smart'],
    // make sure for-in loops have an if statement
    'guard-for-in': 2,
    // disallow alert/confirm/prompt
    'no-alert': 2,
    // disallow use of arguments.caller or arguments.callee
    'no-caller': 2,
    // disallow lexical declarations in case/default clauses
    'no-case-declarations': 2,
    // disallow division operators explicitly at beginning of regular expression
    'no-div-regex': 2,
    // disallow else after a return in an if statement
    'no-else-return': 2,
    // disallow empty functions.
    'no-empty-function': 2,
    // disallow empty destructuring patterns
    'no-empty-pattern': 2,
    // allow comparisons to null without a type-checking operator
    'no-eq-null': 0,
    // disallow use of eval()
    'no-eval': 2,
    // disallow adding to native types
    'no-extend-native': 2,
    // disallow unnecessary function binding
    'no-extra-bind': 2,
    // disallow Unnecessary Labels
    'no-extra-label': 2,
    // disallow fallthrough of case statements
    'no-fallthrough': 2,
    // disallow the use of leading or trailing decimal points in numeric literals
    'no-floating-decimal': 2,
    // allow shorthand type conversions
    'no-implicit-coercion': 0,
    // disallow var and named functions in global scope
    'no-implicit-globals': 2,
    // disallow use of eval()-like methods
    'no-implied-eval': 2,
    // disallow this keywords outside of classes or class-like objects
    'no-invalid-this': 2,
    // disallow usage of __iterator__ property
    'no-iterator': 2,
    // disallow use of labels for anything other then loops and switches
    'no-labels': 2,
    // disallow unnecessary nested blocks
    'no-lone-blocks': 2,
    // disallow creation of functions within loops
    'no-loop-func': 2,
    // allow magic numbers
    'no-magic-numbers': 0,
    // disallow use of multiple spaces
    'no-multi-spaces': 2,
    // disallow use of multiline strings
    'no-multi-str': 2,
    // disallow reassignments of native objects
    'no-native-reassign': 2,
    // disallow use of new operator when not part of the assignment or comparison
    'no-new': 2,
    // disallow use of new operator for Function object
    'no-new-func': 2,
    // disallows creating new instances of String, Number, and Boolean
    'no-new-wrappers': 2,
    // disallow use of (old style) octal literals
    'no-octal': 2,
    // disallow use of octal escape sequences in string literals, such as
    // var foo = 'Copyright \251';
    'no-octal-escape': 2,
    // disallow reassignment of function parameters
    // disallow parameter object manipulation
    // 'no-param-reassign': [2, { props: true }],
    // It is common and acceptable to alter the parameters in a reducer
    // Instead of ignoring the rule in every reducer, we will turn off the rule
    'no-param-reassign': 0,
    // disallow usage of __proto__ property
    'no-proto': 2,
    // disallow declaring the same variable more then once
    'no-redeclare': 2,
    // disallow use of assignment in return statement
    'no-return-assign': 2,
    // disallow use of `javascript:` urls.
    'no-script-url': 2,
    // disallow self assignment
    'no-self-assign': 2,
    // disallow comparisons where both sides are exactly the same
    'no-self-compare': 2,
    // disallow use of comma operator
    'no-sequences': 2,
    // restrict what can be thrown as an exception
    'no-throw-literal': 2,
    // disallow unmodified conditions of loops
    'no-unmodified-loop-condition': 2,
    // disallow usage of expressions in statement position
    'no-unused-expressions': 2,
    // disallow unused labels
    'no-unused-labels': 2,
    // disallow unnecessary .call() and .apply()
    'no-useless-call': 2,
    // disallow useless string concatenation
    'no-useless-concat': 2,
    // disallow unnecessary string escaping
    'no-useless-escape': 2,
    // disallow use of void operator
    'no-void': 2,
    // disallow use of the with statement
    'no-with': 2,
    // require use of the second argument for parseInt()
    radix: 2,
    // do not force vars at the top. It's great practice but doesn't allow guards
    'vars-on-top': 0,


    //
    // Variables
    //
    // disallow delete on variables.
    'no-delete-var': 2,
    // disallow labels with the same name as variables.
    'no-label-var': 2,
    // disallow shadowing, it is hard to read and usually a mistake.
    'no-shadow': 2,
    // disallow showowing restructed names.
    'no-shadow-restricted-names': 2,
    // catch misspellings of variable and parameter names, or accidental implicit globals
    'no-undef': 2,
    // disallow setting variables to undefined.
    'no-undef-init': 2,
    // undefined can be overriden or shadowed. Don't allow it.
    'no-undefined': 2,
    // show vars that are no longer used as errors so they can be cleaned up.
    'no-unused-vars': 2,
    // require that things are declared before they are used.
    'no-use-before-define': [2, 'nofunc'],

    //
    // Style
    //
    // require array blocks to have consistent spacing.
    'array-bracket-spacing': [2, 'never'],
    // require inline blocks to have consistent spacing.
    'block-spacing': 2,
    // require else/else if/catch to be on their own line.
    // unless it's all single line.
    'brace-style': [2, 'stroustrup', { 'allowSingleLine': true }],
    // require consistent nameing of variables.
    'camelcase': 2,
    // Javascript allows trailing commas, IE < 9 did not.
    'comma-dangle': [2, 'always-multiline'],

    // require strings to use single quotes.
    quotes: [2, 'single'],
    // require files to use space.
    'no-mixed-spaces-and-tabs': 2,
    // allow identifiers to have a leading or trailing _
    'no-underscore-dangle': 0,
    // semicolons are required in JavaScript, don't let people use ASI.
    semi: 2,
    // disallow things that look like end of statements, but are really multiline.
    'no-unexpected-multiline': 2,
    // unary operators should not have a space.
    'space-unary-ops': 2,
    // require 2 space indentations; switch statements should also be indented
    indent: ['error', 2, { 'SwitchCase': 1 }],
  }
}
