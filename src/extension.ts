import { ExtensionContext } from 'vscode';
import { Registerer } from './types/registerer';
import { registerEnsoTypeHover } from './features/hover/enso-type.hover';
import { registerEnsoDebugCommand } from './features/debug/enso-debug.command';
import { registerEnsoDebugRawContentProvider } from './features/debug/enso-debug-raw.document';

export function activate(context: ExtensionContext)
{
    const providerRegisterers: Registerer[] = [
        registerEnsoTypeHover,
        registerEnsoDebugCommand,
        registerEnsoDebugRawContentProvider
    ];

    context.subscriptions.push(
        ...providerRegisterers.map(register => register(context))
    );
}

