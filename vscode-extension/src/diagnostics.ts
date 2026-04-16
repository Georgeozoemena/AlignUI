import * as vscode from 'vscode';
import { DriftIssue } from '@alignui/shared';

export function buildDiagnostics(
  issues: DriftIssue[],
  document: vscode.TextDocument
): vscode.Diagnostic[] {
  return issues.map((issue) => {
    const line = Math.max(0, issue.line - 1); // convert to 0-indexed
    const lineText = document.lineAt(line).text;
    const range = new vscode.Range(line, 0, line, lineText.length);

    const diagnostic = new vscode.Diagnostic(
      range,
      `[AlignUI] Design drift on "${issue.tokenName}": expected "${issue.expected}", found "${issue.actual}"`,
      vscode.DiagnosticSeverity.Warning
    );

    diagnostic.source = 'AlignUI';
    diagnostic.code = issue.tokenName;

    return diagnostic;
  });
}
