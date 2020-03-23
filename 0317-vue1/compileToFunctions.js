//编译器内置的配置选项
var baseOptions = {
	expectHTML: true,
	modules: {},
	directives: {},
	isPreTag: {},
	isUnaryTag: {},
	mustUseProp: {},
	canBeLeftOpenTag: {},
	isReservedTag: {},
	getTagNamespace: {},
	staticKeys: {}
};

function createCompileToFunctionFn(compile){
	return function compileToFunctions(template, options, vm){
		 console.log(template)
	}
}

function createCompilerCreator(baseCompile) {
	return function createCompiler(baseOptions) {
		//核心函数
		function compile(template, options) {

		}
		return {
			compile: compile,
			compileToFunctions: createCompileToFunctionFn(compile)
		}
	}
}
//编译器的祖宗
var createCompiler = createCompilerCreator(function baseCompile() {

});

//创建一个编译器
var ref$1 = createCompiler(baseOptions);
var compile = ref$1.compile;
var compileToFunctions = ref$1.compileToFunctions;
