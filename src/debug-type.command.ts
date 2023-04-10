import * as vscode from 'vscode';

export default function createEnsoDebugTypeCommand(context: vscode.ExtensionContext)
{
    return () =>
    {
        vscode.window.showInformationMessage('message');
    };
}