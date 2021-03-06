// Generated by CoffeeScript 1.10.0
(function() {
  var ParserAsync, ParserSync, assert, chai, expect, ref;

  chai = require('chai');

  assert = chai.assert;

  expect = chai.expect;

  ref = require('../index'), ParserAsync = ref.ParserAsync, ParserSync = ref.ParserSync;

  describe('default', function() {
    var parseTemplate;
    parseTemplate = require('../index');
    it('should replace a simple variable', function() {
      var res;
      res = parseTemplate("`name`", {
        name: "John"
      });
      return expect(res).to.equal("John");
    });
    it('should run JS code', function() {
      var res;
      res = parseTemplate("`name.join(' ')`", {
        name: ["John", "Stewart"]
      });
      return expect(res).to.equal("John Stewart");
    });
    it('should share context', function() {
      var res;
      res = parseTemplate("`i++` - `i++` - `i++`", {
        i: 0
      });
      return expect(res).to.equal("0 - 1 - 2");
    });
    it('should share context between calls', function() {
      var context, res;
      context = {
        i: 0
      };
      res = parseTemplate("`i++` - `i++` - `i++`", context);
      expect(res).to.equal("0 - 1 - 2");
      res = parseTemplate("`i++` - `i++` - `i++`", context);
      return expect(res).to.equal("3 - 4 - 5");
    });
    return it('should sandbox context if enabled', function() {
      var res;
      res = parseTemplate("`i++` - `i++` - `i++`", {
        i: 0
      }, {
        sandbox: 1
      });
      return expect(res).to.equal("0 - 0 - 0");
    });
  });

  describe('ParserAsync', function() {
    var Parser;
    Parser = ParserAsync;
    it('should throw error', function(done) {
      var parser;
      parser = new Parser();
      return parser.parseTemplate("`notDef`/`def`", {
        def: "Bazinga"
      }, function(err, res) {
        expect(err.constructor.name).to.be.equal("ReferenceError");
        expect(res).to.equal(void 0);
        return done();
      });
    });
    it('should ignore errors if enabled (default)', function(done) {
      var parser;
      parser = new Parser({
        ignore: 1
      });
      return parser.parseTemplate("{`notDef`}{`def`}{`obj.def`}{`obj.notDef.prop`}", {
        def: "Bazinga",
        obj: {
          def: 42
        }
      }, function(err, res) {
        expect(err).to.have.length(2);
        expect(err[0].constructor.name).to.be.equal("ReferenceError");
        expect(err[1].constructor.name).to.be.equal("TypeError");
        expect(res).to.equal("{}{Bazinga}{42}{}");
        return done();
      });
    });
    it('should ignore errors if enabled', function(done) {
      var parser;
      parser = new Parser();
      return parser.parseTemplate("`notDef`/`def`/`obj.notDef.prop`", {
        def: "Bazinga"
      }, {
        ignore: 1
      }, function(err, res) {
        expect(err).to.have.length(2);
        expect(res).to.equal("/Bazinga/");
        return done();
      });
    });
    describe('default', function() {
      var parseTemplate;
      parseTemplate = new Parser().parseTemplate;
      it('should replace a simple variable', function(done) {
        return parseTemplate("`name`", {
          name: "John"
        }, function(err, res) {
          expect(res).to.equal("John");
          return done();
        });
      });
      it('should run JS code', function(done) {
        return parseTemplate("`name.join(' ')`", {
          name: ["John", "Stewart"]
        }, function(err, res) {
          expect(res).to.equal("John Stewart");
          return done();
        });
      });
      it('should share context', function(done) {
        return parseTemplate("`i++` - `i++` - `i++`", {
          i: 0
        }, function(err, res) {
          expect(res).to.equal("0 - 1 - 2");
          return done();
        });
      });
      it('should share context between calls', function(done) {
        var context;
        context = {
          i: 0
        };
        return parseTemplate("`i++` - `i++` - `i++`", context, function(err, res) {
          expect(res).to.equal("0 - 1 - 2");
          return parseTemplate("`i++` - `i++` - `i++`", context, function(err, res) {
            expect(res).to.equal("3 - 4 - 5");
            return done();
          });
        });
      });
      return it('should sandbox context if enabled', function(done) {
        return parseTemplate("`i++` - `i++` - `i++`", {
          i: 0
        }, {
          sandbox: 1
        }, function(err, res) {
          expect(res).to.equal("0 - 0 - 0");
          return done();
        });
      });
    });
    describe('custom default delimiter', function() {
      it('should replace a simple variable', function(done) {
        var parser;
        parser = new Parser({
          delimiter: "\'"
        });
        return parser.parseTemplate("\'name\'", {
          name: "John"
        }, function(err, res) {
          expect(res).to.equal("John");
          return done();
        });
      });
      it('should replace a simple variable (set by prop)', function(done) {
        var parser;
        parser = new Parser();
        parser.delimiter = "\'";
        return parser.parseTemplate("\'name\'", {
          name: "John"
        }, function(err, res) {
          expect(res).to.equal("John");
          return done();
        });
      });
      return it('should throw TypeError', function(done) {
        var err, error, parser;
        try {
          return parser = new Parser({
            delimiter: 2
          });
        } catch (error) {
          err = error;
          expect(err.constructor.name).to.be.equal("TypeError");
          return done();
        }
      });
    });
    describe('custom default delimiters', function() {
      it('should replace a simple variable', function(done) {
        var parser;
        parser = new Parser({
          delimiter: ["\#{", "}"]
        });
        return parser.parseTemplate("\#{name}", {
          name: "John"
        }, function(err, res) {
          expect(res).to.equal("John");
          return done();
        });
      });
      it('should replace a simple variable (set by prop)', function(done) {
        var parser;
        parser = new Parser();
        parser.leftDelimiter = "\#{";
        parser.rightDelimiter = "}";
        return parser.parseTemplate("\#{name}", {
          name: "John"
        }, function(err, res) {
          expect(res).to.equal("John");
          return done();
        });
      });
      return it('should work with regex reserved characters', function(done) {
        var parser;
        parser = new Parser({
          delimiter: ["(", ")"]
        });
        return parser.parseTemplate("(name)", {
          name: "John"
        }, function(err, res) {
          expect(res).to.equal("John");
          return done();
        });
      });
    });
    describe('custom delimiter', function() {
      it('should replace a simple variable', function(done) {
        var parser;
        parser = new Parser();
        return parser.parseTemplate("\'name\'", {
          name: "John"
        }, {
          delimiter: "\'"
        }, function(err, res) {
          expect(res).to.equal("John");
          return done();
        });
      });
      return it('should throw TypeError', function(done) {
        var parser;
        parser = new Parser();
        return parser.parseTemplate("\'name\'", {
          name: "John"
        }, {
          delimiter: 2
        }, function(err, res) {
          expect(err.constructor.name).to.be.equal("TypeError");
          expect(res).to.equal(void 0);
          return done();
        });
      });
    });
    return describe('custom delimiters', function() {
      it('should replace a simple variable', function(done) {
        var parser;
        parser = new Parser();
        return parser.parseTemplate("\#{name}", {
          name: "John"
        }, {
          delimiter: ["\#{", "}"]
        }, function(err, res) {
          expect(res).to.equal("John");
          return done();
        });
      });
      return it('should work with regex reserved characters', function(done) {
        var parser;
        parser = new Parser();
        return parser.parseTemplate("(name)", {
          name: "John"
        }, {
          delimiter: ["(", ")"]
        }, function(err, res) {
          expect(res).to.equal("John");
          return done();
        });
      });
    });
  });

  describe('ParserSync', function() {
    var Parser;
    Parser = ParserSync;
    it('should throw error', function() {
      var err, error, parser, res;
      parser = new Parser();
      try {
        res = parser.parseTemplate("`notDef`/`def`", {
          def: "Bazinga"
        });
        return expect(res).to.equal(void 0);
      } catch (error) {
        err = error;
        return expect(err.constructor.name).to.be.equal("ReferenceError");
      }
    });
    describe('default', function() {
      var parseTemplate;
      parseTemplate = new Parser().parseTemplate;
      it('should replace a simple variable', function() {
        var res;
        res = parseTemplate("`name`", {
          name: "John"
        }, function(err, res) {});
        return expect(res).to.equal("John");
      });
      it('should run JS code', function() {
        var res;
        res = parseTemplate("`name.join(' ')`", {
          name: ["John", "Stewart"]
        }, function(err, res) {});
        return expect(res).to.equal("John Stewart");
      });
      it('should share context', function() {
        var res;
        res = parseTemplate("`i++` - `i++` - `i++`", {
          i: 0
        });
        return expect(res).to.equal("0 - 1 - 2");
      });
      it('should share context between calls', function() {
        var context, res;
        context = {
          i: 0
        };
        res = parseTemplate("`i++` - `i++` - `i++`", context);
        expect(res).to.equal("0 - 1 - 2");
        res = parseTemplate("`i++` - `i++` - `i++`", context);
        return expect(res).to.equal("3 - 4 - 5");
      });
      return it('should sandbox context if enabled', function() {
        var res;
        res = parseTemplate("`i++` - `i++` - `i++`", {
          i: 0
        }, {
          sandbox: 1
        });
        return expect(res).to.equal("0 - 0 - 0");
      });
    });
    describe('custom default delimiter', function() {
      it('should replace a simple variable', function() {
        var parser, res;
        parser = new Parser({
          delimiter: "\'"
        });
        res = parser.parseTemplate("\'name\'", {
          name: "John"
        });
        return expect(res).to.equal("John");
      });
      it('should replace a simple variable (set by prop)', function() {
        var parser, res;
        parser = new Parser();
        parser.delimiter = "\'";
        res = parser.parseTemplate("\'name\'", {
          name: "John"
        });
        return expect(res).to.equal("John");
      });
      return it('should throw TypeError', function(done) {
        var err, error, parser;
        try {
          return parser = new Parser({
            delimiter: 2
          });
        } catch (error) {
          err = error;
          expect(err.constructor.name).to.be.equal("TypeError");
          return done();
        }
      });
    });
    describe('custom default delimiters', function() {
      it('should replace a simple variable', function() {
        var parser, res;
        parser = new Parser({
          delimiter: ["\#{", "}"]
        });
        res = parser.parseTemplate("\#{name}", {
          name: "John"
        });
        return expect(res).to.equal("John");
      });
      it('should replace a simple variable (set by prop)', function() {
        var parser, res;
        parser = new Parser();
        parser.leftDelimiter = "\#{";
        parser.rightDelimiter = "}";
        res = parser.parseTemplate("\#{name}", {
          name: "John"
        });
        return expect(res).to.equal("John");
      });
      return it('should work with regex reserved characters', function() {
        var parser, res;
        parser = new Parser({
          delimiter: ["(", ")"]
        });
        res = parser.parseTemplate("(name)", {
          name: "John"
        });
        return expect(res).to.equal("John");
      });
    });
    return describe('custom delimiter', function() {
      it('should replace a simple variable', function() {
        var parser, res;
        parser = new Parser();
        res = parser.parseTemplate("\'name\'", {
          name: "John"
        }, {
          delimiter: "\'"
        });
        return expect(res).to.equal("John");
      });
      it('should throw TypeError', function() {
        var err, error, parser, res;
        parser = new Parser();
        try {
          return res = parser.parseTemplate("\'name\'", {
            name: "John"
          }, {
            delimiter: 2
          });
        } catch (error) {
          err = error;
          expect(err.constructor.name).to.be.equal("TypeError");
          return expect(res).to.equal(void 0);
        }
      });
      return it('should work with regex reserved characters', function() {
        var parser, res;
        parser = new Parser();
        res = parser.parseTemplate("(name)", {
          name: "John"
        }, {
          delimiter: ["(", ")"]
        });
        return expect(res).to.equal("John");
      });
    });
  });

}).call(this);

//# sourceMappingURL=test.js.map
