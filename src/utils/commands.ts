import { MarkdownString, Uri, } from 'vscode';

export function createActionLink(text: string, commandName: string, args?: unknown): MarkdownString
{
    const commandUri = Uri.parse(
        `command:${ commandName }?${ encodeURIComponent(JSON.stringify(args)) }`
    );

    const markdown = new MarkdownString(`[${ text }](${ commandUri })`);
    
    markdown.isTrusted = true;
    markdown.supportThemeIcons = true;

    return markdown;
}

export function createCommandUri<Args extends unknown[]>(commandName: string, ...args: Args): Uri
{
    return Uri.parse(`command:${commandName}?${ encodeURIComponent(JSON.stringify(args)) }`, true);
}