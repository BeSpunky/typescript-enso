import * as vscode from 'vscode';
import { findNodeAtPosition } from '../../utils/typescript';
import { Registerer } from '../../types/registerer';

export const EnsoDebugRawSchema = 'enso-debug-raw';

export class EnsoDebugRawContentProvider implements vscode.TextDocumentContentProvider
{
    provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string>
    {
        const { path, line, character } = decodeUriParams(uri);

        const node = findNodeAtPosition(path, new vscode.Position(line, character));

        return node?.getParent()?.print() ?? 'No node found. How is this even possible?';
    }
}

export const registerEnsoDebugRawContentProvider: Registerer = (context) =>
    vscode.workspace.registerTextDocumentContentProvider(EnsoDebugRawSchema, new EnsoDebugRawContentProvider());

function decodeUriParams(uri: vscode.Uri): { path: string; line: number; character: number; }
{
    const [path, line, character] = JSON.parse(uri.query);
    
    if (typeof path !== 'string') throw new Error(`Invalid path: ${ path }`);
    if (typeof line !== 'number') throw new Error(`Invalid line: ${ line }`);
    if (typeof character !== 'number') throw new Error(`Invalid character: ${ character }`);

    return { path, line, character };
}

export function encodeUriParams(path: string, { line, character }: vscode.Position): string
{
    return encodeURIComponent(JSON.stringify([path, line, character]));
}