import * as vscode from 'vscode';
import { Registerer } from './types/registerer';
import { registerEnsoTypeHover } from './features/hover/enso-type.hover';
import { registerEnsoDebugCommand } from './features/debug/enso-debug.command';

export function activate(context: vscode.ExtensionContext)
{
    const providerRegisterers: Registerer[] = [
        registerEnsoTypeHover,
        registerEnsoDebugCommand
    ];

    context.subscriptions.push(
        ...providerRegisterers.map(register => register(context))
    );
}

