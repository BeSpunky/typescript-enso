import * as vscode from 'vscode';
import * as Messages  from './messages.json';
import { EnsoDebugCommandOrigin } from './enso-debug.command';

export function showNodeNotDebuggableMessage(origin: EnsoDebugCommandOrigin)
{
    const showMessage = origin === 'palette' ? vscode.window.showInformationMessage : vscode.window.showErrorMessage;

    return showMessage(Messages.nodeNotFound[origin]);
}

export function showNodeNotFoundMessage(origin: EnsoDebugCommandOrigin)
{
    const showMessage = origin === 'palette' ? vscode.window.showInformationMessage : vscode.window.showErrorMessage;

    return showMessage(Messages.nodeNotDebuggable[origin]);
}

