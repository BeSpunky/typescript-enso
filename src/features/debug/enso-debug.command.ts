import * as vscode from 'vscode';
import { Registerer } from '../../types/registerer';
import { describeNodeIfGeneric, findNodeAtPosition } from '../../utils/typescript';
import { createCommandUri } from '../../utils/commands';

export const EnsoDebugCommandName = 'enso.debug';
export type EnsoDebugCommandOrigin = 'palette' | 'hover' | 'external';

export default function ensoDebugTypeCommand(context: vscode.ExtensionContext)
{
    return (sourceFilePath: string, line: number, character: number, origin: EnsoDebugCommandOrigin = 'external') =>
    {
        const nodeAtPosition = findNodeAtPosition(sourceFilePath, new vscode.Position(line, character));

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
