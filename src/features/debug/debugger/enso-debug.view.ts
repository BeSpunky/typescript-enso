// import * as vscode from 'vscode';
// import { Registerer } from '../../../types/registerer';

// export const EnsoDebugViewType = 'enso.debugView';

// export class EnsoDebugView implements vscode.CustomTextEditorProvider
// {
//     constructor(private readonly context: vscode.ExtensionContext) {}
    
//     resolveCustomTextEditor(document: vscode.TextDocument, webviewPanel: vscode.WebviewPanel, token: vscode.CancellationToken): void | Thenable<void>
//     {
//         const { webview } = webviewPanel;

//         webviewPanel.title = 'Enso Debugger';
        
//         webview.options = { enableScripts: true, enableCommandUris: true };
//         webview.html = this.getHtmlForWebview(webviewPanel.webview);
//     }

//     	/**
// 	 * Get the static html used for the editor webviews.
// 	 */
// 	private getHtmlForWebview(webview: vscode.Webview): string {
// 		// // Local path to script and css for the webview
// 		// const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(
// 		// 	this.context.extensionUri, 'media', 'catScratch.js'));

// 		// const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(
// 		// 	this.context.extensionUri, 'media', 'reset.css'));

// 		// const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(
// 		// 	this.context.extensionUri, 'media', 'vscode.css'));

// 		// const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(
// 		// 	this.context.extensionUri, 'media', 'catScratch.css'));

// 		return /* html */`
// 			<!DOCTYPE html>
// 			<html lang="en">
// 			<head>
// 				<meta charset="UTF-8">
// 				<!--
// 				Use a content security policy to only allow loading images from https or from our extension directory,
// 				and only allow scripts that have a specific nonce.
// 				-->
// 				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource}; style-src ${webview.cspSource};;">
// 				<meta name="viewport" content="width=device-width, initial-scale=1.0">
// 				<title>Cat Scratch</title>
// 			</head>
// 			<body>
// 				<div class="notes">
// 					<div class="add-button">
// 						<button>Scratch!</button>
// 					</div>
// 				</div>
				
// 			</body>
// 			</html>`;
// 	}
// }

// export const registerEnsoDebugView: Registerer = (context) =>
//     vscode.window.registerCustomEditorProvider(EnsoDebugViewType, new EnsoDebugView(context));