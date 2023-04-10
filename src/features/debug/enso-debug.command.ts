import * as vscode from 'vscode';
import { Registerer } from '../../types/registerer';

export default function ensoDebugTypeCommand(context: vscode.ExtensionContext)
{
    return (sourceFilePath: string, position: number) =>
    {
        vscode.window.showInformationMessage('message');
    };
}

export const registerEnsoDebugCommand: Registerer = (context) =>
    vscode.commands.registerCommand('enso.debug', ensoDebugTypeCommand(context));
