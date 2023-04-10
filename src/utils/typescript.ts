import * as tsMorph from 'ts-morph';
import * as vscode from 'vscode';

const { ts } = tsMorph;

export function findNodeAtPosition(pathToFile: string, position: vscode.Position, project: tsMorph.Project = new tsMorph.Project()): tsMorph.Node<tsMorph.ts.Node> | undefined
{
    const file = project.addSourceFileAtPath(pathToFile);
    // const deps = project.resolveSourceFileDependencies(); // Is this needed?? Can TS deduce token kinds with missing references?

    const positionInFile = ts.getPositionOfLineAndCharacter(file.compilerNode, position.line, position.character);
    
    const nodeAtPosition = file.getDescendantAtPos(positionInFile);

    return nodeAtPosition;
}

export function isIdentifierNode(node: tsMorph.Node): node is tsMorph.Identifier
{
    return ts.isIdentifier(node.compilerNode);
}

export function printGenericArgs(node: tsMorph.Identifier): string | undefined
{
    const siblings = node.getNextSiblings();

    if (
        siblings.length >= 3 &&
        siblings[0].isKind(ts.SyntaxKind.LessThanToken) &&
        siblings[1].isKind(ts.SyntaxKind.SyntaxList) &&
        siblings[2].isKind(ts.SyntaxKind.GreaterThanToken)
    )
    {
        return `<${siblings[1].getText()}>`;
    }
    
    return undefined;
}

export function hasTypeFlags(node: tsMorph.Node, flags: tsMorph.TypeFlags): boolean
{
    const isolatedFlag = node.getType().getFlags() & flags;

    return Boolean(isolatedFlag);
}

export function isTypeVariable(node: tsMorph.Node): boolean
{
    return hasTypeFlags(node, tsMorph.TypeFlags.TypeVariable);
}

export function describeNodeIfGeneric(node: tsMorph.Node): string | undefined
{
    if (!isIdentifierNode(node)) return;

    const tryKindAndPrint = (kind: tsMorph.ts.SyntaxKind, exclude = (parent: tsMorph.Node) => false) =>
    {
        const parent = node.getParentIfKind(kind);

        return parent && !exclude(parent) ? `${node.getText()}${printGenericArgs(node) ?? ''}` : void 0;
    };
    
    return tryKindAndPrint(ts.SyntaxKind.TypeAliasDeclaration)
        ?? tryKindAndPrint(ts.SyntaxKind.TypeReference, isTypeVariable)
        ?? tryKindAndPrint(ts.SyntaxKind.InterfaceDeclaration)
        ?? tryKindAndPrint(ts.SyntaxKind.ClassDeclaration)
        ?? tryKindAndPrint(ts.SyntaxKind.ExpressionWithTypeArguments);
}
