'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var SimpleGenerator = module.exports = function SimpleGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.on('end', function() {
        this.installDependencies({
            skipInstall: options['skip-install']
        });
    });

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(SimpleGenerator, yeoman.generators.Base);

SimpleGenerator.prototype.askFor = function askFor() {
    var cb = this.async();

    // have Yeoman greet the user.
    console.log(this.yeoman);

    var prompts = [{
        type: 'confirm',
        name: 'someOption',
        message: 'Would you like to enable this option?',
        default: true
    }];

    this.prompt(prompts, function(props) {
        this.someOption = props.someOption;

        cb();
    }.bind(this));
};

SimpleGenerator.prototype.app = function app() {

};

SimpleGenerator.prototype.projectfiles = function projectfiles() {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');

    this.mkdir('css');
    this.mkdir('sass');
    this.mkdir('js/src');
    this.mkdir('img');

    this.copy('config.rb', 'config.rb');
    this.copy('index.html', 'index.html');

    this.copy('sass/_common.scss', 'sass/_common.scss');
    this.copy('sass/_footer.scss', 'sass/_footer.scss');
    this.copy('sass/_header.scss', 'sass/_header.scss');
    this.copy('sass/_layout.scss', 'sass/_layout.scss');
    this.copy('sass/_mixins.scss', 'sass/_mixins.scss');
    this.copy('sass/_presentation.scss', 'sass/_presentation.scss');
    this.copy('sass/_rwd.scss', 'sass/_rwd.scss');
    this.copy('sass/_wysiwyg.scss', 'sass/_wysiwyg.scss');
    this.copy('sass/styles.scss', 'sass/styles.scss');

    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
};
