import * as ts from "typescript";

/**
 * 定义一个简单的 transformer，作用是：
 *  将 import 语句中的模块名改成 `renamed-lib-name`
 */
const RenameTransformerFactory: ts.TransformerFactory<ts.SourceFile> = context => {
  return node => {
    const visitor: ts.Visitor = (node: ts.Node): ts.VisitResult<ts.Node> => {
      if (
        node.parent &&
        ts.isImportDeclaration(node.parent) &&
        node.parent.moduleSpecifier === node
      ) {
        return ts.createStringLiteral("renamed-lib-name");
      }
      return ts.visitEachChild(node, visitor, context);
    };
    return ts.visitNode(node, visitor);
  };
};

// Create the TS program.
const program = ts.createProgram(["src/index.ts"], {
  target: ts.ScriptTarget.ES5,
  module: ts.ModuleKind.CommonJS,
  declaration: true,
  outDir: "lib"
});

// emit compile
const emitResult = program.emit(undefined, undefined, undefined, undefined, {
  before: [RenameTransformerFactory],
  // after: [RenameTransformerFactory],
  afterDeclarations: [RenameTransformerFactory]
});

if (emitResult.emitSkipped) {
  throw new Error(`Emit failed.`);
}

console.log("Done!");
