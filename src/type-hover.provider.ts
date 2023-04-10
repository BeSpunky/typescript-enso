import * as vscode from 'vscode';
import * as tsMorph from 'ts-morph';
import { createActionLink } from './utils/commands';

const { ts } = tsMorph;

export default class TypeAliasHoverProvider implements vscode.HoverProvider
{
    constructor(private context: vscode.ExtensionContext) {}

    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover>
    {
        const project = new tsMorph.Project();

        const file = project.addSourceFileAtPath(document.fileName);
        const deps = project.resolveSourceFileDependencies();

        const hoveredPosition = ts.getPositionOfLineAndCharacter(file.compilerNode, position.line, position.character);
        
        const hoveredNode = file.getDescendantAtPos(hoveredPosition);
        
        if (!hoveredNode)
        {
            console.warn(`No decendant was found at the hovered position.`);
            return;
        }

        // TODO: Add interfaces and classes to allow hovering over them and launching debug as well
        const parent =
            hoveredNode.getParentIfKind(ts.SyntaxKind.TypeReference) ??
            hoveredNode.getParentIfKind(ts.SyntaxKind.TypeAliasDeclaration);
        
        if (!parent) return;

        const checker = project.getTypeChecker();

        console.log(parent?.getKindName());

        const hover = new vscode.Hover([
            new vscode.MarkdownString(hoveredNode.compilerNode?.getText()),
            createActionLink('Debug with Enso', 'enso.debug')
        ]);
    
        return hover;
    }
}
