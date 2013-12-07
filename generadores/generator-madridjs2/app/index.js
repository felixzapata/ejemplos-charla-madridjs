'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var Madridjs2Generator = module.exports = function Madridjs2Generator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.on('end', function() {
        this.installDependencies({
            skipInstall: options['skip-install']
        });

        // this.installDependencies({ bower:false, npm:true })

    });

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(Madridjs2Generator, yeoman.generators.Base);

Madridjs2Generator.prototype.askFor = function askFor() {
    var cb = this.async();

    // have Yeoman greet the user.
    console.log(this.yeoman);

    var prompts = [{
        type: 'input',
        name: 'componentName',
        message: '¿Cómo quieres llamarme?'
    }, {
        type: 'input',
        name: 'author',
        message: '¿Cómo te llamas tú?'
    }, {
        type: 'checkbox',
        name: 'features',
        message: '¿Qué más dependencias necesitas?',
        choices: [{
            name: 'jQuery',
            value: 'includejQueryDependency',
            checked: false
        }, {
            name: 'Lodash',
            value: 'includeLodashDependency',
            checked: false
        }]
    }, ];

    this.prompt(prompts, function(answers) {

        var features = answers.features;

        function hasFeatures(feat) {
            return features.indexOf(feat) !== -1;
        }

        this.componentName = this._.slugify(answers.componentName);
        this.author = answers.author;

        this.includejQueryDependency = hasFeatures('includejQueryDependency');
        this.includeLodashDependency = hasFeatures('includeLodashDependency');

        cb();


    }.bind(this));
};

Madridjs2Generator.prototype.app = function app() {
    this.mkdir('images');
    this.mkdir('scripts/src');
    this.mkdir('scss');
    this.mkdir('templates/includes');
    this.mkdir('templates/layouts');

    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
    this.copy('_Gruntfile.js', 'Gruntfile.js');

    this.copy('scss/_common.scss', 'scss/_common.scss');
    this.copy('scss/_footer.scss', 'scss/_footer.scss');
    this.copy('scss/_header.scss', 'scss/_header.scss');
    this.copy('scss/_layout.scss', 'scss/_layout.scss');
    this.copy('scss/_mixins.scss', 'scss/_mixins.scss');
    this.copy('scss/_presentation.scss', 'scss/_presentation.scss');
    this.copy('scss/_rwd.scss', 'scss/_rwd.scss');
    this.copy('scss/_wysiwyg.scss', 'scss/_wysiwyg.scss');
    this.copy('scss/styles.scss', 'scss/styles.scss');

    this.copy('images/bck_back.png', 'images/bck_back.png');
    this.copy('images/bck_dest-ico.png', 'images/bck_dest-ico.png');
    this.copy('images/bck_dot.png', 'images/bck_dot.png');
    this.copy('images/bck_header.png', 'images/bck_header.png');

    this.copy('templates/index.jade', 'templates/index.jade');
    this.copy('templates/layouts/col2layout.jade', 'templates/layouts/col2layout.jade');
    this.copy('templates/layouts/layout.jade', 'templates/layouts/layout.jade');
    this.copy('templates/includes/aside.jade', 'templates/includes/aside.jade');
    this.copy('templates/includes/footer.jade', 'templates/includes/footer.jade');
    this.copy('templates/includes/head.jade', 'templates/includes/head.jade');
    this.copy('templates/includes/header.jade', 'templates/includes/header.jade');
    this.copy('templates/includes/scripts.jade', 'templates/includes/scripts.jade');

    this.copy('images/bck_dot.png', 'images/bck_dot.png');
    this.copy('images/bck_header.png', 'images/bck_header.png');

    this.template('scripts/src/base.js', this._.template('scripts/src/<%= name %>.js', {'name': this.componentName}));


};

Madridjs2Generator.prototype.projectfiles = function projectfiles() {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
    this.copy('gitignore', '.gitignore');
    this.copy('bowerrc', '.bowerrc');
};

Madridjs2Generator.prototype.writeScriptsTemplate = function writeScriptsTemplate() {

    var scriptTemplate = this.readFileAsString(path.join(this.sourceRoot(), '/templates/includes/scripts.jade'));
    var contentText = [];

    var that = this;

    function pushContent(scriptFilePath) {
        contentText.push(that._.template(scriptTemplate, {
            'scriptPath': scriptFilePath
        }));
    }

    if (this.includejQueryDependency) {
        pushContent('bower_components/jquery/jquery.js');
    }

    if (this.includeLodashDependency) {
        pushContent('bower_components/lodash/dist/lodash.js');
    }

    this.write('templates/includes/scripts.jade', contentText.join('\n'));
};
