import { ExtensionContext, Disposable } from 'vscode';

export interface Registerer
{
    (context: ExtensionContext): Disposable;
}