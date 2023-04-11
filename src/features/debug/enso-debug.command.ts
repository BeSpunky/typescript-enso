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
            if (origin === 'hover')
                vscode.window.showErrorMessage('[Enso] Failed to find the node you hovered on. Did the code change while the command was launching?');
            else if (origin === 'palette')
                vscode.window.showInformationMessage('[Enso] No type detected. Put your carret on some type and rerun the command.');
            else
                vscode.window.showErrorMessage('[Enso] Failed to load type debugging. No type was found at the specified position. Did the code change while the link stayed the same?');
            
            return;
        }

        const genericDescription = describeNodeIfGeneric(nodeAtPosition);

        if (genericDescription)
            vscode.window.showInformationMessage(`[Enso] Debugging type '${ genericDescription }'`);
        else
        {
            if (origin === 'hover')
                vscode.window.showErrorMessage(`[Enso] The node you hovered on isn't a debuggable type. Did the code change while the command was launching?`, `Maybe`, `Don't think so`);
            else if (origin === 'palette')
                vscode.window.showInformationMessage(`[Enso] The selected node isn't a debuggable type. Put your carret on some type and rerun the command.`);
            else
                vscode.window.showErrorMessage('[Enso] No debuggable type was found at the specified position. Did the code change while the link stayed the same?');
        }
    };
}

export const registerEnsoDebugCommand: Registerer = (context) =>
    vscode.commands.registerCommand(EnsoDebugCommandName, ensoDebugTypeCommand(context));

export function createEnsoDebugCommandUri(...args: Parameters<ReturnType<typeof ensoDebugTypeCommand>>): vscode.Uri
{
    return createCommandUri(EnsoDebugCommandName, ...args);
}
