import * as vscode from 'vscode';
import { Registerer } from '../../types/registerer';
import { describeNodeIfGeneric, findNodeAtPosition } from '../../utils/typescript';
import { createCommandUri } from '../../utils/commands';
import { showNodeNotFoundMessage, showNodeNotDebuggableMessage } from './enso-debug.ui-utils';

export const EnsoDebugCommandName = 'enso.debug';

export type EnsoDebugCommandOrigin = 'palette' | 'hover' | 'external';

export default function ensoDebugTypeCommand(context: vscode.ExtensionContext)
{    
    function attemptToProduceValidArgs(sourceFilePath?: string, line?: number, character?: number): { path: string; position: vscode.Position; }
    {
        if (sourceFilePath && line !== undefined && character !== undefined)
            return { path: sourceFilePath, position: new vscode.Position(line, character) };
        
        const activeEditor = vscode.window.activeTextEditor;

        if (!activeEditor)
            throw new Error(`
                Enso Debug failed to start.
                No source file was specified and there is no active editor.
                Strange... This should've been prevented by the 'when' clause of the contributions section.
            `);
        
        const path = sourceFilePath ?? activeEditor.document.fileName;
        const position = line && character
            ? new vscode.Position(line, character)
            : activeEditor.selection.start;
        
        return { path, position };
    }

    return (sourceFilePath?: string, line?: number, character?: number, origin: EnsoDebugCommandOrigin = 'palette') =>
    {
        const { path, position } = attemptToProduceValidArgs(sourceFilePath, line, character);

        const nodeAtPosition = findNodeAtPosition(path, position);

        if (!nodeAtPosition)
        {
            showNodeNotFoundMessage(origin);
            
            return;
        }

        const genericDescription = describeNodeIfGeneric(nodeAtPosition);

        if (genericDescription)
            vscode.window.showInformationMessage(`[Enso] Debugging type '${ genericDescription }'`);
        else
            showNodeNotDebuggableMessage(origin);
    };
}

export const registerEnsoDebugCommand: Registerer = (context) =>
    vscode.commands.registerCommand(EnsoDebugCommandName, ensoDebugTypeCommand(context));

export function createEnsoDebugCommandUri(...args: Parameters<ReturnType<typeof ensoDebugTypeCommand>>): vscode.Uri
{
    return createCommandUri(EnsoDebugCommandName, ...args);
}
