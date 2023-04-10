import * as vscode from 'vscode';
import TypeAliasHoverProvider from './type-hover.provider';
import createEnsoDebugTypeCommand from './debug-type.command';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.languages.registerHoverProvider('typescript', new TypeAliasHoverProvider(context)),

        vscode.commands.registerCommand('enso.debug', createEnsoDebugTypeCommand(context))
    );
}

