import * as vscode from 'vscode';
import * as tsMorph from 'ts-morph';
import { createActionLink } from '../../utils/commands';
import { Registerer } from '../../types/registerer';
import { printGenericArgs, findNodeAtPosition, isIdentifierNode, isTypeVariable } from '../../utils/typescript';

const { ts } = tsMorph;

export class TypeAliasHoverProvider implements vscode.HoverProvider
{
    constructor(private context: vscode.ExtensionContext) {}

    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover>
    {
        const hoveredNode = findNodeAtPosition(document.fileName, position);        
        
        if (!hoveredNode) return;

        const typeDescription = this.describeNodeIfRelevant(hoveredNode);

        if (!typeDescription) return;
        
        return new vscode.Hover([this.createMarkdown(document.fileName, position, typeDescription)]);
    }

    private describeNodeIfRelevant(node: tsMorph.Node): string | undefined
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

    private createMarkdown(filePath: string, { line, character }: vscode.Position, typeDescription: string): vscode.MarkdownString
    {
        const markdown = new vscode.MarkdownString();

        markdown.isTrusted = true;
        markdown.supportHtml = true;

        const logoUri = vscode.Uri.file(this.context.extensionPath.concat('/assets/logo/wide.png'));

        markdown.appendMarkdown(`![TS Enso](${logoUri})`);
        markdown.appendCodeblock(typeDescription, 'typescript');
        markdown.appendMarkdown(`[Debug with Enso](command:enso.debug?file=${filePath}&line=${line}&char=${character})`);

        return markdown;
    }
}

export const registerEnsoTypeHover: Registerer = (context) =>
    vscode.languages.registerHoverProvider('typescript', new TypeAliasHoverProvider(context));

