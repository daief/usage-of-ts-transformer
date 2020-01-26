import * as ts from "typescript";

/**
 * 定义一个简单的 transformer，作用是：
 *  - before/afterDeclarations：将 import 语句中的模块名改成 `renamed-lib-name`
 *  - after：将 `"use strict";` 语句改为 `"use strict"; // use strict`
 */
const RenameTransformerFactory: ts.TransformerFactory<ts.SourceFile> = context => {
  return node => {
    const visitor: ts.Visitor = (node: ts.Node): ts.VisitResult<ts.Node> => {
      if (
        node.parent &&
        ts.isImportDeclaration(node.parent) &&
        node.parent.moduleSpecifier === node
      ) {
        // 更新 import
        return ts.createStringLiteral("renamed-lib-name");
      }

      if (
        ts.isExpressionStatement(node) &&
        ts.isStringLiteral(node.expression) &&
        node.expression.text === "use strict"
      ) {
        // 添加注释
        return ts.createIdentifier('"use strict"; // use strict');
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
