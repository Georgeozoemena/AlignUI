figma.showUI(__html__, { width: 400, height: 300 });

figma.ui.onmessage = (msg: { type: string }) => {
  if (msg.type === 'export-tokens') {
    const tokens = extractTokens();
    console.log('Extracted tokens:', JSON.stringify(tokens, null, 2));
    figma.ui.postMessage({ type: 'tokens-ready', tokens });
  }
};

function extractTokens() {
  const tokens: Array<{
    name: string;
    type: 'color' | 'spacing' | 'typography' | 'border-radius';
    value: string;
    source: 'figma';
  }> = [];

  const nodes = figma.currentPage.selection;

  if (nodes.length === 0) {
    figma.notify('Select at least one element first');
    return tokens;
  }

  for (const node of nodes) {
    // Extract fill colors
    if ('fills' in node) {
      const fills = node.fills as Paint[];
      for (const fill of fills) {
        if (fill.type === 'SOLID') {
          const { r, g, b } = fill.color;
          tokens.push({
            name: `${node.name}/color`,
            type: 'color',
            value: rgbToHex(r, g, b),
            source: 'figma',
          });
        }
      }
    }

    // Extract spacing (width/height as proxy for spacing tokens)
    if ('width' in node) {
      tokens.push({
        name: `${node.name}/width`,
        type: 'spacing',
        value: `${node.width}px`,
        source: 'figma',
      });
    }
  }

  return tokens;
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) =>
    Math.round(n * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
