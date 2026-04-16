import * as vscode from 'vscode';
import { analyzeFile } from './apiClient';
import { buildDiagnostics } from './diagnostics';

const SUPPORTED_LANGUAGES = ['typescriptreact', 'javascriptreact'];
const diagnosticCollection = vscode.languages.createDiagnosticCollection('alignui');

export function activate(context: vscode.ExtensionContext) {
  console.log('[AlignUI] Extension activated');

  // Command: manually trigger analysis
  const analyzeCommand = vscode.commands.registerCommand('alignui.analyzeFile', () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) runAnalysis(editor.document);
  });

  // Auto-analyze on save
  const onSave = vscode.workspace.onDidSaveTextDocument((doc) => {
    if (SUPPORTED_LANGUAGES.includes(doc.languageId)) {
      runAnalysis(doc);
    }
  });

  context.subscriptions.push(analyzeCommand, onSave, diagnosticCollection);
}

async function runAnalysis(document: vscode.TextDocument) {
  const config = vscode.workspace.getConfiguration('alignui');
  const backendUrl = config.get<string>('backendUrl', 'http://localhost:3000');

  try {
    const result = await analyzeFile(backendUrl, document.getText(), document.fileName);

    const diagnostics = buildDiagnostics(result.issues, document);
    diagnosticCollection.set(document.uri, diagnostics);

    const msg = result.issues.length === 0
      ? `AlignUI: No drift found in ${result.scanned} values scanned.`
      : `AlignUI: ${result.issues.length} drift issue(s) found.`;

    vscode.window.setStatusBarMessage(msg, 5000);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    vscode.window.showWarningMessage(`AlignUI: ${message}`);
  }
}

export function deactivate() {
  diagnosticCollection.dispose();
}
